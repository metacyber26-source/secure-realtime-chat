import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { createClient } from "@/lib/supabase/server";
import { strictLimiter } from "@/lib/ratelimit";
import { verifyTurnstileToken } from "@/lib/turnstile";

// Schema Validasi + Sanitasi Input (Anti XSS)
const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z
    .string()
    .min(1, "Pesan tidak boleh kosong")
    .max(2000, "Pesan melebihi batas karakter")
    .transform((val) =>
      sanitizeHtml(val, {
        allowedTags: [], // Strip seluruh tag HTML
        allowedAttributes: {},
      })
    ),
  turnstileToken: z.string().min(1, "Token bot guard diperlukan"),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  // 1. Rate Limiting Check
  const { success: rateLimitSuccess } = await strictLimiter.limit(`msg_${ip}`);
  if (!rateLimitSuccess) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Silakan tunggu sebentar." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsedData = sendMessageSchema.parse(body);

    // 2. Turnstile Bot Check
    const isHuman = await verifyTurnstileToken(parsedData.turnstileToken, ip);
    if (!isHuman) {
      return NextResponse.json(
        { error: "Verifikasi Bot Gagal." },
        { status: 403 }
      );
    }

    // 3. Auth Check via Supabase
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 4. Database Insert (RLS akan memvalidasi apakah user berhak memasukkan pesan)
    const { data, error: dbError } = await supabase
      .from("messages")
      .insert({
        conversation_id: parsedData.conversationId,
        sender_id: user.id,
        content: parsedData.content,
      })
      .select()
      .single();

    if (dbError) {
      return NextResponse.json(
        { error: "Akses ditolak atau kesalahan database." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Input tidak valid", details: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

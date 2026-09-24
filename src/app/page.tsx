// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-950 text-white">
      <h1 className="text-4xl font-bold mb-4">Secure Real-time Chat</h1>
      <p className="text-slate-400 mb-8">Aplikasi Chatting Aman & Modern</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
        >
          Masuk / Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition"
        >
          Daftar / Register
        </Link>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface ChatBoxProps {
  conversationId: string;
  currentUserId: string;
}

export default function ChatBox({ conversationId, currentUserId }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const supabase = createClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Fetch initial messages
    const fetchInitialMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);
    };

    fetchInitialMessages();

    // 2. Realtime Subscription untuk Pesan Baru
    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      // 3. Presence / Typing Indicator
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const activeTyping: string[] = [];
        for (const key in state) {
          const presence = state[key][0] as { user_id: string; isTyping: boolean };
          if (presence.isTyping && presence.user_id !== currentUserId) {
            activeTyping.push(presence.user_id);
          }
        }
        setTypingUsers(activeTyping);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase, currentUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[500px] border rounded-lg p-4 bg-slate-900 text-white">
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs break-words ${
                  isMe ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Typing Indicator Status */}
      {typingUsers.length > 0 && (
        <div className="text-xs text-slate-400 italic my-1">
          Seseorang sedang mengetik...
        </div>
      )}
    </div>
  );
}

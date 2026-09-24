# 🛡️ Secure Real-time Chat App

A modern, scalable, and highly secure real-time messaging application built with Next.js (App Router), Supabase, Upstash Redis, and Cloudflare Turnstile. Designed with a **Defense-in-Depth** security architecture to prevent bot registrations, rate abuse, XSS, and unauthorized data access.

---

## ✨ Features

- **Authentication & Authorization**: Email/Password and Magic Link login via Supabase Auth.
- **Real-Time Messaging**: Instant message delivery and status updates using Supabase Realtime Subscriptions.
- **Presence & Typing Indicator**: Live feedback when other users in the conversation are typing.
- **Bot Protection**: Integration with Cloudflare Turnstile on sensitive forms and API routes.
- **Rate Limiting**: Sliding window rate limiting powered by Upstash Redis to prevent brute-force attacks and spamming.
- **Data Protection (RLS)**: PostgreSQL Row Level Security policies ensuring users can only read/write messages in conversations they belong to.
- **Input Sanitization**: Server-side validation and HTML stripping via Zod and `sanitize-html` to prevent XSS and injection attacks.
- **Security Headers**: Custom Content Security Policy (CSP) and HTTP security headers configured in Next.js.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime)
- **Rate Limiting**: [Upstash Redis](https://upstash.com/)
- **Bot Defense**: [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📁 Project Structure

```text
secure-realtime-chat/
├── src/
│   ├── app/                  # Next.js App Router (Routes & Server Actions)
│   │   ├── (auth)/           # Authentication pages (Login, Register)
│   │   ├── (chat)/           # Protected Chat application routes
│   │   └── api/              # Secure API Endpoints
│   ├── components/           # UI & React Components
│   ├── lib/                  # Utilities (Supabase, Upstash Rate Limiter, Turnstile)
│   ├── types/                # Database & TypeScript definitions
│   └── middleware.ts         # Global Route Guard
├── .env.example              # Environment variables template
├── next.config.mjs           # Next.js config (HTTP Security Headers)
└── README.md

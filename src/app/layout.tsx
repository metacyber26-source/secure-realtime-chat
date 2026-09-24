import React from "react";

export const metadata = {
  title: "Secure Real-time Chat",
  description: "Aplikasi Chatting Aman dan Scalable",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0, fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}

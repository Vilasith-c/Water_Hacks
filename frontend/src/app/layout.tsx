import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Enterprise Collab Platform",
  description: "Secure AI-powered enterprise collaboration platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}

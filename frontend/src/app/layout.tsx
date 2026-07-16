/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "NEXORA | Secure Document Intelligence",
  description: "Secure AI-powered document intelligence and enterprise collaboration.",
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

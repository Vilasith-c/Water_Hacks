"use client";

import { Loader2 } from "lucide-react";
import DashboardApp from "@/components/DashboardApp";
import LandingPage from "@/components/LandingPage";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-gold-400" />
          <p className="text-sm font-bold text-zinc-500">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return user?.uid ? <DashboardApp /> : <LandingPage />;
}

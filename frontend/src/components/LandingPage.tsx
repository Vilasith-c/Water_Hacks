"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Fingerprint,
  LockKeyhole,
  MessageSquareCode,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

const navItems = ["Product", "Security", "AI Gateway", "Pricing"];

const workflowItems = [
  { title: "Project intake", detail: "Route documents into the right workspace with owners and due dates." },
  { title: "Policy intelligence", detail: "Ask questions across files while preserving access boundaries." },
  { title: "Audit evidence", detail: "Track approvals, restores, shares, and AI actions in one timeline." },
];

const activityRows = [
  ["09:21", "Uploaded", "Employee_Handbook.pdf", "Internal"],
  ["09:24", "Approved", "Leave_Policy_v2.docx", "HR"],
  ["10:00", "Audited", "Access rules engine", "Secure"],
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <section className="relative min-h-screen px-5 py-5 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(205,157,57,0.16),transparent_34%),linear-gradient(90deg,rgba(8,145,178,0.08),transparent_55%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />

        <div className="relative mx-auto flex min-h-[calc(100vh-40px)] max-w-7xl flex-col rounded-lg border border-white/10 bg-[#080808]/84 shadow-2xl shadow-black/60 backdrop-blur">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
            <Link href="/" className="flex items-center gap-3" aria-label="NEXORA home">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-gold-400/30 bg-gold-400/10 text-gold-300">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <span className="text-sm font-black tracking-[0.22em] text-white">NEXORA</span>
            </Link>

            <nav className="hidden items-center gap-7 text-sm font-semibold text-zinc-400 md:flex">
              {navItems.map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="transition hover:text-white">
                  {item}
                </a>
              ))}
            </nav>

            <Link
              href="/sign-in"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-gold-500 px-4 text-sm font-black text-black shadow-[0_0_24px_rgba(205,157,57,0.22)] transition hover:bg-gold-400"
            >
              Access Workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </header>

          <div className="grid flex-1 items-center gap-10 px-5 py-10 sm:px-7 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-12">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <h1 className="font-display text-5xl leading-[0.94] text-white sm:text-6xl lg:text-7xl">
                Secure document intelligence for teams that move faster than approvals.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400 sm:text-lg">
                One workspace for projects, policy documents, AI answers, and audit-ready collaboration.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sign-in"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-black text-black transition hover:bg-gold-100"
                >
                  Access Workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#workflow"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/15 px-5 text-sm font-bold text-white transition hover:border-gold-400/50 hover:bg-white/5"
                >
                  View workflow
                  <Workflow className="h-4 w-4 text-gold-300" />
                </a>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-y border-white/10 py-5">
                {[
                  ["24/7", "Audit trace"],
                  ["BYOK", "AI gateway"],
                  ["SOC2", "Ready controls"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="font-display text-3xl text-gold-200">{value}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12, duration: 0.7, ease: "easeOut" }}
              className="relative"
            >
              <div className="rounded-lg border border-white/12 bg-[#0d0d0d] shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-gold-300">Workspace command</p>
                    <p className="mt-1 text-sm font-bold text-white">Enterprise Workspace</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-100">
                    <span className="h-2 w-2 rounded-full bg-cyan-300" />
                    Gemini AI Active
                  </div>
                </div>

                <div className="grid gap-4 p-4 lg:grid-cols-[0.72fr_1fr]">
                  <div className="space-y-3">
                    {[
                      ["Projects", "12", "Active workstreams"],
                      ["Documents", "486", "Indexed policies"],
                      ["Folders", "74", "Permission scoped"],
                    ].map(([label, value, detail]) => (
                      <div key={label} className="rounded-md border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">{label}</p>
                        <div className="mt-2 flex items-end justify-between">
                          <span className="font-display text-4xl text-white">{value}</span>
                          <CheckCircle2 className="h-5 w-5 text-gold-300" />
                        </div>
                        <p className="mt-2 text-xs font-semibold text-zinc-500">{detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-md border border-white/10 bg-[#050505]">
                    <div className="flex items-center gap-3 border-b border-white/10 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-400/10 text-gold-200">
                        <FileSearch className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">Policy answer source map</p>
                        <p className="text-xs font-semibold text-zinc-500">References 7 files across HR and Legal</p>
                      </div>
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="rounded-md border border-gold-300/20 bg-gold-300/10 p-4">
                        <p className="text-sm leading-6 text-zinc-200">
                          Employees can request remote work extensions after manager approval and HR policy review.
                        </p>
                      </div>
                      <div className="space-y-2">
                        {activityRows.map(([time, action, item, tag]) => (
                          <div key={`${time}-${item}`} className="grid grid-cols-[48px_82px_1fr_68px] items-center gap-2 rounded-md border border-white/8 bg-white/[0.025] px-3 py-2 text-xs">
                            <span className="font-bold text-zinc-500">{time}</span>
                            <span className="font-bold text-cyan-200">{action}</span>
                            <span className="truncate text-zinc-300">{item}</span>
                            <span className="text-right font-bold text-gold-200">{tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="workflow" className="border-t border-white/10 bg-[#080808] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1fr]">
            <div>
              <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">
                Built for approvals, answers, and evidence in the same flow.
              </h2>
              <p className="mt-5 text-base leading-7 text-zinc-400">
                NEXORA keeps sensitive collaboration close to the work: document routing, AI responses, version history, and access decisions all land in the same operational surface.
              </p>
            </div>
            <div className="grid gap-3">
              {workflowItems.map((item, index) => (
                <div key={item.title} className="grid grid-cols-[48px_1fr] gap-4 rounded-lg border border-white/10 bg-white/[0.025] p-5">
                  <span className="font-display text-3xl text-gold-200">0{index + 1}</span>
                  <div>
                    <h3 className="text-base font-black text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="security" className="border-t border-white/10 px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {[
            [LockKeyhole, "Scoped access", "Project, department, document, and folder-level controls."],
            [MessageSquareCode, "Provider choice", "Bring your own AI key and route requests through governed settings."],
            [Fingerprint, "Immutable logs", "Every upload, share, approval, restore, and AI action stays traceable."],
          ].map(([Icon, title, detail]) => (
            <div key={title as string} className="rounded-lg border border-white/10 bg-[#0b0b0b] p-6">
              <Icon className="h-6 w-6 text-gold-300" />
              <h3 className="mt-5 text-lg font-black text-white">{title as string}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-500">{detail as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-t border-white/10 bg-[#080808] px-5 py-16 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-lg border border-gold-300/20 bg-gold-300/10 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-4xl text-white">Ready for a secure workspace?</h2>
            <p className="mt-2 text-sm font-semibold text-zinc-400">Sign in to open the dashboard, configure AI providers, and start organizing documents.</p>
          </div>
          <Link href="/sign-in" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-gold-500 px-5 text-sm font-black text-black transition hover:bg-gold-400">
            Access Workspace
            <Sparkles className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

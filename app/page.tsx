"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* Layered Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.2),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.15),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold tracking-tight">
            GRID
          </div>

          <div className="flex gap-6 items-center">
            <Link href="/login" className="text-white/60 hover:text-white transition">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-white text-black px-5 py-2.5 rounded-2xl font-medium hover:scale-105 transition-transform duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Hero */}
        <section className="mt-32 text-center">

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight"
          >
            The AI Command Center
            <br />
            for Modern Agencies
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-8 text-xl text-white/60 max-w-3xl mx-auto"
          >
            Real-time operational visibility. Intelligent workload allocation.
            Executive-level control powered by AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-10 flex justify-center gap-6"
          >
            <Link
              href="/signup"
              className="bg-white text-black px-8 py-4 rounded-2xl font-medium text-lg hover:scale-105 transition-transform"
            >
              Start Free
            </Link>

            <Link
              href="/login"
              className="border border-white/20 px-8 py-4 rounded-2xl text-lg hover:bg-white/5 transition"
            >
              View Dashboard
            </Link>
          </motion.div>

        </section>

        {/* Feature Section */}
        <section className="mt-40 grid md:grid-cols-3 gap-8">

          <Feature
            title="Traffic Intelligence"
            desc="Monitor team utilization, overload risk, and deadline pressure in real time."
          />

          <Feature
            title="Executive Visibility"
            desc="CEO-level dashboards showing agency health and operational bottlenecks."
          />

          <Feature
            title="AI Allocation"
            desc="Smart task reassignment suggestions based on real workload data."
          />

        </section>

        <footer className="mt-40 text-center text-white/40 text-sm">
          © {new Date().getFullYear()} The Nest Technologies
        </footer>

      </div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8"
    >
      <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-4 text-white/60 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

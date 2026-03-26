"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Navigation, Zap, CreditCard, BarChart3, Shield } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  {
    title: "Smart Search",
    icon: Search,
    color: "bg-blue-900/50 text-blue-400",
    desc: "Find nearby parking instantly with AI-powered recommendations based on your destination.",
  },
  {
    title: "Live Map Navigation",
    icon: Navigation,
    color: "bg-indigo-900/50 text-indigo-400",
    desc: "Interactive map with real-time parking markers and turn-by-turn directions.",
  },
  {
    title: "Real-time Availability",
    icon: Zap,
    color: "bg-amber-900/50 text-amber-400",
    desc: "Live parking status updates every 30 seconds so you always have accurate information.",
  },
  {
    title: "Easy Booking",
    icon: CreditCard,
    color: "bg-green-900/50 text-green-400",
    desc: "Reserve and pay instantly with UPI, cards, or digital wallets. QR entry included.",
  },
  {
    title: "Smart Analytics",
    icon: BarChart3,
    color: "bg-purple-900/50 text-purple-400",
    desc: "Parking heatmaps and demand forecasting help you plan your trips better.",
  },
  {
    title: "Safe & Secure",
    icon: Shield,
    color: "bg-rose-900/50 text-rose-400",
    desc: "All listed parking lots are verified with CCTV and security coverage details.",
  },
];

export default function DarkGrid() {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs tracking-widest text-blue-400 font-semibold uppercase">[ FEATURES ]</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Everything you need to park smarter
        </h1>
        <p className="text-gray-500 mt-4 text-lg max-w-2xl">
          ParkNav combines real-time data, smart routing, and seamless booking into one powerful app.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, icon: Icon, color, desc }, i) => (
            <Card
              key={title}
              className="group relative overflow-visible border-zinc-800 bg-gradient-to-b from-zinc-950/60 to-zinc-950/30 p-0 transition-colors duration-300 hover:border-zinc-700"
            >
              {/* subtle gradient on hover */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
              </div>

              {/* faint inner glow that appears on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 to-white/0 group-hover:from-white/[0.03] group-hover:to-white/[0.06] transition-colors" />

              {/* white corner squares on hover - now outside the card and square shaped */}
              <div className="pointer-events-none absolute inset-0 hidden group-hover:block">
                <div className="absolute -left-2 -top-2 h-3 w-3 bg-white" />
                <div className="absolute -right-2 -top-2 h-3 w-3 bg-white" />
                <div className="absolute -left-2 -bottom-2 h-3 w-3 bg-white" />
                <div className="absolute -right-2 -bottom-2 h-3 w-3 bg-white" />
              </div>

              <CardHeader className="relative z-10 flex flex-row items-start gap-3 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
                  <Icon size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-medium text-zinc-100">
                      {title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 px-6 pb-6 text-sm text-zinc-400">
                {desc}
              </CardContent>

              {/* focus ring accent on hover */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-white/0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

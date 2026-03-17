"use client";

import { motion } from "framer-motion";

export default function LoadingScreen({ message = "Memuat materi..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-dark ks-grid-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 p-8 relative z-10">
        <motion.div
          className="relative w-20 h-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          {/* A cool spinner, maybe 4 circles rotating */}
          <motion.span
            className="absolute top-0 left-0 w-8 h-8 bg-yellow border-2 border-dark rounded-full shadow-[2px_2px_0px_#ffffff]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.span
            className="absolute top-0 right-0 w-8 h-8 bg-purple border-2 border-dark rounded-full shadow-[2px_2px_0px_#ffffff]"
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.span
            className="absolute bottom-0 right-0 w-8 h-8 bg-green border-2 border-dark rounded-full shadow-[2px_2px_0px_#ffffff]"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.span
            className="absolute bottom-0 left-0 w-8 h-8 bg-orange border-2 border-dark rounded-full shadow-[2px_2px_0px_#ffffff]"
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
        <motion.div
          className="bg-dark/80 px-6 py-3 rounded-2xl border-2 border-white/20 shadow-[4px_4px_0px_#ffffff]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-white font-bold tracking-widest uppercase text-sm animate-pulse">{message}</p>
        </motion.div>
      </div>
    </div>
  );
}

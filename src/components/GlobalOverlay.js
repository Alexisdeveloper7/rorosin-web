"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function GlobalOverlay({ isVisible, onClick }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClick}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}
    </AnimatePresence>
  );
}
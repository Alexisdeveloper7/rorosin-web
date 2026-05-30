"use client";

import { useToast } from "@/context/ToastContext";
import { AnimatePresence, motion } from "framer-motion";

export default function Toast() {
  const { toast } = useToast();

  return (
    <div className="w-full flex justify-center pointer-events-none px-4">
      <AnimatePresence mode="popLayout">
        {toast && (
          <motion.div
            key="toast"
            initial={{ y: -10, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="
              flex items-start gap-2
              w-fit
              max-w-[92vw]
              sm:max-w-md
              px-5 py-3
              bg-white
              border-b border-gray-100
              shadow-sm
              rounded-b-xl
              text-gray-800 text-sm font-medium
              leading-relaxed
              whitespace-normal
              break-words
            "
          >
            <span
              className={
                toast.type === "success"
                  ? "text-green-600 pt-[2px] shrink-0"
                  : toast.type === "error"
                  ? "text-red-600 pt-[2px] shrink-0"
                  : "text-gray-600 pt-[2px] shrink-0"
              }
            >
              ●
            </span>

            <span className="min-w-0">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
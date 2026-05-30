"use client";

import { UserProvider } from "@/context/UserContext";
import { CarritoProvider } from "@/context/CarritoContext";
import { ToastProvider } from "@/context/ToastContext";

export default function AppProvider({ children }) {
  return (
    <ToastProvider>
      <UserProvider>
        <CarritoProvider>
          {children}
        </CarritoProvider>
      </UserProvider>
    </ToastProvider>
  );
}
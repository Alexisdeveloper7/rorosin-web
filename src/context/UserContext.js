"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import LoginModal from "@/components/ModalLogin";
import SignupModal from "@/components/ModalSignup";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modales globales
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  // 🔹 FUNCIONES MODALES
  const openLoginModal = (message = "") => {
    setSignupModalOpen(false);
    setLoginMessage(typeof message === "string" ? message : "");
    setLoginModalOpen(true);
  };
  const closeLoginModal = () => {
    setLoginModalOpen(false);
    setLoginMessage("");
  };
  const openSignupModal = () => setSignupModalOpen(true);
  const closeSignupModal = () => setSignupModalOpen(false);

  // 🔹 LOGIN
  const login = async (usuario, contrasena) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ usuario, contrasena }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Usuario o contraseña incorrectos" };
      }

      // ✅ Actualizamos usuario pero NO cerramos el modal aquí
      setUser(data.user);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message || "Error inesperado" };
    } finally {
      setLoading(false);
    }
  };

  // 🔹 LOGOUT
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // 🔹 SIGNUP
  const signup = async (usuario, contrasena) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ usuario, contrasena }),
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("Respuesta inesperada de signup:", await res.text());
        return { success: false, message: "Error inesperado del servidor" };
      }

      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Ya hay una cuenta creada con este nombre de usuario, intenta con otro nombre" };
      }

      closeSignupModal();
      setTimeout(() => {
        openLoginModal(typeof data.message === "string" ? data.message : "Cuenta creada correctamente. ¡Inicia sesión!");
      }, 50);

      return { success: true, message: data.message };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, message: error.message || "Error inesperado" };
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Persistencia de sesión
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/me", { method: "GET", credentials: "include" });
        const data = await res.json();
        if (res.ok && data.success) setUser(data.user);
      } catch (err) {
        console.error("Fetch session error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signup,
        loginModalOpen,
        signupModalOpen,
        loginMessage,
        openLoginModal,
        closeLoginModal,
        openSignupModal,
        closeSignupModal,
      }}
    >
      {children}

      {/* MODAL LOGIN */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={closeLoginModal}
        onOpenSignup={openSignupModal} 
        initialMessage={loginMessage}        
      />

      {/* MODAL SIGNUP */}
      <SignupModal
        isOpen={signupModalOpen}
        onClose={closeSignupModal}
      />
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
}
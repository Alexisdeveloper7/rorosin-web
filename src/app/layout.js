"use client";

import "./globals.css";
import AppProvider from "@/components/AppProvider";
import { useUser } from "@/context/UserContext";
import GlobalOverlay from "@/components/GlobalOverlay";

// Wrapper para mostrar overlay global de modales de usuario
function UserOverlay() {
  const {
    loginModalOpen,
    signupModalOpen,
    closeLoginModal,
    closeSignupModal
  } = useUser();

  const overlayVisible = loginModalOpen || signupModalOpen;

  const handleClickOverlay = () => {
    if (loginModalOpen) closeLoginModal();
    if (signupModalOpen) closeSignupModal();
  };

  return (
    <GlobalOverlay
      isVisible={overlayVisible}
      onClick={handleClickOverlay}
    />
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>QuickCart</title>
        <link rel="icon" href="/icone.png" />
      </head>

      <body className="bg-re min-h-screen flex flex-col">
        <AppProvider>
          <UserOverlay />
          <main className="flex flex-1 flex-col">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
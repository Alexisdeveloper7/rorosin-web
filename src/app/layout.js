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

        <meta
          name="description"
          content="Tienda online de demostración creada para presentar mis habilidades en desarrollo web."
        />

        <meta property="og:title" content="QuickCart | Tienda online demo" />
        <meta
          property="og:description"
          content="Tienda online de demostración creada para presentar mis habilidades en desarrollo web."
        />
        <meta property="og:url" content="https://alexissanchez.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://alexissanchez.vercel.app/iconoo.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="QuickCart | Tienda online demo" />
        <meta
          name="twitter:description"
          content="Tienda online de demostración creada para presentar mis habilidades en desarrollo web."
        />
        <meta name="twitter:image" content="https://alexissanchez.vercel.app/iconoo.png" />

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
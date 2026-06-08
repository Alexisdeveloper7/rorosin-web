"use client";

import "./globals.css";
import AppProvider from "@/components/AppProvider";
import { useUser } from "@/context/UserContext";
import GlobalOverlay from "@/components/GlobalOverlay";

function UserOverlay() {
  const {
    loginModalOpen,
    signupModalOpen,
    closeLoginModal,
    closeSignupModal,
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
    <html lang="es" className="h-full">
      <head>
        <title>QuickCart | Miguel Alexis Sánchez Carranza</title>

        <meta
          name="description"
          content="Portafolio y tienda online de demostración con carrito y experiencia de compra sin ventas reales."
        />

        <meta
          property="og:title"
          content="QuickCart | Miguel Alexis Sánchez Carranza"
        />

        <meta
          property="og:description"
          content="Portafolio y tienda online de demostración con carrito y experiencia de compra sin ventas reales."
        />

        <meta property="og:url" content="https://alexissanchez.vercel.app" />
        <meta property="og:type" content="website" />

        <meta
          property="og:image"
          content="https://alexissanchez.vercel.app/iconoo.png"
        />

        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="QuickCart" />

        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="QuickCart | Miguel Alexis Sánchez Carranza"
        />

        <meta
          name="twitter:description"
          content="Portafolio y tienda online de demostración con carrito y experiencia de compra sin ventas reales."
        />

        <meta
          name="twitter:image"
          content="https://alexissanchez.vercel.app/iconoo.png"
        />

        <link rel="icon" href="/icone.png" />
      </head>

      <body className="bg-re min-h-screen flex flex-col">
        <AppProvider>
          <UserOverlay />

          <main className="flex flex-1 flex-col">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
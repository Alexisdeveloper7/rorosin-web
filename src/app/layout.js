"use client"; // necesario porque usamos hooks

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppProvider from "@/components/AppProvider";
import { UserProvider, useUser } from "@/context/UserContext";
import { CarritoProvider } from "@/context/CarritoContext";
import GlobalOverlay from "@/components/GlobalOverlay";

// ⚡ Wrapper para mostrar overlay global de modales de usuario
function UserOverlay() {
  const { loginModalOpen, signupModalOpen, closeLoginModal, closeSignupModal } = useUser();

  const overlayVisible = loginModalOpen || signupModalOpen;

  const handleClickOverlay = () => {
    if (loginModalOpen) closeLoginModal();
    if (signupModalOpen) closeSignupModal();
  };

  return <GlobalOverlay isVisible={overlayVisible} onClick={handleClickOverlay} />;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Rorosin</title>
        <link rel="icon" href="/iconoo.png" />
      </head>
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <AppProvider>
          {/* ⚠ UserProvider envuelve todo lo que use useUser */}
          <UserProvider>
            <CarritoProvider>
              {/* Overlay global dentro del provider */}
              <UserOverlay />

              <Header />
              <main className="flex flex-1 flex-col">{children}</main>
              <Footer />
            </CarritoProvider>
          </UserProvider>
        </AppProvider>
      </body>
    </html>
  );
}
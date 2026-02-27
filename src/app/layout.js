"use client"; // necesario porque vamos a usar useUser()

import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppProvider from "@/components/AppProvider";
import { UserProvider, useUser } from "@/context/UserContext";
import { CarritoProvider } from "@/context/CarritoContext";
import GlobalOverlay from "@/components/GlobalOverlay";

// Componente interno para manejar overlay global
function GlobalOverlayWrapper() {
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
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <AppProvider>
          <UserProvider>
            <CarritoProvider>
              {/* Overlay global */}
              <GlobalOverlayWrapper />

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
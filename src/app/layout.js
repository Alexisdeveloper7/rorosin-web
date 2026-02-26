import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppProvider from "@/components/AppProvider";
import { UserProvider } from "@/context/UserContext";
import { CarritoProvider } from "@/context/CarritoContext";

export const metadata = {
  title: "My App",
  description: "Auth modal system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <AppProvider>
          <UserProvider>
            <CarritoProvider>
              <Header />

              <main className="flex flex-1 flex-col">
                {children}
              </main>

              <Footer />
            </CarritoProvider>
          </UserProvider>
        </AppProvider>
      </body>
    </html>
  );
}
import "./globals.css";

import AppProvider from "@/components/AppProvider";

const title = "QuickCart | Miguel Alexis Sánchez Carranza";

const description =
  "Portafolio y tienda online de demostración con carrito y experiencia de compra sin ventas reales.";

export const metadata = {
  title,
  description,

  icons: {
    icon: "/icone.png",
  },

  openGraph: {
    title,
    description,
    url: "https://alexissanchez.vercel.app",
    type: "website",
    images: [
      {
        url: "https://alexissanchez.vercel.app/iconooo.png",
        width: 1200,
        height: 630,
        alt: "QuickCart",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://alexissanchez.vercel.app/iconooo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="min-h-full bg-[#09060f]">
      <body className="min-h-screen bg-[#09060f]">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
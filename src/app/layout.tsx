import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { ServiceWorker } from "@/components/layout/ServiceWorker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Football IQ — Learn football like a coach",
  description:
    "Master tactics, systems and game reading interactively. The Chess.com of football.",
  applicationName: "Football IQ",
  keywords: ["football", "tactics", "coaching", "soccer IQ", "formations"],
  metadataBase: new URL("https://football-iq.app"),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Football IQ",
  },
  openGraph: {
    title: "Football IQ — Aprende fútbol como un entrenador",
    description:
      "Domina tácticas, sistemas y lectura de juego de forma interactiva. El Chess.com del fútbol.",
    type: "website",
    locale: "es_ES",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Football IQ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Football IQ — Aprende fútbol como un entrenador",
    description:
      "Domina tácticas, sistemas y lectura de juego de forma interactiva.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">
        <AuthProvider>{children}</AuthProvider>
        <ServiceWorker />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, Amiri } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import InstallPrompt from "../components/InstallPrompt";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Haditha - Asisten Ilmu & Hafalan Sunnah",
  description: "Asisten cerdas untuk mendalami Al-Qur'an dan Hadits dengan teknologi AI.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${inter.variable} ${amiri.variable} font-sans min-h-screen flex flex-col transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-grow pb-24 md:pb-0">
            {children}
          </main>
          <InstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}

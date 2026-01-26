import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./providers";
import Header from "../ui/navigation/Header";
import Footer from "../ui/navigation/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leadership Academia Alumni Platform",
  description: "Plateforme des anciens élèves de Leadership Academy",
  icons: {
    icon: '/Logo LAU .png',
    shortcut: '/Logo LAU .png',
    apple: '/Logo LAU .png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${firaCode.variable} antialiased`}
      >
        <NextAuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}

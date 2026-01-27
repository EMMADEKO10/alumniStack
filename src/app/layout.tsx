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

const siteUrl = 'https://alumni-launiversity.cd';
const siteName = 'Leadership Academia Alumni Platform';
const siteDescription = 'Plateforme officielle des anciens étudiants de Leadership Academy University. Connectez-vous avec des milliers d\'alumni, découvrez des opportunités professionnelles, participez à des événements exclusifs et contribuez au développement de notre communauté.';
const ogImage = `${siteUrl}/lau/felicitations_finalistes.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'Leadership Academy',
    'LAU',
    'Alumni',
    'Anciens élèves',
    'RDC',
    'Congo',
    'Université',
    'Réseau professionnel',
    'Opportunités',
    'Emploi',
    'Formation',
    'Événements',
    'Community',
    'Leadership Academia University',
  ],
  authors: [{ name: 'Leadership Academy University' }],
  creator: 'Leadership Academy University',
  publisher: 'Leadership Academy University',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/Logo LAU .png',
    shortcut: '/Logo LAU .png',
    apple: '/Logo LAU .png',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_CD',
    url: siteUrl,
    siteName: siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Leadership Academy University - Cérémonie de remise des diplômes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: [ogImage],
    creator: '@LAU_Alumni',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // À remplacer par votre code
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Leadership Academy University',
    alternateName: 'LAU',
    url: siteUrl,
    logo: ogImage,
    description: siteDescription,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kinshasa',
      addressCountry: 'CD',
    },
    sameAs: [
      'https://www.facebook.com/LAU',
      'https://twitter.com/LAU_Alumni',
      'https://www.linkedin.com/school/leadership-academy-university',
    ],
    alumni: {
      '@type': 'Organization',
      name: 'Leadership Academy Alumni Network',
      description: 'Réseau des anciens élèves de Leadership Academy University',
    },
  };

  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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

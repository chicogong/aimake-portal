import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aimake.cc"),
  title: "Aimake | AI Product Engineer & Indie Hacker",
  description: "Architecting Real-time Voice Agents and WebRTC Infrastructure. The digital laboratory and open-source arsenal of Chico.",
  icons: {
    icon: "/logo.jpg",
    apple: "/apple-icon.jpg",
  },
  keywords: ["AI Product Engineer", "Indie Hacker", "Chico", "Realtime AI", "WebRTC", "Voice AI", "Next.js"],
  authors: [{ name: "Chico", url: "https://aimake.cc" }],
  creator: "Chico",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://aimake.cc",
    title: "Aimake | AI Product Engineer & Indie Hacker",
    description: "Architecting Real-time Voice Agents and WebRTC Infrastructure. The digital laboratory and open-source arsenal of Chico.",
    siteName: "Aimake Portal",
    images: [
      {
        url: "/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Aimake Cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aimake | AI Product Engineer & Indie Hacker",
    description: "Architecting Real-time Voice Agents and WebRTC Infrastructure. The digital laboratory and open-source arsenal of Chico.",
    creator: "@chicogong",
    images: ["/hero-bg.jpg"],
  },
  alternates: {
    canonical: "https://aimake.cc",
  },
  verification: {
    yandex: "yandex_placeholder",
    google: "uJ83um8k9_iom9DdkHRY_hTQwZE2QDjupfhvXQTyHGE",
    other: {
      "baidu-site-verification": ["codeva-rYRSSaOaVf", "codeva-CZAAd377dN"],
      "msvalidate.01": "B543FF67D291AA27F8D470ADEA45F876"
    }
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Chico",
    url: "https://aimake.cc",
    jobTitle: "AI Product Engineer",
    description: "Architecting Real-time Voice Agents and WebRTC Infrastructure. The digital laboratory and open-source arsenal of Chico.",
    image: "https://aimake.cc/logo.jpg",
    sameAs: [
      "https://github.com/chicogong",
      "https://x.com/chicogong"
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <ScrollProgress />
        <Header />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

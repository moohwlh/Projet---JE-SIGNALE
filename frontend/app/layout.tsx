import type { Metadata } from "next";
import { Outfit } from "next/font/google"; 
import ClientLayout from '@/components/ClientLayout'; // 👈 C'est lui qui fait tout le travail maintenant
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit' 
});

export const metadata: Metadata = {
  title: "Je Signale",
  description: "Plateforme de signalement citoyen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={outfit.variable}>
      <body className="font-outfit bg-cyber-black text-white">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
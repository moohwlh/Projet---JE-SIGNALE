import type { Metadata } from "next";
import { Outfit } from "next/font/google"; 
import { ShieldAlert, LayoutDashboard, FolderOpen, Map } from "lucide-react";
import AuthHeader from '@/components/AuthHeader';
import "./globals.css";
import Link from 'next/link';

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit' 
});

export const metadata: Metadata = {
  title: "Je Signale",
  description: "Plateforme de signalement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={outfit.variable}>
      <body className="font-outfit bg-cyber-black text-white">
        <div className="flex h-screen overflow-hidden">
          {/* SIDEBAR */}
          <aside className="w-64 bg-cyber-black border-r border-gray-800 flex flex-col p-6">
            {/* LOGO */}
            <div className="text-2xl font-bold tracking-widest mb-10 text-white flex items-center gap-3 select-none">
              <span>JE</span>
              <ShieldAlert className="w-8 h-8 text-cyber-primary" />
              <span className="text-cyber-primary">SIGNALE</span>
            </div>

            {/* NAVIGATION */}
<nav className="flex-1 space-y-3">
  <Link href="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-cyber-primary/10 text-gray-400 hover:text-cyber-primary transition-colors cursor-pointer">
    <LayoutDashboard className="w-5 h-5" /> 
    <span>Tableau de bord</span>
  </Link>
  
  <Link href="/mes-signalements" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white cursor-pointer transition-colors">
    <FolderOpen className="w-5 h-5" /> 
    <span>Mes signalements</span>
  </Link>
  
  <Link href="/signalements" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white cursor-pointer transition-colors">
    <ShieldAlert className="w-5 h-5" /> 
    <span>Signaler</span>
  </Link>
</nav>
            {/* PROFIL */}
            <div className="pt-6 mt-6 border-t border-gray-800 flex items-center gap-3 select-none">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white select-none">
                U
              </div>
              <div>
                <p className="text-sm text-white font-medium">Utilisateur</p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-xs text-green-500">Connecté</p>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 flex flex-col min-w-0">
            <AuthHeader />
            <div className="flex-1 overflow-y-auto p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
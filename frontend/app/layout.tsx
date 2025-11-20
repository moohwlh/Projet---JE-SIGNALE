import type { Metadata } from "next";
import { Outfit } from "next/font/google"; 
import { ShieldAlert } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { FolderOpen } from "lucide-react";
import { Map } from "lucide-react";
import { LogIn } from "lucide-react";
import { UserPlus } from "lucide-react";
import AuthHeader from '@/components/AuthHeader';
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

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
    <html lang="fr">
      <body className={outfit.className}>
        
        
        <div className="flex h-screen overflow-hidden bg-cyber-black">
          <aside className="w-64 h-screen bg-cyber-black border-r border-cyber-border flex flex-col p-4 items-center"> 
            <div className={`${outfit.className} text-2xl font-bold tracking-widest mb-10 text-white flex items-center gap-3 select-none`}>
              <span>JE</span>
             <ShieldAlert className="w-8 h-8 text-cyber-primary shrink-0" /> { /*icone lucide react */}
               <span className="text-cyber-primary">SIGNALE</span>

            </div>
            <nav className="flex-1 mt-10 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-cyber-primary/10 text-cyber-primary select-none">
              <LayoutDashboard />  <span>Tableau de bord</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white select-none cursor-pointer">
              <FolderOpen /> <span>Mes signalements</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white select-none cursor-pointer">
              <Map /> <span>Carte des signalements</span>
              </div>
              <div className="border-t border-cyber-border flex items-center gap-3"></div>
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold select-none">U</div>
              <p className="text-sm font-medium text-white select-none">Utilisateur</p>
              <div className="flex items-center gap-1">
               <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                 <p className="text-xs text-green-500 select-none">Connecté</p>
</div>
            </nav>
            
          </aside>

         <main className="flex-1 overflow-y-auto pt-8 pb-4 bg-cyber-black flex flex-col">
              <div>
             {children}
             </div>

          </main>

        </div>

      </body>
    </html>
  );
}
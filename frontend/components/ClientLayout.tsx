"use client"; 

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import AuthHeader from './AuthHeader';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages "Plein écran" (Login / Register UNIQUEMENT) -> PAS de Sidebar
  const isAuthPage = ['/connexion', '/enregistrement'].includes(pathname);
  
  // Page d'Accueil -> Sidebar + Header de connexion
  const isHomePage = pathname === '/';

  // 1. SI C'EST LOGIN OU REGISTER : JUSTE LE FORMULAIRE CENTRÉ
  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col bg-cyber-black">
        <AuthHeader /> {/* Optionnel ici, tu peux l'enlever si tu veux */}
        <main className="flex-1 flex items-center justify-center p-4">
          {children}
        </main>
      </div>
    );
  }

  // 2. POUR TOUT LE RESTE (ACCUEIL, DASHBOARD...) : SIDEBAR + CONTENU
  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* La Sidebar est toujours là (Bleue ou Noire selon le rôle) */}
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 relative bg-black">
        
        {/* SUR L'ACCUEIL SEULEMENT : On affiche les boutons Connexion/Enregistrer en haut à droite */}
        {isHomePage && (
           <div className="absolute top-0 right-0 w-full z-10">
             <AuthHeader />
           </div>
        )}

        {/* Contenu de la page */}
        <div className={`flex-1 overflow-y-auto p-8 ${isHomePage ? 'pt-24' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
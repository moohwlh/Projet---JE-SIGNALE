"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, LayoutDashboard, FolderOpen, LogOut, Siren, Eye } from "lucide-react"; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  
  // États pour les infos utilisateur
  const [role, setRole] = useState<string | null>(null);
  const [identity, setIdentity] = useState({ nom: "", prenom: "" });

  useEffect(() => {
    // Récupération des données du LocalStorage
    const storedRole = localStorage.getItem("role");
    const storedNom = localStorage.getItem("nom");
    const storedPrenom = localStorage.getItem("prenom");

    setRole(storedRole);

    if (storedNom && storedPrenom) {
        setIdentity({ nom: storedNom, prenom: storedPrenom });
    }
  }, []);

  const handleLogout = () => {
    // On nettoie tout le stockage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nom");    
    localStorage.removeItem("prenom"); 
    
    setRole(null);
    setIdentity({ nom: "", prenom: "" });
    router.push('/'); 
  };

  // --- COULEURS ET LOGIQUE ---
  const isPolice = role === 'admin';
  const sidebarClasses = isPolice ? "bg-slate-950 border-blue-900" : "bg-black border-gray-800";
  const accentColor = isPolice ? "text-blue-500" : "text-[#FF4500]";
  const hoverClass = isPolice ? "hover:bg-blue-900/30 hover:text-blue-400" : "hover:bg-[#FF4500]/10 hover:text-[#FF4500]";

  // Calcul de l'initiale (Première lettre du nom, ou 'U' par défaut)
  const userInitial = identity.nom ? identity.nom.charAt(0).toUpperCase() : (isPolice ? 'P' : 'C');
  
  // Affichage du nom complet
  const displayName = identity.nom ? `${identity.prenom} ${identity.nom}` : (isPolice ? 'Officier' : 'Citoyen');

  return (
    <aside className={`w-64 border-r flex flex-col p-6 min-h-screen z-20 transition-colors duration-500 ${sidebarClasses}`}>
      
      {/* LOGO */}
      <div className="text-2xl font-bold tracking-widest mb-10 text-white flex items-center gap-3 select-none">
        <span>JE</span>
        <ShieldAlert className={`w-8 h-8 ${accentColor}`} />
        <span className={accentColor}>SIGNALE</span>
      </div>

      <nav className="flex-1 space-y-3">
        {/* --- MENU POLICE --- */}
        {isPolice && (
            <>
                <div className="text-xs font-bold text-blue-400 uppercase px-3 mb-2 mt-2">Espace Police</div>
                <Link href="/police" className={`flex items-center gap-3 p-3 rounded-xl text-gray-300 transition-colors cursor-pointer border border-blue-900/30 bg-blue-900/10 ${hoverClass}`}>
                    <Siren className="w-5 h-5" /> 
                    <span>Centrale & Alertes</span>
                </Link>
            </>
        )}

        {/* --- MENU PUBLIC & CITOYEN --- */}
        {!isPolice && (
            <>
                {role === 'citoyen' && <div className="text-xs font-bold text-gray-500 uppercase px-3 mb-2 mt-2">Espace Citoyen</div>}
                <Link href="/" className={`flex items-center gap-3 p-3 rounded-xl text-gray-400 transition-colors ${hoverClass}`}>
                    <LayoutDashboard className="w-5 h-5" /> 
                    <span>Accueil</span>
                </Link>
                {role === 'citoyen' && (
                    <Link href="/mes-signalements" className={`flex items-center gap-3 p-3 rounded-xl text-gray-400 transition-colors ${hoverClass}`}>
                        <FolderOpen className="w-5 h-5" /> 
                        <span>Mes signalements</span>
                    </Link>
                )}
                <Link href="/signalements" className={`flex items-center gap-3 p-3 rounded-xl text-gray-400 transition-colors ${hoverClass}`}>
                    {!role ? <Eye className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                    <span>{!role ? "Signaler (Anonyme)" : "Signaler"}</span>
                </Link>
            </>
        )}
      </nav>

      {/* FOOTER SIDEBAR AVEC NOM RÉEL */}
      <div className={`pt-6 mt-6 border-t flex items-center justify-between select-none ${isPolice ? 'border-blue-900' : 'border-gray-800'}`}>
        {role ? (
            <>
                <div className="flex items-center gap-3">
                    {/* CERCLE AVEC L'INITIALE */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg ${isPolice ? 'bg-blue-600' : 'bg-[#FF4500]'}`}>
                        {userInitial}
                    </div>
                    
                    {/* NOM ET PRÉNOM */}
                    <div className="overflow-hidden">
                        <p className="text-sm text-white font-bold truncate max-w-[100px]">
                            {displayName}
                        </p>
                        <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${isPolice ? 'bg-blue-400' : 'bg-green-500'}`}></div>
                            <p className={`text-xs ${isPolice ? 'text-blue-400' : 'text-green-500'}`}>En ligne</p>
                        </div>
                    </div>
                </div>
                
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Se déconnecter">
                    <LogOut className="w-5 h-5" />
                </button>
            </>
        ) : (
            <div className="text-xs text-gray-500 text-center w-full flex flex-col items-center">
                <span className="mb-2">Mode Invité</span>
                <Link href="/connexion" className="text-[#FF4500] hover:underline">Se connecter</Link>
            </div>
        )}
      </div>
    </aside>
  );
}
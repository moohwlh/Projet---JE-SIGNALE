"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, Eye, BarChart3, CheckCircle2, TrendingUp } from "lucide-react";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  
  //  On prépare des boîtes pour ranger les vrais chiffres
  const [stats, setStats] = useState({ actifs: 0, resolus: 0, taux: 0 });

  useEffect(() => {
    setToken(localStorage.getItem("token"));

    //  FONCTION QUI RÉCUPÈRE LES STATS DU SERVEUR
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/signalements/public/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data); // On met à jour les chiffres
        }
      } catch (err) {
        console.error("Erreur stats:", err);
      }
    };

    fetchStats(); // On lance la récupération
  }, []);

  return (
    <div className="text-white max-w-6xl mx-auto">
      
      {/* EN-TÊTE */}
      <div className="mb-10 mt-4">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            {token ? <span className="text-[#FF4500]">TABLEAU DE BORD</span> : "ESPACE CITOYEN"}
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
            {token 
                ? "Gérez vos signalements et suivez leur avancement en temps réel." 
                : "Contribuez à la sécurité de votre ville. Signalez les incidents rapidement, même sans compte."}
        </p>
      </div>

      {/* STATISTIQUES RÉELLES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Carte 1 : Actifs */}
        <div className="bg-black border border-gray-800 p-8 rounded-2xl hover:border-[#FF4500]/50 transition-colors group">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#FF4500]/10 rounded-lg text-[#FF4500] group-hover:bg-[#FF4500] group-hover:text-white transition-colors">
                    <BarChart3 className="w-6 h-6" />
                </div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Signalements actifs</p>
            </div>
            <p className="text-4xl font-bold text-white">{stats.actifs}</p>
        </div>

        {/* Carte 2 : Résolus */}
        <div className="bg-black border border-gray-800 p-8 rounded-2xl hover:border-green-500/50 transition-colors group">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Cas résolus</p>
            </div>
            {/*  ICI LA VARIABLE STATS */}
            <p className="text-4xl font-bold text-white">{stats.resolus}</p>
        </div>

        {/* Carte 3 : Taux */}
        <div className="bg-black border border-gray-800 p-8 rounded-2xl hover:border-blue-500/50 transition-colors group">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Taux de réponse</p>
            </div>
            {/*  ICI LA VARIABLE STATS */}
            <p className="text-4xl font-bold text-white">{stats.taux}%</p>
        </div>
      </div>

      {/* BANNIÈRE D'ACTION */}
      <div className="relative overflow-hidden bg-zinc-900 border border-gray-800 p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4500] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3 flex items-center gap-3 text-white">
                {token ? (
                    <>🚀 Prêt à signaler ?</>
                ) : (
                    <><Eye className="w-8 h-8 text-[#FF4500]"/> Signalement Anonyme</>
                )}
            </h2>
            <p className="text-gray-400 max-w-lg text-lg leading-relaxed">
                {token 
                    ? "Signalez une infraction ou un incident en quelques clics. Votre identité est protégée."
                    : "Pas besoin de compte. Votre signalement sera transmis à la police de manière totalement sécurisée et anonyme."
                }
            </p>
        </div>

        <Link href="/signalements" className="relative z-10">
            <button className={`
                px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all flex items-center gap-3
                ${token 
                    ? 'bg-[#FF4500] hover:bg-[#ff571a] text-white shadow-[#FF4500]/20' 
                    : 'bg-white text-black hover:bg-gray-200'
                }
            `}>
                <ShieldAlert className="w-6 h-6" />
                {token ? "SIGNALER MAINTENANT" : "FAIRE UN SIGNALEMENT"}
            </button>
        </Link>
      </div>
      
    </div>
  );
}
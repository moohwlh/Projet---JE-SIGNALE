import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Tableau de bord</h1>
      
      {/* Grille des cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-cyber-gray/30 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-lg">
          <p className="text-gray-400 text-sm mb-2">Signalements actifs</p>
          <p className="text-4xl font-bold text-white">19</p>
        </div>

        <div className="bg-cyber-gray/30 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-lg">
          <p className="text-gray-400 text-sm mb-2">Cas résolus</p>
          <p className="text-4xl font-bold text-white">6</p>
        </div>

        <div className="bg-cyber-gray/30 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-lg">
          <p className="text-gray-400 text-sm mb-2">Taux de réponse</p>
          <p className="text-4xl font-bold text-cyber-primary">88%</p>
        </div>
      </div>
      <div className="mt-10">
  <Link href="/signalements">
    <button className="flex items-center gap-3 bg-[#FF4500] text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg shadow-orange-900/20">
      <span>🚨</span> SIGNER UN SIGNALEMENT
    </button>
  </Link>
</div>
    </div>
  );
}
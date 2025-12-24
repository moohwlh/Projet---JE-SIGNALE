"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MesSignalements() {
  const [reports, setReports] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push('/connexion');
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/signalements/mes-signalements", {
          headers: { "token": token }
        });
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (err) {
        console.error("Erreur de récupération", err);
      }
    };
    fetchReports();
  }, []);
  // Fonction pour formater la date proprement
const formatDate = (dateString: string) => {
  if (!dateString) return "Date inconnue";
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
 
  });
};

  return (
    <div className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-3xl font-bold mb-8 text-[#FF4500] uppercase tracking-widest">
        Mes Signalements
      </h1>

<table className="w-full text-left border-collapse bg-gray-900/50 rounded-xl overflow-hidden">
  <thead className="bg-[#FF4500]/10 text-[#FF4500] uppercase text-sm">
    <tr>
      <th className="p-4">Nature</th> 
      <th className="p-4">Lieu</th>
      <th className="p-4">Date</th>
      <th className="p-4">Statut</th> 
    </tr>
  </thead>
  <tbody>
    {reports.map((report: any) => (
      <tr key={report.idsig} className="hover:bg-white/5 transition-colors border-b border-white/5 text-gray-300">
        
        <td className="p-4 font-bold text-white">
            {report.type_infraction}
        </td>

        <td className="p-4">{report.lieu}</td>
        
        <td>{formatDate(report.date_infraction)}</td>

        <td className="p-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            report.statut === 'Résolu' ? 'bg-green-500/20 text-green-500' :
            report.statut === 'Classé sans suite' ? 'bg-red-500/20 text-red-500' :
            'bg-yellow-500/20 text-yellow-500' // En attente par défaut
          }`}>
            {report.statut || 'En attente'}
          </span>
        </td>

      </tr>
    ))}
  </tbody>
</table>
        {reports.length === 0 && <p className="mt-4 text-gray-500">Aucun signalement effectué pour le moment.</p>}
      </div>
  );
}
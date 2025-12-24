"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PoliceDashboard() {
  const [reports, setReports] = useState([]);
  const router = useRouter();

  // CHARGEMENT DES DONNÉES
  const fetchAllReports = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push('/connexion');

    try {
      const response = await fetch("http://localhost:5000/signalements", {
        headers: { "token": token } // Le token contient le rôle "admin"
      });
      
      if (response.ok) {
        setReports(await response.json());
      } else {
        alert("Accès réservé à la Police."); // Sécurité frontend
        router.push('/');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchAllReports(); }, []);

  // FONCTION DE MISE À JOUR
  const updateStatus = async (id: number, newStatus: string) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/signalements/${id}/statut`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "token": token || "" },
        body: JSON.stringify({ nouveauStatut: newStatus })
    });
    fetchAllReports(); // On rafraîchit la liste après modif
  };
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
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="text-3xl font-bold text-blue-500 mb-8 uppercase tracking-widest">
         🚓 CENTRALE DE POLICE
      </h1>
      
      {/* TABLEAU */}
      <div className="overflow-x-auto bg-gray-900 rounded-xl border border-blue-900">
        <table className="w-full text-left">
          <thead className="bg-blue-900/30 text-blue-400 uppercase text-xs">
            <tr>
              <th className="p-4">Citoyen</th>
              <th className="p-4">Infraction</th>
              <th className="p-4">Lieu</th>
              <th className="p-4">Date</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {reports.map((report: any) => (
              <tr key={report.idsig} className="hover:bg-blue-900/10">
                 <td className="p-4 text-gray-400 text-sm">
  {report.nom} {report.prenom}
</td>
                <td className="p-4 font-bold">{report.type_infraction}</td>
                <td className="p-4 text-gray-300">{report.lieu}</td>
                <td className="p-4 text-gray-300 text-sm">
        {formatDate(report.date_infraction)}
      </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    report.statut === 'Résolu' ? 'text-green-500 bg-green-900/20' : 'text-yellow-500 bg-yellow-900/20'
                  }`}>
                    {report.statut || 'En attente'}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  <button onClick={() => updateStatus(report.idsig, "En cours")} className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-xs">Traitement</button>
                  <button onClick={() => updateStatus(report.idsig, "Résolu")} className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded text-xs">Résolu</button>
                  <button onClick={() => updateStatus(report.idsig, "Classé sans suite")} className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-xs">Rejet</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
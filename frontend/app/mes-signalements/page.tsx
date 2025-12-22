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

  return (
    <div className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-3xl font-bold mb-8 text-[#FF4500] uppercase tracking-widest">
        Mis Signalements
      </h1>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse bg-gray-900/50 rounded-xl overflow-hidden">
          <thead className="bg-[#FF4500]/10 text-[#FF4500] uppercase text-sm">
            <tr>
              <th className="p-4 border-b border-white/5">Nature</th>
              <th className="p-4 border-b border-white/5">Lieu</th>
              <th className="p-4 border-b border-white/5">Date</th>
              <th className="p-4 border-b border-white/5">Heure</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report: any) => (
              <tr key={report.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                <td className="p-4">{report.type_infraction}</td>
                <td className="p-4">{report.lieu}</td>
                <td className="p-4">{new Date(report.date_infraction).toLocaleDateString()}</td>
                <td className="p-4">{report.heure_infraction}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {reports.length === 0 && <p className="mt-4 text-gray-500">Aucun signalement effectué pour le moment.</p>}
      </div>
    </div>
  );
}
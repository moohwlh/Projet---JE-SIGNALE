"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PageSignalment () {
    const router = useRouter();  
  const [reportData, setReportData] = useState({
    type_infraction: '',
    description: '',
    lieu : '',
    date_infraction: '',
    heure_infraction: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setReportData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Logique de soumission du formulaire
    const token = localStorage.getItem("token"); // On récupère le token 
    if(!token) { 
        alert("Vous devez être connecté pour faire un signalement.");
        router.push('/connexion'); 
        return; 
    }

    try {
    const response = await fetch("http://localhost:5000/signalements", {
    method : "POST",
    headers : {
        "Content-Type": "application/json",
        "token": token
    },
    body : JSON.stringify(reportData)
    }
    );

    if (response.ok) {
        alert("Signalement envoyé avec succès !");
        router.push('/'); // on revient à l'accueil
    }
    else {
       const errorText = await response.text(); 
    console.error("Détail du refus serveur :", errorText);
    alert("Le serveur a dit : " + errorText);
    }
    } catch (error) {
        console.error(error);
        alert(" Le serveur est injoignable.");
        
    };
    };
  return (
    <div className="min-h-screen bg-black p-10 text-white">
      <div className="max-w-2xl mx-auto bg-gray-900/50 p-8 rounded-2xl border border-orange-500/20 shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-orange-500 uppercase tracking-widest">
          Nouveau Signalement
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TYPE */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-400">Nature du délit</label>
            <select name="type_infraction" onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded-lg outline-none focus:border-orange-500">
              <option value="Vol">Vol</option>
              <option value="Agression">Agression</option>
              <option value="Dégradation">Dégradation</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          {/* LIEU */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-400">Lieu exact</label>
            <input type="text" name="lieu" placeholder="Adresse ou quartier..." onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded-lg outline-none focus:border-orange-500" required />
          </div>

          {/* DATE & HEURE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-400">Date</label>
              <input type="date" name="date_infraction" onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded-lg outline-none focus:border-orange-500" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-400">Heure</label>
              <input type="time" name="heure_infraction" onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded-lg outline-none focus:border-orange-500" required />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-400">Description des faits</label>
            <textarea name="description" rows={4} placeholder="Détaillez l'incident..." onChange={handleChange} className="bg-black border border-gray-700 p-3 rounded-lg outline-none focus:border-orange-500" required></textarea>
          </div>

          <button type="submit" className="w-full bg-[#FF4500] hover:bg-[#FF5722] text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(255,69,0,0.3)] uppercase tracking-widest">
            SOUMETTRE LE RAPPORT
          </button>
        </form>
      </div>
    </div>
   
 
  );
};

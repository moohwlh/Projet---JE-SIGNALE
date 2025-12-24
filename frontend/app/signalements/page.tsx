"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, MapPin, Calendar, FileText, Siren } from "lucide-react";

export default function Signalement() {
  const router = useRouter();
  
  // États du formulaire
  const [form, setForm] = useState({
    type_infraction: "Vol",
    lieu: "",
    date_infraction: "",
    heure_infraction: "",
    description: ""
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    //  1. On récupère le token (s'il y en a un)
    const token = localStorage.getItem("token");

    //  2. On prépare les headers
    const headers: any = { "Content-Type": "application/json" };
    
    // Si l'utilisateur est connecté, on ajoute son token. Sinon, on envoie sans token (Anonyme).
    if (token) {
        headers["token"] = token;
    }

    try {
      const response = await fetch("http://localhost:5000/signalements", {
        method: "POST",
        headers: headers, // On envoie les headers préparés
        body: JSON.stringify(form)
      });

      if (response.ok) {
        alert("Signalement envoyé avec succès !");
        // Redirection intelligente : Mes signalements si connecté, sinon Accueil
        if (token) {
            router.push('/mes-signalements');
        } else {
            router.push('/');
        }
      } else {
        alert("Erreur lors de l'envoi.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur.");
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-2xl shadow-2xl">
        
        <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-6">
            <div className="p-3 bg-[#FF4500]/10 rounded-lg">
                <Siren className="w-8 h-8 text-[#FF4500]" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-white">NOUVEAU SIGNALEMENT</h1>
                <p className="text-gray-400 text-sm">Remplissez ce formulaire. Votre identité est protégée.</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* TYPE INFRACTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">Type d'infraction</label>
                <div className="relative">
                    <select name="type_infraction" onChange={handleChange} className="w-full bg-black border border-gray-700 text-white p-3 rounded-xl focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] outline-none appearance-none">
                        <option>Vol</option>
                        <option>Agression</option>
                        <option>Dégradation</option>
                        <option>Accident</option>
                        <option>Tapage nocturne</option>
                        <option>Autre</option>
                    </select>
                    <ShieldAlert className="absolute right-3 top-3.5 text-gray-500 w-5 h-5 pointer-events-none" />
                </div>
            </div>

            {/* LIEU */}
            <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">Lieu de l'incident</label>
                <div className="relative">
                    <input type="text" name="lieu" placeholder="Ex: Rue de la Liberté" required onChange={handleChange} 
                        className="w-full bg-black border border-gray-700 text-white p-3 pl-10 rounded-xl focus:border-[#FF4500] outline-none" 
                    />
                    <MapPin className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                </div>
            </div>
          </div>

          {/* DATE ET HEURE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">Date</label>
                <div className="relative">
                    <input type="date" name="date_infraction" required onChange={handleChange} 
                        className="w-full bg-black border border-gray-700 text-white p-3 pl-10 rounded-xl focus:border-[#FF4500] outline-none" 
                    />
                    <Calendar className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                </div>
            </div>
            <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">Heure approximative</label>
                <input type="time" name="heure_infraction" required onChange={handleChange} 
                    className="w-full bg-black border border-gray-700 text-white p-3 rounded-xl focus:border-[#FF4500] outline-none" 
                />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-gray-400 text-sm font-medium mb-2 block">Description détaillée</label>
            <div className="relative">
                <textarea name="description" rows={4} placeholder="Décrivez ce qu'il s'est passé..." required onChange={handleChange} 
                    className="w-full bg-black border border-gray-700 text-white p-3 pl-10 rounded-xl focus:border-[#FF4500] outline-none resize-none"
                ></textarea>
                <FileText className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#FF4500] hover:bg-[#ff571a] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#FF4500]/20 transition-all transform hover:scale-[1.02]">
            ENVOYER LE SIGNALEMENT
          </button>

        </form>
      </div>
    </div>
  );
}

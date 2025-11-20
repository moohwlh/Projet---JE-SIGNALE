"use client";
import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus } from 'lucide-react';

export default function RegisterPage () { 
  const router = useRouter(); 
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    telephone: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Inscription réussie !");
        router.push('/connexion'); 
      } else {
        alert(`Erreur: ${data.message || 'Vérifiez les champs'}`);
      }

    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
      alert("Impossible de contacter le serveur (Backend éteint ?)");
    }
  };
  
  return (
    <div className="min-h-full flex justify-center items-center py-10">
      <div className="max-w-lg w-full bg-cyber-gray/30 backdrop-blur-xl border border-white/5 p-10 rounded-2xl shadow-2xl">
        
        <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 rounded-full bg-cyber-primary/20 text-cyber-primary">
                <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-white">Créer un compte</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-white/70 mb-1">Nom</label>
              <input 
                id="nom"
                name="nom"
                type="text" 
                value={formData.nom}
                onChange={handleChange}
                placeholder="Votre nom" 
                className="w-full bg-cyber-black/50 border border-cyber-gray rounded-lg p-3 text-white focus:ring-1 focus:ring-cyber-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-white/70 mb-1">Prénom</label>
              <input 
                id="prenom"
                name="prenom"
                type="text" 
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Votre prénom" 
                className="w-full bg-cyber-black/50 border border-cyber-gray rounded-lg p-3 text-white focus:ring-1 focus:ring-cyber-primary outline-none transition-colors"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="telephone" className="block text-sm font-medium text-white/70 mb-1">Téléphone</label>
            <input 
              id="telephone"
              name="telephone"
              type="tel" 
              value={formData.telephone}
              onChange={handleChange}
              placeholder="06..." 
              className="w-full bg-cyber-black/50 border border-cyber-gray rounded-lg p-3 text-white focus:ring-1 focus:ring-cyber-primary outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">Email</label>
            <input 
              id="email"
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com" 
              className="w-full bg-cyber-black/50 border border-cyber-gray rounded-lg p-3 text-white focus:ring-1 focus:ring-cyber-primary outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="mot_de_passe" className="block text-sm font-medium text-white/70 mb-1">Mot de passe</label>
            <input 
              id="mot_de_passe"
              name="mot_de_passe"
              type="password" 
              value={formData.mot_de_passe}
              onChange={handleChange}
              placeholder="Au moins 6 caractères" 
              className="w-full bg-cyber-black/50 border border-cyber-gray rounded-lg p-3 text-white focus:ring-1 focus:ring-cyber-primary outline-none transition-colors"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-cyber-primary hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyber-primary/30"
          >
            S'enregistrer
          </button>

          <p className="text-center text-sm text-white/50 pt-2">
            Déjà un compte ? <a href="/connexion" className="text-cyber-primary hover:underline">Se connecter</a>
          </p>
        </form>
      </div>
    </div>
  );
}
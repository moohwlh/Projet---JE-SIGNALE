"use client";
import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
    // 1. HOOKS ET ÉTAT
    const router = useRouter(); 
    const [loginData, setLoginData] = useState({
        email: '',
        mot_de_passe: '',
    });

    // 2. GESTION DU CHANGEMENT (Mise à jour de l'état)
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLoginData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    // 3. SOUMISSION DU FORMULAIRE (API CALL)
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                // ✅ Succès : Stocker le Token JWT
                localStorage.setItem("token", data.token); 
                router.push("/"); // Rediriger vers le tableau de bord
            } else {
                // ❌ Échec
                alert(`Erreur de connexion : ${data.message || 'Identifiants invalides.'}`);
            }

        } catch (error) {
            console.error("Erreur de connexion au serveur :", error);
            alert("Impossible de contacter le serveur (Backend éteint ?)");
        }
    };

    return (
        <div className="min-h-full flex justify-center items-center py-10">
            
            <div className="max-w-md w-full bg-cyber-gray/30 backdrop-blur-xl border border-white/5 p-10 rounded-2xl shadow-2xl">
                
                <div className="flex items-center space-x-3 mb-8">
                    <div className="p-3 rounded-full bg-cyber-primary/20 text-cyber-primary">
                        <LogIn className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Connexion Agent</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={loginData.email}
                            onChange={handleChange}
                            placeholder="agent@police.fr"
                            className="w-full bg-cyber-black/50 border border-cyber-gray rounded-lg p-3 text-white focus:ring-1 focus:ring-cyber-primary outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="mot_de_passe" className="block text-sm font-medium text-white/70 mb-1">Mot de passe</label>
                        <input
                            id="mot_de_passe"
                            name="mot_de_passe"
                            type="password"
                            value={loginData.mot_de_passe}
                            onChange={handleChange}
                            placeholder="●●●●●●"
                            className="w-full bg-cyber-black/50 border border-cyber-gray rounded-lg p-3 text-white focus:ring-1 focus:ring-cyber-primary outline-none transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-cyber-primary hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyber-primary/30"
                    >
                        Se connecter
                    </button>

                    <p className="text-center text-sm text-white/50 pt-2">
                        Pas de compte ? <a href="/enregistrement" className="text-cyber-primary hover:underline">S'enregistrer ici</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
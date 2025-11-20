import { LogIn, UserPlus } from "lucide-react";
import Link from 'next/link'; // <--- AJOUTÉ

export default function AuthHeader() {
  return (
    <div className="w-full flex items-center gap-4 py-4 px-8 bg-cyber-black">
      
      {/* BOUTON SE CONNECTER (Changement de <button> à <Link> + ajout de ml-auto) */}
      <Link href="/connexion" 
        className="
        flex items-center px-4 py-2 gap-2 
        text-white/70 hover:text-white 
        transition-all duration-300 
        cursor-pointer 
        rounded-lg 
        border border-transparent 
        hover:border-cyber-primary/30
        hover:bg-white/5
        transform
        hover:scale-105
        active:scale-95
        select-none
        ml-auto  // <--- CRUCIAL POUR LE POSITIONNEMENT
      ">
        <LogIn className="w-5 h-5" />
        <span className="text-sm font-medium">Connexion</span>
      </Link>

      {/* BOUTON S'ENREGISTRER */}
      <Link href="/enregistrement" 
        className="
        flex items-center gap-2 
        bg-cyber-primary/20 
        hover:bg-cyber-primary/40 
        text-cyber-primary 
        px-4 py-2 
        rounded-full 
        text-sm font-medium 
        transition-all duration-300 
        cursor-pointer 
        shadow-lg 
        transform
        hover:scale-105
        active:scale-95
        hover:shadow-cyber-primary/30
        select-none
      ">
        <UserPlus className="w-5 h-5" />
        <span>S'enregistrer</span>
      </Link>

    </div>
  );
}
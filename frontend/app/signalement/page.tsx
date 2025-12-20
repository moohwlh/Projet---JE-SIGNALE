"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PageSignalment () {  
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Données à envoyer :", reportData);
  };

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Nouveau Signalement</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        
        {}
        <p>Le formulaire </p>
        
        <button type="submit" className="bg-orange-500 p-2 rounded">
          Envoyer
        </button>
      </form>
    
    </div>
  );
}

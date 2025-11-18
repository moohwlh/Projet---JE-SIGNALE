
CREATE TABLE utilisateurs (
    idUti SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'citoyen', -- 'citoyen' ou 'admin'
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE dossiers (
    idDo SERIAL PRIMARY KEY,
    statut VARCHAR(50) DEFAULT 'En attente', -- En cours, Résolu, Classé sans suite
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_cloture TIMESTAMP
);

CREATE TABLE signalements (
    idSig SERIAL PRIMARY KEY,
    type_infraction VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    lieu VARCHAR(255) NOT NULL,
    date_infraction DATE NOT NULL,
    heure_infraction TIME NOT NULL,
    
    utilisateur_id INTEGER REFERENCES utilisateurs(idUti) ON DELETE SET NULL,
    dossier_id INTEGER REFERENCES dossiers(idDo) ON DELETE CASCADE,
     date_soumission TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
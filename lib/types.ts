export type Genre =
  | 'fiction'
  | 'documentaire'
  | 'animation'
  | 'experimental'
  | 'hybride';

export type Etape =
  | 'ecriture'
  | 'developpement'
  | 'preproduction'
  | 'production'
  | 'postproduction';

export type ProfilRealisateur =
  | 'premier_film'
  | 'emergent'
  | 'confirme';

export type Region = string;

export interface Project {
  id: string;
  titre: string;
  logline: string;
  genre: Genre;
  etape: Etape;
  dureeMinutes: number;
  budget: number;
  profilRealisateur: ProfilRealisateur;
  region: Region;
  createdAt: string;
}

export type AideType = 'nationale' | 'regionale' | 'privee';

export interface Aide {
  id: string;
  nom: string;
  organisme: string;
  type: AideType;
  description: string;
  montantMin: number;
  montantMax: number;
  genres: Genre[];
  etapes: Etape[];
  profils: ProfilRealisateur[];
  dureeMax?: number;
  budgetMax?: number;
  regions?: Region[];
  deadline: string;
  documents: string[];
  proTips: string[];
  lienOfficiel: string;
}

export type FestivalCategorie = 'A' | 'B' | 'C';

export interface Festival {
  id: string;
  nom: string;
  ville: string;
  pays: string;
  categorie: FestivalCategorie;
  description: string;
  genres: Genre[];
  dureeMax?: number;
  premiereRequise: boolean;
  fraisInscription: boolean;
  deadline: string;
  dateEvent: string;
  documents: string[];
  proTips: string[];
  lienOfficiel: string;
}

export type SubmissionStatus =
  | 'brouillon'
  | 'en_preparation'
  | 'soumise'
  | 'acceptee'
  | 'refusee';

export interface Submission {
  id: string;
  projectId: string;
  targetId: string;
  targetType: 'aide' | 'festival';
  targetNom: string;
  status: SubmissionStatus;
  deadline: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchResult {
  score: number;
  details: {
    genre: number;
    etape: number;
    profil: number;
    budget: number;
    duree: number;
    region: number;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'aide' | 'festival' | 'soumission';
  targetId: string;
}

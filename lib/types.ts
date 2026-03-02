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
  lieuTournage?: string;
  productionNom?: string;
  productionVille?: string;
  regionProduction?: string;
  autoProduction?: boolean;
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
  session?: string;
  tauxSelection?: number;
  documents: string[];
  proTips: string[];
  lienOfficiel: string;
  requiresProducer?: boolean;
  autoProductionEligible?: boolean;
}

export type FestivalCategorie = 'A' | 'B' | 'C';

export type PremiereType =
  | 'mondiale'
  | 'internationale'
  | 'europeenne'
  | 'nationale'
  | 'aucune';

export interface Festival {
  id: string;
  nom: string;
  ville: string;
  pays: string;
  categorie: FestivalCategorie;
  description: string;
  genres: Genre[];
  dureeMax?: number;
  premiereType: PremiereType;
  fraisInscription: boolean;
  fraisMontant?: number;
  deadline: string;
  deadlineOuverture?: string;
  dateEvent: string;
  nbFilmsSoumis?: number;
  nbFilmsSelectionnes?: number;
  documents: string[];
  proTips: string[];
  lienOfficiel: string;
  oscarQualifying?: boolean;
  qualifyingCategories?: string[];
}

export type OscarCategory = 'Best Live Action Short' | 'Best Animated Short' | 'Best Documentary Short';

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
  regionSource?: 'tournage' | 'production' | 'both' | null;
  producerIssue?: 'requires_producer' | 'boost_auto' | null;
}

export type FinancementCategory =
  | 'aide_publique'
  | 'apport_producteur'
  | 'crowdfunding'
  | 'pre_achats'
  | 'industrie_technique'
  | 'apport_personnel';

export interface FinancementSource {
  id: string;
  aideId?: string;
  label: string;
  montant: number;
  category: FinancementCategory;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'aide' | 'festival' | 'soumission';
  targetId: string;
}

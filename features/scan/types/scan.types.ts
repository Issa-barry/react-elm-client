export interface ClientScan {
  id: string;
  reference: string;
  nom_complet: string;
  nom: string;
  prenom: string | null;
  raison_sociale: string | null;
  phone: string | null;
  email: string | null;
  ville: string | null;
  quartier: string | null;
  adresse: string | null;
  is_active: boolean;
}

export type RoleScan = 'proprietaire' | 'livreur';

export interface VehiculeResume {
  nom: string;
  immatriculation: string;
}

export interface UserScan {
  user_id: string;
  nom_complet: string;
  nom: string;
  prenom: string | null;
  phone: string | null;
  ville: string | null;
  quartier: string | null;
  roles: RoleScan[];
  vehicules: VehiculeResume[];
}

export type ScanResult =
  | { type: 'user';   data: UserScan }
  | { type: 'client'; data: ClientScan };

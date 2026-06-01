export interface LivraisonEnCours {
  id: string;
  reference: string;
  statut: string;
  statut_label: string;
  site_source: string;
  site_destination: string;
  vehicule: { nom: string; immatriculation: string } | null;
  equipe_nom: string;
  date_depart: string | null;
  date_arrivee_prevue: string | null;
  nb_packs: number;
}

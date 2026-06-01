export type StatutCommission = 'paye' | 'en_attente' | 'annule';

export interface CommissionVehicule {
  id: string;
  reference: string;
  date: string | null;
  montant_net: number;
  montant_verse: number;
  montant_restant: number;
  statut: StatutCommission;
  mois: string;
}

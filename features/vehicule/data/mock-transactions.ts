export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  montant: number;
  statut: 'paye' | 'en_attente' | 'annule';
}

export interface TransactionGroup {
  mois: string; // "Mai 2026"
  total: number;
  transactions: Transaction[];
}

const DATA: Record<string, Transaction[]> = {
  '1': [
    { id: 't1',  date: '2026-05-28', description: 'Livraison Matoto',       montant: 45_000, statut: 'paye' },
    { id: 't2',  date: '2026-05-21', description: 'Livraison Dixinn',        montant: 30_000, statut: 'paye' },
    { id: 't3',  date: '2026-05-14', description: 'Livraison Ratoma',        montant: 40_000, statut: 'en_attente' },
    { id: 't4',  date: '2026-04-29', description: 'Livraison Kaloum',        montant: 35_000, statut: 'paye' },
    { id: 't5',  date: '2026-04-20', description: 'Livraison Matam',         montant: 50_000, statut: 'paye' },
    { id: 't6',  date: '2026-04-10', description: 'Livraison Matoto',        montant: 30_000, statut: 'annule' },
    { id: 't7',  date: '2026-03-25', description: 'Livraison Dixinn',        montant: 40_000, statut: 'paye' },
    { id: 't8',  date: '2026-03-15', description: 'Livraison Kaloum',        montant: 0,      statut: 'annule' },
  ],
  '2': [
    { id: 't9',  date: '2026-05-27', description: 'Livraison Ratoma',        montant: 0,      statut: 'en_attente' },
    { id: 't10', date: '2026-05-18', description: 'Livraison Matoto',        montant: 0,      statut: 'en_attente' },
    { id: 't11', date: '2026-04-22', description: 'Livraison Conakry Centre', montant: 0,     statut: 'annule' },
  ],
  '3': [
    { id: 't12', date: '2026-05-25', description: 'Livraison Kaloum',        montant: 0,      statut: 'en_attente' },
    { id: 't13', date: '2026-04-17', description: 'Livraison Matam',         montant: 0,      statut: 'annule' },
    { id: 't14', date: '2026-03-30', description: 'Livraison Dixinn',        montant: 0,      statut: 'en_attente' },
  ],
};

const MOIS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export function getTransactionsGroupees(vehiculeId: string): TransactionGroup[] {
  const transactions = DATA[vehiculeId] ?? [];

  const map = new Map<string, Transaction[]>();
  for (const t of transactions) {
    const [year, month] = t.date.split('-');
    const key = `${year}-${month}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }

  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, txs]) => {
      const [year, month] = key.split('-');
      return {
        mois: `${MOIS_FR[parseInt(month) - 1]} ${year}`,
        total: txs.reduce((sum, t) => sum + t.montant, 0),
        transactions: txs.sort((a, b) => b.date.localeCompare(a.date)),
      };
    });
}

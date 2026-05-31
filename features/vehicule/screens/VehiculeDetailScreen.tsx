import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, slate, blue } from '@/shared/constants/theme';
import { getTransactionsGroupees, type Transaction } from '../data/mock-transactions';

interface Props {
  id: string;
  nom: string;
  immatriculation: string;
}

function formatMontant(n: number): string {
  return n.toLocaleString('fr-FR') + ' GNF';
}

function formatDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  const MOIS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${parseInt(day)} ${MOIS[parseInt(month) - 1]}`;
}

const STATUT_CONFIG = {
  paye:       { label: 'Payé',        bg: '#dcfce7', text: '#16a34a' },
  en_attente: { label: 'En attente',  bg: '#fef9c3', text: '#ca8a04' },
  annule:     { label: 'Annulé',      bg: '#fee2e2', text: '#dc2626' },
};

function TransactionRow({ tx }: { tx: Transaction }) {
  const statut = STATUT_CONFIG[tx.statut];
  return (
    <View style={styles.txRow}>
      <View style={styles.txLeft}>
        <Text style={styles.txDescription}>{tx.reference}</Text>
        <Text style={styles.txDate}>{formatDate(tx.date)}</Text>
      </View>
      <View style={styles.txRight}>
        <Text style={[styles.txMontant, tx.montant === 0 && styles.txMontantZero]}>
          {formatMontant(tx.montant)}
        </Text>
        <View style={[styles.badge, { backgroundColor: statut.bg }]}>
          <Text style={[styles.badgeText, { color: statut.text }]}>{statut.label}</Text>
        </View>
      </View>
    </View>
  );
}

export default function VehiculeDetailScreen({ id, nom, immatriculation }: Props) {
  const insets = useSafeAreaInsets();
  const groupes = getTransactionsGroupees(id);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}>

      {/* Résumé véhicule */}
      <View style={styles.resumeCard}>
        <Text style={styles.resumeNom}>{nom}</Text>
        <Text style={styles.resumeImmat}>{immatriculation}</Text>
      </View>

      {/* Groupes par mois */}
      {groupes.map((groupe) => (
        <View key={groupe.mois} style={styles.groupe}>
          {/* En-tête du mois */}
          <View style={styles.moisHeader}>
            <Text style={styles.moisTitre}>{groupe.mois}</Text>
            <Text style={styles.moisTotal}>{formatMontant(groupe.total)}</Text>
          </View>

          {/* Liste des transactions */}
          <View style={styles.txCard}>
            {groupe.transactions.map((tx, index) => (
              <View key={tx.id}>
                <TransactionRow tx={tx} />
                {index < groupe.transactions.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            ))}
          </View>
        </View>
      ))}

      {groupes.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucune transaction</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Résumé ──────────────────────────────────────────────
  resumeCard: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    gap: 4,
  },
  resumeNom: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  resumeImmat: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
  },

  // ── Groupe mois ─────────────────────────────────────────
  groupe: {
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 8,
  },
  moisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moisTitre: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  moisTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },

  // ── Transaction card ─────────────────────────────────────
  txCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: slate[200],
    overflow: 'hidden',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  txLeft: {
    flex: 1,
    gap: 3,
  },
  txDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  txDate: {
    fontSize: 12,
    color: slate[400],
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  txMontant: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  txMontantZero: {
    color: slate[400],
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: slate[100],
    marginHorizontal: 16,
  },

  // ── Vide ────────────────────────────────────────────────
  empty: {
    marginTop: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: slate[400],
  },
});

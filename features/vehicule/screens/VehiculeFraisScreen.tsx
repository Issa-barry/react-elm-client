import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, blue, slate } from '@/shared/constants/theme';
import { formatMontant, formatDate } from '@/shared/utils/format';
import {
  CATEGORIE_CONFIG,
  getFraisGroupes,
  type CategorieFrais,
  type Frais,
} from '../data/mock-frais';

interface Props {
  id: string;
  nom: string;
  immatriculation: string;
}

// ─── Filtres catégorie ─────────────────────────────────────────────────────
type FiltreCategorie = 'tous' | CategorieFrais;

const FILTRES_CATEGORIE: { key: FiltreCategorie; label: string }[] = [
  { key: 'tous',        label: 'Tous' },
  { key: 'carburant',   label: 'Carburant' },
  { key: 'reparation',  label: 'Réparation' },
  { key: 'entretien',   label: 'Entretien' },
  { key: 'pneus',       label: 'Pneus' },
  { key: 'lavage',      label: 'Lavage' },
  { key: 'autre',       label: 'Autre' },
];

const STATUT_CONFIG = {
  paye:       { label: 'Payé',       bg: '#dcfce7', text: '#16a34a' },
  en_attente: { label: 'En attente', bg: '#fef9c3', text: '#ca8a04' },
};

// ─── Helpers ───────────────────────────────────────────────────────────────

// ─── Composants ───────────────────────────────────────────────────────────
const STATUT_MONTANT_COLOR: Record<StatutFrais, string> = {
  paye:       Colors.text,
  en_attente: '#ca8a04',
};

function FraisRow({ item }: Readonly<{ item: Frais }>) {
  const cat = CATEGORIE_CONFIG[item.categorie];

  return (
    <View style={styles.row}>
      <View style={styles.rowIconBox}>
        <Text style={styles.rowIconText}>{cat.icone}</Text>
      </View>
      <View style={styles.rowLeft}>
        <Text style={styles.rowRef}>{item.reference}</Text>
        <Text style={styles.rowMeta}>{formatDate(item.date)}</Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={[styles.rowMontant, { color: STATUT_MONTANT_COLOR[item.statut] }]}>
          {formatMontant(item.montant)}
        </Text>
        <View style={[styles.badge, { backgroundColor: slate[100] }]}>
          <Text style={[styles.badgeText, { color: slate[600] }]}>{cat.label}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Écran ─────────────────────────────────────────────────────────────────
export default function VehiculeFraisScreen({ id, nom, immatriculation }: Readonly<Props>) {
  const insets = useSafeAreaInsets();
  const [filtreCategorie, setFiltreCategorie] = useState<FiltreCategorie>('tous');
  const [moisActif, setMoisActif]             = useState<string>('tous');

  const tousGroupes = getFraisGroupes(id);

  const moisDisponibles = useMemo(() => tousGroupes.map((g) => g.mois), [tousGroupes]);

  const groupesFiltres = useMemo(() => {
    return tousGroupes
      .filter((g) => moisActif === 'tous' || g.mois === moisActif)
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (i) => filtreCategorie === 'tous' || i.categorie === filtreCategorie,
        ),
      }))
      .filter((g) => g.items.length > 0)
      .map((g) => ({
        ...g,
        total: g.items.reduce((s, i) => s + i.montant, 0),
      }));
  }, [filtreCategorie, moisActif, tousGroupes]);

  const totalFiltré  = groupesFiltres.reduce((s, g) => s + g.total, 0);
  const nombreFiltré = groupesFiltres.reduce((n, g) => n + g.items.length, 0);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}>

      {/* Résumé */}
      <View style={styles.resumeCard}>
        <Text style={styles.resumeNom}>{nom}</Text>
        <Text style={styles.resumeImmat}>{immatriculation}</Text>
        <View style={styles.resumeStats}>
          <View>
            <Text style={styles.resumeStatLabel}>Total frais</Text>
            <Text style={styles.resumeStatValue}>{formatMontant(totalFiltré)}</Text>
          </View>
          <View style={styles.resumeStatDivider} />
          <View>
            <Text style={styles.resumeStatLabel}>Dépenses</Text>
            <Text style={styles.resumeStatValue}>{nombreFiltré}</Text>
          </View>
        </View>
      </View>

      {/* Filtre catégorie */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtreList}>
        {FILTRES_CATEGORIE.map((f) => {
          const isActive = f.key === filtreCategorie;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFiltreCategorie(f.key)}
              activeOpacity={0.7}
              style={[styles.chip, isActive && styles.chipActive]}>
              <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Filtre mois */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtreList}>
        <TouchableOpacity
          onPress={() => setMoisActif('tous')}
          activeOpacity={0.7}
          style={[styles.chip, styles.chipMois, moisActif === 'tous' && styles.chipMoisActive]}>
          <Text style={[styles.chipLabel, moisActif === 'tous' && styles.chipLabelMoisActive]}>
            Tous les mois
          </Text>
        </TouchableOpacity>
        {moisDisponibles.map((mois) => (
          <TouchableOpacity
            key={mois}
            onPress={() => setMoisActif(mois)}
            activeOpacity={0.7}
            style={[styles.chip, styles.chipMois, moisActif === mois && styles.chipMoisActive]}>
            <Text style={[styles.chipLabel, moisActif === mois && styles.chipLabelMoisActive]}>
              {mois}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Groupes par mois */}
      {groupesFiltres.map((groupe) => (
        <View key={groupe.mois} style={styles.groupe}>
          <View style={styles.moisHeader}>
            <Text style={styles.moisTitre}>{groupe.mois}</Text>
            <Text style={styles.moisTotal}>{formatMontant(groupe.total)}</Text>
          </View>
          <View style={styles.card}>
            {groupe.items.map((item, index) => (
              <View key={item.id}>
                <FraisRow item={item} />
                {index < groupe.items.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        </View>
      ))}

      {groupesFiltres.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucun frais pour ce filtre</Text>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },

  resumeCard: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20, paddingVertical: 20,
    marginHorizontal: 16, marginTop: 16,
    borderRadius: 16, gap: 12,
  },
  resumeNom:   { color: '#fff', fontSize: 18, fontWeight: '700' },
  resumeImmat: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  resumeStats: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 4 },
  resumeStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  resumeStatValue: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resumeStatDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.25)' },

  filtreList: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: slate[200],
  },
  chipActive:     { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipLabel:      { fontSize: 13, fontWeight: '500', color: slate[500] },
  chipLabelActive:{ color: '#fff', fontWeight: '600' },
  chipMois:       { backgroundColor: Colors.surface, borderColor: slate[200] },
  chipMoisActive: { backgroundColor: blue[50], borderColor: Colors.primary },
  chipLabelMoisActive: { color: Colors.primary, fontWeight: '600' },

  groupe: { marginTop: 8, paddingHorizontal: 16, gap: 8 },
  moisHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  moisTitre:  { fontSize: 15, fontWeight: '700', color: Colors.text },
  moisTotal:  { fontSize: 14, fontWeight: '600', color: Colors.primary },

  card: {
    backgroundColor: Colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: slate[200], overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 12 },
  rowIconBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: slate[100], alignItems: 'center', justifyContent: 'center' },
  rowIconText: { fontSize: 18 },
  rowLeft: { flex: 1, gap: 3 },
  rowRef:  { fontSize: 14, fontWeight: '600', color: Colors.text },
  rowMeta: { fontSize: 12, color: slate[400] },
  rowRight: { alignItems: 'flex-end', gap: 4 },
  rowMontant: { fontSize: 14, fontWeight: '700', color: Colors.text },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  separator: { height: 1, backgroundColor: slate[100], marginHorizontal: 14 },

  empty: { marginTop: 48, alignItems: 'center', paddingHorizontal: 24 },
  emptyText: { fontSize: 15, color: slate[400], textAlign: 'center' },
});

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { Colors, blue, slate } from '@/shared/constants/theme';
import { formatMontant, formatDate } from '@/shared/utils/format';
import { useFraisVehicule } from '../hooks/useFraisVehicule';
import type { FraisApi } from '../types/frais.types';

interface Props {
  id: string;
  nom: string;
  immatriculation: string;
}

// ─── Config catégories ────────────────────────────────────────────────────────

const ICONE_PAR_CODE: Record<string, string> = {
  carburant:  '⛽',
  reparation: '🔧',
  entretien:  '🛠️',
  pneus:      '🔵',
  lavage:     '🫧',
  autre:      '📋',
};

function iconeType(code: string): string {
  return ICONE_PAR_CODE[code] ?? '📋';
}

// ─── Filtres disponibles (construits depuis les données réelles) ───────────────

const FILTRE_TOUS = 'tous';

// ─── Composants ──────────────────────────────────────────────────────────────

function FraisRow({ item }: Readonly<{ item: FraisApi }>) {
  const statut = item.statut === 'approuve'
    ? { label: 'Approuvé', color: '#16a34a', bg: '#dcfce7' }
    : item.statut === 'rejete'
      ? { label: 'Rejeté', color: '#dc2626', bg: '#fee2e2' }
      : { label: 'En attente', color: '#ca8a04', bg: '#fef9c3' };

  return (
    <View style={styles.row}>
      <View style={styles.rowIconBox}>
        <Text style={styles.rowIconText}>{iconeType(item.type_code)}</Text>
      </View>
      <View style={styles.rowLeft}>
        <Text style={styles.rowRef}>{item.type_label}</Text>
        <Text style={styles.rowMeta}>{item.date ? formatDate(item.date) : '—'}</Text>
        {item.commentaire ? <Text style={styles.rowComment} numberOfLines={1}>{item.commentaire}</Text> : null}
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.rowMontant}>{formatMontant(item.montant)}</Text>
        <View style={[styles.badge, { backgroundColor: statut.bg }]}>
          <Text style={[styles.badgeText, { color: statut.color }]}>{statut.label}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Écran principal ─────────────────────────────────────────────────────────

export default function VehiculeFraisScreen({ id, nom, immatriculation }: Readonly<Props>) {
  const insets = useSafeAreaInsets();
  const [filtreCode, setFiltreCode] = useState<string>(FILTRE_TOUS);
  const [moisActif, setMoisActif]   = useState<string>(FILTRE_TOUS);
  const [refreshing, setRefreshing] = useState(false);

  const { frais, loading, error, load } = useFraisVehicule(id);

  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  // Catégories uniques présentes dans les données
  const categories = useMemo(() => {
    const seen = new Set<string>();
    return frais.filter(f => {
      if (seen.has(f.type_code)) return false;
      seen.add(f.type_code);
      return true;
    }).map(f => ({ code: f.type_code, label: f.type_label }));
  }, [frais]);

  // Mois disponibles
  const moisDisponibles = useMemo(
    () => [...new Set(frais.map(f => f.mois))],
    [frais],
  );

  // Données filtrées groupées par mois
  const groupes = useMemo(() => {
    const filtered = frais
      .filter(f => moisActif === FILTRE_TOUS || f.mois === moisActif)
      .filter(f => filtreCode === FILTRE_TOUS || f.type_code === filtreCode);

    const byMois: Record<string, FraisApi[]> = {};
    filtered.forEach(f => {
      if (!byMois[f.mois]) byMois[f.mois] = [];
      byMois[f.mois].push(f);
    });

    return Object.entries(byMois).map(([mois, items]) => ({
      mois,
      items,
      total: items.reduce((s, i) => s + i.montant, 0),
    }));
  }, [frais, filtreCode, moisActif]);

  const totalFiltré  = groupes.reduce((s, g) => s + g.total, 0);
  const nombreFiltré = groupes.reduce((n, g) => n + g.items.length, 0);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[Colors.primary]} tintColor={Colors.primary} />
      }>

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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtreList}>
        <TouchableOpacity
          key={FILTRE_TOUS}
          onPress={() => setFiltreCode(FILTRE_TOUS)}
          activeOpacity={0.7}
          style={[styles.chip, filtreCode === FILTRE_TOUS && styles.chipActive]}>
          <Text style={[styles.chipLabel, filtreCode === FILTRE_TOUS && styles.chipLabelActive]}>Tous</Text>
        </TouchableOpacity>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.code}
            onPress={() => setFiltreCode(cat.code)}
            activeOpacity={0.7}
            style={[styles.chip, filtreCode === cat.code && styles.chipActive]}>
            <Text style={[styles.chipLabel, filtreCode === cat.code && styles.chipLabelActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filtre mois */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtreList}>
        <TouchableOpacity onPress={() => setMoisActif(FILTRE_TOUS)} activeOpacity={0.7}
          style={[styles.chip, styles.chipMois, moisActif === FILTRE_TOUS && styles.chipMoisActive]}>
          <Text style={[styles.chipLabel, moisActif === FILTRE_TOUS && styles.chipLabelMoisActive]}>Tous les mois</Text>
        </TouchableOpacity>
        {moisDisponibles.map(mois => (
          <TouchableOpacity key={mois} onPress={() => setMoisActif(mois)} activeOpacity={0.7}
            style={[styles.chip, styles.chipMois, moisActif === mois && styles.chipMoisActive]}>
            <Text style={[styles.chipLabel, moisActif === mois && styles.chipLabelMoisActive]}>{mois}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contenu */}
      {loading && (
        <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
      )}

      {!loading && error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && groupes.map(groupe => (
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

      {!loading && !error && groupes.length === 0 && (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Aucun frais pour ce filtre</Text>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },

  resumeCard: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20, paddingVertical: 20,
    marginHorizontal: 16, marginTop: 16,
    borderRadius: 16, gap: 12,
  },
  resumeNom:          { color: '#fff', fontSize: 18, fontWeight: '700' },
  resumeImmat:        { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  resumeStats:        { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 4 },
  resumeStatLabel:    { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  resumeStatValue:    { color: '#fff', fontSize: 16, fontWeight: '700' },
  resumeStatDivider:  { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.25)' },

  filtreList:         { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip:               { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: slate[200] },
  chipActive:         { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipLabel:          { fontSize: 13, fontWeight: '500', color: slate[500] },
  chipLabelActive:    { color: '#fff', fontWeight: '600' },
  chipMois:           { backgroundColor: Colors.surface, borderColor: slate[200] },
  chipMoisActive:     { backgroundColor: blue[50], borderColor: Colors.primary },
  chipLabelMoisActive:{ color: Colors.primary, fontWeight: '600' },

  groupe:    { marginTop: 8, paddingHorizontal: 16, gap: 8 },
  moisHeader:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  moisTitre: { fontSize: 15, fontWeight: '700', color: Colors.text },
  moisTotal: { fontSize: 14, fontWeight: '600', color: Colors.primary },

  card:      { backgroundColor: Colors.surface, borderRadius: 14, borderWidth: 1, borderColor: slate[200], overflow: 'hidden' },
  row:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 12 },
  rowIconBox:{ width: 38, height: 38, borderRadius: 10, backgroundColor: slate[100], alignItems: 'center', justifyContent: 'center' },
  rowIconText:{ fontSize: 18 },
  rowLeft:   { flex: 1, gap: 3 },
  rowRef:    { fontSize: 14, fontWeight: '600', color: Colors.text },
  rowMeta:   { fontSize: 12, color: slate[400] },
  rowComment:{ fontSize: 12, color: slate[400], fontStyle: 'italic' },
  rowRight:  { alignItems: 'flex-end', gap: 4 },
  rowMontant:{ fontSize: 14, fontWeight: '700', color: Colors.text },
  badge:     { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  separator: { height: 1, backgroundColor: slate[100], marginHorizontal: 14 },

  center:    { marginTop: 48, alignItems: 'center', paddingHorizontal: 24 },
  errorText: { fontSize: 14, color: '#dc2626', textAlign: 'center' },
  emptyText: { fontSize: 15, color: slate[400], textAlign: 'center' },
});

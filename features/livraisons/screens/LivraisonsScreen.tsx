import { useMemo } from 'react';
import {
  ActivityIndicator,
  AppState,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { useTheme } from '@/shared/contexts/ThemeContext';
import { useLivraisonsEnCours } from '../hooks/useLivraisonsEnCours';
import type { LivraisonEnCours } from '../types/livraison.types';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ─── Carte livraison ─────────────────────────────────────────────────────────

function LivraisonCard({ item }: Readonly<{ item: LivraisonEnCours }>) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      {/* En-tête */}
      <View style={styles.cardHeader}>
        <View style={styles.refRow}>
          <Text style={styles.reference}>{item.reference}</Text>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeLabel}>En cours</Text>
          </View>
        </View>
      </View>

      {/* Route */}
      <View style={styles.route}>
        <View style={styles.routePoint}>
          <View style={[styles.routeDot, styles.routeDotSource]} />
          <Text style={styles.routeNom}>{item.site_source}</Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routePoint}>
          <View style={[styles.routeDot, styles.routeDotDest]} />
          <Text style={styles.routeNom}>{item.site_destination}</Text>
        </View>
      </View>

      {/* Infos */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Véhicule</Text>
          <Text style={styles.infoValeur}>
            {item.vehicule ? `${item.vehicule.nom} · ${item.vehicule.immatriculation}` : '—'}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Packs</Text>
          <Text style={styles.infoValeur}>{item.nb_packs}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Départ</Text>
          <Text style={styles.infoValeur}>{formatDate(item.date_depart)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Arrivée prévue</Text>
          <Text style={styles.infoValeur}>{formatDate(item.date_arrivee_prevue)}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Écran ───────────────────────────────────────────────────────────────────

export default function LivraisonsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { livraisons, loading, refreshing, error, load, refetch } = useLivraisonsEnCours();

  useEffect(() => { load(); }, [load]);

  useFocusEffect(useCallback(() => { refetch(); }, [refetch]));

  useEffect(() => {
    const sub = AppState.addEventListener('change', s => { if (s === 'active') refetch(); });
    return () => sub.remove();
  }, [refetch]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refetch} colors={[colors.primary]} tintColor={colors.primary} />
      }>

      <Text style={styles.titre}>Livraisons en cours</Text>

      {loading && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {!loading && error && (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={refetch} activeOpacity={0.8} style={styles.retryBtn}>
            <Text style={styles.retryBtnText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && livraisons.length === 0 && (
        <View style={styles.centerBox}>
          <Text style={styles.emptyIcon}>🚚</Text>
          <Text style={styles.emptyTitle}>Aucune livraison en cours</Text>
          <Text style={styles.emptyText}>Vos véhicules sont au repos.</Text>
        </View>
      )}

      {!loading && !error && livraisons.length > 0 && (
        <>
          <Text style={styles.sousTitre}>
            {livraisons.length} livraison{livraisons.length > 1 ? 's' : ''} active{livraisons.length > 1 ? 's' : ''}
          </Text>
          <View style={styles.liste}>
            {livraisons.map(item => <LivraisonCard key={item.id} item={item} />)}
          </View>
        </>
      )}
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

function makeStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    scroll:    { flex: 1, backgroundColor: colors.background },
    content:   { paddingHorizontal: 16 },
    titre:     { fontSize: 24, fontWeight: '700', color: colors.text },
    sousTitre: { fontSize: 14, color: colors.textMuted, marginTop: 2, marginBottom: 16 },
    liste:     { gap: 12 },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      gap: 14,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    refRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
    reference:  { fontSize: 15, fontWeight: '700', color: colors.text },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: colors.infoBg,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    badgeDot:   { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
    badgeLabel: { fontSize: 12, fontWeight: '600', color: colors.primary },

    route:          { flexDirection: 'row', alignItems: 'center', gap: 8 },
    routePoint:     { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
    routeDot:       { width: 10, height: 10, borderRadius: 5 },
    routeDotSource: { backgroundColor: colors.textMuted },
    routeDotDest:   { backgroundColor: colors.primary },
    routeLine:      { flex: 1, height: 1, backgroundColor: colors.border },
    routeNom:       { fontSize: 14, fontWeight: '600', color: colors.text },

    infoRow:   { flexDirection: 'row', gap: 16 },
    infoItem:  { flex: 1, gap: 2 },
    infoLabel: { fontSize: 11, color: colors.textMuted },
    infoValeur:{ fontSize: 13, fontWeight: '600', color: colors.text },

    centerBox:    { marginTop: 60, alignItems: 'center', gap: 12 },
    errorText:    { fontSize: 14, color: colors.danger, textAlign: 'center' },
    retryBtn:     { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 20 },
    retryBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
    emptyIcon:    { fontSize: 48 },
    emptyTitle:   { fontSize: 18, fontWeight: '700', color: colors.text },
    emptyText:    { fontSize: 14, color: colors.textMuted },
  });
}

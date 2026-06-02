import {
  ActivityIndicator,
  AppState,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { Colors, slate } from '@/shared/constants/theme';
import { useVehiculesMine } from '@/features/vehicule/hooks/useVehiculesMine';
import type { VehiculeApi } from '@/features/vehicule/types/vehicule.types';

// ─── Icône par type (labels retournés par le backend) ─────────────────────────

const TYPE_ICONE: Record<string, string> = {
  Camion:   '🚚',
  Vanne:    '🚐',
  Moto:     '🏍️',
  Tricycle: '🛺',
  'Pick-up': '🛻',
  Autre:    '🚗',
};

function icone(type: string) {
  return TYPE_ICONE[type] ?? '🚗';
}

// Affiche la photo si disponible, emoji en fallback si erreur de chargement
function VehiculeIcon({ photoUrl, type }: Readonly<{ photoUrl: string | null; type: string }>) {
  const [erreur, setErreur] = useState(false);

  if (photoUrl && !erreur) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={styles.photo}
        resizeMode="cover"
        onError={() => setErreur(true)}
      />
    );
  }
  return <Text style={styles.iconText}>{icone(type)}</Text>;
}

// ─── Carte véhicule ──────────────────────────────────────────────────────────

function VehiculeCard({ vehicule }: Readonly<{ vehicule: VehiculeApi }>) {
  function handlePress() {
    router.push({
      pathname: `/vehicule/${vehicule.id}`,
      params: { nom: vehicule.nom, immatriculation: vehicule.immatriculation },
    });
  }

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress} style={styles.card}>
      <View style={styles.iconBox}>
        <VehiculeIcon photoUrl={vehicule.photo_url} type={vehicule.type} />
      </View>

      <View style={styles.infos}>
        <View style={styles.infosTop}>
          <Text style={styles.nom} numberOfLines={1}>{vehicule.nom}</Text>
          <View style={[styles.badge, vehicule.en_livraison ? styles.badgeLivraison : styles.badgeRepos]}>
            <View style={[styles.badgeDot, vehicule.en_livraison ? styles.badgeLivraisonDot : styles.badgeReposDot]} />
            <Text style={[styles.badgeText, vehicule.en_livraison ? styles.badgeLivraisonText : styles.badgeReposText]}>
              {vehicule.en_livraison ? 'En livraison' : 'Au repos'}
            </Text>
          </View>
        </View>

        <Text style={styles.immat}>{vehicule.immatriculation}</Text>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Type</Text>
            <Text style={styles.metaValue}>{vehicule.type}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Capacité</Text>
            <Text style={styles.metaValue}>{vehicule.capacite} packs</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Rôle</Text>
            <Text style={styles.metaValue}>
              {vehicule.role === 'proprietaire' ? 'Propriétaire' : 'Livreur'}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

// ─── États spéciaux ──────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <View style={styles.centerBox}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.centerText}>Chargement des véhicules…</Text>
    </View>
  );
}

function ErrorState({ message, onRetry }: Readonly<{ message: string; onRetry: () => void }>) {
  return (
    <View style={styles.centerBox}>
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity activeOpacity={0.8} onPress={onRetry} style={styles.retryBtn}>
        <Text style={styles.retryBtnText}>Réessayer</Text>
      </TouchableOpacity>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.centerBox}>
      <Text style={styles.emptyIcon}>🚗</Text>
      <Text style={styles.emptyTitle}>Aucun véhicule</Text>
      <Text style={styles.emptyText}>Vous n'avez pas encore de véhicule associé à votre compte.</Text>
    </View>
  );
}

// ─── Écran principal ─────────────────────────────────────────────────────────

export default function VehiculesScreen() {
  const insets = useSafeAreaInsets();
  const { vehicules, loading, refreshing, error, load, refetch } = useVehiculesMine();

  // Chargement initial
  useEffect(() => { load(); }, [load]);

  // Rechargement à chaque retour sur cet onglet
  useFocusEffect(
    useCallback(() => { refetch(); }, [refetch])
  );

  // Rechargement quand l'app revient au premier plan (ex : retour depuis le navigateur admin)
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') refetch();
    });
    return () => sub.remove();
  }, [refetch]);

  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error)   return <ErrorState message={error} onRetry={refetch} />;
    if (vehicules.length === 0) return <EmptyState />;

    return (
      <>
        <Text style={styles.sousTitre}>
          {vehicules.length} véhicule{vehicules.length > 1 ? 's' : ''}
        </Text>
        <View style={styles.liste}>
          {vehicules.map((v) => <VehiculeCard key={v.id} vehicule={v} />)}
        </View>
      </>
    );
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }>
        <Text style={styles.titre}>Mes véhicules</Text>
        {renderContent()}
      </ScrollView>

      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => router.push('/vehicule/proposer')}>
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabLabel}>Proposer un véhicule</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper:  { flex: 1, backgroundColor: Colors.background },
  scroll:   { flex: 1 },
  content:  { paddingHorizontal: 16 },
  titre:    { fontSize: 24, fontWeight: '700', color: Colors.text },
  sousTitre:{ fontSize: 14, color: slate[400], marginTop: 2, marginBottom: 20 },
  liste:    { gap: 12 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: slate[200],
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: slate[100],
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  photo:    { width: 52, height: 52, borderRadius: 14 },
  iconText: { fontSize: 26 },
  infos:    { flex: 1, gap: 4 },
  infosTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  nom:      { fontSize: 15, fontWeight: '700', color: Colors.text, flex: 1 },
  immat:    { fontSize: 13, color: slate[400] },
  meta:     { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 10 },
  metaItem: { gap: 1 },
  metaLabel:{ fontSize: 11, color: slate[400] },
  metaValue:{ fontSize: 13, fontWeight: '600', color: Colors.text },
  metaDivider: { width: 1, height: 28, backgroundColor: slate[200] },

  badge:    { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  badgeDot: { width: 7, height: 7, borderRadius: 4 },
  badgeText:{ fontSize: 12, fontWeight: '600' },

  badgeLivraison:    { backgroundColor: '#eff6ff' },
  badgeLivraisonDot: { backgroundColor: Colors.primary },
  badgeLivraisonText:{ color: Colors.primary },

  badgeRepos:    { backgroundColor: slate[100] },
  badgeReposDot: { backgroundColor: slate[400] },
  badgeReposText:{ color: slate[500] },
  chevron:        { fontSize: 22, color: slate[300] },

  centerBox:  { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 12 },
  centerText: { fontSize: 14, color: slate[400], marginTop: 8 },
  errorText:  { fontSize: 14, color: '#dc2626', textAlign: 'center', paddingHorizontal: 16 },
  retryBtn:   { marginTop: 4, backgroundColor: Colors.primary, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 20 },
  retryBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  emptyIcon:  { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  emptyText:  { fontSize: 14, color: slate[400], textAlign: 'center', paddingHorizontal: 32, lineHeight: 20 },

  fab: {
    position: 'absolute', right: 20,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14, paddingHorizontal: 20,
    borderRadius: 28, gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
  },
  fabIcon:  { color: '#fff', fontSize: 22, fontWeight: '300', lineHeight: 24 },
  fabLabel: { color: '#fff', fontSize: 14, fontWeight: '600' },
});

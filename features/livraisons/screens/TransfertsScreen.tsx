import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/contexts/ThemeContext';
import { useTransferts } from '../hooks/useTransferts';
import type { Transfert } from '../types/transfert.types';

type Tab = 'en_cours' | 'historique';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function StatutBadge({ statut, label }: { statut: string; label: string }) {
  const { colors } = useTheme();
  const badgeColors: Record<string, { bg: string; text: string }> = {
    brouillon:  { bg: colors.surfaceAlt,  text: colors.textMuted },
    chargement: { bg: colors.warningBg,   text: colors.warning },
    transit:    { bg: colors.infoBg,      text: colors.primary },
    reception:  { bg: colors.successBg,   text: colors.success },
    cloture:    { bg: colors.successBg,   text: colors.success },
    annule:     { bg: colors.dangerBg,    text: colors.danger },
  };
  const c = badgeColors[statut] ?? badgeColors.brouillon;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.text }]}>{label}</Text>
    </View>
  );
}

function TransfertCard({ item, onPress }: { item: Transfert; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.cardTop}>
        <Text style={[styles.cardRef, { color: colors.text }]}>{item.reference}</Text>
        <StatutBadge statut={item.statut} label={item.statut_label} />
      </View>

      <View style={styles.trajet}>
        <View style={[styles.trajetDot, { backgroundColor: colors.textMuted }]} />
        <Text style={[styles.trajetNom, { color: colors.text }]} numberOfLines={1}>
          {item.site_source.nom}
        </Text>
      </View>
      <View style={[styles.trajetLine, { backgroundColor: colors.border }]} />
      <View style={styles.trajet}>
        <View style={[styles.trajetDot, { backgroundColor: colors.primary }]} />
        <Text style={[styles.trajetNom, { color: colors.text }]} numberOfLines={1}>
          {item.site_destination.nom}
        </Text>
      </View>

      <View style={styles.cardMeta}>
        {item.vehicule && (
          <Text style={[styles.metaText, { color: colors.textMuted }]} numberOfLines={1}>
            {item.vehicule.nom_vehicule} · {item.vehicule.immatriculation}
          </Text>
        )}
        <Text style={[styles.metaText, { color: colors.textMuted }]}>
          {item.nb_packs_demandes ?? '—'} packs · Départ {formatDate(item.date_depart_reelle ?? item.date_depart_prevue)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function TransfertsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [tab, setTab] = useState<Tab>('en_cours');

  const { transferts, loading, refreshing, error, load, refetch } = useTransferts(tab);

  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => { refetch(); }, [refetch]));

  const styles = useMemo(() => makeStyles(colors), [colors]);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'en_cours', label: 'En cours' },
    { key: 'historique', label: 'Historique' },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Livraisons</Text>
      </View>

      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        {tabs.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, tab === t.key && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setTab(t.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabLabel, { color: tab === t.key ? colors.primary : colors.textMuted }]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            onPress={refetch}
          >
            <Text style={styles.retryBtnText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={transferts}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TransfertCard
              item={item}
              onPress={() => router.push(`/livraisons/${item.id}` as never)}
            />
          )}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 24 },
            transferts.length === 0 && styles.listEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refetch}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🚚</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {tab === 'en_cours' ? 'Aucune livraison en cours' : 'Aucun historique'}
              </Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                {tab === 'en_cours'
                  ? 'Vous n\'avez pas de transferts actifs.'
                  : 'Vos livraisons terminées apparaîtront ici.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    root:    { flex: 1, backgroundColor: colors.background },
    header:  { paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
    title:   { fontSize: 22, fontWeight: '700' },

    tabBar:  { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth },
    tabBtn:  { flex: 1, alignItems: 'center', paddingVertical: 12 },
    tabLabel: { fontSize: 14, fontWeight: '600' },

    list:    { padding: 16, gap: 12 },
    listEmpty: { flex: 1 },

    card: {
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      padding: 14,
      gap: 8,
    },
    cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardRef: { fontSize: 15, fontWeight: '700' },

    badge:     { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    badgeText: { fontSize: 12, fontWeight: '600' },

    trajet:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
    trajetDot:  { width: 8, height: 8, borderRadius: 4 },
    trajetLine: { width: 1, height: 12, marginLeft: 3.5 },
    trajetNom:  { fontSize: 14, fontWeight: '500', flex: 1 },

    cardMeta: { gap: 2 },
    metaText: { fontSize: 12 },

    center:      { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
    errorText:   { fontSize: 14, textAlign: 'center' },
    retryBtn:    { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
    retryBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },

    empty:      { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
    emptyIcon:  { fontSize: 48 },
    emptyTitle: { fontSize: 18, fontWeight: '700' },
    emptyText:  { fontSize: 14, textAlign: 'center' },
  });
}

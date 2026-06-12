import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/contexts/ThemeContext';
import { livraisonService } from '../services/livraison.service';
import { useTransfertDetail } from '../hooks/useTransfertDetail';
import type { TransfertLigne } from '../types/transfert.types';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatNum(val: number | null | undefined): string {
  if (val == null) return '—';
  return new Intl.NumberFormat('fr-FR').format(val);
}

function StatutBadge({ statut, label }: { statut: string; label: string }) {
  const { colors } = useTheme();
  const map: Record<string, { bg: string; text: string }> = {
    brouillon:  { bg: colors.surfaceAlt,  text: colors.textMuted },
    chargement: { bg: colors.warningBg,   text: colors.warning },
    transit:    { bg: colors.infoBg,      text: colors.primary },
    reception:  { bg: colors.successBg,   text: colors.success },
    cloture:    { bg: colors.successBg,   text: colors.success },
    annule:     { bg: colors.dangerBg,    text: colors.danger },
  };
  const c = map[statut] ?? map.brouillon;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.text }]}>{label}</Text>
    </View>
  );
}

function LigneRow({ ligne }: { ligne: TransfertLigne }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.ligneRow, { borderColor: colors.border }]}>
      <View style={styles.ligneBody}>
        <Text style={[styles.ligneNom, { color: colors.text }]} numberOfLines={2}>
          {ligne.produit_nom ?? 'Produit'}
        </Text>
        {ligne.produit_code ? (
          <Text style={[styles.ligneCode, { color: colors.textMuted }]}>{ligne.produit_code}</Text>
        ) : null}
      </View>
      <View style={styles.ligneQtys}>
        <View style={styles.qtyItem}>
          <Text style={[styles.qtyLabel, { color: colors.textMuted }]}>Demandé</Text>
          <Text style={[styles.qtyVal, { color: colors.text }]}>{formatNum(ligne.quantite_demandee)}</Text>
        </View>
        {ligne.quantite_chargee != null && (
          <View style={styles.qtyItem}>
            <Text style={[styles.qtyLabel, { color: colors.textMuted }]}>Chargé</Text>
            <Text style={[styles.qtyVal, { color: colors.text }]}>{formatNum(ligne.quantite_chargee)}</Text>
          </View>
        )}
        {ligne.quantite_recue != null && (
          <View style={styles.qtyItem}>
            <Text style={[styles.qtyLabel, { color: colors.textMuted }]}>Reçu</Text>
            <Text style={[styles.qtyVal, { color: colors.text }]}>{formatNum(ligne.quantite_recue)}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

export default function TransfertDetailScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transfert, loading, error, load, reload } = useTransfertDetail(id ?? '');
  const [acting, setActing] = useState(false);

  useEffect(() => { load(); }, [load]);

  const handleDemarrerChargement = useCallback(() => {
    Alert.alert(
      'Démarrer le chargement',
      'Confirmer le démarrage du chargement de ce transfert ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            setActing(true);
            const result = await livraisonService.demarrerChargement(id ?? '');
            setActing(false);
            if (result.ok) {
              reload();
            } else {
              Alert.alert('Erreur', result.error);
            }
          },
        },
      ]
    );
  }, [id, reload]);

  const handleConfirmerDepart = useCallback(() => {
    Alert.alert(
      'Confirmer le départ',
      'Toutes les quantités sont chargées. Confirmer le départ du véhicule ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer le départ',
          onPress: async () => {
            setActing(true);
            const result = await livraisonService.confirmerDepart(id ?? '');
            setActing(false);
            if (result.ok) {
              reload();
            } else {
              Alert.alert('Erreur', result.error);
            }
          },
        },
      ]
    );
  }, [id, reload]);

  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (loading) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={[styles.backLabel, { color: colors.primary }]}>‹ Retour</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </View>
    );
  }

  if (error || !transfert) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={[styles.backLabel, { color: colors.primary }]}>‹ Retour</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <Text style={{ color: colors.danger }}>{error ?? 'Transfert introuvable.'}</Text>
          <TouchableOpacity onPress={load} style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
            <Text style={styles.actionBtnText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toutesLignesChargees =
    transfert.statut === 'chargement' &&
    transfert.lignes.length > 0 &&
    transfert.lignes.every(l => l.quantite_chargee != null);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backLabel, { color: colors.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={[styles.headerRef, { color: colors.text }]} numberOfLines={1}>
          {transfert.reference}
        </Text>
        <StatutBadge statut={transfert.statut} label={transfert.statut_label} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Trajet */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>TRAJET</Text>
          <View style={styles.trajetCol}>
            <View style={styles.trajetRow}>
              <View style={[styles.trajetDot, { backgroundColor: colors.textMuted }]} />
              <Text style={[styles.trajetNom, { color: colors.text }]}>{transfert.site_source.nom}</Text>
            </View>
            <View style={[styles.trajetLine, { backgroundColor: colors.border }]} />
            <View style={styles.trajetRow}>
              <View style={[styles.trajetDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.trajetNom, { color: colors.text }]}>{transfert.site_destination.nom}</Text>
            </View>
          </View>
        </View>

        {/* Infos */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>INFORMATIONS</Text>
          {transfert.vehicule && (
            <InfoRow
              label="Véhicule"
              value={`${transfert.vehicule.nom_vehicule} · ${transfert.vehicule.immatriculation}`}
            />
          )}
          {transfert.equipe && <InfoRow label="Équipe" value={transfert.equipe.nom} />}
          <InfoRow label="Départ prévu" value={formatDate(transfert.date_depart_prevue)} />
          <InfoRow label="Départ réel" value={formatDate(transfert.date_depart_reelle)} />
          <InfoRow label="Arrivée prévue" value={formatDate(transfert.date_arrivee_prevue)} />
          <InfoRow label="Packs demandés" value={formatNum(transfert.nb_packs_demandes)} />
          {transfert.nb_packs_charges != null && (
            <InfoRow label="Packs chargés" value={formatNum(transfert.nb_packs_charges)} />
          )}
          {transfert.notes ? <InfoRow label="Notes" value={transfert.notes} /> : null}
        </View>

        {/* Lignes */}
        {transfert.lignes.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>PRODUITS</Text>
            {transfert.lignes.map(ligne => (
              <LigneRow key={ligne.id} ligne={ligne} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Actions */}
      {(transfert.statut === 'brouillon' || transfert.statut === 'chargement') && (
        <View style={[styles.actions, { borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
          {transfert.statut === 'brouillon' && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              onPress={handleDemarrerChargement}
              disabled={acting}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnText}>
                {acting ? 'En cours…' : 'Démarrer le chargement'}
              </Text>
            </TouchableOpacity>
          )}

          {transfert.statut === 'chargement' && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary, opacity: acting ? 0.6 : 1 }]}
              onPress={() => router.push(`/livraisons/${id}/chargement` as never)}
              disabled={acting}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnText}>Saisir les quantités</Text>
            </TouchableOpacity>
          )}

          {toutesLignesChargees && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.success, marginTop: 8 }]}
              onPress={handleConfirmerDepart}
              disabled={acting}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnText}>
                {acting ? 'En cours…' : 'Confirmer le départ'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1 },
  scroll:  { flex: 1 },
  content: { padding: 16, gap: 12 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn:    { paddingRight: 4 },
  backLabel:  { fontSize: 17 },
  headerRef:  { flex: 1, fontSize: 15, fontWeight: '700' },

  badge:     { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600' },

  section: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 10,
  },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },

  trajetCol:  { gap: 2, paddingLeft: 2 },
  trajetRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  trajetLine: { width: 1, height: 16, marginLeft: 3.5 },
  trajetDot:  { width: 8, height: 8, borderRadius: 4 },
  trajetNom:  { fontSize: 15, fontWeight: '600' },

  infoRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  infoLabel:  { fontSize: 13, flex: 1 },
  infoValue:  { fontSize: 13, fontWeight: '600', textAlign: 'right', flex: 1 },

  ligneRow:   { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10, gap: 8 },
  ligneBody:  { gap: 2 },
  ligneNom:   { fontSize: 14, fontWeight: '600' },
  ligneCode:  { fontSize: 12 },
  ligneQtys:  { flexDirection: 'row', gap: 16 },
  qtyItem:    { gap: 2 },
  qtyLabel:   { fontSize: 11 },
  qtyVal:     { fontSize: 14, fontWeight: '700' },

  center:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },

  actions: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  actionBtn:     { borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

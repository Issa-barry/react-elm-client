import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/contexts/ThemeContext';
import { livraisonService } from '../services/livraison.service';
import { useTransfertDetail } from '../hooks/useTransfertDetail';
import type { TransfertLigne } from '../types/transfert.types';

export default function ChargementScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transfert, loading, error, load } = useTransfertDetail(id ?? '');
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (transfert) {
      const init: Record<string, string> = {};
      transfert.lignes.forEach(l => {
        init[l.id] = l.quantite_chargee != null ? String(l.quantite_chargee) : '';
      });
      setQuantities(init);
    }
  }, [transfert]);

  const allFilled = useMemo(() => {
    if (!transfert || transfert.lignes.length === 0) return false;
    return transfert.lignes.every(l => {
      const v = quantities[l.id] ?? '';
      return v.trim() !== '' && /^\d+$/.test(v.trim()) && Number(v) >= 0;
    });
  }, [transfert, quantities]);

  const handleSave = useCallback(async () => {
    if (!transfert || !allFilled) return;
    setSaving(true);
    const lignes = transfert.lignes.map(l => ({
      id: l.id,
      quantite_chargee: Number(quantities[l.id] ?? '0'),
    }));
    const result = await livraisonService.saisirQuantitesChargees(id ?? '', lignes);
    setSaving(false);
    if (result.ok) {
      router.back();
    } else {
      Alert.alert('Erreur', result.error);
    }
  }, [transfert, quantities, allFilled, id]);

  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backLabel, { color: colors.primary }]}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Chargement</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : error || !transfert ? (
        <View style={styles.center}>
          <Text style={{ color: colors.danger }}>{error ?? 'Erreur chargement.'}</Text>
          <TouchableOpacity onPress={load} style={[styles.btn, { backgroundColor: colors.primary }]}>
            <Text style={styles.btnText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              {transfert.reference} · Saisir les quantités chargées
            </Text>

            {transfert.lignes.map((ligne: TransfertLigne) => (
              <View
                key={ligne.id}
                style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={styles.cardTop}>
                  <Text style={[styles.produitNom, { color: colors.text }]} numberOfLines={2}>
                    {ligne.produit_nom ?? 'Produit'}
                  </Text>
                  {ligne.produit_code ? (
                    <Text style={[styles.produitCode, { color: colors.textMuted }]}>
                      {ligne.produit_code}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.qtyRow}>
                  <Text style={[styles.demande, { color: colors.textMuted }]}>
                    Demandé : {ligne.quantite_demandee}
                  </Text>
                  <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      value={quantities[ligne.id] ?? ''}
                      onChangeText={v => setQuantities(prev => ({ ...prev, [ligne.id]: v.replace(/[^0-9]/g, '') }))}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={colors.textMuted}
                      maxLength={6}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.primary, opacity: !allFilled || saving ? 0.5 : 1 }]}
              onPress={handleSave}
              disabled={!allFilled || saving}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>
                {saving ? 'Enregistrement…' : 'Valider le chargement'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    root:    { flex: 1, backgroundColor: colors.background },
    scroll:  { flex: 1 },
    content: { padding: 16, gap: 12 },
    center:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    backBtn:      { minWidth: 60 },
    backLabel:    { fontSize: 17 },
    headerTitle:  { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700' },
    headerSpacer: { minWidth: 60 },

    subtitle: { fontSize: 13, marginBottom: 4 },

    card: {
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      padding: 14,
      gap: 10,
    },
    cardTop:    { gap: 2 },
    produitNom: { fontSize: 15, fontWeight: '600' },
    produitCode: { fontSize: 12 },

    qtyRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    demande: { fontSize: 13 },
    inputWrap: {
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      minWidth: 80,
      alignItems: 'center',
    },
    input: { fontSize: 18, fontWeight: '700', textAlign: 'center', minWidth: 60 },

    footer: { padding: 16, borderTopWidth: StyleSheet.hairlineWidth },
    btn:     { borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  });
}

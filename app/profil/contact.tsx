import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/contexts/ThemeContext';
import type { Colors } from '@/shared/constants/theme';

const SUPPORT_EMAIL = 'contact@eaulamaman.com';
const SUPPORT_PHONE = '+224620000000';

async function openEmail() {
  const url = `mailto:${SUPPORT_EMAIL}?subject=Support%20Eau%20la%20maman`;
  const ok = await Linking.canOpenURL(url).catch(() => false);
  if (ok) {
    await Linking.openURL(url);
  } else {
    Alert.alert('Impossible d\'ouvrir', `Contactez-nous à : ${SUPPORT_EMAIL}`);
  }
}

async function openPhone() {
  const url = `tel:${SUPPORT_PHONE}`;
  const ok = await Linking.canOpenURL(url).catch(() => false);
  if (ok) {
    await Linking.openURL(url);
  } else {
    Alert.alert('Impossible d\'appeler', `Appelez-nous au : ${SUPPORT_PHONE}`);
  }
}

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 32, gap: 16 }}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="headset-outline" size={36} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Comment pouvons-nous vous aider ?</Text>
          <Text style={styles.heroDesc}>Notre équipe est disponible du lundi au vendredi, de 8h à 18h (GMT).</Text>
        </View>

        <TouchableOpacity style={styles.contactCard} onPress={openEmail} activeOpacity={0.8}>
          <View style={[styles.contactIcon, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="mail-outline" size={22} color={colors.primary} />
          </View>
          <View style={styles.contactText}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{SUPPORT_EMAIL}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCard} onPress={openPhone} activeOpacity={0.8}>
          <View style={[styles.contactIcon, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="call-outline" size={22} color={colors.primary} />
          </View>
          <View style={styles.contactText}>
            <Text style={styles.contactLabel}>Téléphone</Text>
            <Text style={styles.contactValue}>{SUPPORT_PHONE}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function makeStyles(colors: typeof Colors) {
  return StyleSheet.create({
    root:         { flex: 1, backgroundColor: colors.background },
    header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.surface, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
    backBtn:      { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt },
    headerTitle:  { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: colors.text },
    headerSpacer: { width: 36 },
    hero:         { alignItems: 'center', paddingVertical: 20, gap: 10 },
    heroIcon:     { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
    heroTitle:    { fontSize: 17, fontWeight: '700', color: colors.text, textAlign: 'center' },
    heroDesc:     { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
    contactCard:  { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 14, padding: 16, gap: 14, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
    contactIcon:  { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    contactText:  { flex: 1 },
    contactLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 2 },
    contactValue: { fontSize: 15, fontWeight: '600', color: colors.text },
  });
}

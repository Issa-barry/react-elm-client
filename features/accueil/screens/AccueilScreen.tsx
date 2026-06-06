import { ActivityIndicator, AppState, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { useFocusEffect } from 'expo-router';

import { Colors } from '@/shared/constants/theme';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { IconSymbol } from '@/shared/components/ui/icon-symbol';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useGainsMine } from '@/features/gains/hooks/useGainsMine';
import { useQrPayload } from '../hooks/useQrPayload';
import GainsCarousel from '../components/GainsCarousel';
import SoldeVehicules from '../components/SoldeVehicules';

const QR_SIZE            = 90;
const QR_ZOOM_SIZE       = 240;
const QR_WRAPPER_PADDING = 12;
const QR_OVERLAP         = QR_SIZE / 2;
const HEADER_HEIGHT      = 140;
const QR_CARD_HEIGHT     = QR_SIZE + QR_WRAPPER_PADDING * 2;
const QR_BELOW_HEADER    = QR_CARD_HEIGHT - QR_OVERLAP;

function formatPhone(phone: string): string {
  if (!phone) return '';
  const match = /^\+(\d{3})(\d{3})(\d{2})(\d{2})(\d{2})$/.exec(phone);
  if (match) return `+${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
  return phone;
}

export default function AccueilScreen() {
  const insets = useSafeAreaInsets();
  const { logout } = useLogout();
  const { isDark, toggle: toggleTheme } = useTheme();
  const { user, loading: userLoading } = useCurrentUser();
  const [qrZoomed, setQrZoomed] = useState(false);
  const { gains, loading: gainsLoading, refreshing, error: gainsError, load, refetch } = useGainsMine();
  const { qrPayload, loading: qrLoading, load: loadQr } = useQrPayload();

  const nom    = user ? `${user.prenom} ${user.nom}` : '';
  const phone  = user?.telephone ?? '';
  const qrData = qrPayload ?? user?.id ?? 'eau-la-maman';

  // Chargement initial
  useEffect(() => { load(); loadQr(); }, [load, loadQr]);

  // Rechargement à chaque retour sur cet onglet
  useFocusEffect(
    useCallback(() => { refetch(); }, [refetch])
  );

  // Rechargement quand l'app revient au premier plan
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') refetch();
    });
    return () => sub.remove();
  }, [refetch]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refetch}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
        />
      }>

      {/* Header bleu */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        {/* Gauche : déconnexion */}
        <TouchableOpacity
          style={[styles.headerBtn, { top: insets.top + 12, left: 16 }]}
          onPress={logout}
          accessibilityLabel="Se déconnecter">
          <Text style={styles.logoutIcon}>⏻</Text>
        </TouchableOpacity>
        {/* Droite : notifications + thème */}
        <TouchableOpacity
          style={[styles.headerBtn, { top: insets.top + 12, right: 60 }]}
          onPress={() => {}}
          accessibilityLabel="Notifications">
          <IconSymbol name="bell.fill" size={20} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerBtn, { top: insets.top + 12, right: 16 }]}
          onPress={toggleTheme}
          accessibilityLabel={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}>
          <IconSymbol name={isDark ? 'sun.max.fill' : 'moon.fill'} size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* QR code flottant */}
      <View style={styles.qrAnchor}>
        <TouchableOpacity
          style={styles.qrWrapper}
          onPress={() => !userLoading && setQrZoomed(true)}
          activeOpacity={0.8}
          accessibilityLabel="Agrandir le QR code">
          {(userLoading || qrLoading)
            ? <View style={styles.qrPlaceholder}><ActivityIndicator color={Colors.primary} /></View>
            : <QRCode value={qrData} size={QR_SIZE} color="#000000" backgroundColor="#ffffff" />
          }
        </TouchableOpacity>
      </View>

      {/* Modal zoom QR */}
      <Modal
        visible={qrZoomed}
        transparent
        animationType="fade"
        onRequestClose={() => setQrZoomed(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setQrZoomed(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            {!qrLoading && <QRCode value={qrData} size={QR_ZOOM_SIZE} color="#000000" backgroundColor="#ffffff" />}
            <Text style={styles.modalHint}>Appuyez en dehors pour fermer</Text>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Infos utilisateur */}
      <View style={[styles.content, { paddingTop: QR_BELOW_HEADER + 24 }]}>
        {userLoading
          ? <ActivityIndicator color={Colors.primary} />
          : <>
              <Text style={styles.name}>{nom}</Text>
              <Text style={styles.phone}>{formatPhone(phone)}</Text>
            </>
        }
      </View>

      {/* Carousel des gains — données réelles */}
      <View style={styles.carouselSection}>
        <GainsCarousel gains={gains} loading={gainsLoading} />
      </View>

      {/* Solde par véhicule — données réelles */}
      <View style={styles.soldeSection}>
        <SoldeVehicules
          parVehicule={gains?.par_vehicule ?? []}
          loading={gainsLoading}
          error={gainsError}
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:  { backgroundColor: Colors.background },
  header:  { height: HEADER_HEIGHT, backgroundColor: Colors.primary },
  headerBtn: {
    position: 'absolute',
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoutIcon: { fontSize: 18, color: '#ffffff' },
  qrAnchor: {
    position: 'absolute',
    top: HEADER_HEIGHT - QR_OVERLAP,
    left: 0, right: 0,
    alignItems: 'center',
  },
  qrWrapper: {
    backgroundColor: Colors.background,
    padding: QR_WRAPPER_PADDING,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  qrPlaceholder:   { width: QR_SIZE, height: QR_SIZE, alignItems: 'center', justifyContent: 'center' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 20,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  modalHint: { fontSize: 12, color: '#9ca3af' },
  content:         { alignItems: 'center', paddingHorizontal: 24, gap: 6 },
  name:            { fontSize: 24, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  phone:           { fontSize: 15, color: Colors.textMuted, textAlign: 'center' },
  carouselSection: { marginTop: 24 },
  soldeSection:    { marginTop: 24 },
});

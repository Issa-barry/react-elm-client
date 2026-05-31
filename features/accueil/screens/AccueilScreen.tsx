import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

import { ThemedText } from '@/shared/components/themed-text';

const MOCK_USER = {
  nom: 'Moussa SIDIBÉ',
  telephone: '621234567',
  qrData: 'user-moussa-sidibe-001',
};

const QR_SIZE = 160;
const QR_WRAPPER_PADDING = 12;
const QR_OVERLAP = QR_SIZE / 2;
const HEADER_HEIGHT = 140;
// hauteur totale de la carte QR (image + padding haut/bas)
const QR_CARD_HEIGHT = QR_SIZE + QR_WRAPPER_PADDING * 2;
// portion qui dépasse sous le header
const QR_BELOW_HEADER = QR_CARD_HEIGHT - QR_OVERLAP;

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 9) {
    return `+224 ${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
  }
  return phone;
}

export default function AccueilScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}>

      {/* Header bleu */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]} />

      {/* QR code centré qui chevauche le header */}
      <View style={styles.qrAnchor}>
        <View style={styles.qrWrapper}>
          <QRCode value={MOCK_USER.qrData} size={QR_SIZE} />
        </View>
      </View>

      {/* Contenu blanc */}
      <View style={[styles.content, { paddingTop: QR_BELOW_HEADER + 24 }]}>
        <ThemedText type="title" style={styles.name}>
          {MOCK_USER.nom}
        </ThemedText>
        <ThemedText style={styles.phone}>
          {formatPhone(MOCK_USER.telephone)}
        </ThemedText>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#fff',
  },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: '#A1CEDC',
  },
  qrAnchor: {
    position: 'absolute',
    top: HEADER_HEIGHT - QR_OVERLAP,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  qrWrapper: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 6,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  phone: {
    fontSize: 15,
    opacity: 0.55,
    textAlign: 'center',
  },
});

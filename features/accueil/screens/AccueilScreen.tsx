import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

import { Colors, blue } from '@/shared/constants/theme';

const MOCK_USER = {
  nom: 'Moussa SIDIBÉ',
  telephone: '621234567',
  qrData: 'user-moussa-sidibe-001',
};

const QR_SIZE = 160;
const QR_WRAPPER_PADDING = 12;
const QR_OVERLAP = QR_SIZE / 2;
const HEADER_HEIGHT = 140;
const QR_CARD_HEIGHT = QR_SIZE + QR_WRAPPER_PADDING * 2;
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

      {/* Header bleu PrimeVue */}
      <View style={[styles.header, { paddingTop: insets.top }]} />

      {/* QR code flottant */}
      <View style={styles.qrAnchor}>
        <View style={styles.qrWrapper}>
          <QRCode
            value={MOCK_USER.qrData}
            size={QR_SIZE}
            color="#ffffff"
            backgroundColor={Colors.primary}
          />
        </View>
      </View>

      {/* Infos utilisateur */}
      <View style={[styles.content, { paddingTop: QR_BELOW_HEADER + 24 }]}>
        <Text style={styles.name}>{MOCK_USER.nom}</Text>
        <Text style={styles.phone}>{formatPhone(MOCK_USER.telephone)}</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: Colors.background,
  },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: Colors.primary,
  },
  qrAnchor: {
    position: 'absolute',
    top: HEADER_HEIGHT - QR_OVERLAP,
    left: 0,
    right: 0,
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
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 6,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  phone: {
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});

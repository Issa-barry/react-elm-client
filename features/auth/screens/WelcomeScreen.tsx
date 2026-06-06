import { Dimensions, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { Colors, blue } from '@/shared/constants/theme';

const LOGO_PATH =
  'M7.09219 2.87829C5.94766 3.67858 4.9127 4.62478 4.01426 5.68992C7.6857 5.34906 12.3501 5.90564 17.7655 8.61335C23.5484 11.5047 28.205 11.6025 31.4458 10.9773C31.1517 10.087 30.7815 9.23135 30.343 8.41791C26.6332 8.80919 21.8772 8.29127 16.3345 5.51998C12.8148 3.76014 9.71221 3.03521 7.09219 2.87829ZM28.1759 5.33332C25.2462 2.06 20.9887 0 16.25 0C14.8584 0 13.5081 0.177686 12.2209 0.511584C13.9643 0.987269 15.8163 1.68319 17.7655 2.65781C21.8236 4.68682 25.3271 5.34013 28.1759 5.33332ZM32.1387 14.1025C28.2235 14.8756 22.817 14.7168 16.3345 11.4755C10.274 8.44527 5.45035 8.48343 2.19712 9.20639C2.0292 9.24367 1.86523 9.28287 1.70522 9.32367C1.2793 10.25 0.939308 11.2241 0.695362 12.2356C0.955909 12.166 1.22514 12.0998 1.50293 12.0381C5.44966 11.161 11.0261 11.1991 17.7655 14.5689C23.8261 17.5991 28.6497 17.561 31.9029 16.838C32.0144 16.8133 32.1242 16.7877 32.2322 16.7613C32.2441 16.509 32.25 16.2552 32.25 16C32.25 15.358 32.2122 14.7248 32.1387 14.1025ZM31.7098 20.1378C27.8326 20.8157 22.5836 20.5555 16.3345 17.431C10.274 14.4008 5.45035 14.439 2.19712 15.1619C1.475 15.3223 0.825392 15.5178 0.252344 15.7241C0.250782 15.8158 0.25 15.9078 0.25 16C0.25 24.8366 7.41344 32 16.25 32C23.6557 32 29.8862 26.9687 31.7098 20.1378Z';

const { height: SCREEN_H } = Dimensions.get('window');
const HERO_H = SCREEN_H * 0.58;

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>

      {/* ── Hero (photo remplaçable) ───────────────────────────────────────── */}
      <ImageBackground
        source={require('@/assets/images/sachet.png')}
        style={[styles.hero, { height: HERO_H }]}
        imageStyle={styles.heroImg}
        resizeMode="cover"
      >
        {/* calque sombre pour lisibilité */}
        <View style={styles.heroDimmer} />

        {/* logo + badge en haut */}
        <View style={[styles.heroTop, { paddingTop: insets.top + 16 }]}>
          <View style={styles.logoBox}>
            <Svg width={32} height={32} viewBox="0 0 32.25 32">
              <Path fillRule="evenodd" clipRule="evenodd" d={LOGO_PATH} fill="white" />
            </Svg>
          </View>
        </View>

        {/* Vague décorative en bas du hero */}
        <View style={styles.heroWave} />
      </ImageBackground>

      {/* ── Carte blanche ─────────────────────────────────────────────────── */}
      <View style={[styles.card, { paddingBottom: insets.bottom + 24 }]}>

        {/* Titre style Bolt */}
        <Text style={styles.title}>
          <Text style={styles.titlePrimary}>EAU </Text>
          <Text style={styles.titleDark}>la maman</Text>
        </Text>

        {/* Sous-titres */}
        <View style={styles.subtitles}>
          <View style={styles.subtitleRow}>
            <View style={styles.bullet} />
            <Text style={styles.subtitleText}>
              Proposez votre véhicule à ELM et générez des revenus
            </Text>
          </View>
          <View style={styles.subtitleRow}>
            <View style={styles.bullet} />
            <Text style={styles.subtitleText}>
              Rejoignez-nous en tant que livreur et travaillez à votre rythme
            </Text>
          </View>
        </View>

        {/* Boutons */}
        <View style={styles.buttons}>
          <Pressable
            style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPrimaryPressed]}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.btnPrimaryText}>Se connecter</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.btnOutline, pressed && styles.btnOutlinePressed]}
            onPress={() => router.push('/(auth)/register')}
          >
            <Text style={styles.btnOutlineText}>S'inscrire</Text>
          </Pressable>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // ── Hero ────────────────────────────────────────────────────────────────
  hero: {
    width: '100%',
    backgroundColor: blue[800],
    justifyContent: 'space-between',
  },
  heroImg: {
    opacity: 0.30,
    transform: [{ scale: 1.08 }],
  },
  heroDimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: blue[700],
    opacity: 0.60,
  },
  heroTop: {
    paddingHorizontal: 24,
    alignItems: 'flex-start',
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  heroWave: {
    height: 36,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: 'auto',
  },

  // ── Carte blanche ────────────────────────────────────────────────────────
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 28,
    paddingTop: 8,
    gap: 24,
  },

  // Titre
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 42,
  },
  titlePrimary: {
    color: Colors.primary,
  },
  titleDark: {
    color: '#111111',
  },

  // Sous-titres
  subtitles: {
    gap: 12,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 7,
    flexShrink: 0,
  },
  subtitleText: {
    flex: 1,
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
  },

  // Boutons
  buttons: {
    gap: 12,
    marginTop: 4,
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  btnPrimaryPressed: {
    backgroundColor: Colors.primaryDark,
    opacity: 0.9,
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  btnOutline: {
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: '#f8fafc',
  },
  btnOutlinePressed: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  btnOutlineText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

import { useMemo } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/shared/contexts/ThemeContext';
import { useRegister, TOTAL_STEPS } from '../hooks/useRegister';
import { PhoneInput }    from '../components/PhoneInput';
import { AuthInput }     from '../components/AuthInput';
import { PasswordInput } from '../components/PasswordInput';

const STEP_TITLES = [
  'Créer votre compte',
  'Vos informations',
  'Votre mot de passe',
];

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { state, set, setCountry, next, back } = useRegister();

  const handleBack = () => state.step > 1 ? back() : router.replace('/(auth)/welcome');

  const canContinue = (() => {
    switch (state.step) {
      case 1: return state.telephoneLocal.trim().length > 0;
      case 2: return state.prenom.trim().length >= 2 && state.nom.trim().length >= 2;
      case 3: return state.password.length > 0 && state.passwordConfirmation.length > 0;
      default: return false;
    }
  })();

  // ── État final : compte créé ──────────────────────────────────────────────
  if (state.done) {
    return (
      <View style={[styles.done, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={{ flex: 1 }} />
        <View style={styles.doneContent}>
          <Text style={styles.doneTitle}>{'COMPTE\nCRÉÉ !'}</Text>
          <Text style={styles.doneDesc}>
            Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.
          </Text>
        </View>
        <View style={{ flex: 0.8 }} />
        <View style={styles.doneActions}>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => router.replace('/(auth)/login')}
            accessibilityLabel="Se connecter">
            <Text style={styles.doneBtnText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Formulaire multi-étapes ────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <Pressable
        onPress={handleBack}
        android_ripple={null}
        accessibilityLabel="Retour"
        style={[styles.backBtn, { top: insets.top + 10 }]}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </Pressable>

      <View style={[styles.headerRow, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.title}>{STEP_TITLES[state.step - 1]}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { flexGrow: 1, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        <View style={styles.formCenter}>

          {state.globalError ? (
            <View style={styles.globalError}>
              <Text style={styles.globalErrorText}>{state.globalError}</Text>
            </View>
          ) : null}

          {/* ── Étape 1 : Téléphone ─────────────────────────────────────── */}
          {state.step === 1 && (
            <PhoneInput
              codePays={state.codePays}
              prefix={state.prefix}
              telephoneLocal={state.telephoneLocal}
              onChangePhone={v => set('telephoneLocal', v)}
              onChangeCountry={setCountry}
              error={state.errors.telephoneLocal}
            />
          )}

          {/* ── Étape 2 : Identité ──────────────────────────────────────── */}
          {state.step === 2 && (
            <View style={styles.stepCard}>
              {state.prefilled && (
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>
                    ✓ Informations pré-remplies depuis nos dossiers.
                  </Text>
                </View>
              )}
              <AuthInput
                label="Prénom"
                value={state.prenom}
                onChangeText={v => set('prenom', v)}
                placeholder="Ex : Moussa"
                autoCapitalize="words"
                locked={state.prefilled}
                error={state.errors.prenom}
              />
              <AuthInput
                label="Nom"
                value={state.nom}
                onChangeText={v => set('nom', v)}
                placeholder="Ex : SIDIBÉ"
                autoCapitalize="characters"
                locked={state.prefilled}
                error={state.errors.nom}
              />
            </View>
          )}

          {/* ── Étape 3 : Mot de passe ──────────────────────────────────── */}
          {state.step === 3 && (
            <View style={styles.stepCard}>
              <View style={styles.recapCard}>
                <Text style={styles.recapTitle}>Récapitulatif</Text>
                <View style={styles.recapRow}>
                  <Text style={styles.recapLabel}>Téléphone</Text>
                  <Text style={styles.recapValue}>{state.telephone}</Text>
                </View>
                <View style={styles.recapRow}>
                  <Text style={styles.recapLabel}>Prénom</Text>
                  <Text style={styles.recapValue}>{state.prenom}</Text>
                </View>
                <View style={styles.recapRow}>
                  <Text style={styles.recapLabel}>Nom</Text>
                  <Text style={styles.recapValue}>{state.nom.toUpperCase()}</Text>
                </View>
              </View>
              <PasswordInput
                label="Mot de passe"
                value={state.password}
                onChangeText={v => set('password', v)}
                placeholder="Min. 8 car., maj., chiffre, symbole"
                error={state.errors.password}
              />
              <PasswordInput
                label="Confirmer le mot de passe"
                value={state.passwordConfirmation}
                onChangeText={v => set('passwordConfirmation', v)}
                placeholder="Répéter le mot de passe"
                error={state.errors.passwordConfirmation}
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.btnNext, (!canContinue || state.loading) && styles.btnDisabled]}
            onPress={next}
            disabled={!canContinue || state.loading}
            accessibilityLabel={state.step === TOTAL_STEPS ? 'Créer mon compte' : 'Étape suivante'}>
            {state.loading
              ? <ActivityIndicator color={colors.primaryFg} />
              : <Text style={styles.btnNextText}>
                  {state.step === TOTAL_STEPS ? 'Créer mon compte' : 'Continuer →'}
                </Text>
            }
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ?</Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.footerLink}> Se connecter</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    flex:       { flex: 1, backgroundColor: colors.background },
    scroll:     { flex: 1 },
    content:    { paddingHorizontal: 24 },
    formCenter: { flex: 1, justifyContent: 'center', gap: 24 },

    backBtn: {
      position: 'absolute',
      left: 20,
      zIndex: 10,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },

    headerRow: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 10,
    },
    title: { fontSize: 20, fontWeight: '700', color: colors.text },

    globalError:     { backgroundColor: colors.dangerBg, borderWidth: 1, borderColor: colors.danger, borderRadius: 10, padding: 12 },
    globalErrorText: { fontSize: 14, color: colors.danger, textAlign: 'center' },

    stepCard: { gap: 16 },

    infoBox:  { backgroundColor: colors.infoBg, borderWidth: 1, borderColor: colors.primaryLight, borderRadius: 10, padding: 10 },
    infoText: { fontSize: 13, color: colors.primary },

    recapCard: {
      backgroundColor: colors.surface, borderRadius: 14,
      borderWidth: 1, borderColor: colors.border, padding: 14, gap: 8,
    },
    recapTitle: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginBottom: 2 },
    recapRow:   { flexDirection: 'row', justifyContent: 'space-between' },
    recapLabel: { fontSize: 13, color: colors.textMuted },
    recapValue: { fontSize: 13, fontWeight: '600', color: colors.text },

    btnNext:     { height: 52, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    btnDisabled: { opacity: 0.4 },
    btnNextText: { color: colors.primaryFg, fontSize: 16, fontWeight: '700' },

    footer:     { flexDirection: 'row', justifyContent: 'center', paddingTop: 4 },
    footerText: { fontSize: 14, color: colors.textMuted },
    footerLink: { fontSize: 14, color: colors.primary, fontWeight: '700' },

    // ── Écran de confirmation (fond bleu primary) ─────────────────────────
    done: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingHorizontal: 28,
    },
    doneContent:  { gap: 18 },
    doneTitle: {
      fontSize: 34, fontWeight: '800', color: '#ffffff',
      letterSpacing: -0.5, lineHeight: 40, textTransform: 'uppercase',
    },
    doneDesc: { fontSize: 15, color: 'rgba(255,255,255,0.72)', lineHeight: 22 },
    doneActions: { gap: 4, paddingBottom: 12 },
    doneBtn: {
      height: 54, borderRadius: 14,
      backgroundColor: '#ffffff',
      alignItems: 'center', justifyContent: 'center',
    },
    doneBtnText: { fontSize: 16, fontWeight: '700', color: colors.primary },
  });
}

import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, slate } from '@/shared/constants/theme';
import { AppLogo } from '@/shared/components/AppLogo';
import { useRegister, TOTAL_STEPS } from '../hooks/useRegister';
import { PhoneInput }     from '../components/PhoneInput';
import { OtpInput }       from '../components/OtpInput';
import { AuthInput }      from '../components/AuthInput';
import { PasswordInput }  from '../components/PasswordInput';
import { StepIndicator }  from '../components/StepIndicator';

const STEP_LABELS = ['Téléphone', 'Code OTP', 'Identité', 'Mot de passe'];

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { state, set, setCountry, next, back } = useRegister();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* En-tête */}
        <View style={styles.header}>
          <AppLogo size={64} />
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Étape {state.step} sur {TOTAL_STEPS}</Text>
        </View>

        {/* Indicateur de progression */}
        <StepIndicator current={state.step} total={TOTAL_STEPS} labels={STEP_LABELS} />

        {/* Erreur globale */}
        {state.globalError ? (
          <View style={styles.globalError}>
            <Text style={styles.globalErrorText}>{state.globalError}</Text>
          </View>
        ) : null}

        {/* ── Étape 1 : Téléphone ─────────────────────────────────── */}
        {state.step === 1 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Votre numéro de téléphone</Text>
            <Text style={styles.stepHint}>Un code vous sera envoyé pour confirmer votre numéro.</Text>
            <PhoneInput
              codePays={state.codePays}
              prefix={state.prefix}
              telephoneLocal={state.telephoneLocal}
              onChangePhone={v => set('telephoneLocal', v)}
              onChangeCountry={setCountry}
              error={state.errors.telephoneLocal}
            />
          </View>
        )}

        {/* ── Étape 2 : OTP ───────────────────────────────────────── */}
        {state.step === 2 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Code de vérification</Text>
            <Text style={styles.stepHint}>
              Entrez le code à 5 chiffres envoyé au {state.telephone}.{'\n'}
              <Text style={styles.devHint}>(Mode développement : code = 12345)</Text>
            </Text>
            <OtpInput
              value={state.otp}
              onChange={v => set('otp', v)}
              error={state.errors.otp}
            />
          </View>
        )}

        {/* ── Étape 3 : Identité ──────────────────────────────────── */}
        {state.step === 3 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Vos informations</Text>
            {state.prefilled && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>Informations pré-remplies depuis nos dossiers.</Text>
              </View>
            )}
            <AuthInput
              label="Prénom"
              value={state.prenom}
              onChangeText={v => set('prenom', v)}
              placeholder="Ex : Moussa"
              autoCapitalize="words"
              editable={!state.prefilled}
              error={state.errors.prenom}
            />
            <AuthInput
              label="Nom"
              value={state.nom}
              onChangeText={v => set('nom', v)}
              placeholder="Ex : SIDIBÉ"
              autoCapitalize="characters"
              editable={!state.prefilled}
              error={state.errors.nom}
            />
          </View>
        )}

        {/* ── Étape 4 : Mot de passe + récap ─────────────────────── */}
        {state.step === 4 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Créer votre mot de passe</Text>

            {/* Récapitulatif */}
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

        {/* Actions */}
        <View style={styles.actions}>
          {state.step > 1 && (
            <TouchableOpacity style={styles.btnBack} onPress={back} disabled={state.loading}>
              <Text style={styles.btnBackText}>← Retour</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.btnNext, state.loading && styles.btnDisabled, state.step === 1 && styles.btnFull]}
            onPress={next}
            disabled={state.loading}
            accessibilityLabel={state.step === TOTAL_STEPS ? "Créer mon compte" : "Étape suivante"}>
            {state.loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnNextText}>
                  {state.step === TOTAL_STEPS ? 'Créer mon compte' : 'Continuer →'}
                </Text>
            }
          </TouchableOpacity>
        </View>

        {/* Lien login */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Déjà un compte ?</Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.footerLink}> Se connecter</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:    { flex: 1, backgroundColor: Colors.background },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 24, gap: 24 },

  header:   { alignItems: 'center', gap: 4 },
  title:    { fontSize: 24, fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: 14, color: slate[400] },

  globalError: {
    backgroundColor: '#fef2f2', borderWidth: 1,
    borderColor: '#fecaca', borderRadius: 10, padding: 12,
  },
  globalErrorText: { fontSize: 14, color: '#dc2626', textAlign: 'center' },

  stepCard: { gap: 16 },
  stepTitle:{ fontSize: 17, fontWeight: '700', color: Colors.text },
  stepHint: { fontSize: 13, color: slate[400], lineHeight: 20 },
  devHint:  { color: Colors.primary, fontStyle: 'italic' },

  infoBox: {
    backgroundColor: '#eff6ff', borderWidth: 1,
    borderColor: '#bfdbfe', borderRadius: 10, padding: 10,
  },
  infoText: { fontSize: 13, color: Colors.primary },

  recapCard: {
    backgroundColor: Colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: slate[200], padding: 14, gap: 8,
  },
  recapTitle:{ fontSize: 13, fontWeight: '700', color: slate[500], marginBottom: 2 },
  recapRow:  { flexDirection: 'row', justifyContent: 'space-between' },
  recapLabel:{ fontSize: 13, color: slate[400] },
  recapValue:{ fontSize: 13, fontWeight: '600', color: Colors.text },

  actions: { flexDirection: 'row', gap: 12 },
  btnBack: {
    flex: 1, height: 52, borderRadius: 14,
    borderWidth: 1.5, borderColor: slate[200],
    alignItems: 'center', justifyContent: 'center',
  },
  btnBackText: { fontSize: 15, fontWeight: '600', color: slate[600] },
  btnNext: {
    flex: 2, height: 52, borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  btnFull:     { flex: 1 },
  btnDisabled: { opacity: 0.6 },
  btnNextText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  footer:     { flexDirection: 'row', justifyContent: 'center', paddingTop: 4 },
  footerText: { fontSize: 14, color: slate[500] },
  footerLink: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
});

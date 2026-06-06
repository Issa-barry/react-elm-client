import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, slate } from '@/shared/constants/theme';
import { CloseButton } from '@/shared/components/CloseButton';
import { useRegister, TOTAL_STEPS } from '../hooks/useRegister';
import { PhoneInput }    from '../components/PhoneInput';
import { AuthInput }     from '../components/AuthInput';
import { PasswordInput } from '../components/PasswordInput';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { state, set, setCountry, next, back } = useRegister();

  // ── État final : compte créé, email en attente de vérification ────────────
  if (state.done) {
    return (
      <View style={[styles.flex, styles.pendingWrap, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.pendingCard}>
          <View style={styles.pendingIcon}>
            <Text style={styles.pendingEmoji}>📧</Text>
          </View>

          <Text style={styles.pendingTitle}>Vérifiez votre email</Text>

          <Text style={styles.pendingDesc}>
            Un email de validation a été envoyé à{'\n'}
            <Text style={styles.pendingEmail}>{state.registeredEmail}</Text>
          </Text>

          <Text style={styles.pendingHint}>
            Cliquez sur le lien dans l'email pour activer votre compte.
            Le lien est valable 24 heures.
          </Text>

          <View style={styles.pendingDivider} />

          <TouchableOpacity
            style={styles.btnLogin}
            onPress={() => router.replace('/(auth)/login')}
            accessibilityLabel="Aller à la connexion">
            <Text style={styles.btnLoginText}>Aller à la connexion</Text>
          </TouchableOpacity>

          <Text style={styles.pendingFooter}>
            Vous pourrez vous connecter une fois votre email validé.
          </Text>
        </View>
      </View>
    );
  }

  // ── Formulaire multi-étapes ────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <CloseButton />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Titre centré sur la même ligne que la flèche retour */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Créer un compte</Text>
        </View>

        {/* Erreur globale */}
        {state.globalError ? (
          <View style={styles.globalError}>
            <Text style={styles.globalErrorText}>{state.globalError}</Text>
          </View>
        ) : null}

        {/* ── Étape 1 : Téléphone ───────────────────────────────────────── */}
        {state.step === 1 && (
          <View style={styles.stepCard}>
            {/* <Text style={styles.stepTitle}>Votre numéro de téléphone</Text> */}
            {/* <Text style={styles.stepHint}>Entrez votre numéro pour créer votre compte.</Text> */}
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

        {/* ── Étape 2 : Identité ────────────────────────────────────────── */}
        {state.step === 2 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Vos informations</Text>
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

        {/* ── Étape 3 : Email + Mot de passe ───────────────────────────── */}
        {state.step === 3 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Email et mot de passe</Text>

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

            <AuthInput
              label="Adresse email"
              value={state.email}
              onChangeText={v => set('email', v)}
              placeholder="exemple@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={state.errors.email}
            />

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
            accessibilityLabel={state.step === TOTAL_STEPS ? 'Créer mon compte' : 'Étape suivante'}>
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
  content: { paddingHorizontal: 24, gap: 16 },

  // Titre aligné sur la même ligne que le CloseButton (height: 36, même que le cercle)
  headerRow: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:    { fontSize: 20, fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: 14, color: slate[400], textAlign: 'center' },

  globalError: {
    backgroundColor: '#fef2f2', borderWidth: 1,
    borderColor: '#fecaca', borderRadius: 10, padding: 12,
  },
  globalErrorText: { fontSize: 14, color: '#dc2626', textAlign: 'center' },

  stepCard:  { gap: 16 },
  stepTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  stepHint:  { fontSize: 13, color: slate[400], lineHeight: 20 },

  infoBox: {
    backgroundColor: '#eff6ff', borderWidth: 1,
    borderColor: '#bfdbfe', borderRadius: 10, padding: 10,
  },
  infoText: { fontSize: 13, color: Colors.primary },

  recapCard: {
    backgroundColor: Colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: slate[200], padding: 14, gap: 8,
  },
  recapTitle: { fontSize: 13, fontWeight: '700', color: slate[500], marginBottom: 2 },
  recapRow:   { flexDirection: 'row', justifyContent: 'space-between' },
  recapLabel: { fontSize: 13, color: slate[400] },
  recapValue: { fontSize: 13, fontWeight: '600', color: Colors.text },

  actions:     { flexDirection: 'row', gap: 12 },
  btnBack:     { flex: 1, height: 52, borderRadius: 14, borderWidth: 1.5, borderColor: slate[200], alignItems: 'center', justifyContent: 'center' },
  btnBackText: { fontSize: 15, fontWeight: '600', color: slate[600] },
  btnNext:     { flex: 2, height: 52, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  btnFull:     { flex: 1 },
  btnDisabled: { opacity: 0.6 },
  btnNextText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  footer:     { flexDirection: 'row', justifyContent: 'center', paddingTop: 4 },
  footerText: { fontSize: 14, color: slate[500] },
  footerLink: { fontSize: 14, color: Colors.primary, fontWeight: '700' },

  // ── Pending state ─────────────────────────────────────────────────────────
  pendingWrap: { paddingHorizontal: 24, justifyContent: 'center' },
  pendingCard: {
    backgroundColor: '#fff', borderRadius: 20,
    padding: 36, alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 12,
    elevation: 3,
  },
  pendingIcon:  { marginBottom: 4 },
  pendingEmoji: { fontSize: 52 },
  pendingTitle: { fontSize: 22, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  pendingDesc:  { fontSize: 15, color: slate[500], textAlign: 'center', lineHeight: 22 },
  pendingEmail: { fontWeight: '700', color: Colors.primary },
  pendingHint:  { fontSize: 13, color: slate[400], textAlign: 'center', lineHeight: 20 },
  pendingDivider: { width: 40, height: 3, backgroundColor: '#d1fae5', borderRadius: 2, marginVertical: 4 },
  btnLogin:     { width: '100%', height: 52, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  btnLoginText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  pendingFooter:{ fontSize: 12, color: slate[400], textAlign: 'center', lineHeight: 18 },
});

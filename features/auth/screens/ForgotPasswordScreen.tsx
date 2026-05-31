import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, slate } from '@/shared/constants/theme';
import { AppLogo } from '@/shared/components/AppLogo';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { PhoneInput }    from '../components/PhoneInput';
import { OtpInput }      from '../components/OtpInput';
import { PasswordInput } from '../components/PasswordInput';

const STEP_CONFIG = {
  phone:        { title: 'Mot de passe oublié', hint: 'Entrez votre numéro pour recevoir un code de vérification.' },
  otp:          { title: 'Code de vérification', hint: 'Entrez le code à 5 chiffres reçu par SMS.' },
  new_password: { title: 'Nouveau mot de passe', hint: 'Choisissez un mot de passe sécurisé.' },
  done:         { title: 'Mot de passe modifié', hint: '' },
};

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { state, set, setCountry, submit } = useForgotPassword();

  const config = STEP_CONFIG[state.step];

  if (state.step === 'done') {
    return (
      <View style={[styles.flex, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.doneIcon}>✅</Text>
        <Text style={styles.doneTitle}>Mot de passe réinitialisé</Text>
        <Text style={styles.doneText}>
          Votre mot de passe a été mis à jour avec succès.
        </Text>
        <TouchableOpacity
          style={styles.btnFull}
          onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.btnText}>Retour à la connexion</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <AppLogo size={64} />
          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.hint}>{config.hint}</Text>
        </View>

        {state.globalError ? (
          <View style={styles.globalError}>
            <Text style={styles.globalErrorText}>{state.globalError}</Text>
          </View>
        ) : null}

        {/* Étape : téléphone */}
        {state.step === 'phone' && (
          <PhoneInput
            codePays={state.codePays}
            prefix={state.prefix}
            telephoneLocal={state.telephoneLocal}
            onChangePhone={v => set('telephoneLocal', v)}
            onChangeCountry={setCountry}
            error={state.errors.telephoneLocal}
          />
        )}

        {/* Étape : OTP */}
        {state.step === 'otp' && (
          <View style={styles.otpWrapper}>
            <Text style={styles.otpPhone}>{state.telephone}</Text>
            <OtpInput
              value={state.otp}
              onChange={v => set('otp', v)}
              error={state.errors.otp}
            />
            <Text style={styles.devHint}>(Mode développement : code = 12345)</Text>
          </View>
        )}

        {/* Étape : nouveau mot de passe */}
        {state.step === 'new_password' && (
          <View style={styles.formGroup}>
            <PasswordInput
              label="Nouveau mot de passe"
              value={state.password}
              onChangeText={v => set('password', v)}
              placeholder="Min. 8 car., maj., chiffre, symbole"
              error={state.errors.password}
            />
            <PasswordInput
              label="Confirmer"
              value={state.passwordConfirmation}
              onChangeText={v => set('passwordConfirmation', v)}
              placeholder="Répéter le mot de passe"
              error={state.errors.passwordConfirmation}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.btn, state.loading && styles.btnDisabled]}
          onPress={submit}
          disabled={state.loading}>
          {state.loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>
                {state.step === 'phone' ? 'Recevoir le code'
                  : state.step === 'otp' ? 'Vérifier le code'
                  : 'Enregistrer le mot de passe'}
              </Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => router.back()}>
          <Text style={styles.backLinkText}>← Retour à la connexion</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:    { flex: 1, backgroundColor: Colors.background },
  center:  { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 24, gap: 24 },

  header:  { gap: 8 },
  title:   { fontSize: 24, fontWeight: '700', color: Colors.text },
  hint:    { fontSize: 14, color: slate[400], lineHeight: 22 },

  globalError: {
    backgroundColor: '#fef2f2', borderWidth: 1,
    borderColor: '#fecaca', borderRadius: 10, padding: 12,
  },
  globalErrorText: { fontSize: 14, color: '#dc2626', textAlign: 'center' },

  otpWrapper: { alignItems: 'center', gap: 12 },
  otpPhone:   { fontSize: 15, fontWeight: '600', color: Colors.text },
  devHint:    { fontSize: 12, color: Colors.primary, fontStyle: 'italic' },
  formGroup:  { gap: 16 },

  btn: {
    height: 52, borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  btnFull:     { height: 52, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText:     { color: '#fff', fontSize: 16, fontWeight: '700' },

  backLink:     { alignItems: 'center' },
  backLinkText: { color: slate[500], fontSize: 14 },

  doneIcon:  { fontSize: 48 },
  doneTitle: { fontSize: 22, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  doneText:  { fontSize: 15, color: slate[400], textAlign: 'center', lineHeight: 22 },
});

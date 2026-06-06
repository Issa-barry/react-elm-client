import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, blue, slate } from '@/shared/constants/theme';
import { AppLogo } from '@/shared/components/AppLogo';
import { CloseButton } from '@/shared/components/CloseButton';
import { useLogin } from '../hooks/useLogin';
import { AuthInput } from '../components/AuthInput';
import { PhoneInput } from '../components/PhoneInput';
import { PasswordInput } from '../components/PasswordInput';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { state, set, setCountry, submit } = useLogin();
  const canSubmit = state.telephoneLocal.trim().length > 0 && state.password.length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <CloseButton />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Logo + titre */}
        <View style={styles.header}>
          <AppLogo size={80} />
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>Eau la maman</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          <PhoneInput
            codePays={state.codePays}
            prefix={state.prefix}
            telephoneLocal={state.telephoneLocal}
            onChangePhone={v => set('telephoneLocal', v)}
            onChangeCountry={setCountry}
            error={state.errors.telephoneLocal}
          />

          <PasswordInput
            label="Mot de passe"
            value={state.password}
            onChangeText={v => set('password', v)}
            placeholder="••••••••"
            error={state.errors.password}
          />

          {state.globalError ? (
            <View style={[
              styles.errorBox,
              state.errorCode === 'account_blocked' && styles.errorBoxBlocked,
              state.errorCode === 'email_not_verified' && styles.errorBoxWarning,
            ]}>
              <Text style={[
                styles.errorText,
                state.errorCode === 'email_not_verified' && styles.errorTextWarning,
              ]}>
                {state.globalError}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.btn, (!canSubmit || state.loading) && styles.btnDisabled]}
            onPress={submit}
            disabled={!canSubmit || state.loading}
            accessibilityLabel="Se connecter">
            {state.loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Se connecter</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.link}
            accessibilityLabel="Mot de passe oublié">
            <Text style={styles.linkText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>
        </View>


      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:   { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content:{ paddingHorizontal: 24, gap: 32 },

  header:   { alignItems: 'center', gap: 10 },
  title:    { fontSize: 26, fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: 15, color: slate[400] },

  form: { gap: 16 },

  errorBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1, borderColor: '#fecaca',
    borderRadius: 10, padding: 12,
  },
  errorBoxBlocked: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
  },
  errorBoxWarning: {
    backgroundColor: '#fffbeb',
    borderColor: '#fcd34d',
  },
  errorText: { fontSize: 14, color: '#dc2626', textAlign: 'center' },
  errorTextWarning: { color: '#92400e' },

  btn: {
    height: 52, borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 4,
  },
  btnDisabled: { opacity: 0.6 },
  btnText:     { color: '#fff', fontSize: 16, fontWeight: '700' },

  link:     { alignItems: 'center', paddingVertical: 4 },
  linkText: { color: Colors.primary, fontSize: 14, fontWeight: '600' },

});

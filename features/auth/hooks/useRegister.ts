import { useCallback, useState } from 'react';
import { router } from 'expo-router';

import {
  DEFAULT_COUNTRY,
  type RegisterStep1Data,
  type RegisterStep2Data,
  type RegisterStep3Data,
  type RegisterStep4Data,
  type FullRegisterData,
} from '../types/auth.types';
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
} from '../validation/auth.validation';
import { authService } from '../services/auth.service';
import { secureStorage } from '../services/secure-storage.service';

export const TOTAL_STEPS = 4;

interface RegisterState {
  step: number;
  // Step 1
  codePays: string;
  prefix: string;
  telephoneLocal: string;
  telephone: string;
  // Step 2
  otp: string;
  // Step 3
  prenom: string;
  nom: string;
  prefilled: boolean;
  // Step 4
  password: string;
  passwordConfirmation: string;
  // UI
  loading: boolean;
  errors: Record<string, string>;
  globalError: string;
}

const INITIAL: RegisterState = {
  step:                 1,
  codePays:             DEFAULT_COUNTRY.code,
  prefix:               DEFAULT_COUNTRY.prefix,
  telephoneLocal:       '',
  telephone:            '',
  otp:                  '',
  prenom:               '',
  nom:                  '',
  prefilled:            false,
  password:             '',
  passwordConfirmation: '',
  loading:              false,
  errors:               {},
  globalError:          '',
};

export function useRegister() {
  const [state, setState] = useState<RegisterState>(INITIAL);

  const set = useCallback(<K extends keyof RegisterState>(key: K, value: RegisterState[K]) => {
    setState(prev => ({ ...prev, [key]: value, errors: { ...prev.errors, [key]: '' }, globalError: '' }));
  }, []);

  const setCountry = useCallback((code: string, prefix: string) => {
    setState(prev => ({ ...prev, codePays: code, prefix, telephoneLocal: '' }));
  }, []);

  // ── Avancer selon l'étape ──────────────────────────────────────────────
  const next = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, errors: {}, globalError: '' }));

    if (state.step === 1) {
      const step1: RegisterStep1Data = {
        codePays: state.codePays, prefix: state.prefix,
        telephoneLocal: state.telephoneLocal,
        telephone: `${state.prefix}${state.telephoneLocal}`,
      };
      const { valid, errors } = validateStep1(step1);
      if (!valid) { setState(prev => ({ ...prev, loading: false, errors })); return; }

      // Lookup : le numéro existe-t-il déjà ?
      const lookup = await authService.lookup(step1.telephone);
      if (!lookup.ok) { setState(prev => ({ ...prev, loading: false, globalError: lookup.error })); return; }

      if (lookup.data.status === 'user_exists') {
        setState(prev => ({
          ...prev, loading: false,
          globalError: 'Ce numéro est déjà associé à un compte. Connectez-vous.',
        }));
        return;
      }

      const prefilled = lookup.data.status === 'prefill_available';
      setState(prev => ({
        ...prev, loading: false,
        telephone: step1.telephone,
        step: 2,
        prenom: lookup.data.prenom ?? prev.prenom,
        nom:    lookup.data.nom    ?? prev.nom,
        prefilled,
      }));
      return;
    }

    if (state.step === 2) {
      const { valid, errors } = validateStep2(state.otp);
      if (!valid) { setState(prev => ({ ...prev, loading: false, errors })); return; }

      const result = await authService.verifyOtp(state.telephone, state.otp);
      if (!result.ok) { setState(prev => ({ ...prev, loading: false, globalError: result.error })); return; }

      setState(prev => ({ ...prev, loading: false, step: 3 }));
      return;
    }

    if (state.step === 3) {
      const step3: RegisterStep3Data = { prenom: state.prenom, nom: state.nom, prefilled: state.prefilled };
      const { valid, errors } = validateStep3(step3);
      if (!valid) { setState(prev => ({ ...prev, loading: false, errors })); return; }
      setState(prev => ({ ...prev, loading: false, step: 4 }));
      return;
    }

    if (state.step === 4) {
      const step4: RegisterStep4Data = { password: state.password, passwordConfirmation: state.passwordConfirmation };
      const { valid, errors } = validateStep4(step4);
      if (!valid) { setState(prev => ({ ...prev, loading: false, errors })); return; }

      const data: FullRegisterData = {
        codePays: state.codePays, prefix: state.prefix,
        telephoneLocal: state.telephoneLocal, telephone: state.telephone,
        otp: state.otp,
        prenom: state.prenom, nom: state.nom, prefilled: state.prefilled,
        password: state.password, passwordConfirmation: state.passwordConfirmation,
      };

      const result = await authService.register(data);
      if (!result.ok) { setState(prev => ({ ...prev, loading: false, globalError: result.error })); return; }

      await secureStorage.saveToken(result.data.token);
      await secureStorage.saveUser(result.data.user);
      setState(prev => ({ ...prev, loading: false }));
      router.replace('/(tabs)');
    }
  }, [state]);

  const back = useCallback(() => {
    setState(prev => ({
      ...prev,
      step: Math.max(1, prev.step - 1),
      errors: {}, globalError: '',
    }));
  }, []);

  return { state, set, setCountry, next, back };
}

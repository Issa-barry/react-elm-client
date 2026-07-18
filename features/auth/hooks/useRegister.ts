import { useCallback, useState } from 'react';

import {
  DEFAULT_COUNTRY,
  buildE164,
  type RegisterStep1Data,
  type RegisterStep2Data,
  type FullRegisterData,
} from '../types/auth.types';
import {
  validateStep1,
  validateStep2,
  validateStepPassword,
} from '../validation/auth.validation';
import { authService } from '../services/auth.service';

export const TOTAL_STEPS = 3;

interface RegisterState {
  step: number;
  done: boolean;

  // Step 1 – téléphone
  codePays: string;
  prefix: string;
  telephoneLocal: string;
  telephone: string;

  // Step 2 – identité
  prenom: string;
  nom: string;
  prefilled: boolean;

  // Step 3 – mot de passe
  password: string;
  passwordConfirmation: string;

  // UI
  loading: boolean;
  errors: Record<string, string>;
  globalError: string;
}

const INITIAL: RegisterState = {
  step:                 1,
  done:                 false,
  codePays:             DEFAULT_COUNTRY.code,
  prefix:               DEFAULT_COUNTRY.prefix,
  telephoneLocal:       '',
  telephone:            '',
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

  const next = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, errors: {}, globalError: '' }));

    // ── Étape 1 : téléphone ────────────────────────────────────────────────
    if (state.step === 1) {
      const step1: RegisterStep1Data = {
        codePays:       state.codePays,
        prefix:         state.prefix,
        telephoneLocal: state.telephoneLocal,
        telephone:      buildE164(state.prefix, state.telephoneLocal),
      };

      const { valid, errors } = validateStep1(step1);
      if (!valid) {
        setState(prev => ({ ...prev, loading: false, errors }));
        return;
      }

      const result = await authService.checkPhone(step1.telephone);
      if (!result.ok) {
        setState(prev => ({ ...prev, loading: false, globalError: result.error }));
        return;
      }

      if (result.data.status === 'user_exists') {
        setState(prev => ({
          ...prev, loading: false,
          globalError: 'Ce numéro est déjà associé à un compte. Connectez-vous.',
        }));
        return;
      }

      const prefilled = result.data.status === 'prefill_available';
      setState(prev => ({
        ...prev,
        loading:   false,
        step:      2,
        telephone: step1.telephone,
        prenom:    result.data.prefill?.prenom ?? prev.prenom,
        nom:       result.data.prefill?.nom    ?? prev.nom,
        prefilled,
      }));
      return;
    }

    // ── Étape 2 : identité ────────────────────────────────────────────────
    if (state.step === 2) {
      const step2: RegisterStep2Data = { prenom: state.prenom, nom: state.nom, prefilled: state.prefilled };
      const { valid, errors } = validateStep2(step2);
      if (!valid) {
        setState(prev => ({ ...prev, loading: false, errors }));
        return;
      }
      setState(prev => ({ ...prev, loading: false, step: 3 }));
      return;
    }

    // ── Étape 3 : mot de passe → inscription ─────────────────────────────
    if (state.step === 3) {
      const { valid, errors } = validateStepPassword(state.password, state.passwordConfirmation);
      if (!valid) {
        setState(prev => ({ ...prev, loading: false, errors }));
        return;
      }

      const data: FullRegisterData = {
        codePays:             state.codePays,
        prefix:               state.prefix,
        telephoneLocal:       state.telephoneLocal,
        telephone:            state.telephone,
        prenom:               state.prenom,
        nom:                  state.nom,
        prefilled:            state.prefilled,
        password:             state.password,
        passwordConfirmation: state.passwordConfirmation,
      };

      const result = await authService.register(data);
      if (!result.ok) {
        setState(prev => ({ ...prev, loading: false, globalError: result.error }));
        return;
      }

      setState(prev => ({ ...prev, loading: false, done: true }));
    }
  }, [state]);

  const back = useCallback(() => {
    setState(prev => ({
      ...prev,
      step:        Math.max(1, prev.step - 1),
      errors:      {},
      globalError: '',
    }));
  }, []);

  return { state, set, setCountry, next, back };
}

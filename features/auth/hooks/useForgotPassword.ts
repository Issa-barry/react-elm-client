import { useCallback, useState } from 'react';

import { DEFAULT_COUNTRY, type ForgotStep } from '../types/auth.types';
import { validateOtp, validatePassword, validatePhone } from '../validation/auth.validation';
import { authService } from '../services/auth.service';

interface ForgotState {
  step: ForgotStep;
  codePays: string;
  prefix: string;
  telephoneLocal: string;
  telephone: string;
  otp: string;
  password: string;
  passwordConfirmation: string;
  loading: boolean;
  errors: Record<string, string>;
  globalError: string;
}

const INITIAL: ForgotState = {
  step:                 'phone',
  codePays:             DEFAULT_COUNTRY.code,
  prefix:               DEFAULT_COUNTRY.prefix,
  telephoneLocal:       '',
  telephone:            '',
  otp:                  '',
  password:             '',
  passwordConfirmation: '',
  loading:              false,
  errors:               {},
  globalError:          '',
};

export function useForgotPassword() {
  const [state, setState] = useState<ForgotState>(INITIAL);

  const set = useCallback(<K extends keyof ForgotState>(key: K, value: ForgotState[K]) => {
    setState(prev => ({ ...prev, [key]: value, errors: { ...prev.errors, [key]: '' }, globalError: '' }));
  }, []);

  const setCountry = useCallback((code: string, prefix: string) => {
    setState(prev => ({ ...prev, codePays: code, prefix, telephoneLocal: '' }));
  }, []);

  const submit = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, errors: {}, globalError: '' }));

    if (state.step === 'phone') {
      const phoneErr = validatePhone(state.telephoneLocal, state.codePays);
      if (phoneErr) {
        setState(prev => ({ ...prev, loading: false, errors: { telephoneLocal: phoneErr } }));
        return;
      }
      const telephone = `${state.prefix}${state.telephoneLocal}`;
      // Réponse neutre — ne révèle pas si le compte existe
      await authService.forgotLookup(telephone);
      setState(prev => ({ ...prev, loading: false, telephone, step: 'otp' }));
      return;
    }

    if (state.step === 'otp') {
      const otpErr = validateOtp(state.otp);
      if (otpErr) {
        setState(prev => ({ ...prev, loading: false, errors: { otp: otpErr } }));
        return;
      }
      const result = await authService.forgotVerifyOtp(state.telephone, state.otp);
      if (!result.ok) {
        setState(prev => ({ ...prev, loading: false, globalError: result.error }));
        return;
      }
      setState(prev => ({ ...prev, loading: false, step: 'new_password' }));
      return;
    }

    if (state.step === 'new_password') {
      const errors: Record<string, string> = {};
      const pwdErr = validatePassword(state.password);
      if (pwdErr) errors.password = pwdErr;
      if (state.password !== state.passwordConfirmation)
        errors.passwordConfirmation = 'Les mots de passe ne correspondent pas.';
      if (Object.keys(errors).length > 0) {
        setState(prev => ({ ...prev, loading: false, errors }));
        return;
      }
      const result = await authService.resetPassword(state.telephone, state.password, state.passwordConfirmation);
      if (!result.ok) {
        setState(prev => ({ ...prev, loading: false, globalError: result.error }));
        return;
      }
      setState(prev => ({ ...prev, loading: false, step: 'done' }));
    }
  }, [state]);

  return { state, set, setCountry, submit };
}

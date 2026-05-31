import {
  COUNTRIES,
  type LoginInput,
  type RegisterStep1Data,
  type RegisterStep3Data,
  type RegisterStep4Data,
} from '../types/auth.types';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// ─── Règles mot de passe (Password::default() du monolithe) ───────────────
const SPECIAL = /[!@#$%^&*()\-_=+[\]{};':",.<>/?\\|`~]/;

export function validatePassword(value: string): string | null {
  if (!value)              return 'Le mot de passe est requis.';
  if (value.length < 8)   return 'Minimum 8 caractères.';
  if (!/[A-Z]/.test(value)) return 'Au moins une lettre majuscule.';
  if (!/[a-z]/.test(value)) return 'Au moins une lettre minuscule.';
  if (!/[0-9]/.test(value)) return 'Au moins un chiffre.';
  if (!SPECIAL.test(value)) return 'Au moins un caractère spécial.';
  return null;
}

// ─── Téléphone ─────────────────────────────────────────────────────────────
export function validatePhone(telephoneLocal: string, codePays: string): string | null {
  const country = COUNTRIES.find(c => c.code === codePays);
  if (!telephoneLocal)                    return 'Le numéro de téléphone est requis.';
  if (!/^\d+$/.test(telephoneLocal))      return 'Chiffres uniquement.';
  if (country && telephoneLocal.length !== country.digits) {
    return `${country.digits} chiffres requis pour ${country.name}.`;
  }
  return null;
}

// ─── OTP ───────────────────────────────────────────────────────────────────
export function validateOtp(otp: string): string | null {
  if (!otp || otp.length < 5)        return 'Code à 5 chiffres requis.';
  if (!/^\d{5}$/.test(otp))          return 'Le code doit contenir exactement 5 chiffres.';
  return null;
}

// ─── Étape 1 : téléphone ───────────────────────────────────────────────────
export function validateStep1(data: RegisterStep1Data): ValidationResult {
  const errors: Record<string, string> = {};
  if (!data.codePays) errors.codePays = 'Sélectionnez un pays.';
  const phoneErr = validatePhone(data.telephoneLocal, data.codePays);
  if (phoneErr) errors.telephoneLocal = phoneErr;
  return { valid: Object.keys(errors).length === 0, errors };
}

// ─── Étape 2 : OTP ─────────────────────────────────────────────────────────
export function validateStep2(otp: string): ValidationResult {
  const errors: Record<string, string> = {};
  const err = validateOtp(otp);
  if (err) errors.otp = err;
  return { valid: Object.keys(errors).length === 0, errors };
}

// ─── Étape 3 : identité ────────────────────────────────────────────────────
export function validateStep3(data: RegisterStep3Data): ValidationResult {
  const errors: Record<string, string> = {};
  if (!data.prenom || data.prenom.trim().length < 2)
    errors.prenom = 'Prénom requis (min. 2 caractères).';
  if (!data.nom || data.nom.trim().length < 2)
    errors.nom = 'Nom requis (min. 2 caractères).';
  return { valid: Object.keys(errors).length === 0, errors };
}

// ─── Étape 4 : mot de passe ────────────────────────────────────────────────
export function validateStep4(data: RegisterStep4Data): ValidationResult {
  const errors: Record<string, string> = {};
  const pwdErr = validatePassword(data.password);
  if (pwdErr) errors.password = pwdErr;
  if (data.password !== data.passwordConfirmation)
    errors.passwordConfirmation = 'Les mots de passe ne correspondent pas.';
  return { valid: Object.keys(errors).length === 0, errors };
}

// ─── Login ─────────────────────────────────────────────────────────────────
export function validateLogin(data: LoginInput): ValidationResult {
  const errors: Record<string, string> = {};
  const phoneErr = validatePhone(data.telephoneLocal, data.codePays);
  if (phoneErr) errors.telephoneLocal = phoneErr;
  if (!data.password) errors.password = 'Le mot de passe est requis.';
  return { valid: Object.keys(errors).length === 0, errors };
}

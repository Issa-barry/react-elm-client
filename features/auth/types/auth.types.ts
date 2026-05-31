export type UserRole = 'client' | 'livreur' | 'proprietaire' | 'admin_entreprise' | 'super_admin';

// ─── Pays supportés (aligné sur elm-monolithe PHONE_BY_COUNTRY) ────────────
export interface Country {
  code: string;
  prefix: string;
  name: string;
  digits: number;
}

export const COUNTRIES: Country[] = [
  { code: 'GN', prefix: '+224', name: 'Guinée',         digits: 9  },
  { code: 'SN', prefix: '+221', name: 'Sénégal',        digits: 9  },
  { code: 'ML', prefix: '+223', name: 'Mali',            digits: 8  },
  { code: 'CI', prefix: '+225', name: "Côte d'Ivoire",   digits: 10 },
  { code: 'GW', prefix: '+245', name: 'Guinée-Bissau',   digits: 7  },
  { code: 'LR', prefix: '+231', name: 'Liberia',         digits: 8  },
  { code: 'SL', prefix: '+232', name: 'Sierra Leone',    digits: 8  },
  { code: 'FR', prefix: '+33',  name: 'France',          digits: 9  },
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // Guinée

// ─── Session / utilisateur ─────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  prenom: string;
  nom: string;
  telephone: string;
  roles: UserRole[];
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

// ─── Login ─────────────────────────────────────────────────────────────────
export interface LoginInput {
  codePays: string;
  telephoneLocal: string;
  telephone: string; // codePays.prefix + telephoneLocal
  password: string;
}

// ─── Inscription (4 étapes) ────────────────────────────────────────────────
export interface RegisterStep1Data {
  codePays: string;
  prefix: string;
  telephoneLocal: string;
  telephone: string;
}

export interface RegisterStep2Data {
  otp: string;
}

export interface RegisterStep3Data {
  prenom: string;
  nom: string;
  prefilled: boolean; // true = champs verrouillés (données pré-remplies)
}

export interface RegisterStep4Data {
  password: string;
  passwordConfirmation: string;
}

export type FullRegisterData =
  RegisterStep1Data &
  RegisterStep2Data &
  RegisterStep3Data &
  RegisterStep4Data;

// ─── Réinitialisation mot de passe ─────────────────────────────────────────
export type ForgotStep = 'phone' | 'otp' | 'new_password' | 'done';

export interface ForgotPasswordData {
  codePays: string;
  telephoneLocal: string;
  telephone: string;
  otp: string;
  password: string;
  passwordConfirmation: string;
}

// ─── Résultat API générique ────────────────────────────────────────────────
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ─── Réponses API attendues ────────────────────────────────────────────────
export interface LookupResponse {
  status: 'user_exists' | 'prefill_available' | 'not_found';
  prenom?: string;
  nom?: string;
}

export interface OtpVerifyResponse {
  verified: boolean;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

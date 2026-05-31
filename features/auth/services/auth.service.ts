/**
 * Couche service auth — isolée de l'UI.
 * Les appels API réels sont préparés ; les mocks actifs pour le développement.
 * Remplacer BASE_URL par l'URL du backend pour activer les vrais appels.
 */

import type {
  ApiResult,
  AuthSession,
  FullRegisterData,
  LoginInput,
  LoginResponse,
  LookupResponse,
  OtpVerifyResponse,
} from '../types/auth.types';

// URL lue depuis .env (EXPO_PUBLIC_ = exposée côté bundle, jamais de secret dedans)
// .env n'est pas commité — voir .env.example
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
const USE_MOCK = !BASE_URL; // mock automatique si URL non définie

// ─── Helpers ──────────────────────────────────────────────────────────────
async function post<T>(path: string, body: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    // Le backend retourne parfois "message", parfois "error" selon le type d'erreur
    if (!res.ok) return { ok: false, error: json.message ?? json.error ?? 'Erreur serveur.' };
    return { ok: true, data: json as T };
  } catch {
    return { ok: false, error: 'Connexion impossible. Vérifiez votre réseau.' };
  }
}

// ─── Mocks développement ──────────────────────────────────────────────────
const MOCK_TOKEN = 'mock-dev-token-xxxx';
const MOCK_OTP   = '12345'; // Code MVP monolithe

function sleep(ms = 800) { return new Promise(r => setTimeout(r, ms)); }

// ─── Service ──────────────────────────────────────────────────────────────
export const authService = {

  /** Vérifie si le numéro existe déjà */
  async lookup(telephone: string): Promise<ApiResult<LookupResponse>> {
    if (USE_MOCK) {
      await sleep();
      return { ok: true, data: { status: 'not_found' } };
    }
    return post('/api/auth/register/lookup', { telephone });
  },

  /** Vérifie le code OTP reçu par SMS */
  async verifyOtp(telephone: string, code: string): Promise<ApiResult<OtpVerifyResponse>> {
    if (USE_MOCK) {
      await sleep();
      if (code === MOCK_OTP) return { ok: true, data: { verified: true } };
      return { ok: false, error: 'Code incorrect. Vérifiez et réessayez.' };
    }
    return post('/api/auth/register/otp', { telephone, code });
  },

  /** Crée le compte */
  async register(data: FullRegisterData): Promise<ApiResult<LoginResponse>> {
    if (USE_MOCK) {
      await sleep(1000);
      return {
        ok: true,
        data: {
          token: MOCK_TOKEN,
          user: {
            id: 'mock-001',
            prenom: data.prenom,
            nom: data.nom.toUpperCase(),
            telephone: data.telephone,
            roles: ['client'],
          },
        },
      };
    }
    return post('/api/auth/register', {
      telephone:         data.telephone,
      telephone_local:   data.telephoneLocal,
      telephone_country: data.codePays,
      prenom:            data.prenom,
      nom:               data.nom,
      password:          data.password,
      device_name:       'EauLaMaman-Mobile',
    });
  },

  /** Connexion */
  async login(input: LoginInput): Promise<ApiResult<LoginResponse>> {
    if (USE_MOCK) {
      await sleep();
      // Credentials de test : n'importe quel n° + password "Test@1234"
      if (input.password === 'Test@1234') {
        return {
          ok: true,
          data: {
            token: MOCK_TOKEN,
            user: {
              id: 'mock-001',
              prenom: 'Moussa',
              nom: 'SIDIBÉ',
              telephone: input.telephone,
              roles: ['client'],
            },
          },
        };
      }
      return { ok: false, error: 'Identifiants incorrects.' };
    }
    return post('/api/auth/login', {
      telephone:   input.telephone,
      password:    input.password,
      device_name: 'EauLaMaman-Mobile',
    });
  },

  /** Demande de réinitialisation (lookup par téléphone) */
  async forgotLookup(telephone: string): Promise<ApiResult<{ sent: boolean }>> {
    if (USE_MOCK) {
      await sleep();
      // Réponse neutre — ne révèle pas si le compte existe
      return { ok: true, data: { sent: true } };
    }
    return post('/api/auth/password/lookup', { telephone });
  },

  /** Vérifie OTP reset */
  async forgotVerifyOtp(telephone: string, code: string): Promise<ApiResult<OtpVerifyResponse>> {
    if (USE_MOCK) {
      await sleep();
      if (code === MOCK_OTP) return { ok: true, data: { verified: true } };
      return { ok: false, error: 'Code incorrect. Vérifiez et réessayez.' };
    }
    return post('/api/auth/password/verify', { telephone, code });
  },

  /** Nouveau mot de passe */
  async resetPassword(telephone: string, password: string, passwordConfirmation: string): Promise<ApiResult<{ message: string }>> {
    if (USE_MOCK) {
      await sleep();
      return { ok: true, data: { message: 'Mot de passe réinitialisé avec succès.' } };
    }
    return post('/api/auth/password/reset', { telephone, password, password_confirmation: passwordConfirmation });
  },
};

export type { AuthSession };

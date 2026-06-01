import type {
  ApiResult,
  FullRegisterData,
  LoginInput,
  LoginResponse,
  LookupResponse,
  OtpVerifyResponse,
} from '../types/auth.types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
const USE_MOCK = !BASE_URL;

// ─── Helper POST ──────────────────────────────────────────────────────────────

async function post<T>(path: string, body: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) return { ok: false, error: json.message ?? json.error ?? 'Erreur serveur.' };
    return { ok: true, data: json as T };
  } catch {
    return { ok: false, error: 'Connexion impossible. Vérifiez votre réseau.' };
  }
}

// ─── Mocks développement ─────────────────────────────────────────────────────

const MOCK_TOKEN = 'mock-dev-token-xxxx';
const MOCK_OTP   = '12345';

function sleep(ms = 800) { return new Promise<void>(r => setTimeout(r, ms)); }

// ─── Service ─────────────────────────────────────────────────────────────────

export const authService = {

  async lookup(telephone: string): Promise<ApiResult<LookupResponse>> {
    if (USE_MOCK) {
      await sleep();
      return { ok: true, data: { status: 'not_found' } };
    }
    return post('/api/auth/register/lookup', { telephone });
  },

  async verifyOtp(telephone: string, code: string): Promise<ApiResult<OtpVerifyResponse>> {
    if (USE_MOCK) {
      await sleep();
      if (code === MOCK_OTP) return { ok: true, data: { verified: true } };
      return { ok: false, error: 'Code incorrect. Vérifiez et réessayez.' };
    }
    return post('/api/auth/register/otp', { telephone, code });
  },

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

  // Le backend elm-monolithe attend "telephone" + "device_name"
  // et retourne directement { token, user } (pas d'enveloppe { success, data })
  async login(input: LoginInput): Promise<ApiResult<LoginResponse>> {
    if (USE_MOCK) {
      await sleep();
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
    return post<LoginResponse>('/api/auth/login', {
      telephone:   input.telephone,
      password:    input.password,
      device_name: 'EauLaMaman-Mobile',
    });
  },

  async forgotLookup(telephone: string): Promise<ApiResult<{ sent: boolean }>> {
    if (USE_MOCK) {
      await sleep();
      return { ok: true, data: { sent: true } };
    }
    return post('/api/auth/password/lookup', { telephone });
  },

  async forgotVerifyOtp(telephone: string, code: string): Promise<ApiResult<OtpVerifyResponse>> {
    if (USE_MOCK) {
      await sleep();
      if (code === MOCK_OTP) return { ok: true, data: { verified: true } };
      return { ok: false, error: 'Code incorrect. Vérifiez et réessayez.' };
    }
    return post('/api/auth/password/verify', { telephone, code });
  },

  async resetPassword(telephone: string, password: string, passwordConfirmation: string): Promise<ApiResult<{ message: string }>> {
    if (USE_MOCK) {
      await sleep();
      return { ok: true, data: { message: 'Mot de passe réinitialisé avec succès.' } };
    }
    return post('/api/auth/password/reset', { telephone, password, password_confirmation: passwordConfirmation });
  },
};

export type { AuthSession } from '../types/auth.types';

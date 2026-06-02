import { secureStorage } from '@/features/auth/services/secure-storage.service';
import type { ApiResult } from '@/features/auth/types/auth.types';
import type { ClientScan, ScanResult, UserScan } from '../types/scan.types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
const USE_MOCK = !BASE_URL;

async function authGet<T>(path: string): Promise<ApiResult<T>> {
  const token = await secureStorage.getToken();
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const json = await res.json();
    if (res.status === 401) return { ok: false, error: 'Session expirée. Reconnectez-vous.' };
    if (!res.ok)            return { ok: false, error: json.message ?? 'Introuvable.' };
    return { ok: true, data: (json.data ?? json) as T };
  } catch {
    return { ok: false, error: 'Connexion impossible. Vérifiez votre réseau.' };
  }
}

// ─── Mocks ───────────────────────────────────────────────────────────────────

const MOCK_USER: UserScan = {
  user_id: '1',
  nom_complet: 'Moussa SIDIBÉ',
  nom: 'SIDIBÉ',
  prenom: 'Moussa',
  phone: '+224621234567',
  ville: 'Conakry',
  quartier: 'Ratoma',
  roles: ['proprietaire'],
  vehicules: [
    { nom: 'Nen Dow',   immatriculation: 'RC-001-GN' },
    { nom: 'Conakry 2', immatriculation: 'TC-002-GN' },
  ],
};

const MOCK_CLIENT: ClientScan = {
  id: '1',
  reference: 'CLI-20260601-0001',
  nom_complet: 'Aminata DIALLO',
  nom: 'DIALLO',
  prenom: 'Aminata',
  raison_sociale: null,
  phone: '+224621000001',
  email: null,
  ville: 'Conakry',
  quartier: 'Ratoma',
  adresse: 'Cité Enco-5, villa 12',
  is_active: true,
};

// ─── Détection du type de QR ─────────────────────────────────────────────────

function isUserId(raw: string): boolean {
  return /^\d+$/.test(raw.trim());
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const scanService = {
  async scan(raw: string): Promise<ApiResult<ScanResult>> {
    const value = raw.trim();

    if (USE_MOCK) {
      await new Promise<void>(r => setTimeout(r, 700));
      if (isUserId(value)) {
        return { ok: true, data: { type: 'user', data: MOCK_USER } };
      }
      if (value === MOCK_CLIENT.reference) {
        return { ok: true, data: { type: 'client', data: MOCK_CLIENT } };
      }
      return { ok: false, error: 'QR code non reconnu.' };
    }

    if (isUserId(value)) {
      const res = await authGet<UserScan>(`/api/v1/mobile/users/scan/${value}`);
      if (!res.ok) return res;
      return { ok: true, data: { type: 'user', data: res.data } };
    }

    const res = await authGet<ClientScan>(`/api/v1/mobile/clients/scan/${encodeURIComponent(value)}`);
    if (!res.ok) return res;
    return { ok: true, data: { type: 'client', data: res.data } };
  },
};

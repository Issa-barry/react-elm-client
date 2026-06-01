import { secureStorage } from '@/features/auth/services/secure-storage.service';
import type { ApiResult } from '@/features/auth/types/auth.types';
import type { VehiculeApi } from '../types/vehicule.types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
const USE_MOCK = !BASE_URL;

// ─── Helper GET authentifié ───────────────────────────────────────────────────

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
    if (!res.ok) return { ok: false, error: json.message ?? 'Erreur serveur.' };
    return { ok: true, data: json as T };
  } catch {
    return { ok: false, error: 'Connexion impossible. Vérifiez votre réseau.' };
  }
}

// ─── Mock développement ───────────────────────────────────────────────────────

const MOCK_VEHICULES: VehiculeApi[] = [
  {
    id: 'mock-1',
    nom: 'Nen Dow',
    immatriculation: 'RC-001-GN',
    type: 'Camion',
    capacite: 500,
    is_active: true,
    photo_url: null,
    role: 'proprietaire',
  },
  {
    id: 'mock-2',
    nom: 'Baba Ousou',
    immatriculation: 'VN-001-GN',
    type: 'Minibus',
    capacite: 150,
    is_active: true,
    photo_url: null,
    role: 'livreur',
  },
];

// ─── Service ─────────────────────────────────────────────────────────────────

export const vehiculeService = {
  async getMesVehicules(): Promise<ApiResult<VehiculeApi[]>> {
    if (USE_MOCK) {
      await new Promise<void>(r => setTimeout(r, 800));
      return { ok: true, data: MOCK_VEHICULES };
    }

    // Le backend retourne directement un tableau JSON (pas d'enveloppe)
    return authGet<VehiculeApi[]>('/api/vehicules/mine');
  },
};

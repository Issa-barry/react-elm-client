import { secureStorage } from '@/features/auth/services/secure-storage.service';
import type { ApiResult } from '@/features/auth/types/auth.types';
import type { LivraisonEnCours } from '../types/livraison.types';

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
    if (!res.ok) return { ok: false, error: json.message ?? 'Erreur serveur.' };
    return { ok: true, data: json as T };
  } catch {
    return { ok: false, error: 'Connexion impossible. Vérifiez votre réseau.' };
  }
}

const MOCK: LivraisonEnCours[] = [
  {
    id: 'mock-tr-1',
    reference: 'TR-00001-ABC',
    statut: 'transit',
    statut_label: 'Livraison en cours',
    site_source: 'Conakry',
    site_destination: 'Kindia',
    vehicule: { nom: 'Baba Ousou', immatriculation: 'VN-001-GN', type: 'Camion', photo_url: null },
    equipe_nom: 'Équipe Alpha',
    date_depart: new Date().toISOString().split('T')[0],
    date_arrivee_prevue: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    nb_packs: 150,
  },
];

async function authPost<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
  const token = await secureStorage.getToken();
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    if (res.status === 401) return { ok: false, error: 'Session expirée. Reconnectez-vous.' };
    if (!res.ok) return { ok: false, error: json.message ?? 'Erreur serveur.' };
    return { ok: true, data: json as T };
  } catch {
    return { ok: false, error: 'Connexion impossible. Vérifiez votre réseau.' };
  }
}

async function authPut<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
  const token = await secureStorage.getToken();
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const json = await res.json();
    if (res.status === 401) return { ok: false, error: 'Session expirée. Reconnectez-vous.' };
    if (!res.ok) return { ok: false, error: json.message ?? 'Erreur serveur.' };
    return { ok: true, data: json as T };
  } catch {
    return { ok: false, error: 'Connexion impossible. Vérifiez votre réseau.' };
  }
}

export const livraisonService = {
  async getLivraisonsEnCours(): Promise<ApiResult<LivraisonEnCours[]>> {
    if (USE_MOCK) {
      await new Promise<void>(r => setTimeout(r, 700));
      return { ok: true, data: MOCK };
    }
    return authGet<LivraisonEnCours[]>('/api/livraisons/en-cours');
  },

  async getTransferts(tab: 'en_cours' | 'historique' = 'en_cours') {
    return authGet<unknown[]>(`/api/v1/mobile/livraisons-transferts?tab=${tab}`);
  },

  async getTransfertDetail(id: string) {
    return authGet<unknown>(`/api/v1/mobile/livraisons-transferts/${id}`);
  },

  async demarrerChargement(id: string) {
    return authPost<unknown>(`/api/v1/mobile/livraisons-transferts/${id}/demarrer-chargement`);
  },

  async saisirQuantitesChargees(id: string, lignes: { id: string; quantite_chargee: number }[]) {
    return authPut<unknown>(`/api/v1/mobile/livraisons-transferts/${id}/quantites-chargees`, { lignes });
  },

  async confirmerDepart(id: string) {
    return authPost<unknown>(`/api/v1/mobile/livraisons-transferts/${id}/confirmer-depart`);
  },
};

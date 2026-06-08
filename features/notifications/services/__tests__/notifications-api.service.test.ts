jest.mock('@/features/auth/services/secure-storage.service', () => ({
  secureStorage: { getToken: jest.fn().mockResolvedValue('tok') },
}));

import { fetchNotifications, markAllRead, markOneRead } from '../notifications-api.service';

beforeEach(() => {
  global.fetch = jest.fn();
  process.env.EXPO_PUBLIC_API_URL = 'http://api.test';
});

afterEach(() => {
  delete process.env.EXPO_PUBLIC_API_URL;
});

describe('fetchNotifications', () => {
  it('retourne les notifications si la réponse est ok', async () => {
    const payload = { data: [{ id: 'n1', lu: false }], unread_count: 1 };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => payload,
    });
    const result = await fetchNotifications();
    expect(result.unread_count).toBe(1);
    expect(result.data[0].id).toBe('n1');
  });

  it('lève une erreur si la réponse est ko', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, json: async () => ({}) });
    await expect(fetchNotifications()).rejects.toThrow('Erreur chargement notifications');
  });

  it('appelle la bonne URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true, json: async () => ({ data: [], unread_count: 0 }),
    });
    await fetchNotifications();
    expect(global.fetch).toHaveBeenCalledWith(
      'http://api.test/api/v1/mobile/notifications',
      expect.any(Object)
    );
  });
});

describe('markAllRead', () => {
  it('envoie une requête POST sans erreur', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
    await expect(markAllRead()).resolves.toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith(
      'http://api.test/api/v1/mobile/notifications/mark-all-read',
      expect.objectContaining({ method: 'POST' })
    );
  });
});

describe('markOneRead', () => {
  it('envoie une requête POST sur la bonne URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
    await expect(markOneRead('notif-99')).resolves.toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith(
      'http://api.test/api/v1/mobile/notifications/notif-99/read',
      expect.objectContaining({ method: 'POST' })
    );
  });
});

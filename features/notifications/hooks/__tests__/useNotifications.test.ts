import { act, renderHook } from '@testing-library/react-native';
import { AppState } from 'react-native';
import { useNotifications } from '../useNotifications';
import * as api from '../../services/notifications-api.service';
import type { AppNotification } from '../../services/notifications-api.service';

jest.mock('../../services/notifications-api.service');

const mockFetchNotifications = api.fetchNotifications as jest.MockedFunction<typeof api.fetchNotifications>;
const mockMarkAllRead        = api.markAllRead        as jest.MockedFunction<typeof api.markAllRead>;
const mockMarkOneRead        = api.markOneRead        as jest.MockedFunction<typeof api.markOneRead>;

const NOTIF_FIXTURE: AppNotification = {
  id: 'n1',
  type: 'livraison',
  titre: 'Nouvelle livraison',
  message: 'Vous avez une livraison.',
  data: {},
  lu: false,
  created_at: '2026-06-01T10:00:00Z',
};

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchNotifications.mockResolvedValue({ data: [], unread_count: 0 });
    mockMarkAllRead.mockResolvedValue(undefined);
    mockMarkOneRead.mockResolvedValue(undefined);
  });

  // ── État initial ──────────────────────────────────────────────────────────

  it('démarre avec loading=true et une liste vide', () => {
    const { result } = renderHook(() => useNotifications());

    expect(result.current.loading).toBe(true);
    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.error).toBeNull();
  });

  // ── load() ────────────────────────────────────────────────────────────────

  it('charge les notifications et met à jour unreadCount', async () => {
    mockFetchNotifications.mockResolvedValue({ data: [NOTIF_FIXTURE], unread_count: 1 });
    const { result } = renderHook(() => useNotifications());

    await act(async () => { await result.current.load(); });

    expect(result.current.notifications).toEqual([NOTIF_FIXTURE]);
    expect(result.current.unreadCount).toBe(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("définit error si fetchNotifications lève une exception", async () => {
    mockFetchNotifications.mockRejectedValue(new Error('Réseau'));
    const { result } = renderHook(() => useNotifications());

    await act(async () => { await result.current.load(); });

    expect(result.current.error).toBe('Impossible de charger les notifications.');
    expect(result.current.loading).toBe(false);
  });

  // ── markAllRead() ─────────────────────────────────────────────────────────

  it('markAllRead() marque toutes les notifs comme lues', async () => {
    mockFetchNotifications.mockResolvedValue({ data: [NOTIF_FIXTURE], unread_count: 1 });
    const { result } = renderHook(() => useNotifications());

    await act(async () => { await result.current.load(); });
    await act(async () => { await result.current.markAllRead(); });

    expect(result.current.notifications[0].lu).toBe(true);
    expect(result.current.unreadCount).toBe(0);
    expect(mockMarkAllRead).toHaveBeenCalled();
  });

  // ── markOneRead() ─────────────────────────────────────────────────────────

  it('markOneRead() marque une notif spécifique comme lue', async () => {
    const n2: AppNotification = { ...NOTIF_FIXTURE, id: 'n2', lu: false };
    mockFetchNotifications.mockResolvedValue({ data: [NOTIF_FIXTURE, n2], unread_count: 2 });
    const { result } = renderHook(() => useNotifications());

    await act(async () => { await result.current.load(); });
    await act(async () => { await result.current.markOneRead('n1'); });

    const n1 = result.current.notifications.find(n => n.id === 'n1');
    const n2Result = result.current.notifications.find(n => n.id === 'n2');
    expect(n1?.lu).toBe(true);
    expect(n2Result?.lu).toBe(false);
    expect(result.current.unreadCount).toBe(1);
  });

  it('markOneRead() ne descend pas unreadCount en dessous de 0', async () => {
    mockFetchNotifications.mockResolvedValue({
      data: [{ ...NOTIF_FIXTURE, lu: true }], unread_count: 0,
    });
    const { result } = renderHook(() => useNotifications());

    await act(async () => { await result.current.load(); });
    await act(async () => { await result.current.markOneRead('n1'); });

    expect(result.current.unreadCount).toBe(0);
  });

  // ── AppState listener ─────────────────────────────────────────────────────

  it('recharge quand l\'app passe de background à active', async () => {
    let appStateHandler: ((state: string) => void) | undefined;
    jest.spyOn(AppState, 'addEventListener').mockImplementation((_event, handler) => {
      appStateHandler = handler as any;
      return { remove: jest.fn() };
    });

    mockFetchNotifications.mockResolvedValue({ data: [NOTIF_FIXTURE], unread_count: 1 });
    const { result } = renderHook(() => useNotifications());

    await act(async () => {});

    const callsBefore = mockFetchNotifications.mock.calls.length;

    await act(async () => {
      // Simule app qui passe de background à active
      if (appStateHandler) {
        // Force appState.current à 'background'
        appStateHandler('background');
        appStateHandler('active');
      }
    });

    expect(mockFetchNotifications.mock.calls.length).toBeGreaterThan(callsBefore);
  });
});

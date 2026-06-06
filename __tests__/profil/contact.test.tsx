import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Linking, Alert } from 'react-native';

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('@/shared/contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#fff', surface: '#fff', surfaceAlt: '#f5f5f5',
      text: '#000', textMuted: '#999', primary: '#2563eb',
      primaryLight: '#dbeafe', border: '#e5e7eb',
      danger: '#dc2626', dangerBg: '#fee2e2',
    },
    isDark: false,
  }),
}));

import ContactScreen from '../../app/profil/contact';

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ContactScreen', () => {
  beforeEach(() => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    jest.spyOn(Linking, 'openURL').mockResolvedValue();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('affiche les deux options de contact', () => {
    render(<ContactScreen />);
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('Téléphone')).toBeTruthy();
  });

  it('ouvre le client email au clic sur Email', async () => {
    render(<ContactScreen />);
    const emailBtn = screen.getByText('contact@eaulamaman.com').parent?.parent;
    if (emailBtn) fireEvent.press(emailBtn);

    await new Promise(r => setTimeout(r, 0));
    expect(Linking.openURL).toHaveBeenCalledWith(
      expect.stringContaining('mailto:contact@eaulamaman.com')
    );
  });

  it('ouvre le téléphone au clic sur Téléphone', async () => {
    render(<ContactScreen />);
    const telBtn = screen.getByText('+224620000000').parent?.parent;
    if (telBtn) fireEvent.press(telBtn);

    await new Promise(r => setTimeout(r, 0));
    expect(Linking.openURL).toHaveBeenCalledWith(
      expect.stringContaining('tel:')
    );
  });

  it('affiche une alerte si canOpenURL retourne false (email)', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);

    render(<ContactScreen />);
    const emailBtn = screen.getByText('contact@eaulamaman.com').parent?.parent;
    if (emailBtn) fireEvent.press(emailBtn);

    await new Promise(r => setTimeout(r, 0));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Impossible d\'ouvrir',
      expect.stringContaining('contact@eaulamaman.com')
    );
  });
});

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import 'react-native-reanimated';

import { AppThemeProvider, useTheme } from '@/shared/contexts/ThemeContext';

function NavigationThemeWrapper({ children }: { children: ReactNode }) {
  const { isDark, colors } = useTheme();
  const base = isDark ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.background,
      card:       colors.surface,
      primary:    colors.primary,
      border:     colors.border,
    },
  };
  return <ThemeProvider value={navTheme}>{children}</ThemeProvider>;
}

export const unstable_settings = {
  anchor: '(auth)',
};

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <NavigationThemeWrapper>
        <Stack>
          <Stack.Screen name="(auth)"              options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)"              options={{ headerShown: false }} />
          <Stack.Screen name="modal"               options={{ presentation: 'modal' }} />
          <Stack.Screen name="scan"                options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="vehicule/[id]"       options={{ headerBackTitle: 'Retour' }} />
          <Stack.Screen name="vehicule/frais/[id]" options={{ headerBackTitle: 'Retour' }} />
          <Stack.Screen name="vehicule/proposer"   options={{ title: 'Proposer un véhicule', headerBackTitle: 'Retour' }} />
        </Stack>
        <StatusBarAuto />
      </NavigationThemeWrapper>
    </AppThemeProvider>
  );
}

function StatusBarAuto() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

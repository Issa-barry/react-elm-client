import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors } from '@/shared/constants/theme';

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
    card: Colors.surface,
    primary: Colors.primary,
    border: Colors.border,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={AppTheme}>
      <Stack>
        <Stack.Screen name="(tabs)"              options={{ headerShown: false }} />
        <Stack.Screen name="modal"               options={{ presentation: 'modal' }} />
        <Stack.Screen name="vehicule/[id]"       options={{ headerBackTitle: 'Retour' }} />
        <Stack.Screen name="vehicule/frais/[id]" options={{ headerBackTitle: 'Retour' }} />
        <Stack.Screen name="vehicule/proposer"   options={{ title: 'Proposer un véhicule', headerBackTitle: 'Retour' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

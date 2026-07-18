import { useCallback } from 'react';
import { Tabs, router, useFocusEffect } from 'expo-router';

import { HapticTab } from '@/shared/components/haptic-tab';
import { IconSymbol } from '@/shared/components/ui/icon-symbol';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { secureStorage } from '@/features/auth/services/secure-storage.service';

function IconAccueil({ color }: Readonly<{ color: string }>) {
  return <IconSymbol size={28} name="house.fill" color={color} />;
}

function IconLivraisons({ color }: Readonly<{ color: string }>) {
  return <IconSymbol size={28} name="shippingbox.fill" color={color} />;
}

function IconVehicules({ color }: Readonly<{ color: string }>) {
  return <IconSymbol size={28} name="car.fill" color={color} />;
}

export default function TabLayout() {
  const { colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      secureStorage.getToken().then(token => {
        if (!token) router.replace('/(auth)/login');
      });
    }, []),
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:   colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        headerShown:             false,
        tabBarButton:            HapticTab,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor:  colors.border,
          borderTopWidth:  1,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Accueil',    tabBarIcon: IconAccueil }}
      />
      <Tabs.Screen
        name="livraisons"
        options={{ title: 'Livraisons', tabBarIcon: IconLivraisons }}
      />
      <Tabs.Screen
        name="vehicules"
        options={{ title: 'Véhicules', tabBarIcon: IconVehicules }}
      />
      {/* notifications et gains restent comme routes mais masqués de la barre */}
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="gains"         options={{ href: null }} />
    </Tabs>
  );
}

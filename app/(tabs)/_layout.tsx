import { Tabs } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { HapticTab } from '@/shared/components/haptic-tab';
import { IconSymbol } from '@/shared/components/ui/icon-symbol';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { fetchNotifications } from '@/features/notifications/services/notifications-api.service';

function IconAccueil({ color }: Readonly<{ color: string }>) {
  return <IconSymbol size={28} name="house.fill" color={color} />;
}

function IconLivraisons({ color }: Readonly<{ color: string }>) {
  return <IconSymbol size={28} name="shippingbox.fill" color={color} />;
}

function IconVehicules({ color }: Readonly<{ color: string }>) {
  return <IconSymbol size={28} name="car.fill" color={color} />;
}

function IconNotifications({ color }: Readonly<{ color: string }>) {
  return <IconSymbol size={28} name="bell.fill" color={color} />;
}

export default function TabLayout() {
  const { colors } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetchNotifications();
        if (!cancelled) setUnreadCount(res.unread_count);
      } catch {
        // silencieux
      }
    }

    poll();

    const sub = AppState.addEventListener('change', next => {
      if (appState.current.match(/inactive|background/) && next === 'active') {
        poll();
      }
      appState.current = next;
    });

    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

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
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alertes',
          tabBarIcon: IconNotifications,
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
      {/* gains.tsx existe encore comme route mais est masqué de la barre */}
      <Tabs.Screen name="gains" options={{ href: null }} />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';

import { HapticTab } from '@/shared/components/haptic-tab';
import { IconSymbol } from '@/shared/components/ui/icon-symbol';
import { Colors } from '@/shared/constants/theme';

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
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:   Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        headerShown:             false,
        tabBarButton:            HapticTab,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor:  Colors.border,
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
      {/* gains.tsx existe encore comme route mais est masqué de la barre */}
      <Tabs.Screen name="gains" options={{ href: null }} />
    </Tabs>
  );
}

import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors, slate } from '@/shared/constants/theme';
import { HeaderBackButton } from '@/shared/components/HeaderBackButton';
import VehiculeDetailScreen from '@/features/vehicule/screens/VehiculeDetailScreen';
import VehiculeFraisScreen from '@/features/vehicule/screens/VehiculeFraisScreen';

type Onglet = 'commissions' | 'frais';

export default function VehiculeDetailRoute() {
  const { id, nom, immatriculation } = useLocalSearchParams<{
    id: string;
    nom: string;
    immatriculation: string;
  }>();

  const [onglet, setOnglet] = useState<Onglet>('commissions');
  const props = { id: id ?? '', nom: nom ?? '', immatriculation: immatriculation ?? '' };

  return (
    <>
      <Stack.Screen
        options={{
          title: nom ?? 'Véhicule',
          headerLeft: HeaderBackButton,
          headerBackVisible: false,
        }}
      />

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, onglet === 'commissions' && styles.tabActive]}
          onPress={() => setOnglet('commissions')}
          activeOpacity={0.7}>
          <Text style={[styles.tabLabel, onglet === 'commissions' && styles.tabLabelActive]}>
            Commissions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, onglet === 'frais' && styles.tabActive]}
          onPress={() => setOnglet('frais')}
          activeOpacity={0.7}>
          <Text style={[styles.tabLabel, onglet === 'frais' && styles.tabLabelActive]}>
            Dépenses
          </Text>
        </TouchableOpacity>
      </View>

      {onglet === 'commissions'
        ? <VehiculeDetailScreen {...props} />
        : <VehiculeFraisScreen {...props} />
      }
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: slate[200],
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: slate[400],
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

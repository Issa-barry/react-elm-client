import { Stack, router, useLocalSearchParams } from 'expo-router';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import VehiculeDetailScreen from '@/features/vehicule/screens/VehiculeDetailScreen';
import { Colors } from '@/shared/constants/theme';

function BackButton() {
  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
      <Text style={styles.backText}>‹ Retour</Text>
    </TouchableOpacity>
  );
}

export default function VehiculeDetailRoute() {
  const { id, nom, immatriculation } = useLocalSearchParams<{
    id: string;
    nom: string;
    immatriculation: string;
  }>();

  return (
    <>
      <Stack.Screen
        options={{
          title: nom ?? 'Véhicule',
          headerLeft: BackButton,
          headerBackVisible: false,
        }}
      />
      <VehiculeDetailScreen
        id={id ?? ''}
        nom={nom ?? ''}
        immatriculation={immatriculation ?? ''}
      />
    </>
  );
}

const styles = StyleSheet.create({
  backBtn:  { paddingRight: 8 },
  backText: { fontSize: 17, color: Colors.primary },
});

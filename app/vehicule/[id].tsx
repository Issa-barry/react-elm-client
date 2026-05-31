import { useLocalSearchParams, Stack } from 'expo-router';
import VehiculeDetailScreen from '@/features/vehicule/screens/VehiculeDetailScreen';

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
          headerBackTitle: 'Retour',
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

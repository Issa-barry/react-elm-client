import { Stack, useLocalSearchParams } from 'expo-router';
import { HeaderBackButton } from '@/shared/components/HeaderBackButton';
import VehiculeFraisScreen from '@/features/vehicule/screens/VehiculeFraisScreen';

export default function VehiculeFraisRoute() {
  const { id, nom, immatriculation } = useLocalSearchParams<{
    id: string;
    nom: string;
    immatriculation: string;
  }>();

  return (
    <>
      <Stack.Screen
        options={{
          title: nom ?? 'Frais',
          headerLeft: HeaderBackButton,
          headerBackVisible: false,
        }}
      />
      <VehiculeFraisScreen
        id={id ?? ''}
        nom={nom ?? ''}
        immatriculation={immatriculation ?? ''}
      />
    </>
  );
}

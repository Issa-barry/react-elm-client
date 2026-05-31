import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, slate } from '@/shared/constants/theme';

export default function ProposerVehiculeRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Proposer un véhicule', headerBackTitle: 'Retour' }} />
      <View style={styles.container}>
        <Text style={styles.icon}>🚚</Text>
        <Text style={styles.titre}>Formulaire à venir</Text>
        <Text style={styles.desc}>
          Cette section permettra de soumettre une demande de véhicule à l'équipe Eau la maman.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  icon:   { fontSize: 48 },
  titre:  { fontSize: 18, fontWeight: '700', color: Colors.text },
  desc:   { fontSize: 14, color: slate[400], textAlign: 'center', lineHeight: 22 },
});

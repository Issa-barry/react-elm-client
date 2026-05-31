import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { Colors, slate } from '@/shared/constants/theme';

interface VehiculeItem {
  id: string;
  nom: string;
  immatriculation: string;
  gains: number;
}

const MOCK_VEHICULES: VehiculeItem[] = [
  { id: '1', nom: 'Nen Dow',    immatriculation: 'RC-001-GN', gains: 270_000 },
  { id: '2', nom: 'Baba Ousou', immatriculation: 'VN-001-GN', gains: 0 },
  { id: '3', nom: 'Conakry 2',  immatriculation: 'TC-002-GN', gains: 0 },
];

function formatMontant(n: number): string {
  return n.toLocaleString('fr-FR') + ' GNF';
}

function VehiculeRow({ item, isLast }: { item: VehiculeItem; isLast: boolean }) {
  function handlePress() {
    router.push({
      pathname: '/vehicule/[id]',
      params: { id: item.id, nom: item.nom, immatriculation: item.immatriculation },
    });
  }

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress} style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.rowLeft}>
        <Text style={styles.nom}>{item.nom}</Text>
        <Text style={styles.immat}>{item.immatriculation}</Text>
        <View style={styles.gainsRow}>
          <Text style={styles.gainsLabel}>Gains</Text>
          <Text style={styles.gainsValeur}>{formatMontant(item.gains)}</Text>
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function SoldeVehicules() {
  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Solde par véhicule</Text>
      <View style={styles.card}>
        {MOCK_VEHICULES.map((item, index) => (
          <VehiculeRow
            key={item.id}
            item={item}
            isLast={index === MOCK_VEHICULES.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    gap: 12,
  },
  titre: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: slate[200],
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: slate[100],
  },
  rowLeft: {
    flex: 1,
    gap: 2,
  },
  nom: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  immat: {
    fontSize: 13,
    color: slate[400],
  },
  gainsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingRight: 8,
  },
  gainsLabel: {
    fontSize: 13,
    color: slate[400],
  },
  gainsValeur: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  chevron: {
    fontSize: 22,
    color: slate[300],
    marginLeft: 8,
  },
});

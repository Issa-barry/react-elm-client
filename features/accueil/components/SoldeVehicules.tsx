import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { Colors, slate } from '@/shared/constants/theme';
import { formatMontant } from '@/shared/utils/format';
import type { GainsParVehicule } from '@/features/gains/types/gains.types';

interface Props {
  parVehicule: GainsParVehicule[];
  loading: boolean;
  error: string | null;
}

function VehiculeRow({ item, isLast }: Readonly<{ item: GainsParVehicule; isLast: boolean }>) {
  function handlePress() {
    router.push({
      pathname: `/vehicule/${item.vehicule_id}`,
      params: { nom: item.nom, immatriculation: item.immatriculation },
    });
  }

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress} style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.rowLeft}>
        <Text style={styles.nom}>{item.nom}</Text>
        <Text style={styles.immat}>{item.immatriculation}</Text>
        <View style={styles.montantsRow}>
          <Text style={styles.montantLabel}>Net</Text>
          <Text style={styles.montantValeur}>{formatMontant(item.total_net)}</Text>
          {item.total_restant > 0 && (
            <>
              <Text style={styles.montantSep}>·</Text>
              <Text style={styles.montantLabel}>Restant</Text>
              <Text style={[styles.montantValeur, styles.montantRestant]}>
                {formatMontant(item.total_restant)}
              </Text>
            </>
          )}
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function SoldeVehicules({ parVehicule, loading, error }: Readonly<Props>) {
  const renderBody = () => {
    if (loading) {
      return <View style={styles.centerBox}><ActivityIndicator size="small" color={Colors.primary} /></View>;
    }
    if (error) {
      return <View style={styles.centerBox}><Text style={styles.errorText}>Impossible de charger les données.</Text></View>;
    }
    if (parVehicule.length === 0) {
      return <View style={styles.centerBox}><Text style={styles.emptyText}>Aucun véhicule rattaché.</Text></View>;
    }
    return parVehicule.map((item, index) => (
      <VehiculeRow key={item.vehicule_id} item={item} isLast={index === parVehicule.length - 1} />
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Solde par véhicule</Text>
      <View style={styles.card}>{renderBody()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { paddingHorizontal: 24, gap: 12 },
  titre:      { fontSize: 17, fontWeight: '700', color: Colors.text },
  card:       { backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1, borderColor: slate[200], overflow: 'hidden', minHeight: 60 },
  row:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  rowBorder:  { borderBottomWidth: 1, borderBottomColor: slate[100] },
  rowLeft:    { flex: 1, gap: 3 },
  nom:        { fontSize: 15, fontWeight: '600', color: Colors.text },
  immat:      { fontSize: 12, color: slate[400] },
  montantsRow:{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  montantLabel:  { fontSize: 12, color: slate[400] },
  montantValeur: { fontSize: 13, fontWeight: '600', color: Colors.text },
  montantSep:    { fontSize: 12, color: slate[300] },
  montantRestant:{ color: '#f97316' },
  chevron:    { fontSize: 22, color: slate[300], marginLeft: 8 },
  centerBox:  { paddingVertical: 20, alignItems: 'center' },
  emptyText:  { fontSize: 13, color: slate[400] },
  errorText:  { fontSize: 13, color: '#dc2626' },
});

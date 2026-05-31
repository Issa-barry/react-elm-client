import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Colors, slate } from '@/shared/constants/theme';
import {
  MOCK_VEHICULES,
  STATUT_VEHICULE_CONFIG,
  TYPE_ICONE,
  type Vehicule,
} from '@/features/vehicule/data/mock-vehicules';

function formatMontant(n: number): string {
  return n.toLocaleString('fr-FR') + ' GNF';
}

function VehiculeCard({ vehicule }: Readonly<{ vehicule: Vehicule }>) {
  const statut = STATUT_VEHICULE_CONFIG[vehicule.statut];
  const icone  = TYPE_ICONE[vehicule.type];

  function handlePress() {
    router.push({
      pathname: `/vehicule/frais/${vehicule.id}`,
      params: { nom: vehicule.nom, immatriculation: vehicule.immatriculation },
    });
  }

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress} style={styles.card}>
      {/* Icône type */}
      <View style={styles.iconBox}>
        <Text style={styles.iconText}>{icone}</Text>
      </View>

      {/* Infos */}
      <View style={styles.infos}>
        <View style={styles.infosTop}>
          <Text style={styles.nom}>{vehicule.nom}</Text>
          <View style={[styles.badge, { backgroundColor: statut.bg }]}>
            <Text style={[styles.badgeText, { color: statut.text }]}>{statut.label}</Text>
          </View>
        </View>

        <Text style={styles.immat}>{vehicule.immatriculation}</Text>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Type</Text>
            <Text style={styles.metaValue}>{vehicule.type}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Capacité</Text>
            <Text style={styles.metaValue}>{vehicule.capacite} packs</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Frais</Text>
            <Text style={[styles.metaValue, styles.metaGains]}>
              {formatMontant(vehicule.gains)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function VehiculesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}>

        <Text style={styles.titre}>Mes véhicules</Text>
        <Text style={styles.sousTitre}>{MOCK_VEHICULES.length} véhicule{MOCK_VEHICULES.length > 1 ? 's' : ''}</Text>

        <View style={styles.liste}>
          {MOCK_VEHICULES.map((v) => (
            <VehiculeCard key={v.id} vehicule={v} />
          ))}
        </View>
      </ScrollView>

      {/* FAB Proposer un véhicule */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => router.push('/vehicule/proposer')}>
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabLabel}>Proposer un véhicule</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },

  titre: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  sousTitre: {
    fontSize: 14,
    color: slate[400],
    marginTop: 2,
    marginBottom: 20,
  },

  liste: {
    gap: 12,
  },

  // Carte véhicule
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: slate[200],
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: slate[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 26,
  },
  infos: {
    flex: 1,
    gap: 4,
  },
  infosTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nom: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  immat: {
    fontSize: 13,
    color: slate[400],
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  metaItem: {
    gap: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: slate[400],
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  metaGains: {
    color: Colors.primary,
  },
  metaDivider: {
    width: 1,
    height: 28,
    backgroundColor: slate[200],
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 22,
    color: slate[300],
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 28,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '300',
    lineHeight: 24,
  },
  fabLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

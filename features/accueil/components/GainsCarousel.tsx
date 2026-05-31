import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import { Colors, blue, slate } from '@/shared/constants/theme';
import { formatMontant } from '@/shared/utils/format';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 24;
const CARD_GAP = 12;
const CARD_WIDTH = SCREEN_WIDTH - H_PADDING * 2;
const CARD_HEIGHT = 155;

interface CardData {
  id: string;
  titre: string;
  montant: number;
  sousTitre: string;
  variant: 'primary' | 'white';
}

const CARDS: CardData[] = [
  {
    id: '1',
    titre: 'Gains total',
    montant: 2_955_000,
    sousTitre: '11 gains',
    variant: 'primary',
  },
  {
    id: '2',
    titre: 'Déjà payé',
    montant: 2_510_000,
    sousTitre: '2 versements',
    variant: 'white',
  },
  {
    id: '3',
    titre: 'Reste à payer',
    montant: 445_000,
    sousTitre: '9 impayés · 0 annulé',
    variant: 'white',
  },
];


// Dimensions explicites en pixels — nécessaire sur iOS (RN SVG ne résout pas % correctement)
function WavePrimary() {
  return (
    <Svg
      width={CARD_WIDTH}
      height={CARD_HEIGHT}
      viewBox="0 0 900 600"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}>
      <Rect x="0" y="0" width="900" height="600" fill={blue[600]} />
      <Path
        d="M0 400L30 386.5C60 373 120 346 180 334.8C240 323.7 300 328.3 360 345.2C420 362 480 391 540 392C600 393 660 366 720 355.2C780 344.3 840 349.7 870 352.3L900 355L900 601L870 601C840 601 780 601 720 601C660 601 600 601 540 601C480 601 420 601 360 601C300 601 240 601 180 601C120 601 60 601 30 601L0 601Z"
        fill={blue[500]}
      />
    </Svg>
  );
}

function CardPrimary({ card }: { card: CardData }) {
  return (
    <View style={[styles.card, styles.cardPrimary]}>
      <WavePrimary />
      <Text style={styles.titrePrimary}>{card.titre}</Text>
      <Text style={styles.montantPrimary}>{formatMontant(card.montant)}</Text>
      <Text style={styles.sousTitrePrimary}>{card.sousTitre}</Text>
    </View>
  );
}

function CardWhite({ card }: { card: CardData }) {
  return (
    <View style={[styles.card, styles.cardWhite]}>
      <Text style={styles.titreWhite}>{card.titre}</Text>
      <Text style={styles.montantWhite}>{formatMontant(card.montant)}</Text>
      <Text style={styles.sousTitreWhite}>{card.sousTitre}</Text>
    </View>
  );
}

export default function GainsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP));
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={CARDS}
        keyExtractor={(item) => item.id}
        horizontal
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) =>
          item.variant === 'primary'
            ? <CardPrimary card={item} />
            : <CardWhite card={item} />
        }
      />
      <View style={styles.dots}>
        {CARDS.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  list: {
    paddingHorizontal: H_PADDING,
  },

  // ── Carte commune ──────────────────────────────────────
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },

  // ── Carte 1 : bleue avec vagues ────────────────────────
  cardPrimary: {
    backgroundColor: Colors.primary,
  },
  titrePrimary: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '500',
  },
  montantPrimary: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  sousTitrePrimary: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
  },

  // ── Cartes 2 & 3 : blanches ────────────────────────────
  cardWhite: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: slate[200],
  },
  titreWhite: {
    color: slate[500],
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  montantWhite: {
    color: slate[900],
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  sousTitreWhite: {
    color: slate[400],
    fontSize: 13,
    textAlign: 'center',
  },

  // ── Pagination dots ────────────────────────────────────
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: slate[300],
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
});

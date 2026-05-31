import { StyleSheet, Text, View } from 'react-native';
import { Colors, blue, slate } from '@/shared/constants/theme';

interface Props {
  current: number;
  total: number;
  labels?: string[];
}

export function StepIndicator({ current, total, labels }: Readonly<Props>) {
  return (
    <View style={styles.wrapper}>
      {Array.from({ length: total }, (_, i) => {
        const n       = i + 1;
        const done    = n < current;
        const active  = n === current;
        return (
          <View key={n} style={styles.item}>
            <View style={[styles.circle, done ? styles.circleDone : active ? styles.circleActive : styles.circlePending]}>
              {done
                ? <Text style={styles.check}>✓</Text>
                : <Text style={[styles.num, active ? styles.numActive : styles.numPending]}>{n}</Text>
              }
            </View>
            {labels?.[i] ? (
              <Text style={[styles.label, active ? styles.labelActive : styles.labelPending]} numberOfLines={1}>
                {labels[i]}
              </Text>
            ) : null}
            {n < total && <View style={[styles.line, done ? styles.lineDone : styles.linePending]} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 0 },
  item:    { alignItems: 'center', flex: 1, position: 'relative' },

  circle: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2,
  },
  circleDone:    { backgroundColor: Colors.primary, borderColor: Colors.primary },
  circleActive:  { backgroundColor: Colors.surface, borderColor: Colors.primary },
  circlePending: { backgroundColor: Colors.surface, borderColor: slate[300] },

  check:       { color: '#fff', fontSize: 14, fontWeight: '700' },
  num:         { fontSize: 13, fontWeight: '700' },
  numActive:   { color: Colors.primary },
  numPending:  { color: slate[400] },

  label:        { fontSize: 10, marginTop: 4, textAlign: 'center', maxWidth: 64 },
  labelActive:  { color: Colors.primary, fontWeight: '600' },
  labelPending: { color: slate[400] },

  line: {
    position: 'absolute',
    top: 15, left: '50%',
    width: '100%', height: 2,
    zIndex: -1,
  },
  lineDone:    { backgroundColor: Colors.primary },
  linePending: { backgroundColor: slate[200] },
});

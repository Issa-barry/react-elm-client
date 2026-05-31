import { useRef } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors, blue, slate } from '@/shared/constants/theme';

interface Props {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  length?: number;
}

export function OtpInput({ value, onChange, error, length = 5 }: Readonly<Props>) {
  const refs = useRef<(TextInput | null)[]>([]);

  function handleChange(text: string, index: number) {
    const digit = text.replace(/\D/g, '').slice(-1);
    const next  = value.split('');
    next[index] = digit;
    const joined = next.join('').slice(0, length);
    onChange(joined);
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
    if (!digit && index > 0)         refs.current[index - 1]?.focus();
  }

  function handleKeyPress(key: string, index: number) {
    if (key === 'Backspace' && !value[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.boxes}>
        {Array.from({ length }).map((_, i) => (
          <TextInput
            key={i}
            ref={el => { refs.current[i] = el; }}
            style={[styles.box, value[i] ? styles.boxFilled : undefined, error ? styles.boxError : undefined]}
            value={value[i] ?? ''}
            onChangeText={t => handleChange(t, i)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            accessibilityLabel={`Chiffre ${i + 1} du code`}
          />
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8, alignItems: 'center' },
  boxes:   { flexDirection: 'row', gap: 10 },
  box: {
    width: 52, height: 58,
    borderWidth: 1.5, borderColor: slate[200],
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22, fontWeight: '700', color: Colors.text,
    backgroundColor: Colors.surface,
  },
  boxFilled: { borderColor: Colors.primary, backgroundColor: blue[50] },
  boxError:  { borderColor: '#ef4444' },
  error:     { fontSize: 12, color: '#ef4444' },
});

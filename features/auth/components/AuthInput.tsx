import {
  StyleSheet, Text, TextInput, View,
  type TextInputProps,
} from 'react-native';
import { Colors, slate } from '@/shared/constants/theme';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export function AuthInput({ label, error, style, ...rest }: Readonly<Props>) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : undefined, style]}
        placeholderTextColor={slate[400]}
        autoCapitalize="none"
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: slate[200],
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  inputError: { borderColor: '#ef4444' },
  error: { fontSize: 12, color: '#ef4444', marginTop: 2 },
});

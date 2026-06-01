import {
  StyleSheet, Text, TextInput, View,
  type TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, slate } from '@/shared/constants/theme';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  locked?: boolean;
}

export function AuthInput({ label, error, locked, style, ...rest }: Readonly<Props>) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputRow,
        error  ? styles.inputError  : undefined,
        locked ? styles.inputLocked : undefined,
      ]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={slate[400]}
          autoCapitalize="none"
          editable={!locked}
          {...rest}
        />
        {locked && (
          <Ionicons name="lock-closed" size={16} color={slate[400]} style={styles.lockIcon} />
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label:   { fontSize: 14, fontWeight: '600', color: Colors.text },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1.5,
    borderColor: slate[200],
    borderRadius: 12,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
  },
  inputError:  { borderColor: '#ef4444' },
  inputLocked: { backgroundColor: slate[50], borderColor: slate[200] },

  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  lockIcon: { marginLeft: 6 },
  error: { fontSize: 12, color: '#ef4444', marginTop: 2 },
});

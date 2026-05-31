import { useState } from 'react';
import {
  StyleSheet, Text, TextInput, TouchableOpacity, View,
  type TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, slate } from '@/shared/constants/theme';

interface Props extends Omit<TextInputProps, 'secureTextEntry'> {
  label: string;
  error?: string;
}

export function PasswordInput({ label, error, style, ...rest }: Readonly<Props>) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.row, error ? styles.rowError : undefined]}>
        <TextInput
          style={[styles.input, style]}
          secureTextEntry={!visible}
          placeholderTextColor={slate[400]}
          autoCapitalize="none"
          autoComplete="password"
          {...rest}
        />
        <TouchableOpacity onPress={() => setVisible(v => !v)} style={styles.toggle} accessibilityLabel={visible ? 'Masquer' : 'Afficher'}>
          <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color={slate[400]} />
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1.5,
    borderColor: slate[200],
    borderRadius: 12,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
  },
  rowError: { borderColor: '#ef4444' },
  input: { flex: 1, fontSize: 15, color: Colors.text },
  toggle: { paddingLeft: 8 },
  error: { fontSize: 12, color: '#ef4444', marginTop: 2 },
});

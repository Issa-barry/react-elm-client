import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/shared/constants/theme';

interface Props {
  label?: string;
}

export function HeaderBackButton({ label = 'Retour' }: Readonly<Props>) {
  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.btn} hitSlop={12} activeOpacity={0.6}>
      <Text style={styles.label}>‹ {label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn:   { paddingRight: 8 },
  label: { fontSize: 17, color: Colors.primary },
});

import { Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export function CloseButton() {
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      onPress={() => router.back()}
      android_ripple={null}
      style={[styles.circle, { top: insets.top + 10 }]}
    >
      <Ionicons name="arrow-back" size={20} color="#111111" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});

import { useState } from 'react';
import {
  FlatList, Modal, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, blue, slate } from '@/shared/constants/theme';
import { COUNTRIES, type Country } from '../types/auth.types';

function flagEmoji(code: string): string {
  return code.toUpperCase().split('').map(
    c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)
  ).join('');
}

interface Props {
  label?: string;
  codePays: string;
  prefix: string;
  telephoneLocal: string;
  onChangePhone: (local: string) => void;
  onChangeCountry: (code: string, prefix: string) => void;
  error?: string;
}

export function PhoneInput({
  label = 'Numéro de téléphone',
  codePays, prefix, telephoneLocal,
  onChangePhone, onChangeCountry,
  error,
}: Readonly<Props>) {
  const [modalVisible, setModalVisible] = useState(false);
  const selected = COUNTRIES.find(c => c.code === codePays) ?? COUNTRIES[0];

  function selectCountry(c: Country) {
    onChangeCountry(c.code, c.prefix);
    setModalVisible(false);
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.row, error ? styles.rowError : undefined]}>
        {/* Sélecteur pays */}
        <TouchableOpacity
          style={styles.countryBtn}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Choisir le pays">
          <Text style={styles.flag}>{flagEmoji(selected.code)}</Text>
          <Text style={styles.prefix}>{selected.prefix}</Text>
          <Ionicons name="chevron-down" size={14} color={slate[400]} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Numéro local */}
        <TextInput
          style={styles.input}
          value={telephoneLocal}
          onChangeText={t => {
            const raw = t.replace(/\D/g, '');
            // Autoriser localLength+1 si commence par 0 (ex: France 07XXXXXXXX)
            const max = raw.startsWith('0') ? selected.digits + 1 : selected.digits;
            onChangePhone(raw.slice(0, max));
          }}
          keyboardType="phone-pad"
          placeholder={`${selected.digits} chiffres`}
          placeholderTextColor={slate[400]}
          maxLength={selected.digits + 1}
          accessibilityLabel="Numéro de téléphone"
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Modal sélection pays */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.backdrop} onPress={() => setModalVisible(false)} />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Choisir un pays</Text>
          <FlatList
            data={COUNTRIES}
            keyExtractor={c => c.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.countryItem, item.code === codePays && styles.countryItemActive]}
                onPress={() => selectCountry(item)}>
                <View style={styles.countryLeft}>
                  <Text style={styles.itemFlag}>{flagEmoji(item.code)}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                </View>
                <Text style={[styles.countryPrefix, item.code === codePays && styles.countryPrefixActive]}>
                  {item.prefix}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label:   { fontSize: 14, fontWeight: '600', color: Colors.text },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1.5,
    borderColor: slate[200],
    borderRadius: 12,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  rowError:    { borderColor: '#ef4444' },
  countryBtn:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 6 },
  flag:        { fontSize: 20 },
  prefix:      { fontSize: 14, fontWeight: '600', color: Colors.text },
  divider:     { width: 1, height: 28, backgroundColor: slate[200] },
  input:       { flex: 1, paddingHorizontal: 12, fontSize: 15, color: Colors.text },
  error:       { fontSize: 12, color: '#ef4444', marginTop: 2 },

  // Modal
  backdrop:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '60%',
  },
  sheetTitle: {
    fontSize: 16, fontWeight: '700', color: Colors.text,
    paddingHorizontal: 20, marginBottom: 12,
  },
  countryItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: slate[100],
  },
  countryItemActive: { backgroundColor: blue[50] },
  countryLeft:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemFlag:     { fontSize: 22 },
  countryName:  { fontSize: 15, color: Colors.text },
  countryPrefix:     { fontSize: 14, color: slate[400] },
  countryPrefixActive: { color: Colors.primary, fontWeight: '600' },
});

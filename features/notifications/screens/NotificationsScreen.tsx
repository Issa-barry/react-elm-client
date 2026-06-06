import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTheme } from '@/shared/contexts/ThemeContext';
import { useNotifications } from '../hooks/useNotifications';
import type { AppNotification } from '../services/notifications-api.service';

function NotificationItem({
  item,
  onPress,
}: {
  item: AppNotification;
  onPress: (id: string) => void;
}) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.item,
        {
          backgroundColor: item.lu ? colors.surface : colors.primaryLight ?? colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}>
      {!item.lu && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
      <View style={styles.itemContent}>
        <Text style={[styles.titre, { color: colors.text }]}>{item.titre ?? 'Notification'}</Text>
        <Text style={[styles.message, { color: colors.textSecondary ?? colors.text }]}>{item.message}</Text>
        <Text style={[styles.date, { color: colors.textSecondary ?? colors.text }]}>
          {new Date(item.created_at).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const { notifications, unreadCount, loading, error, load, markAllRead, markOneRead } =
    useNotifications();

  const handlePress = useCallback(
    (id: string) => {
      const notif = notifications.find(n => n.id === id);
      if (notif && !notif.lu) {
        markOneRead(id);
      }
    },
    [notifications, markOneRead]
  );

  if (loading && notifications.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {unreadCount > 0 && (
        <TouchableOpacity
          style={[styles.markAllBtn, { borderBottomColor: colors.border }]}
          onPress={markAllRead}>
          <Text style={[styles.markAllText, { color: colors.primary }]}>
            Tout marquer comme lu ({unreadCount})
          </Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <NotificationItem item={item} onPress={handlePress} />}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: colors.textSecondary ?? colors.text }}>
              {error ?? 'Aucune notification'}
            </Text>
          </View>
        }
        contentContainerStyle={notifications.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyContainer: { flex: 1 },
  markAllBtn:   { padding: 12, borderBottomWidth: 1, alignItems: 'flex-end' },
  markAllText:  { fontSize: 13, fontWeight: '600' },
  item:         { flexDirection: 'row', alignItems: 'flex-start', padding: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  dot:          { width: 8, height: 8, borderRadius: 4, marginTop: 6, marginRight: 10, flexShrink: 0 },
  itemContent:  { flex: 1 },
  titre:        { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  message:      { fontSize: 13, marginBottom: 4 },
  date:         { fontSize: 11, opacity: 0.6 },
});

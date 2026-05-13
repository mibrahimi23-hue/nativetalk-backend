import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { StudentNav } from './_layout';
import { Avatar } from '@/components/ui/Avatar';
import { Empty } from '@/components/ui/Empty';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface Conversation {
  other_user_id: string;
  other_user_name: string;
  other_user_photo?: string;
  last_message?: string;
  last_message_at?: string;
  unread_count?: number;
}

export default function StudentChat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.chat.conversations() as Conversation[];
      setConversations(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Messages</Text>
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
        ) : conversations.length === 0 ? (
          <Empty icon="chatbubbles-outline" title="No conversations yet" subtitle="Start a chat from a tutor's profile or lesson detail." />
        ) : (
          conversations.map(c => (
            <TouchableOpacity
              key={c.other_user_id}
              style={s.row}
              onPress={() => router.push({ pathname: '/student/direct/[userId]', params: { userId: c.other_user_id, name: c.other_user_name } })}
              activeOpacity={0.85}
            >
              <Avatar uri={c.other_user_photo} name={c.other_user_name} size={48} />
              <View style={s.rowBody}>
                <View style={s.rowTop}>
                  <Text style={s.rowName}>{c.other_user_name}</Text>
                  {c.last_message_at ? (
                    <Text style={s.rowTime}>{new Date(c.last_message_at).toLocaleDateString()}</Text>
                  ) : null}
                </View>
                <Text style={s.rowMsg} numberOfLines={1}>{c.last_message ?? 'No messages yet'}</Text>
              </View>
              {c.unread_count ? (
                <View style={s.badge}><Text style={s.badgeTxt}>{c.unread_count}</Text></View>
              ) : null}
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 110 }} />
      </ScrollView>
      <StudentNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.divider },
  title: { fontFamily: F.heading, fontSize: 24, color: C.text },
  scroll: { paddingHorizontal: 0, paddingTop: 0 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.divider, gap: 12 },
  rowBody: { flex: 1 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  rowName: { fontFamily: F.body, fontSize: 15, color: C.text, fontWeight: '600' },
  rowTime: { fontFamily: F.label, fontSize: 11, color: C.textSub },
  rowMsg: { fontFamily: F.body, fontSize: 13, color: C.textSub },
  badge: { backgroundColor: C.primary, borderRadius: 12, minWidth: 22, height: 22, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  badgeTxt: { fontFamily: F.label, fontSize: 11, color: C.textLight, fontWeight: '700' },
});

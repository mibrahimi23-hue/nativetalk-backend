import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TutorNav } from './_layout';
import { Avatar } from '@/components/ui/Avatar';
import { Empty } from '@/components/ui/Empty';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface Conversation {
  other_user_id: string;
  other_user_name: string;
  other_user_photo?: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

export default function TutorChat() {
  const [convos, setConvos] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.chat.conversations() as Conversation[];
      setConvos(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Messages</Text>
      </View>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={C.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
        ) : convos.length === 0 ? (
          <Empty icon="chatbubble-outline" title="No messages yet" subtitle="Your conversations with students will appear here." />
        ) : (
          convos.map(c => (
            <TouchableOpacity
              key={c.other_user_id}
              style={s.row}
              onPress={() => router.push({ pathname: '/tutor/direct/[userId]', params: { userId: c.other_user_id, name: c.other_user_name } })}
              activeOpacity={0.88}
            >
              <View style={{ position: 'relative' }}>
                <Avatar uri={c.other_user_photo} name={c.other_user_name} size={50} />
                {c.unread_count > 0 && (
                  <View style={s.badge}>
                    <Text style={s.badgeTxt}>{c.unread_count > 9 ? '9+' : c.unread_count}</Text>
                  </View>
                )}
              </View>
              <View style={s.info}>
                <View style={s.nameRow}>
                  <Text style={[s.name, c.unread_count > 0 && s.nameBold]}>{c.other_user_name}</Text>
                  <Text style={s.time}>{formatTime(c.last_message_at)}</Text>
                </View>
                <Text style={[s.preview, c.unread_count > 0 && s.previewBold]} numberOfLines={1}>{c.last_message}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 110 }} />
      </ScrollView>
      <TutorNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontFamily: F.heading, fontSize: 24, color: C.text },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.divider, gap: 14 },
  badge: { position: 'absolute', top: -2, right: -2, backgroundColor: C.primary, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeTxt: { fontFamily: F.label, fontSize: 10, color: '#fff', fontWeight: '700' },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontFamily: F.body, fontSize: 15, color: C.text },
  nameBold: { fontWeight: '700' },
  time: { fontFamily: F.label, fontSize: 11, color: C.textSub },
  preview: { fontFamily: F.body, fontSize: 13, color: C.textSub },
  previewBold: { color: C.text, fontWeight: '600' },
});

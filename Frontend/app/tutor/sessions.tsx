import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TutorNav } from './_layout';
import { StatusBadge, LevelBadge } from '@/components/ui/Badge';
import { Empty } from '@/components/ui/Empty';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface Session {
  id: string;
  status: string;
  scheduled_at: string;
  level: string;
  student_name?: string;
}

const STATUS_TABS = ['All', 'pending', 'confirmed', 'completed', 'cancelled'];

export default function TutorSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState('All');

  const load = useCallback(async () => {
    try {
      const data = await api.sessions.mine() as Session[];
      setSessions(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const handleConfirm = async (id: string) => {
    try {
      await api.sessions.confirm(id);
      await load();
    } catch (e) { Alert.alert('Error', (e as Error).message); }
  };

  const filtered = tab === 'All' ? sessions : sessions.filter(s => s.status === tab);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>My Sessions</Text>
        <Text style={s.sub}>{sessions.length} total</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabs} style={s.tabScroll}>
        {STATUS_TABS.map(t => (
          <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={C.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
        ) : filtered.length === 0 ? (
          <Empty icon="book-outline" title={`No ${tab === 'All' ? '' : tab} sessions`} />
        ) : (
          filtered.map(sess => {
            const dt = new Date(sess.scheduled_at);
            return (
              <TouchableOpacity key={sess.id} style={s.card} onPress={() => router.push({ pathname: '/tutor/session/[id]', params: { id: sess.id } })} activeOpacity={0.88}>
                <View style={s.dateCol}>
                  <Text style={s.day}>{dt.getDate()}</Text>
                  <Text style={s.mon}>{dt.toLocaleDateString(undefined, { month: 'short' })}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.student}>{sess.student_name ?? 'Student'}</Text>
                  <Text style={s.time}>{dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · <LevelBadge level={sess.level} /></Text>
                  <StatusBadge status={sess.status} />
                </View>
                {sess.status === 'pending' && (
                  <TouchableOpacity style={s.confirmBtn} onPress={() => handleConfirm(sess.id)}>
                    <Text style={s.confirmTxt}>Confirm</Text>
                  </TouchableOpacity>
                )}
                {sess.status === 'confirmed' && (
                  <TouchableOpacity style={s.joinBtn} onPress={() => router.push({ pathname: '/tutor/videocall/[sessionId]', params: { sessionId: sess.id } })}>
                    <Text style={s.joinTxt}>Join</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })
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
  sub: { fontFamily: F.body, fontSize: 13, color: C.textSub, marginTop: 2 },
  tabScroll: { borderBottomWidth: 1, borderBottomColor: C.divider },
  tabs: { paddingHorizontal: 16, gap: 4 },
  tab: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: C.primary },
  tabText: { fontFamily: F.label, fontSize: 13, color: C.textSub },
  tabTextActive: { color: C.primary, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, paddingTop: 14 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 2, shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
  dateCol: { width: 46, height: 52, backgroundColor: C.primaryLight, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  day: { fontFamily: F.heading, fontSize: 20, color: C.primary, lineHeight: 22 },
  mon: { fontFamily: F.label, fontSize: 11, color: C.primary, textTransform: 'uppercase' },
  student: { fontFamily: F.body, fontSize: 15, color: C.text, fontWeight: '600', marginBottom: 4 },
  time: { fontFamily: F.label, fontSize: 12, color: C.textSub, marginBottom: 4 },
  confirmBtn: { backgroundColor: C.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  confirmTxt: { fontFamily: F.label, fontSize: 12, color: C.textLight, fontWeight: '700' },
  joinBtn: { backgroundColor: C.success, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  joinTxt: { fontFamily: F.label, fontSize: 12, color: C.textLight, fontWeight: '700' },
});

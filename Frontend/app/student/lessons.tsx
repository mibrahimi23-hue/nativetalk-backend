import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { StudentNav } from './_layout';
import { StatusBadge, LevelBadge } from '@/components/ui/Badge';
import { Empty } from '@/components/ui/Empty';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface Session {
  id: string;
  status: string;
  scheduled_at: string;
  level: string;
  teacher_name?: string;
  course_payment_id?: string;
  daily_room_url?: string;
}

const STATUS_TABS = ['All', 'upcoming', 'confirmed', 'completed', 'cancelled'];

function SessionCard({ session }: { session: Session }) {
  const dt = new Date(session.scheduled_at);
  const dateStr = dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const canJoin = session.status === 'confirmed';

  return (
    <TouchableOpacity
      style={card.wrap}
      onPress={() => router.push({ pathname: '/student/lesson/[id]', params: { id: session.id } })}
      activeOpacity={0.88}
    >
      <View style={card.top}>
        <View style={card.dateCol}>
          <Text style={card.dateDay}>{dt.getDate()}</Text>
          <Text style={card.dateMon}>{dt.toLocaleDateString(undefined, { month: 'short' })}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={card.teacherName} numberOfLines={1}>
            {session.teacher_name ?? 'Lesson'}
          </Text>
          <Text style={card.time}>{dateStr} · {timeStr}</Text>
          <View style={card.badges}>
            <LevelBadge level={session.level} />
            <StatusBadge status={session.status} />
          </View>
        </View>
        {canJoin && (
          <TouchableOpacity
            style={card.joinBtn}
            onPress={() => router.push({ pathname: '/student/videocall/[sessionId]', params: { sessionId: session.id } })}
          >
            <Ionicons name="videocam" size={16} color={C.textLight} />
            <Text style={card.joinTxt}>Join</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const card = StyleSheet.create({
  wrap: { backgroundColor: C.card, borderRadius: 16, padding: 14, marginBottom: 10, elevation: 2, shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
  top: { flexDirection: 'row', alignItems: 'center' },
  dateCol: { width: 46, height: 52, backgroundColor: C.primaryLight, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  dateDay: { fontFamily: F.heading, fontSize: 20, color: C.primary, lineHeight: 22 },
  dateMon: { fontFamily: F.label, fontSize: 11, color: C.primary, textTransform: 'uppercase' },
  teacherName: { fontFamily: F.body, fontSize: 15, color: C.text, fontWeight: '600', marginBottom: 3 },
  time: { fontFamily: F.label, fontSize: 12, color: C.textSub, marginBottom: 6 },
  badges: { flexDirection: 'row', gap: 6 },
  joinBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  joinTxt: { fontFamily: F.label, fontSize: 12, color: C.textLight, fontWeight: '700' },
});

export default function StudentLessons() {
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const filtered = tab === 'All' ? sessions : sessions.filter(s => s.status === tab);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>My Lessons</Text>
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
        ) : filtered.length === 0 ? (
          <Empty icon="book-outline" title={tab === 'All' ? 'No lessons yet' : `No ${tab} lessons`} subtitle={tab === 'All' ? 'Book your first lesson from the home screen.' : undefined} />
        ) : (
          filtered.map(s => <SessionCard key={s.id} session={s} />)
        )}
        <View style={{ height: 110 }} />
      </ScrollView>
      <StudentNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontFamily: F.heading, fontSize: 24, color: C.text },
  sub: { fontFamily: F.body, fontSize: 13, color: C.textSub, marginTop: 2 },
  tabScroll: { borderBottomWidth: 1, borderBottomColor: C.divider },
  tabs: { paddingHorizontal: 16, gap: 4, paddingBottom: 0 },
  tab: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 0, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: C.primary },
  tabText: { fontFamily: F.label, fontSize: 13, color: C.textSub },
  tabTextActive: { color: C.primary, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, paddingTop: 14 },
});

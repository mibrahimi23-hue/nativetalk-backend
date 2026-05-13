import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { TutorNav } from './_layout';
import { Avatar } from '@/components/ui/Avatar';
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
  course_payment_id?: string;
}

interface Earnings {
  total_earned?: number;
  pending_payout?: number;
}

export default function TutorDashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [earnings, setEarnings] = useState<Earnings>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [sess, earn] = await Promise.all([
        api.sessions.mine() as Promise<Session[]>,
        user?.teacher_id ? api.payments.byTeacher(user.teacher_id) as Promise<Earnings> : Promise.resolve({}),
      ]);
      setSessions(Array.isArray(sess) ? sess : []);
      setEarnings((earn as Earnings) ?? {});
    } catch {}
  }, [user]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const upcoming = sessions.filter(s => ['pending', 'confirmed'].includes(s.status));
  const today = upcoming.filter(s => {
    const d = new Date(s.scheduled_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const firstName = user?.full_name?.split(' ')[0] ?? 'Tutor';

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />}
      >
        {/* Header */}
        <View style={s.topRow}>
          <View>
            <Text style={s.greeting}>Hello, {firstName}</Text>
            <Text style={s.greetSub}>Ready to teach today?</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/tutor/profile')}>
            <Avatar uri={user?.profile_photo} name={user?.full_name ?? ''} size={42} />
          </TouchableOpacity>
        </View>

        {/* Earnings summary */}
        <View style={s.earningsCard}>
          <View style={s.earningItem}>
            <Text style={s.earningLabel}>Total Earned</Text>
            <Text style={s.earningVal}>€{(earnings.total_earned ?? 0).toFixed(2)}</Text>
          </View>
          <View style={s.earningDivider} />
          <View style={s.earningItem}>
            <Text style={s.earningLabel}>Pending</Text>
            <Text style={[s.earningVal, { color: C.warning }]}>€{(earnings.pending_payout ?? 0).toFixed(2)}</Text>
          </View>
          <View style={s.earningDivider} />
          <View style={s.earningItem}>
            <Text style={s.earningLabel}>Today's</Text>
            <Text style={s.earningVal}>{today.length} sessions</Text>
          </View>
        </View>

        {/* Quick actions */}
        <View style={s.quickRow}>
          {[
            { icon: 'calendar-outline' as const, label: 'Availability', route: '/tutor/availability' },
            { icon: 'document-outline' as const, label: 'Certificates', route: '/tutor/certificates' },
            { icon: 'library-outline' as const, label: 'Materials', route: '/tutor/materials' },
          ].map(a => (
            <TouchableOpacity key={a.label} style={s.quickCard} onPress={() => router.push(a.route as never)} activeOpacity={0.85}>
              <View style={s.quickIcon}>
                <Ionicons name={a.icon} size={22} color={C.primary} />
              </View>
              <Text style={s.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's sessions */}
        <Text style={s.secTitle}>{today.length > 0 ? "Today's Sessions" : "Upcoming Sessions"}</Text>
        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 20 }} />
        ) : (today.length > 0 ? today : upcoming.slice(0, 5)).length === 0 ? (
          <Empty icon="book-outline" title="No upcoming sessions" subtitle="Your scheduled sessions will appear here." />
        ) : (
          (today.length > 0 ? today : upcoming.slice(0, 5)).map(sess => {
            const dt = new Date(sess.scheduled_at);
            return (
              <TouchableOpacity key={sess.id} style={s.sessCard} onPress={() => router.push({ pathname: '/tutor/session/[id]', params: { id: sess.id } })} activeOpacity={0.88}>
                <View style={s.sessDate}>
                  <Text style={s.sessDay}>{dt.getDate()}</Text>
                  <Text style={s.sessMon}>{dt.toLocaleDateString(undefined, { month: 'short' })}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.sessStudent}>{sess.student_name ?? 'Student'}</Text>
                  <Text style={s.sessTime}>{dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Level {sess.level}</Text>
                </View>
                <StatusBadge status={sess.status} />
              </TouchableOpacity>
            );
          })
        )}

        {upcoming.length > 5 && (
          <TouchableOpacity style={s.seeAll} onPress={() => router.push('/tutor/sessions')}>
            <Text style={s.seeAllTxt}>See all {upcoming.length} sessions →</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>
      <TutorNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontFamily: F.heading, fontSize: 22, color: C.text },
  greetSub: { fontFamily: F.body, fontSize: 13, color: C.textSub, marginTop: 2 },
  earningsCard: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 18, marginBottom: 16, overflow: 'hidden', elevation: 2, shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  earningItem: { flex: 1, paddingVertical: 18, alignItems: 'center' },
  earningLabel: { fontFamily: F.label, fontSize: 11, color: C.textSub, marginBottom: 6 },
  earningVal: { fontFamily: F.heading, fontSize: 17, color: C.text },
  earningDivider: { width: 1, backgroundColor: C.divider },
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  quickCard: { flex: 1, backgroundColor: C.card, borderRadius: 14, padding: 14, alignItems: 'center', gap: 8, elevation: 1 },
  quickIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontFamily: F.label, fontSize: 12, color: C.text, fontWeight: '600', textAlign: 'center' },
  secTitle: { fontFamily: F.heading, fontSize: 18, color: C.text, marginBottom: 12 },
  sessCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1 },
  sessDate: { width: 46, height: 52, backgroundColor: C.primaryLight, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sessDay: { fontFamily: F.heading, fontSize: 20, color: C.primary, lineHeight: 22 },
  sessMon: { fontFamily: F.label, fontSize: 11, color: C.primary, textTransform: 'uppercase' },
  sessStudent: { fontFamily: F.body, fontSize: 15, color: C.text, fontWeight: '600', marginBottom: 3 },
  sessTime: { fontFamily: F.body, fontSize: 12, color: C.textSub },
  seeAll: { alignItems: 'center', paddingVertical: 14 },
  seeAllTxt: { fontFamily: F.label, fontSize: 13, color: C.primary, fontWeight: '700' },
});

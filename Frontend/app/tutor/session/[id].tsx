import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatusBadge, LevelBadge } from '@/components/ui/Badge';
import { Btn } from '@/components/ui/Btn';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface Session {
  id: string;
  status: string;
  scheduled_at: string;
  level: string;
  student_name?: string;
  student_user_id?: string;
  course_payment_id?: string;
  duration_minutes?: number;
  teacher_review_done?: boolean;
  student_review_done?: boolean;
}

export default function TutorSessionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const s = await api.sessions.byId(id) as Session;
      setSession(s);
    } catch (e) { Alert.alert('Error', (e as Error).message); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const confirm = async () => {
    if (!id) return;
    setBusy(true);
    try { await api.sessions.confirm(id); await load(); }
    catch (e) { Alert.alert('Error', (e as Error).message); }
    finally { setBusy(false); }
  };

  const complete = async () => {
    if (!id) return;
    Alert.alert('Mark Complete', 'Confirm this session as completed?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Complete', onPress: async () => {
        setBusy(true);
        try { await api.sessions.complete(id); await load(); }
        catch (e) { Alert.alert('Error', (e as Error).message); }
        finally { setBusy(false); }
      }},
    ]);
  };

  if (loading) return <SafeAreaView style={s.safe} edges={['top']}><ScreenHeader title="Session Detail" /><ActivityIndicator color={C.primary} style={{ marginTop: 40 }} /></SafeAreaView>;
  if (!session) return <SafeAreaView style={s.safe} edges={['top']}><ScreenHeader title="Session Detail" /><Text style={{ textAlign: 'center', marginTop: 40, color: C.textSub }}>Session not found.</Text></SafeAreaView>;

  const dt = new Date(session.scheduled_at);
  const isPast = dt < new Date();
  const canConfirm = session.status === 'pending';
  const canJoin = session.status === 'confirmed';
  const canComplete = session.status === 'confirmed' && isPast;
  const canReview = session.status === 'completed' && !session.teacher_review_done;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Session Detail" />
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.dateCard}>
          <View style={s.dateLeft}>
            <Text style={s.dateDay}>{dt.getDate()}</Text>
            <Text style={s.dateMon}>{dt.toLocaleDateString(undefined, { month: 'long' })}</Text>
          </View>
          <View style={s.dateDivider} />
          <View style={s.dateRight}>
            <Text style={s.time}>{dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            <Text style={s.dur}>{session.duration_minutes ?? 60} min</Text>
          </View>
        </View>

        <View style={s.infoCard}>
          <Row label="Student" value={session.student_name ?? '—'} />
          <Row label="Level" value="" badge={<LevelBadge level={session.level} />} />
          <Row label="Status" value="" badge={<StatusBadge status={session.status} />} />
        </View>

        <View style={s.actions}>
          {canConfirm && <Btn label="Confirm Session" onPress={confirm} loading={busy} />}
          {canJoin && <Btn label="Join Video Call" onPress={() => router.push({ pathname: '/tutor/videocall/[sessionId]', params: { sessionId: session.id } })} />}
          {canComplete && <Btn label="Mark as Completed" variant="secondary" onPress={complete} loading={busy} />}
          {canReview && <Btn label="Review Student" variant="secondary" onPress={() => router.push({ pathname: '/tutor/review/[sessionId]', params: { sessionId: session.id } })} />}
          {session.student_user_id && (
            <Btn label="Message Student" variant="secondary" onPress={() => router.push({ pathname: '/tutor/direct/[userId]', params: { userId: session.student_user_id!, name: session.student_name ?? 'Student' } })} />
          )}
          {['pending', 'confirmed'].includes(session.status) && (
            <Btn label="Reschedule" variant="ghost" onPress={() => router.push({ pathname: '/student/reschedule/[sessionId]', params: { sessionId: session.id } })} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, badge }: { label: string; value: string; badge?: React.ReactNode }) {
  return (
    <View style={r.row}>
      <Text style={r.label}>{label}</Text>
      {badge ?? <Text style={r.value}>{value}</Text>}
    </View>
  );
}
const r = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.divider },
  label: { fontFamily: F.label, fontSize: 13, color: C.textSub, fontWeight: '600' },
  value: { fontFamily: F.body, fontSize: 14, color: C.text },
});

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  dateCard: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 18, padding: 20, marginBottom: 16, elevation: 2 },
  dateLeft: { flex: 1, alignItems: 'center' },
  dateDay: { fontFamily: F.heading, fontSize: 40, color: C.primary, lineHeight: 44 },
  dateMon: { fontFamily: F.body, fontSize: 16, color: C.text },
  dateDivider: { width: 1, backgroundColor: C.divider, marginHorizontal: 16 },
  dateRight: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  time: { fontFamily: F.heading, fontSize: 28, color: C.text },
  dur: { fontFamily: F.label, fontSize: 13, color: C.textSub, marginTop: 4 },
  infoCard: { backgroundColor: C.card, borderRadius: 16, paddingHorizontal: 16, marginBottom: 16 },
  actions: { gap: 10 },
});

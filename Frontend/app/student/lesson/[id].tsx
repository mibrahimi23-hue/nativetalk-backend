import { Ionicons } from '@expo/vector-icons';
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
  teacher_name?: string;
  teacher_user_id?: string;
  course_payment_id?: string;
  daily_room_url?: string;
  rescheduled?: boolean;
  teacher_review_done?: boolean;
  student_review_done?: boolean;
  duration_minutes?: number;
}

export default function LessonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const s = await api.sessions.byId(id) as Session;
      setSession(s);
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleCancel = () => {
    Alert.alert('Cancel Lesson', 'Are you sure you want to cancel this lesson?', [
      { text: 'Keep', style: 'cancel' },
      { text: 'Cancel Lesson', style: 'destructive', onPress: async () => {
        if (!id) return;
        setCancelling(true);
        try {
          await api.sessions.cancel(id);
          await load();
        } catch (e) {
          Alert.alert('Error', (e as Error).message);
        } finally {
          setCancelling(false);
        }
      }},
    ]);
  };

  const handleReschedule = () => {
    if (!session) return;
    router.push({ pathname: '/student/reschedule/[sessionId]', params: { sessionId: session.id } });
  };

  if (loading) return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Lesson Details" />
      <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
    </SafeAreaView>
  );

  if (!session) return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Lesson Details" />
      <Text style={{ textAlign: 'center', marginTop: 40, color: C.textSub }}>Lesson not found.</Text>
    </SafeAreaView>
  );

  const dt = new Date(session.scheduled_at);
  const isPast = dt < new Date();
  const canJoin = session.status === 'confirmed' && !isPast;
  const canReview = session.status === 'completed' && !session.student_review_done;
  const canCancel = ['pending', 'confirmed'].includes(session.status) && !isPast;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Lesson Details" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Date card */}
        <View style={s.dateCard}>
          <View style={s.dateLeft}>
            <Text style={s.dateDay}>{dt.getDate()}</Text>
            <Text style={s.dateMonth}>{dt.toLocaleDateString(undefined, { month: 'long' })}</Text>
            <Text style={s.dateYear}>{dt.getFullYear()}</Text>
          </View>
          <View style={s.dateDivider} />
          <View style={s.dateRight}>
            <Text style={s.time}>{dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            <Text style={s.duration}>{session.duration_minutes ?? 60} min</Text>
          </View>
        </View>

        {/* Info */}
        <View style={s.card}>
          <Row label="Tutor" value={session.teacher_name ?? '—'} />
          <Row label="Level" value={session.level} />
          <Row label="Status" value="" badge={<StatusBadge status={session.status} />} />
          {session.rescheduled ? <Row label="Rescheduled" value="Yes" /> : null}
        </View>

        {/* Actions */}
        <View style={s.actions}>
          {canJoin && (
            <Btn label="Join Video Call" onPress={() => router.push({ pathname: '/student/videocall/[sessionId]', params: { sessionId: session.id } })} />
          )}
          {canReview && (
            <Btn label="Leave a Review" variant="secondary" onPress={() => router.push({ pathname: '/student/review/[sessionId]', params: { sessionId: session.id } })} />
          )}
          {session.teacher_user_id && (
            <Btn label="Message Tutor" variant="secondary" onPress={() => router.push({ pathname: '/student/direct/[userId]', params: { userId: session.teacher_user_id!, name: session.teacher_name ?? 'Tutor' } })} />
          )}
          {canCancel && (
            <View style={s.cancelRow}>
              <Btn label="Reschedule" variant="secondary" onPress={handleReschedule} style={{ flex: 1 }} />
              <Btn label={cancelling ? '…' : 'Cancel'} variant="danger" onPress={handleCancel} loading={cancelling} style={{ flex: 1 }} />
            </View>
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
  scroll: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 16 },
  dateCard: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 18, padding: 20, marginBottom: 16, elevation: 2, shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  dateLeft: { flex: 1, alignItems: 'center' },
  dateDay: { fontFamily: F.heading, fontSize: 40, color: C.primary, lineHeight: 44 },
  dateMonth: { fontFamily: F.body, fontSize: 16, color: C.text },
  dateYear: { fontFamily: F.label, fontSize: 12, color: C.textSub },
  dateDivider: { width: 1, backgroundColor: C.divider, marginHorizontal: 16 },
  dateRight: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  time: { fontFamily: F.heading, fontSize: 28, color: C.text },
  duration: { fontFamily: F.label, fontSize: 13, color: C.textSub, marginTop: 4 },
  card: { backgroundColor: C.card, borderRadius: 16, paddingHorizontal: 16, marginBottom: 16, elevation: 1 },
  actions: { gap: 10 },
  cancelRow: { flexDirection: 'row', gap: 10 },
});

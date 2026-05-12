import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Btn } from '@/components/ui/Btn';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface StudentDetail {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  profile_photo?: string;
  is_suspended?: boolean;
  created_at?: string;
  sessions_count?: number;
  total_spent?: number;
}

export default function AdminStudentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const data = await api.users.byId(id) as StudentDetail;
      setStudent(data);
    } catch {}
  }, [id]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const handleSuspend = () => {
    if (!student) return;
    Alert.alert(
      student.is_suspended ? 'Unsuspend Student' : 'Suspend Student',
      student.is_suspended ? 'Restore access for this student?' : 'Suspend this student account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: 'destructive', onPress: async () => {
          setBusy(true);
          try {
            if (student.is_suspended) await api.admin.unsuspend(id!);
            else await api.admin.suspend(id!, { reason: 'Admin action' });
            await load();
          } catch (e) { Alert.alert('Error', (e as Error).message); }
          finally { setBusy(false); }
        }},
      ]
    );
  };

  if (loading) return <SafeAreaView style={s.safe} edges={['top']}><ScreenHeader title="Student Detail" /><ActivityIndicator color={C.primary} style={{ marginTop: 40 }} /></SafeAreaView>;
  if (!student) return <SafeAreaView style={s.safe} edges={['top']}><ScreenHeader title="Student Detail" /><Text style={s.notFound}>Student not found.</Text></SafeAreaView>;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Student Detail" />
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.profileCard}>
          <Avatar uri={student.profile_photo} name={student.full_name ?? ''} size={72} />
          <View style={s.profileInfo}>
            <Text style={s.name}>{student.full_name ?? 'Unknown'}</Text>
            <Text style={s.email}>{student.email}</Text>
            {student.phone && <Text style={s.phone}>{student.phone}</Text>}
            {student.is_suspended && <View style={s.suspBadge}><Text style={s.suspTxt}>Suspended</Text></View>}
          </View>
        </View>

        <View style={s.statsRow}>
          <View style={s.stat}>
            <Text style={s.statVal}>{student.sessions_count ?? 0}</Text>
            <Text style={s.statLabel}>Sessions</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.stat}>
            <Text style={s.statVal}>€{(student.total_spent ?? 0).toFixed(0)}</Text>
            <Text style={s.statLabel}>Spent</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.stat}>
            <Text style={s.statVal}>{student.created_at ? new Date(student.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '—'}</Text>
            <Text style={s.statLabel}>Joined</Text>
          </View>
        </View>

        <Btn
          label={student.is_suspended ? 'Unsuspend Student' : 'Suspend Student'}
          variant={student.is_suspended ? 'secondary' : 'danger'}
          onPress={handleSuspend}
          loading={busy}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 16, gap: 16, paddingBottom: 40 },
  notFound: { textAlign: 'center', marginTop: 40, color: C.textSub, fontFamily: F.body },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: C.card, borderRadius: 16, padding: 16 },
  profileInfo: { flex: 1, gap: 4 },
  name: { fontFamily: F.heading, fontSize: 20, color: C.text },
  email: { fontFamily: F.label, fontSize: 13, color: C.textSub },
  phone: { fontFamily: F.label, fontSize: 13, color: C.textSub },
  suspBadge: { alignSelf: 'flex-start', backgroundColor: '#FEE2E2', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4 },
  suspTxt: { fontFamily: F.label, fontSize: 11, color: C.danger, fontWeight: '700' },
  statsRow: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 16, overflow: 'hidden' },
  stat: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  statVal: { fontFamily: F.heading, fontSize: 18, color: C.text },
  statLabel: { fontFamily: F.label, fontSize: 11, color: C.textSub, marginTop: 3 },
  statDivider: { width: 1, backgroundColor: C.divider },
});

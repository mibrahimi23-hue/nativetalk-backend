import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Empty } from '@/components/ui/Empty';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface Suspension {
  id: string;
  user_id: string;
  full_name?: string;
  email?: string;
  role?: string;
  reason?: string;
  suspended_at?: string;
  auto_release_at?: string;
}

export default function AdminSuspensions() {
  const [suspensions, setSuspensions] = useState<Suspension[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.admin.suspensions() as Suspension[];
      setSuspensions(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const handleUnsuspend = (userId: string) => {
    Alert.alert('Unsuspend User', 'Restore access for this user?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Unsuspend', onPress: async () => {
        try { await api.admin.unsuspend(userId); await load(); }
        catch (e) { Alert.alert('Error', (e as Error).message); }
      }},
    ]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Active Suspensions" />
      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={C.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
        ) : suspensions.length === 0 ? (
          <Empty icon="ban-outline" title="No active suspensions" subtitle="All users are in good standing." />
        ) : (
          suspensions.map(susp => (
            <View key={susp.id} style={s.card}>
              <View style={s.cardHeader}>
                <View>
                  <Text style={s.name}>{susp.full_name ?? 'Unknown'}</Text>
                  <Text style={s.email}>{susp.email}</Text>
                </View>
                <View style={[s.roleBadge, susp.role === 'teacher' ? s.teacherBadge : s.studentBadge]}>
                  <Text style={s.roleTxt}>{susp.role ?? 'user'}</Text>
                </View>
              </View>
              {susp.reason && (
                <View style={s.reasonBox}>
                  <Text style={s.reasonLabel}>Reason</Text>
                  <Text style={s.reasonTxt}>{susp.reason}</Text>
                </View>
              )}
              <View style={s.dates}>
                {susp.suspended_at && <Text style={s.dateStr}>Suspended: {new Date(susp.suspended_at).toLocaleDateString()}</Text>}
                {susp.auto_release_at && <Text style={s.dateStr}>Auto-release: {new Date(susp.auto_release_at).toLocaleDateString()}</Text>}
              </View>
              <TouchableOpacity style={s.unsuspBtn} onPress={() => handleUnsuspend(susp.user_id)}>
                <Text style={s.unsuspTxt}>Unsuspend</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 12, gap: 12 },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 16, gap: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontFamily: F.body, fontSize: 15, color: C.text, fontWeight: '600' },
  email: { fontFamily: F.label, fontSize: 12, color: C.textSub, marginTop: 2 },
  roleBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  teacherBadge: { backgroundColor: '#EDE9FE' },
  studentBadge: { backgroundColor: '#DBEAFE' },
  roleTxt: { fontFamily: F.label, fontSize: 11, fontWeight: '700', textTransform: 'capitalize', color: C.text },
  reasonBox: { backgroundColor: '#FFF7ED', borderRadius: 10, padding: 10, borderLeftWidth: 3, borderLeftColor: C.warning },
  reasonLabel: { fontFamily: F.label, fontSize: 11, color: C.warning, fontWeight: '700' },
  reasonTxt: { fontFamily: F.body, fontSize: 13, color: C.text, marginTop: 2 },
  dates: { gap: 4 },
  dateStr: { fontFamily: F.label, fontSize: 11, color: C.textSub },
  unsuspBtn: { backgroundColor: '#D1FAE5', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  unsuspTxt: { fontFamily: F.label, fontSize: 13, color: C.success, fontWeight: '700' },
});

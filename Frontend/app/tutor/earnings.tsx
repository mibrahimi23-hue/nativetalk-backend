import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TutorNav } from './_layout';
import { Empty } from '@/components/ui/Empty';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  student_name?: string;
  plan_type?: string;
}

interface EarningsSummary {
  total_earned?: number;
  pending_payout?: number;
  this_month?: number;
}

export default function TutorEarnings() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<EarningsSummary>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user?.teacher_id) return;
    try {
      const data = await api.payments.byTeacher(user.teacher_id) as any;
      if (Array.isArray(data)) {
        setPayments(data);
        const total = data.filter((p: Payment) => p.status === 'completed').reduce((s: number, p: Payment) => s + (p.amount ?? 0), 0);
        const pending = data.filter((p: Payment) => p.status === 'pending').reduce((s: number, p: Payment) => s + (p.amount ?? 0), 0);
        const now = new Date();
        const thisMonth = data.filter((p: Payment) => {
          const d = new Date(p.created_at);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && p.status === 'completed';
        }).reduce((s: number, p: Payment) => s + (p.amount ?? 0), 0);
        setSummary({ total_earned: total, pending_payout: pending, this_month: thisMonth });
      } else if (data && typeof data === 'object') {
        setSummary(data);
      }
    } catch {}
  }, [user]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const statusColor = (s: string) => s === 'completed' ? C.success : s === 'pending' ? C.warning : C.textSub;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={C.primary} />}
      >
        <View style={s.header}>
          <Text style={s.title}>Earnings</Text>
        </View>

        <View style={s.summaryCard}>
          <View style={s.sumItem}>
            <Text style={s.sumLabel}>Total Earned</Text>
            <Text style={s.sumVal}>€{(summary.total_earned ?? 0).toFixed(2)}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.sumItem}>
            <Text style={s.sumLabel}>This Month</Text>
            <Text style={[s.sumVal, { color: C.primary }]}>€{(summary.this_month ?? 0).toFixed(2)}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.sumItem}>
            <Text style={s.sumLabel}>Pending</Text>
            <Text style={[s.sumVal, { color: C.warning }]}>€{(summary.pending_payout ?? 0).toFixed(2)}</Text>
          </View>
        </View>

        <Text style={s.secTitle}>Transaction History</Text>

        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 20 }} />
        ) : payments.length === 0 ? (
          <Empty icon="wallet-outline" title="No transactions yet" subtitle="Your earnings will appear here after sessions are completed." />
        ) : (
          payments.map(p => (
            <View key={p.id} style={s.txRow}>
              <View style={s.txLeft}>
                <Text style={s.txName}>{p.student_name ?? 'Student'}</Text>
                <Text style={s.txDate}>{new Date(p.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                {p.plan_type && <Text style={s.txPlan}>{p.plan_type.replace(/_/g, ' ')}</Text>}
              </View>
              <View style={s.txRight}>
                <Text style={s.txAmount}>€{(p.amount ?? 0).toFixed(2)}</Text>
                <Text style={[s.txStatus, { color: statusColor(p.status) }]}>{p.status}</Text>
              </View>
            </View>
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
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  header: { marginBottom: 16 },
  title: { fontFamily: F.heading, fontSize: 24, color: C.text },
  summaryCard: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 18, marginBottom: 24, overflow: 'hidden', elevation: 2, shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  sumItem: { flex: 1, paddingVertical: 20, alignItems: 'center' },
  sumLabel: { fontFamily: F.label, fontSize: 11, color: C.textSub, marginBottom: 6 },
  sumVal: { fontFamily: F.heading, fontSize: 17, color: C.text },
  divider: { width: 1, backgroundColor: C.divider },
  secTitle: { fontFamily: F.heading, fontSize: 18, color: C.text, marginBottom: 12 },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1 },
  txLeft: { flex: 1 },
  txName: { fontFamily: F.body, fontSize: 14, color: C.text, fontWeight: '600', marginBottom: 3 },
  txDate: { fontFamily: F.label, fontSize: 12, color: C.textSub },
  txPlan: { fontFamily: F.label, fontSize: 11, color: C.textSub, marginTop: 2, textTransform: 'capitalize' },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontFamily: F.heading, fontSize: 16, color: C.text },
  txStatus: { fontFamily: F.label, fontSize: 11, fontWeight: '600', marginTop: 3, textTransform: 'capitalize' },
});

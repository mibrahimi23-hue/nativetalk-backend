import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Empty } from '@/components/ui/Empty';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface Transaction {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  student_name?: string;
  teacher_name?: string;
  plan_type?: string;
  paypal_order_id?: string;
}

export default function AdminTransactions() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.paypal.history() as Transaction[];
      setTxs(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const totalRevenue = txs.filter(t => t.status === 'completed').reduce((s, t) => s + (t.amount ?? 0), 0);

  const statusColor = (status: string) =>
    status === 'completed' ? C.success : status === 'pending' ? C.warning : C.danger;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Transactions" />
      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={C.primary} />}
      >
        <View style={s.summaryCard}>
          <View style={s.sumItem}>
            <Text style={s.sumLabel}>Total Revenue</Text>
            <Text style={s.sumVal}>€{totalRevenue.toFixed(2)}</Text>
          </View>
          <View style={s.divider} />
          <View style={s.sumItem}>
            <Text style={s.sumLabel}>Transactions</Text>
            <Text style={s.sumVal}>{txs.length}</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
        ) : txs.length === 0 ? (
          <Empty icon="cash-outline" title="No transactions yet" />
        ) : (
          txs.map(tx => (
            <View key={tx.id} style={s.txCard}>
              <View style={s.txTop}>
                <Text style={s.txAmount}>€{(tx.amount ?? 0).toFixed(2)}</Text>
                <View style={[s.statusBadge, { backgroundColor: `${statusColor(tx.status)}20` }]}>
                  <Text style={[s.statusTxt, { color: statusColor(tx.status) }]}>{tx.status}</Text>
                </View>
              </View>
              <Text style={s.txParties}>{tx.student_name ?? 'Student'} → {tx.teacher_name ?? 'Tutor'}</Text>
              <View style={s.txBottom}>
                <Text style={s.txDate}>{new Date(tx.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                {tx.plan_type && <Text style={s.txPlan}>{tx.plan_type.replace(/_/g, ' ')}</Text>}
              </View>
              {tx.paypal_order_id && <Text style={s.txId} selectable>ID: {tx.paypal_order_id}</Text>}
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
  scroll: { paddingHorizontal: 20, paddingTop: 16, gap: 12 },
  summaryCard: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 18, overflow: 'hidden', elevation: 2, marginBottom: 8 },
  sumItem: { flex: 1, paddingVertical: 20, alignItems: 'center' },
  sumLabel: { fontFamily: F.label, fontSize: 11, color: C.textSub, marginBottom: 6 },
  sumVal: { fontFamily: F.heading, fontSize: 22, color: C.text },
  divider: { width: 1, backgroundColor: C.divider },
  txCard: { backgroundColor: C.card, borderRadius: 14, padding: 14, gap: 6 },
  txTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txAmount: { fontFamily: F.heading, fontSize: 18, color: C.text },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusTxt: { fontFamily: F.label, fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  txParties: { fontFamily: F.body, fontSize: 13, color: C.textSub },
  txBottom: { flexDirection: 'row', gap: 12 },
  txDate: { fontFamily: F.label, fontSize: 12, color: C.textSub },
  txPlan: { fontFamily: F.label, fontSize: 12, color: C.primary, textTransform: 'capitalize' },
  txId: { fontFamily: F.label, fontSize: 10, color: C.textSub, marginTop: 4 },
});

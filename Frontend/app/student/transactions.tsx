import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Empty } from '@/components/ui/Empty';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface Transaction {
  id: string;
  paypal_order_id?: string;
  amount: number;
  currency: string;
  paypal_status: string;
  installment: number;
  created_at: string;
  completed_at?: string;
}

export default function Transactions() {
  const { user } = useAuth();
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user?.student_id) return;
    try {
      const data = await api.paypal.history(user.student_id) as Transaction[];
      setTxs(Array.isArray(data) ? data : []);
    } catch {}
  }, [user]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const totalPaid = txs.filter(t => t.paypal_status === 'completed').reduce((s, t) => s + t.amount, 0);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Transactions" />

      {!loading && txs.length > 0 && (
        <View style={s.summary}>
          <Text style={s.summaryLabel}>Total spent</Text>
          <Text style={s.summaryAmount}>€{totalPaid.toFixed(2)}</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={C.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
        ) : txs.length === 0 ? (
          <Empty icon="card-outline" title="No transactions yet" subtitle="Your payment history will appear here." />
        ) : (
          txs.map(tx => {
            const statusColor = tx.paypal_status === 'completed' ? C.success : tx.paypal_status === 'refunded' ? C.warning : C.textSub;
            return (
              <View key={tx.id} style={s.card}>
                <View style={s.cardLeft}>
                  <Text style={s.txId} numberOfLines={1}>#{tx.paypal_order_id?.slice(-8) ?? tx.id.slice(-8)}</Text>
                  <Text style={s.date}>{new Date(tx.created_at).toLocaleDateString()}</Text>
                  <Text style={s.installment}>Installment {tx.installment}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={s.amount}>€{tx.amount.toFixed(2)}</Text>
                  <View style={[s.statusBadge, { backgroundColor: statusColor + '20' }]}>
                    <Text style={[s.statusTxt, { color: statusColor }]}>{tx.paypal_status}</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  summary: { backgroundColor: C.primary, margin: 20, borderRadius: 16, padding: 20, alignItems: 'center' },
  summaryLabel: { fontFamily: F.label, fontSize: 12, color: C.textLight, opacity: 0.8, marginBottom: 4 },
  summaryAmount: { fontFamily: F.heading, fontSize: 28, color: C.textLight },
  scroll: { paddingHorizontal: 20, paddingTop: 4 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1, shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  cardLeft: { flex: 1 },
  txId: { fontFamily: F.label, fontSize: 13, color: C.text, fontWeight: '700', marginBottom: 3 },
  date: { fontFamily: F.body, fontSize: 12, color: C.textSub },
  installment: { fontFamily: F.label, fontSize: 11, color: C.textSub },
  amount: { fontFamily: F.heading, fontSize: 16, color: C.text, marginBottom: 4 },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  statusTxt: { fontFamily: F.label, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
});

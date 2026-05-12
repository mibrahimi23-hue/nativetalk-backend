import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminNav } from './_layout';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface DashboardStats {
  total_users?: number;
  total_teachers?: number;
  total_students?: number;
  pending_verifications?: number;
  active_sessions?: number;
  total_revenue?: number;
  flagged_reviews?: number;
  active_suspensions?: number;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.admin.dashboard() as DashboardStats;
      setStats(data ?? {});
    } catch {}
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const STAT_CARDS = [
    { label: 'Total Users', value: stats.total_users ?? 0, icon: 'people-outline' as const, color: C.primary },
    { label: 'Tutors', value: stats.total_teachers ?? 0, icon: 'school-outline' as const, color: '#7C3AED' },
    { label: 'Students', value: stats.total_students ?? 0, icon: 'person-outline' as const, color: '#0891B2' },
    { label: 'Revenue', value: `€${(stats.total_revenue ?? 0).toFixed(0)}`, icon: 'wallet-outline' as const, color: C.success },
  ];

  const ALERTS = [
    { label: 'Pending Approvals', count: stats.pending_verifications ?? 0, route: '/admin/approvals', color: C.warning, icon: 'shield-checkmark-outline' as const },
    { label: 'Flagged Reviews', count: stats.flagged_reviews ?? 0, route: '/admin/flags', color: C.danger, icon: 'flag-outline' as const },
    { label: 'Active Suspensions', count: stats.active_suspensions ?? 0, route: '/admin/suspensions', color: '#7C3AED', icon: 'ban-outline' as const },
  ];

  const QUICK = [
    { label: 'Exam Builder', icon: 'create-outline' as const, route: '/admin/exam-builder' },
    { label: 'Transactions', icon: 'cash-outline' as const, route: '/admin/transactions' },
    { label: 'Tutors', icon: 'people-outline' as const, route: '/admin/tutors' },
    { label: 'Students', icon: 'person-outline' as const, route: '/admin/students' },
  ];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={C.primary} />}
      >
        <View style={s.header}>
          <View>
            <Text style={s.title}>Admin Panel</Text>
            <Text style={s.sub}>Welcome, {user?.full_name ?? 'Admin'}</Text>
          </View>
          <TouchableOpacity style={s.logoutBtn} onPress={async () => { await logout(); router.replace('/welcome'); }}>
            <Ionicons name="log-out-outline" size={20} color={C.danger} />
          </TouchableOpacity>
        </View>

        {loading ? <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} /> : (
          <>
            <View style={s.statsGrid}>
              {STAT_CARDS.map(card => (
                <View key={card.label} style={s.statCard}>
                  <View style={[s.statIcon, { backgroundColor: `${card.color}20` }]}>
                    <Ionicons name={card.icon} size={22} color={card.color} />
                  </View>
                  <Text style={s.statVal}>{card.value}</Text>
                  <Text style={s.statLabel}>{card.label}</Text>
                </View>
              ))}
            </View>

            <Text style={s.secTitle}>Alerts</Text>
            <View style={s.alertsCol}>
              {ALERTS.map(a => (
                <TouchableOpacity key={a.label} style={s.alertRow} onPress={() => router.push(a.route as never)} activeOpacity={0.85}>
                  <View style={[s.alertIcon, { backgroundColor: `${a.color}20` }]}>
                    <Ionicons name={a.icon} size={20} color={a.color} />
                  </View>
                  <Text style={s.alertLabel}>{a.label}</Text>
                  <View style={[s.alertBadge, { backgroundColor: a.color }]}>
                    <Text style={s.alertCount}>{a.count}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={C.textSub} />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.secTitle}>Quick Access</Text>
            <View style={s.quickGrid}>
              {QUICK.map(q => (
                <TouchableOpacity key={q.label} style={s.quickCard} onPress={() => router.push(q.route as never)} activeOpacity={0.85}>
                  <View style={s.quickIcon}>
                    <Ionicons name={q.icon} size={22} color={C.primary} />
                  </View>
                  <Text style={s.quickLabel}>{q.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        <View style={{ height: 110 }} />
      </ScrollView>
      <AdminNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontFamily: F.heading, fontSize: 24, color: C.text },
  sub: { fontFamily: F.body, fontSize: 13, color: C.textSub, marginTop: 2 },
  logoutBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: { width: '47%', backgroundColor: C.card, borderRadius: 16, padding: 16, gap: 6 },
  statIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  statVal: { fontFamily: F.heading, fontSize: 22, color: C.text },
  statLabel: { fontFamily: F.label, fontSize: 12, color: C.textSub },
  secTitle: { fontFamily: F.heading, fontSize: 18, color: C.text, marginBottom: 12 },
  alertsCol: { gap: 8, marginBottom: 24 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: 14, padding: 14 },
  alertIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  alertLabel: { flex: 1, fontFamily: F.body, fontSize: 14, color: C.text },
  alertBadge: { borderRadius: 12, minWidth: 28, height: 24, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  alertCount: { fontFamily: F.label, fontSize: 12, color: '#fff', fontWeight: '700' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  quickCard: { width: '47%', backgroundColor: C.card, borderRadius: 14, padding: 16, alignItems: 'center', gap: 8 },
  quickIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontFamily: F.label, fontSize: 13, color: C.text, fontWeight: '600' },
});

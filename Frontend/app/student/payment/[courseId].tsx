import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Btn } from '@/components/ui/Btn';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface CoursePayment {
  id: string;
  total_amount: number;
  amount_paid: number;
  amount_left: number;
  payment_plan: string;
  status: string;
  total_hours: number;
  price_per_hour: number;
  level: string;
  installment_1_paid: boolean;
  installment_2_paid: boolean;
}

export default function PaymentScreen() {
  const { courseId, plan } = useLocalSearchParams<{ courseId: string; plan?: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<CoursePayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const load = useCallback(async () => {
    if (!courseId) return;
    try {
      // Set plan if provided
      if (plan) {
        try { await api.payments.setPlan(courseId, plan); } catch {}
      }
      const c = await api.payments.byCourse(courseId) as CoursePayment;
      setCourse(c);
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [courseId, plan]);

  useEffect(() => { load(); }, [load]);

  const handlePayPayPal = async (installment: number) => {
    if (!course || !user?.student_id) return;
    setPaying(true);
    try {
      const order = await api.paypal.createOrder({
        course_payment_id: courseId,
        student_id: user.student_id,
        installment,
      }) as { order_id?: string; approval_url?: string };

      if (order.approval_url) {
        // Open PayPal in WebView or browser
        const { Linking } = await import('react-native');
        Linking.openURL(order.approval_url);
      }
    } catch (e) {
      Alert.alert('Payment failed', (e as Error).message);
    } finally {
      setPaying(false);
    }
  };

  if (loading) return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Payment" />
      <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
    </SafeAreaView>
  );

  if (!course) return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Payment" />
      <Text style={{ textAlign: 'center', marginTop: 40, color: C.textSub }}>Payment not found.</Text>
    </SafeAreaView>
  );

  const isHourByHour = course.payment_plan === 'hour_by_hour';
  const is5050 = course.payment_plan === '50_50';
  const is8020 = course.payment_plan === '80_20';

  const inst1Amount = is5050 ? course.total_amount * 0.5 : is8020 ? course.total_amount * 0.8 : course.price_per_hour;
  const inst2Amount = is5050 ? course.total_amount * 0.5 : is8020 ? course.total_amount * 0.2 : 0;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Payment" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Summary card */}
        <View style={s.summaryCard}>
          <Text style={s.summaryTitle}>Course Summary</Text>
          <Row label="Level" value={course.level} />
          <Row label="Total hours" value={`${course.total_hours}h`} />
          <Row label="Rate" value={`€${course.price_per_hour}/hr`} />
          <Row label="Total amount" value={`€${course.total_amount.toFixed(2)}`} bold />
          <Row label="Amount paid" value={`€${course.amount_paid.toFixed(2)}`} />
          <Row label="Remaining" value={`€${course.amount_left.toFixed(2)}`} color={C.primary} />
        </View>

        {/* Payment plan info */}
        <View style={s.planCard}>
          <Text style={s.planLabel}>Payment Plan</Text>
          <Text style={s.planValue}>
            {isHourByHour ? 'Pay per lesson (hour by hour)' : is5050 ? '50/50 installments' : '80/20 installments'}
          </Text>
        </View>

        {/* Payment actions */}
        {course.status === 'active' && (
          <>
            {isHourByHour && (
              <View style={s.actions}>
                <Text style={s.actionsTitle}>Pay for next lesson</Text>
                <Text style={s.actionsDesc}>€{course.price_per_hour.toFixed(2)} will be charged for the next session.</Text>
                <Btn label={`Pay €${course.price_per_hour.toFixed(2)} via PayPal`} onPress={() => handlePayPayPal(1)} loading={paying} />
              </View>
            )}

            {(is5050 || is8020) && (
              <View style={s.actions}>
                <Text style={s.actionsTitle}>Installments</Text>

                <View style={s.installCard}>
                  <View style={s.installHeader}>
                    <Text style={s.installLabel}>Installment 1 — €{inst1Amount.toFixed(2)}</Text>
                    {course.installment_1_paid ? (
                      <View style={s.paidBadge}><Text style={s.paidText}>Paid</Text></View>
                    ) : null}
                  </View>
                  {!course.installment_1_paid && (
                    <Btn label={`Pay €${inst1Amount.toFixed(2)} via PayPal`} onPress={() => handlePayPayPal(1)} loading={paying} size="md" />
                  )}
                </View>

                {inst2Amount > 0 && (
                  <View style={s.installCard}>
                    <View style={s.installHeader}>
                      <Text style={s.installLabel}>Installment 2 — €{inst2Amount.toFixed(2)}</Text>
                      {course.installment_2_paid ? (
                        <View style={s.paidBadge}><Text style={s.paidText}>Paid</Text></View>
                      ) : null}
                    </View>
                    {!course.installment_2_paid && course.installment_1_paid && (
                      <Btn label={`Pay €${inst2Amount.toFixed(2)} via PayPal`} onPress={() => handlePayPayPal(2)} loading={paying} size="md" />
                    )}
                    {!course.installment_2_paid && !course.installment_1_paid && (
                      <Text style={s.locked}>Pay installment 1 first</Text>
                    )}
                  </View>
                )}
              </View>
            )}
          </>
        )}

        {course.status === 'completed' && (
          <View style={s.completedCard}>
            <Text style={s.completedText}>✅ All payments completed</Text>
          </View>
        )}

        <Btn label="View My Lessons" variant="secondary" onPress={() => router.replace('/student/lessons')} style={{ marginTop: 16 }} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, bold, color }: { label: string; value: string; bold?: boolean; color?: string }) {
  return (
    <View style={r.row}>
      <Text style={r.label}>{label}</Text>
      <Text style={[r.value, bold && r.bold, color ? { color } : null]}>{value}</Text>
    </View>
  );
}
const r = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.divider },
  label: { fontFamily: F.label, fontSize: 13, color: C.textSub },
  value: { fontFamily: F.body, fontSize: 14, color: C.text },
  bold: { fontFamily: F.heading, fontSize: 15, color: C.text },
});

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  summaryCard: { backgroundColor: C.card, borderRadius: 16, paddingHorizontal: 16, marginBottom: 14, elevation: 2, shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
  summaryTitle: { fontFamily: F.heading, fontSize: 16, color: C.text, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.divider },
  planCard: { backgroundColor: C.primaryLight, borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: C.primaryMid },
  planLabel: { fontFamily: F.label, fontSize: 12, color: C.primary, fontWeight: '700', marginBottom: 4 },
  planValue: { fontFamily: F.body, fontSize: 14, color: C.text },
  actions: { backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 14 },
  actionsTitle: { fontFamily: F.heading, fontSize: 16, color: C.text, marginBottom: 6 },
  actionsDesc: { fontFamily: F.body, fontSize: 13, color: C.textSub, marginBottom: 14 },
  installCard: { backgroundColor: C.bg, borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: C.border, gap: 10 },
  installHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  installLabel: { fontFamily: F.body, fontSize: 14, color: C.text, fontWeight: '600' },
  paidBadge: { backgroundColor: C.successBg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  paidText: { fontFamily: F.label, fontSize: 11, color: C.success, fontWeight: '700' },
  locked: { fontFamily: F.label, fontSize: 12, color: C.textSub, textAlign: 'center' },
  completedCard: { backgroundColor: C.successBg, borderRadius: 14, padding: 18, alignItems: 'center', marginBottom: 14 },
  completedText: { fontFamily: F.body, fontSize: 15, color: C.success, fontWeight: '600' },
});

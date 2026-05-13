import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Btn } from '@/components/ui/Btn';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface Level {
  level: string;
  price_min: number;
  price_max: number;
}

interface Language {
  id: number;
  name: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PLANS = [
  { key: 'hour_by_hour', label: 'Pay per lesson', desc: 'Pay before each individual lesson.' },
  { key: '50_50', label: '50/50 plan', desc: '50% upfront, 50% at halfway.' },
  { key: '80_20', label: '80/20 plan', desc: '80% upfront for a discount.' },
];

export default function BookLesson() {
  const { tutorId } = useLocalSearchParams<{ tutorId: string }>();
  const { user } = useAuth();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [language, setLanguage] = useState<Language | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [totalHours, setTotalHours] = useState(10);
  const [plan, setPlan] = useState('hour_by_hour');
  const [step, setStep] = useState(1);

  const load = useCallback(async () => {
    if (!tutorId) return;
    try {
      const [tutorData, slotData, levelData] = await Promise.all([
        api.tutors.byId(tutorId) as Promise<{ language_name?: string; language_id?: number }>,
        api.tutors.availability(tutorId) as Promise<AvailabilitySlot[]>,
        api.search.levels() as Promise<{ levels?: Level[] } | Level[]>,
      ]);
      const t = tutorData as { language_name?: string; language_id?: number };
      setSlots(Array.isArray(slotData) ? slotData : []);
      const lvls = Array.isArray(levelData) ? levelData : (levelData as { levels?: Level[] }).levels ?? [];
      setLevels(lvls);
      if (t.language_id && t.language_name) {
        setLanguage({ id: t.language_id, name: t.language_name });
      }
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [tutorId]);

  useEffect(() => { load(); }, [load]);

  const getNextDateForDay = (dayOfWeek: number): Date => {
    const today = new Date();
    const todayDay = today.getDay();
    const targetDay = (dayOfWeek + 1) % 7;
    let daysUntil = targetDay - todayDay;
    if (daysUntil <= 0) daysUntil += 7;
    const next = new Date(today);
    next.setDate(today.getDate() + daysUntil);
    return next;
  };

  const handleBook = async () => {
    if (!selectedSlot || !selectedLevel || !selectedDate || !user?.student_id) {
      Alert.alert('Incomplete', 'Please select a time slot and level.');
      return;
    }
    setBooking(true);
    try {
      const [hr, min] = selectedSlot.start_time.split(':').map(Number);
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(hr, min, 0, 0);

      const pricePerHour = (selectedLevel.price_min + selectedLevel.price_max) / 2;
      const result = await api.booking.create({
        teacher_id: tutorId,
        student_id: user.student_id,
        language_id: language?.id,
        level: selectedLevel.level,
        scheduled_at: scheduledAt.toISOString(),
        student_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        total_hours: totalHours,
        price_per_hour: pricePerHour,
      }) as { course_payment_id?: string; session_id?: string };

      if (result.course_payment_id) {
        router.replace({ pathname: '/student/payment/[courseId]', params: { courseId: result.course_payment_id, plan } });
      } else {
        Alert.alert('Booked!', 'Your lesson has been booked successfully.');
        router.replace('/student/lessons');
      }
    } catch (e) {
      Alert.alert('Booking failed', (e as Error).message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Book a Lesson" />
      <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Book a Lesson" subtitle={`Step ${step} of 3`} />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Step 1: Pick time slot */}
        {step === 1 && (
          <>
            <Text style={s.stepTitle}>Select a Time Slot</Text>
            <Text style={s.stepSub}>Available recurring slots (booked for next occurrence)</Text>
            {slots.length === 0 ? (
              <Text style={s.empty}>This tutor has no available slots yet.</Text>
            ) : (
              slots.map(slot => {
                const nextDate = getNextDateForDay(slot.day_of_week);
                const isSelected = selectedSlot?.id === slot.id;
                return (
                  <TouchableOpacity key={slot.id} style={[s.slotCard, isSelected && s.slotCardActive]} onPress={() => { setSelectedSlot(slot); setSelectedDate(nextDate); }} activeOpacity={0.85}>
                    <View style={s.slotLeft}>
                      <Text style={[s.slotDay, isSelected && { color: C.primary }]}>{DAYS[slot.day_of_week]}</Text>
                      <Text style={s.slotTime}>{slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}</Text>
                      <Text style={s.slotNext}>Next: {nextDate.toLocaleDateString()}</Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark-circle" size={24} color={C.primary} />}
                  </TouchableOpacity>
                );
              })
            )}
            <Btn label="Next: Select Level →" onPress={() => setStep(2)} disabled={!selectedSlot} style={{ marginTop: 16 }} />
          </>
        )}

        {/* Step 2: Pick level and hours */}
        {step === 2 && (
          <>
            <Text style={s.stepTitle}>Select Level & Duration</Text>
            <Text style={s.stepSub}>Choose your current level and how many hours you want.</Text>
            {levels.map(l => {
              const isSelected = selectedLevel?.level === l.level;
              return (
                <TouchableOpacity key={l.level} style={[s.levelCard, isSelected && s.levelCardActive]} onPress={() => setSelectedLevel(l)} activeOpacity={0.85}>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.levelName, isSelected && { color: C.primary }]}>{l.level}</Text>
                    <Text style={s.levelPrice}>€{l.price_min}–€{l.price_max}/hr</Text>
                  </View>
                  {isSelected && <Ionicons name="checkmark-circle" size={22} color={C.primary} />}
                </TouchableOpacity>
              );
            })}

            <Text style={s.fieldLabel}>Total hours: {totalHours}</Text>
            <View style={s.hoursRow}>
              {[10, 20, 30, 40, 50].map(h => (
                <TouchableOpacity key={h} style={[s.hoursChip, totalHours === h && s.hoursChipActive]} onPress={() => setTotalHours(h)}>
                  <Text style={[s.hoursText, totalHours === h && s.hoursTextActive]}>{h}h</Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedLevel && (
              <View style={s.summary}>
                <Text style={s.summaryTitle}>Estimated Total</Text>
                <Text style={s.summaryAmount}>€{((selectedLevel.price_min + selectedLevel.price_max) / 2 * totalHours).toFixed(0)}</Text>
                <Text style={s.summaryNote}>Based on average hourly rate</Text>
              </View>
            )}

            <View style={s.stepNav}>
              <Btn label="← Back" variant="secondary" onPress={() => setStep(1)} style={{ flex: 1 }} />
              <Btn label="Next: Payment →" onPress={() => setStep(3)} disabled={!selectedLevel} style={{ flex: 1 }} />
            </View>
          </>
        )}

        {/* Step 3: Payment plan */}
        {step === 3 && (
          <>
            <Text style={s.stepTitle}>Choose Payment Plan</Text>
            <Text style={s.stepSub}>How would you like to pay for your lessons?</Text>

            {PLANS.map(p => (
              <TouchableOpacity key={p.key} style={[s.planCard, plan === p.key && s.planCardActive]} onPress={() => setPlan(p.key)} activeOpacity={0.85}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.planName, plan === p.key && { color: C.primary }]}>{p.label}</Text>
                  <Text style={s.planDesc}>{p.desc}</Text>
                </View>
                {plan === p.key && <Ionicons name="checkmark-circle" size={22} color={C.primary} />}
              </TouchableOpacity>
            ))}

            {selectedLevel && selectedSlot && selectedDate && (
              <View style={s.bookSummary}>
                <Text style={s.bookSummaryTitle}>Booking Summary</Text>
                <Text style={s.bookSummaryItem}>📅 {selectedDate.toLocaleDateString()} at {selectedSlot.start_time.slice(0, 5)}</Text>
                <Text style={s.bookSummaryItem}>📚 Level {selectedLevel.level} · {totalHours}h total</Text>
                <Text style={s.bookSummaryItem}>💶 €{((selectedLevel.price_min + selectedLevel.price_max) / 2 * totalHours).toFixed(0)} total</Text>
              </View>
            )}

            <View style={s.stepNav}>
              <Btn label="← Back" variant="secondary" onPress={() => setStep(2)} style={{ flex: 1 }} />
              <Btn label="Confirm Booking" onPress={handleBook} loading={booking} style={{ flex: 1 }} />
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  stepTitle: { fontFamily: F.heading, fontSize: 20, color: C.text, marginBottom: 6 },
  stepSub: { fontFamily: F.body, fontSize: 13, color: C.textSub, marginBottom: 18 },
  empty: { fontFamily: F.body, fontSize: 14, color: C.textSub, textAlign: 'center', paddingVertical: 30 },
  slotCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: C.border },
  slotCardActive: { borderColor: C.primary, backgroundColor: C.primaryLight },
  slotLeft: { flex: 1 },
  slotDay: { fontFamily: F.heading, fontSize: 15, color: C.text, marginBottom: 3 },
  slotTime: { fontFamily: F.body, fontSize: 13, color: C.textSub },
  slotNext: { fontFamily: F.label, fontSize: 11, color: C.textSub, marginTop: 3 },
  levelCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: C.border },
  levelCardActive: { borderColor: C.primary, backgroundColor: C.primaryLight },
  levelName: { fontFamily: F.heading, fontSize: 16, color: C.text, marginBottom: 3 },
  levelPrice: { fontFamily: F.body, fontSize: 13, color: C.textSub },
  fieldLabel: { fontFamily: F.label, fontSize: 13, color: C.textSub, fontWeight: '600', marginBottom: 10, marginTop: 8 },
  hoursRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  hoursChip: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border, alignItems: 'center' },
  hoursChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  hoursText: { fontFamily: F.label, fontSize: 13, color: C.textSub, fontWeight: '600' },
  hoursTextActive: { color: C.textLight },
  summary: { backgroundColor: C.primaryLight, borderRadius: 14, padding: 16, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: C.primaryMid },
  summaryTitle: { fontFamily: F.label, fontSize: 12, color: C.textSub, fontWeight: '700', marginBottom: 4 },
  summaryAmount: { fontFamily: F.heading, fontSize: 28, color: C.primary },
  summaryNote: { fontFamily: F.label, fontSize: 11, color: C.textSub, marginTop: 4 },
  stepNav: { flexDirection: 'row', gap: 10, marginTop: 8 },
  planCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: C.border },
  planCardActive: { borderColor: C.primary, backgroundColor: C.primaryLight },
  planName: { fontFamily: F.heading, fontSize: 15, color: C.text, marginBottom: 3 },
  planDesc: { fontFamily: F.body, fontSize: 13, color: C.textSub },
  bookSummary: { backgroundColor: C.card, borderRadius: 14, padding: 16, marginBottom: 16, gap: 6, borderWidth: 1, borderColor: C.border },
  bookSummaryTitle: { fontFamily: F.heading, fontSize: 14, color: C.text, marginBottom: 6 },
  bookSummaryItem: { fontFamily: F.body, fontSize: 14, color: C.text },
});

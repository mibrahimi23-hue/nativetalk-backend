import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Btn } from '@/components/ui/Btn';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

export default function RescheduleSession() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { user } = useAuth();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!date || !time) { Alert.alert('Error', 'Please enter a date and time.'); return; }
    if (!reason.trim()) { Alert.alert('Error', 'Please provide a reason for rescheduling.'); return; }
    if (!sessionId || !user?.id) return;

    const newTime = new Date(`${date}T${time}:00`);
    if (isNaN(newTime.getTime())) { Alert.alert('Error', 'Invalid date or time format.'); return; }
    if (newTime < new Date()) { Alert.alert('Error', 'New time must be in the future.'); return; }

    setSubmitting(true);
    try {
      await api.reschedule.request({
        session_id: sessionId,
        requested_by: user.id,
        new_time: newTime.toISOString(),
        user_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        reason: reason.trim(),
      });
      Alert.alert('Request sent', 'Your reschedule request has been sent to the tutor.', [
        { text: 'OK', onPress: () => router.replace('/student/lessons') },
      ]);
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Reschedule Lesson" />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <Text style={s.note}>
          You can request up to 5 reschedules. Excessive rescheduling may result in account suspension.
        </Text>

        <Input
          label="New date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          placeholder="2025-06-15"
          keyboardType="numeric"
          icon="calendar-outline"
        />
        <Input
          label="New time (HH:MM, 24h)"
          value={time}
          onChangeText={setTime}
          placeholder="14:30"
          keyboardType="numeric"
          icon="time-outline"
        />

        <Text style={s.fieldLabel}>Reason for rescheduling</Text>
        <TextInput
          style={s.textArea}
          placeholder="Please explain why you need to reschedule…"
          placeholderTextColor={C.textPlaceholder}
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={4}
          maxLength={300}
          textAlignVertical="top"
        />

        <Btn label="Send Reschedule Request" onPress={handleSubmit} loading={submitting} style={{ marginTop: 8 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  note: { fontFamily: F.label, fontSize: 12, color: C.textSub, backgroundColor: C.warningBg, borderRadius: 10, padding: 12, marginBottom: 20, lineHeight: 18 },
  fieldLabel: { fontFamily: F.label, fontSize: 13, color: C.textSub, fontWeight: '600', marginBottom: 8 },
  textArea: { backgroundColor: C.card, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, padding: 14, fontFamily: F.body, fontSize: 14, color: C.text, height: 110 },
});

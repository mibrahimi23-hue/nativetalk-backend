import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Btn } from '@/components/ui/Btn';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

interface Slot {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export default function TutorAvailability() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newDay, setNewDay] = useState('Monday');
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('10:00');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!user?.teacher_id) return;
    try {
      const data = await api.availability.byTeacher(user.teacher_id) as Slot[];
      setSlots(Array.isArray(data) ? data : []);
    } catch {}
  }, [user?.teacher_id]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const handleAdd = async () => {
    if (newStart >= newEnd) { Alert.alert('Invalid time', 'End time must be after start time.'); return; }
    setSaving(true);
    try {
      await api.availability.add({ day_of_week: newDay, start_time: newStart, end_time: newEnd });
      await load();
      setShowForm(false);
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = (slotId: string) => {
    Alert.alert('Remove Slot', 'Remove this availability slot?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
        try { await api.availability.remove(slotId); await load(); }
        catch (e) { Alert.alert('Error', (e as Error).message); }
      }},
    ]);
  };

  const grouped = DAYS.reduce((acc, day) => {
    acc[day] = slots.filter(s => s.day_of_week === day);
    return acc;
  }, {} as Record<string, Slot[]>);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader
        title="Availability"
        right={
          <TouchableOpacity onPress={() => setShowForm(v => !v)} style={s.addBtn}>
            <Ionicons name={showForm ? 'close' : 'add'} size={22} color={C.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={C.primary} />}
      >
        {showForm && (
          <View style={s.formCard}>
            <Text style={s.formTitle}>Add Availability</Text>
            <Text style={s.formLabel}>Day</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.dayRow}>
              {DAYS.map(d => (
                <TouchableOpacity key={d} style={[s.dayChip, newDay === d && s.dayChipActive]} onPress={() => setNewDay(d)}>
                  <Text style={[s.dayChipTxt, newDay === d && s.dayChipTxtActive]}>{d.slice(0, 3)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={s.timeRow}>
              <View style={s.timePicker}>
                <Text style={s.formLabel}>Start</Text>
                <ScrollView style={s.timeScroll} nestedScrollEnabled>
                  {HOURS.map(h => (
                    <TouchableOpacity key={h} style={[s.timeOpt, newStart === h && s.timeOptActive]} onPress={() => setNewStart(h)}>
                      <Text style={[s.timeOptTxt, newStart === h && s.timeOptTxtActive]}>{h}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View style={s.timePicker}>
                <Text style={s.formLabel}>End</Text>
                <ScrollView style={s.timeScroll} nestedScrollEnabled>
                  {HOURS.map(h => (
                    <TouchableOpacity key={h} style={[s.timeOpt, newEnd === h && s.timeOptActive]} onPress={() => setNewEnd(h)}>
                      <Text style={[s.timeOptTxt, newEnd === h && s.timeOptTxtActive]}>{h}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            <Btn label="Save Slot" onPress={handleAdd} loading={saving} />
          </View>
        )}

        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
        ) : (
          DAYS.map(day => (
            (grouped[day].length > 0 || true) ? (
              <View key={day} style={s.daySection}>
                <Text style={s.dayTitle}>{day}</Text>
                {grouped[day].length === 0 ? (
                  <Text style={s.noSlot}>No slots set</Text>
                ) : (
                  grouped[day].map(slot => (
                    <View key={slot.id} style={s.slotRow}>
                      <Ionicons name="time-outline" size={16} color={C.primary} />
                      <Text style={s.slotTime}>{slot.start_time} – {slot.end_time}</Text>
                      <TouchableOpacity onPress={() => handleRemove(slot.id)} style={s.removeBtn}>
                        <Ionicons name="trash-outline" size={16} color={C.danger} />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            ) : null
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
  addBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  formCard: { backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 20, gap: 12 },
  formTitle: { fontFamily: F.heading, fontSize: 16, color: C.text },
  formLabel: { fontFamily: F.label, fontSize: 12, color: C.textSub, fontWeight: '600', marginBottom: 4 },
  dayRow: { gap: 6, paddingBottom: 4 },
  dayChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.border },
  dayChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  dayChipTxt: { fontFamily: F.label, fontSize: 13, color: C.textSub },
  dayChipTxtActive: { color: '#fff', fontWeight: '700' },
  timeRow: { flexDirection: 'row', gap: 12 },
  timePicker: { flex: 1 },
  timeScroll: { height: 140, borderWidth: 1.5, borderColor: C.border, borderRadius: 10, backgroundColor: C.bg },
  timeOpt: { paddingVertical: 8, paddingHorizontal: 12 },
  timeOptActive: { backgroundColor: C.primaryLight },
  timeOptTxt: { fontFamily: F.body, fontSize: 14, color: C.text },
  timeOptTxtActive: { color: C.primary, fontWeight: '700' },
  daySection: { marginBottom: 16 },
  dayTitle: { fontFamily: F.heading, fontSize: 15, color: C.text, marginBottom: 8 },
  noSlot: { fontFamily: F.body, fontSize: 13, color: C.textSub, fontStyle: 'italic', paddingLeft: 4 },
  slotRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.card, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 6 },
  slotTime: { flex: 1, fontFamily: F.body, fontSize: 14, color: C.text },
  removeBtn: { padding: 4 },
});

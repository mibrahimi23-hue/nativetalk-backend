import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminNav } from './_layout';
import { Avatar } from '@/components/ui/Avatar';
import { Empty } from '@/components/ui/Empty';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface Student {
  id: string;
  full_name?: string;
  email?: string;
  profile_photo?: string;
  is_suspended?: boolean;
  created_at?: string;
}

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await api.admin.students() as Student[];
      setStudents(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const filtered = search.trim()
    ? students.filter(s => (s.full_name ?? '').toLowerCase().includes(search.toLowerCase()) || (s.email ?? '').toLowerCase().includes(search.toLowerCase()))
    : students;

  const handleSuspend = (studentId: string, isSuspended: boolean) => {
    Alert.alert(
      isSuspended ? 'Unsuspend Student' : 'Suspend Student',
      isSuspended ? 'Restore access for this student?' : 'Suspend this student account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: 'destructive', onPress: async () => {
          try {
            if (isSuspended) await api.admin.unsuspend(studentId);
            else await api.admin.suspend(studentId, { reason: 'Admin action' });
            await load();
          } catch (e) { Alert.alert('Error', (e as Error).message); }
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Students</Text>
        <Text style={s.sub}>{students.length} registered</Text>
      </View>
      <View style={s.searchWrap}>
        <TextInput
          style={s.search}
          placeholder="Search students…"
          placeholderTextColor={C.textPlaceholder}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={C.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
        ) : filtered.length === 0 ? (
          <Empty icon="person-outline" title="No students found" />
        ) : (
          filtered.map(student => (
            <TouchableOpacity
              key={student.id}
              style={s.card}
              onPress={() => router.push({ pathname: '/admin/student/[id]', params: { id: student.id } })}
              activeOpacity={0.88}
            >
              <Avatar uri={student.profile_photo} name={student.full_name ?? ''} size={46} />
              <View style={s.info}>
                <View style={s.nameRow}>
                  <Text style={s.name}>{student.full_name ?? 'Unknown'}</Text>
                  {student.is_suspended && <View style={s.suspBadge}><Text style={s.suspTxt}>Suspended</Text></View>}
                </View>
                <Text style={s.email}>{student.email}</Text>
                {student.created_at && <Text style={s.date}>Joined {new Date(student.created_at).toLocaleDateString()}</Text>}
              </View>
              <TouchableOpacity
                style={[s.actionBtn, student.is_suspended ? s.unsuspBtn : s.suspBtn]}
                onPress={() => handleSuspend(student.id, !!student.is_suspended)}
              >
                <Text style={s.actionBtnTxt}>{student.is_suspended ? 'Unsuspend' : 'Suspend'}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 110 }} />
      </ScrollView>
      <AdminNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontFamily: F.heading, fontSize: 24, color: C.text },
  sub: { fontFamily: F.body, fontSize: 13, color: C.textSub, marginTop: 2 },
  searchWrap: { paddingHorizontal: 20, paddingBottom: 10 },
  search: { backgroundColor: C.card, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontFamily: F.body, fontSize: 14, color: C.text, borderWidth: 1, borderColor: C.border },
  scroll: { paddingHorizontal: 20, gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 14, gap: 12 },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  name: { fontFamily: F.body, fontSize: 15, color: C.text, fontWeight: '600' },
  suspBadge: { backgroundColor: C.danger, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  suspTxt: { fontFamily: F.label, fontSize: 10, color: '#fff', fontWeight: '700' },
  email: { fontFamily: F.label, fontSize: 12, color: C.textSub, marginTop: 2 },
  date: { fontFamily: F.label, fontSize: 11, color: C.textSub, marginTop: 2 },
  actionBtn: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  suspBtn: { backgroundColor: '#FEE2E2' },
  unsuspBtn: { backgroundColor: '#D1FAE5' },
  actionBtnTxt: { fontFamily: F.label, fontSize: 11, color: C.text, fontWeight: '700' },
});

import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminNav } from './_layout';
import { Avatar } from '@/components/ui/Avatar';
import { Empty } from '@/components/ui/Empty';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface Teacher {
  id: string;
  full_name?: string;
  email?: string;
  profile_photo?: string;
  is_verified?: boolean;
  is_suspended?: boolean;
  teaching_languages?: string[];
  rating?: number;
}

export default function AdminTutors() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await api.admin.teachers() as Teacher[];
      setTeachers(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const filtered = search.trim()
    ? teachers.filter(t => (t.full_name ?? '').toLowerCase().includes(search.toLowerCase()) || (t.email ?? '').toLowerCase().includes(search.toLowerCase()))
    : teachers;

  const handleSuspend = (teacherId: string, isSuspended: boolean) => {
    Alert.alert(
      isSuspended ? 'Unsuspend Tutor' : 'Suspend Tutor',
      isSuspended ? 'Allow this tutor to teach again?' : 'Prevent this tutor from taking new sessions?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: 'destructive', onPress: async () => {
          try {
            if (isSuspended) await api.admin.unsuspend(teacherId);
            else await api.admin.suspend(teacherId, { reason: 'Admin action' });
            await load();
          } catch (e) { Alert.alert('Error', (e as Error).message); }
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Tutors</Text>
        <Text style={s.sub}>{teachers.length} registered</Text>
      </View>
      <View style={s.searchWrap}>
        <TextInput
          style={s.search}
          placeholder="Search tutors…"
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
          <Empty icon="people-outline" title="No tutors found" />
        ) : (
          filtered.map(teacher => (
            <TouchableOpacity
              key={teacher.id}
              style={s.card}
              onPress={() => router.push({ pathname: '/admin/tutor/[id]', params: { id: teacher.id } })}
              activeOpacity={0.88}
            >
              <Avatar uri={teacher.profile_photo} name={teacher.full_name ?? ''} size={46} />
              <View style={s.info}>
                <View style={s.nameRow}>
                  <Text style={s.name}>{teacher.full_name ?? 'Unknown'}</Text>
                  {teacher.is_verified && <View style={s.verBadge}><Text style={s.verTxt}>✓</Text></View>}
                  {teacher.is_suspended && <View style={s.suspBadge}><Text style={s.suspTxt}>Suspended</Text></View>}
                </View>
                <Text style={s.email}>{teacher.email}</Text>
                {teacher.teaching_languages && <Text style={s.langs}>{teacher.teaching_languages.join(', ')}</Text>}
              </View>
              <TouchableOpacity
                style={[s.actionBtn, teacher.is_suspended ? s.unsuspBtn : s.suspBtn]}
                onPress={() => handleSuspend(teacher.id, !!teacher.is_suspended)}
              >
                <Text style={s.actionBtnTxt}>{teacher.is_suspended ? 'Unsuspend' : 'Suspend'}</Text>
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
  verBadge: { backgroundColor: C.success, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  verTxt: { fontFamily: F.label, fontSize: 10, color: '#fff', fontWeight: '700' },
  suspBadge: { backgroundColor: C.danger, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  suspTxt: { fontFamily: F.label, fontSize: 10, color: '#fff', fontWeight: '700' },
  email: { fontFamily: F.label, fontSize: 12, color: C.textSub, marginTop: 2 },
  langs: { fontFamily: F.label, fontSize: 11, color: C.primary, marginTop: 3 },
  actionBtn: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  suspBtn: { backgroundColor: '#FEE2E2' },
  unsuspBtn: { backgroundColor: '#D1FAE5' },
  actionBtnTxt: { fontFamily: F.label, fontSize: 11, color: C.text, fontWeight: '700' },
});

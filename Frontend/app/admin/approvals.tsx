import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AdminNav } from './_layout';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Btn } from '@/components/ui/Btn';
import { Empty } from '@/components/ui/Empty';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface PendingTeacher {
  id: string;
  user_id: string;
  full_name?: string;
  email?: string;
  profile_photo?: string;
  bio?: string;
  teaching_languages?: string[];
  submitted_at?: string;
}

export default function AdminApprovals() {
  const [pending, setPending] = useState<PendingTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api.verifications.pending() as PendingTeacher[];
      setPending(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const handleVerify = async (teacherId: string) => {
    setBusy(teacherId);
    try {
      await api.verifications.verify(teacherId);
      await load();
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const handleRevoke = (teacherId: string) => {
    Alert.alert('Reject Application', 'Reject this tutor application?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: async () => {
        setBusy(teacherId);
        try { await api.verifications.revoke(teacherId); await load(); }
        catch (e) { Alert.alert('Error', (e as Error).message); }
        finally { setBusy(null); }
      }},
    ]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Pending Approvals" />
      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={C.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
        ) : pending.length === 0 ? (
          <Empty icon="shield-checkmark-outline" title="All clear!" subtitle="No pending tutor applications to review." />
        ) : (
          pending.map(teacher => (
            <View key={teacher.id} style={s.card}>
              <TouchableOpacity
                style={s.cardTop}
                onPress={() => router.push({ pathname: '/admin/tutor/[id]', params: { id: teacher.id } })}
                activeOpacity={0.88}
              >
                <Avatar uri={teacher.profile_photo} name={teacher.full_name ?? ''} size={52} />
                <View style={s.info}>
                  <Text style={s.name}>{teacher.full_name ?? 'Unknown'}</Text>
                  <Text style={s.email}>{teacher.email ?? ''}</Text>
                  {teacher.teaching_languages && teacher.teaching_languages.length > 0 && (
                    <Text style={s.langs}>{teacher.teaching_languages.join(' · ')}</Text>
                  )}
                </View>
              </TouchableOpacity>
              {teacher.bio ? (
                <Text style={s.bio} numberOfLines={2}>{teacher.bio}</Text>
              ) : null}
              <View style={s.actions}>
                <View style={s.actionFlex}>
                  <Btn
                    label="Approve"
                    onPress={() => handleVerify(teacher.id)}
                    loading={busy === teacher.id}
                    size="sm"
                  />
                </View>
                <View style={s.actionFlex}>
                  <Btn
                    label="Reject"
                    variant="danger"
                    onPress={() => handleRevoke(teacher.id)}
                    loading={busy === teacher.id}
                    size="sm"
                  />
                </View>
              </View>
            </View>
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
  scroll: { paddingHorizontal: 20, paddingTop: 12, gap: 12 },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 16, gap: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  info: { flex: 1 },
  name: { fontFamily: F.body, fontSize: 16, color: C.text, fontWeight: '600' },
  email: { fontFamily: F.label, fontSize: 12, color: C.textSub, marginTop: 2 },
  langs: { fontFamily: F.label, fontSize: 12, color: C.primary, marginTop: 3, fontWeight: '600' },
  bio: { fontFamily: F.body, fontSize: 13, color: C.textSub, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 10 },
  actionFlex: { flex: 1 },
});

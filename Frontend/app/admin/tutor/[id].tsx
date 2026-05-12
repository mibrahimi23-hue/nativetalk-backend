import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Btn } from '@/components/ui/Btn';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface TutorDetail {
  id: string;
  full_name?: string;
  email?: string;
  profile_photo?: string;
  bio?: string;
  teaching_languages?: string[];
  is_verified?: boolean;
  is_suspended?: boolean;
  rating?: number;
  review_count?: number;
  session_count?: number;
  certificates?: { id: string; title: string; file_url: string; is_verified: boolean }[];
}

export default function AdminTutorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tutor, setTutor] = useState<TutorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const data = await api.tutors.byId(id) as TutorDetail;
      setTutor(data);
    } catch {}
  }, [id]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const handleVerify = async () => {
    if (!id) return;
    setBusy(true);
    try { await api.verifications.verify(id); await load(); }
    catch (e) { Alert.alert('Error', (e as Error).message); }
    finally { setBusy(false); }
  };

  const handleRevoke = async () => {
    if (!id) return;
    Alert.alert('Revoke Verification', 'Remove verified status from this tutor?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Revoke', style: 'destructive', onPress: async () => {
        setBusy(true);
        try { await api.verifications.revoke(id); await load(); }
        catch (e) { Alert.alert('Error', (e as Error).message); }
        finally { setBusy(false); }
      }},
    ]);
  };

  const handleSuspend = () => {
    if (!tutor) return;
    Alert.alert(
      tutor.is_suspended ? 'Unsuspend Tutor' : 'Suspend Tutor',
      tutor.is_suspended ? 'Allow this tutor to teach again?' : 'Suspend this tutor?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: 'destructive', onPress: async () => {
          setBusy(true);
          try {
            if (tutor.is_suspended) await api.admin.unsuspend(id!);
            else await api.admin.suspend(id!, { reason: 'Admin action' });
            await load();
          } catch (e) { Alert.alert('Error', (e as Error).message); }
          finally { setBusy(false); }
        }},
      ]
    );
  };

  if (loading) return <SafeAreaView style={s.safe} edges={['top']}><ScreenHeader title="Tutor Detail" /><ActivityIndicator color={C.primary} style={{ marginTop: 40 }} /></SafeAreaView>;
  if (!tutor) return <SafeAreaView style={s.safe} edges={['top']}><ScreenHeader title="Tutor Detail" /><Text style={s.notFound}>Tutor not found.</Text></SafeAreaView>;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Tutor Detail" />
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.profileCard}>
          <Avatar uri={tutor.profile_photo} name={tutor.full_name ?? ''} size={72} />
          <View style={s.profileInfo}>
            <Text style={s.name}>{tutor.full_name ?? 'Unknown'}</Text>
            <Text style={s.email}>{tutor.email}</Text>
            <View style={s.badges}>
              {tutor.is_verified && <View style={s.verBadge}><Text style={s.verTxt}>✓ Verified</Text></View>}
              {tutor.is_suspended && <View style={s.suspBadge}><Text style={s.suspTxt}>Suspended</Text></View>}
            </View>
          </View>
        </View>

        <View style={s.statsRow}>
          <View style={s.stat}><Text style={s.statVal}>{(tutor.rating ?? 0).toFixed(1)}</Text><Text style={s.statLabel}>Rating</Text></View>
          <View style={s.statDivider} />
          <View style={s.stat}><Text style={s.statVal}>{tutor.review_count ?? 0}</Text><Text style={s.statLabel}>Reviews</Text></View>
          <View style={s.statDivider} />
          <View style={s.stat}><Text style={s.statVal}>{tutor.session_count ?? 0}</Text><Text style={s.statLabel}>Sessions</Text></View>
        </View>

        {tutor.teaching_languages && tutor.teaching_languages.length > 0 && (
          <View style={s.infoCard}>
            <Text style={s.infoLabel}>Teaching Languages</Text>
            <Text style={s.infoVal}>{tutor.teaching_languages.join(', ')}</Text>
          </View>
        )}

        {tutor.bio ? (
          <View style={s.infoCard}>
            <Text style={s.infoLabel}>Bio</Text>
            <Text style={s.infoVal}>{tutor.bio}</Text>
          </View>
        ) : null}

        {tutor.certificates && tutor.certificates.length > 0 && (
          <View style={s.infoCard}>
            <Text style={s.infoLabel}>Certificates ({tutor.certificates.length})</Text>
            {tutor.certificates.map(cert => (
              <TouchableOpacity key={cert.id} style={s.certRow} onPress={() => Linking.openURL(cert.file_url)}>
                <Ionicons name="ribbon-outline" size={16} color={C.primary} />
                <Text style={s.certTitle}>{cert.title}</Text>
                <View style={[s.certBadge, { backgroundColor: cert.is_verified ? C.success : C.warning }]}>
                  <Text style={s.certBadgeTxt}>{cert.is_verified ? 'Verified' : 'Pending'}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={s.actions}>
          {!tutor.is_verified ? (
            <Btn label="Approve & Verify" onPress={handleVerify} loading={busy} />
          ) : (
            <Btn label="Revoke Verification" variant="danger" onPress={handleRevoke} loading={busy} />
          )}
          <Btn
            label={tutor.is_suspended ? 'Unsuspend Tutor' : 'Suspend Tutor'}
            variant={tutor.is_suspended ? 'secondary' : 'danger'}
            onPress={handleSuspend}
            loading={busy}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 16, gap: 16, paddingBottom: 40 },
  notFound: { textAlign: 'center', marginTop: 40, color: C.textSub, fontFamily: F.body },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: C.card, borderRadius: 16, padding: 16 },
  profileInfo: { flex: 1, gap: 4 },
  name: { fontFamily: F.heading, fontSize: 20, color: C.text },
  email: { fontFamily: F.label, fontSize: 13, color: C.textSub },
  badges: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  verBadge: { backgroundColor: '#D1FAE5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  verTxt: { fontFamily: F.label, fontSize: 11, color: C.success, fontWeight: '700' },
  suspBadge: { backgroundColor: '#FEE2E2', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  suspTxt: { fontFamily: F.label, fontSize: 11, color: C.danger, fontWeight: '700' },
  statsRow: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 16, overflow: 'hidden' },
  stat: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  statVal: { fontFamily: F.heading, fontSize: 20, color: C.text },
  statLabel: { fontFamily: F.label, fontSize: 11, color: C.textSub, marginTop: 3 },
  statDivider: { width: 1, backgroundColor: C.divider },
  infoCard: { backgroundColor: C.card, borderRadius: 16, padding: 16, gap: 8 },
  infoLabel: { fontFamily: F.label, fontSize: 12, color: C.textSub, fontWeight: '600' },
  infoVal: { fontFamily: F.body, fontSize: 14, color: C.text, lineHeight: 22 },
  certRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  certTitle: { flex: 1, fontFamily: F.body, fontSize: 13, color: C.text },
  certBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  certBadgeTxt: { fontFamily: F.label, fontSize: 10, color: '#fff', fontWeight: '700' },
  actions: { gap: 10 },
});

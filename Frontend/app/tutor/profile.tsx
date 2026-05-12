import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TutorNav } from './_layout';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface TutorProfile {
  bio?: string;
  teaching_languages?: string[];
  certifications?: string[];
  is_verified?: boolean;
  rating?: number;
  review_count?: number;
  session_count?: number;
}

export default function TutorProfile() {
  const { user, logout, refreshMe } = useAuth();
  const [profile, setProfile] = useState<TutorProfile>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      await refreshMe();
      if (user?.teacher_id) {
        const data = await api.tutors.byId(user.teacher_id) as TutorProfile;
        setProfile(data ?? {});
      }
    } catch {}
  }, [user?.teacher_id]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const handleLogout = async () => {
    await logout();
    router.replace('/welcome');
  };

  const MENU = [
    { icon: 'person-outline' as const, label: 'Edit Profile', route: '/tutor/edit-profile' },
    { icon: 'calendar-outline' as const, label: 'Availability', route: '/tutor/availability' },
    { icon: 'document-outline' as const, label: 'Certificates', route: '/tutor/certificates' },
    { icon: 'library-outline' as const, label: 'Materials', route: '/tutor/materials' },
    { icon: 'settings-outline' as const, label: 'Settings', route: '/tutor/settings' },
  ];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={C.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 60 }} />
        ) : (
          <>
            <View style={s.profileTop}>
              <Avatar uri={user?.profile_photo} name={user?.full_name ?? ''} size={80} />
              <View style={s.nameWrap}>
                <View style={s.nameRow}>
                  <Text style={s.name}>{user?.full_name}</Text>
                  {profile.is_verified && (
                    <View style={s.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#fff" />
                      <Text style={s.verifiedTxt}>Verified</Text>
                    </View>
                  )}
                </View>
                <Text style={s.email}>{user?.email}</Text>
                {profile.teaching_languages && profile.teaching_languages.length > 0 && (
                  <Text style={s.langs}>{profile.teaching_languages.join(' · ')}</Text>
                )}
              </View>
            </View>

            <View style={s.statsRow}>
              <View style={s.stat}>
                <Text style={s.statVal}>{(profile.rating ?? 0).toFixed(1)}</Text>
                <Text style={s.statLabel}>Rating</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.stat}>
                <Text style={s.statVal}>{profile.review_count ?? 0}</Text>
                <Text style={s.statLabel}>Reviews</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.stat}>
                <Text style={s.statVal}>{profile.session_count ?? 0}</Text>
                <Text style={s.statLabel}>Sessions</Text>
              </View>
            </View>

            {profile.bio ? (
              <View style={s.bioCard}>
                <Text style={s.bioLabel}>About Me</Text>
                <Text style={s.bioText}>{profile.bio}</Text>
              </View>
            ) : null}

            <View style={s.menuCard}>
              {MENU.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  style={[s.menuItem, i < MENU.length - 1 && s.menuBorder]}
                  onPress={() => router.push(item.route as never)}
                  activeOpacity={0.8}
                >
                  <View style={s.menuLeft}>
                    <View style={s.menuIcon}>
                      <Ionicons name={item.icon} size={18} color={C.primary} />
                    </View>
                    <Text style={s.menuLabel}>{item.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={C.textSub} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
              <Ionicons name="log-out-outline" size={18} color={C.danger} />
              <Text style={s.logoutTxt}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
        <View style={{ height: 110 }} />
      </ScrollView>
      <TutorNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  nameWrap: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  name: { fontFamily: F.heading, fontSize: 20, color: C.text },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: C.success, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  verifiedTxt: { fontFamily: F.label, fontSize: 11, color: '#fff', fontWeight: '700' },
  email: { fontFamily: F.body, fontSize: 13, color: C.textSub, marginTop: 2 },
  langs: { fontFamily: F.label, fontSize: 12, color: C.primary, marginTop: 4, fontWeight: '600' },
  statsRow: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 16, marginBottom: 16, overflow: 'hidden', elevation: 1 },
  stat: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  statVal: { fontFamily: F.heading, fontSize: 20, color: C.text },
  statLabel: { fontFamily: F.label, fontSize: 11, color: C.textSub, marginTop: 3 },
  statDivider: { width: 1, backgroundColor: C.divider },
  bioCard: { backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 16 },
  bioLabel: { fontFamily: F.label, fontSize: 12, color: C.textSub, fontWeight: '600', marginBottom: 6 },
  bioText: { fontFamily: F.body, fontSize: 14, color: C.text, lineHeight: 22 },
  menuCard: { backgroundColor: C.card, borderRadius: 16, marginBottom: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: C.divider },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontFamily: F.body, fontSize: 15, color: C.text },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, backgroundColor: C.card, borderRadius: 16 },
  logoutTxt: { fontFamily: F.label, fontSize: 15, color: C.danger, fontWeight: '700' },
});

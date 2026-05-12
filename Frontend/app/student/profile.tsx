import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { StudentNav } from './_layout';
import { Avatar } from '@/components/ui/Avatar';
import { LevelBadge } from '@/components/ui/Badge';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

const MENU = [
  { icon: 'person-outline' as const, label: 'Edit Profile', route: '/student/edit-profile' },
  { icon: 'book-outline' as const, label: 'My Lessons', route: '/student/lessons' },
  { icon: 'card-outline' as const, label: 'Transactions', route: '/student/transactions' },
  { icon: 'library-outline' as const, label: 'Learning Materials', route: '/student/materials' },
  { icon: 'bookmark-outline' as const, label: 'Saved Tutors', route: '/student/saved' },
  { icon: 'settings-outline' as const, label: 'Settings', route: '/student/settings' },
];

export default function StudentProfile() {
  const { user, logout, refreshMe } = useAuth();
  const [progress, setProgress] = useState<{ sessions_completed?: number; hours_completed?: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      if (user?.student_id) {
        const p = await api.progress.byStudent(user.student_id) as typeof progress;
        setProgress(p);
      }
    } catch {}
  }, [user]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshMe(), load()]);
    setRefreshing(false);
  }, [refreshMe, load]);

  const handleLogout = async () => {
    await logout();
    router.replace('/welcome');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />}
      >
        {/* Profile header */}
        <View style={s.profileCard}>
          <Avatar uri={user?.profile_photo} name={user?.full_name ?? ''} size={80} />
          <View style={s.profileInfo}>
            <Text style={s.name}>{user?.full_name}</Text>
            <Text style={s.email}>{user?.email}</Text>
            {user?.phone ? <Text style={s.phone}>{user.phone}</Text> : null}
          </View>
        </View>

        {/* Stats */}
        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginVertical: 20 }} />
        ) : (
          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statNum}>{progress?.sessions_completed ?? 0}</Text>
              <Text style={s.statLabel}>Lessons Done</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={s.statNum}>{progress?.hours_completed ?? 0}</Text>
              <Text style={s.statLabel}>Hours Learned</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={s.statNum}>—</Text>
              <Text style={s.statLabel}>Current Level</Text>
            </View>
          </View>
        )}

        {/* Menu */}
        <View style={s.menu}>
          {MENU.map((item, i) => (
            <TouchableOpacity key={item.label} style={[s.menuItem, i === MENU.length - 1 && { borderBottomWidth: 0 }]} onPress={() => router.push(item.route as never)} activeOpacity={0.85}>
              <View style={s.menuIcon}>
                <Ionicons name={item.icon} size={20} color={C.primary} />
              </View>
              <Text style={s.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={C.textSub} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={C.error} />
          <Text style={s.logoutTxt}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 110 }} />
      </ScrollView>
      <StudentNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 20, padding: 18, marginBottom: 16, gap: 16, elevation: 2, shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  profileInfo: { flex: 1 },
  name: { fontFamily: F.heading, fontSize: 20, color: C.text, marginBottom: 4 },
  email: { fontFamily: F.body, fontSize: 13, color: C.textSub },
  phone: { fontFamily: F.body, fontSize: 13, color: C.textSub },
  statsRow: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 16, marginBottom: 16, overflow: 'hidden' },
  stat: { flex: 1, paddingVertical: 18, alignItems: 'center' },
  statNum: { fontFamily: F.heading, fontSize: 22, color: C.primary },
  statLabel: { fontFamily: F.label, fontSize: 11, color: C.textSub, marginTop: 3, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: C.divider },
  menu: { backgroundColor: C.card, borderRadius: 16, marginBottom: 12, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.divider, gap: 14 },
  menuIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontFamily: F.body, fontSize: 15, color: C.text },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, backgroundColor: C.errorBg, borderRadius: 14, borderWidth: 1.5, borderColor: C.error + '40' },
  logoutTxt: { fontFamily: F.body, fontSize: 15, color: C.error, fontWeight: '700' },
});

import { Ionicons } from '@expo/vector-icons';
import { router, Stack, usePathname } from 'expo-router';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { C, F } from '@/constants/theme';

const TABS = [
  { name: 'index', icon: 'grid-outline' as const, activeIcon: 'grid' as const, label: 'Dashboard' },
  { name: 'approvals', icon: 'shield-checkmark-outline' as const, activeIcon: 'shield-checkmark' as const, label: 'Approvals' },
  { name: 'tutors', icon: 'people-outline' as const, activeIcon: 'people' as const, label: 'Tutors' },
  { name: 'flags', icon: 'flag-outline' as const, activeIcon: 'flag' as const, label: 'Flags' },
  { name: 'students', icon: 'person-outline' as const, activeIcon: 'person' as const, label: 'Students' },
];

export function AdminNav() {
  const insets = useSafeAreaInsets();
  const path = usePathname();

  const activeTab = TABS.find(t => {
    if (t.name === 'index') return path === '/admin' || path === '/admin/';
    return path.startsWith(`/admin/${t.name}`);
  });

  return (
    <View style={[n.nav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map(tab => {
        const isActive = activeTab?.name === tab.name;
        const route = tab.name === 'index' ? '/admin' : `/admin/${tab.name}`;
        return (
          <TouchableOpacity key={tab.name} style={n.item} onPress={() => router.replace(route as never)}>
            <Ionicons name={isActive ? tab.activeIcon : tab.icon} size={22} color={isActive ? C.primary : C.textSub} />
            <Text style={[n.label, isActive && n.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const n = StyleSheet.create({
  nav: { flexDirection: 'row', backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.divider, paddingTop: 10 },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontFamily: F.label, fontSize: 10, color: C.textSub },
  labelActive: { color: C.primary, fontWeight: '700' },
});

export default function AdminLayout() {
  const { loading, isAuthenticated, role } = useAuth();

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg }}>
      <ActivityIndicator color={C.primary} />
    </View>
  );
  if (!isAuthenticated) return <Redirect href="/welcome" />;
  if (role !== 'admin') return <Redirect href={'/' as never} />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="tutors" />
      <Stack.Screen name="students" />
      <Stack.Screen name="approvals" />
      <Stack.Screen name="flags" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="suspensions" />
      <Stack.Screen name="exam-builder" />
      <Stack.Screen name="tutor/[id]" />
      <Stack.Screen name="student/[id]" />
    </Stack>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { router, Stack, usePathname } from 'expo-router';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { C, F } from '@/constants/theme';

const TABS = [
  { name: 'index', icon: 'home-outline' as const, activeIcon: 'home' as const, label: 'Home' },
  { name: 'sessions', icon: 'book-outline' as const, activeIcon: 'book' as const, label: 'Sessions' },
  { name: 'chat', icon: 'chatbubble-outline' as const, activeIcon: 'chatbubble' as const, label: 'Chat' },
  { name: 'earnings', icon: 'wallet-outline' as const, activeIcon: 'wallet' as const, label: 'Earnings' },
  { name: 'profile', icon: 'person-outline' as const, activeIcon: 'person' as const, label: 'Profile' },
];

export function TutorNav() {
  const insets = useSafeAreaInsets();
  const path = usePathname();

  const activeTab = TABS.find(t => {
    if (t.name === 'index') return path === '/tutor' || path === '/tutor/';
    return path.startsWith(`/tutor/${t.name}`);
  });

  return (
    <View style={[n.nav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map(tab => {
        const isActive = activeTab?.name === tab.name;
        const route = tab.name === 'index' ? '/tutor' : `/tutor/${tab.name}`;
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

export default function TutorLayout() {
  const { loading, isAuthenticated, role } = useAuth();

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg }}>
      <ActivityIndicator color={C.primary} />
    </View>
  );
  if (!isAuthenticated) return <Redirect href="/welcome" />;
  if (role !== 'teacher') return <Redirect href={'/student' as never} />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="sessions" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="earnings" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="session/[id]" />
      <Stack.Screen name="direct/[userId]" />
      <Stack.Screen name="videocall/[sessionId]" />
      <Stack.Screen name="review/[sessionId]" />
      <Stack.Screen name="availability" />
      <Stack.Screen name="certificates" />
      <Stack.Screen name="materials" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="onboarding/language" />
      <Stack.Screen name="onboarding/exam" />
      <Stack.Screen name="onboarding/result" />
      <Stack.Screen name="onboarding/wait" />
    </Stack>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { router, Stack, usePathname } from 'expo-router';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { C, F } from '@/constants/theme';

const TABS = [
  { name: 'index', icon: 'home-outline' as const, activeIcon: 'home' as const, label: 'Home' },
  { name: 'lessons', icon: 'book-outline' as const, activeIcon: 'book' as const, label: 'Lessons' },
  { name: 'chat', icon: 'chatbubble-outline' as const, activeIcon: 'chatbubble' as const, label: 'Chat' },
  { name: 'profile', icon: 'person-outline' as const, activeIcon: 'person' as const, label: 'Profile' },
];

export function StudentNav() {
  const insets = useSafeAreaInsets();
  const path = usePathname();

  const activeTab = TABS.find(t => {
    if (t.name === 'index') return path === '/student' || path === '/student/';
    return path.startsWith(`/student/${t.name}`);
  });

  return (
    <View style={[n.nav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map(tab => {
        const isActive = activeTab?.name === tab.name;
        const route = tab.name === 'index' ? '/student' : `/student/${tab.name}`;
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

export default function StudentLayout() {
  const { loading, isAuthenticated, role } = useAuth();

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg }}>
      <ActivityIndicator color={C.primary} />
    </View>
  );
  if (!isAuthenticated) return <Redirect href="/welcome" />;
  if (role !== 'student') return <Redirect href={'/tutor' as never} />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="lessons" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="tutor/[id]" />
      <Stack.Screen name="lesson/[id]" />
      <Stack.Screen name="book/[tutorId]" />
      <Stack.Screen name="direct/[userId]" />
      <Stack.Screen name="videocall/[sessionId]" />
      <Stack.Screen name="review/[sessionId]" />
      <Stack.Screen name="reschedule/[sessionId]" />
      <Stack.Screen name="payment/[courseId]" />
      <Stack.Screen name="materials" />
      <Stack.Screen name="transactions" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="saved" />
    </Stack>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuth } from '@/contexts/AuthContext';
import { C, F } from '@/constants/theme';

const SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: 'person-outline' as const, label: 'Edit Profile', route: '/student/edit-profile' },
      { icon: 'lock-closed-outline' as const, label: 'Change Password', route: '/forgot' },
      { icon: 'notifications-outline' as const, label: 'Notifications', route: null },
    ],
  },
  {
    title: 'Learning',
    items: [
      { icon: 'book-outline' as const, label: 'My Lessons', route: '/student/lessons' },
      { icon: 'card-outline' as const, label: 'Transactions', route: '/student/transactions' },
      { icon: 'library-outline' as const, label: 'Materials', route: '/student/materials' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'information-circle-outline' as const, label: 'About NativeTalk', route: null },
      { icon: 'shield-outline' as const, label: 'Privacy Policy', route: null },
    ],
  },
];

export default function Settings() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/welcome');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Settings" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {SECTIONS.map(section => (
          <View key={section.title} style={s.section}>
            <Text style={s.sectionTitle}>{section.title}</Text>
            <View style={s.sectionCard}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  style={[s.item, i === section.items.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={() => item.route ? router.push(item.route as never) : Alert.alert('Coming soon')}
                  activeOpacity={0.8}
                >
                  <View style={s.itemIcon}>
                    <Ionicons name={item.icon} size={18} color={C.primary} />
                  </View>
                  <Text style={s.itemLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={C.textSub} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={C.error} />
          <Text style={s.logoutTxt}>Sign Out</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontFamily: F.label, fontSize: 12, color: C.textSub, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, paddingLeft: 4 },
  sectionCard: { backgroundColor: C.card, borderRadius: 16, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.divider, gap: 12 },
  itemIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  itemLabel: { flex: 1, fontFamily: F.body, fontSize: 15, color: C.text },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, backgroundColor: C.errorBg, borderRadius: 14, borderWidth: 1.5, borderColor: C.error + '40', marginBottom: 8 },
  logoutTxt: { fontFamily: F.body, fontSize: 15, color: C.error, fontWeight: '700' },
});

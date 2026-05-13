import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuth } from '@/contexts/AuthContext';
import { C, F } from '@/constants/theme';

interface MenuItem {
  icon: any;
  label: string;
  sub?: string;
  onPress: () => void;
  danger?: boolean;
}

export default function TutorSettings() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/welcome');
  };

  const SECTIONS: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Account',
      items: [
        { icon: 'person-outline', label: 'Edit Profile', sub: 'Update your name, photo and bio', onPress: () => router.push('/tutor/edit-profile') },
        { icon: 'calendar-outline', label: 'Availability', sub: 'Manage your teaching schedule', onPress: () => router.push('/tutor/availability') },
        { icon: 'document-outline', label: 'Certificates', sub: 'Upload and manage certificates', onPress: () => router.push('/tutor/certificates') },
        { icon: 'library-outline', label: 'Materials', sub: 'Manage study materials', onPress: () => router.push('/tutor/materials') },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Help Center', sub: 'FAQs and support articles', onPress: () => Alert.alert('Help', 'Visit nativetalk.com/help for support.') },
        { icon: 'mail-outline', label: 'Contact Support', sub: 'Get help from our team', onPress: () => Alert.alert('Contact', 'Email support@nativetalk.com') },
        { icon: 'shield-checkmark-outline', label: 'Privacy Policy', onPress: () => Alert.alert('Privacy', 'See nativetalk.com/privacy') },
        { icon: 'document-text-outline', label: 'Terms of Service', onPress: () => Alert.alert('Terms', 'See nativetalk.com/terms') },
      ],
    },
    {
      title: 'Danger Zone',
      items: [
        { icon: 'log-out-outline', label: 'Logout', onPress: handleLogout, danger: true },
      ],
    },
  ];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Settings" />
      <ScrollView contentContainerStyle={s.scroll}>
        {SECTIONS.map(section => (
          <View key={section.title} style={s.section}>
            <Text style={s.sectionTitle}>{section.title}</Text>
            <View style={s.card}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  style={[s.item, i < section.items.length - 1 && s.itemBorder]}
                  onPress={item.onPress}
                  activeOpacity={0.8}
                >
                  <View style={[s.iconWrap, item.danger && s.iconDanger]}>
                    <Ionicons name={item.icon} size={18} color={item.danger ? C.danger : C.primary} />
                  </View>
                  <View style={s.itemText}>
                    <Text style={[s.label, item.danger && { color: C.danger }]}>{item.label}</Text>
                    {item.sub && <Text style={s.sub}>{item.sub}</Text>}
                  </View>
                  {!item.danger && <Ionicons name="chevron-forward" size={16} color={C.textSub} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 12 },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: F.label, fontSize: 12, color: C.textSub, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: C.card, borderRadius: 16, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: C.divider },
  iconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  iconDanger: { backgroundColor: '#FEE2E2' },
  itemText: { flex: 1 },
  label: { fontFamily: F.body, fontSize: 15, color: C.text },
  sub: { fontFamily: F.label, fontSize: 12, color: C.textSub, marginTop: 2 },
});

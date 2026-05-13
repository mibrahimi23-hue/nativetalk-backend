import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '@/constants/theme';

const ROLES = [
  {
    key: 'student',
    icon: 'school-outline' as const,
    title: 'I want to learn',
    subtitle: 'Find native tutors, book lessons, and track your progress.',
    route: '/register',
  },
  {
    key: 'teacher',
    icon: 'mic-outline' as const,
    title: 'I want to teach',
    subtitle: 'Share your language skills and earn by teaching online.',
    route: '/tutor-register',
  },
];

export default function RoleSelect() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <TouchableOpacity style={s.back} onPress={() => router.back()} hitSlop={8}>
        <Ionicons name="chevron-back" size={24} color={C.text} />
      </TouchableOpacity>

      <View style={s.content}>
        <Text style={s.heading}>Who are you?</Text>
        <Text style={s.sub}>Choose your role to get started.</Text>

        {ROLES.map(r => (
          <TouchableOpacity key={r.key} style={s.card} onPress={() => router.push(r.route as never)} activeOpacity={0.85}>
            <View style={s.iconWrap}>
              <Ionicons name={r.icon} size={28} color={C.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>{r.title}</Text>
              <Text style={s.cardSub}>{r.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={C.textSub} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  back: { padding: 16 },
  content: { flex: 1, paddingHorizontal: 22, paddingTop: 12 },
  heading: { fontFamily: F.heading, fontSize: 26, color: C.text, marginBottom: 6 },
  sub: { fontFamily: F.body, fontSize: 14, color: C.textSub, marginBottom: 28 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 18, padding: 18, marginBottom: 14, borderWidth: 1.5, borderColor: C.border, gap: 14, shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  iconWrap: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontFamily: F.heading, fontSize: 17, color: C.text, marginBottom: 4 },
  cardSub: { fontFamily: F.body, fontSize: 13, color: C.textSub, lineHeight: 18 },
});

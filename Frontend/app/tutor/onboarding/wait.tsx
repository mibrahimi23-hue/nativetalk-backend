import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '@/constants/theme';

export default function OnboardingWait() {
  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.content}>
        <View style={s.iconCircle}>
          <Ionicons name="hourglass-outline" size={56} color={C.primary} />
        </View>

        <Text style={s.step}>Step 3 of 3</Text>
        <Text style={s.title}>Profile Under Review</Text>
        <Text style={s.sub}>
          Your tutor profile has been submitted for review. Our admin team will verify your credentials and certificates within 1-3 business days.
        </Text>

        <View style={s.stepsCard}>
          {[
            { icon: 'checkmark-circle', label: 'Profile created', done: true },
            { icon: 'checkmark-circle', label: 'Languages selected', done: true },
            { icon: 'time-outline', label: 'Admin verification', done: false },
            { icon: 'star-outline', label: 'Start teaching!', done: false },
          ].map((step, i) => (
            <View key={i} style={s.stepRow}>
              <Ionicons name={step.icon as any} size={20} color={step.done ? C.success : C.textSub} />
              <Text style={[s.stepLabel, step.done && s.stepDone]}>{step.label}</Text>
            </View>
          ))}
        </View>

        <Text style={s.notice}>You'll receive an email notification when your account is approved.</Text>

        <TouchableOpacity style={s.dashBtn} onPress={() => router.replace('/tutor')}>
          <Text style={s.dashBtnTxt}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 18 },
  iconCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  step: { fontFamily: F.label, fontSize: 12, color: C.primary, fontWeight: '700', textTransform: 'uppercase' },
  title: { fontFamily: F.heading, fontSize: 26, color: C.text, textAlign: 'center' },
  sub: { fontFamily: F.body, fontSize: 14, color: C.textSub, textAlign: 'center', lineHeight: 22 },
  stepsCard: { backgroundColor: C.card, borderRadius: 16, padding: 20, width: '100%', gap: 14 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepLabel: { fontFamily: F.body, fontSize: 14, color: C.textSub },
  stepDone: { color: C.text, fontWeight: '600' },
  notice: { fontFamily: F.label, fontSize: 12, color: C.textSub, textAlign: 'center', fontStyle: 'italic' },
  dashBtn: { backgroundColor: C.primary, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14, width: '100%', alignItems: 'center' },
  dashBtnTxt: { fontFamily: F.label, fontSize: 15, color: '#fff', fontWeight: '700' },
});

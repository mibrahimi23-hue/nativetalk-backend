import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn } from '@/components/ui/Btn';
import { C, F } from '@/constants/theme';

export default function OnboardingResult() {
  const { passed, score, level } = useLocalSearchParams<{ passed: string; score: string; level: string }>();
  const isPassed = passed === '1';
  const scoreNum = Number(score ?? 0);

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.content}>
        <View style={[s.iconCircle, { backgroundColor: isPassed ? '#D1FAE5' : '#FEE2E2' }]}>
          <Ionicons
            name={isPassed ? 'checkmark-circle' : 'close-circle'}
            size={64}
            color={isPassed ? C.success : C.danger}
          />
        </View>

        <Text style={s.title}>{isPassed ? 'Congratulations!' : 'Not Quite There'}</Text>
        <Text style={s.sub}>
          {isPassed
            ? `You passed the ${level ?? ''} level exam with a score of ${scoreNum}%. Your certificate has been submitted for admin review.`
            : `You scored ${scoreNum}% on the exam. A passing score of 70% is required. You can retake the exam or proceed without certification.`}
        </Text>

        {level ? (
          <View style={s.levelCard}>
            <Text style={s.levelLabel}>Level Certified</Text>
            <Text style={s.levelValue}>{level}</Text>
            <Text style={s.scoreText}>{scoreNum}% score</Text>
          </View>
        ) : null}

        <View style={s.actions}>
          <Btn label="Continue to Dashboard" onPress={() => router.replace('/tutor/onboarding/wait')} />
          {!isPassed && (
            <TouchableOpacity onPress={() => router.replace('/tutor/onboarding/exam')}>
              <Text style={s.retakeTxt}>Retake Exam</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 20 },
  iconCircle: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: F.heading, fontSize: 28, color: C.text, textAlign: 'center' },
  sub: { fontFamily: F.body, fontSize: 15, color: C.textSub, textAlign: 'center', lineHeight: 24 },
  levelCard: { backgroundColor: C.card, borderRadius: 20, padding: 24, alignItems: 'center', width: '100%', gap: 6 },
  levelLabel: { fontFamily: F.label, fontSize: 12, color: C.textSub, textTransform: 'uppercase', letterSpacing: 1 },
  levelValue: { fontFamily: F.heading, fontSize: 40, color: C.primary },
  scoreText: { fontFamily: F.body, fontSize: 14, color: C.textSub },
  actions: { width: '100%', gap: 12 },
  retakeTxt: { fontFamily: F.label, fontSize: 14, color: C.primary, fontWeight: '700', textAlign: 'center', paddingVertical: 8 },
});

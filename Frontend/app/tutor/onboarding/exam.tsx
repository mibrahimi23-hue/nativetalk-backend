import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn } from '@/components/ui/Btn';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

interface Exam {
  id: string;
  title: string;
  level: string;
  questions: Question[];
}

export default function OnboardingExam() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.exams.list() as Exam[];
      setExams(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const handleSubmit = async () => {
    if (!selectedExam || !user?.teacher_id) return;
    const unanswered = selectedExam.questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) return;
    setSubmitting(true);
    try {
      const result = await api.exams.submit(selectedExam.id, {
        teacher_id: user.teacher_id,
        answers: Object.entries(answers).map(([question_id, answer]) => ({ question_id, answer })),
      }) as { passed: boolean; score: number; level: string };
      router.replace({ pathname: '/tutor/onboarding/result', params: { passed: result.passed ? '1' : '0', score: String(Math.round((result.score ?? 0) * 100)), level: result.level ?? selectedExam.level } });
    } catch {
      router.replace('/tutor/onboarding/wait');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <ActivityIndicator color={C.primary} style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  if (!selectedExam) {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={s.scroll}>
          <Text style={s.step}>Step 2 of 3</Text>
          <Text style={s.title}>Level Certification</Text>
          <Text style={s.sub}>Take a short proficiency exam to certify your language level. Choose an exam to begin.</Text>
          {exams.length === 0 ? (
            <View style={s.noExams}>
              <Text style={s.noExamsTxt}>No exams available right now. You can skip and proceed.</Text>
              <Btn label="Skip for Now" onPress={() => router.replace('/tutor/onboarding/wait')} variant="secondary" />
            </View>
          ) : (
            exams.map(exam => (
              <TouchableOpacity key={exam.id} style={s.examCard} onPress={() => setSelectedExam(exam)} activeOpacity={0.88}>
                <View style={s.levelBadge}><Text style={s.levelTxt}>{exam.level}</Text></View>
                <View style={s.examInfo}>
                  <Text style={s.examTitle}>{exam.title}</Text>
                  <Text style={s.examSub}>{exam.questions?.length ?? 0} questions</Text>
                </View>
                <Text style={s.arrow}>→</Text>
              </TouchableOpacity>
            ))
          )}
          <Btn label="Skip for Now" onPress={() => router.replace('/tutor/onboarding/wait')} variant="ghost" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const progress = Object.keys(answers).length / selectedExam.questions.length;

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.examHeader}>
        <TouchableOpacity onPress={() => { setSelectedExam(null); setAnswers({}); }}>
          <Text style={s.backTxt}>← Back</Text>
        </TouchableOpacity>
        <Text style={s.examHeaderTitle}>{selectedExam.title}</Text>
        <Text style={s.progressTxt}>{Object.keys(answers).length}/{selectedExam.questions.length}</Text>
      </View>
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={s.qScroll}>
        {selectedExam.questions.map((q, idx) => (
          <View key={q.id} style={s.questionCard}>
            <Text style={s.qNum}>Question {idx + 1}</Text>
            <Text style={s.qText}>{q.question_text}</Text>
            {(['A', 'B', 'C', 'D'] as const).map(opt => {
              const val = q[`option_${opt.toLowerCase()}` as keyof Question] as string;
              const isSelected = answers[q.id] === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[s.option, isSelected && s.optionSelected]}
                  onPress={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                  activeOpacity={0.8}
                >
                  <View style={[s.optBullet, isSelected && s.optBulletSelected]}>
                    <Text style={[s.optBulletTxt, isSelected && { color: '#fff' }]}>{opt}</Text>
                  </View>
                  <Text style={[s.optTxt, isSelected && s.optTxtSelected]}>{val}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
        <Btn
          label="Submit Exam"
          onPress={handleSubmit}
          loading={submitting}
          disabled={Object.keys(answers).length < selectedExam.questions.length}
        />
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40, gap: 16 },
  step: { fontFamily: F.label, fontSize: 12, color: C.primary, fontWeight: '700', textTransform: 'uppercase' },
  title: { fontFamily: F.heading, fontSize: 28, color: C.text },
  sub: { fontFamily: F.body, fontSize: 14, color: C.textSub, lineHeight: 22 },
  noExams: { gap: 16, alignItems: 'center', paddingVertical: 20 },
  noExamsTxt: { fontFamily: F.body, fontSize: 14, color: C.textSub, textAlign: 'center' },
  examCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 16, padding: 16, gap: 14 },
  levelBadge: { width: 48, height: 48, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  levelTxt: { fontFamily: F.heading, fontSize: 14, color: '#fff' },
  examInfo: { flex: 1 },
  examTitle: { fontFamily: F.body, fontSize: 15, color: C.text, fontWeight: '600' },
  examSub: { fontFamily: F.label, fontSize: 12, color: C.textSub, marginTop: 3 },
  arrow: { fontFamily: F.body, fontSize: 18, color: C.primary },
  examHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.divider },
  backTxt: { fontFamily: F.label, fontSize: 14, color: C.primary },
  examHeaderTitle: { fontFamily: F.heading, fontSize: 16, color: C.text },
  progressTxt: { fontFamily: F.label, fontSize: 12, color: C.textSub },
  progressBar: { height: 4, backgroundColor: C.divider },
  progressFill: { height: 4, backgroundColor: C.primary },
  qScroll: { paddingHorizontal: 20, paddingTop: 16, gap: 16 },
  questionCard: { backgroundColor: C.card, borderRadius: 16, padding: 16, gap: 10 },
  qNum: { fontFamily: F.label, fontSize: 11, color: C.primary, fontWeight: '700', textTransform: 'uppercase' },
  qText: { fontFamily: F.body, fontSize: 15, color: C.text, lineHeight: 22, marginBottom: 4 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: C.border },
  optionSelected: { borderColor: C.primary, backgroundColor: C.primaryLight },
  optBullet: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  optBulletSelected: { backgroundColor: C.primary, borderColor: C.primary },
  optBulletTxt: { fontFamily: F.label, fontSize: 12, color: C.textSub, fontWeight: '700' },
  optTxt: { fontFamily: F.body, fontSize: 14, color: C.text, flex: 1 },
  optTxtSelected: { color: C.primary, fontWeight: '600' },
});

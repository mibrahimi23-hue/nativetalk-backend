import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Btn } from '@/components/ui/Btn';
import { Input } from '@/components/ui/Input';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

interface Question {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
}

const emptyQuestion = (): Question => ({
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_answer: 'A',
});

export default function AdminExamBuilder() {
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('A1');
  const [languageId, setLanguageId] = useState('1');
  const [questions, setQuestions] = useState<Question[]>([emptyQuestion()]);
  const [saving, setSaving] = useState(false);

  const updateQuestion = (idx: number, field: keyof Question, value: string) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const addQuestion = () => setQuestions(prev => [...prev, emptyQuestion()]);
  const removeQuestion = (idx: number) => {
    if (questions.length === 1) { Alert.alert('At least one question is required.'); return; }
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!title.trim()) { Alert.alert('Title required'); return; }
    for (const [i, q] of questions.entries()) {
      if (!q.question_text.trim() || !q.option_a.trim() || !q.option_b.trim() || !q.option_c.trim() || !q.option_d.trim()) {
        Alert.alert(`Question ${i + 1} is incomplete`); return;
      }
    }
    setSaving(true);
    try {
      await api.exams.create({
        title: title.trim(),
        level,
        language_id: Number(languageId) || 1,
        questions,
      });
      Alert.alert('Exam Created', `"${title}" has been published.`, [
        { text: 'OK', onPress: () => { setTitle(''); setQuestions([emptyQuestion()]); } },
      ]);
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Exam Builder" />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.card}>
          <Input label="Exam Title" value={title} onChangeText={setTitle} placeholder="e.g. English A1 Placement Test" />
          <Text style={s.label}>Language ID</Text>
          <TextInput style={s.smallInput} value={languageId} onChangeText={setLanguageId} keyboardType="numeric" placeholder="1" placeholderTextColor={C.textPlaceholder} />
          <Text style={s.label}>Level</Text>
          <View style={s.levelRow}>
            {LEVELS.map(l => (
              <TouchableOpacity key={l} style={[s.levelChip, level === l && s.levelActive]} onPress={() => setLevel(l)}>
                <Text style={[s.levelTxt, level === l && s.levelActiveTxt]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {questions.map((q, idx) => (
          <View key={idx} style={s.qCard}>
            <View style={s.qHeader}>
              <Text style={s.qTitle}>Question {idx + 1}</Text>
              <TouchableOpacity onPress={() => removeQuestion(idx)}>
                <Ionicons name="trash-outline" size={18} color={C.danger} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={s.qInput}
              placeholder="Question text"
              placeholderTextColor={C.textPlaceholder}
              value={q.question_text}
              onChangeText={v => updateQuestion(idx, 'question_text', v)}
              multiline
            />
            {(['A', 'B', 'C', 'D'] as const).map(opt => (
              <View key={opt} style={s.optRow}>
                <TouchableOpacity
                  style={[s.correctBtn, q.correct_answer === opt && s.correctBtnActive]}
                  onPress={() => updateQuestion(idx, 'correct_answer', opt)}
                >
                  <Text style={[s.correctBtnTxt, q.correct_answer === opt && s.correctBtnTxtActive]}>{opt}</Text>
                </TouchableOpacity>
                <TextInput
                  style={s.optInput}
                  placeholder={`Option ${opt}`}
                  placeholderTextColor={C.textPlaceholder}
                  value={q[`option_${opt.toLowerCase()}` as keyof Question] as string}
                  onChangeText={v => updateQuestion(idx, `option_${opt.toLowerCase()}` as keyof Question, v)}
                />
              </View>
            ))}
            <Text style={s.correctHint}>Tap letter to mark correct answer</Text>
          </View>
        ))}

        <TouchableOpacity style={s.addQBtn} onPress={addQuestion}>
          <Ionicons name="add-circle-outline" size={20} color={C.primary} />
          <Text style={s.addQTxt}>Add Question</Text>
        </TouchableOpacity>

        <Btn label={`Publish Exam (${questions.length} questions)`} onPress={handleSave} loading={saving} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 12, gap: 16 },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 16, gap: 12 },
  label: { fontFamily: F.label, fontSize: 13, color: C.textSub, fontWeight: '600' },
  smallInput: { borderWidth: 1.5, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontFamily: F.body, fontSize: 14, color: C.text, backgroundColor: C.bg },
  levelRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  levelChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.border },
  levelActive: { backgroundColor: C.primary, borderColor: C.primary },
  levelTxt: { fontFamily: F.label, fontSize: 13, color: C.textSub, fontWeight: '600' },
  levelActiveTxt: { color: '#fff' },
  qCard: { backgroundColor: C.card, borderRadius: 16, padding: 16, gap: 10 },
  qHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qTitle: { fontFamily: F.heading, fontSize: 14, color: C.text },
  qInput: { borderWidth: 1.5, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontFamily: F.body, fontSize: 14, color: C.text, minHeight: 70, textAlignVertical: 'top' },
  optRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  correctBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  correctBtnActive: { backgroundColor: C.success, borderColor: C.success },
  correctBtnTxt: { fontFamily: F.label, fontSize: 13, color: C.textSub, fontWeight: '700' },
  correctBtnTxtActive: { color: '#fff' },
  optInput: { flex: 1, borderWidth: 1.5, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontFamily: F.body, fontSize: 14, color: C.text },
  correctHint: { fontFamily: F.label, fontSize: 11, color: C.textSub, fontStyle: 'italic' },
  addQBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderWidth: 1.5, borderColor: C.primary, borderRadius: 14, borderStyle: 'dashed' },
  addQTxt: { fontFamily: F.label, fontSize: 14, color: C.primary, fontWeight: '700' },
});

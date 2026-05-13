import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn } from '@/components/ui/Btn';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
];

export default function OnboardingLanguage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggle = (code: string) => {
    setSelected(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };

  const handleNext = async () => {
    if (selected.length === 0) return;
    setSaving(true);
    try {
      await api.tutors.updateMe({ teaching_languages: selected.map(c => LANGUAGES.find(l => l.code === c)!.name) });
      router.replace('/tutor/onboarding/exam');
    } catch {
      router.replace('/tutor/onboarding/exam');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.top}>
          <Text style={s.step}>Step 1 of 3</Text>
          <Text style={s.title}>What language do you teach?</Text>
          <Text style={s.sub}>Select all the languages you can teach. We'll set up your profile accordingly.</Text>
        </View>

        <View style={s.grid}>
          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang.code}
              style={[s.langCard, selected.includes(lang.code) && s.langCardActive]}
              onPress={() => toggle(lang.code)}
              activeOpacity={0.85}
            >
              <Text style={s.flag}>{lang.flag}</Text>
              <Text style={[s.langName, selected.includes(lang.code) && s.langNameActive]}>{lang.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Btn
          label={`Continue${selected.length > 0 ? ` (${selected.length} selected)` : ''}`}
          onPress={handleNext}
          loading={saving}
          disabled={selected.length === 0}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40, gap: 24 },
  top: { gap: 10 },
  step: { fontFamily: F.label, fontSize: 12, color: C.primary, fontWeight: '700', textTransform: 'uppercase' },
  title: { fontFamily: F.heading, fontSize: 28, color: C.text },
  sub: { fontFamily: F.body, fontSize: 14, color: C.textSub, lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  langCard: { width: '47%', backgroundColor: C.card, borderRadius: 14, padding: 16, alignItems: 'center', gap: 8, borderWidth: 2, borderColor: 'transparent' },
  langCardActive: { borderColor: C.primary, backgroundColor: C.primaryLight },
  flag: { fontSize: 32 },
  langName: { fontFamily: F.body, fontSize: 14, color: C.text },
  langNameActive: { color: C.primary, fontWeight: '700' },
});

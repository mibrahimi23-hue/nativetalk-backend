import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { LevelBadge } from '@/components/ui/Badge';
import { Empty } from '@/components/ui/Empty';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface Material {
  id: string;
  title: string;
  type: string;
  level: string;
  description?: string;
  file_path: string;
  language_name?: string;
}

const TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  vocabulary_list: 'list-outline',
  grammar_guide: 'book-outline',
  practice_exercises: 'pencil-outline',
  audio_lesson: 'musical-notes-outline',
};

const TYPE_LABELS: Record<string, string> = {
  vocabulary_list: 'Vocabulary',
  grammar_guide: 'Grammar',
  practice_exercises: 'Practice',
  audio_lesson: 'Audio',
};

export default function StudentMaterials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.materials.forStudent(1, 'A1') as Material[];
      setMaterials(Array.isArray(data) ? data : []);
    } catch {}
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const openFile = async (path: string) => {
    const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';
    const url = `${baseUrl}/${path}`;
    try { await Linking.openURL(url); } catch {}
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Learning Materials" />
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
        ) : materials.length === 0 ? (
          <Empty icon="library-outline" title="No materials yet" subtitle="Materials shared by your tutors will appear here." />
        ) : (
          materials.map(m => (
            <TouchableOpacity key={m.id} style={s.card} onPress={() => openFile(m.file_path)} activeOpacity={0.85}>
              <View style={s.iconWrap}>
                <Ionicons name={TYPE_ICONS[m.type] ?? 'document-outline'} size={22} color={C.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.title} numberOfLines={1}>{m.title}</Text>
                <Text style={s.type}>{TYPE_LABELS[m.type] ?? m.type}</Text>
                {m.description ? <Text style={s.desc} numberOfLines={2}>{m.description}</Text> : null}
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <LevelBadge level={m.level} />
                <Ionicons name="download-outline" size={16} color={C.textSub} />
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 14 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1, shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  iconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: F.body, fontSize: 14, color: C.text, fontWeight: '600', marginBottom: 3 },
  type: { fontFamily: F.label, fontSize: 11, color: C.primary, fontWeight: '700', marginBottom: 3 },
  desc: { fontFamily: F.body, fontSize: 12, color: C.textSub },
});

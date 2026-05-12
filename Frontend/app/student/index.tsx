import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { StudentNav } from './_layout';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge, LevelBadge } from '@/components/ui/Badge';
import { Empty } from '@/components/ui/Empty';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface Tutor {
  id: string;
  user_id: string;
  full_name: string;
  language_name?: string;
  max_level?: string;
  hourly_rate?: number;
  profile_photo?: string;
  average_rating?: number;
  bio?: string;
}

interface Session {
  id: string;
  status: string;
  scheduled_at: string;
  level: string;
  teacher_name?: string;
}

const LEVELS = ['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function TutorCard({ tutor, saved, onToggle }: { tutor: Tutor; saved: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity style={tc.card} onPress={() => router.push({ pathname: '/student/tutor/[id]', params: { id: tutor.id } })} activeOpacity={0.88}>
      <Avatar uri={tutor.profile_photo} name={tutor.full_name} size={110} style={{ borderRadius: 0, width: '100%' }} />
      <TouchableOpacity style={tc.bookmark} onPress={onToggle} hitSlop={8}>
        <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={18} color={C.primary} />
      </TouchableOpacity>
      <View style={tc.body}>
        <Text style={tc.name} numberOfLines={1}>{tutor.full_name}</Text>
        <View style={tc.tags}>
          {tutor.language_name ? <View style={tc.tag}><Text style={tc.tagTxt}>{tutor.language_name}</Text></View> : null}
          {tutor.max_level ? <LevelBadge level={tutor.max_level} /> : null}
        </View>
        <Text style={tc.price}>{tutor.hourly_rate ? `€${tutor.hourly_rate}/hr` : 'Rate TBD'}</Text>
        {tutor.average_rating ? (
          <View style={tc.ratingRow}>
            <Ionicons name="star" size={12} color="#F5A623" />
            <Text style={tc.ratingTxt}>{tutor.average_rating.toFixed(1)}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const tc = StyleSheet.create({
  card: { width: 160, backgroundColor: C.card, borderRadius: 16, overflow: 'hidden', marginRight: 12, elevation: 3, shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  bookmark: { position: 'absolute', top: 8, right: 8, backgroundColor: C.card, borderRadius: 14, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  body: { padding: 10 },
  name: { fontFamily: F.body, fontSize: 14, color: C.text, fontWeight: '600', marginBottom: 6 },
  tags: { flexDirection: 'row', gap: 4, marginBottom: 6, flexWrap: 'wrap' },
  tag: { backgroundColor: C.divider, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  tagTxt: { fontFamily: F.label, fontSize: 10, color: C.textSub },
  price: { fontFamily: F.heading, fontSize: 14, color: C.primary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  ratingTxt: { fontFamily: F.label, fontSize: 11, color: C.textSub },
});

export default function StudentDashboard() {
  const { user } = useAuth();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevel] = useState('All');
  const [languages, setLanguages] = useState<{ id: number; name: string }[]>([]);
  const [langFilter, setLangFilter] = useState<number | null>(null);
  const searchRef = useRef<TextInput>(null);

  const load = useCallback(async () => {
    const [tutorRes, sessRes, langRes] = await Promise.allSettled([
      api.tutors.list() as Promise<{ items?: Tutor[] }>,
      api.sessions.mine() as Promise<Session[]>,
      api.search.languages() as Promise<{ languages?: { id: number; name: string }[] }>,
    ]);
    if (tutorRes.status === 'fulfilled') {
      const d = tutorRes.value as { items?: Tutor[] };
      setTutors(d?.items ?? (tutorRes.value as unknown as Tutor[]) ?? []);
    }
    if (sessRes.status === 'fulfilled')
      setSessions(Array.isArray(sessRes.value) ? sessRes.value : []);
    if (langRes.status === 'fulfilled') {
      const d = langRes.value as { languages?: { id: number; name: string }[] };
      setLanguages(Array.isArray(d?.languages) ? d.languages : []);
    }
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tutors.filter(t => {
      if (levelFilter !== 'All' && t.max_level !== levelFilter) return false;
      if (langFilter && (t as Record<string, unknown>).language_id !== langFilter) return false;
      if (!q) return true;
      return `${t.full_name} ${t.language_name ?? ''}`.toLowerCase().includes(q);
    });
  }, [tutors, search, levelFilter, langFilter]);

  const upcoming = sessions.filter(s => ['pending', 'confirmed'].includes(s.status))[0];
  const firstName = user?.full_name?.split(' ')[0] ?? 'there';
  const initials = user?.full_name?.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '?';

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />}
      >
        {/* Header */}
        <View style={s.topRow}>
          <View>
            <Text style={s.greeting}>Hello, {firstName}</Text>
            <Text style={s.greetSub}>Find your perfect tutor</Text>
          </View>
          <View style={s.topRight}>
            <TouchableOpacity style={s.iconBtn} onPress={() => router.push('/student/saved')}>
              <Ionicons name="bookmark-outline" size={20} color={C.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/student/profile')}>
              <Avatar uri={user?.profile_photo} name={user?.full_name ?? ''} size={38} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <TouchableOpacity style={s.searchBox} onPress={() => searchRef.current?.focus()} activeOpacity={1}>
          <Ionicons name="search-outline" size={18} color={C.textSub} style={{ marginRight: 8 }} />
          <TextInput
            ref={searchRef}
            style={s.searchInput}
            placeholder="Search tutors or languages…"
            placeholderTextColor={C.textPlaceholder}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={C.textSub} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Level chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips} style={{ marginBottom: 16 }}>
          {LEVELS.map(l => (
            <TouchableOpacity key={l} style={[s.chip, levelFilter === l && s.chipActive]} onPress={() => setLevel(l)}>
              <Text style={[s.chipText, levelFilter === l && s.chipTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Upcoming lesson banner */}
        {upcoming && !search && levelFilter === 'All' && (
          <TouchableOpacity style={s.banner} onPress={() => router.push({ pathname: '/student/lesson/[id]', params: { id: upcoming.id } })} activeOpacity={0.88}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={s.bannerIcon}>
                <Ionicons name="calendar" size={18} color={C.primary} />
              </View>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={s.bannerTitle}>Upcoming Lesson</Text>
                <Text style={s.bannerSub} numberOfLines={1}>
                  Level {upcoming.level} · {new Date(upcoming.scheduled_at).toLocaleDateString()} {new Date(upcoming.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
            <StatusBadge status={upcoming.status} />
          </TouchableOpacity>
        )}

        {/* Tutors */}
        <View style={s.secRow}>
          <Text style={s.secTitle}>{levelFilter !== 'All' ? `${levelFilter} Tutors` : 'Browse Tutors'}</Text>
          <TouchableOpacity onPress={() => router.push('/student/saved')}>
            <Text style={s.seeAll}>Saved</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={C.primary} size="large" style={{ marginVertical: 40 }} />
        ) : filtered.length === 0 ? (
          <Empty icon="search-outline" title="No tutors found" subtitle="Try adjusting your filters.">
            <TouchableOpacity onPress={() => { setSearch(''); setLevel('All'); }} style={{ marginTop: 12 }}>
              <Text style={{ fontFamily: F.label, fontSize: 13, color: C.primary }}>Clear filters</Text>
            </TouchableOpacity>
          </Empty>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
            {filtered.map(t => (
              <TutorCard key={t.id} tutor={t} saved={savedIds.includes(t.id)} onToggle={() => setSavedIds(p => p.includes(t.id) ? p.filter(x => x !== t.id) : [...p, t.id])} />
            ))}
          </ScrollView>
        )}

        {/* All tutors list */}
        {!loading && filtered.length > 0 && (
          <>
            <Text style={[s.secTitle, { marginTop: 24, marginBottom: 12 }]}>All Tutors</Text>
            {filtered.map(t => (
              <TouchableOpacity key={t.id + '_row'} style={s.row} onPress={() => router.push({ pathname: '/student/tutor/[id]', params: { id: t.id } })} activeOpacity={0.85}>
                <Avatar uri={t.profile_photo} name={t.full_name} size={50} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.rowName}>{t.full_name}</Text>
                  <Text style={s.rowMeta}>{t.language_name} · Level {t.max_level}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 3 }}>
                  <Text style={s.rowPrice}>{t.hourly_rate ? `€${t.hourly_rate}/hr` : '—'}</Text>
                  <Ionicons name="chevron-forward" size={16} color={C.textSub} />
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>
      <StudentNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 12 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontFamily: F.heading, fontSize: 22, color: C.text },
  greetSub: { fontFamily: F.body, fontSize: 13, color: C.textSub, marginTop: 2 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', elevation: 1, shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, paddingHorizontal: 14, marginBottom: 16 },
  searchInput: { flex: 1, fontFamily: F.body, fontSize: 15, color: C.text, paddingVertical: 12 },
  chips: { paddingRight: 20, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border },
  chipActive: { backgroundColor: C.primary, borderColor: C.primary },
  chipText: { fontFamily: F.label, fontSize: 13, color: C.textSub },
  chipTextActive: { color: C.textLight, fontWeight: '600' },
  banner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.primaryLight, borderRadius: 14, padding: 14, marginBottom: 20, borderWidth: 1.5, borderColor: C.primaryMid },
  bannerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  bannerTitle: { fontFamily: F.label, fontSize: 11, color: C.primary, fontWeight: '700', marginBottom: 2 },
  bannerSub: { fontFamily: F.body, fontSize: 13, color: C.text },
  secRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  secTitle: { fontFamily: F.heading, fontSize: 18, color: C.text },
  seeAll: { fontFamily: F.label, fontSize: 13, color: C.primary, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 12, marginBottom: 10, elevation: 1, shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  rowName: { fontFamily: F.body, fontSize: 15, color: C.text, fontWeight: '600' },
  rowMeta: { fontFamily: F.label, fontSize: 12, color: C.textSub, marginTop: 2 },
  rowPrice: { fontFamily: F.heading, fontSize: 14, color: C.primary },
});

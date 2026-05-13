import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Avatar } from '@/components/ui/Avatar';
import { LevelBadge } from '@/components/ui/Badge';
import { Btn } from '@/components/ui/Btn';
import { Empty } from '@/components/ui/Empty';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface TutorProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  bio?: string;
  profile_photo?: string;
  language_name?: string;
  max_level?: string;
  hourly_rate?: number;
  is_native?: boolean;
  is_certified?: boolean;
  is_verified?: boolean;
  average_rating?: number;
  total_reviews?: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  student_name?: string;
  created_at: string;
}

interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Stars({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons key={i} name={i <= rating ? 'star' : 'star-outline'} size={14} color="#F5A623" />
      ))}
    </View>
  );
}

export default function TutorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const [t, r, a] = await Promise.all([
        api.tutors.byId(id) as Promise<TutorProfile>,
        api.reviews.byTeacher(id) as Promise<Review[]>,
        api.availability.byTeacher(id) as Promise<AvailabilitySlot[]>,
      ]);
      setTutor(t);
      setReviews(Array.isArray(r) ? r : []);
      setSlots(Array.isArray(a) ? a : []);
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleBook = () => {
    if (!id) return;
    router.push({ pathname: '/student/book/[tutorId]', params: { tutorId: id } });
  };

  const handleChat = () => {
    if (!tutor) return;
    router.push({ pathname: '/student/direct/[userId]', params: { userId: tutor.user_id, name: tutor.full_name } });
  };

  if (loading) return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Tutor Profile" />
      <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
    </SafeAreaView>
  );

  if (!tutor) return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Tutor Profile" />
      <Empty icon="person-outline" title="Tutor not found" />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Tutor Profile" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={s.hero}>
          <Avatar uri={tutor.profile_photo} name={tutor.full_name} size={90} />
          <Text style={s.name}>{tutor.full_name}</Text>
          <View style={s.badges}>
            {tutor.language_name ? <View style={s.badge}><Text style={s.badgeTxt}>{tutor.language_name}</Text></View> : null}
            {tutor.max_level ? <LevelBadge level={tutor.max_level} /> : null}
            {tutor.is_native ? <View style={[s.badge, { backgroundColor: C.successBg }]}><Text style={[s.badgeTxt, { color: C.success }]}>Native</Text></View> : null}
            {tutor.is_verified ? <View style={[s.badge, { backgroundColor: C.primaryLight }]}><Text style={[s.badgeTxt, { color: C.primary }]}>Verified</Text></View> : null}
          </View>
          {tutor.average_rating ? (
            <View style={s.ratingRow}>
              <Stars rating={Math.round(tutor.average_rating)} />
              <Text style={s.ratingTxt}>{tutor.average_rating.toFixed(1)} ({tutor.total_reviews ?? 0} reviews)</Text>
            </View>
          ) : null}
          <Text style={s.rate}>{tutor.hourly_rate ? `€${tutor.hourly_rate} / hour` : 'Rate upon request'}</Text>
        </View>

        {/* Actions */}
        <View style={s.actions}>
          <Btn label="Book a Lesson" onPress={handleBook} style={{ flex: 1 }} />
          <TouchableOpacity style={s.chatBtn} onPress={handleChat}>
            <Ionicons name="chatbubble-outline" size={20} color={C.primary} />
          </TouchableOpacity>
        </View>

        {/* Bio */}
        {tutor.bio ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>About</Text>
            <Text style={s.bio}>{tutor.bio}</Text>
          </View>
        ) : null}

        {/* Qualifications */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Qualifications</Text>
          <View style={s.quals}>
            {[
              { label: 'Native speaker', value: tutor.is_native },
              { label: 'Certified teacher', value: tutor.is_certified },
              { label: 'Platform verified', value: tutor.is_verified },
            ].map(q => (
              <View key={q.label} style={s.qual}>
                <Ionicons name={q.value ? 'checkmark-circle' : 'close-circle-outline'} size={18} color={q.value ? C.success : C.textSub} />
                <Text style={[s.qualLabel, !q.value && { color: C.textSub }]}>{q.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Availability */}
        {slots.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Availability</Text>
            <View style={s.slotsWrap}>
              {slots.map(slot => (
                <View key={slot.id} style={s.slot}>
                  <Text style={s.slotDay}>{DAYS[slot.day_of_week]}</Text>
                  <Text style={s.slotTime}>{slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Reviews */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Reviews ({reviews.length})</Text>
          {reviews.length === 0 ? (
            <Text style={s.noReviews}>No reviews yet. Be the first!</Text>
          ) : (
            reviews.slice(0, 5).map(r => (
              <View key={r.id} style={s.review}>
                <View style={s.reviewTop}>
                  <Text style={s.reviewAuthor}>{r.student_name ?? 'Student'}</Text>
                  <Stars rating={r.rating} />
                </View>
                <Text style={s.reviewComment}>{r.comment}</Text>
                <Text style={s.reviewDate}>{new Date(r.created_at).toLocaleDateString()}</Text>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  hero: { alignItems: 'center', paddingVertical: 24 },
  name: { fontFamily: F.heading, fontSize: 22, color: C.text, marginTop: 12, marginBottom: 8 },
  badges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 },
  badge: { backgroundColor: C.divider, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  badgeTxt: { fontFamily: F.label, fontSize: 11, color: C.textSub, fontWeight: '700' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  ratingTxt: { fontFamily: F.label, fontSize: 12, color: C.textSub },
  rate: { fontFamily: F.heading, fontSize: 20, color: C.primary },
  actions: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  chatBtn: { width: 52, height: 52, borderRadius: 14, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: C.primaryMid },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: F.heading, fontSize: 16, color: C.text, marginBottom: 12 },
  bio: { fontFamily: F.body, fontSize: 14, color: C.textSub, lineHeight: 22 },
  quals: { gap: 10 },
  qual: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qualLabel: { fontFamily: F.body, fontSize: 14, color: C.text },
  slotsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: { backgroundColor: C.primaryLight, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: C.primaryMid },
  slotDay: { fontFamily: F.label, fontSize: 11, color: C.primary, fontWeight: '700', marginBottom: 2 },
  slotTime: { fontFamily: F.body, fontSize: 12, color: C.text },
  review: { backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: C.divider },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  reviewAuthor: { fontFamily: F.body, fontSize: 14, color: C.text, fontWeight: '600' },
  reviewComment: { fontFamily: F.body, fontSize: 13, color: C.textSub, lineHeight: 20, marginBottom: 6 },
  reviewDate: { fontFamily: F.label, fontSize: 11, color: C.textSub },
  noReviews: { fontFamily: F.body, fontSize: 13, color: C.textSub, textAlign: 'center', paddingVertical: 16 },
});

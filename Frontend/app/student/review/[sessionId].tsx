import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Btn } from '@/components/ui/Btn';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

export default function StudentReview() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { Alert.alert('Rating required', 'Please select a star rating.'); return; }
    if (!comment.trim()) { Alert.alert('Review required', 'Please write a short review.'); return; }
    if (!sessionId || !user?.id) return;

    setSubmitting(true);
    try {
      await api.reviews.create({
        session_id: sessionId,
        written_by: user.id,
        rating,
        comment: comment.trim(),
      });
      Alert.alert('Review submitted!', 'Thank you for your feedback.', [
        { text: 'OK', onPress: () => router.replace('/student/lessons') },
      ]);
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Review Your Tutor" />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        <Text style={s.prompt}>How was your lesson?</Text>
        <Text style={s.sub}>Your honest feedback helps other students find great tutors.</Text>

        {/* Star rating */}
        <View style={s.starsRow}>
          {[1, 2, 3, 4, 5].map(i => (
            <TouchableOpacity key={i} onPress={() => setRating(i)} hitSlop={8}>
              <Ionicons name={i <= rating ? 'star' : 'star-outline'} size={40} color={i <= rating ? '#F5A623' : C.border} />
            </TouchableOpacity>
          ))}
        </View>
        {rating > 0 && (
          <Text style={s.ratingLabel}>
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </Text>
        )}

        {/* Comment */}
        <Text style={s.fieldLabel}>Your review</Text>
        <TextInput
          style={s.textArea}
          placeholder="What did you like about this tutor? Any areas for improvement?"
          placeholderTextColor={C.textPlaceholder}
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={6}
          maxLength={500}
          textAlignVertical="top"
        />
        <Text style={s.charCount}>{comment.length}/500</Text>

        <Btn label="Submit Review" onPress={handleSubmit} loading={submitting} style={{ marginTop: 8 }} />
        <TouchableOpacity style={{ marginTop: 14, alignItems: 'center' }} onPress={() => router.replace('/student/lessons')}>
          <Text style={s.skipTxt}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  prompt: { fontFamily: F.heading, fontSize: 22, color: C.text, marginBottom: 6, textAlign: 'center' },
  sub: { fontFamily: F.body, fontSize: 13, color: C.textSub, textAlign: 'center', marginBottom: 28, lineHeight: 20 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 8 },
  ratingLabel: { fontFamily: F.body, fontSize: 15, color: C.primary, textAlign: 'center', marginBottom: 20, fontWeight: '600' },
  fieldLabel: { fontFamily: F.label, fontSize: 13, color: C.textSub, fontWeight: '600', marginBottom: 8 },
  textArea: { backgroundColor: C.card, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, padding: 14, fontFamily: F.body, fontSize: 14, color: C.text, height: 140 },
  charCount: { fontFamily: F.label, fontSize: 11, color: C.textSub, alignSelf: 'flex-end', marginTop: 4, marginBottom: 16 },
  skipTxt: { fontFamily: F.label, fontSize: 13, color: C.textSub },
});

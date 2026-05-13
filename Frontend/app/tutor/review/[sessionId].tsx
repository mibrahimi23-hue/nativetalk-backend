import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Btn } from '@/components/ui/Btn';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

export default function TutorReviewStudent() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (rating === 0) { Alert.alert('Rating required', 'Please select a star rating.'); return; }
    if (!sessionId) return;
    setSubmitting(true);
    try {
      await api.reviews.create({ session_id: sessionId, rating, comment: comment.trim() || undefined });
      Alert.alert('Review submitted', 'Thank you for your feedback!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Review Student" />
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.card}>
          <Text style={s.label}>How was the student's engagement?</Text>
          <View style={s.stars}>
            {[1, 2, 3, 4, 5].map(n => (
              <TouchableOpacity key={n} onPress={() => setRating(n)} activeOpacity={0.8}>
                <Ionicons
                  name={n <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={n <= rating ? C.primary : C.border}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={s.ratingText}>
            {rating === 0 ? 'Tap to rate' : ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </Text>
        </View>

        <View style={s.card}>
          <Text style={s.label}>Comments (optional)</Text>
          <TextInput
            style={s.textarea}
            placeholder="Share your experience with this student…"
            placeholderTextColor={C.textPlaceholder}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={5}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={s.charCount}>{comment.length}/500</Text>
        </View>

        <Btn label="Submit Review" onPress={submit} loading={submitting} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 16 },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 20 },
  label: { fontFamily: F.label, fontSize: 13, color: C.textSub, fontWeight: '600', marginBottom: 16 },
  stars: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 10 },
  ratingText: { fontFamily: F.body, fontSize: 16, color: C.text, textAlign: 'center', fontWeight: '600' },
  textarea: { fontFamily: F.body, fontSize: 14, color: C.text, borderWidth: 1.5, borderColor: C.border, borderRadius: 12, padding: 12, minHeight: 120 },
  charCount: { fontFamily: F.label, fontSize: 11, color: C.textSub, textAlign: 'right', marginTop: 6 },
});

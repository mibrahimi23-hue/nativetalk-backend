import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Empty } from '@/components/ui/Empty';
import { C, F } from '@/constants/theme';

export default function SavedTutors() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Saved Tutors" />
      <ScrollView contentContainerStyle={s.scroll}>
        <Empty
          icon="bookmark-outline"
          title="No saved tutors"
          subtitle="Tap the bookmark icon on a tutor's card to save them here."
        >
          <TouchableOpacity style={s.btn} onPress={() => router.replace('/student')}>
            <Text style={s.btnTxt}>Browse Tutors</Text>
          </TouchableOpacity>
        </Empty>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 20 },
  btn: { marginTop: 16, backgroundColor: C.primary, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10 },
  btnTxt: { fontFamily: F.label, fontSize: 14, color: C.textLight, fontWeight: '700' },
});

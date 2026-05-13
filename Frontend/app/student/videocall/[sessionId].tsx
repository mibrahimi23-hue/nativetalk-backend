import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

const STUDENT_OPTIONS = [
  { key: 'done', icon: 'star' as const, title: 'Lesson finished', desc: 'Rate the tutor and leave a review', route: '/student/review/[sessionId]' },
  { key: 'noshow', icon: 'person-remove-outline' as const, title: 'Tutor didn\'t join', desc: 'Reschedule or request a refund', route: null },
  { key: 'cancel', icon: 'close-circle-outline' as const, title: 'Cancel session', desc: 'Cancel without joining', route: null },
];

export default function StudentVideoCall() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOpts, setShowOpts] = useState(false);

  useEffect(() => {
    if (!sessionId) { setError('No session ID.'); setLoading(false); return; }
    (async () => {
      try {
        const [room, token] = await Promise.all([
          api.sessions.dailyRoom(sessionId) as Promise<{ url: string }>,
          api.sessions.dailyToken(sessionId) as Promise<{ token: string }>,
        ]);
        setRoomUrl(`${room.url}?t=${token.token}`);
      } catch (e) {
        setError((e as Error).message || 'Failed to start video call.');
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId]);

  const handleOption = async (opt: typeof STUDENT_OPTIONS[0]) => {
    setShowOpts(false);
    if (opt.key === 'done' && sessionId) {
      router.push({ pathname: '/student/review/[sessionId]', params: { sessionId } });
    } else if (opt.key === 'cancel' && sessionId) {
      try { await api.sessions.cancel(sessionId); } catch {}
      router.replace('/student/lessons');
    } else {
      router.replace('/student/lessons');
    }
  };

  if (loading) return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 60 }} />
      <Text style={s.loadTxt}>Setting up your call…</Text>
    </SafeAreaView>
  );

  if (error) return (
    <SafeAreaView style={[s.safe, s.center]} edges={['top']}>
      <Ionicons name="warning-outline" size={40} color={C.error} />
      <Text style={s.errTxt}>{error}</Text>
      <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
        <Text style={s.backBtnTxt}>Go back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.safe} edges={[]}>
      <WebView
        source={{ uri: roomUrl! }}
        style={{ flex: 1 }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        onError={() => setError('Failed to load video call.')}
      />

      <TouchableOpacity style={s.endBtn} onPress={() => setShowOpts(true)}>
        <Ionicons name="call" size={26} color={C.textLight} />
      </TouchableOpacity>

      <Modal visible={showOpts} transparent animationType="slide" onRequestClose={() => setShowOpts(false)}>
        <Pressable style={s.overlay} onPress={() => setShowOpts(false)}>
          <Pressable style={s.sheet} onPress={() => {}}>
            <Text style={s.sheetTitle}>End of session</Text>
            <Text style={s.sheetSub}>What happened with this session?</Text>
            {STUDENT_OPTIONS.map(opt => (
              <TouchableOpacity key={opt.key} style={s.optRow} onPress={() => handleOption(opt)}>
                <View style={s.optIcon}>
                  <Ionicons name={opt.icon} size={20} color={C.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.optTitle}>{opt.title}</Text>
                  <Text style={s.optDesc}>{opt.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={C.textSub} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={s.keepBtn} onPress={() => setShowOpts(false)}>
              <Text style={s.keepTxt}>Keep call open</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  center: { justifyContent: 'center', alignItems: 'center', gap: 14 },
  loadTxt: { fontFamily: F.body, fontSize: 14, color: C.textLight, textAlign: 'center', marginTop: 8 },
  errTxt: { fontFamily: F.body, fontSize: 14, color: C.error, textAlign: 'center', paddingHorizontal: 30 },
  backBtn: { backgroundColor: C.primary, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 20 },
  backBtnTxt: { fontFamily: F.label, fontSize: 14, color: C.textLight, fontWeight: '600' },
  endBtn: { position: 'absolute', bottom: 36, alignSelf: 'center', width: 66, height: 66, borderRadius: 33, backgroundColor: C.error, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: C.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 22, paddingHorizontal: 20, paddingBottom: 36 },
  sheetTitle: { fontFamily: F.heading, fontSize: 18, color: C.text, textAlign: 'center', marginBottom: 4 },
  sheetSub: { fontFamily: F.body, fontSize: 12, color: C.textSub, textAlign: 'center', marginBottom: 18 },
  optRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 14, marginBottom: 10, gap: 12, elevation: 1 },
  optIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  optTitle: { fontFamily: F.body, fontSize: 14, fontWeight: '600', color: C.text },
  optDesc: { fontFamily: F.body, fontSize: 12, color: C.textSub, marginTop: 2 },
  keepBtn: { height: 44, borderRadius: 22, backgroundColor: C.divider, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  keepTxt: { fontFamily: F.body, fontSize: 13, color: C.text, fontWeight: '600' },
});

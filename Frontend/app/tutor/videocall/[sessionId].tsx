import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

export default function TutorVideoCall() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const [callUrl, setCallUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEndModal, setShowEndModal] = useState(false);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      try {
        const [room, token] = await Promise.all([
          api.sessions.dailyRoom(sessionId) as Promise<{ url: string }>,
          api.sessions.dailyToken(sessionId) as Promise<{ token: string }>,
        ]);
        setCallUrl(`${room.url}?t=${token.token}`);
      } catch (e) {
        Alert.alert('Error', 'Could not load video call. Please try again.', [
          { text: 'Go back', onPress: () => router.back() },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId]);

  const handleEnd = (outcome: 'complete' | 'noshow' | 'cancel') => {
    Alert.alert(
      outcome === 'complete' ? 'Mark as Complete' : outcome === 'noshow' ? 'Student No-Show' : 'Cancel Session',
      outcome === 'complete' ? 'Confirm session was completed?' : outcome === 'noshow' ? 'Mark student as no-show?' : 'Cancel this session?',
      [
        { text: 'Back', style: 'cancel' },
        {
          text: 'Confirm',
          style: outcome === 'cancel' ? 'destructive' : 'default',
          onPress: async () => {
            setEnding(true);
            try {
              if (outcome === 'complete' && sessionId) await api.sessions.complete(sessionId);
              else if (outcome === 'cancel' && sessionId) await api.sessions.cancel?.(sessionId);
              router.replace({ pathname: '/tutor/session/[id]', params: { id: sessionId! } });
            } catch (e) {
              Alert.alert('Error', (e as Error).message);
              setEnding(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={s.center} edges={['top']}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={s.loadingTxt}>Connecting to session…</Text>
      </SafeAreaView>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.webWrap}>
          <Text style={s.webTitle}>Video Call</Text>
          <Text style={s.webSub}>Open the link below in your browser to join the session:</Text>
          <Text style={s.webUrl} selectable>{callUrl ?? ''}</Text>
          <TouchableOpacity style={s.endBtn} onPress={() => setShowEndModal(true)}>
            <Ionicons name="close-circle" size={20} color="#fff" />
            <Text style={s.endTxt}>End Session</Text>
          </TouchableOpacity>
        </View>
        <EndModal visible={showEndModal} onClose={() => setShowEndModal(false)} onEnd={handleEnd} ending={ending} />
      </SafeAreaView>
    );
  }

  return (
    <View style={s.full}>
      {callUrl ? (
        <WebView
          source={{ uri: callUrl }}
          style={s.webview}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          domStorageEnabled
        />
      ) : null}

      <TouchableOpacity style={s.endFloat} onPress={() => setShowEndModal(true)}>
        <Ionicons name="close-circle" size={24} color="#fff" />
        <Text style={s.endTxt}>End</Text>
      </TouchableOpacity>

      <EndModal visible={showEndModal} onClose={() => setShowEndModal(false)} onEnd={handleEnd} ending={ending} />
    </View>
  );
}

function EndModal({ visible, onClose, onEnd, ending }: { visible: boolean; onClose: () => void; onEnd: (o: 'complete' | 'noshow' | 'cancel') => void; ending: boolean }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={m.overlay}>
        <View style={m.sheet}>
          <Text style={m.title}>End Session</Text>
          <Text style={m.sub}>How did the session go?</Text>
          {ending ? <ActivityIndicator color={C.primary} style={{ marginVertical: 20 }} /> : (
            <>
              <TouchableOpacity style={m.optBtn} onPress={() => onEnd('complete')}>
                <Ionicons name="checkmark-circle-outline" size={22} color={C.success} />
                <Text style={m.optTxt}>Session Completed</Text>
              </TouchableOpacity>
              <TouchableOpacity style={m.optBtn} onPress={() => onEnd('noshow')}>
                <Ionicons name="person-remove-outline" size={22} color={C.warning} />
                <Text style={m.optTxt}>Student No-Show</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[m.optBtn, { borderBottomWidth: 0 }]} onPress={() => onEnd('cancel')}>
                <Ionicons name="close-circle-outline" size={22} color={C.danger} />
                <Text style={[m.optTxt, { color: C.danger }]}>Cancel Session</Text>
              </TouchableOpacity>
              <TouchableOpacity style={m.cancelBtn} onPress={onClose}>
                <Text style={m.cancelTxt}>Continue Call</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  full: { flex: 1, backgroundColor: '#000' },
  safe: { flex: 1, backgroundColor: C.bg },
  center: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingTxt: { fontFamily: F.body, fontSize: 15, color: C.textSub },
  webview: { flex: 1 },
  endFloat: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: C.danger, borderRadius: 30, paddingHorizontal: 24, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 8, elevation: 8 },
  endTxt: { fontFamily: F.label, fontSize: 14, color: '#fff', fontWeight: '700' },
  webWrap: { flex: 1, padding: 30, alignItems: 'center', justifyContent: 'center', gap: 16 },
  webTitle: { fontFamily: F.heading, fontSize: 24, color: C.text },
  webSub: { fontFamily: F.body, fontSize: 14, color: C.textSub, textAlign: 'center' },
  webUrl: { fontFamily: F.body, fontSize: 12, color: C.primary, textAlign: 'center', textDecorationLine: 'underline' },
  endBtn: { backgroundColor: C.danger, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20 },
});

const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  title: { fontFamily: F.heading, fontSize: 20, color: C.text, textAlign: 'center', marginBottom: 6 },
  sub: { fontFamily: F.body, fontSize: 14, color: C.textSub, textAlign: 'center', marginBottom: 20 },
  optBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.divider },
  optTxt: { fontFamily: F.body, fontSize: 16, color: C.text },
  cancelBtn: { marginTop: 16, alignItems: 'center', paddingVertical: 14, backgroundColor: C.bg, borderRadius: 14 },
  cancelTxt: { fontFamily: F.label, fontSize: 15, color: C.primary, fontWeight: '700' },
});

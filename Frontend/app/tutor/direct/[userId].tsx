import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  liked: boolean;
  is_read: boolean;
  created_at: string;
}

export default function TutorDirectMessage() {
  const { userId, name } = useLocalSearchParams<{ userId: string; name?: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    try {
      const msgs = await api.chat.conversation(userId) as Message[];
      setMessages(Array.isArray(msgs) ? msgs : []);
    } catch {}
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const uiMessages = useMemo(() =>
    messages.map(m => ({
      ...m,
      isSent: String(m.sender_id) === String(user?.id),
      time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })), [messages, user]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !userId || sending) return;
    setSending(true);
    try {
      const msg = await api.chat.send({ receiver_id: userId, content: text }) as Message;
      setMessages(prev => [...prev, msg]);
      setInput('');
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    } catch (e) {
      Alert.alert('Failed', (e as Error).message);
    } finally {
      setSending(false);
    }
  };

  const toggleLike = async (msgId: string) => {
    try {
      await api.chat.like(msgId);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, liked: !m.liked } : m));
    } catch {}
  };

  const displayName = name ? decodeURIComponent(name) : 'Chat';

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={C.text} />
        </TouchableOpacity>
        <View style={s.headerAvatar}>
          <Text style={s.headerAvatarTxt}>{displayName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={s.headerName} numberOfLines={1}>{displayName}</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollRef}
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {uiMessages.length === 0 && (
            <View style={s.empty}>
              <Ionicons name="chatbubbles-outline" size={40} color={C.textSub} />
              <Text style={s.emptyTxt}>Start the conversation</Text>
            </View>
          )}
          {uiMessages.map(msg => (
            <View key={msg.id} style={[s.row, msg.isSent && s.rowSent]}>
              <TouchableOpacity
                style={[s.bubble, msg.isSent ? s.bubbleSent : s.bubbleReceived]}
                onLongPress={() => toggleLike(msg.id)}
                activeOpacity={0.85}
              >
                <Text style={[s.bubbleTxt, msg.isSent && s.bubbleTxtSent]}>{msg.content}</Text>
                {msg.liked ? <Text style={s.likeHeart}>❤️</Text> : null}
              </TouchableOpacity>
              <Text style={[s.time, msg.isSent && { textAlign: 'right' }]}>{msg.time}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            placeholder="Type a message…"
            placeholderTextColor={C.textPlaceholder}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[s.sendBtn, (!input.trim() || sending) && s.sendDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || sending}
          >
            <Ionicons name="send" size={18} color={C.textLight} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.divider, gap: 10 },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  headerAvatarTxt: { fontFamily: F.heading, fontSize: 14, color: C.textLight },
  headerName: { flex: 1, fontFamily: F.body, fontSize: 16, color: C.text, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 16, gap: 8 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyTxt: { fontFamily: F.body, fontSize: 14, color: C.textSub },
  row: { maxWidth: '80%', alignSelf: 'flex-start' },
  rowSent: { alignSelf: 'flex-end' },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 2 },
  bubbleReceived: { backgroundColor: C.card, borderTopLeftRadius: 4, borderWidth: 1, borderColor: C.divider },
  bubbleSent: { backgroundColor: C.primary, borderTopRightRadius: 4 },
  bubbleTxt: { fontFamily: F.body, fontSize: 15, color: C.text, lineHeight: 20 },
  bubbleTxtSent: { color: C.textLight },
  likeHeart: { fontSize: 14, marginTop: 4, alignSelf: 'flex-end' },
  time: { fontFamily: F.label, fontSize: 10, color: C.textSub, paddingHorizontal: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 10, paddingBottom: 24, borderTopWidth: 1, borderTopColor: C.divider, backgroundColor: C.card, gap: 10 },
  input: { flex: 1, fontFamily: F.body, fontSize: 15, color: C.text, backgroundColor: C.bg, borderRadius: 20, borderWidth: 1.5, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 10, maxHeight: 120 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  sendDisabled: { backgroundColor: C.primaryMid },
});

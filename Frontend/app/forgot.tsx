import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { request } from '@/services/client';
import { Btn } from '@/components/ui/Btn';
import { Input } from '@/components/ui/Input';
import { C, F } from '@/constants/theme';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.includes('@')) { Alert.alert('Error', 'Enter a valid email address'); return; }
    setLoading(true);
    try {
      await request('/api/v1/auth/forgot-password', { method: 'POST', body: { email: email.trim().toLowerCase() } });
      setSent(true);
    } catch (err) {
      Alert.alert('Error', (err as Error).message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.center}>
          <View style={s.iconWrap}>
            <Ionicons name="mail-open-outline" size={36} color={C.primary} />
          </View>
          <Text style={s.title}>Check your email</Text>
          <Text style={s.sub}>We sent a password reset link to {email}. Follow the link to reset your password.</Text>
          <Btn label="Back to Login" onPress={() => router.replace('/login')} variant="secondary" style={{ marginTop: 24 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={s.back} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={C.text} />
          </TouchableOpacity>
          <View style={s.iconWrap}>
            <Ionicons name="lock-open-outline" size={32} color={C.primary} />
          </View>
          <Text style={s.title}>Reset password</Text>
          <Text style={s.sub}>Enter your email and we'll send you a link to reset your password.</Text>

          <View style={{ marginTop: 24 }}>
            <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" icon="mail-outline" />
            <Btn label="Send Reset Link" onPress={handleSubmit} loading={loading} style={{ marginTop: 8 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  back: { paddingVertical: 12, alignSelf: 'flex-start' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  iconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontFamily: F.heading, fontSize: 24, color: C.text, marginBottom: 10, textAlign: 'center' },
  sub: { fontFamily: F.body, fontSize: 14, color: C.textSub, textAlign: 'center', lineHeight: 22 },
});

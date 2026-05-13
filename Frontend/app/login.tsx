import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { Btn } from '@/components/ui/Btn';
import { Input } from '@/components/ui/Input';
import { C, F } from '@/constants/theme';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.includes('@')) e.email = 'Enter a valid email';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      router.replace('/');
    } catch (err) {
      Alert.alert('Login failed', (err as Error).message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={s.back} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={C.text} />
          </TouchableOpacity>

          <View style={s.header}>
            <View style={s.logo}>
              <Ionicons name="chatbubbles" size={28} color={C.textLight} />
            </View>
            <Text style={s.title}>Welcome back</Text>
            <Text style={s.subtitle}>Sign in to your NativeTalk account</Text>
          </View>

          <View style={s.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email}
              icon="mail-outline"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secure
              placeholder="Your password"
              error={errors.password}
              icon="lock-closed-outline"
            />

            <TouchableOpacity style={s.forgotLink} onPress={() => router.push('/forgot')}>
              <Text style={s.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Btn label="Sign In" onPress={handleLogin} loading={loading} style={{ marginTop: 8 }} />
          </View>

          <View style={s.footer}>
            <Text style={s.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/role')}>
              <Text style={s.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  back: { paddingVertical: 12, paddingRight: 12, alignSelf: 'flex-start' },
  header: { alignItems: 'center', marginBottom: 32, marginTop: 8 },
  logo: { width: 64, height: 64, borderRadius: 32, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: C.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  title: { fontFamily: F.heading, fontSize: 26, color: C.text, marginBottom: 6 },
  subtitle: { fontFamily: F.body, fontSize: 14, color: C.textSub, textAlign: 'center' },
  form: { gap: 0 },
  forgotLink: { alignSelf: 'flex-end', marginBottom: 8 },
  forgotText: { fontFamily: F.label, fontSize: 13, color: C.primary, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontFamily: F.body, fontSize: 14, color: C.textSub },
  footerLink: { fontFamily: F.body, fontSize: 14, color: C.primary, fontWeight: '700' },
});

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { Btn } from '@/components/ui/Btn';
import { Input } from '@/components/ui/Input';
import { C, F } from '@/constants/theme';

export default function RegisterStudent() {
  const { register } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form) => (v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.password.length < 8) e.password = 'At least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        full_name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: 'student',
        phone: form.phone.trim() || undefined,
      });
      router.replace('/student');
    } catch (err) {
      Alert.alert('Registration failed', (err as Error).message);
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

          <Text style={s.title}>Create student account</Text>
          <Text style={s.sub}>Start learning with native tutors today.</Text>

          <View style={{ gap: 0, marginTop: 24 }}>
            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Input label="First name" value={form.firstName} onChangeText={set('firstName')} placeholder="Ana" error={errors.firstName} autoCapitalize="words" />
              </View>
              <View style={{ flex: 1 }}>
                <Input label="Last name" value={form.lastName} onChangeText={set('lastName')} placeholder="García" error={errors.lastName} autoCapitalize="words" />
              </View>
            </View>
            <Input label="Email" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" error={errors.email} icon="mail-outline" />
            <Input label="Phone (optional)" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" placeholder="+1 234 567 8900" icon="call-outline" />
            <Input label="Password" value={form.password} onChangeText={set('password')} secure placeholder="Min 8 characters" error={errors.password} icon="lock-closed-outline" />
            <Input label="Confirm password" value={form.confirm} onChangeText={set('confirm')} secure placeholder="Repeat password" error={errors.confirm} icon="lock-closed-outline" />

            <Btn label="Create Account" onPress={handleRegister} loading={loading} style={{ marginTop: 8 }} />
          </View>

          <View style={s.footer}>
            <Text style={s.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={s.footerLink}>Sign In</Text>
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
  back: { paddingVertical: 12, alignSelf: 'flex-start' },
  title: { fontFamily: F.heading, fontSize: 26, color: C.text, marginBottom: 6 },
  sub: { fontFamily: F.body, fontSize: 14, color: C.textSub },
  row: { flexDirection: 'row', gap: 10 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontFamily: F.body, fontSize: 14, color: C.textSub },
  footerLink: { fontFamily: F.body, fontSize: 14, color: C.primary, fontWeight: '700' },
});

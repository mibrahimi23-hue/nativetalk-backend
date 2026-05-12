import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '@/constants/theme';

const { width } = Dimensions.get('window');
const BUBBLES = [
  { label: '🇪🇸 Spanish',   top: '14%', left: '4%'   },
  { label: '🇫🇷 French',    top: '8%',  right: '6%'  },
  { label: '🇩🇪 German',    top: '26%', right: '2%'  },
  { label: '🇯🇵 Japanese',  top: '40%', left: '2%'   },
  { label: '🇰🇷 Korean',    top: '54%', right: '4%'  },
  { label: '🇧🇷 Portuguese', top: '48%', left: '3%'  },
  { label: '🇮🇹 Italian',   top: '63%', right: '2%'  },
];

export default function Welcome() {
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {BUBBLES.map(b => (
            <View key={b.label} style={[s.bubble, { top: b.top, left: (b as Record<string, unknown>).left as string | undefined, right: (b as Record<string, unknown>).right as string | undefined }]}>
              <Text style={s.bubbleText}>{b.label}</Text>
            </View>
          ))}
        </View>

        <View style={s.logoWrap}>
          <View style={s.logo}>
            <Ionicons name="chatbubbles" size={40} color={C.textLight} />
          </View>
        </View>

        <Text style={s.brand}>NativeTalk</Text>
        <Text style={s.tagline}>Speak the world,{'\n'}one conversation at a time</Text>

        <View style={s.btns}>
          <TouchableOpacity style={s.primary} onPress={() => router.push('/role')} activeOpacity={0.85}>
            <Text style={s.primaryText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.secondary} onPress={() => router.push('/login')} activeOpacity={0.85}>
            <Text style={s.secondaryText}>I already have an account</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.footer}>Connect with native language tutors worldwide</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  bubble: { position: 'absolute', backgroundColor: C.card, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: C.primaryMid, shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  bubbleText: { fontFamily: F.label, fontSize: 12, color: C.text },
  logoWrap: { marginBottom: 20 },
  logo: { width: 88, height: 88, borderRadius: 44, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10 },
  brand: { fontFamily: F.heading, fontSize: 32, color: C.text, letterSpacing: 0.5, marginBottom: 8 },
  tagline: { fontFamily: F.body, fontSize: 16, color: C.textSub, textAlign: 'center', lineHeight: 24, marginBottom: 48 },
  btns: { width: '100%', gap: 12, marginBottom: 24 },
  primary: { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  primaryText: { fontFamily: F.body, fontSize: 16, fontWeight: '700', color: C.textLight, letterSpacing: 0.3 },
  secondary: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: C.border, backgroundColor: C.card },
  secondaryText: { fontFamily: F.body, fontSize: 15, color: C.primary, fontWeight: '600' },
  footer: { fontFamily: F.label, fontSize: 12, color: C.textSub, textAlign: 'center' },
});

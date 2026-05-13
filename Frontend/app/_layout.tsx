import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { C } from '@/constants/theme';

export default function RootLayout() {
  const scheme = useColorScheme();
  const [loaded] = useFonts({
    Domine:   require('../assets/fonts/Domine-Regular.ttf'),
    Outfit:   require('../assets/fonts/Outfit-Regular.ttf'),
    Epilogue: require('../assets/fonts/Epilogue-Regular.ttf'),
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg }}>
        <ActivityIndicator color={C.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="role" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="tutor-register" />
            <Stack.Screen name="forgot" />
            <Stack.Screen name="student" options={{ animation: 'fade' }} />
            <Stack.Screen name="tutor" options={{ animation: 'fade' }} />
            <Stack.Screen name="admin" options={{ animation: 'fade' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

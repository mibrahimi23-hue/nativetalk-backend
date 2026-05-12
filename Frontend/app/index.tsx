import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { C } from '@/constants/theme';

export default function Entry() {
  const { loading, isAuthenticated, role } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg }}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  if (!isAuthenticated) return <Redirect href="/welcome" />;
  if (role === 'teacher') return <Redirect href="/tutor" />;
  if (role === 'student') return <Redirect href="/student" />;
  if (role === 'admin') return <Redirect href="/admin" />;
  return <Redirect href="/welcome" />;
}

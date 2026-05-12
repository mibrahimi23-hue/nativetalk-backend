import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Btn } from '@/components/ui/Btn';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

export default function EditProfile() {
  const { user, refreshMe } = useAuth();
  const [name, setName] = useState(user?.full_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [timezone, setTimezone] = useState(user?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setName(user?.full_name ?? '');
    setPhone(user?.phone ?? '');
    setTimezone(user?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, [user]);

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Error', 'Name is required'); return; }
    setSaving(true);
    try {
      await api.users.updateMe({ full_name: name.trim(), phone: phone.trim(), timezone });
      await refreshMe();
      Alert.alert('Saved', 'Profile updated successfully.');
      router.back();
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handlePickPhoto = async () => {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!res.granted) { Alert.alert('Permission required', 'Please allow photo access.'); return; }
    const picked = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (picked.canceled) return;

    const asset = picked.assets[0];
    const fd = new FormData();
    fd.append('file', { uri: asset.uri, name: 'photo.jpg', type: 'image/jpeg' } as unknown as Blob);

    setUploading(true);
    try {
      await api.users.uploadPhoto(fd);
      await refreshMe();
    } catch (e) {
      Alert.alert('Upload failed', (e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Edit Profile" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={s.avatarWrap} onPress={handlePickPhoto} disabled={uploading}>
            <Avatar uri={user?.profile_photo} name={user?.full_name ?? ''} size={90} />
            <View style={s.editBadge}>
              <Ionicons name={uploading ? 'hourglass-outline' : 'camera-outline'} size={16} color={C.textLight} />
            </View>
          </TouchableOpacity>

          <Input label="Full name" value={name} onChangeText={setName} placeholder="Your name" autoCapitalize="words" icon="person-outline" />
          <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="+1 234 567 8900" keyboardType="phone-pad" icon="call-outline" />
          <Input label="Timezone" value={timezone} onChangeText={setTimezone} placeholder="UTC" icon="globe-outline" />

          <Btn label="Save Changes" onPress={handleSave} loading={saving} style={{ marginTop: 8 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  avatarWrap: { alignSelf: 'center', marginBottom: 28 },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.bg },
});

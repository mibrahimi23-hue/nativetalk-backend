import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Btn } from '@/components/ui/Btn';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Chinese', 'Japanese', 'Arabic', 'Other'];

export default function TutorEditProfile() {
  const { user, refreshMe } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name ?? '');
      setPhone(user.phone ?? '');
      setPhoto(user.profile_photo ?? null);
    }
  }, [user]);

  useEffect(() => {
    if (user?.teacher_id) {
      api.tutors.byId(user.teacher_id).then((d: any) => {
        if (d?.bio) setBio(d.bio);
        if (Array.isArray(d?.teaching_languages)) setSelectedLangs(d.teaching_languages);
      }).catch(() => {});
    }
  }, [user?.teacher_id]);

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Allow photo library access to change your photo.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (result.canceled || !result.assets?.[0]) return;
    setPhotoUploading(true);
    try {
      const asset = result.assets[0];
      const formData = new FormData();
      const ext = asset.uri.split('.').pop() ?? 'jpg';
      formData.append('file', { uri: asset.uri, name: `photo.${ext}`, type: `image/${ext}` } as any);
      const res = await api.users.uploadPhoto(formData) as { url?: string };
      if (res?.url) { setPhoto(res.url); await refreshMe(); }
    } catch (e) {
      Alert.alert('Upload failed', (e as Error).message);
    } finally {
      setPhotoUploading(false);
    }
  };

  const toggleLang = (lang: string) => {
    setSelectedLangs(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  };

  const handleSave = async () => {
    if (!fullName.trim()) { Alert.alert('Name required', 'Please enter your full name.'); return; }
    setSaving(true);
    try {
      await Promise.all([
        api.users.updateMe({ full_name: fullName.trim(), phone: phone.trim() || undefined }),
        api.tutors.updateMe({ bio: bio.trim() || undefined, teaching_languages: selectedLangs }),
      ]);
      await refreshMe();
      Alert.alert('Saved', 'Your profile has been updated.', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Edit Profile" />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.photoSection}>
          <TouchableOpacity onPress={pickPhoto} activeOpacity={0.85} style={s.photoWrap}>
            {photoUploading ? (
              <View style={s.photoPlaceholder}><ActivityIndicator color={C.primary} /></View>
            ) : photo ? (
              <Image source={{ uri: photo }} style={s.photo} />
            ) : (
              <View style={s.photoPlaceholder}>
                <Text style={s.photoInitial}>{(fullName || user?.full_name || 'T').charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <View style={s.photoBadge}><Text style={s.photoBadgeTxt}>Edit</Text></View>
          </TouchableOpacity>
        </View>

        <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Your full name" />
        <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="+1 234 567 8900" keyboardType="phone-pad" />

        <View style={s.bioWrap}>
          <Text style={s.bioLabel}>Bio</Text>
          <TextInput
            style={s.bioInput}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell students about yourself, your teaching style, experience…"
            placeholderTextColor={C.textPlaceholder}
            multiline
            numberOfLines={5}
            maxLength={600}
            textAlignVertical="top"
          />
          <Text style={s.charCount}>{bio.length}/600</Text>
        </View>

        <Text style={s.langLabel}>Teaching Languages</Text>
        <View style={s.langWrap}>
          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang}
              style={[s.langChip, selectedLangs.includes(lang) && s.langChipActive]}
              onPress={() => toggleLang(lang)}
            >
              <Text style={[s.langChipTxt, selectedLangs.includes(lang) && s.langChipTxtActive]}>{lang}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Btn label="Save Changes" onPress={handleSave} loading={saving} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 16 },
  photoSection: { alignItems: 'center', marginBottom: 8 },
  photoWrap: { position: 'relative' },
  photo: { width: 90, height: 90, borderRadius: 45 },
  photoPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  photoInitial: { fontFamily: F.heading, fontSize: 34, color: '#fff' },
  photoBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: C.primary, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 2, borderColor: C.bg },
  photoBadgeTxt: { fontFamily: F.label, fontSize: 11, color: '#fff', fontWeight: '700' },
  bioWrap: { gap: 6 },
  bioLabel: { fontFamily: F.label, fontSize: 13, color: C.textSub, fontWeight: '600' },
  bioInput: { fontFamily: F.body, fontSize: 14, color: C.text, borderWidth: 1.5, borderColor: C.border, borderRadius: 12, padding: 12, minHeight: 120 },
  charCount: { fontFamily: F.label, fontSize: 11, color: C.textSub, textAlign: 'right' },
  langLabel: { fontFamily: F.label, fontSize: 13, color: C.textSub, fontWeight: '600' },
  langWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.border },
  langChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  langChipTxt: { fontFamily: F.label, fontSize: 13, color: C.textSub },
  langChipTxtActive: { color: '#fff', fontWeight: '700' },
});

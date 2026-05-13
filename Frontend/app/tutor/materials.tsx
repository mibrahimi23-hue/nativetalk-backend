import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Btn } from '@/components/ui/Btn';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { C, F } from '@/constants/theme';

interface Material {
  id: string;
  title: string;
  file_url: string;
  file_type?: string;
  uploaded_at: string;
  level?: string;
}

export default function TutorMaterials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    if (!user?.teacher_id) return;
    try {
      const data = await api.materials.byTeacher(user.teacher_id) as Material[];
      setMaterials(Array.isArray(data) ? data : []);
    } catch {}
  }, [user?.teacher_id]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'video/*', 'audio/*', 'application/vnd.openxmlformats-officedocument.*'],
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.[0]) return;
      const file = result.assets[0];
      setUploading(true);
      const formData = new FormData();
      formData.append('file', { uri: file.uri, name: file.name, type: file.mimeType ?? 'application/octet-stream' } as any);
      formData.append('title', file.name.replace(/\.[^.]+$/, ''));
      await api.materials.upload(formData);
      await load();
    } catch (e) {
      Alert.alert('Upload failed', (e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (materialId: string) => {
    Alert.alert('Remove Material', 'Remove this material?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
        try { await api.materials.remove(materialId); await load(); }
        catch (e) { Alert.alert('Error', (e as Error).message); }
      }},
    ]);
  };

  const getIcon = (type?: string): any => {
    if (!type) return 'document-outline';
    if (type.includes('pdf')) return 'document-text-outline';
    if (type.includes('image')) return 'image-outline';
    if (type.includes('video')) return 'videocam-outline';
    if (type.includes('audio')) return 'musical-notes-outline';
    return 'document-outline';
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Materials" />
      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={C.primary} />}
      >
        <Btn label={uploading ? 'Uploading…' : 'Upload Material'} onPress={handleUpload} loading={uploading} />
        <Text style={s.hint}>PDF, images, audio, video files</Text>

        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
        ) : materials.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="library-outline" size={48} color={C.border} />
            <Text style={s.emptyTxt}>No materials uploaded yet</Text>
            <Text style={s.emptySub}>Upload study materials to share with your students</Text>
          </View>
        ) : (
          materials.map(mat => (
            <View key={mat.id} style={s.matCard}>
              <View style={s.matIcon}>
                <Ionicons name={getIcon(mat.file_type)} size={22} color={C.primary} />
              </View>
              <View style={s.matInfo}>
                <Text style={s.matTitle} numberOfLines={2}>{mat.title}</Text>
                <Text style={s.matDate}>{new Date(mat.uploaded_at).toLocaleDateString()}</Text>
                {mat.level && <Text style={s.matLevel}>Level: {mat.level}</Text>}
              </View>
              <View style={s.matActions}>
                <TouchableOpacity style={s.actionBtn} onPress={() => Linking.openURL(mat.file_url)}>
                  <Ionicons name="open-outline" size={18} color={C.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={s.actionBtn} onPress={() => handleRemove(mat.id)}>
                  <Ionicons name="trash-outline" size={18} color={C.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 16, gap: 12 },
  hint: { fontFamily: F.label, fontSize: 11, color: C.textSub, textAlign: 'center' },
  empty: { alignItems: 'center', paddingTop: 40, gap: 10 },
  emptyTxt: { fontFamily: F.body, fontSize: 15, color: C.text, fontWeight: '600' },
  emptySub: { fontFamily: F.body, fontSize: 13, color: C.textSub, textAlign: 'center' },
  matCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 14, gap: 12 },
  matIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  matInfo: { flex: 1, gap: 3 },
  matTitle: { fontFamily: F.body, fontSize: 14, color: C.text, fontWeight: '600' },
  matDate: { fontFamily: F.label, fontSize: 11, color: C.textSub },
  matLevel: { fontFamily: F.label, fontSize: 11, color: C.primary, fontWeight: '600' },
  matActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
});

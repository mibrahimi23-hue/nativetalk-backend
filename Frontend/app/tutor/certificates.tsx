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

interface Certificate {
  id: string;
  title: string;
  file_url: string;
  is_verified: boolean;
  uploaded_at: string;
}

export default function TutorCertificates() {
  const { user } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    if (!user?.teacher_id) return;
    try {
      const data = await api.certificates.byTeacher(user.teacher_id) as Certificate[];
      setCerts(Array.isArray(data) ? data : []);
    } catch {}
  }, [user?.teacher_id]);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'], copyToCacheDirectory: true });
      if (result.canceled || !result.assets?.[0]) return;
      const file = result.assets[0];
      setUploading(true);
      const formData = new FormData();
      formData.append('file', { uri: file.uri, name: file.name, type: file.mimeType ?? 'application/octet-stream' } as any);
      formData.append('title', file.name.replace(/\.[^.]+$/, ''));
      await api.certificates.upload(formData);
      await load();
    } catch (e) {
      Alert.alert('Upload failed', (e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (certId: string) => {
    Alert.alert('Remove Certificate', 'Remove this certificate?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
        try { await api.certificates.remove(certId); await load(); }
        catch (e) { Alert.alert('Error', (e as Error).message); }
      }},
    ]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScreenHeader title="Certificates" />
      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={C.primary} />}
      >
        <Btn label={uploading ? 'Uploading…' : 'Upload Certificate'} onPress={handleUpload} loading={uploading} />
        <Text style={s.hint}>Accepted: PDF, JPG, PNG</Text>

        {loading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
        ) : certs.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="document-outline" size={48} color={C.border} />
            <Text style={s.emptyTxt}>No certificates uploaded yet</Text>
          </View>
        ) : (
          certs.map(cert => (
            <View key={cert.id} style={s.certCard}>
              <View style={s.certIcon}>
                <Ionicons name="ribbon-outline" size={24} color={C.primary} />
              </View>
              <View style={s.certInfo}>
                <Text style={s.certTitle}>{cert.title}</Text>
                <Text style={s.certDate}>{new Date(cert.uploaded_at).toLocaleDateString()}</Text>
                <View style={[s.verifiedBadge, { backgroundColor: cert.is_verified ? C.success : C.warning }]}>
                  <Text style={s.verifiedTxt}>{cert.is_verified ? 'Verified' : 'Pending'}</Text>
                </View>
              </View>
              <View style={s.certActions}>
                <TouchableOpacity style={s.actionBtn} onPress={() => Linking.openURL(cert.file_url)}>
                  <Ionicons name="open-outline" size={18} color={C.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={s.actionBtn} onPress={() => handleRemove(cert.id)}>
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
  empty: { alignItems: 'center', paddingTop: 40, gap: 12 },
  emptyTxt: { fontFamily: F.body, fontSize: 14, color: C.textSub },
  certCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 14, padding: 14, gap: 12 },
  certIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  certInfo: { flex: 1, gap: 4 },
  certTitle: { fontFamily: F.body, fontSize: 14, color: C.text, fontWeight: '600' },
  certDate: { fontFamily: F.label, fontSize: 11, color: C.textSub },
  verifiedBadge: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginTop: 2 },
  verifiedTxt: { fontFamily: F.label, fontSize: 10, color: '#fff', fontWeight: '700' },
  certActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
});

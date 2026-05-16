import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { safeBack } from "@/hooks/use-safe-back";
import { useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function UploadCertificateExperienceScreen({ navigation }) {
  const { level } = useLocalSearchParams();
  const [certificateName, setCertificateName] = useState("");

  const handleUpload = () => {
    if (!certificateName) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    router.push({ pathname: "/availability", params: { level } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => safeBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upload Certificates</Text>
        </View>

        {/* Language Certificate Section */}
        <Text style={styles.sectionTitle}>Language Certificate</Text>
        <Text style={styles.sectionSubtitle}>
          Upload your certificate details
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Certificate Name"
          placeholderTextColor="#A89080"
          value={certificateName}
          onChangeText={setCertificateName}
        />

        {/* Upload Documents Section */}
        <Text style={styles.sectionTitle}>Upload documents</Text>

        {/* Certificate Row */}
        <View style={styles.fileRow}>
          <Text style={styles.fileRowText}>Certificate</Text>
          <Ionicons name="document-attach-outline" size={20} color="#A89080" />
        </View>

        {/* Notarized Certificate Row */}
        <View style={styles.fileRow}>
          <Text style={styles.fileRowText}>Notarized Certificate</Text>
          <Ionicons name="document-attach-outline" size={20} color="#A89080" />
        </View>

        {/* Education Proof Row */}
        <View style={styles.fileRow}>
          <Text style={styles.fileRowText}>Education Proof</Text>
          <Ionicons name="document-attach-outline" size={20} color="#A89080" />
        </View>

        {/* Notarized Education Proof Row */}
        <View style={styles.fileRow}>
          <Text style={styles.fileRowText}>Notarized Education Proof</Text>
          <Ionicons name="document-attach-outline" size={20} color="#A89080" />
        </View>
      </View>

      {/* Upload Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFBFA",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF9E6D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#28221B",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#28221B",
    marginBottom: 4,
    marginTop: 16,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#A89080",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#F2EAE3",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#28221B",
    marginBottom: 8,
  },
  fileRow: {
    backgroundColor: "#F2EAE3",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  fileRowText: {
    fontSize: 14,
    color: "#A89080",
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "android" ? 20 : 10,
    paddingTop: 10,
  },
  uploadButton: {
    backgroundColor: "#FF9E6D",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#FFFBFA",
    fontSize: 16,
    fontWeight: "600",
  },
});

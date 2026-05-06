import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { safeBack } from "@/hooks/use-safe-back";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function UploadCertificate() {
  const { level } = useLocalSearchParams();
  const [certificateName, setCertificateName] = useState("");

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={22} color="#FFFBFA" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Upload Certificates</Text>

        <View style={{ width: 30 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Language Certificate</Text>
        <Text style={styles.sectionSubtitle}>
          Upload your certificate details
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Certificate Name"
          placeholderTextColor="#8D7C74"
          value={certificateName}
          onChangeText={setCertificateName}
        />

        <Text style={styles.documentsTitle}>Upload documents</Text>

        <TouchableOpacity style={styles.uploadRow}>
          <Text style={styles.uploadRowText}>Certificate</Text>
          <Ionicons name="document-attach" size={18} color="#28221B" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadRow}>
          <Text style={styles.uploadRowText}>Notarized Certificate</Text>
          <Ionicons name="document-attach" size={18} color="#28221B" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={() =>
          router.push({ pathname: "/availability", params: { level } })
        }
      >
        <Text style={styles.uploadBtnText}>Upload</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFBFA",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 18,
    marginBottom: 18,
  },

  backBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FF9E6D",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Domine",
    color: "#28221B",
  },

  content: {
    paddingHorizontal: 28,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: "Domine",
    fontWeight: "700",
    color: "#28221B",
  },

  sectionSubtitle: {
    fontSize: 10,
    fontFamily: "Outfit",
    color: "#8D7C74",
    marginTop: 4,
    marginBottom: 10,
  },

  input: {
    height: 42,
    backgroundColor: "#F1E5E1",
    borderRadius: 11,
    paddingHorizontal: 14,
    fontSize: 12,
    fontFamily: "Outfit",
    color: "#28221B",
    marginBottom: 24,
  },

  documentsTitle: {
    fontSize: 18,
    fontFamily: "Domine",
    fontWeight: "700",
    color: "#28221B",
    marginBottom: 14,
  },

  uploadRow: {
    height: 38,
    backgroundColor: "#F1E5E1",
    borderRadius: 11,
    paddingHorizontal: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  uploadRowText: {
    fontSize: 12,
    fontFamily: "Outfit",
    color: "#8D7C74",
  },

  uploadBtn: {
    position: "absolute",
    bottom: 26,
    left: 28,
    right: 28,
    height: 40,
    backgroundColor: "#FF9E6D",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  uploadBtnText: {
    fontSize: 12,
    fontFamily: "Outfit",
    fontWeight: "600",
    color: "#FFFBFA",
  },
});

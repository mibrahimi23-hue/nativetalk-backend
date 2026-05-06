// app/tutor-certification.jsx

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { safeBack } from "@/hooks/use-safe-back";

const certifications = [
  {
    id: 1,
    label: "No certificate",
    icon: "checkmark-circle-outline",
  },
  {
    id: 2,
    label: "Language Certificate",
    icon: "ribbon-outline",
  },
  {
    id: 3,
    label: "LanguageCertificate +\nLanguage Teaching experience",
    icon: "people-outline",
  },
];

export default function TutorCertification() {
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack("/language-select-tutor")}>
          <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Tutor Certification</Text>
          <Text style={styles.headerSubtitle}>
            Choose the type of certification you have
          </Text>
        </View>
      </View>

      {/* Options */}
      <View style={styles.optionsList}>
        {certifications.map((cert, index) => (
          <View key={cert.id}>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => setSelected(cert.id)}
            >
              <Ionicons
                name={cert.icon}
                size={28}
                color={selected === cert.id ? "#FF9E6D" : "#DD8153"}
                style={styles.optionIcon}
              />
              <Text
                style={[
                  styles.optionLabel,
                  selected === cert.id && styles.optionLabelSelected,
                ]}
              >
                {cert.label}
              </Text>
            </TouchableOpacity>
            {index < certifications.length - 1 && (
              <View style={styles.divider} />
            )}
          </View>
        ))}
      </View>

      {/* Continue Button */}
      {selected && (
        <View style={styles.bottomBtn}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => {
              if (selected === 2) {
                router.push({
                  pathname: "/upload-certificate",
                  params: { level: "B2" },
                });
              } else if (selected === 3) {
                router.push({
                  pathname: "/upload-certificate-experience",
                  params: { level: "C2" },
                });
              } else {
                router.push({
                  pathname: "/language-examination",
                  params: { certId: selected },
                });
              }
            }}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFBFA",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFFBFA",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF9E6D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    marginTop: 2,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#28221B",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#777",
  },
  optionsList: {
    paddingHorizontal: 24,
    marginTop: 30,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 22,
  },
  optionIcon: {
    marginRight: 16,
    width: 32,
  },
  optionLabel: {
    fontSize: 16,
    color: "#28221B",
    flex: 1,
    lineHeight: 22,
  },
  optionLabelSelected: {
    fontWeight: "700",
    color: "#FF9E6D",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0EDEA",
  },
  bottomBtn: {
    position: "absolute",
    bottom: 34,
    left: 24,
    right: 24,
  },
  continueBtn: {
    backgroundColor: "#FF9E6D",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueBtnText: {
    color: "#FFFBFA",
    fontSize: 16,
    fontWeight: "600",
  },
});

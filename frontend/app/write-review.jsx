import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { safeBack } from "@/hooks/use-safe-back";

const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-"];

export default function WriteReview() {
  const [gradeIndex, setGradeIndex] = useState(1);
  const [text, setText] = useState("");

  const grade = GRADES[gradeIndex];

  const stepGrade = (delta) => {
    setGradeIndex((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next > GRADES.length - 1) return GRADES.length - 1;
      return next;
    });
  };

  const handleSend = () => {
    if (!text.trim()) {
      Alert.alert(
        "Write something",
        "Please add a short review before sending.",
      );
      return;
    }
    Alert.alert(
      "Review sent",
      `Grade: ${grade}\n\n${text.trim()}`,
      [{ text: "OK", onPress: () => router.replace("/tutor-dashboard") }],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack("/tutor-dashboard")}>
          <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
        </TouchableOpacity>
        <Text style={styles.header}>Write a Review</Text>
        <View style={{ width: 36 }} />
      </View>

      <Text style={styles.title}>How was the lesson?</Text>

      <Text style={styles.label}>Grade:</Text>

      <View style={styles.gradeRow}>
        <TouchableOpacity
          style={styles.gradeStep}
          onPress={() => stepGrade(1)}
          disabled={gradeIndex === 0}
        >
          <Text style={[styles.gradeStepText, gradeIndex === 0 && styles.gradeStepDisabled]}>
            -
          </Text>
        </TouchableOpacity>

        <Text style={styles.grade}>{grade}</Text>

        <TouchableOpacity
          style={styles.gradeStep}
          onPress={() => stepGrade(-1)}
          disabled={gradeIndex === GRADES.length - 1}
        >
          <Text
            style={[
              styles.gradeStepText,
              gradeIndex === GRADES.length - 1 && styles.gradeStepDisabled,
            ]}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Write a review for:</Text>

      <Text style={styles.user}>Marie Curie · Just now</Text>

      <TextInput
        style={styles.textArea}
        placeholder="Write review here..."
        placeholderTextColor="#7E6D66"
        value={text}
        onChangeText={setText}
        multiline
      />

      <TouchableOpacity style={styles.btn} onPress={handleSend}>
        <Text style={styles.btnText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBFA",
    paddingHorizontal: 22,
    paddingTop: 50,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF9E6D",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    fontFamily: "Domine",
    fontSize: 14,
    color: "#28221B",
  },

  title: {
    fontFamily: "Domine",
    fontSize: 20,
    color: "#28221B",
    marginBottom: 18,
  },

  label: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    marginBottom: 10,
  },

  gradeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
    marginBottom: 22,
  },

  gradeStep: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF1E8",
    alignItems: "center",
    justifyContent: "center",
  },

  gradeStepText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FF9E6D",
  },

  gradeStepDisabled: {
    color: "#E5C7B6",
  },

  grade: {
    fontSize: 36,
    fontFamily: "Domine",
    fontWeight: "700",
    color: "#28221B",
    minWidth: 64,
    textAlign: "center",
  },

  user: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#777",
    marginBottom: 14,
  },

  textArea: {
    height: 200,
    backgroundColor: "#F1E5E1",
    borderRadius: 14,
    padding: 14,
    textAlignVertical: "top",
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
  },

  btn: {
    position: "absolute",
    bottom: 24,
    left: 22,
    right: 22,
    height: 44,
    backgroundColor: "#FF9E6D",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#FFFBFA",
    fontWeight: "600",
  },
});

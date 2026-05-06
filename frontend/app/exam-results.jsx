import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { safeBack } from "@/hooks/use-safe-back";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const results = [
  { id: 1, subject: "Grammar", score: "67%" },
  { id: 2, subject: "Reading", score: "79%" },
  { id: 3, subject: "Writing", score: "85%" },
  { id: 4, subject: "Listening", score: "72%" },
];

export default function ExamResults() {
  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language Exam Results</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        {/* Congrats text */}
        <Text style={styles.congratsText}>
          Huge congrats! Seriously, reaching this level is a massive win. It's
          one thing to just "get by" in a language, but it's a whole different
          ballgame to actually nail the nuances and flow like a native speaker.
        </Text>

        {/* Results */}
        {results.map((result) => (
          <View key={result.id} style={styles.resultRow}>
            <Text style={styles.resultSubject}>{result.subject}</Text>
            <Text style={styles.resultScore}>{result.score}</Text>
          </View>
        ))}

        {/* Level */}
        <Text style={styles.levelText}>
          Language level you can teach:{"\n"}A2
        </Text>
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomBtn}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() =>
            router.push({
              pathname: "/availability",
              params: { level: "A2" },
            })
          }
        >
          <Text style={styles.continueBtnText}>Continue with account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFBFA",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 55,
    paddingBottom: 14,
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
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#28221B",
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  congratsText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    marginBottom: 32,
  },

  // Results
  resultRow: {
    marginBottom: 20,
  },
  resultSubject: {
    fontSize: 18,
    fontWeight: "700",
    color: "#28221B",
    marginBottom: 2,
  },
  resultScore: {
    fontSize: 14,
    color: "#777",
  },

  // Level
  levelText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#28221B",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 28,
  },

  // Bottom button
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

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { safeBack } from "@/hooks/use-safe-back";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const tabs = [
  { id: "reading", label: "Reading", icon: "book-outline" },
  { id: "speaking", label: "Speaking", icon: "mic-outline" },
  { id: "listening", label: "Listening Comprehension", icon: "ear-outline" },
  { id: "writing", label: "Writing Skills", icon: "create-outline" },
];

const questions = [
  {
    id: 1,
    question: "Question 1: .....",
    type: "mcq",
    options: ["Option A", "Option B", "Option C", "Option D"],
  },
  {
    id: 2,
    question: "Question 2",
    type: "mcq",
    options: ["Option A", "Option B", "Option C", "Option D"],
  },
  {
    id: 3,
    question: "Question 3:...",
    type: "text",
  },
  {
    id: 4,
    question: "Question 4:",
    type: "mcq",
    options: ["Option A", "Option B", "Option C", "Option D"],
  },
];

export default function LanguageExam() {
  const [activeTab, setActiveTab] = useState("reading");
  const [answers, setAnswers] = useState({});
  const [textAnswers, setTextAnswers] = useState({});

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language Examination</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabList}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={16}
              color={activeTab === tab.id ? "#FF9E6D" : "#777"}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.id && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Title */}
        <Text style={styles.sectionTitle}>
          {tabs.find((t) => t.id === activeTab)?.label}
        </Text>

        {/* Questions */}
        {questions.map((q) => (
          <View key={q.id} style={styles.questionBlock}>
            <Text style={styles.questionText}>{q.question}</Text>

            {q.type === "mcq" ? (
              q.options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.optionRow}
                  onPress={() => handleSelect(q.id, option)}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      answers[q.id] === option && styles.radioCircleSelected,
                    ]}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      answers[q.id] === option && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <TextInput
                style={styles.textInput}
                placeholder="Enter answer here"
                placeholderTextColor="#bbb"
                value={textAnswers[q.id] || ""}
                onChangeText={(text) =>
                  setTextAnswers((prev) => ({ ...prev, [q.id]: text }))
                }
              />
            )}
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Finish Exam Button */}
      <View style={styles.bottomBtn}>
        <TouchableOpacity
          style={styles.finishBtn}
          onPress={() => router.push("/exam-results")}
        >
          <Text style={styles.finishBtnText}>Finish exam</Text>
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

  // Tabs
  tabList: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 10,
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 14,
    color: "#777",
  },
  tabLabelActive: {
    color: "#FF9E6D",
    fontWeight: "600",
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Section title
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#28221B",
    marginBottom: 20,
  },

  // Questions
  questionBlock: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#28221B",
    marginBottom: 12,
  },

  // MCQ options
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#ddd",
  },
  radioCircleSelected: {
    backgroundColor: "#FF9E6D",
  },
  optionText: {
    fontSize: 15,
    color: "#28221B",
  },
  optionTextSelected: {
    color: "#FF9E6D",
    fontWeight: "600",
  },

  // Text input
  textInput: {
    backgroundColor: "#FFF0E8",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#28221B",
  },

  // Bottom button
  bottomBtn: {
    position: "absolute",
    bottom: 34,
    left: 24,
    right: 24,
  },
  finishBtn: {
    backgroundColor: "#FF9E6D",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
  },
  finishBtnText: {
    color: "#FFFBFA",
    fontSize: 16,
    fontWeight: "600",
  },
});

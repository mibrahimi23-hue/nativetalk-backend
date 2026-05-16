import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { safeBack } from "@/hooks/use-safe-back";

const SECTIONS = [
  { id: "reading", label: "Reading", icon: "book-outline" },
  { id: "speaking", label: "Speaking", icon: "mic-outline" },
  { id: "listening", label: "Listening", icon: "ear-outline" },
  { id: "writing", label: "Writing", icon: "create-outline" },
];

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const LANGUAGES = ["English", "Spanish", "German", "French", "Italian"];

export default function AdminExamBuilder() {
  const [language, setLanguage] = useState("English");
  const [level, setLevel] = useState("A1");
  const [picker, setPicker] = useState(null); // 'language' | 'level'
  const [activeSection, setActiveSection] = useState("reading");

  const [questions, setQuestions] = useState({
    reading: [],
    speaking: [],
    listening: [],
    writing: [],
  });

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [draftType, setDraftType] = useState("mcq"); // 'mcq' | 'text'
  const [draftPrompt, setDraftPrompt] = useState("");
  const [draftOptions, setDraftOptions] = useState(["", "", "", ""]);
  const [draftCorrect, setDraftCorrect] = useState(0);

  const sectionQuestions = questions[activeSection] || [];

  const totalQuestions = useMemo(
    () =>
      Object.values(questions).reduce((sum, list) => sum + list.length, 0),
    [questions],
  );

  const openNewQuestion = () => {
    setEditingQuestion(null);
    setDraftType("mcq");
    setDraftPrompt("");
    setDraftOptions(["", "", "", ""]);
    setDraftCorrect(0);
    setShowQuestionModal(true);
  };

  const openEditQuestion = (q) => {
    setEditingQuestion(q.id);
    setDraftType(q.type);
    setDraftPrompt(q.prompt);
    setDraftOptions(q.type === "mcq" ? [...q.options, "", "", "", ""].slice(0, 4) : ["", "", "", ""]);
    setDraftCorrect(q.type === "mcq" ? q.correctIndex ?? 0 : 0);
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = () => {
    if (!draftPrompt.trim()) {
      Alert.alert("Prompt required", "Please enter the question prompt.");
      return;
    }
    if (draftType === "mcq") {
      const filled = draftOptions.filter((o) => o.trim());
      if (filled.length < 2) {
        Alert.alert(
          "Add options",
          "Multiple choice questions need at least 2 options.",
        );
        return;
      }
    }

    const newQuestion = {
      id: editingQuestion ?? Date.now(),
      prompt: draftPrompt.trim(),
      type: draftType,
      ...(draftType === "mcq"
        ? {
            options: draftOptions
              .map((o) => o.trim())
              .filter((o, i) => o || i < 2),
            correctIndex: draftCorrect,
          }
        : {}),
    };

    setQuestions((prev) => {
      const list = prev[activeSection] || [];
      const next = editingQuestion
        ? list.map((q) => (q.id === editingQuestion ? newQuestion : q))
        : [...list, newQuestion];
      return { ...prev, [activeSection]: next };
    });

    setShowQuestionModal(false);
  };

  const removeQuestion = (id) => {
    Alert.alert("Remove question?", "This will delete the question.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () =>
          setQuestions((prev) => ({
            ...prev,
            [activeSection]: prev[activeSection].filter((q) => q.id !== id),
          })),
      },
    ]);
  };

  const handlePublish = () => {
    if (totalQuestions === 0) {
      Alert.alert("Empty exam", "Add at least one question before publishing.");
      return;
    }
    Alert.alert(
      "Exam published",
      `${language} ${level} exam saved with ${totalQuestions} question${
        totalQuestions === 1 ? "" : "s"
      }. Tutors will see it in the language exam template.`,
      [{ text: "OK", onPress: () => router.replace("/admin-dashboard") }],
    );
  };

  const pickerOptions =
    picker === "language" ? LANGUAGES : picker === "level" ? LEVELS : [];

  const choosePickerOption = (val) => {
    if (picker === "language") setLanguage(val);
    if (picker === "level") setLevel(val);
    setPicker(null);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack("/admin-dashboard")}>
          <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exam Builder</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.metaRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.metaLabel}>Language</Text>
            <TouchableOpacity
              style={styles.metaSelect}
              onPress={() => setPicker("language")}
            >
              <Text style={styles.metaSelectText}>{language}</Text>
              <Ionicons name="chevron-down" size={16} color="#7E6D66" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.metaLabel}>Level</Text>
            <TouchableOpacity
              style={styles.metaSelect}
              onPress={() => setPicker("level")}
            >
              <Text style={styles.metaSelectText}>{level}</Text>
              <Ionicons name="chevron-down" size={16} color="#7E6D66" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabList}>
          {SECTIONS.map((section) => {
            const active = activeSection === section.id;
            const count = questions[section.id]?.length ?? 0;
            return (
              <TouchableOpacity
                key={section.id}
                style={[styles.tabItem, active && styles.tabItemActive]}
                onPress={() => setActiveSection(section.id)}
              >
                <Ionicons
                  name={section.icon}
                  size={16}
                  color={active ? "#FF9E6D" : "#7E6D66"}
                />
                <Text
                  style={[styles.tabLabel, active && styles.tabLabelActive]}
                >
                  {section.label}
                </Text>
                {count > 0 && (
                  <View style={styles.tabCount}>
                    <Text style={styles.tabCountText}>{count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>
          {SECTIONS.find((s) => s.id === activeSection).label} questions
        </Text>

        {sectionQuestions.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="help-circle-outline" size={26} color="#A89080" />
            <Text style={styles.emptyTitle}>No questions yet</Text>
            <Text style={styles.emptyText}>
              Add a question to start building this section of the exam.
            </Text>
          </View>
        ) : (
          sectionQuestions.map((q, index) => (
            <View key={q.id} style={styles.questionCard}>
              <View style={styles.questionHead}>
                <Text style={styles.questionIndex}>Q{index + 1}</Text>
                <Text style={styles.questionType}>
                  {q.type === "mcq" ? "Multiple choice" : "Open answer"}
                </Text>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                  onPress={() => openEditQuestion(q)}
                  style={styles.iconBtn}
                >
                  <Ionicons name="pencil" size={16} color="#28221B" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeQuestion(q.id)}
                  style={styles.iconBtn}
                >
                  <Ionicons name="trash-outline" size={16} color="#DD8153" />
                </TouchableOpacity>
              </View>

              <Text style={styles.questionPrompt}>{q.prompt}</Text>

              {q.type === "mcq" &&
                q.options.map((opt, i) => (
                  <View key={i} style={styles.optionRow}>
                    <Ionicons
                      name={
                        i === q.correctIndex
                          ? "checkmark-circle"
                          : "ellipse-outline"
                      }
                      size={16}
                      color={i === q.correctIndex ? "#3FA66E" : "#A89080"}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        i === q.correctIndex && styles.optionTextCorrect,
                      ]}
                    >
                      {opt || `Option ${i + 1}`}
                    </Text>
                  </View>
                ))}
            </View>
          ))
        )}

        <TouchableOpacity style={styles.addBtn} onPress={openNewQuestion}>
          <Ionicons name="add" size={18} color="#FFFBFA" />
          <Text style={styles.addBtnText}>Add question</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {totalQuestions} total question{totalQuestions === 1 ? "" : "s"}
        </Text>
        <TouchableOpacity style={styles.publishBtn} onPress={handlePublish}>
          <Text style={styles.publishText}>Publish exam</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={picker !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPicker(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPicker(null)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>
              {picker === "language" ? "Select language" : "Select level"}
            </Text>
            <ScrollView style={{ maxHeight: 320 }}>
              {pickerOptions.map((opt) => {
                const selected =
                  (picker === "language" && opt === language) ||
                  (picker === "level" && opt === level);
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.sheetRow,
                      selected && styles.sheetRowSelected,
                    ]}
                    onPress={() => choosePickerOption(opt)}
                  >
                    <Text
                      style={[
                        styles.sheetRowText,
                        selected && styles.sheetRowTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                    {selected && (
                      <Ionicons name="checkmark" size={18} color="#FF9E6D" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showQuestionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQuestionModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowQuestionModal(false)}
        >
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>
              {editingQuestion ? "Edit question" : "New question"}
            </Text>

            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  draftType === "mcq" && styles.typeBtnActive,
                ]}
                onPress={() => setDraftType("mcq")}
              >
                <Text
                  style={[
                    styles.typeText,
                    draftType === "mcq" && styles.typeTextActive,
                  ]}
                >
                  Multiple choice
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  draftType === "text" && styles.typeBtnActive,
                ]}
                onPress={() => setDraftType("text")}
              >
                <Text
                  style={[
                    styles.typeText,
                    draftType === "text" && styles.typeTextActive,
                  ]}
                >
                  Open answer
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Prompt</Text>
            <TextInput
              style={styles.textArea}
              value={draftPrompt}
              onChangeText={setDraftPrompt}
              placeholder="What do you want to ask?"
              placeholderTextColor="#8D7C74"
              multiline
            />

            {draftType === "mcq" && (
              <>
                <Text style={styles.fieldLabel}>
                  Options (tap circle to mark the correct answer)
                </Text>
                {draftOptions.map((opt, i) => (
                  <View key={i} style={styles.optionEditRow}>
                    <TouchableOpacity
                      onPress={() => setDraftCorrect(i)}
                      hitSlop={6}
                    >
                      <Ionicons
                        name={
                          i === draftCorrect
                            ? "checkmark-circle"
                            : "ellipse-outline"
                        }
                        size={20}
                        color={i === draftCorrect ? "#3FA66E" : "#A89080"}
                      />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.optionInput}
                      value={opt}
                      onChangeText={(t) =>
                        setDraftOptions((prev) =>
                          prev.map((p, idx) => (idx === i ? t : p)),
                        )
                      }
                      placeholder={`Option ${i + 1}`}
                      placeholderTextColor="#8D7C74"
                    />
                  </View>
                ))}
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnGhost]}
                onPress={() => setShowQuestionModal(false)}
              >
                <Text style={styles.modalBtnGhostText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                onPress={handleSaveQuestion}
              >
                <Text style={styles.modalBtnPrimaryText}>
                  {editingQuestion ? "Save" : "Add"}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#FFFBFA" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 55,
    paddingBottom: 14,
    paddingHorizontal: 20,
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
    fontFamily: "Domine",
    fontSize: 16,
    color: "#28221B",
  },

  metaRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 8,
  },

  metaLabel: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
    marginBottom: 6,
  },

  metaSelect: {
    height: 42,
    backgroundColor: "#F1E5E1",
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  metaSelectText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    fontWeight: "600",
  },

  tabList: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: "#F3EDEA",
  },

  tabItemActive: {
    backgroundColor: "#FFF1E8",
    borderWidth: 1,
    borderColor: "#FF9E6D",
  },

  tabLabel: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
  },

  tabLabelActive: {
    color: "#FF9E6D",
    fontWeight: "700",
  },

  tabCount: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF9E6D",
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  tabCountText: {
    fontFamily: "Outfit",
    fontSize: 10,
    color: "#FFFBFA",
    fontWeight: "700",
  },

  sectionTitle: {
    fontFamily: "Domine",
    fontSize: 18,
    color: "#28221B",
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 38,
    paddingHorizontal: 24,
    backgroundColor: "#FFF1E8",
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 16,
  },

  emptyTitle: {
    fontFamily: "Domine",
    fontSize: 14,
    color: "#28221B",
    marginTop: 6,
  },

  emptyText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
    textAlign: "center",
    marginTop: 4,
  },

  questionCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0EDEA",
  },

  questionHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  questionIndex: {
    fontFamily: "Outfit",
    fontSize: 12,
    fontWeight: "700",
    color: "#FF9E6D",
  },

  questionType: {
    fontFamily: "Outfit",
    fontSize: 11,
    color: "#7E6D66",
    backgroundColor: "#F3EDEA",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3EDEA",
    alignItems: "center",
    justifyContent: "center",
  },

  questionPrompt: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#28221B",
    fontWeight: "600",
    marginBottom: 8,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },

  optionText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
  },

  optionTextCorrect: {
    color: "#3FA66E",
    fontWeight: "600",
  },

  addBtn: {
    marginTop: 8,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 44,
    backgroundColor: "#FF9E6D",
    borderRadius: 22,
  },

  addBtnText: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#FFFBFA",
    fontWeight: "600",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#FFFBFA",
    borderTopWidth: 1,
    borderTopColor: "#EFE6E1",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  footerText: {
    flex: 1,
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
  },

  publishBtn: {
    paddingHorizontal: 22,
    height: 42,
    borderRadius: 22,
    backgroundColor: "#3FA66E",
    alignItems: "center",
    justifyContent: "center",
  },

  publishText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#FFFBFA",
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(40, 34, 27, 0.45)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#FFFBFA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 22,
    paddingBottom: 32,
    maxHeight: "85%",
  },

  sheetTitle: {
    fontFamily: "Domine",
    fontSize: 16,
    color: "#28221B",
    textAlign: "center",
    marginBottom: 14,
  },

  sheetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 6,
  },

  sheetRowSelected: {
    backgroundColor: "#FFF1E8",
  },

  sheetRowText: {
    fontFamily: "Outfit",
    fontSize: 15,
    color: "#28221B",
  },

  sheetRowTextSelected: {
    color: "#FF9E6D",
    fontWeight: "700",
  },

  typeRow: {
    flexDirection: "row",
    backgroundColor: "#F1E5E1",
    borderRadius: 22,
    padding: 4,
    marginBottom: 16,
  },

  typeBtn: {
    flex: 1,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },

  typeBtnActive: {
    backgroundColor: "#FF9E6D",
  },

  typeText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
  },

  typeTextActive: {
    color: "#FFFBFA",
    fontWeight: "700",
  },

  fieldLabel: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    fontWeight: "600",
    marginBottom: 8,
  },

  textArea: {
    backgroundColor: "#F3EDEA",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#28221B",
    minHeight: 70,
    textAlignVertical: "top",
    marginBottom: 16,
  },

  optionEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },

  optionInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#F3EDEA",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
  },

  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  modalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  modalBtnGhost: {
    backgroundColor: "#F3EDEA",
  },

  modalBtnGhostText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    fontWeight: "600",
  },

  modalBtnPrimary: {
    backgroundColor: "#FF9E6D",
  },

  modalBtnPrimaryText: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#FFFBFA",
    fontWeight: "700",
  },
});

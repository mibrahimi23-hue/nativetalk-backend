import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
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
import { TutorBottomNav } from "@/components/tutor-bottom-nav";
import { useUser } from "@/contexts/user-context";
import { useSafeBack } from "@/hooks/use-safe-back";

const TABS = ["A1", "A2", "B1", "B2"];

export default function LanguageLessons() {
  const { lessons, materials, addMaterial, role } = useUser();
  const safeBack = useSafeBack();
  const [activeTab, setActiveTab] = useState("A1");
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialFile, setMaterialFile] = useState(null);
  const [lessonsState, setLessonsState] = useState("preview"); // 'preview' | 'expanded' | 'collapsed'
  const [materialsState, setMaterialsState] = useState("preview");

  const isTutor = role === "Tutor";

  const allVisibleLessons = lessons.filter(
    (l) => !l.level || l.level === activeTab,
  );

  const visibleLessons =
    lessonsState === "collapsed"
      ? []
      : lessonsState === "expanded"
      ? allVisibleLessons
      : allVisibleLessons.slice(0, 3);

  const visibleMaterials =
    materialsState === "collapsed"
      ? []
      : materialsState === "expanded"
      ? materials
      : materials.slice(0, 3);

  const cycleLessonsState = () => {
    setLessonsState((prev) =>
      prev === "preview" ? "expanded" : prev === "expanded" ? "collapsed" : "preview",
    );
  };

  const cycleMaterialsState = () => {
    setMaterialsState((prev) =>
      prev === "preview" ? "expanded" : prev === "expanded" ? "collapsed" : "preview",
    );
  };

  const lessonsBtnLabel =
    lessonsState === "preview"
      ? `Show all (${allVisibleLessons.length})`
      : lessonsState === "expanded"
      ? "Hide all"
      : "Show preview";

  const materialsBtnLabel =
    materialsState === "preview"
      ? `Show all (${materials.length})`
      : materialsState === "expanded"
      ? "Hide all"
      : "Show preview";

  const lessonsChevron =
    lessonsState === "preview"
      ? "chevron-down"
      : lessonsState === "expanded"
      ? "chevron-up"
      : "chevron-forward";

  const materialsChevron =
    materialsState === "preview"
      ? "chevron-down"
      : materialsState === "expanded"
      ? "chevron-up"
      : "chevron-forward";

  const handlePickFile = () => {
    setMaterialFile({
      name: `material-${Date.now()}.pdf`,
      pickedAt: Date.now(),
    });
  };

  const handleSaveMaterial = () => {
    if (!materialTitle.trim()) {
      Alert.alert("Title required", "Please enter a title for the material.");
      return;
    }
    if (!materialFile) {
      Alert.alert(
        "Document required",
        "Please attach a document for the material.",
      );
      return;
    }
    addMaterial({ title: materialTitle.trim(), file: materialFile });
    setMaterialTitle("");
    setMaterialFile(null);
    setShowMaterialModal(false);
  };

  const closeModal = () => {
    setShowMaterialModal(false);
    setMaterialTitle("");
    setMaterialFile(null);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language Lessons</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lessons</Text>
        </View>

        {allVisibleLessons.length === 0 && (
          <Text style={styles.emptyText}>No lessons for this level yet.</Text>
        )}

        {visibleLessons.map((lesson, index) => (
          <View key={lesson.id}>
            <View style={styles.lessonRow}>
              {lesson.status === "completed" ? (
                <View style={styles.completedSquare} />
              ) : (
                <View style={styles.emptySquare} />
              )}

              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>

                {lesson.status === "completed" ? (
                  <Text style={styles.completedText}>Completed</Text>
                ) : (
                  <Text style={styles.lessonMeta}>
                    {lesson.date} {lesson.time}
                  </Text>
                )}
              </View>

              {lesson.status === "join" && (
                <TouchableOpacity
                  style={styles.joinBtn}
                  onPress={() => router.push("/videocall")}
                >
                  <Text style={styles.joinText}>Join</Text>
                </TouchableOpacity>
              )}
            </View>

            {index < visibleLessons.length - 1 && (
              <View style={styles.divider} />
            )}
          </View>
        ))}

        {allVisibleLessons.length > 3 && (
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={cycleLessonsState}
          >
            <Ionicons name={lessonsChevron} size={16} color="#FFFBFA" />
            <Text style={styles.toggleText}>{lessonsBtnLabel}</Text>
          </TouchableOpacity>
        )}

        {isTutor && (
          <View style={styles.actionRow}>
            
            {visibleLessons.length !== 0 && (
              <TouchableOpacity
              style={styles.cancelBtn}
                onPress={() => router.push("/cancel-session")}
              >
                <Text style={styles.cancelText}>Cancel Upcoming lesson</Text>
              </TouchableOpacity>
            )}
            

            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => router.push("/add-lesson")}
            >
              <Text style={styles.addText}>+ Add Lesson</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.materialsHeader}>
          <Text style={styles.sectionTitle}>Materials</Text>
        </View>

        {materials.length === 0 && (
          <Text style={styles.emptyText}>No materials yet.</Text>
        )}

        {visibleMaterials.map((mat, index) => (
          <View key={mat.id}>
            <View style={styles.materialRow}>
              <Text style={styles.materialTitle}>{mat.title}</Text>
              <TouchableOpacity style={styles.downloadIcon}>
                <Ionicons name="download-outline" size={20} color="#28221B" />
              </TouchableOpacity>
            </View>

            {index < visibleMaterials.length - 1 && <View style={styles.divider} />}
          </View>
        ))}

        {materials.length > 3 && (
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={cycleMaterialsState}
          >
            <Ionicons name={materialsChevron} size={16} color="#FFFBFA" />
            <Text style={styles.toggleText}>{materialsBtnLabel}</Text>
          </TouchableOpacity>
        )}

        {isTutor && (
          <TouchableOpacity
            style={[styles.addBtn, { marginTop: 24 }]}
            onPress={() => setShowMaterialModal(true)}
          >
            <Text style={styles.addText}>+ Add Material</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      <TutorBottomNav />

      <Modal
        visible={showMaterialModal}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Add Material</Text>

            <Text style={styles.modalLabel}>Title</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Chapter 1 Vocabulary"
              placeholderTextColor="#8D7C74"
              value={materialTitle}
              onChangeText={setMaterialTitle}
            />

            <Text style={styles.modalLabel}>Document</Text>
            <TouchableOpacity
              style={styles.modalUpload}
              onPress={handlePickFile}
            >
              <Ionicons
                name={materialFile ? "document-attach" : "cloud-upload-outline"}
                size={20}
                color="#FF9E6D"
              />
              <Text style={styles.modalUploadText}>
                {materialFile
                  ? materialFile.name
                  : "Tap to attach a document"}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnGhost]}
                onPress={closeModal}
              >
                <Text style={styles.modalBtnGhostText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                onPress={handleSaveMaterial}
              >
                <Text style={styles.modalBtnPrimaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    fontFamily: "Domine",
    fontSize: 17,
    color: "#28221B",
  },

  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  tabItem: {
    marginRight: 24,
    paddingBottom: 8,
    alignItems: "center",
  },

  tabText: {
    fontFamily: "Outfit",
    fontSize: 15,
    color: "#aaa",
  },

  tabTextActive: {
    color: "#28221B",
    fontWeight: "700",
  },

  tabUnderline: {
    position: "absolute",
    bottom: 0,
    height: 2,
    width: "100%",
    backgroundColor: "#28221B",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  sectionTitle: {
    fontFamily: "Domine",
    fontSize: 20,
    color: "#28221B",
    marginBottom: 16,
  },

  emptyText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#A89080",
    marginBottom: 14,
  },

  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  completedSquare: {
    width: 14,
    height: 14,
    borderRadius: 2,
    backgroundColor: "#DD8153",
    marginRight: 12,
  },

  emptySquare: {
    width: 14,
    height: 14,
    marginRight: 12,
  },

  lessonInfo: {
    flex: 1,
  },

  lessonTitle: {
    fontFamily: "Outfit",
    fontSize: 15,
    color: "#28221B",
    fontWeight: "600",
  },

  completedText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#aaa",
    marginTop: 3,
  },

  lessonMeta: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },

  joinBtn: {
    backgroundColor: "#FF9E6D",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 25,
  },

  joinText: {
    fontFamily: "Outfit",
    color: "#FFFBFA",
    fontSize: 15,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
  },

  actionRow: {
    marginTop: 24,
    marginBottom: 32,
    gap: 12,
  },

  cancelBtn: {
    backgroundColor: "#DD8153",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },

  cancelText: {
    fontFamily: "Outfit",
    color: "#FFFBFA",
    fontSize: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  toggleBtn: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FF9E6D",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 14,
    marginBottom: 8,
  },

  toggleText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#FFFBFA",
    fontWeight: "600",
  },

  addBtn: {
    backgroundColor: "#FF9E6D",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignSelf: "center",
  },

  addText: {
    fontFamily: "Outfit",
    color: "#FFFBFA",
    fontSize: 15,
  },

  materialsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },

  materialRow: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  materialTitle: {
    fontFamily: "Outfit",
    fontSize: 15,
    color: "#28221B",
  },

  downloadIcon: {
    padding: 2,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingBottom: 10,
  },

  navItem: {
    padding: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(40, 34, 27, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  modalCard: {
    width: "100%",
    backgroundColor: "#FFFBFA",
    borderRadius: 18,
    padding: 22,
  },

  modalTitle: {
    fontFamily: "Domine",
    fontSize: 18,
    color: "#28221B",
    marginBottom: 16,
    textAlign: "center",
  },

  modalLabel: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    marginBottom: 6,
  },

  modalInput: {
    backgroundColor: "#F3EDEA",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#28221B",
    marginBottom: 16,
  },

  modalUpload: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3EDEA",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
    marginBottom: 22,
  },

  modalUploadText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    flex: 1,
  },

  modalActions: {
    flexDirection: "row",
    gap: 10,
  },

  modalBtn: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  modalBtnGhost: {
    backgroundColor: "#F3EDEA",
  },

  modalBtnGhostText: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#28221B",
  },

  modalBtnPrimary: {
    backgroundColor: "#FF9E6D",
  },

  modalBtnPrimaryText: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#FFFBFA",
    fontWeight: "600",
  },
});

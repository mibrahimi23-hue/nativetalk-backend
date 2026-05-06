import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "@/contexts/user-context";
import { useSafeBack } from "@/hooks/use-safe-back";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIME_SLOTS = [
  "9:00 AM to 11:00 AM",
  "11:00 AM to 1:00 PM",
  "1:00 PM to 3:00 PM",
  "3:00 PM to 5:00 PM",
  "5:00 PM to 7:00 PM",
  "7:00 PM to 9:00 PM",
];

export default function CancelSession() {
  const { lessonId } = useLocalSearchParams();
  const { lessons, rescheduleLesson, cancelLesson } = useUser();
  const safeBack = useSafeBack();

  const targetLesson = useMemo(() => {
    if (lessonId) return lessons.find((l) => String(l.id) === String(lessonId));
    return lessons.find(
      (l) => l.status === "upcoming" || l.status === "join",
    );
  }, [lessonId, lessons]);

  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [picker, setPicker] = useState(null);

  const options = picker === "day" ? DAYS : picker === "time" ? TIME_SLOTS : [];

  const choose = (val) => {
    if (picker === "day") setDay(val);
    if (picker === "time") setTime(val);
    setPicker(null);
  };

  const handleReschedule = () => {
    if (!day || !time) {
      Alert.alert(
        "Pick a day and time",
        "Please select both a day and a time slot to reschedule.",
      );
      return;
    }
    if (targetLesson) {
      rescheduleLesson(targetLesson.id, day, time);
    }
    Alert.alert(
      "Lesson Rescheduled",
      `Your lesson is now on ${day} - ${time}.`,
      [{ text: "OK", onPress: () => safeBack("/tutor-dashboard") }],
    );
  };

  const handleCancelOnly = () => {
    if (!targetLesson) {
      safeBack("/tutor-dashboard");
      return;
    }
    Alert.alert(
      "Cancel lesson?",
      "This will cancel the upcoming lesson.",
      [
        { text: "Keep lesson", style: "cancel" },
        {
          text: "Cancel lesson",
          style: "destructive",
          onPress: () => {
            cancelLesson(targetLesson.id);
            safeBack("/tutor-dashboard");
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
        </TouchableOpacity>
        <Text style={styles.header}>Cancel session</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {targetLesson ? (
          <View style={styles.lessonCard}>
            <Text style={styles.lessonCardTitle}>{targetLesson.title}</Text>
            <Text style={styles.lessonCardMeta}>
              {targetLesson.date || "TBD"} {targetLesson.time || ""}
            </Text>
          </View>
        ) : null}

        <Text style={styles.info}>
          For cancelling session you have the possibility to:
        </Text>

        <Text style={styles.label}>Reschedule</Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setPicker("day")}
          activeOpacity={0.7}
        >
          <Text style={[styles.placeholder, day && styles.value]}>
            {day || "Select Day"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#7E6D66" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setPicker("time")}
          activeOpacity={0.7}
        >
          <Text style={[styles.placeholder, time && styles.value]}>
            {time || "Select Time"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#7E6D66" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, (!day || !time) && styles.saveBtnDisabled]}
          disabled={!day || !time}
          onPress={handleReschedule}
        >
          <Text style={styles.saveText}>Reschedule lesson</Text>
        </TouchableOpacity>

        <Text style={[styles.label, { marginTop: 24 }]}>
          Or Cancel without rescheduling
        </Text>
        <TouchableOpacity style={styles.cancelOnlyBtn} onPress={handleCancelOnly}>
          <Text style={styles.cancelOnlyText}>Cancel lesson</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={picker !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPicker(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPicker(null)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <Text style={styles.modalTitle}>
              {picker === "day" ? "Select a day" : "Select a time slot"}
            </Text>
            <ScrollView style={{ maxHeight: 320 }}>
              {options.map((opt) => {
                const selected =
                  (picker === "day" && opt === day) ||
                  (picker === "time" && opt === time);
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.modalRow,
                      selected && styles.modalRowSelected,
                    ]}
                    onPress={() => choose(opt)}
                  >
                    <Text
                      style={[
                        styles.modalRowText,
                        selected && styles.modalRowTextSelected,
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBFA",
    paddingHorizontal: 20,
    paddingTop: 52,
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
    fontSize: 16,
    color: "#28221B",
  },

  lessonCard: {
    backgroundColor: "#F3EDEA",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },

  lessonCardTitle: {
    fontFamily: "Outfit",
    fontSize: 14,
    fontWeight: "600",
    color: "#28221B",
  },

  lessonCardMeta: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
    marginTop: 4,
  },

  info: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    marginBottom: 18,
  },

  label: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    marginBottom: 12,
  },

  input: {
    height: 44,
    backgroundColor: "#F1E5E1",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  placeholder: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#7E6D66",
  },

  value: {
    color: "#28221B",
    fontWeight: "600",
  },

  saveBtn: {
    height: 44,
    backgroundColor: "#FF9E6D",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },

  saveBtnDisabled: {
    opacity: 0.5,
  },

  saveText: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#FFFBFA",
    fontWeight: "600",
  },

  cancelOnlyBtn: {
    height: 44,
    backgroundColor: "#DD8153",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelOnlyText: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#FFFBFA",
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(40, 34, 27, 0.45)",
    justifyContent: "flex-end",
  },

  modalSheet: {
    backgroundColor: "#FFFBFA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 22,
    paddingBottom: 32,
  },

  modalTitle: {
    fontFamily: "Domine",
    fontSize: 16,
    color: "#28221B",
    marginBottom: 12,
    textAlign: "center",
  },

  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 6,
  },

  modalRowSelected: {
    backgroundColor: "#FFF1E8",
  },

  modalRowText: {
    fontFamily: "Outfit",
    fontSize: 15,
    color: "#28221B",
  },

  modalRowTextSelected: {
    color: "#FF9E6D",
    fontWeight: "700",
  },
});

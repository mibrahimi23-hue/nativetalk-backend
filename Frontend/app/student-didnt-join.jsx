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
  TouchableOpacity,
  View,
} from "react-native";
import { safeBack } from "@/hooks/use-safe-back";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIME_SLOTS = [
  "9:00 AM to 11:00 AM",
  "11:00 AM to 1:00 PM",
  "1:00 PM to 3:00 PM",
  "3:00 PM to 5:00 PM",
  "5:00 PM to 7:00 PM",
  "7:00 PM to 9:00 PM",
];

export default function StudentDidntJoin() {
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [picker, setPicker] = useState(null);
  const [savedSlot, setSavedSlot] = useState(null);
  const [absent, setAbsent] = useState(false);

  const options = picker === "day" ? DAYS : picker === "time" ? TIME_SLOTS : [];

  const choose = (val) => {
    if (picker === "day") setDay(val);
    if (picker === "time") setTime(val);
    setPicker(null);
  };

  const handleSaveAvailability = () => {
    if (!day || !time) {
      Alert.alert(
        "Pick a day and time",
        "Please select both a day and a time slot.",
      );
      return;
    }
    setSavedSlot({ day, time });
    setDay(null);
    setTime(null);
  };

  const handleContinue = () => {
    if (!savedSlot && !absent) {
      Alert.alert(
        "Choose an action",
        "Either reschedule a new slot or mark the student as absent.",
      );
      return;
    }
    if (absent) {
      Alert.alert("Marked absent", "Student has been marked as absent.", [
        { text: "OK", onPress: () => router.replace("/tutor-dashboard") },
      ]);
      return;
    }
    Alert.alert(
      "Rescheduled",
      `New slot: ${savedSlot.day} - ${savedSlot.time}.`,
      [{ text: "OK", onPress: () => router.replace("/tutor-dashboard") }],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack("/tutor-dashboard")}>
          <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
        </TouchableOpacity>
        <Text style={styles.header}>End of session</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Student didn&apos;t join!</Text>

        <Text style={styles.label}>Reschedule session</Text>

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
          onPress={handleSaveAvailability}
        >
          <Text style={styles.saveText}>Save Availability +</Text>
        </TouchableOpacity>

        {savedSlot && (
          <View style={styles.slot}>
            <Text style={styles.slotText}>
              {savedSlot.day} - {savedSlot.time}
            </Text>
            <TouchableOpacity onPress={() => setSavedSlot(null)}>
              <Text style={styles.x}>X</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={[styles.label, { marginTop: 18 }]}>
          Or mark student as absent
        </Text>

        <TouchableOpacity
          style={[styles.absentBox, absent && styles.absentBoxActive]}
          onPress={() => setAbsent((prev) => !prev)}
        >
          <View style={[styles.circle, absent && styles.circleActive]}>
            {absent && <Ionicons name="checkmark" size={10} color="#FFFBFA" />}
          </View>
          <Text style={[styles.placeholder, absent && styles.absentTextActive]}>
            {absent ? "Marked as absent" : "Mark as absent"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>

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
    paddingHorizontal: 22,
    paddingTop: 48,
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
    textAlign: "center",
    fontFamily: "Domine",
    fontSize: 18,
    fontWeight: "700",
    color: "#28221B",
    marginBottom: 22,
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
    paddingHorizontal: 14,
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
    backgroundColor: "#DD8153",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 18,
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

  slot: {
    height: 40,
    backgroundColor: "#F1E5E1",
    borderRadius: 18,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  slotText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
  },

  x: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#28221B",
    paddingHorizontal: 6,
  },

  absentBox: {
    height: 44,
    borderWidth: 1,
    borderColor: "#FF9E6D",
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
    backgroundColor: "#FFFBFA",
  },

  absentBoxActive: {
    backgroundColor: "#FFF1E8",
  },

  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#7E6D66",
    alignItems: "center",
    justifyContent: "center",
  },

  circleActive: {
    backgroundColor: "#FF9E6D",
    borderColor: "#FF9E6D",
  },

  absentTextActive: {
    color: "#28221B",
    fontWeight: "600",
  },

  continueBtn: {
    position: "absolute",
    bottom: 22,
    left: 22,
    right: 22,
    height: 44,
    backgroundColor: "#FF9E6D",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  continueText: {
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

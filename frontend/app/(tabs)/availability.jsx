import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { safeBack } from "@/hooks/use-safe-back";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIME_SLOTS = [
  "9:00 AM to 11:00 AM",
  "11:00 AM to 1:00 PM",
  "1:00 PM to 3:00 PM",
  "3:00 PM to 5:00 PM",
  "5:00 PM to 7:00 PM",
  "7:00 PM to 9:00 PM",
];

export default function Availability() {
  const { level } = useLocalSearchParams();

  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [picker, setPicker] = useState(null); // 'day' | 'time' | null
  const [slots, setSlots] = useState([
    { id: 1, day: "Mon", time: "9:00 AM to 11:00 AM" },
    { id: 2, day: "Tue", time: "1:00 PM to 3:00 PM" },
    { id: 3, day: "Thu", time: "2:00 PM to 4:00 PM" },
  ]);

  const addSlot = () => {
    if (!day || !time) return;
    setSlots((prev) => [...prev, { id: Date.now(), day, time }]);
    setDay(null);
    setTime(null);
  };

  const removeSlot = (id) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const canContinue = slots.length > 0;
  const options = picker === "day" ? DAYS : picker === "time" ? TIME_SLOTS : [];

  const choose = (val) => {
    if (picker === "day") setDay(val);
    if (picker === "time") setTime(val);
    setPicker(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
        </TouchableOpacity>
        <Text style={styles.title}>Set Availability</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.selectField}
          onPress={() => setPicker("day")}
          activeOpacity={0.7}
        >
          <Text style={[styles.selectText, !day && styles.placeholder]}>
            {day || "Select Day"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#7E6D66" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.selectField}
          onPress={() => setPicker("time")}
          activeOpacity={0.7}
        >
          <Text style={[styles.selectText, !time && styles.placeholder]}>
            {time || "Select Time"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#7E6D66" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, (!day || !time) && styles.buttonDisabled]}
          disabled={!day || !time}
          onPress={addSlot}
        >
          <Text style={styles.buttonText}>Save Availability +</Text>
        </TouchableOpacity>

        {slots.map((slot) => (
          <View key={slot.id} style={styles.item}>
            <Text style={styles.itemText}>
              {slot.day} - {slot.time}
            </Text>
            <TouchableOpacity onPress={() => removeSlot(slot.id)}>
              <Text style={styles.close}>X</Text>
            </TouchableOpacity>
          </View>
        ))}

        {slots.length === 0 && (
          <Text style={styles.emptyText}>
            No availability added yet. Add a day and time above.
          </Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.continueBtn, !canContinue && styles.continueBtnDisabled]}
        disabled={!canContinue}
        onPress={() =>
          router.push({ pathname: "/pricing-plans", params: { level } })
        }
      >
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBFA",
    padding: 20,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  backBtn: {
    backgroundColor: "#FF9E6D",
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#28221B",
  },

  selectField: {
    backgroundColor: "#F3EDEA",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 22,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: {
    color: "#28221B",
    fontSize: 14,
  },
  placeholder: {
    color: "#888",
  },

  button: {
    backgroundColor: "#FF9E6D",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 15,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFBFA",
    fontWeight: "600",
    fontSize: 15,
  },

  item: {
    backgroundColor: "#F3EDEA",
    padding: 16,
    borderRadius: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  itemText: {
    color: "#28221B",
    fontSize: 14,
  },
  close: {
    color: "#28221B",
    fontWeight: "500",
    fontSize: 16,
    paddingHorizontal: 6,
  },

  emptyText: {
    textAlign: "center",
    color: "#A89080",
    fontFamily: "Outfit",
    fontSize: 13,
    marginTop: 20,
  },

  continueBtn: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
    backgroundColor: "#FF9E6D",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    shadowColor: "#FF9E6D",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  continueBtnDisabled: {
    opacity: 0.5,
  },
  continueText: {
    color: "#FFFBFA",
    fontWeight: "600",
    fontSize: 16,
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

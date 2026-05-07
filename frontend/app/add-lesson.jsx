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
import { useUser } from "@/contexts/user-context";
import { useSafeBack } from "@/hooks/use-safe-back";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function AddLesson() {
  const { addLesson, materials } = useUser();
  const safeBack = useSafeBack();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState(null);
  const [pickedMaterials, setPickedMaterials] = useState([]);
  const [picker, setPicker] = useState(null); // 'level' | 'materials' | null

  const toggleMaterial = (id) => {
    setPickedMaterials((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleContinue = () => {
    if (!title.trim()) {
      Alert.alert("Title required", "Please enter a title for the lesson.");
      return;
    }
    if (!level) {
      Alert.alert("Level required", "Please pick a level.");
      return;
    }
    addLesson({
      title: title.trim(),
      description: description.trim(),
      level,
      materialIds: pickedMaterials,
      status: "upcoming",
      date: "TBD",
      time: "",
    });
    safeBack("/language-lessons");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={22} color="#FFFBFA" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add language lesson</Text>

        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.label}>Add title*</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="#8D7C74"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Add description</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Description"
          placeholderTextColor="#8D7C74"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Select level*</Text>
        <TouchableOpacity
          style={styles.selectBox}
          onPress={() => setPicker("level")}
        >
          <Text style={[styles.selectText, level && styles.selectTextActive]}>
            {level || "Select level"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#FFFBFA" />
        </TouchableOpacity>

        <Text style={styles.label}>Insert materials</Text>
        <TouchableOpacity
          style={styles.selectBox}
          onPress={() => setPicker("materials")}
        >
          <Text
            style={[
              styles.selectText,
              pickedMaterials.length > 0 && styles.selectTextActive,
            ]}
          >
            {pickedMaterials.length > 0
              ? `${pickedMaterials.length} selected`
              : "Pick materials"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#FFFBFA" />
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.btn} onPress={handleContinue}>
        <Text style={styles.btnText}>Continue</Text>
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
              {picker === "level" ? "Select level" : "Select materials"}
            </Text>
            <ScrollView style={{ maxHeight: 320 }}>
              {picker === "level"
                ? LEVELS.map((lvl) => {
                    const selected = lvl === level;
                    return (
                      <TouchableOpacity
                        key={lvl}
                        style={[
                          styles.modalRow,
                          selected && styles.modalRowSelected,
                        ]}
                        onPress={() => {
                          setLevel(lvl);
                          setPicker(null);
                        }}
                      >
                        <Text
                          style={[
                            styles.modalRowText,
                            selected && styles.modalRowTextSelected,
                          ]}
                        >
                          {lvl}
                        </Text>
                        {selected && (
                          <Ionicons name="checkmark" size={18} color="#FF9E6D" />
                        )}
                      </TouchableOpacity>
                    );
                  })
                : materials.map((m) => {
                    const selected = pickedMaterials.includes(m.id);
                    return (
                      <TouchableOpacity
                        key={m.id}
                        style={[
                          styles.modalRow,
                          selected && styles.modalRowSelected,
                        ]}
                        onPress={() => toggleMaterial(m.id)}
                      >
                        <Text
                          style={[
                            styles.modalRowText,
                            selected && styles.modalRowTextSelected,
                          ]}
                        >
                          {m.title}
                        </Text>
                        {selected && (
                          <Ionicons name="checkmark" size={18} color="#FF9E6D" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
            </ScrollView>
            {picker === "materials" && (
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setPicker(null)}
              >
                <Text style={styles.modalCloseText}>Done</Text>
              </TouchableOpacity>
            )}
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
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 42,
    marginBottom: 28,
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
    fontFamily: "Domine",
    fontSize: 14,
    color: "#28221B",
  },

  label: {
    fontFamily: "Domine",
    fontSize: 14,
    color: "#28221B",
    marginBottom: 8,
  },

  input: {
    height: 42,
    backgroundColor: "#E7D4CF",
    borderRadius: 15,
    paddingHorizontal: 14,
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    marginBottom: 22,
  },

  textArea: {
    height: 120,
    backgroundColor: "#E7D4CF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 14,
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    marginBottom: 22,
    textAlignVertical: "top",
  },

  selectBox: {
    height: 42,
    backgroundColor: "#DD8153",
    borderRadius: 15,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  selectText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#FFE6D7",
  },

  selectTextActive: {
    color: "#FFFBFA",
    fontWeight: "600",
  },

  btn: {
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

  btnText: {
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

  modalCloseBtn: {
    marginTop: 12,
    backgroundColor: "#FF9E6D",
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: "center",
  },

  modalCloseText: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#FFFBFA",
    fontWeight: "600",
  },
});

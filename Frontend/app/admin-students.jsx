import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { safeBack } from "@/hooks/use-safe-back";

const studentsData = [
  {
    id: 1,
    name: "Elara Voss",
    attendance: "95%",
    reschedules: 2,
    eligible: "No",
  },
  {
    id: 2,
    name: "Benedict Cumberbatch",
    attendance: "85%",
    reschedules: 5,
    eligible: "Yes",
  },
  {
    id: 3,
    name: "Alexandra Moon",
    attendance: "91%",
    reschedules: 5,
    eligible: "Yes",
  },
  {
    id: 4,
    name: "Marcus Shaw",
    attendance: "72%",
    reschedules: 7,
    eligible: "Yes",
  },
];

export default function AdminStudents() {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [students, setStudents] = useState(studentsData);

  const filtered = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((s) => selectedIds.includes(s.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !filtered.some((s) => s.id === id)),
      );
    } else {
      setSelectedIds((prev) =>
        Array.from(new Set([...prev, ...filtered.map((s) => s.id)])),
      );
    }
  };

  const suspendStudents = () => {
    if (selectedIds.length === 0) {
      Alert.alert("Select Students", "Please select at least one student.");
      return;
    }

    Alert.alert(
      "Suspend account(s)?",
      `This will suspend ${selectedIds.length} student${
        selectedIds.length === 1 ? "" : "s"
      }.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Suspend",
          style: "destructive",
          onPress: () => {
            setStudents((prev) =>
              prev.filter((s) => !selectedIds.includes(s.id)),
            );
            setSelectedIds([]);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={22} color="#FFFBFA" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Manage Students</Text>
        <View style={{ width: 30 }} />
      </View>

      <Text style={styles.title}>Student List</Text>
      <Text style={styles.subtitle}>Manage student information</Text>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={16} color="#7E6D66" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for students"
          placeholderTextColor="#7E6D66"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close" size={16} color="#28221B" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.toolbarRow}>
        <Text style={styles.toolbarText}>
          {selectedIds.length > 0
            ? `${selectedIds.length} selected`
            : `${filtered.length} student${filtered.length === 1 ? "" : "s"}`}
        </Text>
        <View style={styles.toolbarActions}>
          {filtered.length > 0 && (
            <TouchableOpacity onPress={toggleSelectAll}>
              <Text style={styles.linkBtn}>
                {allFilteredSelected ? "Clear all" : "Select all"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <Text style={styles.emptyText}>No students match your search.</Text>
        ) : (
          filtered.map((student) => {
            const checked = selectedIds.includes(student.id);
            return (
              <TouchableOpacity
                key={student.id}
                style={[styles.studentRow, checked && styles.studentRowSelected]}
                onPress={() => toggle(student.id)}
              >
                <Ionicons
                  name={checked ? "checkbox" : "square-outline"}
                  size={20}
                  color={checked ? "#FF9E6D" : "#28221B"}
                />

                <View style={styles.studentInfo}>
                  <Text style={styles.name}>{student.name}</Text>
                  <Text style={styles.info}>
                    Attendance: {student.attendance}
                  </Text>
                  <Text style={styles.info}>
                    Continuous unattended reschedules: {student.reschedules}
                  </Text>
                  <Text style={styles.info}>
                    Eligible for Suspension: {student.eligible}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.suspendBtn,
          selectedIds.length === 0 && styles.suspendBtnDisabled,
        ]}
        onPress={suspendStudents}
      >
        <Text style={styles.suspendText}>
          {selectedIds.length > 1
            ? `Suspend ${selectedIds.length} accounts`
            : "Suspend Account"}
        </Text>
      </TouchableOpacity>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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

  title: {
    fontFamily: "Domine",
    fontSize: 18,
    color: "#28221B",
  },

  subtitle: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
    marginBottom: 14,
  },

  searchBox: {
    height: 38,
    backgroundColor: "#F1E5E1",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#28221B",
    marginLeft: 6,
  },

  toolbarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  toolbarText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
  },

  toolbarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  linkBtn: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#FF9E6D",
    fontWeight: "600",
  },

  studentRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDEA",
    borderRadius: 8,
  },

  studentRowSelected: {
    backgroundColor: "#FFF1E8",
  },

  studentInfo: {
    marginLeft: 12,
    flex: 1,
  },

  name: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    fontWeight: "600",
  },

  info: {
    fontFamily: "Outfit",
    fontSize: 11,
    color: "#7E6D66",
    marginTop: 2,
  },

  emptyText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#A89080",
    textAlign: "center",
    marginTop: 30,
  },

  suspendBtn: {
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

  suspendBtnDisabled: {
    opacity: 0.5,
  },

  suspendText: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#FFFBFA",
    fontWeight: "600",
  },
});

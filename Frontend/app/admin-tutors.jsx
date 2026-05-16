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

const tutorsData = [
  {
    id: 1,
    name: "Cecilia Starling",
    absences: 3,
    eligible: "Yes",
  },
  {
    id: 2,
    name: "Dorian Gray",
    absences: 0,
    eligible: "No",
  },
  {
    id: 3,
    name: "Elena Gilbert",
    absences: 1,
    eligible: "No",
  },
  {
    id: 4,
    name: "Marcus Aurelius",
    absences: 4,
    eligible: "Yes",
  },
];

export default function AdminTutors() {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [tutors, setTutors] = useState(tutorsData);

  const filtered = tutors.filter((tutor) =>
    tutor.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((t) => selectedIds.includes(t.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !filtered.some((t) => t.id === id)),
      );
    } else {
      setSelectedIds((prev) =>
        Array.from(new Set([...prev, ...filtered.map((t) => t.id)])),
      );
    }
  };

  const suspendTutors = () => {
    if (selectedIds.length === 0) {
      Alert.alert("Select Tutors", "Please select at least one tutor.");
      return;
    }

    Alert.alert(
      "Suspend account(s)?",
      `This will suspend ${selectedIds.length} tutor${
        selectedIds.length === 1 ? "" : "s"
      }.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Suspend",
          style: "destructive",
          onPress: () => {
            setTutors((prev) =>
              prev.filter((t) => !selectedIds.includes(t.id)),
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

        <Text style={styles.headerTitle}>Manage Tutors</Text>
        <View style={{ width: 30 }} />
      </View>

      <Text style={styles.title}>Tutor List</Text>
      <Text style={styles.subtitle}>Manage tutor information</Text>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={16} color="#7E6D66" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for tutors"
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
            : `${filtered.length} tutor${filtered.length === 1 ? "" : "s"}`}
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
          <Text style={styles.emptyText}>No tutors match your search.</Text>
        ) : (
          filtered.map((tutor) => {
            const checked = selectedIds.includes(tutor.id);
            return (
              <TouchableOpacity
                key={tutor.id}
                style={[styles.tutorRow, checked && styles.tutorRowSelected]}
                onPress={() => toggle(tutor.id)}
              >
                <Ionicons
                  name={checked ? "checkbox" : "square-outline"}
                  size={20}
                  color={checked ? "#FF9E6D" : "#28221B"}
                />

                <View style={styles.tutorInfo}>
                  <Text style={styles.name}>{tutor.name}</Text>
                  <Text style={styles.info}>
                    Number of Continuous Unnoticed Absences: {tutor.absences}
                  </Text>
                  <Text style={styles.info}>
                    Eligible for Suspension: {tutor.eligible}
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
        onPress={suspendTutors}
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

  tutorRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDEA",
    borderRadius: 8,
  },

  tutorRowSelected: {
    backgroundColor: "#FFF1E8",
  },

  tutorInfo: {
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

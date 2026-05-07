import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { safeBack } from "@/hooks/use-safe-back";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const materials = [
  "Vocabulary List",
  "Grammar Guide",
  "Practice Exercises",
  "Audio Lessons",
  "Grammar Guide",
  "Audio Lessons",
  "Vocabulary List",
  "Audio Lessons",
];

export default function StudentMaterials() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={22} color="#FFFBFA" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Materials</Text>
        <View style={{ width: 30 }} />
      </View>

      <Text style={styles.title}>Materials</Text>

      {/* Materials List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {materials.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.materialRow}
            onPress={() =>
              Alert.alert("Download", `${item} downloaded successfully`)
            }
          >
            <Text style={styles.materialText}>{item}</Text>
            <Ionicons name="download-outline" size={16} color="#28221B" />
          </TouchableOpacity>
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/student-dashboard")}>
          <Ionicons name="home" size={22} color="#28221B" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/student-dashboard")}>
          <Ionicons name="search-outline" size={22} color="#28221B" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/student-lessons")}>
          <Ionicons name="book-outline" size={22} color="#28221B" />
        </TouchableOpacity>

        {/* ✅ FIXED PROFILE FLOW */}
        <TouchableOpacity onPress={() => router.push("/student-profile")}>
          <Ionicons name="person" size={22} color="#28221B" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBFA",
    paddingTop: 48,
    paddingHorizontal: 22,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
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
    fontSize: 13,
    color: "#28221B",
  },

  title: {
    fontFamily: "Domine",
    fontSize: 18,
    color: "#28221B",
    marginBottom: 10,
  },

  materialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  materialText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "#FDF0EC",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

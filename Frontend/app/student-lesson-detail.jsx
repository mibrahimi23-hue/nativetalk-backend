import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { safeBack } from "@/hooks/use-safe-back";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function StudentLessonDetail() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => safeBack()}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFBFA" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Lesson 1</Text>
          <View style={{ width: 30 }} />
        </View>

        <Text style={styles.title}>Basic Greetings</Text>

        <Text style={styles.tutor}>Tutor: Dr. Alejandro Morales</Text>
        <Text style={styles.date}>October 15, 2023</Text>

        <Text style={styles.description}>
          This lesson will cover the basics of Spanish language, including
          common phrases, grammar rules, and vocabulary.{"\n\n"}
          This lesson will cover the basics of Spanish language, including
          common phrases, grammar rules, and vocabulary.{"\n\n"}- This lesson
          will cover common phrases, grammar rules, and vocabulary.
          {"\n"}- This lesson will help you practice basic greetings.
        </Text>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/student-dashboard")}>
          <Ionicons name="home" size={20} color="#28221B" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/student-dashboard")}>
          <Ionicons name="search-outline" size={20} color="#28221B" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/student-lessons")}>
          <Ionicons name="book-outline" size={20} color="#FF9E6D" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/student-profile")}>
          <Ionicons name="person" size={20} color="#28221B" />
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
    fontSize: 26,
    color: "#28221B",
    marginBottom: 18,
  },

  tutor: {
    fontFamily: "Outfit",
    fontSize: 13,
    fontWeight: "700",
    color: "#28221B",
  },

  date: {
    fontFamily: "Outfit",
    fontSize: 10,
    color: "#7E6D66",
    marginBottom: 12,
  },

  description: {
    fontFamily: "Outfit",
    fontSize: 13,
    lineHeight: 18,
    color: "#28221B",
    paddingBottom: 80,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 44,
    backgroundColor: "#FDF0EC",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

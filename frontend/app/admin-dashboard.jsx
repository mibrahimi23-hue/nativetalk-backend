import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdminDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>

      <Text style={styles.title}>Actions</Text>

      <ActionItem
        icon="shield-checkmark"
        text="Approve/Reject Tutor Accounts"
        route="/admin-approvals"
      />

      <ActionItem
        icon="people"
        text="Manage Students"
        route="/admin-students"
      />

      <ActionItem icon="school" text="Manage Tutors" route="/admin-tutors" />

      <ActionItem
        icon="construct"
        text="Create Language Exam"
        route="/admin-exam-builder"
      />

      <ActionItem
        icon="swap-horizontal"
        text="Transactions"
        route="/admin-transactions"
      />

      <ActionItem
        icon="person-circle"
        text="Profile Settings"
        route="/admin-profile"
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/admin-dashboard")}>
          <Ionicons name="home" size={22} color="#28221B" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/admin-approvals")}>
          <Ionicons name="shield-checkmark" size={22} color="#28221B" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/admin-transactions")}>
          <Ionicons name="swap-horizontal" size={22} color="#28221B" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/admin-profile")}>
          <Ionicons name="person-circle" size={22} color="#28221B" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ActionItem({ icon, text, route }) {
  return (
    <TouchableOpacity
      style={styles.actionRow}
      onPress={() => router.push(route)}
    >
      <Ionicons name={icon} size={22} color="#28221B" />
      <Text style={styles.actionText}>{text}</Text>
      <Ionicons name="chevron-forward" size={22} color="#28221B" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBFA",
    paddingTop: 55,
    paddingHorizontal: 24,
  },

  header: {
    fontFamily: "Domine",
    fontSize: 15,
    textAlign: "center",
    color: "#28221B",
    marginBottom: 34,
  },

  title: {
    fontFamily: "Domine",
    fontSize: 20,
    color: "#28221B",
    marginBottom: 18,
  },

  actionRow: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  actionText: {
    flex: 1,
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#28221B",
    marginLeft: 12,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 46,
    backgroundColor: "#FDF0EC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

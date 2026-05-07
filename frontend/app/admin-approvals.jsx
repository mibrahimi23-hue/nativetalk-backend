import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { safeBack } from "@/hooks/use-safe-back";
import { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const initialTutors = [
  {
    id: 1,
    name: "Elara Voss",
    bio: "Experienced in teaching Spanish and French.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  },
  {
    id: 2,
    name: "Kaiya Ryn",
    bio: "Native English speaker with a focus on business English.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
];

export default function AdminApprovals() {
  const [tutors, setTutors] = useState(initialTutors);

  const removeTutor = (id, action) => {
    setTutors(tutors.filter((tutor) => tutor.id !== id));
    Alert.alert(action, `Tutor has been ${action.toLowerCase()}.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={22} color="#FFFBFA" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Tutor Account Approval</Text>
        <View style={{ width: 30 }} />
      </View>

      {tutors.map((tutor) => (
        <View key={tutor.id} style={styles.card}>
          <Image source={{ uri: tutor.image }} style={styles.avatar} />

          <Text style={styles.name}>{tutor.name}</Text>
          <Text style={styles.bio}>{tutor.bio}</Text>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.approveBtn}
              onPress={() => removeTutor(tutor.id, "Approved")}
            >
              <Text style={styles.whiteText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => removeTutor(tutor.id, "Rejected")}
            >
              <Text style={styles.darkText}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() => router.push("/admin-tutor-profile")}
            >
              <Text style={styles.darkText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {tutors.length === 0 && (
        <Text style={styles.emptyText}>No pending tutor accounts</Text>
      )}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBFA",
    paddingTop: 48,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF9E6D",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Domine",
    fontSize: 15,
    color: "#28221B",
  },

  card: {
    alignItems: "center",
    marginBottom: 34,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    marginBottom: 12,
  },

  name: {
    fontFamily: "Domine",
    fontSize: 20,
    color: "#28221B",
    marginBottom: 6,
  },

  bio: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    textAlign: "center",
    marginBottom: 14,
  },

  btnRow: {
    flexDirection: "row",
    gap: 12,
  },

  approveBtn: {
    width: 75,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF9E6D",
    justifyContent: "center",
    alignItems: "center",
  },

  rejectBtn: {
    width: 75,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1E5E1",
    justifyContent: "center",
    alignItems: "center",
  },

  viewBtn: {
    width: 75,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F1E5E1",
    justifyContent: "center",
    alignItems: "center",
  },

  whiteText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#FFFBFA",
  },

  darkText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#28221B",
  },

  emptyText: {
    fontFamily: "Outfit",
    textAlign: "center",
    color: "#28221B",
    marginTop: 60,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 46,
    backgroundColor: "#FDF0EC",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

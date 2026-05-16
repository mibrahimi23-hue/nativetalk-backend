import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { safeBack } from "@/hooks/use-safe-back";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AdminTutorProfile() {
  const finish = (action) => {
    Alert.alert(action, `Tutor has been ${action.toLowerCase()}.`);
    router.push("/admin-approvals");
  };

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

          <Text style={styles.headerTitle}>Tutor Profile</Text>
          <View style={{ width: 30 }} />
        </View>

        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>Maria Gonzalez</Text>
        <Text style={styles.level}>Spanish B2</Text>

        <View style={styles.infoRow}>
          <Text style={styles.info}>4.8 ★</Text>
          <Text style={styles.info}>Price $10/hr</Text>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => finish("Approved")}
          >
            <Text style={styles.approveText}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => finish("Rejected")}
          >
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Exam Scores</Text>

        {[
          ["Grammar", "67%"],
          ["Listening", "72%"],
          ["Reading", "79%"],
          ["Writing", "85%"],
        ].map(([title, score]) => (
          <View key={title} style={styles.scoreRow}>
            <Text style={styles.scoreTitle}>{title}</Text>
            <Text style={styles.score}>{score}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Certificates</Text>

        {[
          "Download Certificate",
          "Download Notarized Certificate",
          "Download Notarized teaching Certificate",
        ].map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.downloadRow}
            onPress={() => Alert.alert("Download", `${item} downloaded`)}
          >
            <Text style={styles.downloadText}>{item}</Text>
            <Ionicons name="download-outline" size={15} color="#28221B" />
          </TouchableOpacity>
        ))}

        <View style={{ height: 70 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/admin-dashboard")}>
          <Ionicons name="home" size={20} color="#28221B" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/admin-approvals")}>
          <Ionicons name="shield-checkmark" size={20} color="#28221B" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/admin-transactions")}>
          <Ionicons name="swap-horizontal" size={20} color="#28221B" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/admin-profile")}>
          <Ionicons name="person-circle" size={20} color="#28221B" />
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
    fontSize: 13,
    color: "#28221B",
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignSelf: "center",
    marginBottom: 10,
  },

  name: {
    fontFamily: "Domine",
    fontSize: 18,
    textAlign: "center",
    color: "#28221B",
  },

  level: {
    fontFamily: "Outfit",
    fontSize: 12,
    textAlign: "center",
    color: "#28221B",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginVertical: 10,
  },

  info: {
    fontFamily: "Outfit",
    fontSize: 11,
    color: "#7E6D66",
  },

  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },

  approveBtn: {
    flex: 1,
    height: 38,
    borderRadius: 20,
    backgroundColor: "#FF9E6D",
    justifyContent: "center",
    alignItems: "center",
  },

  rejectBtn: {
    flex: 1,
    height: 38,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D8C7C0",
    justifyContent: "center",
    alignItems: "center",
  },

  approveText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#FFFBFA",
    fontWeight: "700",
  },

  rejectText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#28221B",
    fontWeight: "700",
  },

  sectionTitle: {
    fontFamily: "Domine",
    fontSize: 18,
    color: "#28221B",
    marginBottom: 14,
    marginTop: 8,
  },

  scoreRow: {
    marginBottom: 14,
  },

  scoreTitle: {
    fontFamily: "Domine",
    fontSize: 16,
    color: "#28221B",
  },

  score: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
  },

  downloadRow: {
    marginBottom: 10,
  },

  downloadText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#28221B",
    marginBottom: 3,
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

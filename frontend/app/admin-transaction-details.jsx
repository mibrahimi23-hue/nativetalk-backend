import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { safeBack } from "@/hooks/use-safe-back";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdminTransactionDetails() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={22} color="#FFFBFA" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Transaction Page</Text>
        <View style={{ width: 30 }} />
      </View>

      <Text style={styles.sectionTitle}>Student Account</Text>

      <TouchableOpacity
        onPress={() => Alert.alert("Email", "elara.thornfield@gmail.com")}
      >
        <Text style={styles.info}>✉ Email: elara.thornfield@gmail.com</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.row}
        onPress={() => router.push("/admin-student-transaction-history")}
      >
        <Text style={styles.info}>☮ Transaction history</Text>
        <Ionicons name="chevron-forward" size={18} color="#28221B" />
      </TouchableOpacity>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Tutor Account</Text>

      <TouchableOpacity
        onPress={() => Alert.alert("Email", "orion.starling@school.edu")}
      >
        <Text style={styles.info}>✉ Email: orion.starling@school.edu</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Alert.alert("Balance", "$1200")}>
        <Text style={styles.info}>☮ Balance: $1200</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.row}
        onPress={() => router.push("/admin-tutor-transaction-history")}
      >
        <Text style={styles.info}>☮ Transaction history</Text>
        <Ionicons name="chevron-forward" size={18} color="#28221B" />
      </TouchableOpacity>

      <View style={styles.divider} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Transaction details</Text>
        <Text style={styles.amount}>$150</Text>

        <View style={styles.pillRow}>
          <TouchableOpacity
            style={styles.pill}
            onPress={() => Alert.alert("From", "Elara Thornfield")}
          >
            <Text style={styles.pillText}>From: Elara{"\n"}Thornfield</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pill}
            onPress={() => Alert.alert("To", "Orion Starling")}
          >
            <Text style={styles.pillText}>To: Orion{"\n"}Starling</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    marginBottom: 22,
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
  sectionTitle: {
    fontFamily: "Domine",
    fontSize: 18,
    color: "#28221B",
    marginBottom: 18,
  },
  info: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#28221B",
    marginBottom: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#D8C7C0",
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#FFFBFA",
    borderRadius: 14,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontFamily: "Domine",
    fontSize: 14,
    color: "#28221B",
    marginBottom: 12,
  },
  amount: {
    fontFamily: "Domine",
    fontSize: 28,
    color: "#28221B",
    marginBottom: 26,
  },
  pillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pill: {
    width: "48%",
    backgroundColor: "#F8EFEC",
    borderRadius: 18,
    paddingVertical: 10,
    alignItems: "center",
  },
  pillText: {
    fontFamily: "Outfit",
    fontSize: 11,
    textAlign: "center",
    color: "#28221B",
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

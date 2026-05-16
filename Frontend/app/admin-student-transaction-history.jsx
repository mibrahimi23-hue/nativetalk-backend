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

const transactions = [
  "Spanish Lesson A1",
  "Spanish Lesson A2-50%",
  "Spanish Lesson A2-50%",
  "Spanish Lesson B1",
  "Spanish Lesson B2-Nouns",
];

export default function AdminStudentTransactionHistory() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={22} color="#FFFBFA" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Student Transaction History</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Recent Transactions</Text>

        {transactions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.transactionRow}
            onPress={() => Alert.alert("Transaction", item)}
          >
            <Text style={styles.transactionTitle}>{item}</Text>
            <Text style={styles.transactionInfo}>
              {index === 2
                ? "Mobile Payment"
                : index === 1 || index === 4
                  ? "Credit Card"
                  : "Debit Card"}{" "}
              - 10/{21 - index}/2023
            </Text>
            <Text style={styles.transfer}>Transfer</Text>
          </TouchableOpacity>
        ))}
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
    marginBottom: 28,
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

  title: {
    fontFamily: "Domine",
    fontSize: 22,
    color: "#28221B",
    marginBottom: 18,
  },

  transactionRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  transactionTitle: {
    fontFamily: "Outfit",
    fontSize: 15,
    color: "#28221B",
    marginBottom: 6,
  },

  transactionInfo: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#7E6D66",
    marginBottom: 6,
  },

  transfer: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#7E6D66",
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

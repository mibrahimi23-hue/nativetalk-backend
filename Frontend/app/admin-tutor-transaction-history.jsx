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
  "Spanish Lesson B1-50%",
  "Spanish Lesson A2-Conversation in a Restaurant",
  "Spanish Lesson B1",
  "English Lesson A1",
];

export default function AdminTutorTransactionHistory() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={22} color="#FFFBFA" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Tutor Transaction History</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View>
          <Text style={styles.small}>Total Balance</Text>
          <Text style={styles.balance}>$500</Text>
        </View>

        <View>
          <Text style={styles.small}>Available Funds</Text>
        </View>
      </View>

      {/* Earnings */}
      <View style={styles.earningsRow}>
        <Text style={styles.earningText}>Todays Earnings{"\n"}$9.5</Text>

      </View>

      <View style={styles.earningsRow2}>
        <Text style={styles.earningText}>Last Weeks Earnings{"\n"}$90.00</Text>
        <Text style={styles.earningText}>
          This Months Earnings{"\n"}$350.00
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
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
            <Text style={styles.received}>Received</Text>
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

  balanceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8EFEC",
    padding: 14,
    borderRadius: 14,
    marginBottom: 18,
  },

  small: {
    fontFamily: "Outfit",
    fontSize: 10,
    color: "#7E6D66",
  },

  balance: {
    fontFamily: "Domine",
    fontSize: 26,
    color: "#28221B",
  },

  earningsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  earningsRow2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  earningText: {
    fontFamily: "Outfit",
    fontSize: 11,
    color: "#28221B",
  },

  detailsBtn: {
    backgroundColor: "#FF9E6D",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
  },

  detailsText: {
    color: "#FFFBFA",
    fontFamily: "Outfit",
    fontSize: 11,
  },

  sectionTitle: {
    fontFamily: "Domine",
    fontSize: 18,
    marginBottom: 10,
    color: "#28221B",
  },

  transactionRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  transactionTitle: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    marginBottom: 4,
  },

  transactionInfo: {
    fontFamily: "Outfit",
    fontSize: 11,
    color: "#7E6D66",
  },

  received: {
    fontFamily: "Outfit",
    fontSize: 11,
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

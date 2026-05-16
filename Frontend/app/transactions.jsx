import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TutorBottomNav } from "@/components/tutor-bottom-nav";
import { safeBack } from "@/hooks/use-safe-back";

const transactions = [
  { id: 1, title: "Lesson 1", subtitle: "Spanish", amount: "$5" },
  { id: 2, title: "Lesson 5", subtitle: "German", amount: "$6" },
  { id: 3, title: "B2 level", subtitle: "50% payment, Spanish", amount: "$90" },
  {
    id: 4,
    title: "A1 level",
    subtitle: "80% payment, Italian",
    amount: "$130",
  },
];

export default function Transactions() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack("/tutor-dashboard")}>
          <Ionicons name="chevron-back" size={22} color="#FFFBFA" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Transactions</Text>

        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
        <View style={styles.balanceCard}>
          <View>
            <Text style={styles.smallText}>Total Balance</Text>
            <Text style={styles.balance}>$500</Text>
          </View>

          <Text style={styles.smallText}>Available Funds</Text>
        </View>

        <View style={styles.earningsRow}>
          <View>
            <Text style={styles.smallText}>Todays Earnings</Text>
            <Text style={styles.boldText}>$9.5</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View>
            <Text style={styles.smallText}>Last Weeks Earnings</Text>
            <Text style={styles.boldText}>$90.00</Text>
          </View>

          <View>
            <Text style={styles.smallText}>This Months Earnings</Text>
            <Text style={styles.boldText}>$350.00</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Transaction history</Text>

        {transactions.map((item) => (
          <TouchableOpacity key={item.id} style={styles.transactionCard}>
            <Text style={styles.transactionTitle}>{item.title}</Text>
            <Text style={styles.transactionSubtitle}>{item.subtitle}</Text>
            <Text style={styles.transactionAmount}>{item.amount}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TutorBottomNav />
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

  balanceCard: {
    height: 88,
    borderRadius: 12,
    backgroundColor: "#FFFBFA",
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#28221B",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },

  smallText: {
    fontFamily: "Outfit",
    fontSize: 10,
    color: "#28221B",
  },

  balance: {
    fontFamily: "Domine",
    fontSize: 26,
    color: "#28221B",
    marginTop: 8,
  },

  boldText: {
    fontFamily: "Outfit",
    fontSize: 13,
    fontWeight: "700",
    color: "#28221B",
    marginTop: 4,
  },

  earningsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  detailsBtn: {
    width: 135,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF9E6D",
    justifyContent: "center",
    alignItems: "center",
  },

  detailsText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#FFFBFA",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  sectionTitle: {
    fontFamily: "Domine",
    fontSize: 18,
    color: "#28221B",
    marginBottom: 10,
  },

  transactionCard: {
    backgroundColor: "#F8EFEC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },

  transactionTitle: {
    fontFamily: "Domine",
    fontSize: 16,
    color: "#28221B",
  },

  transactionSubtitle: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#28221B",
  },

  transactionAmount: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#28221B",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 42,
    backgroundColor: "#FDF0EC",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

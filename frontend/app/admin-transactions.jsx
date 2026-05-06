import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { safeBack } from "@/hooks/use-safe-back";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const transactions = [
  {
    id: 1,
    time: "1 day ago · 13:00",
    title: "Spanish Lesson",
    description: "Full Payment by Elara Voss to Cecilia Starling, $210",
  },
  {
    id: 2,
    time: "5 days ago · 10:00",
    title: "German Lesson",
    description: "50% payment by Kai Rivers to Mia Stone, $75",
  },
  {
    id: 3,
    time: "1 week ago · 16:45",
    title: "Japanese Lesson",
    description: "Hourly payment by Noah Lake to Ava Reed, $10/hr",
  },
];

export default function AdminTransactions() {
  const [search, setSearch] = useState("");

  const filtered = transactions.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={22} color="#FFFBFA" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Transaction Overview</Text>
        <View style={{ width: 30 }} />
      </View>

      <Text style={styles.title}>Recent Transactions</Text>
      <Text style={styles.subtitle}>
        Review all transactions made on the platform
      </Text>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={16} color="#7E6D66" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for name"
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.map((item) => (
          <View key={item.id} style={styles.transactionRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.time}>{item.time}</Text>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>

            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => router.push("/admin-transaction-details")}
            >
              <Ionicons name="play" size={14} color="#28221B" />
            </TouchableOpacity>
          </View>
        ))}

        {filtered.length === 0 && (
          <Text style={styles.empty}>No transactions found</Text>
        )}
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
    paddingHorizontal: 22,
    paddingTop: 48,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
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
  },

  subtitle: {
    fontFamily: "Outfit",
    fontSize: 9,
    color: "#28221B",
    marginBottom: 18,
  },

  searchBox: {
    height: 34,
    backgroundColor: "#F1E5E1",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 18,
  },

  searchInput: {
    flex: 1,
    fontFamily: "Outfit",
    fontSize: 11,
    color: "#28221B",
    marginLeft: 6,
  },

  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  time: {
    fontFamily: "Outfit",
    fontSize: 9,
    color: "#28221B",
    marginBottom: 4,
  },

  transactionTitle: {
    fontFamily: "Outfit",
    fontSize: 13,
    fontWeight: "700",
    color: "#28221B",
    marginBottom: 4,
  },

  description: {
    fontFamily: "Outfit",
    fontSize: 10,
    color: "#28221B",
  },

  playBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  empty: {
    fontFamily: "Outfit",
    fontSize: 12,
    textAlign: "center",
    color: "#7E6D66",
    marginTop: 40,
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

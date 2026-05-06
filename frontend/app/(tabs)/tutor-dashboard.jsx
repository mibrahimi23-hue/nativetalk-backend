import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TutorBottomNav } from "@/components/tutor-bottom-nav";
import { useUser } from "@/contexts/user-context";

const REVIEWS = [
  {
    id: 1,
    name: "Alexandria Voss",
    initials: "AV",
    color: "#E8C9B6",
    when: "2 days ago",
    text: "Great session! Learned a lot about pronunciation.",
  },
  {
    id: 2,
    name: "Nathaniel Kline",
    initials: "NK",
    color: "#C7B6A6",
    when: "4 days ago",
    text: "Very helpful with grammar rules.",
  },
];

export default function TutorDashboard() {
  const { profile, lessons } = useUser();
  const [doneIds, setDoneIds] = useState([]);

  const upcoming = lessons.find(
    (l) => l.status === "upcoming" || l.status === "join",
  );

  const toggleDone = (id) => {
    setDoneIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const greetingName =
    profile.firstName || profile.lastName
      ? `${profile.firstName} ${profile.lastName}`.trim()
      : null;

  return (
    <SafeAreaView style={styles.wrapper} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>
          {greetingName
            ? `Welcome, ${greetingName}`
            : "Language Tutor Dashboard"}
        </Text>
        {profile.language ? (
          <Text style={styles.subHeader}>Teaching {profile.language}</Text>
        ) : null}

        {/* Earnings */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Earnings Overview</Text>
          <TouchableOpacity
            style={styles.arrowBtn}
            onPress={() => router.push("/transactions")}
          >
            <Ionicons name="chevron-forward" size={18} color="#FFFBFA" />
          </TouchableOpacity>
        </View>

        <View style={styles.earningsCard}>
          <Text style={styles.todayLabel}>Today's Earnings</Text>
          <Text style={styles.earningsAmount}>$150</Text>

          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Last Week: $900</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>This Month: $3,500</Text>
            </View>
          </View>
        </View>

        {/* Lessons */}
        <View style={[styles.sectionRow, { marginTop: 26 }]}>
          <Text style={styles.sectionTitle}>Upcoming Lessons</Text>
          <TouchableOpacity
            style={styles.arrowBtn}
            onPress={() => router.push("/language-lessons")}
          >
            <Ionicons name="chevron-forward" size={18} color="#FFFBFA" />
          </TouchableOpacity>
        </View>

        {upcoming ? (
          <>
            <TouchableOpacity
              style={styles.lessonRow}
              activeOpacity={0.7}
              onPress={() => toggleDone(upcoming.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  doneIds.includes(upcoming.id) && styles.checkboxChecked,
                ]}
              >
                {doneIds.includes(upcoming.id) && (
                  <Ionicons name="checkmark" size={14} color="#FFFBFA" />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.lessonName}>{upcoming.title}</Text>
                <Text style={styles.lessonDate}>
                  {upcoming.date} {upcoming.time}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() =>
                router.push({
                  pathname: "/cancel-session",
                  params: { lessonId: String(upcoming.id) },
                })
              }
            >
              <Text style={styles.cancelText}>Cancel Upcoming Lesson</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.emptyHint}>No upcoming lessons.</Text>
        )}

        <View style={styles.lessonStatRow}>
          <Text style={styles.lessonStatLabel}>Next Lesson</Text>
          <Text style={styles.lessonStatValue}>+1 day</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.lessonStatRow}>
          <Text style={styles.lessonStatLabel}>Last Lesson</Text>
          <Text style={styles.lessonStatValue}>-2 day</Text>
        </View>
        <View style={styles.divider} />

        {/* Reviews */}
        <View style={[styles.sectionRow, { marginTop: 26 }]}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <TouchableOpacity
            style={styles.arrowBtn}
            onPress={() => router.push("/reviews")}
          >
            <Ionicons name="chevron-forward" size={18} color="#FFFBFA" />
          </TouchableOpacity>
        </View>

        {REVIEWS.map((r) => (
          <View key={r.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={[styles.avatar, { backgroundColor: r.color }]}>
                <Text style={styles.avatarText}>{r.initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reviewName}>{r.name}</Text>
                <Text style={styles.reviewWhen}>{r.when}</Text>
              </View>
            </View>
            <Text style={styles.reviewText}>{r.text}</Text>
          </View>
        ))}

        <View style={{ height: 110 }} />
      </ScrollView>

      <TutorBottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#FFFBFA" },
  container: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 12 },

  header: {
    fontFamily: "Domine",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 4,
    color: "#28221B",
  },

  subHeader: {
    fontFamily: "Outfit",
    fontSize: 12,
    textAlign: "center",
    color: "#7E6D66",
    marginBottom: 20,
  },

  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontFamily: "Domine",
    fontSize: 18,
    color: "#28221B",
  },

  arrowBtn: {
    backgroundColor: "#FF9E6D",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  earningsCard: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 14,
    shadowColor: "#28221B",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  todayLabel: {
    fontFamily: "Outfit",
    fontSize: 13,
    fontWeight: "600",
    color: "#28221B",
  },
  earningsAmount: {
    fontFamily: "Domine",
    fontSize: 38,
    fontWeight: "700",
    color: "#28221B",
    marginTop: 2,
  },
  pillRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
  },
  pill: {
    backgroundColor: "#F3EDEA",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  pillText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#28221B",
  },

  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#28221B",
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#FF9E6D",
    borderColor: "#FF9E6D",
  },
  lessonName: {
    fontFamily: "Outfit",
    fontSize: 14,
    fontWeight: "600",
    color: "#28221B",
  },
  lessonDate: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
    marginTop: 2,
  },
  cancelBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#DD8153",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    marginTop: 8,
    marginBottom: 6,
  },
  cancelText: {
    color: "#FFFBFA",
    fontFamily: "Outfit",
    fontSize: 13,
    fontWeight: "600",
  },
  emptyHint: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#A89080",
    marginVertical: 6,
  },
  lessonStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  lessonStatLabel: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#7E6D66",
  },
  lessonStatValue: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
  },
  divider: {
    height: 1,
    backgroundColor: "#EFE6E1",
  },

  reviewCard: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
    shadowColor: "#28221B",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    fontFamily: "Outfit",
    fontSize: 13,
    fontWeight: "700",
    color: "#28221B",
  },
  reviewName: {
    fontFamily: "Outfit",
    fontSize: 14,
    fontWeight: "700",
    color: "#28221B",
  },
  reviewWhen: {
    fontFamily: "Outfit",
    fontSize: 11,
    color: "#7E6D66",
  },
  reviewText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    marginBottom: 8,
  },
  reviewActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EFE6E1",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
});

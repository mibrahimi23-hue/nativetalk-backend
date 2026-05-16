import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { useUser } from "@/contexts/user-context";
import { useSafeBack } from "@/hooks/use-safe-back";

const TUTORS = [
  {
    id: 1,
    name: "Maria Gonzalez",
    language: "Spanish",
    level: "B2",
    price: "$20/hr",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136",
  },
  {
    id: 2,
    name: "Kenji Tanaka",
    language: "Italian",
    level: "A2",
    price: "$15/hr",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  {
    id: 3,
    name: "Sophie Laurent",
    language: "French",
    level: "B1",
    price: "$18/hr",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
  },
  {
    id: 4,
    name: "Hans Müller",
    language: "German",
    level: "C1",
    price: "$22/hr",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
];

export default function SavedTutors() {
  const { savedTutorIds, toggleSavedTutor } = useUser();
  const safeBack = useSafeBack();

  const savedTutors = TUTORS.filter((t) => savedTutorIds.includes(t.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack("/student-dashboard")}>
          <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved tutors</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {savedTutors.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="bookmark-outline" size={32} color="#FF9E6D" />
            <Text style={styles.emptyTitle}>No saved tutors yet</Text>
            <Text style={styles.emptyText}>
              Tap the bookmark on any tutor profile to save them here for later.
            </Text>
            <TouchableOpacity
              style={styles.browseBtn}
              onPress={() => router.push("/student-dashboard")}
            >
              <Text style={styles.browseBtnText}>Browse tutors</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.count}>
              {savedTutors.length} tutor{savedTutors.length === 1 ? "" : "s"} saved
            </Text>
            {savedTutors.map((tutor) => (
              <TouchableOpacity
                key={tutor.id}
                style={styles.row}
                onPress={() =>
                  router.push({
                    pathname: "/tutor-profile-student",
                    params: { tutorId: String(tutor.id) },
                  })
                }
              >
                <Image source={{ uri: tutor.image }} style={styles.avatar} />
                <View style={styles.rowBody}>
                  <Text style={styles.name}>{tutor.name}</Text>
                  <Text style={styles.meta}>
                    {tutor.language} {tutor.level} · {tutor.price}
                  </Text>
                </View>
                <TouchableOpacity
                  hitSlop={8}
                  onPress={() => toggleSavedTutor(tutor.id)}
                  style={styles.removeBtn}
                >
                  <Ionicons name="bookmark" size={20} color="#FF9E6D" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      <StudentBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBFA" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 20,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF9E6D",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontFamily: "Domine",
    fontSize: 16,
    color: "#28221B",
  },

  count: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
    marginVertical: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#28221B",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  rowBody: {
    flex: 1,
  },

  name: {
    fontFamily: "Outfit",
    fontSize: 14,
    fontWeight: "600",
    color: "#28221B",
  },

  meta: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
    marginTop: 4,
  },

  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF1E8",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },

  emptyTitle: {
    fontFamily: "Domine",
    fontSize: 18,
    color: "#28221B",
    marginTop: 14,
  },

  emptyText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#7E6D66",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },

  browseBtn: {
    marginTop: 18,
    backgroundColor: "#FF9E6D",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 22,
  },

  browseBtnText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#FFFBFA",
    fontWeight: "600",
  },
});

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import { safeBack } from "@/hooks/use-safe-back";

const TUTORS = {
  1: {
    id: 1,
    name: "Maria Gonzalez",
    language: "Spanish",
    level: "B2",
    rating: 4.8,
    price: "$10/hr",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136",
  },
  2: {
    id: 2,
    name: "Kenji Tanaka",
    language: "Italian",
    level: "A2",
    rating: 4.6,
    price: "$15/hr",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  3: {
    id: 3,
    name: "Sophie Laurent",
    language: "French",
    level: "B1",
    rating: 4.9,
    price: "$18/hr",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
  },
  4: {
    id: 4,
    name: "Hans Müller",
    language: "German",
    level: "C1",
    rating: 4.7,
    price: "$22/hr",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
};

const REVIEWS = [
  {
    id: 1,
    name: "Lennox Fairchild",
    when: "1 week ago",
    rating: 4.5,
    text: "Maria explains grammar in a way that finally clicks. Patient and well-prepared.",
  },
  {
    id: 2,
    name: "Astrid Coltrane",
    when: "3 weeks ago",
    rating: 5,
    text: "Best Spanish tutor I've worked with — homework was super useful.",
  },
  {
    id: 3,
    name: "Diego Romero",
    when: "1 month ago",
    rating: 4,
    text: "Lessons are well structured. Sometimes wish we'd practice more speaking.",
  },
];

const LESSONS = [
  "Lesson 1: Basic Greetings",
  "Lesson 2: Common Phrases",
  "Lesson 3: Numbers",
  "Lesson 4: Directions",
];

export default function TutorProfileStudent() {
  const { tutorId } = useLocalSearchParams();
  const { savedTutorIds, toggleSavedTutor } = useUser();

  const tutor = TUTORS[tutorId] || TUTORS[1];
  const saved = savedTutorIds.includes(tutor.id);

  const avgRating = (
    REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length
  ).toFixed(1);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
            <Ionicons name="chevron-back" size={22} color="#FFFBFA" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Tutor Profile</Text>

          <TouchableOpacity
            style={styles.saveIconBtn}
            onPress={() => toggleSavedTutor(tutor.id)}
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={20}
              color="#FF9E6D"
            />
          </TouchableOpacity>
        </View>

        <Image source={{ uri: tutor.image }} style={styles.avatar} />

        <Text style={styles.name}>{tutor.name}</Text>
        <Text style={styles.level}>
          {tutor.language} {tutor.level}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.info}>{avgRating} ★</Text>
          <Text style={styles.info}>{REVIEWS.length} reviews</Text>
          <Text style={styles.info}>{tutor.price}</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => router.push("/payment")}
          >
            <Text style={styles.bookText}>Book Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveBtn, saved && styles.saveBtnActive]}
            onPress={() => toggleSavedTutor(tutor.id)}
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={16}
              color={saved ? "#FFFBFA" : "#FF9E6D"}
            />
            <Text
              style={[styles.saveBtnText, saved && styles.saveBtnTextActive]}
            >
              {saved ? "Saved" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.lessonHeader}>
          <Text style={styles.sectionTitle}>Lessons</Text>

          <TouchableOpacity
            onPress={() => router.push("/student-lessons-list")}
          >
            <Ionicons name="chevron-forward" size={20} color="#28221B" />
          </TouchableOpacity>
        </View>

        {LESSONS.map((lesson, index) => (
          <TouchableOpacity
            key={index}
            style={styles.lessonRow}
            onPress={() => router.push("/student-lesson-detail")}
          >
            <Text style={styles.lessonTitle}>{lesson}</Text>
            <Text style={styles.lessonTime}>
              {index < 2 ? "10/02    6:00 PM" : "10/07    7:00 PM"}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <Text style={styles.reviewsAvg}>{avgRating} ★</Text>
        </View>

        {REVIEWS.map((r) => (
          <View key={r.id} style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <View style={styles.reviewAvatar}>
                <Text style={styles.reviewAvatarText}>
                  {r.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reviewName}>{r.name}</Text>
                <Text style={styles.reviewWhen}>{r.when}</Text>
              </View>
              <Text style={styles.reviewRating}>★ {r.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.reviewText}>{r.text}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Timetable</Text>

        <View style={styles.timeCards}>
          <View style={styles.timeCard}>
            <Text style={styles.timeTitle}>Tutor's{"\n"}availability</Text>
            <View style={styles.timeLine} />

            <Text style={styles.day}>Wednesday</Text>
            <Text style={styles.time}>10 AM - 2 PM</Text>

            <View style={styles.orangeLine} />

            <Text style={styles.day}>Friday</Text>
            <Text style={styles.time}>2 PM - 4 PM</Text>
          </View>

          <View style={styles.timeCard}>
            <Text style={styles.timeTitle}>Your timezone</Text>
            <View style={styles.timeLine} />

            <Text style={styles.day}>Wednesday</Text>
            <Text style={styles.time}>9 AM - 11 AM</Text>

            <View style={styles.orangeLine} />

            <Text style={styles.day}>Friday</Text>
            <Text style={styles.time}>10 AM - 12 PM</Text>
          </View>
        </View>
      </ScrollView>

      <StudentBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBFA",
    paddingHorizontal: 20,
    paddingTop: 45,
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
    fontSize: 14,
    color: "#28221B",
  },

  saveIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFF1E8",
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
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
    fontSize: 13,
    textAlign: "center",
    color: "#28221B",
    marginTop: 2,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 22,
    marginVertical: 10,
  },

  info: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#8D7C74",
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },

  bookBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF9E6D",
    justifyContent: "center",
    alignItems: "center",
  },

  bookText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#FFFBFA",
    fontWeight: "600",
  },

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#FF9E6D",
    backgroundColor: "#FFFBFA",
  },

  saveBtnActive: {
    backgroundColor: "#FF9E6D",
  },

  saveBtnText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#FF9E6D",
    fontWeight: "600",
  },

  saveBtnTextActive: {
    color: "#FFFBFA",
  },

  lessonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontFamily: "Domine",
    fontSize: 17,
    color: "#28221B",
    marginBottom: 12,
    marginTop: 8,
  },

  lessonRow: {
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  lessonTitle: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
  },

  lessonTime: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
    marginTop: 3,
  },

  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },

  reviewsAvg: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#FF9E6D",
    fontWeight: "700",
  },

  reviewCard: {
    backgroundColor: "#F8EFEC",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  reviewTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0BAA5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  reviewAvatarText: {
    fontFamily: "Outfit",
    fontSize: 12,
    fontWeight: "700",
    color: "#28221B",
  },

  reviewName: {
    fontFamily: "Outfit",
    fontSize: 13,
    fontWeight: "700",
    color: "#28221B",
  },

  reviewWhen: {
    fontFamily: "Outfit",
    fontSize: 11,
    color: "#7E6D66",
  },

  reviewRating: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#FF9E6D",
    fontWeight: "700",
  },

  reviewText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    lineHeight: 18,
  },

  timeCards: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  timeCard: {
    flex: 1,
    backgroundColor: "#F8EFEC",
    borderRadius: 12,
    padding: 12,
  },

  timeTitle: {
    fontFamily: "Domine",
    fontSize: 12,
    textAlign: "center",
    color: "#28221B",
    marginBottom: 12,
  },

  timeLine: {
    height: 1,
    backgroundColor: "#EEE",
    marginBottom: 10,
  },

  orangeLine: {
    height: 1,
    backgroundColor: "#FF9E6D",
    marginVertical: 6,
  },

  day: {
    fontFamily: "Domine",
    fontSize: 12,
    color: "#28221B",
  },

  time: {
    fontFamily: "Outfit",
    fontSize: 10,
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

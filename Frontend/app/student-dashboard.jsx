import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { useUser } from "@/contexts/user-context";

const tutorsData = [
  {
    id: 1,
    name: "Maria Gonzalez",
    language: "Spanish",
    level: "B2",
    price: "$20/hr",
    likes: 5,
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136",
  },
  {
    id: 2,
    name: "Kenji Tanaka",
    language: "Italian",
    level: "A2",
    price: "$15/hr",
    likes: 8,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  {
    id: 3,
    name: "Sophie Laurent",
    language: "French",
    level: "B1",
    price: "$18/hr",
    likes: 12,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
  },
  {
    id: 4,
    name: "Hans Müller",
    language: "German",
    level: "C1",
    price: "$22/hr",
    likes: 6,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
];

const FILTERS = ["Spanish", "French", "German", "Korean", "Italian"];

export default function StudentDashboard() {
  const { focus } = useLocalSearchParams();
  const { savedTutorIds, toggleSavedTutor } = useUser();
  const searchInputRef = useRef(null);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);
  const [lessonDone, setLessonDone] = useState(false);

  const upcomingHidden = searchFocused || search.length > 0 || !!selectedLang;
  const upcomingAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(upcomingAnim, {
      toValue: upcomingHidden ? 0 : 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [upcomingHidden, upcomingAnim]);

  useEffect(() => {
    if (focus === "search") {
      const t = setTimeout(() => searchInputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [focus]);

  const filteredTutors = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tutorsData.filter((tutor) => {
      if (selectedLang && tutor.language !== selectedLang) return false;
      if (!term) return true;
      const haystack = `${tutor.name} ${tutor.language} ${tutor.level}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [search, selectedLang]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Student Dashboard</Text>
        <TouchableOpacity
          style={styles.savedBtn}
          onPress={() => router.push("/saved-tutors")}
        >
          <Ionicons name="bookmark" size={16} color="#FF9E6D" />
          <Text style={styles.savedBtnText}>Saved</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#7E6D66" />
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Search for tutors or languages"
          placeholderTextColor="#7E6D66"
          value={search}
          onChangeText={setSearch}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearch("");
              searchInputRef.current?.blur();
            }}
          >
            <Ionicons name="close" size={18} color="#28221B" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.chipsRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
        >
          {FILTERS.map((lang) => {
            const active = selectedLang === lang;
            return (
              <TouchableOpacity
                key={lang}
                style={[styles.chip, active && styles.activeChip]}
                onPress={() => setSelectedLang(active ? null : lang)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {lang}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.tutorsHeader}>
          {selectedLang ? `${selectedLang} tutors` : "Tutors"}
        </Text>

        {filteredTutors.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="search" size={28} color="#A89080" />
            <Text style={styles.emptyTitle}>No tutors found</Text>
            <Text style={styles.emptyText}>
              Try a different name, language, or clear your filter.
            </Text>
            {(search.length > 0 || selectedLang) && (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => {
                  setSearch("");
                  setSelectedLang(null);
                }}
              >
                <Text style={styles.clearBtnText}>Clear filters</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 12 }}
          >
            {filteredTutors.map((tutor) => {
              const saved = savedTutorIds.includes(tutor.id);
              return (
                <TouchableOpacity
                  key={tutor.id}
                  style={styles.card}
                  onPress={() =>
                    router.push({
                      pathname: "/tutor-profile-student",
                      params: { tutorId: String(tutor.id) },
                    })
                  }
                >
                  <Image source={{ uri: tutor.image }} style={styles.image} />

                  <Text style={styles.tutorName}>
                    {tutor.name} · {tutor.price}
                  </Text>

                  <Text style={styles.language}>
                    {tutor.language} {tutor.level}
                  </Text>

                  <View style={styles.cardBottom}>
                    <View style={styles.likeWrap}>
                      <Ionicons
                        name="chatbubble-outline"
                        size={18}
                        color="#DD8153"
                      />
                      <Text style={styles.likeCount}>{tutor.likes}</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => toggleSavedTutor(tutor.id)}
                      hitSlop={6}
                    >
                      <Ionicons
                        name={saved ? "bookmark" : "bookmark-outline"}
                        size={20}
                        color="#DD8153"
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        <Animated.View
          pointerEvents={upcomingHidden ? "none" : "auto"}
          style={{
            opacity: upcomingAnim,
            transform: [
              {
                translateY: upcomingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-12, 0],
                }),
              },
            ],
            height: upcomingAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 220],
            }),
            overflow: "hidden",
          }}
        >
          <View style={styles.lessonHeader}>
            <Text style={styles.sectionTitle}>Upcoming Lessons</Text>

            <TouchableOpacity onPress={() => router.push("/student-lessons")}>
              <View style={styles.arrowBtn}>
                <Ionicons name="chevron-forward" size={22} color="#FFFBFA" />
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.lessonRow}
            onPress={() => setLessonDone(!lessonDone)}
          >
            <Ionicons
              name={lessonDone ? styles.completedSquare : styles.uncompletedSquare}
              size={20}
              color="#d48d3b"
            />

            <View style={{ marginLeft: 12 }}>
              <Text style={styles.lessonTitle}>Spanish Lesson</Text>
              <Text style={styles.lessonSub}>Next: Oct 10, Last: Oct 5</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Next Lesson</Text>
            <Text style={styles.infoText}>+1 day</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Last Lesson</Text>
            <Text style={styles.infoText}>-2 day</Text>
          </View>
        </Animated.View>
      </ScrollView>

      <StudentBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBFA",
    paddingTop: 50,
    paddingHorizontal: 18,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  header: {
    fontFamily: "Domine",
    fontSize: 16,
    color: "#28221B",
  },

  savedBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF1E8",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  savedBtnText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#FF9E6D",
    fontWeight: "600",
  },

  searchBox: {
    height: 38,
    backgroundColor: "#F1E5E1",
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 14,
  },

  searchInput: {
    flex: 1,
    fontFamily: "Outfit",
    fontSize: 12,
    marginLeft: 8,
    color: "#28221B",
  },

  chipsRow: {
    height: 40,
    marginBottom: 14,
  },

  chipsContent: {
    alignItems: "center",
    paddingRight: 12,
  },

  chip: {
    height: 28,
    backgroundColor: "#F1E5E1",
    paddingHorizontal: 14,
    borderRadius: 14,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  activeChip: {
    backgroundColor: "#FF9E6D",
  },

  chipText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#28221B",
  },

  chipTextActive: {
    color: "#FFFBFA",
    fontWeight: "600",
  },

  tutorsHeader: {
    fontFamily: "Domine",
    fontSize: 16,
    color: "#28221B",
    marginBottom: 10,
  },

  card: {
    width: 200,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F0EDEA",
    borderRadius: 14,
    marginRight: 12,
    paddingBottom: 12,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 110,
  },

  tutorName: {
    fontFamily: "Outfit",
    fontSize: 13,
    fontWeight: "600",
    margin: 10,
    marginBottom: 2,
    color: "#28221B",
  },

  language: {
    fontFamily: "Outfit",
    fontSize: 12,
    marginHorizontal: 10,
    color: "#7E6D66",
  },

  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 10,
  },

  likeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  likeCount: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#28221B",
  },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 24,
    backgroundColor: "#FFF1E8",
    borderRadius: 14,
    marginBottom: 18,
  },

  emptyTitle: {
    fontFamily: "Domine",
    fontSize: 14,
    color: "#28221B",
    marginTop: 8,
  },

  emptyText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
    textAlign: "center",
    marginTop: 4,
  },

  clearBtn: {
    marginTop: 12,
    backgroundColor: "#FF9E6D",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },

  clearBtnText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#FFFBFA",
    fontWeight: "600",
  },

  lessonHeader: {
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontFamily: "Domine",
    fontSize: 20,
    color: "#28221B",
  },

  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF9E6D",
    justifyContent: "center",
    alignItems: "center",
  },

  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },

  lessonTitle: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
  },

  lessonSub: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#28221B",
    marginTop: 4,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },

  infoText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
  },
});

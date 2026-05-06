import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TutorBottomNav } from "@/components/tutor-bottom-nav";
import { safeBack } from "@/hooks/use-safe-back";

export default function Reviews() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack("/tutor-dashboard")}>
          <Ionicons name="chevron-back" size={22} color="#FFFBFA" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>User reviews</Text>

        <Text style={styles.seeAll}>See All</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.mainTitle}>Your rating:</Text>
      <Text style={styles.rating}>4.5 stars</Text>

      <View style={styles.starsRow}>
        <Text style={styles.star}>★ ★ ★ ★ ★</Text>
        <Text style={styles.count}>320</Text>
      </View>

      {/* Reviews */}
      <View style={styles.review}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Good but could be better</Text>
          <Text style={styles.smallRating}>★ 3.5 stars</Text>
        </View>
        <Text style={styles.desc}>
          The food was good but the service was a bit slow.
        </Text>
        <Text style={styles.user}>Lennox Fairchild · 1 week ago</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.review}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Not impressed</Text>
          <Text style={styles.smallRating}>★ 2.5 stars</Text>
        </View>
        <Text style={styles.desc}>
          I expected more given the hype. It was just okay.
        </Text>
        <Text style={styles.user}>Astrid Coltrane · 3 weeks ago</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.review}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Amazing</Text>
          <Text style={styles.smallRating}>★ 2.5 stars</Text>
        </View>
        <Text style={styles.desc}>
          I expected more given the hype. It was just okay.
        </Text>
        <Text style={styles.user}>Astrid Coltrane · 3 weeks ago</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.review}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Nice</Text>
          <Text style={styles.smallRating}>★ 2.5 stars</Text>
        </View>
        <Text style={styles.desc}>
          I expected more given the hype. It was just okay.
        </Text>
        <Text style={styles.user}>Astrid Coltrane · 3 weeks ago</Text>
      </View>

      </ScrollView>
      <TutorBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBFA",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 45,
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

  seeAll: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#FF9E6D",
  },

  mainTitle: {
    fontFamily: "Domine",
    fontSize: 18,
    color: "#28221B",
  },

  rating: {
    fontFamily: "Domine",
    fontSize: 24,
    color: "#28221B",
    marginBottom: 10,
  },

  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  star: {
    color: "#FF9E6D",
    fontSize: 16,
    marginRight: 8,
  },

  count: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#28221B",
  },

  review: {
    marginBottom: 12,
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  reviewTitle: {
    fontFamily: "Outfit",
    fontSize: 13,
    fontWeight: "600",
    color: "#28221B",
  },

  smallRating: {
    fontFamily: "Outfit",
    fontSize: 11,
    color: "#FF9E6D",
  },

  desc: {
    fontFamily: "Outfit",
    fontSize: 11,
    color: "#444",
    marginVertical: 4,
  },

  user: {
    fontFamily: "Outfit",
    fontSize: 10,
    color: "#777",
  },

  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },

  bottomNav: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#FFFBFA",
  },
});

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { safeBack } from "@/hooks/use-safe-back";

export default function StudentWriteReview() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSend = () => {
    if (rating === 0) {
      Alert.alert("Pick a rating", "Please tap the stars to rate the lesson.");
      return;
    }
    if (!review.trim()) {
      Alert.alert(
        "Write something",
        "Please add a short review before sending.",
      );
      return;
    }
    Alert.alert(
      "Review sent",
      `${rating} ★\n\n${review.trim()}`,
      [{ text: "OK", onPress: () => router.replace("/student-dashboard") }],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack("/student-dashboard")}>
          <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
        </TouchableOpacity>
        <Text style={styles.header}>Write a Review</Text>
        <View style={{ width: 36 }} />
      </View>

      <Text style={styles.title}>How was the lesson?</Text>

      <Text style={styles.label}>Write a review for:</Text>

      <View style={styles.tutorRow}>
        <View style={styles.avatar} />
        <Text style={styles.name}>Sarah Blue ·</Text>

        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)} hitSlop={4}>
              <Ionicons
                name={star <= rating ? "star" : "star-outline"}
                size={22}
                color="#FF9E6D"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Write review here..."
        placeholderTextColor="#8D7C74"
        multiline
        value={review}
        onChangeText={setReview}
      />

      <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
        <Text style={styles.sendText}>Send</Text>
      </TouchableOpacity>
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

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF9E6D",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    fontFamily: "Domine",
    fontSize: 14,
    color: "#28221B",
  },

  title: {
    fontFamily: "Domine",
    fontSize: 20,
    color: "#28221B",
    marginBottom: 18,
  },

  label: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    marginBottom: 12,
  },

  tutorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 8,
  },

  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#BFA28F",
  },

  name: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
  },

  stars: {
    flexDirection: "row",
    gap: 4,
    marginLeft: 4,
  },

  input: {
    height: 280,
    backgroundColor: "#F1E5E1",
    borderRadius: 14,
    padding: 14,
    textAlignVertical: "top",
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
  },

  sendBtn: {
    position: "absolute",
    bottom: 22,
    left: 22,
    right: 22,
    height: 44,
    backgroundColor: "#FF9E6D",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  sendText: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#FFFBFA",
    fontWeight: "600",
  },
});

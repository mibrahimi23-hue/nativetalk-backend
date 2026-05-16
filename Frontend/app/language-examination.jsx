import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { safeBack } from "@/hooks/use-safe-back";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const examData = {
  1: {
    level: "A2",
    info: "To proceed, you are required to undergo a language examination. This step is necessary to ensure you meet the language proficiency requirements for your application.",
    buttonText: "Undergo Exam",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800",
  },
  2: {
    level: "B2",
    info: "The language certificate allows you to only teach up to level B2 depending on your certificate results.",
    buttonText: "Continue",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
  },
  3: {
    level: "C2",
    info: "The language certificate allows you to only teach up to level C2 depending on your certificate results.",
    buttonText: "Continue",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
  },
};

export default function LanguageExamination() {
  const { certId } = useLocalSearchParams();
  const data = examData[certId] || examData[1];

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language Examination</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Image */}
        <Image
          source={{ uri: data.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>
            The maximum level you can teach is {data.level}
          </Text>
          <Text style={styles.importantLabel}>Important Information!</Text>
          <Text style={styles.infoText}>{data.info}</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBtn}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => router.push("/language-exam")}
        >
          <Text style={styles.continueBtnText}>{data.buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFBFA",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 55,
    paddingBottom: 14,
    paddingHorizontal: 20,
    backgroundColor: "#FFFBFA",
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
    fontSize: 17,
    fontWeight: "600",
    color: "#28221B",
  },

  // Image
  image: {
    width: "100%",
    height: 220,
  },

  // Content
  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#28221B",
    lineHeight: 32,
    marginBottom: 16,
  },
  importantLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#28221B",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },

  // Bottom button
  bottomBtn: {
    position: "absolute",
    bottom: 34,
    left: 24,
    right: 24,
  },
  continueBtn: {
    backgroundColor: "#FF9E6D",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueBtnText: {
    color: "#FFFBFA",
    fontSize: 16,
    fontWeight: "600",
  },

  scroll: { flex: 1 },
});

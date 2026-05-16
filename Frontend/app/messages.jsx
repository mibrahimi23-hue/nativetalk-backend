import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StudentBottomNav } from "@/components/student-bottom-nav";
import { TutorBottomNav } from "@/components/tutor-bottom-nav";
import { useUser } from "@/contexts/user-context";
import { useSafeBack } from "@/hooks/use-safe-back";

const conversations = [
  {
    id: 1,
    name: "Carlos Santana",
    message: "Can we practice English later?",
    time: "9:30 AM",
    unread: false,
    color: "#C4956A",
  },
  {
    id: 2,
    name: "Yuki Tanaka",
    message: "Let's have a Japanese session tomorro...",
    time: "Yesterday",
    unread: true,
    color: "#A0785A",
  },
  {
    id: 3,
    name: "Sarah Blue",
    message: "Thanks for the great lesson!",
    time: "2d ago",
    unread: false,
    color: "#7AA088",
  },
];

export default function Messages() {
  const { role } = useUser();
  const safeBack = useSafeBack();
  const isTutor = role === "Tutor";

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
        </TouchableOpacity>
        <Text style={styles.topHeader}>Native Talk</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Messages</Text>

        {conversations.map((convo) => (
          <TouchableOpacity
            key={convo.id}
            style={styles.convoRow}
            onPress={() =>
              router.push({
                pathname: "/chat",
                params: { name: convo.name, color: convo.color },
              })
            }
          >
            <View style={[styles.avatar, { backgroundColor: convo.color }]}>
              <Text style={styles.avatarInitial}>{convo.name[0]}</Text>
            </View>

            <View style={styles.convoInfo}>
              <View style={styles.convoTop}>
                <Text style={styles.convoName}>{convo.name}</Text>
                <Text style={styles.convoTime}>{convo.time}</Text>
              </View>

              <View style={styles.convoBottom}>
                <Text style={styles.convoMessage}>{convo.message}</Text>
                {convo.unread && <View style={styles.unreadDot} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 90 }} />
      </ScrollView>

      {isTutor ? <TutorBottomNav /> : <StudentBottomNav />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#FFFBFA" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 8,
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

  topHeader: {
    fontFamily: "Domine",
    fontSize: 16,
    color: "#28221B",
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },

  title: {
    fontFamily: "Domine",
    fontSize: 24,
    marginBottom: 20,
    color: "#28221B",
  },

  convoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarInitial: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  convoInfo: { flex: 1 },

  convoTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  convoName: {
    fontFamily: "Outfit",
    fontSize: 15,
    color: "#28221B",
  },

  convoTime: {
    fontSize: 12,
    color: "#aaa",
  },

  convoBottom: {
    flexDirection: "row",
    alignItems: "center",
  },

  convoMessage: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#777",
    flex: 1,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF9E6D",
    marginLeft: 8,
  },
});

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { safeBack } from "@/hooks/use-safe-back";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const messages = [
  { id: 1, text: "Hi! How's your day going?", sent: false },
  { id: 2, text: "Pretty good, thanks! How about you?", sent: true },
  {
    id: 3,
    text: "I'm doing well. Ready for our language exchange?",
    sent: false,
  },
  { id: 4, text: "Do you want to start with some vocabulary?", sent: false },
  { id: 5, text: "Sure! Let's do it.", sent: true },
];

export default function Chat() {
  const { name, color } = useLocalSearchParams();

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack("/messages")}>
          <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <View
            style={[styles.avatar, { backgroundColor: color || "#6B8F71" }]}
          >
            <Text style={styles.avatarInitial}>
              {name ? String(name).charAt(0) : "?"}
            </Text>
          </View>

          <Text style={styles.headerName}>{name || "Chat"}</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/videocall")}>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dateSeparator}>Today</Text>

        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageRow,
              msg.sent ? styles.sentRow : styles.receivedRow,
            ]}
          >
            <View style={msg.sent ? styles.sentBubble : styles.receivedBubble}>
              <Text style={msg.sent ? styles.sentText : styles.receivedText}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.sendBtn}>
          <Ionicons name="send" size={18} color="#FFFBFA" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFBFA",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 55,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF9E6D",
    justifyContent: "center",
    alignItems: "center",
  },

  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarInitial: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  headerName: {
    fontFamily: "Outfit",
    fontSize: 15,
    color: "#28221B",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  dateSeparator: {
    textAlign: "center",
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#aaa",
    marginBottom: 16,
  },

  messageRow: {
    marginBottom: 10,
  },

  sentRow: {
    alignItems: "flex-end",
  },

  receivedRow: {
    alignItems: "flex-start",
  },

  sentBubble: {
    maxWidth: "75%",
    backgroundColor: "#FF9E6D",
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  receivedBubble: {
    maxWidth: "75%",
    backgroundColor: "#F0EDEA",
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  sentText: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#FFFBFA",
  },

  receivedText: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#28221B",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  input: {
    flex: 1,
    backgroundColor: "#F0EDEA",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#28221B",
  },

  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FF9E6D",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});

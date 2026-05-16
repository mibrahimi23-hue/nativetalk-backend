import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TutorBottomNav } from "@/components/tutor-bottom-nav";
import { useUser } from "@/contexts/user-context";
import { useSafeBack } from "@/hooks/use-safe-back";

export default function Profile() {
  const { profile, role, logout } = useUser();
  const safeBack = useSafeBack();

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const fullName =
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
    "Your Name";
  const bio =
    profile.bio ||
    (role === "Tutor"
      ? "Add a short bio so students learn what makes you a great tutor."
      : "Add a short bio so tutors get to know you.");
  const levelLine = profile.level
    ? `${profile.level}${profile.language ? ` ${profile.language}` : ""}`
    : profile.language || (role === "Tutor" ? "Tutor" : "Learner");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={22} color="#FFFBFA" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{
            uri:
              profile.avatar ||
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.bio}>{bio}</Text>
        <Text style={styles.level}>{levelLine}</Text>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push("/edit-profile")}
        >
          <Text style={styles.editText}>✎ Edit profile</Text>
        </TouchableOpacity>

        <Text style={styles.settingsTitle}>Settings</Text>

        <MenuItem icon="information-circle-outline" title="About" route="/about" />
        <MenuItem icon="lock-closed-outline" title="Privacy" route="/privacy" />
        <MenuItem
          icon="notifications-outline"
          title="Notifications"
          route="/notifications"
        />
        <MenuItem icon="settings-outline" title="Settings" route="/settings" />
        <MenuItem
          icon="help-circle-outline"
          title="More Information"
          route="/info-page"
        />

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#FFFBFA" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>

      <TutorBottomNav />
    </View>
  );
}

function MenuItem({ icon, title, route }) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => router.push(route)}
    >
      <Ionicons name={icon} size={18} color="#28221B" />
      <Text style={styles.menuText}>{title}</Text>
      <Ionicons name="chevron-forward" size={18} color="#28221B" />
    </TouchableOpacity>
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
    marginBottom: 18,
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
    fontWeight: "700",
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
  bio: {
    fontFamily: "Outfit",
    fontSize: 12,
    textAlign: "center",
    color: "#28221B",
    marginTop: 6,
    paddingHorizontal: 20,
  },
  level: {
    fontFamily: "Outfit",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    color: "#28221B",
    marginTop: 4,
  },
  editBtn: {
    height: 38,
    backgroundColor: "#FF9E6D",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 28,
  },
  editText: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#FFFBFA",
  },
  settingsTitle: {
    fontFamily: "Outfit",
    fontSize: 12,
    fontWeight: "700",
    color: "#28221B",
    marginBottom: 14,
  },
  logoutBtn: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 44,
    backgroundColor: "#DD8153",
    borderRadius: 22,
  },
  logoutText: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#FFFBFA",
    fontWeight: "600",
  },
  menuItem: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    flex: 1,
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    marginLeft: 16,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
    backgroundColor: "#FDF0EC",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

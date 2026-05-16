import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const ITEMS = [
  { icon: "home-outline", route: "/student-dashboard" },
  { icon: "book-outline", route: "/student-lessons" },
  { icon: "chatbubble-ellipses-outline", route: "/messages" },
  { icon: "bookmark-outline", route: "/saved-tutors" },
  { icon: "person-outline", route: "/student-profile" },
];

export function StudentBottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.bottomNav}>
      {ITEMS.map((it) => {
        const path = it.route.split("?")[0];
        const active = pathname === path;
        return (
          <TouchableOpacity
            key={it.route}
            onPress={() => router.push(it.route)}
            style={styles.navItem}
            activeOpacity={0.7}
          >
            <Ionicons
              name={it.icon}
              size={22}
              color={active ? "#FF9E6D" : "#28221B"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FDF0EC",
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

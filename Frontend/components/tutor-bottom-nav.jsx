import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const ITEMS = [
  { icon: "home-outline", route: "/tutor-dashboard" },
  { icon: "cash-outline", route: "/transactions" },
  { icon: "book-outline", route: "/language-lessons" },
  { icon: "chatbubble-ellipses-outline", route: "/messages" },
  { icon: "person-outline", route: "/profile" },
];

export function TutorBottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.bottomNav}>
      {ITEMS.map((it) => {
        const active = pathname === it.route;
        return (
          <TouchableOpacity
            key={it.route}
            onPress={() => router.push(it.route)}
            style={styles.navItem}
            activeOpacity={0.7}
          >
            <Ionicons
              name={it.icon}
              size={24}
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
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EFE6E1",
    paddingBottom: 10,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
});

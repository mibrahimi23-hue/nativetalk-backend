import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { C, F } from "@/constants/theme";

const TABS = [
  { label: "Home",     icon: "home",           route: "/student-dashboard" },
  { label: "Lessons",  icon: "book",           route: "/student-lessons" },
  { label: "Messages", icon: "chatbubbles",    route: "/messages" },
  { label: "Profile",  icon: "person",         route: "/profile" },
];

export function StudentBottomNav() {
  const router   = useRouter();
  const pathname = usePathname();
  const insets   = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((tab) => {
        const active = pathname === tab.route || pathname.startsWith(tab.route + "/");
        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tab}
            onPress={() => router.replace(tab.route)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              <Ionicons
                name={active ? tab.icon : `${tab.icon}-outline`}
                size={22}
                color={active ? C.primary : C.textSub}
              />
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection:   "row",
    backgroundColor: C.card,
    borderTopWidth:  1,
    borderTopColor:  C.divider,
    paddingTop:      8,
    shadowColor:     C.shadow,
    shadowOffset:    { width: 0, height: -2 },
    shadowOpacity:   0.06,
    shadowRadius:    8,
    elevation:       8,
  },
  tab: {
    flex:           1,
    alignItems:     "center",
    gap:            2,
  },
  iconWrap: {
    width:           40,
    height:          40,
    borderRadius:    20,
    alignItems:      "center",
    justifyContent:  "center",
  },
  iconWrapActive: {
    backgroundColor: C.primaryLight,
  },
  label: {
    fontFamily: F.label,
    fontSize:   10,
    color:      C.textSub,
  },
  labelActive: {
    color: C.primary,
    fontFamily: F.label,
  },
});

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "@/contexts/user-context";
import { safeBack } from "@/hooks/use-safe-back";

export default function Payment() {
  const { profile } = useUser();
  const accountEmail = (profile.email && profile.email.trim()) || "janeausten@gmail.com";
  const accountName =
    `${profile.firstName || "Jane"} ${profile.lastName || "Austen"}`
      .trim()
      .toUpperCase();

  const [activeAccount, setActiveAccount] = useState(true);

  const handleSignOut = () => {
    setActiveAccount(false);
    Alert.alert("Signed out", "PayPal account signed out from this device.");
  };

  const handleAddAccount = () => {
    Alert.alert(
      "Connect a PayPal account",
      "PayPal authentication isn't wired up in this demo build.",
    );
  };

  const handleContinue = () => {
    if (!activeAccount) {
      Alert.alert(
        "No account",
        "Please sign in to a PayPal account before continuing.",
      );
      return;
    }
    router.push("/confirm-payment");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Saved Credentials</Text>

        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardLabel}>PayPal Payment</Text>
            <View style={styles.payPalLogo}>
              <Text style={styles.payPalLogoText}>P</Text>
            </View>
          </View>

          <Text style={styles.cardEmail}>{accountEmail}</Text>
          <Text style={styles.cardName}>{accountName}</Text>
        </View>

        <Text style={styles.sectionTitle}>Update payment method</Text>

        <View style={styles.accountRow}>
          <View style={styles.payPalSmall}>
            <Text style={styles.payPalSmallText}>P</Text>
          </View>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.accountName}>
              {activeAccount
                ? `${profile.firstName || "Jane"} ${profile.lastName || "Austen"}`
                : "No account connected"}
            </Text>
            {activeAccount && (
              <Text style={styles.accountEmail}>{accountEmail}</Text>
            )}
          </View>

          {activeAccount ? (
            <TouchableOpacity onPress={handleSignOut}>
              <Text style={styles.signOut}>Sign Out</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>add account</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddAccount}>
          <View style={styles.payPalLogoLarge}>
            <Text style={styles.payPalLogoLargeText}>P</Text>
          </View>
          <Text style={styles.addBtnText}>PayPal</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF9E6D",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Domine",
    fontSize: 16,
    color: "#28221B",
  },

  sectionTitle: {
    fontFamily: "Domine",
    fontSize: 18,
    color: "#28221B",
    marginBottom: 14,
    marginTop: 6,
  },

  card: {
    backgroundColor: "#DD8153",
    borderRadius: 14,
    paddingVertical: 26,
    paddingHorizontal: 22,
    marginBottom: 28,
    minHeight: 150,
    justifyContent: "space-between",
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 38,
  },

  cardLabel: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#FFFBFA",
  },

  payPalLogo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFBFA",
    alignItems: "center",
    justifyContent: "center",
  },

  payPalLogoText: {
    fontFamily: "Domine",
    fontSize: 16,
    color: "#003087",
    fontWeight: "700",
    fontStyle: "italic",
  },

  cardEmail: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#FFFBFA",
    letterSpacing: 1.5,
    marginBottom: 6,
  },

  cardName: {
    fontFamily: "Outfit",
    fontSize: 11,
    color: "#FFFBFA",
    letterSpacing: 2,
  },

  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBFA",
    borderWidth: 1,
    borderColor: "#EFE6E1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  payPalSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFF1E8",
    alignItems: "center",
    justifyContent: "center",
  },

  payPalSmallText: {
    fontFamily: "Domine",
    fontSize: 14,
    color: "#003087",
    fontWeight: "700",
    fontStyle: "italic",
  },

  accountName: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#28221B",
    fontWeight: "600",
  },

  accountEmail: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
    marginTop: 2,
  },

  signOut: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#28221B",
    fontWeight: "600",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
    paddingHorizontal: 8,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#EFE6E1",
  },

  dividerText: {
    fontFamily: "Outfit",
    fontSize: 11,
    color: "#7E6D66",
    paddingHorizontal: 12,
  },

  addBtn: {
    backgroundColor: "#FFC439",
    borderRadius: 26,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  payPalLogoLarge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#003087",
    alignItems: "center",
    justifyContent: "center",
  },

  payPalLogoLargeText: {
    fontFamily: "Domine",
    fontSize: 14,
    color: "#FFFBFA",
    fontWeight: "700",
    fontStyle: "italic",
  },

  addBtnText: {
    fontFamily: "Domine",
    fontSize: 16,
    color: "#003087",
    fontStyle: "italic",
    fontWeight: "700",
  },

  continueBtn: {
    position: "absolute",
    bottom: 24,
    left: 22,
    right: 22,
    height: 44,
    backgroundColor: "#FF9E6D",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  continueText: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#FFFBFA",
    fontWeight: "600",
  },
});

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "@/contexts/user-context";
import { safeBack } from "@/hooks/use-safe-back";

export default function ConfirmPayment() {
  const { profile } = useUser();
  const accountEmail =
    (profile.email && profile.email.trim()) || "janeausten@gmail.com";

  const [resultStatus, setResultStatus] = useState(null); // 'success' | 'failed' | null
  const [processing, setProcessing] = useState(false);

  const confirmPayment = () => {
    if (processing) return;
    setProcessing(true);

    // Simulate a network call. Use 90% success rate so failure path can be seen.
    setTimeout(() => {
      const success = Math.random() < 0.9;
      setResultStatus(success ? "success" : "failed");
      setProcessing(false);
    }, 700);
  };

  const handleSuccessDone = () => {
    setResultStatus(null);
    router.replace("/student-dashboard");
  };

  const handleFailedRetry = () => {
    setResultStatus(null);
    confirmPayment();
  };

  const handleFailedClose = () => {
    setResultStatus(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack()}>
          <Ionicons name="chevron-back" size={20} color="#FFFBFA" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Confirm & Pay</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.line} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Order Summary</Text>

        <View style={styles.row}>
          <Text style={styles.text}>Title</Text>
          <Text style={styles.text}>Half Course Payment</Text>
        </View>

        <View style={styles.divider} />

        <View style={[styles.row, { marginTop: 14 }]}>
          <Text style={styles.bold}>Estimated Total</Text>
          <Text style={styles.bold}>$90</Text>
        </View>

        <View style={styles.paymentCard}>
          <View style={styles.paymentTopRow}>
            <Text style={styles.text}>Payment</Text>
            <TouchableOpacity onPress={() => router.push("/payment")}>
              <Text style={styles.edit}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.payPalLogo}>
              <Text style={styles.payPalLogoText}>P</Text>
            </View>
            <Text style={styles.cardEmail}>{accountEmail}</Text>
          </View>
        </View>

        <Text style={styles.confirmHeader}>Please confirm and submit your payment</Text>
        <Text style={styles.small}>
          By clicking confirm payment, you agree to{"\n"}
          Terms of use and Privacy Policy
        </Text>
      </ScrollView>

      <TouchableOpacity
        style={[styles.btn, processing && styles.btnDisabled]}
        onPress={confirmPayment}
        disabled={processing}
      >
        <Text style={styles.btnText}>
          {processing ? "Processing..." : "Confirm Payment"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={resultStatus !== null}
        transparent
        animationType="fade"
        onRequestClose={
          resultStatus === "success" ? handleSuccessDone : handleFailedClose
        }
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={
            resultStatus === "success" ? handleSuccessDone : handleFailedClose
          }
        >
          <Pressable style={styles.modalCard} onPress={() => {}}>
            {resultStatus === "success" ? (
              <>
                <View style={[styles.modalIcon, { backgroundColor: "#E5F5E0" }]}>
                  <Ionicons name="checkmark" size={40} color="#3FA66E" />
                </View>
                <Text style={styles.modalTitle}>Payment Successful</Text>
                <Text style={styles.modalText}>
                  Your session is booked. We've sent a receipt to your email.
                </Text>
                <TouchableOpacity
                  style={styles.modalPrimary}
                  onPress={handleSuccessDone}
                >
                  <Text style={styles.modalPrimaryText}>Go to dashboard</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={[styles.modalIcon, { backgroundColor: "#FBE3DA" }]}>
                  <Ionicons name="close" size={40} color="#DD8153" />
                </View>
                <Text style={styles.modalTitle}>Payment Failed</Text>
                <Text style={styles.modalText}>
                  We couldn't process your payment. Please check your account
                  and try again.
                </Text>
                <TouchableOpacity
                  style={styles.modalPrimary}
                  onPress={handleFailedRetry}
                >
                  <Text style={styles.modalPrimaryText}>Try again</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalGhost}
                  onPress={handleFailedClose}
                >
                  <Text style={styles.modalGhostText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBFA",
    paddingTop: 48,
    paddingHorizontal: 22,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
  line: {
    height: 1,
    backgroundColor: "#EADDD8",
    marginBottom: 16,
  },
  title: {
    fontFamily: "Domine",
    fontSize: 20,
    color: "#28221B",
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#EADDD8",
    marginVertical: 6,
  },
  text: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
  },
  bold: {
    fontFamily: "Outfit",
    fontSize: 14,
    fontWeight: "700",
    color: "#28221B",
  },
  paymentCard: {
    borderWidth: 1,
    borderColor: "#FF9E6D",
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
    marginBottom: 20,
  },
  paymentTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  edit: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#DD8153",
    fontWeight: "600",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  payPalLogo: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#003087",
    alignItems: "center",
    justifyContent: "center",
  },
  payPalLogoText: {
    fontFamily: "Domine",
    fontSize: 13,
    color: "#FFFBFA",
    fontWeight: "700",
    fontStyle: "italic",
  },
  cardEmail: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    fontWeight: "600",
  },
  confirmHeader: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    fontWeight: "700",
    marginBottom: 6,
  },
  small: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
    lineHeight: 17,
  },
  btn: {
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
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#FFFBFA",
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(40, 34, 27, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFBFA",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
  },
  modalIcon: {
    width: 78,
    height: 78,
    borderRadius: 39,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: "Domine",
    fontSize: 20,
    color: "#28221B",
    marginBottom: 8,
    textAlign: "center",
  },
  modalText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#7E6D66",
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 22,
  },
  modalPrimary: {
    width: "100%",
    height: 44,
    backgroundColor: "#FF9E6D",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  modalPrimaryText: {
    fontFamily: "Outfit",
    fontSize: 14,
    color: "#FFFBFA",
    fontWeight: "600",
  },
  modalGhost: {
    marginTop: 10,
    width: "100%",
    height: 44,
    backgroundColor: "#F3EDEA",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  modalGhostText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    fontWeight: "600",
  },
});

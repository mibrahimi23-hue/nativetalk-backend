import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "@/contexts/user-context";

export default function VideoCall() {
  const { role } = useUser();
  const isStudent = role === "Learner";
  const [cameraOff, setCameraOff] = useState(false);
  const [micOff, setMicOff] = useState(true);
  const [showEndOptions, setShowEndOptions] = useState(false);

  const handleEndCall = () => setShowEndOptions(true);

  const goTo = (path) => {
    setShowEndOptions(false);
    router.push(path);
  };

  // Tutor-side options
  const tutorOptions = [
    {
      key: "finished",
      title: "Lesson finished",
      desc: "Grade and write a review for the student",
      icon: "checkmark-done",
      bg: "#FFE8DC",
      iconColor: "#FF9E6D",
      route: "/write-review",
    },
    {
      key: "noshow",
      title: "Student didn't join",
      desc: "Reschedule or mark the student absent",
      icon: "person-remove-outline",
      bg: "#F3EDEA",
      iconColor: "#DD8153",
      route: "/student-didnt-join",
    },
    {
      key: "cancel",
      title: "Cancel session",
      desc: "Reschedule or cancel the lesson outright",
      icon: "close-circle-outline",
      bg: "#FDE3D6",
      iconColor: "#DD8153",
      route: "/cancel-session",
    },
  ];

  // Student-side options
  const studentOptions = [
    {
      key: "finished",
      title: "Lesson finished",
      desc: "Rate the tutor and leave a review",
      icon: "star",
      bg: "#FFE8DC",
      iconColor: "#FF9E6D",
      route: "/student-write-review",
    },
    {
      key: "noshow",
      title: "Tutor didn't join",
      desc: "Reschedule the session or get a refund",
      icon: "person-remove-outline",
      bg: "#F3EDEA",
      iconColor: "#DD8153",
      route: "/tutor-didnt-join",
    },
    {
      key: "cancel",
      title: "Cancel session",
      desc: "Reschedule or cancel without refund",
      icon: "close-circle-outline",
      bg: "#FDE3D6",
      iconColor: "#DD8153",
      route: "/cancel-session-student",
    },
  ];

  const options = isStudent ? studentOptions : tutorOptions;

  const peerLabel = isStudent ? "tutor" : "student";

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: isStudent
            ? "https://images.unsplash.com/photo-1517841905240-472988babdf9"
            : "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        }}
        style={styles.video}
        resizeMode="cover"
      >
        <Text style={styles.waitingText}>
          Waiting for your {peerLabel} to join... 9:89 minutes
        </Text>

        {cameraOff && (
          <View style={styles.cameraOffBox}>
            <Text style={styles.cameraOffText}>Camera Off</Text>
          </View>
        )}

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.smallBtn,
              isStudent && { backgroundColor: "#FFFBFA" },
            ]}
            onPress={() => setCameraOff(!cameraOff)}
          >
            <Ionicons
              name={cameraOff ? "videocam" : "videocam-off"}
              size={24}
              color="#000"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.endBtn} onPress={handleEndCall}>
            <Ionicons name="call" size={30} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.smallBtn,
              isStudent && { backgroundColor: "#FFFBFA" },
            ]}
            onPress={() => setMicOff(!micOff)}
          >
            <Ionicons
              name={micOff ? "mic-off" : "mic"}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <Modal
        visible={showEndOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEndOptions(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowEndOptions(false)}
        >
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <Text style={styles.modalTitle}>End of session</Text>
            <Text style={styles.modalSubtitle}>
              Pick what happened with this session.
            </Text>

            {options.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={styles.optionRow}
                onPress={() => goTo(opt.route)}
              >
                <View style={[styles.optionIcon, { backgroundColor: opt.bg }]}>
                  <Ionicons name={opt.icon} size={20} color={opt.iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionTitle}>{opt.title}</Text>
                  <Text style={styles.optionDesc}>{opt.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#28221B" />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowEndOptions(false)}
            >
              <Text style={styles.cancelBtnText}>Keep call open</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },

  video: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 58,
  },

  waitingText: {
    alignSelf: "flex-start",
    marginLeft: 8,
    backgroundColor: "#FFFBFA",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontFamily: "Outfit",
    fontSize: 9,
    color: "#28221B",
  },

  cameraOffBox: {
    position: "absolute",
    top: 140,
    left: 40,
    right: 40,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  cameraOffText: {
    fontFamily: "Outfit",
    fontSize: 18,
    color: "#FFFBFA",
  },

  bottomBar: {
    height: 95,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 22,
  },

  smallBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#DD8153",
    justifyContent: "center",
    alignItems: "center",
  },

  endBtn: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-end",
  },

  modalSheet: {
    backgroundColor: "#FFFBFA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 22,
    paddingHorizontal: 22,
    paddingBottom: 32,
  },

  modalTitle: {
    fontFamily: "Domine",
    fontSize: 18,
    color: "#28221B",
    textAlign: "center",
  },

  modalSubtitle: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 18,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#28221B",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  optionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  optionTitle: {
    fontFamily: "Outfit",
    fontSize: 14,
    fontWeight: "600",
    color: "#28221B",
  },

  optionDesc: {
    fontFamily: "Outfit",
    fontSize: 12,
    color: "#7E6D66",
    marginTop: 2,
  },

  cancelBtn: {
    marginTop: 8,
    height: 42,
    borderRadius: 22,
    backgroundColor: "#F3EDEA",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelBtnText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    fontWeight: "600",
  },
});

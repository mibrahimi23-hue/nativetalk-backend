import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "@/contexts/user-context";

export default function AdminLogin() {
  const { setRole, setProfile } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const signIn = () => {
    if (!username || !password) {
      Alert.alert("Missing Info", "Please enter username and password");
      return;
    }

    setRole("Admin");
    setProfile({
      firstName: username.includes("@") ? username.split("@")[0] : username,
      email: username.includes("@") ? username : `${username}@nativetalk.com`,
    });

    router.replace("/admin-dashboard");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Portal</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#7E6D66"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#7E6D66"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.signBtn} onPress={signIn}>
        <Text style={styles.signText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotBtn}
        onPress={() => Alert.alert("Forgot Password", "Reset link sent")}
      >
        <Text style={styles.forgotText}>Forgot Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBFA",
    paddingHorizontal: 28,
    paddingTop: 125,
  },

  title: {
    fontFamily: "Domine",
    fontSize: 28,
    textAlign: "center",
    color: "#28221B",
    marginBottom: 24,
  },

  input: {
    height: 40,
    backgroundColor: "#F1E5E1",
    borderRadius: 13,
    paddingHorizontal: 14,
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
    marginBottom: 12,
  },

  signBtn: {
    height: 38,
    backgroundColor: "#FF9E6D",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 42,
  },

  signText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#FFFBFA",
  },

  forgotBtn: {
    height: 38,
    backgroundColor: "#F1E5E1",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  forgotText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
  },
});

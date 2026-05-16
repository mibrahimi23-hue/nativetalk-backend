import { Link, router } from "expo-router";
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

export default function LoginScreen() {
  const { role, setRole, setProfile } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAs, setLoginAs] = useState(role === "Tutor" ? "Tutor" : "Learner");

  const handleLogin = () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing information", "Please enter your email and password.");
      return;
    }

    setRole(loginAs);
    setProfile({ email: email.trim() });

    if (loginAs === "Tutor") {
      router.replace("/tutor-dashboard");
    } else {
      router.replace("/student-dashboard");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>NativeTalk</Text>

      <Text style={styles.title}>Welcome Back</Text>

      <View style={styles.roleRow}>
        <TouchableOpacity
          style={[styles.roleBtn, loginAs === "Learner" && styles.roleBtnActive]}
          onPress={() => setLoginAs("Learner")}
        >
          <Text
            style={[
              styles.roleText,
              loginAs === "Learner" && styles.roleTextActive,
            ]}
          >
            I'm a Student
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleBtn, loginAs === "Tutor" && styles.roleBtnActive]}
          onPress={() => setLoginAs("Tutor")}
        >
          <Text
            style={[
              styles.roleText,
              loginAs === "Tutor" && styles.roleTextActive,
            ]}
          >
            I'm a Tutor
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#DD8153"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#DD8153"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.google}>
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>Don’t have an account?</Text>

      <Link href="/register" asChild>
        <TouchableOpacity style={styles.signupButton}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/admin-login" style={styles.adminLink}>
        Log in as Admin
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBFA",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  appName: {
    fontFamily: "Domine",
    fontSize: 18,
    marginBottom: 14,
    color: "#28221B",
  },

  title: {
    fontFamily: "Domine",
    fontSize: 28,
    marginBottom: 18,
    color: "#28221B",
  },

  roleRow: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#F1E5E1",
    borderRadius: 22,
    padding: 4,
    marginBottom: 18,
  },

  roleBtn: {
    flex: 1,
    height: 40,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  roleBtnActive: {
    backgroundColor: "#FF9E6D",
  },

  roleText: {
    fontFamily: "Outfit",
    fontSize: 13,
    color: "#28221B",
  },

  roleTextActive: {
    color: "#FFFBFA",
    fontWeight: "700",
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#DD8153",
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    color: "#28221B",
    backgroundColor: "#FFFBFA",
    fontFamily: "Outfit",
  },

  loginButton: {
    width: "100%",
    backgroundColor: "#FF9E6D",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },

  loginText: {
    color: "#FFFBFA",
    fontFamily: "Outfit",
  },

  divider: {
    height: 2,
    width: "100%",
    backgroundColor: "#DD8153",
    marginBottom: 20,
  },

  google: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#DD8153",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#FFFBFA",
  },

  googleText: {
    color: "#28221B",
    fontFamily: "Outfit",
  },

  footerText: {
    marginBottom: 10,
    color: "#28221B",
    fontFamily: "Outfit",
  },

  signupButton: {
    width: "100%",
    backgroundColor: "#FF9E6D",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },

  signupText: {
    color: "#FFFBFA",
    fontFamily: "Outfit",
  },

  adminLink: {
    marginTop: 20,
    textAlign: "center",
    color: "#DD8153",
    fontSize: 14,
    fontFamily: "Outfit",
  },
});

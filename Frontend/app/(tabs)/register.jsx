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

export default function RegisterScreen() {
  const { setProfile } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      Alert.alert(
        "Missing information",
        "Please fill in your name, email and password.",
      );
      return;
    }
    setProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    router.push("/role-section");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>

      <Text style={styles.title}>Create Your Account</Text>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="First Name"
          placeholderTextColor="#DD8153"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Surname"
          placeholderTextColor="#DD8153"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Mobile Phone (optional)"
        placeholderTextColor="#DD8153"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#DD8153"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#DD8153"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.google}>
        <Text style={styles.googleText}>Sign Up with Google</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>Already have an account?</Text>

      <Link href="/login" asChild>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBFA",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    fontFamily: "Domine",
    fontSize: 20,
    marginBottom: 10,
    color: "#28221B",
  },

  title: {
    fontFamily: "Domine",
    fontSize: 28,
    marginBottom: 25,
    color: "#28221B",
  },

  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },

  halfInput: {
    width: "48%",
  },

  input: {
    width: "100%",
    backgroundColor: "#FFFBFA",
    borderWidth: 1,
    borderColor: "#DD8153",
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    color: "#28221B",
    fontFamily: "Outfit",
  },

  signupBtn: {
    width: "100%",
    backgroundColor: "#FF9E6D",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },

  signupText: {
    color: "#FFFBFA",
    fontFamily: "Outfit",
  },

  divider: {
    height: 2,
    width: "100%",
    backgroundColor: "#DD8153",
    marginVertical: 25,
  },

  google: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#DD8153",
    backgroundColor: "#FFFBFA",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
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

  loginButton: {
    width: "100%",
    backgroundColor: "#FF9E6D",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },

  loginButtonText: {
    color: "#FFFBFA",
    fontFamily: "Outfit",
  },
});

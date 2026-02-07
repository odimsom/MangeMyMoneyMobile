import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      // Redirect handled by AuthContext
    } catch (error: any) {
      console.error(error);
      Alert.alert("Login Failed", error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Manage My Money
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Sign in to your account
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </ThemedView>

          <ThemedView style={styles.buttonContainer}>
            {isSubmitting ? (
              <ActivityIndicator size="large" />
            ) : (
              <ThemedText style={styles.button} onPress={handleLogin}>
                Sign In
              </ThemedText>
            )}
          </ThemedView>
          <ThemedText
            style={styles.linkText}
            onPress={() => router.replace("/register")}
          >
            Don&apos;t have an account? Sign Up
          </ThemedText>
        </ThemedView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: "#0a7ea4",
    borderRadius: 12,
    overflow: "hidden",
  },
  linkText: {
    textAlign: "center",
    marginTop: 20,
    color: "#0a7ea4",
    fontWeight: "600",
  },
  button: {
    color: "white",
    textAlign: "center",
    padding: 16,
    fontWeight: "bold",
    fontSize: 16,
  },
});

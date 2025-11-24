import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, useNavigation, NavigationProp } from "@react-navigation/native";
import api from "../services/api";

export default function OtpVerifyScreen() {
  const route = useRoute<any>();
  type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ResetPassword: { emailOrUsername: string };
    OtpVerify: { email: string };
    Home: undefined;
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const email = route.params?.email; // Email passed from RegisterScreen

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/Auth/verify-email", {
        email,
        code,
      });

      Alert.alert("Success", "Email verified successfully!");

      navigation.navigate("Login");
    } catch (err: any) {
      Alert.alert("Error", err.response?.data || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>

      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to:
      </Text>
      <Text style={styles.emailText}>{email}</Text>

      <TextInput
        placeholder="Enter OTP"
        style={styles.input}
        keyboardType="numeric"
        maxLength={6}
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 15 }}>
        <Text style={styles.linkText}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 15,
    color: "#666",
  },
  emailText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    letterSpacing: 5,
    fontSize: 22,
    textAlign: "center",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
  },
  linkText: {
    textAlign: "center",
    color: "#1e90ff",
    fontSize: 15,
  },
});

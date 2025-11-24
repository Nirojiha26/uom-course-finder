import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useRoute, useNavigation, NavigationProp } from "@react-navigation/native";
import { verifyOtp } from "../services/auth";

export default function OtpVerifyScreen() {
  const route = useRoute<any>();
  const email = route.params?.email;

  type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ResetPassword: { emailOrUsername: string };
    OtpVerify: { email: string };
    Home: undefined;
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code.trim()) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
await verifyOtp({ email, code });
      Alert.alert("Success", "Email verified successfully!");
      navigation.navigate("Login");
    } catch (err: any) {
      Alert.alert("Error", err.response?.data || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.title}>Email Verification</Text>
        <Text style={styles.subtitle}>Enter the 6-digit OTP sent to</Text>
        <Text style={styles.emailText}>{email}</Text>

        <TextInput
          placeholder="Enter OTP"
          placeholderTextColor="#9b9b9b"
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
            <Text style={styles.buttonText}>VERIFY</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={{ marginTop: 18 }}>
          <Text style={styles.resendText}>Resend Code</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ------------------------------- */
/*           STYLES                */
/* ------------------------------- */

const PRIMARY = "#491B6D";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: PRIMARY,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#6b6b6b",
  },
  emailText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#E7E2EF",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 22,
    textAlign: "center",
    letterSpacing: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  resendText: {
    textAlign: "center",
    color: PRIMARY,
    fontSize: 15,
    fontWeight: "700",
  },
});

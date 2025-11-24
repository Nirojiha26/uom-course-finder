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
import { useNavigation, useRoute, NavigationProp } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import { resetPassword } from "../services/auth";

export default function ResetPasswordScreen() {
  type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ResetPassword: { emailOrUsername: string };
    OtpVerify: { email: string };
    Home: undefined;
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<any>();
  const emailOrUsername = route.params?.emailOrUsername;

  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);

  // Validation Schema
  const ResetSchema = Yup.object().shape({
    code: Yup.string()
      .required("OTP is required")
      .length(6, "OTP must be 6 digits"),
    newPassword: Yup.string()
      .min(5, "Password must be at least 5 characters")
      .required("New password is required"),
  });

  const handleReset = async (values: any) => {
    setLoading(true);
    try {
      await resetPassword({
  email: emailOrUsername, 
  code: values.code,
  newPassword: values.newPassword,
});


      Alert.alert("Success", "Password has been reset!");
      navigation.navigate("Login");
    } catch (err: any) {
    
        const message =
          err?.response?.data?.errors ??
          err?.response?.data?.message ??
          err?.response?.data ??
          "Something went wrong";
    
        Alert.alert("Error", JSON.stringify(message)); // better formatting
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
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>
          Enter your OTP and create your new password.
        </Text>

        <Formik
          initialValues={{ code: "", newPassword: "" }}
          validationSchema={ResetSchema}
          onSubmit={handleReset}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={{ marginTop: 15 }}>
              {/* OTP Input */}
              <TextInput
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#9b9b9b"
                style={styles.input}
                keyboardType="numeric"
                maxLength={6}
                value={values.code}
                onChangeText={handleChange("code")}
              />
              {touched.code && errors.code && (
                <Text style={styles.error}>{errors.code}</Text>
              )}

              {/* Password with toggle */}
              <View style={styles.passwordWrap}>
                <TextInput
                  placeholder="Enter new password"
                  placeholderTextColor="#9b9b9b"
                  secureTextEntry={secure}
                  style={[styles.input, { flex: 1, borderRightWidth: 0 }]}
                  value={values.newPassword}
                  onChangeText={handleChange("newPassword")}
                />
                <TouchableOpacity
                  onPress={() => setSecure((s) => !s)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={secure ? "eye-off" : "eye"}
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
              {touched.newPassword && errors.newPassword && (
                <Text style={styles.error}>{errors.newPassword}</Text>
              )}

              {/* Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSubmit()}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
              </TouchableOpacity>

              {/* Back link */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={{ marginTop: 25 }}
              >
                <Text style={styles.linkText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* --------------------- STYLES ----------------------- */

const PRIMARY = "#491B6D";

const SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.06,
  shadowRadius: 24,
  elevation: 2,
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingTop: 90,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: PRIMARY,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    color: "#6b6b6b",
    fontSize: 14,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  input: {
    height: 52,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E7E2EF",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 15,
    color: "#222",
  },
  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
  },
  eyeButton: {
    backgroundColor: PRIMARY,
    padding: 12,
    justifyContent: "center",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  button: {
    marginTop: 14,
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    ...SHADOW,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  linkText: {
    textAlign: "center",
    color: PRIMARY,
    fontSize: 15,
    fontWeight: "600",
  },
  error: {
    color: "#ff4d4f",
    fontSize: 12,
    marginBottom: 6,
  },
});

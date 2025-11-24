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
import { useNavigation, useRoute, NavigationProp } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import api from "../services/api";

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

  const emailOrUsername = route.params?.emailOrUsername; // passed from ForgotPassword

  const [loading, setLoading] = useState(false);

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
      await api.post("/Auth/reset-password", {
        emailOrUsername,
        code: values.code,
        newPassword: values.newPassword,
      });

      Alert.alert("Success", "Password has been reset!");
      navigation.navigate("Login");
    } catch (err: any) {
      Alert.alert("Error", err.response?.data || "Invalid OTP or error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <Text style={styles.subtitle}>
        Enter the OTP sent to your email and choose a new password.
      </Text>

      <Formik<{ code: string; newPassword: string }>
        initialValues={{ code: "", newPassword: "" }}
        validationSchema={ResetSchema}
        onSubmit={handleReset}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <>
            {/* OTP */}
            <TextInput
              placeholder="Enter 6-digit OTP"
              style={styles.input}
              keyboardType="numeric"
              maxLength={6}
              value={values.code}
              onChangeText={handleChange("code")}
            />
            {touched.code && errors.code && (
              <Text style={styles.error}>{errors.code}</Text>
            )}

            {/* New Password */}
            <TextInput
              placeholder="New Password"
              style={styles.input}
              secureTextEntry
              value={values.newPassword}
              onChangeText={handleChange("newPassword")}
            />
            {touched.newPassword && errors.newPassword && (
              <Text style={styles.error}>{errors.newPassword}</Text>
            )}

            {/* Submit */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Reset Password</Text>
              )}
            </TouchableOpacity>

            {/* Back to login */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={{ marginTop: 20 }}
            >
              <Text style={styles.linkText}>Back to Login</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
}

// -------------------------------
// Styles
// -------------------------------
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
    marginBottom: 15,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 15,
    marginBottom: 25,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  error: {
    color: "red",
    fontSize: 13,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  linkText: {
    textAlign: "center",
    color: "#1e90ff",
    fontSize: 15,
  },
});

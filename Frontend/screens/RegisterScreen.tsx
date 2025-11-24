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
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import { registerUser } from "../services/auth";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { emailOrUsername: string };
  OtpVerify: { email: string };
  Home: undefined;
};

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);

  const RegisterSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(5, "Password must be at least 5 characters")
      .required("Password is required"),
  });

  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
await registerUser(values);
      Alert.alert("Success", "OTP sent to your email");
      navigation.navigate("OtpVerify", { email: values.email });
    } catch (err: any) {
      Alert.alert("Error", err.response?.data || "Something went wrong");
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Register to get started</Text>

        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              {/* Username */}
              <Text style={styles.label}>Username</Text>
              <TextInput
                placeholder="Enter username"
                placeholderTextColor="#9b9b9b"
                style={styles.input}
                value={values.username}
                onChangeText={handleChange("username")}
              />
              {touched.username && errors.username && (
                <Text style={styles.error}>{errors.username}</Text>
              )}

              {/* Email */}
              <Text style={[styles.label, { marginTop: 14 }]}>Email Address</Text>
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#9b9b9b"
                style={styles.input}
                value={values.email}
                onChangeText={handleChange("email")}
                keyboardType="email-address"
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              {/* Password */}
              <Text style={[styles.label, { marginTop: 14 }]}>Password</Text>
              <View style={styles.passwordWrap}>
                <TextInput
                  placeholder="Create a password"
                  placeholderTextColor="#9b9b9b"
                  style={[styles.input, { flex: 1, borderRightWidth: 0 }]}
                  secureTextEntry={secure}
                  value={values.password}
                  onChangeText={handleChange("password")}
                />

                <TouchableOpacity
                  onPress={() => setSecure((prev) => !prev)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={secure ? "eye-off" : "eye"}
                    size={22}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}

              {/* Register Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSubmit()}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>REGISTER</Text>
                )}
              </TouchableOpacity>

              {/* Redirect */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.footerLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: PRIMARY,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#6b6b6b",
    marginTop: 4,
    marginBottom: 26,
    fontSize: 14,
  },
  form: {
    marginTop: 8,
  },
  label: {
    fontSize: 13,
    color: "#333",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E7E2EF",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 6,
  },
  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 6,
  },
  eyeButton: {
    backgroundColor: PRIMARY,
    padding: 12,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 14,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  footer: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  footerLink: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: "700",
  },
  error: {
    color: "#ff4d4f",
    fontSize: 12,
    marginBottom: 4,
  },
});

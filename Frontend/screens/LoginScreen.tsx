import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { saveToken } from "../utils/Storage";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { emailOrUsername: string };
  OtpVerify: { email: string };
  Home: undefined;
};

interface LoginValues {
  emailOrUsername: string;
  password: string;
}

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);

  const LoginSchema = Yup.object().shape({
    emailOrUsername: Yup.string().required("Email or Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (values: LoginValues) => {
    setLoading(true);
    try {
      const res = await api.post("/Auth/login", values);
      const token = res.data.token;
      await saveToken(token);
      // success feedback
      Alert.alert("Success", "Logged in successfully!");
      navigation.navigate("Home");
    } catch (err: any) {
      const message =
        err?.response?.data ?? "Invalid credentials or server error";
      Alert.alert("Error", typeof message === "string" ? message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Logo */}
          <Image
            source={{ uri: "file:///mnt/data/WhatsApp Image 2025-11-24 at 3.42.03 PM.jpeg" }}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.welcome}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

          <Formik<LoginValues>
            initialValues={{ emailOrUsername: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  placeholder="Enter your email or username"
                  placeholderTextColor="#9b9b9b"
                  style={[styles.input]}
                  value={values.emailOrUsername}
                  onChangeText={handleChange("emailOrUsername")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {touched.emailOrUsername && errors.emailOrUsername && (
                  <Text style={styles.error}>{errors.emailOrUsername}</Text>
                )}

                <Text style={[styles.label, { marginTop: 14 }]}>Password</Text>

                <View style={styles.passwordWrap}>
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#9b9b9b"
                    style={[styles.input, { flex: 1, borderRightWidth: 0 }]}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    secureTextEntry={secure}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setSecure((s) => !s)}
                    style={styles.eyeButton}
                    accessibilityLabel={secure ? "Show password" : "Hide password"}
                  >
                    <Ionicons
                      name={secure ? "eye-off" : "eye"}
                      size={22}
                      color="#ffffff"
                    />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}

                <TouchableOpacity
                  style={styles.forgotWrap}
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleSubmit()}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>LOG IN</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.registerWrap}>
                  <Text style={styles.registerText}>Don’t have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.registerLink}>Sign up now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------------------- STYLES ---------------------- */

const PRIMARY = "#491B6D";
const BG = "#FFFFFF";
const INPUT_BG = "#fff";
const SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.06,
  shadowRadius: 24,
  elevation: 2,
};

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 40,
    backgroundColor: BG,
    justifyContent: "flex-start",
  },
  logo: {
    width: 92,
    height: 92,
    alignSelf: "center",
    marginBottom: 18,
    borderRadius: 50,
  },
  welcome: {
    color: PRIMARY,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    color: "#6b6b6b",
    textAlign: "center",
    marginBottom: 22,
    fontSize: 14,
  },
  form: {
    marginTop: 8,
  },
  label: {
    fontSize: 13,
    color: "#333",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    height: 50,
    backgroundColor: INPUT_BG,
    borderWidth: 1,
    borderColor: "#E7E2EF",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#222",
  },
  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 0,
    overflow: "hidden",
    marginBottom: 6,
  },
  eyeButton: {
    backgroundColor: PRIMARY,
    padding: 12,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 10,
  },
  forgotText: {
    color: PRIMARY,
    fontSize: 13,
    fontWeight: "600",
  },
  button: {
    marginTop: 6,
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
  registerWrap: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  registerLink: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: "700",
  },
  error: {
    color: "#ff4d4f",
    marginTop: 6,
    fontSize: 12,
  },
});

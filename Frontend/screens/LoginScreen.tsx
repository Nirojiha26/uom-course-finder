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
import { useTheme } from "../theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

// ---------------- Navigation Types ----------------
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { emailOrUsername: string };
  OtpVerify: { email: string };
  Home: undefined;
};

// ---------------- Form Values ----------------
interface LoginValues {
  emailOrUsername: string;
  password: string;
}

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);

  // ---------------- Validation Schema ----------------
  const LoginSchema = Yup.object().shape({
    emailOrUsername: Yup.string().required("Email or Username is required"),
    password: Yup.string().required("Password is required"),
  });

  // ---------------- Login Handler ----------------
  const handleLogin = async (values: LoginValues) => {
    setLoading(true);
    try {
      const res = await api.post("/Auth/login", values);
      const token = res.data.token;

      await saveToken(token);

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

  // ----------------------------------------------------
  //                      UI
  // ----------------------------------------------------
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          {/* LOGO → FIXED AS LOCAL ASSET */}
          <Image
            source={require("../assets/logo.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={[styles.welcome, { color: colors.primary }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Login to continue
          </Text>

          {/* ---------------- Formik Form ---------------- */}
          <Formik<LoginValues>
            initialValues={{ emailOrUsername: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                {/* EMAIL / USERNAME */}
                <Text style={[styles.label, { color: colors.text }]}>
                  Email Address
                </Text>
                <TextInput
                  placeholder="Enter your email or username"
                  placeholderTextColor={colors.muted}
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.input,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={values.emailOrUsername}
                  onChangeText={handleChange("emailOrUsername")}
                  autoCapitalize="none"
                />

                {touched.emailOrUsername && errors.emailOrUsername && (
                  <Text style={styles.error}>{errors.emailOrUsername}</Text>
                )}

                {/* PASSWORD */}
                <Text
                  style={[styles.label, { marginTop: 14, color: colors.text }]}
                >
                  Password
                </Text>

                <View style={styles.passwordWrap}>
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor={colors.muted}
                    style={[
                      styles.input,
                      {
                        flex: 1,
                        borderRightWidth: 0,
                        backgroundColor: colors.input,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    secureTextEntry={secure}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    autoCapitalize="none"
                  />

                  <TouchableOpacity
                    onPress={() => setSecure(!secure)}
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

                {/* FORGOT PASSWORD */}
                <TouchableOpacity
                  style={styles.forgotWrap}
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text style={[styles.forgotText, { color: colors.primary }]}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                {/* LOGIN BUTTON */}
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.primary }]}
                  onPress={() => handleSubmit()}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>LOG IN</Text>
                  )}
                </TouchableOpacity>

                {/* REGISTER LINK */}
                <View style={styles.registerWrap}>
                  <Text style={[styles.registerText, { color: colors.muted }]}>
                    Don’t have an account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Register")}
                  >
                    <Text
                      style={[styles.registerLink, { color: colors.primary }]}
                    >
                      Sign up now
                    </Text>
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

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },

  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 40,
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
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 22,
    fontSize: 14,
  },

  form: { marginTop: 8 },

  label: {
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "600",
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
  },

  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 6,
  },

  eyeButton: {
    backgroundColor: PRIMARY,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  forgotWrap: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 10,
  },

  forgotText: {
    fontSize: 13,
    fontWeight: "600",
  },

  button: {
    marginTop: 6,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
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
    fontSize: 14,
  },

  registerLink: {
    fontSize: 14,
    fontWeight: "700",
  },

  error: {
    color: "#ff4d4f",
    marginTop: 6,
    fontSize: 12,
  },
});

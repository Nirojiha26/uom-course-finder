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
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import { saveToken } from "../utils/Storage";

export default function LoginScreen() {
  type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ResetPassword: { emailOrUsername: string };
    OtpVerify: { email: string };
    Home: undefined;
  };

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  // Validation Schema
  const LoginSchema = Yup.object().shape({
    emailOrUsername: Yup.string().required("Email or Username is required"),
    password: Yup.string().required("Password is required"),
  });

  interface LoginValues { emailOrUsername: string; password: string }

  const handleLogin = async (values: LoginValues) => {
    setLoading(true);

    try {
      const res = await api.post("/Auth/login", values);

      const token = res.data.token;

      // Save JWT to SecureStore
      await saveToken(token);

      Alert.alert("Success", "Logged in successfully!");

      navigation.navigate("Home"); // protected screen
    } catch (err: any) {
      Alert.alert("Error", err.response?.data || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Formik<LoginValues>
        initialValues={{ emailOrUsername: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <>
            {/* Email / Username */}
            <TextInput
              placeholder="Email or Username"
              style={styles.input}
              value={values.emailOrUsername}
              onChangeText={handleChange("emailOrUsername")}
            />
            {touched.emailOrUsername && errors.emailOrUsername && (
              <Text style={styles.error}>{errors.emailOrUsername}</Text>
            )}

            {/* Password */}
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              value={values.password}
              onChangeText={handleChange("password")}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            {/* Login Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity
              style={{ marginTop: 20 }}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.linkText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Register */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              style={{ marginTop: 10 }}
            >
              <Text style={styles.linkText}>
                Don’t have an account? Register
              </Text>
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
    marginBottom: 30,
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
    color: "#1e90ff",
    textAlign: "center",
    fontSize: 15,
  },
});

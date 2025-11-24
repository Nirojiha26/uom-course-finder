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

export default function RegisterScreen() {
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

  // -------------------------------
  // Validation Schema
  // -------------------------------
  const RegisterSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string()
      .min(5, "Password must be at least 5 characters")
      .required("Password is required"),
  });

  // -------------------------------
  // Handle Form Submit
  // -------------------------------
  interface RegisterValues { username: string; email: string; password: string }

  const handleRegister = async (values: RegisterValues) => {
    setLoading(true);
    try {
      const res = await api.post("/Auth/register", values);
      Alert.alert("Success", "OTP sent to your email");

      navigation.navigate("OtpVerify", { email: values.email });
    } catch (err: any) {
      console.log(err);
      Alert.alert("Error", err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Formik<RegisterValues>
        initialValues={{ username: "", email: "", password: "" }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <>
            {/* Username */}
            <TextInput
              placeholder="Username"
              style={styles.input}
              value={values.username}
              onChangeText={handleChange("username")}
            />
            {touched.username && errors.username && (
              <Text style={styles.error}>{errors.username}</Text>
            )}

            {/* Email */}
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={values.email}
              onChangeText={handleChange("email")}
              keyboardType="email-address"
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
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

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>

            {/* Login redirect */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={{ marginTop: 20 }}
            >
              <Text style={styles.linkText}>Already have an account? Login</Text>
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
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontSize: 13,
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
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    textAlign: "center",
    color: "#1e90ff",
    fontSize: 15,
  },
});

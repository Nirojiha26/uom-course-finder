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

export default function ForgotPasswordScreen() {
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
  const ForgotSchema = Yup.object().shape({
    emailOrUsername: Yup.string().required("Email or Username is required"),
  });

  interface ForgotValues { emailOrUsername: string }

  const handleForgot = async (values: ForgotValues) => {
    setLoading(true);
    try {
      await api.post("/Auth/forgot-password", {
        emailOrUsername: values.emailOrUsername,
      });

      Alert.alert("Success", "Password reset OTP sent to your email!");

      navigation.navigate("ResetPassword", {
        emailOrUsername: values.emailOrUsername,
      });
    } catch (err: any) {
      Alert.alert("Error", err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      <Text style={styles.subtitle}>
        Enter your email or username to receive a reset code.
      </Text>

      <Formik<ForgotValues>
        initialValues={{ emailOrUsername: "" }}
        validationSchema={ForgotSchema}
        onSubmit={handleForgot}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <>
            {/* Email or Username */}
            <TextInput
              placeholder="Email or Username"
              style={styles.input}
              value={values.emailOrUsername}
              onChangeText={handleChange("emailOrUsername")}
            />
            {touched.emailOrUsername && errors.emailOrUsername && (
              <Text style={styles.error}>{errors.emailOrUsername}</Text>
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
                <Text style={styles.buttonText}>Send Reset Code</Text>
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
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: "700",
  },
  linkText: {
    textAlign: "center",
    color: "#1e90ff",
    fontSize: 15,
  },
});

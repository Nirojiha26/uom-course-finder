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
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import { forgotPassword } from "../services/auth";

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

  const ForgotSchema = Yup.object().shape({
    emailOrUsername: Yup.string().required("Email or Username is required"),
  });

  const handleForgot = async (values: { emailOrUsername: string }) => {
  setLoading(true);
  try {
    await forgotPassword({ email: values.emailOrUsername }); // FIXED ⭐

    Alert.alert("Success", "Reset OTP has been sent to your email!");
    navigation.navigate("ResetPassword", {
      emailOrUsername: values.emailOrUsername,
    });
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
        <Text style={styles.title}>Forgot your Password?</Text>

        <Text style={styles.subtitle}>
          Enter your email address and we will send you a code to reset your password.
        </Text>

        <Formik
          initialValues={{ emailOrUsername: "" }}
          validationSchema={ForgotSchema}
          onSubmit={handleForgot}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={{ marginTop: 10 }}>
              {/* Input */}
              <TextInput
                placeholder="Enter Email or Username"
                placeholderTextColor="#9b9b9b"
                style={styles.input}
                value={values.emailOrUsername}
                onChangeText={handleChange("emailOrUsername")}
              />
              {touched.emailOrUsername && errors.emailOrUsername && (
                <Text style={styles.error}>{errors.emailOrUsername}</Text>
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
                  <Text style={styles.buttonText}>Send</Text>
                )}
              </TouchableOpacity>

              {/* Back to Login */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={{ marginTop: 22 }}
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
    marginBottom: 10,
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
    marginBottom: 12,
    fontSize: 15,
    color: "#222",
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
  linkText: {
    textAlign: "center",
    color: PRIMARY,
    fontSize: 15,
    fontWeight: "600",
  },
  error: {
    color: "#ff4d4f",
    fontSize: 12,
    marginBottom: 8,
  },
});

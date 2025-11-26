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
import { useTheme } from "../theme/ThemeProvider";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { emailOrUsername: string };
  OtpVerify: { email: string };
  Home: undefined;
};

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const ForgotSchema = Yup.object().shape({
    emailOrUsername: Yup.string().required("Email or Username is required"),
  });

  const handleForgot = async (values: { emailOrUsername: string }) => {
    setLoading(true);
    try {
      await forgotPassword({ email: values.emailOrUsername });

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

      Alert.alert("Error", JSON.stringify(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.title, { color: colors.primary }]}>
          Forgot your Password?
        </Text>

        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Enter your email and we will send you a code to reset your password.
        </Text>

        <Formik
          initialValues={{ emailOrUsername: "" }}
          validationSchema={ForgotSchema}
          onSubmit={handleForgot}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={{ marginTop: 10 }}>
              <TextInput
                placeholder="Enter Email or Username"
                placeholderTextColor={colors.muted}
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={values.emailOrUsername}
                onChangeText={handleChange("emailOrUsername")}
              />
              {touched.emailOrUsername && errors.emailOrUsername && (
                <Text style={styles.error}>{errors.emailOrUsername}</Text>
              )}

              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={() => handleSubmit()}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={{ marginTop: 22 }}
              >
                <Text style={[styles.linkText, { color: colors.primary }]}>
                  Back to Login
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* --------------------- STYLES ----------------------- */

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingTop: 90,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 15,
  },
  button: {
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
    fontSize: 15,
    fontWeight: "600",
  },
  error: {
    color: "#ff4d4f",
    fontSize: 12,
    marginBottom: 8,
  },
});

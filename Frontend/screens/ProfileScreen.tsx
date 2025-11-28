import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { getProfile, updateProfile } from "../services/auth";
import { removeToken } from "../utils/Storage"; // IMPORTANT
import { useTheme } from "../theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const { colors, dark, toggle } = useTheme();

  // Load profile
  useEffect(() => {
    getProfile()
      .then((res: any) => {
        setFullName(res.data.fullName || "");
        setUsername(res.data.username || "");
        setEmail(res.data.email || "");
      })
      .catch(() => Alert.alert("Error", "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  // Save profile
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ fullName, username });

      const refreshed: any = await getProfile();
      setFullName(refreshed.data.fullName || "");
      setUsername(refreshed.data.username || "");

      Alert.alert("Success", "Profile updated!");
    } catch (err: any) {
      const msg = err?.response?.data ?? err?.message ?? "Update failed";
      Alert.alert("Error", msg);
    }
    setSaving(false);
  };

  // Logout Handler
  const handleLogout = async () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await removeToken();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* PROFILE HEADER */}
      <View
        style={[
          styles.profileCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Image
          source={{
            uri: "https://t3.ftcdn.net/jpg/15/34/03/58/360_F_1534035806_6gn57ou4V0dVZY6l30h6nEB5gWQRAP6v.jpg",
          }}
          style={[styles.avatar, { borderColor: colors.primary }]}
        />

        <View>
          <Text style={[styles.hello, { color: colors.muted }]}>Hello,</Text>
          <Text style={[styles.usernameText, { color: colors.primary }]}>
            {username}
          </Text>
        </View>
      </View>

      {/* SETTINGS SECTION */}
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>
        Settings
      </Text>

      {/* Dark Mode */}
      <View style={[styles.row, { borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
        <Switch
          value={dark}
          onValueChange={toggle}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#fff"
        />
      </View>

      {/* ACCOUNT INFO */}
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>
        Account Information
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full name"
        placeholderTextColor={colors.muted}
      />

      <Text style={[styles.label, { color: colors.text }]}>Username</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        placeholderTextColor={colors.muted}
      />

      <Text style={[styles.label, { color: colors.text }]}>Email</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        editable={false}
        value={email}
      />

      {/* SAVE BUTTON */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleSave}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity
        style={[styles.logoutBtn, { borderColor: colors.primary }]}
        onPress={handleLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color={colors.primary}
          style={{ marginRight: 6 }}
        />
        <Text style={[styles.logoutText, { color: colors.primary }]}>
          Logout
        </Text>
      </TouchableOpacity>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: { padding: 20 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  profileCard: {
    marginTop: 30,
    marginBottom: 25,
    borderRadius: 25,
    padding: 20,
    flexDirection: "row",
    gap: 20,
    alignSelf: "center",
    width: "95%",
    borderWidth: 1,
    alignItems: "center",
  },

  avatar: {
    width: 85,
    height: 85,
    borderRadius: 42,
    borderWidth: 3,
  },

  hello: { fontSize: 16 },
  usernameText: { fontSize: 22, fontWeight: "700" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },

  button: {
    marginTop: 25,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  logoutBtn: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "50%",
  },

  logoutText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

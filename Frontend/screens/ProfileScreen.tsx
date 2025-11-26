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
import { useTheme } from "../theme/ThemeProvider";

export default function ProfileScreen() {
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

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* TOP PROFILE SECTION */}
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

      {/* DARK MODE TOGGLE */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
        <Switch
          value={dark}
          onValueChange={toggle}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#fff"
        />
      </View>

      {/* FORM FIELDS */}
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

      <Text style={[styles.label, { color: colors.text }]}>Email (Read only)</Text>
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

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  profileCard: {
    marginTop: 40,
    marginBottom: 30,
    borderRadius: 25,
    padding: 20,
    flexDirection: "row",
    gap: 20,
    alignSelf: "center",
    width: "95%",
    borderWidth: 1,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
  },

  hello: { fontSize: 16 },

  usernameText: { fontSize: 22, fontWeight: "700" },

  label: {
    fontSize: 14,
    marginTop: 15,
    marginBottom: 5,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },

  button: {
    marginTop: 30,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { getProfile, updateProfile } from "../services/auth";

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Load profile
  useEffect(() => {
    getProfile()
      .then((res: any) => {
        setFullName(res.data.fullName);
        setUsername(res.data.username);
        setEmail(res.data.email);
      })
      .catch(() => Alert.alert("Error", "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);

    try {
      await updateProfile({ fullName, username });

      Alert.alert("Success", "Profile updated!");
    } catch (err) {
      Alert.alert("Error", "Update failed");
    }

    setSaving(false);
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#491B6D" />
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Profile</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Email (Read only)</Text>
      <TextInput
        style={[styles.input, { backgroundColor: "#eee" }]}
        editable={false}
        value={email}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const PRIMARY = "#491B6D";

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    fontSize: 25,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 20,
  },
  label: { fontSize: 14, marginTop: 15, marginBottom: 5, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  button: {
    marginTop: 30,
    backgroundColor: PRIMARY,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

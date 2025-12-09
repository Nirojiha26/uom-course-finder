import React, { useState, useEffect } from "react";
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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getProfile, updateProfile } from "../services/auth";
import { useTheme } from "../theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfileScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // For showing the image (URL from backend or file:// from picker)
  const [profileImage, setProfileImage] = useState<string | null>(null);
  // The original image URL from backend (to check if changed)
  const [originalProfileImage, setOriginalProfileImage] = useState<string | null>(null);
  // Base64 data to send to backend when image is changed
  const [profileImageBase64, setProfileImageBase64] = useState<string | null>(null);

  const { colors } = useTheme();

  // Load profile data
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res: any = await getProfile();

      setFullName(res.data.fullName || "");
      setUsername(res.data.username || "");
      setEmail(res.data.email || "");

      // 🔹 use profileImageUrl from backend
      const imageUrl = res.data.profileImageUrl || null;
      setProfileImage(imageUrl);
      setOriginalProfileImage(imageUrl);

      // clear base64 when loading from server
      setProfileImageBase64(null);
    } catch (error) {
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    try {
      console.log("Starting image picker...");

      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please grant gallery permissions to upload a profile picture"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true, // 🔹 we need base64
      });

     

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
      

        // Local preview
        setProfileImage(asset.uri);

        // Build base64 string to send to backend
        if (asset.base64) {
          const mimeType = asset.mimeType || "image/jpeg";
          const base64String = `data:${mimeType};base64,${asset.base64}`;
          setProfileImageBase64(base64String);
        }
      } else {
        console.log("Image selection canceled or failed");
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to open gallery. Please try again.");
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please grant camera permissions to take a profile picture"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true, // 🔹 we need base64
      });

    

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // Local preview
        setProfileImage(asset.uri);

        if (asset.base64) {
          const mimeType = asset.mimeType || "image/jpeg";
          const base64String = `data:${mimeType};base64,${asset.base64}`;
          setProfileImageBase64(base64String);
        }
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to open camera. Please try again.");
    }
  };

  // Show image source options
  const showImageOptions = () => {
    Alert.alert(
      "Profile Picture",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: takePhoto,
        },
        {
          text: "Choose from Gallery",
          onPress: pickImage,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  // Save profile
  const handleSave = async () => {
    if (!fullName.trim() || !username.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const updateData: any = {
        fullName: fullName.trim(),
        username: username.trim(),
      };

      // 🔹 Only send image if user changed it and we have base64
      if (profileImage !== originalProfileImage && profileImageBase64) {
        updateData.profileImageBase64 = profileImageBase64;
      }

      await updateProfile(updateData);

      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (err: any) {
      const msg = err?.response?.data ?? err?.message ?? "Update failed";
      Alert.alert("Error", msg);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { borderColor: colors.border }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Edit Profile
          </Text>
        </View>

        {/* Profile Picture Section */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : {
                      uri: "https://t3.ftcdn.net/jpg/15/34/03/58/360_F_1534035806_6gn57ou4V0dVZY6l30h6nEB5gWQRAP6v.jpg",
                    }
              }
              style={[styles.profileImage, { borderColor: colors.primary }]}
            />
            <TouchableOpacity
              style={[styles.cameraButton, { backgroundColor: colors.primary }]}
              onPress={showImageOptions}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.imageText, { color: colors.text }]}>
            Tap to change profile picture
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
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
            placeholder="Enter your full name"
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
            placeholder="Enter your username"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
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
            value={email}
            editable={false}
            placeholder="Email"
            placeholderTextColor={colors.muted}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  imageSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  imageText: {
    fontSize: 14,
    marginTop: 15,
    color: "#666",
  },
  formSection: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

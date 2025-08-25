import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { updateUser } from "../firestore_service/users";
import styles from "../styles.js/updateProfileStyle";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (!storedData) {
          Alert.alert("Error", "No user data found.");
          return;
        }
        const userData = JSON.parse(storedData);
        setUserId(userData.id);
        setName(userData.name || "");
        setPhone(userData.phone || "");
        setEmail(userData.email || "");
        setGender(userData.gender || "");
        setImage(userData.profileImage || null);
      } catch (error) {
        console.error("Error loading user data:", error);
        Alert.alert("Error", "Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "We need access to your media library.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri);
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a valid name.");
      return;
    }
    if (!userId) {
      Alert.alert("Error", "User not found.");
      return;
    }
    try {
      const updatedData = {
        name,
        phone,
        email,
        gender,
        profileImage: image,
        updated_at: Date.now(),
      };
      await updateUser(userId, updatedData);
      const storedData = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(storedData);
      const newUserData = { ...userData, ...updatedData };
      await AsyncStorage.setItem("userData", JSON.stringify(newUserData));
      Alert.alert("Success", "Profile updated!");
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Edit Profile</Text>

      <View style={styles.profileImageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Pick Image</Text>
          </View>
        )}
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.changePhoto}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        placeholderTextColor="#aaa"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          dropdownIconColor="#000000"
          style={{ color: "#000000", backgroundColor: "#ffffff" }}
        >
          <Picker.Item label="Select Gender" value="" color="#aaa" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      <TouchableOpacity onPress={handleUpdate} style={styles.button}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>

      <Text style={styles.userIdText}>
        {userId ? `Your ID: ${userId}` : "No user ID"}
      </Text>
    </View>
  );
};

export default UpdateProfile;

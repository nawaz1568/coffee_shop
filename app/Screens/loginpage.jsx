import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { collection, query, where, getDocs } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles.js/loginStyles"; // <-- Import styles

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordError(text.length < 6 ? "Password must be at least 6 characters!" : "");
  };

  const handleLogin = async () => {
    if (passwordError) {
      Alert.alert("Error", "Please enter a valid password.");
      return;
    }

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Error", "User not found. Please register first.");
        return;
      }

      let userData = null;
      querySnapshot.forEach((doc) => {
        userData = { id: doc.id, ...doc.data() };
      });

      if (userData && userData.password === password) {
        Alert.alert("Success", "Login successful!");
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        await AsyncStorage.setItem("isLoggedIn", "true");
        navigation.navigate("BottomTabs");
      } else {
        Alert.alert("Error", "Incorrect password. Try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Try again later.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Invalid email format. Please enter a valid email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Password Reset Error:", error);
      if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email. Please enter a correct email address.");
      } else if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "No account found with this email.");
      } else {
        Alert.alert("Error", "Failed to send reset email. Try again later.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Image source={require("../../assets/images/coffecup.png")} style={styles.image} />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={(text) => setEmail(text.trim())}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.submitButton, passwordError ? styles.disabledButton : {}]} 
        onPress={handleLogin}
        disabled={passwordError !== ""}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("RegisterPage")}>
        <Text style={styles.registerText}>New user? Register</Text>
      </TouchableOpacity>
    </View>
  );
}
 
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import {
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getUsers } from "../firestore_service/users";
import styles from "../styles.js/onbordingstyles"; // Import external styles

export default function BlackScreen() {
  const navigation = useNavigation();
  
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "30168406553-qd42264fkjlkpvhnt6sangp92sqrommi.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.dev/@your-expo-asean123/your-app-slug", 
  });

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
          navigation.replace("BottomTabs");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const handleSignIn = async () => {
      if (response?.type === "success") {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        try {
          const userCredential = await signInWithCredential(auth, credential);
          const user = userCredential.user;
          const userData = {
            name: user.displayName || "No Name",
            email: user.email,
            id: user.uid,
            profileImage: user.photoURL || null,
            created_at: Date.now(),
            updated_at: Date.now(),
          };

          await addUser(userData);
          await AsyncStorage.setItem("userData", JSON.stringify(userData));
          await AsyncStorage.setItem("isLoggedIn", "true");
          navigation.replace("BottomTabs");
        } catch (error) {
          Alert.alert("Google Sign-In Failed", error.message);
        }
      }
    };
    handleSignIn();
  }, [response]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/coffecup.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>
        Coffee so good{"\n"}your taste buds{"\n"} will love it.
      </Text>
      <Text style={styles.subtitle}>
        The best grain, the finest roast, the {"\n"}powerful flavor.
      </Text>

      <TouchableOpacity
        onPress={() => promptAsync()}
        style={styles.googleButton}
        disabled={!request}
      >
        <Image
          source={require("../../assets/images/download.png")}
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("LoginPage")}
        style={styles.googleButton}
      >
        <Text style={styles.googleText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const deleteUser = async (userId, navigation) => {
  if (!userId || typeof userId !== "string") {
    console.error("Invalid user ID provided:", userId);
    throw new Error("Invalid user ID");
  }

  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
    console.log("User successfully deleted");
  } catch (error) {
    console.error("Error deleting user from Firestore:", error);
    throw error;
  }
};
const handleLogin = async (email, password, navigation, setPasswordError) => {
  if (!password) {
    setPasswordError(true);
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
    querySnapshot.forEach((docSnap) => {
      userData = { id: docSnap.id, ...docSnap.data() };
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

const addUser = async (data) => {
  try {
    await addDoc(collection(db, "users"), data);
    console.log("User added successfully!");
  } catch (error) {
    console.error("Error adding user: ", error);
  }
};
const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
};
const updateUser = async (userId, newData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, newData);
    console.log("User updated successfully!");
  } catch (error) {
    console.error("Error updating user: ", error);
  }
};
const Register = async (name, email, password, confirmPassword, phone, gender) => {
  if (!name || !email || !password || !confirmPassword || !phone || !gender) {
    Alert.alert("Error", "Please fill all fields.");
    return false;
  }

  if (password !== confirmPassword) {
    Alert.alert("Error", "Passwords do not match.");
    return false;
  }

  try {
    await addDoc(collection(db, "users"), {
      name,
      email,
      password,
      phone,
      gender,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    Alert.alert("Success", "User data saved successfully!");
    return true; 
  } catch (error) {
    console.error("Error adding user:", error); 
    Alert.alert("Error", error.message);
    return false; 
  }
};
const saveUserAddress = async (userId, address) => {
  if (!address) {
    Alert.alert("Error", "Please provide a valid address.");
    return;
  }

  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      lastSelectedAddress: address, 
      updated_at: Date.now(),
    });
    console.log("Address saved successfully");
  } catch (error) {
    console.error("Error saving address:", error);
    Alert.alert("Error", "Could not save address.");
  }
};
const getUserAddress = async (userId) => {
  if (!userId) {
    console.error("User ID is missing");
    return "";
  }

  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const address = userData.address || "No address available";
      console.log("Fetched address:", address);
      return address;
    } else {
      console.warn("No document found for user ID:", userId);
      return "No address available";
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return "No address available";
  }
};

export {
  addUser,
  getUsers,
  updateUser,
  deleteUser,
  Register,
  handleLogin,
  saveUserAddress,
  getUserAddress,
};

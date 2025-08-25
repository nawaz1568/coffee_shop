import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUser, saveUserAddress } from '../firestore_service/users';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressData, setAddressData] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });
  const [user, setUser] = useState({ name: '', email: '', id: '', profileImage: null });
  const [addresses, setAddresses] = useState([]);

  // Fetch user data from AsyncStorage whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsed = JSON.parse(userData);
          setUser({
            name: parsed.name || 'No Name',
            email: parsed.email || 'No Email',
            id: parsed.id,
            profileImage: parsed.profileImage || null
          });
          if (parsed.addresses) {
            setAddresses(parsed.addresses);
          }
        }
      };
      fetchUserData();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await AsyncStorage.removeItem("userData");
          await AsyncStorage.setItem("isLoggedIn", "false");
          navigation.replace("LoginPage");
        }
      }
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert("Delete Account", "This action is irreversible. Do you want to proceed?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            if (!user.id) return;
            await deleteUser(user.id, navigation);
            await AsyncStorage.removeItem("userData");
            await AsyncStorage.setItem("isLoggedIn", "false");
            navigation.replace("LoginPage");
          } catch (error) {
            console.error("Error deleting account:", error);
            Alert.alert("Error", "Failed to delete account. Try again later.");
          }
        }
      }
    ]);
  };

  const handleSaveAddress = async () => {
    try {
      if (!user.id) return;

      const updatedAddresses = [...addresses, addressData];
      setAddresses(updatedAddresses);

      const updatedUserData = {
        ...user,
        addresses: updatedAddresses
      };
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));

      // Optionally, fetch updated data from AsyncStorage
      const updatedUserDataFromStorage = await AsyncStorage.getItem("userData");
      const parsedUpdatedUser = JSON.parse(updatedUserDataFromStorage);
      setAddresses(parsedUpdatedUser.addresses);

      Alert.alert("Success", "Address saved.");
      setShowAddressModal(false);
      setAddressData({ fullName: '', street: '', city: '', state: '', zip: '', phone: '' });
    } catch (error) {
      console.error("Error saving address:", error);
      Alert.alert("Error", "Failed to save address.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.profileSection}>
          <Image
            source={user.profileImage ? { uri: user.profileImage } : require('../../assets/images/coffee.png')}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("UpdateProfile")}>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Edit Profile</Text>
          <Feather name="edit" size={20} color="#C67C4E" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("MyAddressPage")}
      >
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>My Addresses</Text>
          <TouchableOpacity onPress={() => setShowAddressModal(true)}>
            <Feather name="map-pin" size={22} color="#C67C4E" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => setNotifications(!notifications)}>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Notifications</Text>
          <Ionicons name="notifications" size={20} color="#C67C4E" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handleLogout}>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Logout</Text>
          <Ionicons name="log-out-outline" size={20} color="#C67C4E" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, styles.redButton]} onPress={handleDeleteAccount}>
        <View style={styles.settingItem}>
          <Text style={styles.redText}>Delete Account</Text>
          <AntDesign name="delete" size={20} color="white" />
        </View>
      </TouchableOpacity>

      {/* Modal for adding new address */}
      <Modal
        visible={showAddressModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Address</Text>
            <TextInput placeholder="Street Address" style={styles.modalInput} value={addressData.street} onChangeText={text => setAddressData({ ...addressData, street: text })} />
            <TextInput placeholder="City" style={styles.modalInput} value={addressData.city} onChangeText={text => setAddressData({ ...addressData, city: text })} />
            <TextInput placeholder="State" style={styles.modalInput} value={addressData.state} onChangeText={text => setAddressData({ ...addressData, state: text })} />
            <TextInput placeholder="Zip Code" style={styles.modalInput} keyboardType="numeric" value={addressData.zip} onChangeText={text => setAddressData({ ...addressData, zip: text })} />
            <TextInput placeholder="Phone (Optional)" style={styles.modalInput} keyboardType="phone-pad" value={addressData.phone} onChangeText={text => setAddressData({ ...addressData, phone: text })} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtn} onPress={handleSaveAddress}>
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#888' }]} onPress={() => setShowAddressModal(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'black' },
  card: { backgroundColor: "#f9f9f9", padding: 20, borderRadius: 10, elevation: 3, marginBottom: 15 },
  profileSection: { flexDirection: 'row', alignItems: 'center' },
  profileImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  profileEmail: { color: 'gray' },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingText: { fontSize: 16, color: '#000' },
  redButton: { backgroundColor: "#C67C4E", borderRadius: 10, padding: 20 },
  redText: { fontSize: 16, color: "white", fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: 'white', width: '85%', padding: 20, borderRadius: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#C67C4E' },
  modalInput: { borderColor: '#ccc', borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 20, color: '#000' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { backgroundColor: '#C67C4E', padding: 12, borderRadius: 10, width: '48%', alignItems: 'center' },
  modalBtnText: { color: 'white', fontWeight: 'bold' }
});

export default SettingsScreen;
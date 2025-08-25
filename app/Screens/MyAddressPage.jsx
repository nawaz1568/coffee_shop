import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { Appbar } from "react-native-paper";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function AddressScreen({ navigation }) {
  const [addresses, setAddresses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [userId, setUserId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserId(parsed.id);
        fetchAddresses(parsed.id);
      }
    };

    const fetchAddresses = async (userId) => {
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setAddresses(userData.addresses || []);
        setSelectedAddress(userData.lastSelectedAddress || null);
      }
    };

    fetchUserData();
  }, []);

  const getAddressId = (address) => {
    return `${address.street}_${address.zip}`;
  };

  const addNewAddress = () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    const updatedAddresses = [...addresses, newAddress];
    updateUserAddresses(updatedAddresses);
    setModalVisible(false);
    setNewAddress({ street: "", city: "", state: "", zip: "" });
  };

  const updateUserAddresses = async (updatedAddresses) => {
    if (!userId) return;
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { addresses: updatedAddresses });
    setAddresses(updatedAddresses);
  };

  const handleSelectAddress = async (address) => {
    setSelectedAddress(address);
    if (userId) {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { lastSelectedAddress: address });
    }
  };

  const handleDeleteAddress = async (address) => {
    const addressId = getAddressId(address);
    const isSelectedAddress = selectedAddress && getAddressId(selectedAddress) === addressId;

    const updatedAddresses = addresses.filter(
      (item) => getAddressId(item) !== addressId
    );

    const updates = { addresses: updatedAddresses };

    if (isSelectedAddress) {
      updates.lastSelectedAddress = null;
      setSelectedAddress(null);
    }

    if (userId) {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, updates);
    }

    setAddresses(updatedAddresses);
    Alert.alert("Deleted", "Address has been deleted.");
  };

  const renderRightActions = (address) => (
    <View style={styles.swipeActionContainer}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteAddress(address)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="chevron-left" size={30} onPress={() => navigation.goBack()} />
        <Appbar.Content title="Select Address" titleStyle={styles.headerTitle} />
        <View style={styles.emptyHeader} />
      </Appbar.Header>

      <View style={styles.addressContainer}>
        <Text style={styles.title}>Saved Addresses</Text>
        {addresses.length === 0 ? (
          <Text style={styles.noAddressesText}>
            You have no saved addresses. Add one below.
          </Text>
        ) : (
          addresses.map((address, index) => (
            <Swipeable key={index} renderRightActions={() => renderRightActions(address)}>
              <TouchableOpacity
                style={[
                  styles.addressCard,
                  selectedAddress &&
                    getAddressId(selectedAddress) === getAddressId(address) &&
                    styles.selectedCard,
                ]}
                onPress={() => handleSelectAddress(address)}
              >
                <View style={styles.cardContent}>
                  <View>
                    <Text style={styles.addressText}>{address.street}</Text>
                    <Text style={styles.addressText}>
                      {address.city}, {address.state} - {address.zip}
                    </Text>
                  </View>
                  {selectedAddress &&
                    getAddressId(selectedAddress) === getAddressId(address) && (
                      <Icon name="check-circle" size={24} color="#4CAF50" />
                    )}
                </View>
              </TouchableOpacity>
            </Swipeable>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Street"
              value={newAddress.street}
              onChangeText={(text) => setNewAddress({ ...newAddress, street: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={newAddress.city}
              onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              value={newAddress.state}
              onChangeText={(text) => setNewAddress({ ...newAddress, state: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Zip Code"
              value={newAddress.zip}
              onChangeText={(text) => setNewAddress({ ...newAddress, zip: text })}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addNewAddress}>
                <Text style={styles.saveButtonText}>Save Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    elevation: 0,
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  emptyHeader: {
    width: 30,
  },
  addressContainer: {
    marginTop: 20,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  noAddressesText: {
    fontSize: 16,
    color: "gray",
    marginTop: 10,
  },
  addressCard: {
    backgroundColor: "#f8f8f8",
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 25,
    elevation: 2,
    height:100
  },
  selectedCard: {
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  addressText: {
    fontSize: 16,
    color: "#333",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 45,
    right: 35,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#C67C4E",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#C67C4E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  swipeActionContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    marginTop: 25,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 100,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { Appbar } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; 
import { saveUserAddress } from "../firestore_service/users";

import styles from "../styles.js/OrderScreenStyles"; 

export default function OrderScreen() {
  const [user, setUser] = useState({
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedAddress, setEditedAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [quantity, setQuantity] = useState(0);
  const [stockQuantity, setStockQuantity] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();

  const { product, selectedSize } = route.params || {};

  const getSizePrice = (size) => {
    if (!product || !product.priceBySize) return 0;
    const price = product.priceBySize[size];
    return price !== undefined && !isNaN(price) ? price : 0;
  };

  const unitPrice = getSizePrice(selectedSize);
  const validUnitPrice = parseFloat(unitPrice) || 0;
  const totalPrice = (validUnitPrice * quantity).toFixed(2);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");

        if (userData) {
          const parsed = JSON.parse(userData);
          if (!parsed.id) return;

          const userDocRef = doc(db, "users", parsed.id);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const firestoreUser = userSnap.data();
            setUser((prevUser) => ({
              ...prevUser,
              address: firestoreUser.lastSelectedAddress || {
                street: "Street not available",
                city: "City not available",
                state: "State not available",
                zip: "Zip not available",
              },
              id: parsed.id,
            }));
          }
        }

        if (product?.id) {
          const productDocRef = doc(db, "products", product.id);
          const productSnap = await getDoc(productDocRef);
          if (productSnap.exists()) {
            const productData = productSnap.data();
            setStockQuantity(productData.quantity || 0);
          }
        }
      } catch (error) {
        console.log("Error fetching user or product data:", error);
      }
    };

    fetchUserData();
  }, []);

  const incrementQuantity = () => {
    if (quantity < stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 0) setQuantity(quantity - 1);
  };

  const [discounts, setDiscounts] = useState([
    { id: "1", label: "10% off your first order" },
    { id: "2", label: "₹5 off orders above ₹50" },
    { id: "3", label: "Free delivery on orders over ₹100" },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % discounts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [discounts.length]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 20 }}>
        <Appbar.Header style={{ backgroundColor: "#fff", elevation: 0 }}>
          <Appbar.Action
            icon="chevron-left"
            size={30}
            onPress={() => navigation.goBack()}
          />
          <Appbar.Content
            title="Order"
            titleStyle={{ textAlign: "center", fontSize: 24, fontWeight: "bold" }}
          />
          <View style={{ width: 30, height: 30 }} />
        </Appbar.Header>
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
            Delivery Address
          </Text>
          <Text style={{ fontSize: 15, color: "gray", fontWeight: "bold" }}>
            {user.address?.street}
          </Text>
          <Text style={{ fontSize: 13, color: "gray", marginTop: 3 }}>
            {user.address?.city}, {user.address?.state}, {user.address?.zip}
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginHorizontal: 20, marginTop: 12 }}>
          {[{
              icon: "edit",
              label: "Edit Address",
              onPress: () => {
                setEditedAddress(user.address);
                setEditModalVisible(true);
              },
            },
            { icon: "note-add", label: "Add Note", onPress: () => {} },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.addressActionBtn}
              onPress={item.onPress}
            >
              <MaterialIcons name={item.icon} size={14} color="black" />
              <Text style={styles.addressActionText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Modal visible={editModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Edit Address</Text>
              {["street", "city", "state", "zip"].map((field) => (
                <TextInput
                  key={field}
                  placeholder={`Enter ${field}`}
                  value={editedAddress[field]}
                  onChangeText={(text) =>
                    setEditedAddress((prev) => ({ ...prev, [field]: text }))
                  }
                  style={styles.modalInput}
                />
              ))}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => setEditModalVisible(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
               <TouchableOpacity
  onPress={async () => {
    try {
      if (user?.id) {
        await saveUserAddress(user.id, editedAddress);
      }
      setUser((prev) => ({ ...prev, address: editedAddress }));
      setEditModalVisible(false);
    } catch (error) {
      console.log("Error updating address:", error);
    }
  }}
  style={styles.saveBtn}
>
  <Text style={styles.saveBtnText}>Save</Text>
</TouchableOpacity>

              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.productCard}>
          <Image
            source={product?.image_url ? { uri: product.image_url } : require("../../assets/images/coffee.png")}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.productName}>{product?.name}</Text>
            <Text style={styles.productDesc}>
              {product?.short_desc || "No short description found"}
            </Text>
          </View>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              onPress={decrementQuantity}
              style={[styles.qtyButton, { backgroundColor: quantity > 0 ? "white" : "red" }]}
            >
              <AntDesign name="minus" size={15} color="black" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity
              onPress={incrementQuantity}
              style={[styles.qtyButton, { backgroundColor: quantity < stockQuantity ? "white" : "gray" }]}
              disabled={quantity >= stockQuantity}
            >
              <AntDesign name="plus" size={15} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {quantity >= stockQuantity && (
          <Text style={styles.stockWarning}>You have reached the maximum stock for this item.</Text>
        )}
        <TouchableOpacity
          onPress={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % discounts.length)}
          style={styles.discountCard}
        >
          <MaterialCommunityIcons name="brightness-percent" size={22} color="white" />
          <Text style={styles.discountText}>
            {discounts[currentIndex]?.label}
          </Text>
        </TouchableOpacity>

        <View style={styles.discountDots}>
          {discounts.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: currentIndex === index ? "#C67C4E" : "#f0e6dd" },
              ]}
            />
          ))}
        </View>
        <Text style={styles.summaryTitle}>Payment Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Price {selectedSize ? `(${selectedSize})` : ""}</Text>
          <Text style={styles.summaryTextBold}>₹{validUnitPrice > 0 ? validUnitPrice.toFixed(2) : "Not Available"}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Quantity</Text>
          <Text style={styles.summaryTextBold}>{quantity}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Delivery Fee</Text>
          <Text style={styles.summaryTextBold}>₹2.00</Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.summaryTextBold}>Total Payment</Text>
          <Text style={styles.summaryTextBold}>₹{(parseFloat(totalPrice) + 2).toFixed(2)}</Text>
        </View>

        <View style={styles.orderBtnWrapper}> 
          <TouchableOpacity style={styles.orderButton} onPress={() => navigation.navigate("RazorpayPaymentScreen")}>
            <Text style={styles.orderBtnText}>Order</Text>
          </TouchableOpacity>
        </View>
      </View> 
    </ScrollView>
  );
}

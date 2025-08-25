import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import styles from '../styles.js/razorpayPaymentStyles'; // <-- Import styles

// Enable Axios request/response interceptors for debugging
axios.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

axios.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
});

const RazorpayPaymentScreen = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // 1. Create Razorpay order by calling your backend API
      const response = await axios.post('http://192.168.1.39:5000/create-order', {
        amount: 50000,  // Amount in paise (₹500)
        currency: 'INR',
      });

      const { orderId, amount, currency } = response.data; 
      console.log('Order created:', response.data);

      setLoading(false);

      // 2. Open Razorpay Payment UI
      const options = {
        description: 'Payment for Coffee Order',
        image: 'https://example.com/logo.png',
        currency: currency,
        key: '', // Put your Razorpay Test/Live Key
        amount: amount,
        name: 'Coffee Shop',
        order_id: orderId,
        prefill: {
          email: 'customer@example.com',
          contact: '9876543210',
          name: 'John Doe',
        },
        theme: { color: '#F37254' },
      };

      RazorpayCheckout.open(options)
        .then(data => {
          Alert.alert('Success', `Payment ID: ${data.razorpay_payment_id}`);
        })
        .catch(error => {
          Alert.alert('Error', `Payment failed: ${error.description}`);
        });

    } catch (error) {
      setLoading(false);
      console.error('Order creation error:', error.response || error.message);
      Alert.alert('Error', 'Failed to create Razorpay order. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.amount}>Total: ₹500</Text>

      <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>Pay Now</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default RazorpayPaymentScreen;

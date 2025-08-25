import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native";
import { Register } from "../firestore_service/users";
import CountryPicker from 'react-native-country-picker-modal';
import { LogBox } from "react-native";
import styles from '../styles.js/registerPageStyles';  // <-- import styles

LogBox.ignoreLogs([
  "Support for defaultProps", // Suppress defaultProps warning
]);

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [countryCode, setCountryCode] = useState('IN'); 
  const [callingCode, setCallingCode] = useState('91'); 
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const navigation = useNavigation(); 

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Register</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#fff"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#fff"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#fff"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {/* Country Picker and Phone Input */}
          <View style={styles.phoneContainer}>
            <TouchableOpacity 
              style={styles.countryPicker} 
              onPress={() => setShowCountryPicker(true)}
            >
              <Text style={styles.countryText}>+{callingCode}</Text>
            </TouchableOpacity>

            <CountryPicker
              withCallingCode
              withFlag
              withFilter
              withAlphaFilter
              countryCode={countryCode}
              onSelect={(country) => {
                setCountryCode(country?.cca2 || 'IN');  
                setCallingCode(country?.callingCode?.[0] || '91');  
              }}
              visible={showCountryPicker}
              onClose={() => setShowCountryPicker(false)}
            />

            <TextInput
              style={styles.phoneInput}
              placeholder="Phone Number"
              placeholderTextColor="#fff"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Gender Picker */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <TouchableOpacity 
            style={styles.submitButton}  
            onPress={async () => {
              const success = await Register(
                name, email, password, confirmPassword, `+${callingCode}${phone}`, gender
              );
              console.log("Register returned:", success);
              if (success) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'BottomTabs' }],
                });
              }
            }}
          >
            <Text style={styles.submitText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("LoginPage")}>
            <Text style={styles.loginText}>Already a user? Login here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

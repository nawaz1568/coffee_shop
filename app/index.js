import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoritesProvider } from './Screens/FavoritesContext';
import BottomTabs from './BottomTabs';
import BlackScreen from './Screens/Onboardding';
import LoginPage from './Screens/loginpage';
import RegisterPage from './Screens/registerpage';
import SettingsScreen from './Screens/settingspage';
import MyAddressPage from './Screens/MyAddressPage';
import Detail from '../app/Screens/Detailpage';
import TrackingScreen from './Screens/Mappage';
import FavoritesScreen from './Screens/favouritespage';
import OrderScreen from './Screens/OrderScreen';
import PaymentScreen from './Screens/razorpayscreen';
import UpdateProfile from './Screens/UpdateProfile';
import RazorpayPaymentScreen from './Screens/razorpayscreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
          setInitialRoute('BottomTabs'); 
        } else {
          setInitialRoute('RegisterPage'); 
        }
      } catch (error) {
        console.error('Error checking login state:', error);
        setInitialRoute('RegisterPage');
      }
    };

    checkLoginStatus();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#C67C4E" />
      </View>
    );
  }

  return (
    <FavoritesProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="BottomTabs" component={BottomTabs} />
          <Stack.Screen name="BlackScreen" component={BlackScreen} />
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen name="RegisterPage" component={RegisterPage} />
          <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
          <Stack.Screen name="MyAddressPage" component={MyAddressPage} />
          <Stack.Screen name="Detail" component={Detail} />
          <Stack.Screen name="OrderScreen" component={OrderScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
             <Stack.Screen name="TrackingScreen" component={TrackingScreen} />
          <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
            <Stack.Screen name="Razorpay" component={RazorpayPaymentScreen} />
        </Stack.Navigator>
      </GestureHandlerRootView>
    </FavoritesProvider>
  );
} 
 
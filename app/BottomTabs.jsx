import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Import your screens
import Itempage from './Screens/Itempage';
import FavoritesScreen from './Screens/favouritespage';
import OrderScreen from './Screens/OrderScreen';
import SettingsScreen from './Screens/settingspage'; 

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Itempage" // Default tab to show on start
      screenOptions={{
        tabBarStyle: { height: 55 },
        tabBarActiveTintColor: '#C67C4E', // Active tab color
        tabBarInactiveTintColor: 'black', // Inactive tab color
        tabBarLabelStyle: { fontSize: 12 }, // Optional: Adjust font size
      }}
    >
      <Tab.Screen
        name="Itempage"
        component={Itempage}
        options={{
          headerShown: false,
          tabBarLabel: 'Home', // Tab label for Itempage
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="house" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="FavoritesScreen"
        component={FavoritesScreen} // FavoritesScreen gets the context from FavoritesProvider
        options={{
          headerShown: false,
          tabBarLabel: 'Favorites', // Tab label for FavoritesScreen
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="OrderScreen"
        component={OrderScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Order', // Tab label for OrderScreen
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="shopping-bag" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Settings', // Tab label for SettingsScreen
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import { Feather, FontAwesome } from "@expo/vector-icons";
import * as Location from 'expo-location';
import styles from "../styles.js/TrackingScreenStyles"; // <-- imported styles

const TrackingScreen = () => {
  const [location, setLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 12.5290191,
    longitude: 78.2189539,
  });

  const deliveryRoute = [
    { latitude: 12.5290191, longitude: 78.2189539 }, 
    { latitude: 12.5295191, longitude: 78.2199539 }, 
    { latitude: 12.5300191, longitude: 78.2184539 }, 
    { latitude: 12.5293191, longitude: 78.2177539 }, 
    { latitude: 12.5290191, longitude: 78.2189539 },
  ];
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
    })();
  }, []);

  const animateMarker = () => {
    let currentIndex = 0;
    const stepsPerSegment = 100;
  
    const moveToNextSegment = () => {
      if (currentIndex >= deliveryRoute.length - 1) return;
  
      let step = 0;
      const interval = setInterval(() => {
        if (step <= stepsPerSegment) {
          const start = deliveryRoute[currentIndex];
          const end = deliveryRoute[currentIndex + 1];
          const latitude = start.latitude + (end.latitude - start.latitude) * (step / stepsPerSegment);
          const longitude = start.longitude + (end.longitude - start.longitude) * (step / stepsPerSegment);
          setMarkerPosition({ latitude, longitude });
          step++;
        } else {
          clearInterval(interval);
          currentIndex++;
          moveToNextSegment();
        }
      }, 50);
    };
  
    moveToNextSegment();
  };
  

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location ? location.latitude : 12.5290191,
          longitude: location ? location.longitude : 78.2189539,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={deliveryRoute[0]}>
          <FontAwesome name="motorcycle" size={24} color="red" />
        </Marker>
        <Marker coordinate={deliveryRoute[1]}>
          <FontAwesome name="map-marker" size={30} color="red" />
        </Marker>
        <Marker coordinate={markerPosition}>
          <FontAwesome name="location-arrow" size={30} color="blue" />
        </Marker>
        <Polyline coordinates={deliveryRoute} strokeWidth={3} strokeColor="brown" />
      </MapView>

      <View style={styles.infoContainer}>
        <View style={styles.centered}>
          <Text style={styles.timeText}>10 minutes left</Text>
        </View>

        <View style={styles.centered}>
          <Text style={styles.addressText}>
            Delivery to <Text style={styles.bold}>Jl. Kpg Sutoyo</Text>
          </Text>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, styles.completed]} />
            <View style={[styles.progressBar, styles.completed]} />
            <View style={[styles.progressBar, styles.incomplete]} />
            <View style={[styles.progressBar, styles.incomplete]} />
          </View>
        </View>

        <View style={styles.statusBoxWrapper}>
          <Image 
            source={require('../../assets/images/motorcycle.png')} 
            style={styles.statusImage}
          />
          <View style={styles.statusTextWrapper}>
            <Text style={styles.statusTitle}>Delivered your order</Text>
            <Text style={styles.statusDesc}>
              We deliver your goods to you in {"\n"} the shortest possible time.
            </Text>
          </View>
        </View>

        <View style={styles.courierBox}>
          <Image source={require('../../assets/images/man.png')} style={styles.boxAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.courierName}>Johan Hawn</Text>
            <Text style={styles.courierRole}>Personal Courier</Text>
          </View>
          <TouchableOpacity
            onPress={() => Linking.openURL("tel:")}
            style={styles.callButton}
          >
            <Feather name="phone-call" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.startButtonWrapper}>
        <TouchableOpacity onPress={animateMarker} style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Delivery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TrackingScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firestore_service/users';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles, { cardWidth } from '../styles.js/FavoritesScreenStyles';

const db = getFirestore(app);

const FavoritesScreen = ({ navigation }) => {
  const [allItems, setAllItems] = useState([]);
  const [favorites, setFavorites] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const favString = await AsyncStorage.getItem('favorites');
      const favs = favString ? JSON.parse(favString) : {};
      setFavorites(favs);
    } catch (error) {
      console.error('Failed to load favorites from AsyncStorage:', error);
      setFavorites({});
    }
  };

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          categoryId: data.category_id || '',
          imageUrl: data.image_url || '',
        };
      });
      setAllItems(productList);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const toggleFavorite = async (itemId) => {
    try {
      const updatedFavorites = { ...favorites };
      if (updatedFavorites[itemId]) {
        delete updatedFavorites[itemId]; // Unfavorite
      } else {
        updatedFavorites[itemId] = true; // Favorite
      }
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const init = async () => {
        setLoading(true);
        await loadFavorites();
        await fetchProducts();
        setLoading(false);
      };
      init();
    }, [])
  );

  const favoriteItems = favorites
    ? allItems.filter(item => favorites[item.id])
    : [];

  if (loading || favorites === null) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#C67C4E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Favorites</Text>

      <FlatList
        data={favoriteItems}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.favoriteIcon}
              onPress={() => toggleFavorite(item.id)}
            >
              <Icon
                name={favorites[item.id] ? 'heart' : 'heart-outline'}
                size={22}
                color={favorites[item.id] ? 'red' : '#C67C4E'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Detail', { product: item })}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description}>
                {item.description || 'With Chocolate'}
              </Text>
              <Text style={styles.price}>$ {item.price}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No favorites yet</Text>
          </View>
        )}
      />
    </View>
  );
};

export default FavoritesScreen;

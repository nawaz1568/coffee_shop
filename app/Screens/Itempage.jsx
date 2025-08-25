import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import styles from '../styles.js/BlackWhiteScreenStyles'; // Updated import path
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firestore_service/users';

const db = getFirestore(app);

const BlackWhiteScreen = () => {
  const [favorites, setFavorites] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [coffeeItems, setCoffeeItems] = useState([]);
  const [allItems, setAllItems] = useState([]);

  const navigation = useNavigation();

  const loadFavoritesFromStorage = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);

        if (selectedCategory === 'favorites') {
          const favItems = allItems.filter(item => parsedFavorites[item.id]);
          setCoffeeItems(favItems);
        }
      }
    } catch (error) {
      console.error('Error loading favorites from AsyncStorage:', error);
    }
  };

  const fetchLastSelectedAddress = async () => {
    try {
      const address = await AsyncStorage.getItem('selectedAddress');
      if (address) {
        setSelectedAddress(JSON.parse(address));
        setLoadingAddress(false);
      } else {
        const addressRef = collection(db, 'users');
        const querySnapshot = await getDocs(addressRef);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.lastSelectedAddress) {
            console.log('Fetched last selected address from Firestore:', data.lastSelectedAddress);
            setSelectedAddress(data.lastSelectedAddress);
            setLoadingAddress(false);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching selected address:', error);
      setLoadingAddress(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLastSelectedAddress();
      loadFavoritesFromStorage();
    }, [])
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categoryList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories([
          { id: null, title: 'All' },
          { id: 'favorites', title: 'Favorites' },
          ...categoryList,
        ]);
      } catch (error) {
        console.error('Error fetching categories:', error);
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
        setCoffeeItems(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const toggleFavorite = async (id) => {
    const updated = {
      ...favorites,
      [id]: !favorites[id],
    };
    setFavorites(updated);

    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving favorites to AsyncStorage:', error);
    }

    if (selectedCategory === 'favorites') {
      const favItems = allItems.filter(item => updated[item.id]);
      setCoffeeItems(favItems);
    }
  };

  const filterItems = (categoryId) => {
    handleSearchAndFilter(searchQuery, categoryId);
    setSelectedCategory(categoryId);
    if (!categoryId) {
      setCoffeeItems(allItems);
      return;
    }
    if (categoryId === 'favorites') {
      const favItems = allItems.filter(item => favorites[item.id]);
      setCoffeeItems(favItems);
      return;
    }
    const filtered = allItems.filter(item =>
      (item.categoryId || '').trim().toLowerCase() === categoryId.trim().toLowerCase()
    );
    setCoffeeItems(filtered);
  };

  const handleSearchAndFilter = (searchText, categoryId) => {
    let filteredItems = allItems;
    if (categoryId && categoryId !== 'favorites') {
      filteredItems = filteredItems.filter(
        item => (item.categoryId || '').trim().toLowerCase() === categoryId.trim().toLowerCase()
      );
    } else if (categoryId === 'favorites') {
      filteredItems = filteredItems.filter(item => favorites[item.id]);
    }
    if (searchText.trim()) {
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(searchText.trim().toLowerCase())
      );
    }
    setCoffeeItems(filteredItems);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          data={[{}]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={() => (
            <View style={styles.container}>
              {/* Top Section */}
              <View style={styles.blackSection}>
                <View style={styles.rowContainer}>
                  <View style={styles.textContainer}>
                    <Text style={styles.locationText}>Location</Text>
                    <Text style={styles.subLocationText}>
                      {loadingAddress
                        ? 'Loading address...'
                        : selectedAddress
                        ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.zip}`
                        : 'No address selected'}
                    </Text>
                  </View>
                <Image
  source={require('../../assets/images/babyimage.png')}
  style={[
    styles.image,
    { width: 45, height: 45, borderRadius: 12, marginLeft: 4 }
  ]}
/>

                </View>

                {/* Search Bar */}
                <View style={styles.searchMainView}>
                  <Icon size={20} color="white" name="search-outline" />
                  <TextInput
                    style={[styles.searchInput, { fontSize: 14, height: 35, paddingVertical: 5 }]}
                    placeholder="Search coffee"
                    placeholderTextColor="white"
                    value={searchQuery}
                    onChangeText={(text) => {
                      setSearchQuery(text);
                      handleSearchAndFilter(text, selectedCategory);
                    }}
                  />
                  <View style={{ backgroundColor: "#C67C4E", borderRadius: 12, height: 40, width: 40, alignItems: "center", justifyContent: "center" }}>
                    <FontAwesome6 color="white" size={24} name="sliders" />
                  </View>
                </View>
              </View>

              {/* White Section */}
              <View style={styles.whiteSection}>
                <ImageBackground
                  source={require('../../assets/images/coffee.png')}
                  style={styles.backgroundImage}
                  imageStyle={{ borderRadius: 10 }}
                >
                  <View style={{ position: 'absolute', top: 10, left: 10 }}>
                    <TouchableOpacity style={styles.promoContainer}>
                      <Text style={styles.promoText}>Promo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.offerContainer}>
                      <Text style={styles.offerText}>BUY ONE GET{"\n"}<Text style={{ textDecorationColor: "black" }}>ONE FREE</Text></Text>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>

                {/* Categories */}
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item.id || 'all'}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContainer}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => filterItems(item.id)}
                      style={[styles.listItem, selectedCategory === item.id && { backgroundColor: 'gray' }]}
                    >
                      <Text style={[styles.listText, { color: 'white' }]}>{item.title}</Text>
                    </TouchableOpacity>
                  )}
                />

                {/* Coffee Cards */}
                <FlatList
                  data={coffeeItems}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 2 }}
                  contentContainerStyle={styles.flatListContainer}
                  renderItem={({ item }) => (
                    <View style={styles.card}>
                      <TouchableOpacity >
                        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                      </TouchableOpacity>

                      <View style={{ position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="star" size={14} color="gold" />
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white', marginLeft: 5 }}>{item.ratings}</Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => toggleFavorite(item.id)}
                        style={{
                          position: 'absolute', top: 10, right: 10
                        }}
                      >
                        <Icon name={favorites[item.id] ? "heart" : "heart-outline"} size={22} color={favorites[item.id] ? "red" : "white"} />
                      </TouchableOpacity>

                      <Text style={styles.cardText}>{item.name}</Text>
                      <Text style={{ color: "gray", fontSize: 12 }}>{item.description || 'With Chocolate'}</Text>
                      <Text style={{ color: "black", marginTop: 5, fontSize: 20, fontWeight: "600" }}>$ {item.price}</Text>

                      {/* Just the + Icon */}
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Detail", { product: item })}
                        style={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          backgroundColor: "#C67C4E",
                          padding: 8,
                          borderRadius: 40,
                        }}
                      >
                        <Icon name="add" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  )}
                  ListEmptyComponent={() => (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                      <Text style={{ fontWeight: 'bold' }}>No products found in this category</Text>
                    </View>
                  )}
                />
              </View>
            </View>
          )}
        />
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default BlackWhiteScreen;
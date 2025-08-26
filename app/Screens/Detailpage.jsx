import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Appbar } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles.js/detailStyle'

export default function Detail({ route }) {
  const { product } = route.params || {}; 
  const defaultSize = product?.sizes?.[0] || 'M'; 
  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();
  const productName = product?.name || 'Unknown Coffee';
  const shortDescription = product?.short_desc || 'No short description available.';
  const longDescription = product?.long_desc || 'No detailed description available.';
  const productRating = product?.ratings || '4.5';
  const productPrice = product?.priceBySize?.[selectedSize] || '0';
  const productImage = product?.imageUrl
    ? { uri: product.imageUrl }
    : require('../../assets/images/coffee.png'); 

  return (
    <ScrollView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="chevron-left" size={35} onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detail" style={styles.headerTitle} />
        <Appbar.Action icon="heart-outline" size={28} />
      </Appbar.Header>
      <Image source={productImage} style={styles.coffeeImage} resizeMode="cover" />
      <View style={styles.detailsContainer}>
        <View style={styles.detailsTextContainer}>
          <Text style={styles.coffeeTitle}>{productName}</Text>
          <Text style={styles.coffeeSubtitle}>{shortDescription}</Text>

          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={22} color="#FFA500" />
            <Text style={styles.rating}>{productRating}</Text>
            <Text style={styles.ratingCount}>(230)</Text>
          </View>
        </View>

        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Entypo name="google-drive" size={20} color="#C67C4E" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Image
              source={require('../../assets/images/Maskgroup.png')}
              style={styles.iconImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descriptionText}>
          {expanded ? longDescription : longDescription.substring(0, 100) + '...'}
        </Text>
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.readMore}>
            {expanded ? 'Read Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sizeContainer}>
        <Text style={styles.sectionTitle}>Size</Text>
        <View style={styles.sizeButtonsContainer}>
          {product?.sizes?.map((size) => (
            <TouchableOpacity
              key={size}
              onPress={() => setSelectedSize(size)}
              style={[
                styles.sizeButton,
                selectedSize === size && styles.sizeButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.sizeText,
                  selectedSize === size && styles.sizeTextSelected,
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Price</Text>
        <View style={styles.priceAndButton}>
          <Text style={styles.priceText}>${productPrice}</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("OrderScreen", {
                product: product,
                selectedSize: selectedSize,
                priceBySize: product?.priceBySize?.[selectedSize] || '0.00',
              });
            }}
            style={styles.buyButton}
          >
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// context/FavoritesContext.js
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favData = await AsyncStorage.getItem('favorites');
        if (favData) setFavorites(JSON.parse(favData));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    };
    loadFavorites();
  }, []);

  const toggleFavorite = async (id) => {
    const updated = { ...favorites, [id]: !favorites[id] };
    setFavorites(updated);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

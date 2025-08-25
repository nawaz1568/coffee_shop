import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // ---------- Container ----------
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  // ---------- Header ----------
  header: {
    backgroundColor: '#fff',
    elevation: 0,
  },
  headerTitle: {
    alignItems: 'center',
  },

  // ---------- Coffee Image ----------
  coffeeImage: {
    width: '90%',
    height: 250,
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical: 10,
  },

  // ---------- Details Section ----------
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  detailsTextContainer: {
    flex: 1,
  },
  coffeeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  coffeeSubtitle: {
    color: 'gray',
    fontSize: 14,
    marginTop: 3,
  },

  // ---------- Rating ----------
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  ratingCount: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 5,
  },

  // ---------- Icons ----------
  iconContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  iconButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  iconImage: {
    width: 25,
    height: 25,
  },

  // ---------- Description ----------
  descriptionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: 'gray',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 2,
  },
  readMore: {
    color: '#C67C4E',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
  },

  // ---------- Size Selection ----------
  sizeContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sizeButtonsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  sizeButton: {
    backgroundColor: '#FFF0F0',
    paddingVertical: 10,
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  sizeButtonSelected: {
    backgroundColor: '#C67C4E',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C67C4E',
  },
  sizeTextSelected: {
    color: 'white',
  },

  // ---------- Price & Buy Button ----------
  priceContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'gray',
    marginBottom: 5,
  },
  priceAndButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#C67C4E',
  },
  buyButton: {
    backgroundColor: '#C67C4E',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '60%',
    height: 60,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'white',
  },
});

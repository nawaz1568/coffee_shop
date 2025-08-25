import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  blackSection: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 25,
    backgroundColor: '#1E1E1E',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop:35
  },
  textContainer: {
    flexDirection: 'column',
  },
  locationText: {
    color: '#B0B0B0',
    fontSize: 13,
  },
  subLocationText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    borderRadius: 12,
    width: 60,
    height: 60,
  },
  searchMainView: {
    flexDirection: 'row',
    backgroundColor: '#313131',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    color: 'white',
    marginLeft: 10,
  },
  whiteSection: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    marginTop: 50,
  },
  backgroundImage: {
    width: '100%',
    marginTop: -60,
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'flex-start',
  },
  promoContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 8,
  },
  promoText: {
    color: 'white',
    fontWeight: '500',
  },
  offerContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    padding: 5,
    borderRadius: 8,
  },
  offerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flatListContainer: {
    paddingVertical: 18,
  },
  listItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#C67C4E',
    borderRadius: 10,
    marginRight: 10,
    height: 45,
    marginTop: -10,
  },
  listText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    borderRadius: 12,
  },
  card: {
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    padding: 6,
    marginVertical: 10,
    width: '48%',
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
});

export default styles;
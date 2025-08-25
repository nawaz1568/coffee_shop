// styles/updateProfileStyle.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "white",
  },
  changePhoto: {
    marginTop: 10,
    color: "#C67C4E",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 55,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  pickerContainer: {
    width: "100%",
    height: 55,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 2,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#C67C4E",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  userIdText: {
    marginTop: 10,
    fontSize: 12,
    color: "gray",
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});

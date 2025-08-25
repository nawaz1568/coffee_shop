import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: width * 0.9,
    height: height * 0.5,
    marginTop: -height * 0.1,
  },
  title: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    width: "85%",
    marginTop: 10,
  },
  subtitle: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
    width: "80%",
    marginTop: 10,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    justifyContent: "center",
    marginTop: 40,
  },
  googleIcon: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  googleText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#6F4E37",
  },
});

export default styles;

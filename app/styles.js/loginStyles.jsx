import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "black", 
    padding: 20 
  },
  title: { 
    fontSize: 45, 
    fontWeight: "bold", 
    color: "white", 
    marginBottom: 45 
  },
  image: { 
    width: 900, 
    height: 320, 
    marginTop: -40, 
    resizeMode: "contain" 
  },
  input: { 
    width: "100%", 
    height: 50, 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    marginBottom: 15, 
    marginTop: 20, 
    borderWidth: 1, 
    borderColor: "#ddd" 
  },
  passwordContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 20, 
    width: "100%", 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    marginBottom: 5, 
    borderWidth: 1, 
    borderColor: "#ddd" 
  },
  passwordInput: { 
    flex: 1, 
    height: 50 
  },
  errorText: { 
    color: "red", 
    fontSize: 14, 
    alignSelf: "flex-start", 
    marginLeft: 10, 
    marginBottom: 10 
  },
  forgotPassword: { 
    color: "#fff", 
    fontSize: 14, 
    marginBottom: 20 
  },
  submitButton: { 
    width: "80%", 
    height: 50, 
    backgroundColor: "#C67C4E", 
    justifyContent: "center", 
    alignItems: "center", 
    borderRadius: 10, 
    marginBottom: 15 
  },
  disabledButton: { 
    backgroundColor: "#888" 
  },
  submitText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  registerText: { 
    color: "#fff", 
    fontSize: 16, 
    marginTop: 10 
  },
});

export default styles;

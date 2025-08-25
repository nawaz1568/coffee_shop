import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const PlusMinusButton = () => {
  const [count, setCount] = useState(0);

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1, flexDirection: "row" }}>
      {count > 0 ? (
        <>
          {/* Minus Button */}
          <TouchableOpacity
            onPress={() => setCount(count - 1)}
            style={{
              backgroundColor: "#ddd",
              padding: 10,
              borderRadius: 50,
              marginHorizontal: 10,
            }}
          >
            <Icon name="remove" size={30} color="black" />
          </TouchableOpacity>

          {/* Value Display */}
          <Text style={{ fontSize: 20, marginHorizontal: 10 }}>{count}</Text>

          {/* Plus Button */}
          <TouchableOpacity
            onPress={() => setCount(count + 1)}
            style={{
              backgroundColor: "#ddd",
              padding: 10,
              borderRadius: 50,
              marginHorizontal: 10,
            }}
          >
            <Icon name="add" size={30} color="black" />
          </TouchableOpacity>
        </>
      ) : (
        // Single Plus Button when count is 0
        <TouchableOpacity
          onPress={() => setCount(1)}
          style={{
            backgroundColor: "#ddd",
            padding: 10,
            borderRadius: 50,
          }}
        >
          <Icon name="add" size={30} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PlusMinusButton;

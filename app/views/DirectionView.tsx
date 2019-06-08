import { useContext } from "react";
import React from "react";
import { Text, View } from "react-native";

import { LocationContext } from "../contexts";
import { TSP } from "../utils/TSP";

export function DirectionView() {
  const { locations } = useContext(LocationContext);

  const result = TSP(locations);

  return (
    <View>
      <Text>{result}</Text>
    </View>
  );
}

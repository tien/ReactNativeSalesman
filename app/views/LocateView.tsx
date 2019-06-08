import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "../components/Button";
import { LocationContext, NavigationContext, Route } from "../contexts";
import { MapContext } from "../contexts/mapContext";

export function LocateView() {
  const { goToRoute } = useContext(NavigationContext);
  const { currentLocation, addLocation } = useContext(LocationContext);
  const { region } = useContext(MapContext);

  return (
    <View pointerEvents="box-none" style={style.container}>
      <View style={style.buttonsContainer}>
        <Button onPress={() => goToRoute(Route.HOME)}>
          <Text>CANCEL</Text>
        </Button>
        <Button>
          <Text>CONFIRM</Text>
        </Button>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end"
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20
  }
});

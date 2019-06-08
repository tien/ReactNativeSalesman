import React, { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";

import { Button } from "../components/Button";
import { NavigationContext, Route } from "../contexts";

export function LocateView() {
  const { goToRoute } = useContext(NavigationContext);

  return (
    <View pointerEvents="box-none" style={style.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "white",
          padding: 20
        }}
      >
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
  container: { width: "100%", height: "100%", justifyContent: "flex-end" }
});

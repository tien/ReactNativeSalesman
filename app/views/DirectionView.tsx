import { useContext, useEffect, useState } from "react";
import React from "react";
import { Text, View, StyleSheet } from "react-native";

import { Button } from "../components/Button";
import {
  ILocation,
  LocationContext,
  MapContext,
  NavigationContext,
  Route
} from "../contexts";
import { gmapClient } from "../services/googleMap";
import { spacing } from "../styles";
import { TSP } from "../utils/TSP";

export function DirectionView() {
  const { goToRoute } = useContext(NavigationContext);
  const { locations } = useContext(LocationContext);
  const { setEncodedPolyline } = useContext(MapContext);
  const [result, setResult] = useState();

  useEffect(() => {
    (async () => {
      const { path, distance } = await TSP(locations);
      const findLocation = (placeId: string) =>
        locations.find(location => location.placeId === placeId) as ILocation;

      const origin = findLocation(path[0]);
      const destination = findLocation(path[path.length - 1]);
      const waypoints = path.slice(0, path.length).map(findLocation);

      const res = await gmapClient
        .directions({
          origin,
          destination,
          waypoints
        })
        .asPromise();

      setResult(distance);
      setEncodedPolyline(res.json.routes[0].overview_polyline.points);
    })();

    return () => setEncodedPolyline(undefined);
  }, []);

  return (
    <View pointerEvents="box-none" style={style.container}>
      <Text>{result}</Text>
      <View style={spacing.bottomNavContainer}>
        <View>
          <Text>Travel Distance: {result}</Text>
        </View>
        <Button onPress={() => goToRoute(Route.HOME)}>
          <Text>BACK</Text>
        </Button>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    alignItems: "center",
    height: "100%"
  }
});

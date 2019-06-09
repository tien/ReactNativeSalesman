import { useContext, useEffect, useState } from "react";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Marker } from "react-native-maps";

import { Button } from "../components/Button";
import {
  ILocation,
  LocationContext,
  MapContext,
  NavigationContext,
  Route
} from "../contexts";
import { gmapClient } from "../services/googleMap";
import { mapStyle, spacing } from "../styles";
import { TSP } from "../utils/TSP";

export function DirectionView() {
  const { goToRoute } = useContext(NavigationContext);
  const { locations } = useContext(LocationContext);
  const { setEncodedPolyline, setMarkers } = useContext(MapContext);
  const [result, setResult] = useState();

  useEffect(() => {
    const calculateAndDisplayTSP = async () => {
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
      setMarkers(
        path
          .slice(0, path.length - 1)
          .map(findLocation)
          .map(({ placeId, latitude, longitude, name }, index) => (
            <Marker
              style={mapStyle.bubble}
              key={`path:${placeId}`}
              coordinate={{ latitude, longitude }}
            >
              <Text style={mapStyle.bubbleText}>Stop: {index + 1}</Text>
              <Text style={mapStyle.bubbleText}>{name}</Text>
            </Marker>
          ))
      );
      setEncodedPolyline(res.json.routes[0].overview_polyline.points);
    };

    calculateAndDisplayTSP().catch(e => Alert.alert(e));

    return () => {
      setEncodedPolyline(undefined);
      setMarkers([]);
    };
  }, []);

  return (
    <View pointerEvents="box-none" style={style.container}>
      <View style={spacing.bottomNavContainer}>
        <View>
          <Text style={{ fontSize: 20 }}>Travel Distance:</Text>
          <Text>{result} Meters</Text>
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

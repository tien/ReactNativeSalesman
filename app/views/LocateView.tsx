import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";

import MapMarkerIcon from "../assets/svg/map-marker.svg";
import { Button } from "../components/Button";
import { LocationContext, NavigationContext, Route } from "../contexts";
import { MapContext } from "../contexts/mapContext";
import { gmapClient } from "../services/googleMap";

export function LocateView() {
  const { goToRoute } = useContext(NavigationContext);
  const { addLocation } = useContext(LocationContext);
  const { map, region } = useContext(MapContext);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position =>
      (map as MapView).animateToRegion({
        ...region!,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
    );
  }, []);

  const confirmLocation = () => {
    if (region !== undefined) {
      gmapClient
        .reverseGeocode({
          latlng: [region.latitude, region.longitude],
          result_type: "street_address"
        })
        .asPromise()
        .then(res => {
          const nearestPlace = res.json.results[0];
          addLocation({
            name: nearestPlace.formatted_address.slice(
              0,
              nearestPlace.formatted_address.indexOf(",")
            ),
            secondaryName: nearestPlace.formatted_address
              .slice(nearestPlace.formatted_address.indexOf(",") + 1)
              .trim(),
            placeId: nearestPlace.place_id,
            latitude: nearestPlace.geometry.location.lat,
            longitude: nearestPlace.geometry.location.lng
          });
          goToRoute(Route.HOME);
        })
        .catch(e => console.log(e));
    }
  };

  return (
    <>
      <View pointerEvents="none" style={style.mapMarkerContainer}>
        <View style={style.bubble}>
          <Text style={style.bubbleText}>GPS co-ordinates</Text>
          <Text style={style.bubbleText}>
            {region!.latitude.toFixed(7)} N {region!.longitude.toFixed(7)} E
          </Text>
        </View>
        <MapMarkerIcon fill="#BA2831" width={35} height={35} />
      </View>
      <View pointerEvents="box-none" style={style.container}>
        <View style={style.buttonsContainer}>
          <Button onPress={() => goToRoute(Route.HOME)}>
            <Text>CANCEL</Text>
          </Button>
          <Button onPress={confirmLocation}>
            <Text>CONFIRM</Text>
          </Button>
        </View>
      </View>
    </>
  );
}

const style = StyleSheet.create({
  mapMarkerContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    top: 0,
    bottom: "50%"
  },
  bubble: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    marginBottom: 5,
    paddingHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 15
  },
  bubbleText: {
    color: "white"
  },
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

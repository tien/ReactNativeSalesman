import React, { useEffect, useState } from "react";
import { GeolocationReturnType, StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";

import {
  ILocation,
  ILocationContext,
  INavigationContext,
  LocationContext,
  NavigationContext,
  Route
} from "./app/contexts";
import { HomeView } from "./app/views/HomeView";
import { LocateView } from "./app/views/LocateView";

export default function App() {
  const [initialLocation, setInitialLocation] = useState<GeolocationReturnType>();
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [currentRoute, setRoute] = useState(Route.HOME);

  const addLocation = (l: ILocation) =>
    setLocations([...locations.filter(l1 => l1.placeId !== l.placeId), l]);

  const removeLocation = (l: ILocation) =>
    setLocations(locations.filter(l1 => l1.placeId !== l.placeId));

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => setInitialLocation(position));
  }, []);

  const navigationContextValue: INavigationContext = {
    currentRoute,
    goToRoute: setRoute
  };

  const locationContextValue: ILocationContext = {
    initialLocation,
    locations,
    addLocation,
    removeLocation
  };

  return (
    <NavigationContext.Provider value={navigationContextValue}>
      <LocationContext.Provider value={locationContextValue}>
        {initialLocation === undefined ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <MapView
              style={style.map}
              initialRegion={{
                latitude: initialLocation.coords.latitude,
                latitudeDelta: 0.0922,
                longitude: initialLocation.coords.longitude,
                longitudeDelta: 0.0421
              }}
            />
            <View pointerEvents="box-none" style={style.mapOverlay}>
              {(currentRoute === Route.HOME || currentRoute === Route.SEARCH) && (
                <HomeView />
              )}
              {currentRoute === Route.LOCATE && <LocateView />}
            </View>
          </>
        )}
      </LocationContext.Provider>
    </NavigationContext.Provider>
  );
}

const style = StyleSheet.create({
  map: {
    flex: 1
  },
  mapOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
});

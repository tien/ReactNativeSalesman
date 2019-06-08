import React, { useEffect, useState } from "react";
import { GeolocationReturnType, StyleSheet, Text, View, Dimensions } from "react-native";
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

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function App() {
  const [initialLocation, setInitialLocation] = useState<GeolocationReturnType>();
  const [currentLocation, setCurrentLocation] = useState<GeolocationReturnType>();
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [currentRoute, setRoute] = useState(Route.HOME);

  const addLocation = (l: ILocation) =>
    setLocations([...locations.filter(l1 => l1.placeId !== l.placeId), l]);

  const removeLocation = (l: ILocation) =>
    setLocations(locations.filter(l1 => l1.placeId !== l.placeId));

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => setInitialLocation(position));
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(position =>
      setCurrentLocation(position)
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const navigationContextValue: INavigationContext = {
    currentRoute,
    goToRoute: setRoute
  };

  const locationContextValue: ILocationContext = {
    initialLocation,
    currentLocation,
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
                latitudeDelta: LATITUDE_DELTA,
                longitude: initialLocation.coords.longitude,
                longitudeDelta: LONGITUDE_DELTA
              }}
            />
            <View pointerEvents="box-none" style={style.mapOverlay}>
              {(() => {
                switch (currentRoute) {
                  case Route.LOCATE:
                    return <LocateView />;
                  case Route.HOME:
                  case Route.SEARCH:
                  default:
                    return <HomeView />;
                }
              })()}
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

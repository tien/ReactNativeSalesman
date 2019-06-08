import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker, Region } from "react-native-maps";

import {
  ILocation,
  ILocationContext,
  INavigationContext,
  LocationContext,
  NavigationContext,
  Route
} from "./app/contexts";
import { IMapContext, MapContext } from "./app/contexts/mapContext";
import { HomeView } from "./app/views/HomeView";
import { LocateView } from "./app/views/LocateView";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function App() {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [region, setRegion] = useState<Region>();
  const [currentRoute, setRoute] = useState(Route.HOME);

  const addLocation = (l: ILocation) =>
    setLocations([...locations.filter(l1 => l1.placeId !== l.placeId), l]);

  const removeLocation = (l: ILocation) =>
    setLocations(locations.filter(l1 => l1.placeId !== l.placeId));

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position =>
      setRegion({
        latitude: position.coords.latitude,
        latitudeDelta: LATITUDE_DELTA,
        longitude: position.coords.longitude,
        longitudeDelta: LONGITUDE_DELTA
      })
    );
  }, []);

  const navigationContextValue: INavigationContext = {
    currentRoute,
    goToRoute: setRoute
  };

  const locationContextValue: ILocationContext = {
    locations,
    addLocation,
    removeLocation
  };

  const mapContextValue: IMapContext = {
    region,
    setRegion
  };

  return (
    <NavigationContext.Provider value={navigationContextValue}>
      <LocationContext.Provider value={locationContextValue}>
        <MapContext.Provider value={mapContextValue}>
          <>
            {region === undefined ? (
              <Text>Loading...</Text>
            ) : (
              <MapView
                style={style.map}
                region={region}
                onRegionChangeComplete={setRegion}
              />
            )}
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
        </MapContext.Provider>
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
  },
  callout: {
    backgroundColor: "black",
    opacity: 0.8,
    paddingHorizontal: 5,
    paddingVertical: 15
  },
  calloutText: {
    color: "white"
  }
});

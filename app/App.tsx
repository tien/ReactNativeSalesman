import polyline from "@mapbox/polyline";
import moment from "moment";
import React, { ReactElement, useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";

import {
  ILocation,
  ILocationContext,
  INavigationContext,
  LocationContext,
  NavigationContext,
  Route
} from "./contexts";
import { IMapContext, MapContext } from "./contexts/mapContext";
import { pushNotification } from "./services/pushNotification";
import { DirectionView } from "./views/DirectionView";
import { HomeView } from "./views/HomeView";
import { LocateView } from "./views/LocateView";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function App() {
  const [currentRoute, setRoute] = useState(Route.HOME);
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [map, setMap] = useState<MapView | null>(null);
  const [region, setRegion] = useState<Region>();
  const [encodedPolyline, setEncodedPolyline] = useState<string>();
  const [markers, setMarkers] = useState<Array<ReactElement<Marker>>>([]);

  const addLocation = (l: ILocation) => {
    setLocations([...locations.filter(l1 => l1.placeId !== l.placeId), l]);
    pushNotification.cancelAllLocalNotifications();
    pushNotification.localNotificationSchedule({
      date: moment()
        .add(5, "minutes")
        .toDate(),
      message: `${l.name} added at:\n${new Date()}`
    });
  };

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
    map,
    region,
    setRegion,
    encodedPolyline,
    setEncodedPolyline,
    markers,
    setMarkers
  };

  return (
    <NavigationContext.Provider value={navigationContextValue}>
      <LocationContext.Provider value={locationContextValue}>
        <MapContext.Provider value={mapContextValue}>
          {region === undefined ? (
            <Text>Loading...</Text>
          ) : (
            <MapView
              ref={component => setMap(component)}
              style={style.map}
              initialRegion={region}
              onRegionChange={setRegion}
            >
              {markers.length !== 0
                ? markers
                : locations.map(({ placeId, latitude, longitude, name }) => (
                    <Marker
                      key={`location:${placeId}`}
                      coordinate={{ latitude, longitude }}
                      title={name}
                    />
                  ))}
              {encodedPolyline && (
                <Polyline
                  strokeWidth={3}
                  strokeColor="rgba(72, 138, 244, 0.66)"
                  fillColor="rgba(72, 138, 244, 0.66)"
                  coordinates={polyline
                    .decode(encodedPolyline)
                    .map(([latitude, longitude]) => ({ latitude, longitude }))}
                />
              )}
            </MapView>
          )}
          <View pointerEvents="box-none" style={style.mapOverlay}>
            {(() => {
              switch (currentRoute) {
                case Route.LOCATE:
                  return <LocateView />;
                case Route.DIRECTION:
                  return <DirectionView />;
                case Route.HOME:
                case Route.SEARCH:
                default:
                  return <HomeView />;
              }
            })()}
          </View>
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

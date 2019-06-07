import gmap from "@google/maps";
import React, { useEffect, useState } from "react";
import { GeolocationReturnType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Config from "react-native-config";
import MapView from "react-native-maps";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

import { LocationList, LocationListMode } from "./src/components/LocationList";
import { SearchBar } from "./src/components/SearchBar";
import { ILocation, mainContext, Route } from "./src/contexts";

export default function App() {
  const [gmapClient] = useState(
    gmap.createClient({
      key: Config.GOOGLE_MAPS_API_KEY,
      Promise
    })
  );
  const [initialLocation, setInitialLocation] = useState<GeolocationReturnType>();
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<ILocation[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchInputStream] = useState(new Subject<string>());
  const [currentRoute, setRoute] = useState(Route.HOME);

  const addLocation = (l: ILocation) =>
    setLocations([...locations.filter(l1 => l1.placeId !== l.placeId), l]);

  const removeLocation = (l: ILocation) =>
    setLocations(locations.filter(l1 => l1.placeId !== l.placeId));

  searchInputStream.pipe(debounceTime(500)).subscribe(text => {
    setDebouncedSearch(text);
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => setInitialLocation(position));
  }, []);

  useEffect(() => {
    searchInputStream.next(searchInput);
  }, [searchInput]);

  useEffect(() => {
    if (initialLocation !== undefined) {
      if (debouncedSearch === "") {
        setLocationSuggestions([]);
      } else {
        gmapClient
          .placesAutoComplete({
            sessiontoken: "",
            input: debouncedSearch,
            types: "address",
            location: `${initialLocation.coords.latitude},${
              initialLocation.coords.longitude
            }`
          })
          .asPromise()
          .then(res =>
            setLocationSuggestions(
              res.json.predictions.map(prediction => ({
                placeId: prediction.place_id,
                name: prediction.structured_formatting.main_text,
                region: prediction.structured_formatting.secondary_text
              }))
            )
          );
      }
    }
  }, [debouncedSearch]);

  return initialLocation === undefined ? (
    <Text>Loading...</Text>
  ) : (
    <mainContext.Provider
      value={{ locations, addLocation, removeLocation, currentRoute, setRoute }}
    >
      <MapView
        style={style.map}
        initialRegion={{
          latitude: initialLocation.coords.latitude,
          latitudeDelta: 0.0922,
          longitude: initialLocation.coords.longitude,
          longitudeDelta: 0.0421
        }}
      />
      <SearchBar
        placeholder="Search here"
        value={searchInput}
        onChangeText={text => {
          setRoute(Route.SEARCH);
          setSearchInput(text);
        }}
        onFocus={() => setRoute(Route.SEARCH)}
        onBlur={() => setRoute(Route.HOME)}
        showBackButton={currentRoute === Route.SEARCH}
        onBackButtonPress={() => setRoute(Route.HOME)}
      />
      <View style={style.locationListWrapper}>
        <View style={style.locationList}>
          <Text style={style.destinationLabel}>Destinations</Text>
          <TouchableOpacity style={style.directionsButton}>
            <Text style={style.directionsButtonText}>DIRECTIONS</Text>
          </TouchableOpacity>
        </View>
        <LocationList
          mode={(() => {
            switch (currentRoute) {
              case Route.HOME:
                return LocationListMode.EDIT;
              case Route.SEARCH:
                return LocationListMode.ADD;
              default:
                return LocationListMode.EDIT;
            }
          })()}
          locations={(() => {
            switch (currentRoute) {
              case Route.HOME:
                return locations;
              case Route.SEARCH:
                return locationSuggestions;
              default:
                return locations;
            }
          })()}
          addLocation={addLocation}
          removeLocation={removeLocation}
        />
      </View>
    </mainContext.Provider>
  );
}

const style = StyleSheet.create({
  map: {
    flex: 1
  },
  destinationLabel: {
    fontSize: 35
  },
  directionsButton: {
    backgroundColor: "#2f3a7d",
    padding: 5,
    borderRadius: 5
  },
  directionsButtonText: {
    color: "white"
  },
  locationListWrapper: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0
  },
  locationList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "white"
  }
});

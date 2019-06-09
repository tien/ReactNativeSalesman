import React, { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { from, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";

import GPSIcon from "../assets/svg/gps.svg";
import { LocationList, LocationListMode } from "../components/LocationList";
import { SearchBar } from "../components/SearchBar";
import { ILocation, LocationContext, NavigationContext, Route } from "../contexts";
import { MapContext } from "../contexts/mapContext";
import { gmapClient } from "../services/googleMap";

export function HomeView() {
  const { currentRoute, goToRoute } = useContext(NavigationContext);
  const { locations, addLocation, removeLocation } = useContext(LocationContext);
  const { region } = useContext(MapContext);

  const [locationSuggestions, setLocationSuggestions] = useState<ILocation[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchInputStream] = useState(new Subject<string>());

  useEffect(() => {
    const observervable = searchInputStream.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(text => {
        console.log(text);
        if (text === "") {
          return from([[]]);
        } else {
          return from(
            gmapClient
              .places({
                query: text,
                location: [region!.latitude, region!.longitude],
                radius: 50000
              })
              .asPromise()
              .then(res =>
                res.json.results.map(value => {
                  const name = value.formatted_address.slice(
                    0,
                    value.formatted_address.indexOf(",")
                  );
                  const secondaryName = value.formatted_address
                    .slice(value.formatted_address.indexOf(",") + 1)
                    .trim();

                  return {
                    placeId: value.place_id,
                    name,
                    secondaryName,
                    latitude: value.geometry.location.lat,
                    longitude: value.geometry.location.lng
                  };
                })
              )
              .catch(e => new Error(e))
          );
        }
      })
    );

    const subscription = observervable.subscribe(value => {
      console.log(value);
      if (value instanceof Error) {
        Alert.alert("Error", Error.name);
      } else {
        setLocationSuggestions(value);
      }
    });

    return () => subscription.unsubscribe();
  }, [region]);

  useEffect(() => {
    searchInputStream.next(searchInput);
  }, [searchInput]);

  return region === undefined ? (
    <Text>Loading...</Text>
  ) : (
    <View pointerEvents="box-none" style={style.viewContainer}>
      <View style={style.searchBarContainer}>
        <SearchBar
          placeholder="Search here"
          value={searchInput}
          onChangeText={text => {
            goToRoute(Route.SEARCH);
            setSearchInput(text);
          }}
          onFocus={() => goToRoute(Route.SEARCH)}
          showBackButton={currentRoute === Route.SEARCH}
          onBackButtonPress={() => {
            goToRoute(Route.HOME);
            setSearchInput("");
          }}
        />
      </View>
      <View style={currentRoute === Route.SEARCH ? { flex: 1 } : { height: "50%" }}>
        {currentRoute === Route.HOME && (
          <>
            <View style={style.GPSIconWrapper}>
              <TouchableOpacity
                style={style.GPSIcon}
                onPress={() => goToRoute(Route.LOCATE)}
              >
                <GPSIcon fill="white" width={35} height={35} preserveAspectRatio="true" />
              </TouchableOpacity>
            </View>
            <View style={style.locationList}>
              <Text style={style.destinationLabel}>Destinations</Text>
              <TouchableOpacity
                style={style.directionsButton}
                onPress={() => goToRoute(Route.DIRECTION)}
              >
                <Text style={style.directionsButtonText}>DIRECTIONS</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        <LocationList
          mode={
            currentRoute === Route.SEARCH ? LocationListMode.ADD : LocationListMode.EDIT
          }
          locations={currentRoute === Route.SEARCH ? locationSuggestions : locations}
          alreadyAdded={location =>
            locations.some(savedLocation => savedLocation.placeId === location.placeId)
          }
          addLocation={addLocation}
          removeLocation={removeLocation}
        />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  viewContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between"
  },
  searchBarContainer: {
    paddingHorizontal: 15,
    paddingVertical: 50
  },
  GPSIconWrapper: {
    alignItems: "flex-end",
    padding: 15
  },
  GPSIcon: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 50,
    padding: 15,
    backgroundColor: "#7792B5",
    opacity: 0.8,
    borderWidth: 1,
    borderColor: "#5D5E84",
    borderRadius: 20
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
  locationList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "white"
  }
});

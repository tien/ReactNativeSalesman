import crypto from "crypto";
import React, { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { from, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";

import GPSIcon from "../assets/svg/gps.svg";
import TurnRightSignIcon from "../assets/svg/turn-right-sign.svg";
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
  const [sessiontoken] = useState(crypto.randomBytes(16).toString("hex"));

  const addSuggestionToLocation = (location: any) =>
    gmapClient
      .place({ placeid: location.placeId })
      .asPromise()
      .then(value => {
        const place = value.json.result;
        const address = place.formatted_address;
        addLocation({
          placeId: location.placeId,
          name: address.slice(0, address.indexOf(",")),
          secondaryName: address.slice(address.indexOf(",") + 1),
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng
        });
      });

  useEffect(() => {
    const observervable = searchInputStream.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(text => {
        if (text === "") {
          return from([[]]);
        } else {
          return from(
            gmapClient
              .placesAutoComplete({
                sessiontoken,
                input: text,
                location: [region!.latitude, region!.longitude],
                radius: 50000
              })
              .asPromise()
              .then(res =>
                res.json.predictions.map(value => ({
                  placeId: value.place_id,
                  name: value.structured_formatting.main_text,
                  secondaryName: value.structured_formatting.secondary_text
                }))
              )
              .catch(e => new Error(e))
          );
        }
      })
    );

    const subscription = observervable.subscribe(value => {
      if (value instanceof Error) {
        Alert.alert("Error", Error.name);
      } else {
        setLocationSuggestions(value as any);
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
      <View
        pointerEvents="box-none"
        style={currentRoute === Route.SEARCH ? { flex: 1 } : { height: "50%" }}
      >
        {currentRoute === Route.HOME && (
          <>
            <View pointerEvents="box-none" style={style.GPSIconWrapper}>
              <TouchableOpacity
                style={style.GPSIcon}
                onPress={() => goToRoute(Route.LOCATE)}
              >
                <GPSIcon fill="white" width={35} height={35} />
              </TouchableOpacity>
            </View>
            <View style={style.locationList}>
              <Text style={style.destinationLabel}>Destinations</Text>
              <TouchableOpacity
                style={style.directionsButton}
                onPress={() => goToRoute(Route.DIRECTION)}
              >
                <TurnRightSignIcon fill="white" width={20} height={20} />
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
          addLocation={addSuggestionToLocation}
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2f3a7d",
    padding: 5,
    borderRadius: 5
  },
  directionsButtonText: {
    paddingLeft: 5,
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

import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchInputStream] = useState(new Subject<string>());

  searchInputStream.pipe(debounceTime(500)).subscribe(text => {
    setDebouncedSearch(text);
  });

  useEffect(() => {
    searchInputStream.next(searchInput);
  }, [searchInput]);

  useEffect(() => {
    if (region !== undefined) {
      if (debouncedSearch === "") {
        setLocationSuggestions([]);
      } else {
        gmapClient
          .places({
            query: debouncedSearch,
            location: [region.latitude, region.longitude],
            radius: 10000
          })
          .asPromise()
          .then(res =>
            setLocationSuggestions(
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
          )
          .catch(e => console.log(e));
      }
    }
  }, [debouncedSearch]);

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
      <View style={style.locationListWrapper}>
        <View style={style.GPSIconWrapper}>
          <TouchableOpacity style={style.GPSIcon} onPress={() => goToRoute(Route.LOCATE)}>
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
    paddingTop: 50,
    paddingHorizontal: 15
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
  locationListWrapper: {
    maxHeight: "50%"
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

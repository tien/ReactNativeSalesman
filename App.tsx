import gmap from "@google/maps";
import React, { useEffect, useState } from "react";
import { GeolocationReturnType, Text, TextInput, View } from "react-native";
import Config from "react-native-config";
import MapView from "react-native-maps";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

import { LocationList, LocationListMode } from "./src/components/LocationList";
import { ILocation } from "./src/contexts";

export default function App() {
  const gmapClient = gmap.createClient({
    key: Config.GOOGLE_MAPS_API_KEY,
    Promise
  });

  const [location, setLocation] = useState<GeolocationReturnType>();
  const [locationList, setLocationList] = useState<ILocation[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchInputStream] = useState(new Subject<string>());

  searchInputStream.pipe(debounceTime(500)).subscribe(text => {
    setDebouncedSearch(text);
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => setLocation(position));
  }, []);

  useEffect(() => {
    searchInputStream.next(searchInput);
  }, [searchInput]);

  useEffect(() => {
    if (location !== undefined) {
      if (searchInput === "") {
        setSearchInput("");
      } else {
        gmapClient
          .placesAutoComplete({
            sessiontoken: "",
            input: debouncedSearch,
            types: "address",
            location: `${location.coords.latitude},${location.coords.longitude}`
          })
          .asPromise()
          .then(res =>
            setLocationList(
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

  return location ? (
    <>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.coords.latitude,
          latitudeDelta: 0.0922,
          longitude: location.coords.longitude,
          longitudeDelta: 0.0421
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 40,
          left: 10,
          right: 10,
          height: 50,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          borderColor: "grey",
          borderWidth: 1
        }}
      >
        <TextInput
          placeholder="Search here"
          value={searchInput}
          onChangeText={setSearchInput}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
        />
      </View>
      <View style={{ position: "absolute", bottom: 50, left: 0, right: 0 }}>
        <LocationList
          mode={searchFocus ? LocationListMode.ADD : LocationListMode.EDIT}
          locations={searchFocus ? locationList : []}
        />
      </View>
    </>
  ) : (
    <Text>Loading...</Text>
  );
}

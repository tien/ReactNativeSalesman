import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swipeout from "react-native-swipeout";

import { ILocation, mainContext } from "../contexts";

export enum LocationListMode {
  ADD,
  EDIT
}

export interface ILocationListProps {
  mode: LocationListMode;
  locations?: ILocation[];
  addLocation: (location: ILocation) => void;
  removeLocation: (location: ILocation) => void;
}

export function LocationList({
  mode,
  locations = [],
  addLocation,
  removeLocation
}: ILocationListProps) {
  const value = useContext(mainContext);

  return (
    <View>
      {locations.map((location, index) => {
        const locationAlreadyAdded =
          value.locations.find(
            savedLocation => savedLocation.placeId === location.placeId
          ) !== undefined;

        return (
          <Swipeout
            key={index}
            disabled={mode === LocationListMode.ADD}
            left={[
              {
                text: "-",
                color: "white",
                backgroundColor: "red",
                onPress: () => removeLocation(location)
              }
            ]}
            style={style.entry}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {mode === LocationListMode.ADD && (
                <TouchableOpacity
                  style={{
                    ...style.addButton,
                    ...(locationAlreadyAdded ? { backgroundColor: "green" } : {})
                  }}
                  onPress={() => addLocation(location)}
                  disabled={locationAlreadyAdded}
                >
                  <Text style={style.addButtonText} adjustsFontSizeToFit>
                    {locationAlreadyAdded ? "\u2713" : "+"}
                  </Text>
                </TouchableOpacity>
              )}
              <View>
                <Text style={style.name}>{location.name}</Text>
                <Text style={style.secondaryName}>{location.region}</Text>
              </View>
            </View>
          </Swipeout>
        );
      })}
    </View>
  );
}

const style = StyleSheet.create({
  entry: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: "#777877",
    borderWidth: 1
  },
  name: {
    fontSize: 24
  },
  secondaryName: {
    color: "#6e6f6b",
    fontSize: 16
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2293a1",
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 15
  },
  addButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 30
  }
});

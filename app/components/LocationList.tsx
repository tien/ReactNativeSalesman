import React, { useContext } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Swipeout from "react-native-swipeout";

import { ILocation } from "../contexts";

export enum LocationListMode {
  ADD,
  EDIT
}

export interface ILocationListProps {
  mode: LocationListMode;
  locations?: ILocation[];
  alreadyAdded?: (location: ILocation) => boolean;
  addLocation: (location: ILocation) => void;
  removeLocation: (location: ILocation) => void;
}

export function LocationList({
  mode,
  locations = [],
  alreadyAdded = () => false,
  addLocation,
  removeLocation
}: ILocationListProps) {
  return (
    <ScrollView style={style.container}>
      {locations.map((location, index) => {
        const locationAlreadyAdded = alreadyAdded(location);

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
                <Text style={style.secondaryName}>{location.secondaryName}</Text>
              </View>
            </View>
          </Swipeout>
        );
      })}
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    backgroundColor: "white"
  },
  entry: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    borderTopColor: "#777877",
    borderTopWidth: 1
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

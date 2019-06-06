import React, { useContext } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Swipeout from "react-native-swipeout";

import { ILocation, mainContext } from "../contexts";

export enum LocationListMode {
  ADD,
  EDIT
}

export interface ILocationListProps {
  mode: LocationListMode;
  locations?: ILocation[];
}

export function LocationList({ mode, locations = [] }: ILocationListProps) {
  const context = useContext(mainContext);
  const buttons = [
    {
      text: "-",
      color: "white",
      backgroundColor: "red"
    }
  ];

  return (
    <View>
      {locations.map((location, index) => (
        <Swipeout
          key={index}
          disabled={mode === LocationListMode.ADD}
          left={buttons}
          style={style.entry}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {mode === LocationListMode.ADD && (
              <TouchableOpacity
                style={style.addButton}
                onPress={() => context.addLocation(location)}
              >
                <Text style={style.addButtonText} adjustsFontSizeToFit>+</Text>
              </TouchableOpacity>
            )}
            <View>
              <Text style={style.name}>{location.name}</Text>
              <Text style={style.secondaryName}>{location.region}</Text>
            </View>
          </View>
        </Swipeout>
      ))}
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

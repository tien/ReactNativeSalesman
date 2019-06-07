import React, { useContext } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View
} from "react-native";

import BackIcon from "../assets/svg/back.svg";
import SearchIcon from "../assets/svg/magnifying-glass.svg";
import { mainContext, Route } from "../contexts";

export function SearchBar(props: TextInputProps) {
  const value = useContext(mainContext);

  return (
    <View style={style.searchBarContainer}>
      <View style={style.iconWrapper}>
        {value.currentRoute !== Route.SEARCH ? (
          <SearchIcon width={15} height={15} preserveAspectRatio="true" />
        ) : (
          <TouchableOpacity onPress={() => value.setRoute(Route.HOME)}>
            <BackIcon width={15} height={15} preserveAspectRatio="true" />
          </TouchableOpacity>
        )}
      </View>
      <TextInput {...props} />
    </View>
  );
}

const style = StyleSheet.create({
  searchBarContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    height: 50,
    backgroundColor: "white",
    alignItems: "center",
    borderColor: "grey",
    borderWidth: 1
  },
  iconWrapper: {
    paddingHorizontal: 10
  }
});

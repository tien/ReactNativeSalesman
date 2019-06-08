import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View
} from "react-native";

import BackIcon from "../assets/svg/back.svg";
import SearchIcon from "../assets/svg/magnifying-glass.svg";

export interface ISearchBoxProps extends TextInputProps {
  showBackButton?: boolean;
  onBackButtonPress?: () => void;
}

export function SearchBar({
  showBackButton = false,
  onBackButtonPress,
  ...textInputProps
}: ISearchBoxProps) {
  return (
    <View style={style.searchBarContainer}>
      <View style={style.iconWrapper}>
        {showBackButton ? (
          <TouchableOpacity onPress={onBackButtonPress}>
            <BackIcon width={15} height={15} preserveAspectRatio="true" />
          </TouchableOpacity>
        ) : (
          <SearchIcon width={15} height={15} preserveAspectRatio="true" />
        )}
      </View>
      <TextInput style={style.textInput} {...textInputProps} />
    </View>
  );
}

const style = StyleSheet.create({
  searchBarContainer: {
    flexDirection: "row",
    height: 50,
    backgroundColor: "white",
    alignItems: "center",
    borderColor: "grey",
    borderWidth: 1
  },
  iconWrapper: {
    paddingHorizontal: 10
  },
  textInput: {
    flex: 1
  }
});

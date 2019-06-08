import React, { cloneElement } from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

export interface IButtonProps extends TouchableOpacityProps {
  children: JSX.Element | JSX.Element[];
}

export function Button({ children, style, ...props }: IButtonProps) {
  return (
    <TouchableOpacity style={[buttonStyle.button, style]} {...props}>
      {React.Children.map(children, child =>
        child.type === Text ? cloneElement(child, { style: buttonStyle.text }) : child
      )}
    </TouchableOpacity>
  );
}

const buttonStyle = StyleSheet.create({
  button: {
    backgroundColor: "#D6D7D0",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20
  },
  text: {
    fontSize: 18
  }
});

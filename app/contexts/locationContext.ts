import { createContext } from "react";
import { GeolocationReturnType } from "react-native";

export interface ILocation {
  placeId: string;
  name: string;
  secondaryName: string;
  latitude?: number;
  longitude?: number;
}

export interface ILocationContext {
  locations: ILocation[];
  addLocation: (location: ILocation) => void;
  removeLocation: (location: ILocation) => void;
}

const defaultValue = {
  locations: [],
  addLocation() {
    return;
  },
  removeLocation() {
    return;
  }
};

export const LocationContext = createContext<ILocationContext>(defaultValue);

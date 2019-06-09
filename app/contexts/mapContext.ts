import { createContext } from "react";
import { Region } from "react-native-maps";
import MapView from "react-native-maps";

export interface IMapContext {
  map: MapView | null;
  region?: Region;
  setRegion: (region: Region) => void;
  encodedPolyline?: string;
  setEncodedPolyline: (encoded?: string) => void;
}

const defaultValue: IMapContext = {
  map: null,
  setRegion(region) {
    return;
  },
  setEncodedPolyline(encoded) {
    return;
  }
};

export const MapContext = createContext<IMapContext>(defaultValue);

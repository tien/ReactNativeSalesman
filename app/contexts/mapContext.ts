import { createContext, ReactElement } from "react";
import MapView, { Marker, Region } from "react-native-maps";

export interface IMapContext {
  map: MapView | null;
  region?: Region;
  setRegion: (region: Region) => void;
  encodedPolyline?: string;
  setEncodedPolyline: (encoded?: string) => void;
  markers: Array<ReactElement<Marker>>;
  setMarkers: (markers: Array<ReactElement<Marker>>) => void;
}

const defaultValue: IMapContext = {
  map: null,
  setRegion(region) {
    return;
  },
  setEncodedPolyline(encoded) {
    return;
  },
  markers: [],
  setMarkers(markers) {
    return;
  }
};

export const MapContext = createContext<IMapContext>(defaultValue);

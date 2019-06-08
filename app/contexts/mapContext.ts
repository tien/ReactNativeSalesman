import { createContext } from "react";
import { Region } from "react-native-maps";

export interface IMapContext {
  region?: Region;
  setRegion: (region: Region) => void;
}

const defaultValue: IMapContext = {
  setRegion(region) {
    return;
  }
};

export const MapContext = createContext<IMapContext>(defaultValue);

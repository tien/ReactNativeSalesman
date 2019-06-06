import { createContext } from "react";

export interface ILocation {
  placeId: string;
  name: string;
  region: string;
  latitude?: number;
  longitude?: number;
}

interface IMainContext {
  addLocation: (location: ILocation) => void;
  locations: ILocation[];
}

const mainContextDefault: IMainContext = {
  addLocation(location: ILocation) {
    this.locations = [...this.locations, location];
  },
  locations: []
};

export const mainContext = createContext<IMainContext>(mainContextDefault);

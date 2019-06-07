import { createContext } from "react";

export interface ILocation {
  placeId: string;
  name: string;
  region: string;
  latitude?: number;
  longitude?: number;
}

interface IMainContext {
  currentRoute: Route;
  setRoute: (route: Route) => void;
  addLocation: (location: ILocation) => void;
  removeLocation: (location: ILocation) => void;
  locations: ILocation[];
}

export enum Route {
  HOME,
  SEARCH,
  LOCATE,
  DIRECTION
}

const mainContextDefault: IMainContext = {
  currentRoute: Route.HOME,
  setRoute(route: Route) {
    return;
  },
  addLocation(location: ILocation) {
    return;
  },
  removeLocation(location: ILocation) {
    return;
  },
  locations: []
};

export const mainContext = createContext<IMainContext>(mainContextDefault);

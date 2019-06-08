import { createContext } from "react";

export enum Route {
  HOME,
  SEARCH,
  LOCATE,
  DIRECTION
}

export interface INavigationContext {
  currentRoute: Route;
  goToRoute: (route: Route) => void;
}

const defaultValue = {
  currentRoute: Route.HOME,
  goToRoute() {
    return;
  }
};

export const NavigationContext = createContext<INavigationContext>(defaultValue);

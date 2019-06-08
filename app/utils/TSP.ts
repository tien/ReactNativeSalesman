import { getDistance } from "geolib";
import { without } from "ramda";

import { ILocation } from "../contexts";
import { permutations } from "./misc";

export interface IDistanceMap {
  [key: string]: { [key: string]: number };
}

function distance(a: string, b: string, distanceMap: any): number {
  return distanceMap[a][b];
}

function recursiveTSP(
  a: any,
  b: any[],
  distanceMap: IDistanceMap,
  memory: { [key: string]: number }
): number {
  if (b.length === 0) {
    return 0;
  }

  const key = `${a}:${b.slice().sort()}`;
  const computed = memory[key];
  if (computed !== undefined) {
    return computed;
  }

  const result = Math.min(
    ...b.map(
      (val, _, arr) =>
        distance(a, val, distanceMap) +
        recursiveTSP(val, without(val, arr), distanceMap, memory)
    )
  );

  memory[key] = result;

  return result;
}

export function TSP(locations: ILocation[]) {
  const [first, ...rest] = locations.map(location => location.placeId);

  const distanceMap = (permutations(2, locations) as Array<
    [ILocation, ILocation]
  >).reduce(
    (prev, [location1, location2]) => ({
      ...prev,
      [location1.placeId]: {
        ...prev[location1.placeId],
        [location2.placeId]: getDistance(location1, location2)
      }
    }),
    {} as IDistanceMap
  );

  return recursiveTSP(first, rest, distanceMap, {});
}

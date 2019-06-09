import { map, minBy, pluck, without } from "ramda";

import { ILocation } from "../contexts";
import { gmapClient } from "../services/googleMap";

function recursiveTSP(
  a: string,
  b: string[],
  initialLocation: string,
  distanceMap: { [key: string]: { [key: string]: number } },
  memory: { [key: string]: { path: string[]; distance: any } }
) {
  if (b.length === 0) {
    return {
      path: [a, initialLocation],
      distance: distanceMap[a][initialLocation]
    };
  }

  const key = `${a}:${b.slice().sort()}`;
  const computed = memory[key];
  if (computed !== undefined) {
    return { path: [a, ...computed.path], distance: computed.distance };
  }

  const result: { path: string[]; distance: number } = b
    .map((val, _, arr) => {
      const next = recursiveTSP(
        val,
        without([val], arr),
        initialLocation,
        distanceMap,
        memory
      );
      return {
        path: [a, ...next.path],
        distance: distanceMap[a][val]
      };
    })
    .reduce((prev, curr) => minBy(route => route.distance, prev, curr));

  memory[key] = result;

  return result;
}

export async function TSP(locations: ILocation[]) {
  const placeIds = pluck("placeId", locations);
  const [first, ...rest] = placeIds;

  const mapLatlng = map(
    ({ latitude, longitude }: ILocation) => [latitude, longitude] as [number, number]
  );

  const distanceData = await gmapClient
    .distanceMatrix({ origins: mapLatlng(locations), destinations: mapLatlng(locations) })
    .asPromise()
    .then(res => res.json.rows);

  const distances = distanceData.reduce(
    (prevOrig, currOrig, origIndex) => ({
      ...prevOrig,
      [placeIds[origIndex]]: currOrig.elements.reduce(
        (prevDest, currDest, destIndex) => ({
          ...prevDest,
          [placeIds[destIndex]]: currDest.distance.value
        }),
        {}
      )
    }),
    {}
  );

  return recursiveTSP(first, rest, first, distances, {});
}

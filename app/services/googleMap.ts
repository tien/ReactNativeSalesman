import gmap from "@google/maps";
import Config from "react-native-config";

export const gmapClient = gmap.createClient({
  key: Config.GOOGLE_MAPS_API_KEY,
  Promise
});

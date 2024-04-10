import { getTimeOfTheDay } from "./ExtraFunctions";

export const TABLE_DATA_LIMIT = 15;
export const COUNTRY_TABLE_URL =
  "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records";
export const API_KEY = "83d9e0d0dbd51a0fc96c76ed96664aca";

interface WeatherColorCode {
  [key: number]: string;
}
export const WEATHER_COLOR_CODE: WeatherColorCode = {
  2: "#471647",
  3: "#688e99",
  5: "#1b1b51",
  6: "#ffffff",
  7: "#684d4d",
  800: getTimeOfTheDay() === "Night" ? "#000000" : "#b17507",
  8: getTimeOfTheDay() === "Night" ? "#646464" : "#958c77",
};

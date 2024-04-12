import { getCountry } from "countries-and-timezones";
import { WEATHER_COLOR_CODE } from "./Constants";
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const getColorFromWeatherId = (
  id: number | undefined,
  country: string
): string => {
  if (!id || isNaN(id)) return "white";
  if (id === 800)
    return getTimeOfTheDay(country) === "Night"
      ? "#000000"
      : WEATHER_COLOR_CODE[id];
  if (id === 8 && getTimeOfTheDay(country) === "Night") return "#646464";
  return WEATHER_COLOR_CODE[Math.floor(id / 100)];
};

export const getToday = (country: string) => {
  const date = new Date(
    new Date().toLocaleString("en-EN", {
      timeZone: getCountry(country)?.timezones[0],
    })
  );
  return (
    date.getDate() + "-" + months[date.getMonth()] + "-" + date.getFullYear()
  );
};

export const getTodayDay = (country: string) => {
  const date = new Date(
    new Date().toLocaleString("en-EN", {
      timeZone: getCountry(country)?.timezones[0],
    })
  );
  return days[date.getDay()] + ", " + date.getHours() + ":" + date.getMinutes();
};

export const getTimeOfTheDay = (country: string) => {
  const currentHour = new Date(
    new Date().toLocaleString("en-EN", {
      timeZone: getCountry(country)?.timezones[0],
    })
  ).getHours();
  if (currentHour >= 5 && currentHour < 12) {
    return "Morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "Afternoon";
  } else if (currentHour >= 17 && currentHour < 20) {
    return "Evening";
  }
  return "Night";
};

export function celsiusToKelvin(celsius: number) {
  return celsius + 273.15;
}

export function kelvinToCelsius(kelvin: number) {
  return kelvin - 273.15;
}
export interface CustomError {
  code: string;
  message: string;
}

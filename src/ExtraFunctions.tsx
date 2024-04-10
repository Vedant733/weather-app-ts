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

export const getColorFromWeatherId = (id: number): string => {
  if (isNaN(id)) return "white";
  if (id === 800) return WEATHER_COLOR_CODE[id];
  return WEATHER_COLOR_CODE[Math.floor(id / 100)];
};

export const getToday = () => {
  const date = new Date();
  return (
    date.getDate() + "-" + months[date.getMonth()] + "-" + date.getFullYear()
  );
};

export const getTodayDay = () => {
  const date = new Date();
  return days[date.getDay()] + ", " + date.getHours() + ":" + date.getMinutes();
};

export const getTimeOfTheDay = () => {
  const currentHour = new Date().getHours();
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

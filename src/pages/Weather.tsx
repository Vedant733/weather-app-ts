/* eslint-disable react-hooks/exhaustive-deps */
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_KEY } from "../Constants";
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { ClipLoader } from "react-spinners";
import {
  CustomError,
  getColorFromWeatherId,
  getTimeOfTheDay,
  getToday,
  getTodayDay,
  kelvinToCelsius,
} from "../ExtraFunctions";
import React, { ReactNode } from "react";
import { toast } from "react-toastify";

type MainWeather = {
  id: number;
  main: string;
  icon: string;
};

type WeatherResponse = {
  base: string;
  clouds: {
    all: number;
  };
  main: {
    feels_like: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  name: string;
  visibility: string;
  wind: { speed: number };
  weather: MainWeather[];
  sys: {
    country: string;
  };
};

function Weather() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  React.useEffect(() => {
    const lat = params.get("lat");
    const lon = params.get("lon");
    if (!lat || !lon || isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) {
      toast.error("Something Went Wrong.");
      navigate("/");
    }
  }, []);

  const [unit, setUnit] = React.useState("K");
  const getCurrentUnit = (input: number | undefined) => {
    if (!input) return input;
    if (unit === "K")
      return (
        <>
          {input}
          <sup>K</sup>
        </>
      );
    return (
      <>
        {kelvinToCelsius(input).toFixed(1)}
        <sup>C</sup>
      </>
    );
  };
  const { data, isLoading } = useQuery(
    "WEATHER" + params.get("lat") + params.get("lon"),
    () => {
      return axios.get<WeatherResponse>(
        `https://api.openweathermap.org/data/2.5/weather?lat=${params.get(
          "lat"
        )}&lon=${params.get("lon")}&appid=${API_KEY}`
      );
    },
    {
      onError: (err: AxiosError<CustomError>) => {
        navigate("/");
        toast.error(err.message, { toastId: "weatherError" });
      },
    }
  );

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "grid",
            placeItems: "center",
          }}
        >
          <ClipLoader size={50} color="blue" />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          <FormControl
            fullWidth
            sx={{
              position: "absolute",
              top: "20px",
              left: "20px",
              width: "fit-content",
            }}
          >
            <InputLabel id="demo-simple-select-label">Unit</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={unit}
              label="Unit"
              onChange={(event) => {
                setUnit(event.target.value as string);
              }}
            >
              <MenuItem selected value={"K"}>
                Kelvin
              </MenuItem>
              <MenuItem value={"C"}>Degree Celcius</MenuItem>
            </Select>
          </FormControl>
          <Box
            sx={{
              display: "flex",
              height: "100vh",
              width: { xs: "100%", md: "30%" },
              background: "white",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              margin: { xs: "0", sm: "0px 84px" },
            }}
          >
            <Box sx={{ width: "200px", height: "200px" }}>
              <img
                src={`https://openweathermap.org/img/wn/${data?.data?.weather[0].icon}@2x.png`}
                alt=""
                width="100%"
                height="100%"
              />
            </Box>
            <Typography
              sx={{ fontSize: { xs: "48px", sm: "62px" }, fontWeight: 500 }}
            >
              {getCurrentUnit(data?.data?.main.feels_like)}
            </Typography>
            <Typography sx={{ fontSize: { xs: "24px", sm: "32px" } }}>
              {data?.data?.weather[0].main}
            </Typography>
            <Divider sx={{ width: "100%", margin: "12px 0px" }} />
            <Typography>
              {getToday(data?.data?.sys?.country ?? "IN")}
            </Typography>
            <Typography
              sx={{ fontSize: { xs: "16px", sm: "20px" }, fontWeight: 500 }}
            >
              {getTodayDay(data?.data?.sys?.country ?? "IN")}
            </Typography>
            <Typography
              sx={{ fontSize: { xs: "16px", sm: "20px" }, fontWeight: 500 }}
            >
              {getTimeOfTheDay(data?.data?.sys?.country ?? "IN")}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "32px", sm: "48px" },
                fontWeight: 500,
                width: "100%",
                textAlign: "center",
              }}
            >
              {data?.data?.name}
            </Typography>
          </Box>
          <Box
            sx={{
              height: "auto",
              width: { xs: "100%", md: "70%" },
              background:
                getColorFromWeatherId(
                  data?.data?.weather[0].id,
                  data?.data?.sys?.country ?? "IN"
                ) + "40",
              padding: "24px",
              paddingTop: 0,
            }}
          >
            <Typography
              sx={{ fontSize: "48px", fontWeight: 500, marginBottom: "24px" }}
            >
              Today
            </Typography>
            <Box
              sx={{
                display: "grid",
                gap: "24px",
                gridTemplateColumns: {
                  sm: "repeat(auto-fill,minmax(200px,1fr))",
                  lg: "repeat(auto-fill,minmax(300px,1fr))",
                },
                alignItems: "center",
              }}
            >
              <WrapperCard
                country={data?.data?.sys?.country ?? "IN"}
                bgColor={data?.data?.weather[0].id}
                title="Pressure"
                value={`${data?.data?.main.pressure} hPa`}
              ></WrapperCard>
              <WrapperCard
                country={data?.data?.sys?.country ?? "IN"}
                bgColor={data?.data?.weather[0].id}
                title="Humidity"
                value={`${data?.data?.main.humidity} %`}
              ></WrapperCard>
              <WrapperCard
                country={data?.data?.sys?.country ?? "IN"}
                bgColor={data?.data?.weather[0].id}
                title="Visibility"
                value={`${data?.data?.visibility} km`}
              ></WrapperCard>
              <WrapperCard
                country={data?.data?.sys?.country ?? "IN"}
                bgColor={data?.data?.weather[0].id}
                title="Wind"
                value={`${data?.data?.wind.speed} m/s`}
              ></WrapperCard>
              <WrapperCard
                country={data?.data?.sys?.country ?? "IN"}
                bgColor={data?.data?.weather[0].id}
                title="Cloudiness"
                value={data?.data?.clouds.all}
              ></WrapperCard>
              <WrapperCard
                country={data?.data?.sys?.country ?? "IN"}
                bgColor={data?.data?.weather[0].id}
                title="Max Temperature"
                value={getCurrentUnit(data?.data?.main.temp_max)}
              ></WrapperCard>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

interface Props {
  title: string;
  value: ReactNode;
  bgColor: number | undefined;
  country: string;
}

function WrapperCard(props: Props) {
  return (
    <Box
      sx={{
        width: "calc( 100% - 32px )",
        height: "calc( 180px - 32px )",
        background: getColorFromWeatherId(props.bgColor, props.country),
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <Typography sx={{ fontSize: "28px", color: "white", fontWeight: 500 }}>
        {props.title}
      </Typography>
      <Typography sx={{ fontSize: "42px", color: "white", fontWeight: 500 }}>
        {props.value}
      </Typography>
    </Box>
  );
}

export default Weather;

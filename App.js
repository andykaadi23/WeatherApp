import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "./src/constant";
import { API_URL } from "@env";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import WeatherSearch from "./src/components/weatherSearch";
import WeatherInfo from "./src/components/weatherInfo";

const App = () => {
  const [weatherData, setWeatherData] = useState();
  const [status, setStatus] = useState("");

  const renderComponent = () => {
    switch (status) {
      case "loading":
        return <ActivityIndicator size="large" />;
      case "success":
        return <WeatherInfo weatherData={weatherData} />;
      case "error":
        return (
          <Text>
            Something went wrong. Please try again with a correct city name.
          </Text>
        );
      default:
        return;
    }
  };

  const searchWeather = (location) => {
    setStatus("loading");
    axios
      .get(`${BASE_URL}?q=${location}&limit=5&appid=${API_URL}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_URL}`,
        },
      })
      .then((geoResponse) => {
        if (geoResponse.data.length === 0) {
          setWeatherData(null);
          setStatus("error");
          return;
        }
        const { lat, lon } = geoResponse.data[0];
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_URL}`
          )
          .then((weatherResponse) => {
            const { name } = geoResponse.data[0];
            const { temp } = weatherResponse.data.main;
            const { visibility } = weatherResponse.data;
            const wind_speed = weatherResponse.data.wind.speed;

            setWeatherData({ name, temp, visibility, wind_speed });
            setStatus("success");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
        setStatus("error");
      });
  };

  return (
    <View style={styles.container}>
      <WeatherSearch searchWeather={searchWeather} />
      <View style={styles.margintTop20}>{renderComponent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default App;

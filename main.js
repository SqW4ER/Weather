"use strict";
import {
  saveFavoriteCities,
  saveCurrentCity,
  getFavoriteCities,
  getCurrentCity,
} from "./save_cities.js";

const CITY_LIST = [];

function getCityName() {
  const cityName = document.querySelector(".search-text").value;
  if (cityName) {
    saveCurrentCity(cityName);
    getWeather(cityName);
  } else alert("Введите название города");
}

function serverConnect(city) {
  const serverUrl = "https://api.openweathermap.org";
  const apiKey = "f660a2fb1e4bad108d6160b7f58c555f";
  const url = `${serverUrl}/data/2.5/weather?q=${city}&appid=${apiKey}`;
  return url;
}

function getWeather(city) {
  likeCheck();
  const url = serverConnect(city);
  const response = fetch(url);
  response
    .then((resp) => resp.json())
    .then((value) => {
      try {
        const temp = Math.round(value.main.temp - 273.15) + "°";
        document.querySelector(".temp").textContent = temp;

        const icon = document.querySelector(".weather-icon");
        icon.src = `https://openweathermap.org/img/wn/${value.weather[0].icon}@4x.png`;
        icon.hidden = false;
        const cities = document.querySelectorAll(".city-name");
        for (let key of cities) {
          key.textContent = city;
        }

        getDetails(value);
      } catch {
        alert(value.message);
      }
    })
    .catch((error) => alert(error.message));
}

function getDetails(data) {
  let temperature = document.querySelector(".temp-details");
  let feelsLike = document.querySelector(".feel-details");
  let weather = document.querySelector(".weather-details");
  let sunRise = document.querySelector(".sunrise-details");
  let sunSet = document.querySelector(".sunset-details");
  temperature.textContent = Math.round(data.main.temp - 273.15) + "°";
  feelsLike.textContent = Math.round(data.main.feels_like - 273.15) + "°";
  weather.textContent = data.weather[0].main;
  let sunriseDate = new Date(1000 * data.sys.sunrise);
  sunRise.textContent = sunriseDate.getHours() + ":" + sunriseDate.getMinutes();
  let sunsetDate = new Date(1000 * data.sys.sunset);
  sunSet.textContent = sunsetDate.getHours() + ":" + sunsetDate.getMinutes();
}

function saveCity() {
  const cityName = document.querySelector(".city-name").textContent;
  const cityIndex = CITY_LIST.indexOf(cityName);
  const likeImage = document.querySelector(".city-like-img");
  if (cityIndex === -1) {
    CITY_LIST.push(cityName);
    likeImage.src = "img/heart.png";
  } else {
    CITY_LIST.splice(cityIndex, 1);
    likeImage.src = "img/empty_heart.png";
  }
}

function likeCheck() {
  const currentCityName = getCurrentCity();
  console.log(currentCityName);
  const favoriteCityArray = getFavoriteCities();
  console.log(favoriteCityArray);
  const likeImage = document.querySelector(".city-like-img");
  if (favoriteCityArray != null) {
    if (favoriteCityArray.includes(currentCityName)) {
      console.log(2);
      likeImage.src = "img/heart.png";
      likeImage.hidden = false;
    } else {
      console.log(1);
      likeImage.src = "img/empty_heart.png";
      likeImage.hidden = false;
    }
  } else {
    likeImage.src = "img/empty_heart.png";
    likeImage.hidden = false;
  }
}

function render() {
  const getList = document.querySelector(".location-list-ul");
  getList.innerHTML = "";
  CITY_LIST.forEach((element) => {
    const listItem = document.createElement("li");
    listItem.textContent = element;
    listItem.addEventListener("click", (evt) => {
      evt.preventDefault();
      getWeather(element);
      saveCurrentCity(element);
    });
    getList.append(listItem);
  });
  saveFavoriteCities(CITY_LIST);
}

let searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  getCityName();
  render();
});

let saveButton = document.querySelector(".city-like");
saveButton.addEventListener("click", (event) => {
  event.preventDefault();
  saveCity();
  render();
});

document.addEventListener("DOMContentLoaded", function () {
  const loadList = getFavoriteCities();
  if (loadList !== null) {
    loadList.forEach((element) => {
      CITY_LIST.push(element);
    });
  }
  const currentCity = getCurrentCity();
  if (currentCity !== null) {
    getWeather(getCurrentCity());
  }
  render();
});

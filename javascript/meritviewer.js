"use strict";

let AppData = {};
const dataURL = "../data/meritviewer-data.json";

const empireColors = {
  "all" : ["black", "silver"],
  "nc" : ["navy", "gold"],
  "tr" : ["darkred", "black"],
  "vs" : ["darkpurple", "seagreen"]
}

const fetchAppData = (url) => {
  fetch(url)
    .then(data => data.json())
    .then(res => AppData = res)
};

const changeEmpireGradientTheme = (empreColorArray) => {
  console.log("From the changeEmpireGradientTheme function");
}

fetchAppData(dataURL);

"use strict";

let AppData = {};
let currentEmpire = "";
const dataURL = "../data/meritviewer-data.json";

const empireColors = {
  "all" : ["grey darken-4", "silver"],
  "nc" : ["indigo darken-4", "gold"],
  "tr" : ["red darken-4", "black"],
  "vs" : ["purple darken-4", "seagreen"]
};

$('img').hover(
  () => {
    let lbl = $(event.target).data('empire-label');
    $('#h5-hover-empire').text(lbl);
  },
  () => {
    $('#h5-hover-empire').text("")
  }
);

const fetchAppData = (url) => {
  fetch(url)
    .then(data => data.json())
    .then(res => AppData = res)
};

const changeSelectedEmpire = (newEmpire) => {
  currentEmpire = newEmpire;
  $('header, footer').attr("class", empireColors[newEmpire][0]);
  $('#h4-selected-empire').text($(event.target).data('empire-label'));
}

fetchAppData(dataURL);

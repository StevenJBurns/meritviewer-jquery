"use strict";

let AppData = {};
let currentEmpire = "";
const dataURL = "../data/meritviewer-data.json";

let Shuffle = window.Shuffle;
let divGroups = document.getElementById('div-groups');
//let sizer = divGroups.querySelector('.group');

let groupsShuffle = new Shuffle(divGroups, {
  itemSelector: 'a.group',
  buffer: 1,
  isCentered: true
  //sizer: sizer // could also be a selector: '.my-sizer-element'
});

// groupsShuffle.filter();

const empireColors = {
  "all" : ["grey darken-4", "silver"],
  "nc" : ["indigo darken-4", "gold"],
  "tr" : ["red darken-4", "black"],
  "vs" : ["purple darken-4", "seagreen"]
};

$('img').hover(
  () => {
    let lbl = $(event.target).data('empire-label');
    $('#h5-hover-empire')
      .text(lbl).
      css('visibility', 'visible');
  },
  () => {
    $('#h5-hover-empire').css({
      'visibility' : 'hidden',
      'display' : 'block'
    });
  }
);

const fetchAppData = (url) => {
  fetch(url)
    .then(res => res.json())
    .then(json => AppData = json)
    .then(data => initDataElements());
};

const initLocalStorage = () => {


};

const initDataElements = () => {
  let groups = [];

  for (let cat of AppData.MeritData.Category) {
    let divCategory = `<div class="btn category"><h6>${cat.name}</h6></div>`;
    $('#div-categories').append(divCategory);

    for (let grp of cat.Group) {
      groups.push({"name" : grp.name, "parent" : cat.name});
    }
  }
  console.log(groups);
  
  for (let g of groups) {
    let newGroup = `<a class="btn group col s3" data-groups="['${g.parent}']"><h6>${g.name}</h6></a>`;
    $('#div-groups').append(newGroup);
  }
  groupsShuffle.update();
  groupsShuffle.filter();
}

const changeSelectedEmpire = (newEmpire) => {
  currentEmpire = newEmpire;
  $('header, footer').attr("class", empireColors[newEmpire][0]);
  $('#h4-selected-empire').text($(event.target).data('empire-label'));
}

fetchAppData(dataURL);
initLocalStorage();

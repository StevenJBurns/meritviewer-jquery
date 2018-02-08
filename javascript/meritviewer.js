"use strict";

let AppData = {};
let currentEmpire = "";
let Shuffle = window.Shuffle;
let groupsShuffle;
let meritsShuffle;

const dataURL = "../data/meritviewer-data.json";

const empireData = {
  "all" : {
    "title" : "All Empires",
    "style" : ["grey darken-4", "silver"]
  },
  "nc" : {
    "title" : "New Conglomerate",
    "style" : ["indigo darken-4", "gold"]
  },
  "tr" : {
    "title" : "Terran Republic",
    "style" : ["red darken-4", "black"]
  },
  "vs" : {
    "title" : "Vanu Sovereignty",
    "style" : ["purple darken-4", "seagreen"]
  }
};

$('img').hover(
  (event) => {
    let lbl = $(event.target).data('empire-label');
    $('#h5-hover-empire').text(lbl).css('visibility', 'visible');
  },
  (event) => {
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
    .then(groupsShuffle = new Shuffle(document.querySelector("#div-groups"),
      {
        buffer: 1, // Useful for percentage based heights when they might not always be exactly the same (in pixels).
        columnThreshold: 0.01, // Reading the width of elements isn't precise enough and can cause columns to jump between values.
        columnWidth: 160, // A static number or function that returns a number which tells the plugin how wide the columns are (in pixels).
        // delimeter: null, // If your group is not json, and is comma delimeted, you could set delimeter to ','.
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // CSS easing function to use.
        filterMode: Shuffle.FilterMode.ANY, // When using an array with filter(), the element passes the test if any of its groups are in the array. With "all", the element only passes if all groups are in the array.
        group: Shuffle.ALL_ITEMS, // Initial filter group.
        gutterWidth: 0, // A static number or function that tells the plugin how wide the gutters between columns are (in pixels).
        initialSort: null, // Shuffle can be initialized with a sort object. It is the same object given to the sort method.
        isCentered: true, // Attempt to center grid items in each row.
        //itemSelector: [".group"], // e.g. '.picture-item'.
        roundTransforms: true, // Whether to round pixel values used in translate(x, y). This usually avoids blurriness.
        sizer: null, // Element or selector string. Use an element to determine the size of columns and gutters.
        speed: 333, // Transition/animation speed (milliseconds).
        staggerAmount: 50, // Transition delay offset for each item in milliseconds.
        staggerAmountMax: 150, // Maximum stagger delay in milliseconds.
        throttleTime: 300, // How often shuffle can be called on resize (in milliseconds).
        useTransforms: true, // Whether to use transforms or absolute positioning.
        })
    )
    .then(meritsShuffle = new Shuffle(document.querySelector("#ul-merits"),
    {
      buffer: 1, // Useful for percentage based heights when they might not always be exactly the same (in pixels).
      columnThreshold: 0.01, // Reading the width of elements isn't precise enough and can cause columns to jump between values.
      // columnWidth: 160, // A static number or function that returns a number which tells the plugin how wide the columns are (in pixels).
      // delimeter: null, // If your group is not json, and is comma delimeted, you could set delimeter to ','.
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // CSS easing function to use.
      filterMode: Shuffle.FilterMode.ANY, // When using an array with filter(), the element passes the test if any of its groups are in the array. With "all", the element only passes if all groups are in the array.
      group: Shuffle.ALL_ITEMS, // Initial filter group.
      gutterWidth: 0, // A static number or function that tells the plugin how wide the gutters between columns are (in pixels).
      initialSort: null, // Shuffle can be initialized with a sort object. It is the same object given to the sort method.
      isCentered: false, // Attempt to center grid items in each row.
      //itemSelector: [".group"], // e.g. '.picture-item'.
      roundTransforms: true, // Whether to round pixel values used in translate(x, y). This usually avoids blurriness.
      sizer: null, // Element or selector string. Use an element to determine the size of columns and gutters.
      speed: 333, // Transition/animation speed (milliseconds).
      staggerAmount: 50, // Transition delay offset for each item in milliseconds.
      staggerAmountMax: 150, // Maximum stagger delay in milliseconds.
      throttleTime: 300, // How often shuffle can be called on resize (in milliseconds).
      useTransforms: true, // Whether to use transforms or absolute positioning.
      })
    )
    .then(data => initDataElements())
    .then(function() {
      let newItems = document.getElementById("div-groups").children;
      groupsShuffle.add([...newItems]);
    })
    .then(function() {
      let NewMerits = document.getElementById("ul-merits").children;
      meritsShuffle.add([...NewMerits]);
    })
};

const initLocalStorage = () => {


};

const initDataElements = () => {
  let categories = [];
  let groups = [];
  let merits = [];

  for (let cat of AppData.categories) {
    let newCategory = `<div class="btn category green darken-4 waves-effect waves-light center-align" data-group="${cat.title}" onclick="handleCategoryClick('${cat.title}')"><h6>${cat.title}</h6></div>`;
    $('#div-categories').append(newCategory);

    for (let grp of cat.groups) {
      groups.push({"title" : grp.title, "parent" : cat.title});

      for (let m of grp.merits) {
        merits.push({"title" : m.title, "parent": grp.title})
      }
    }
  }

  for (let g of groups) {
    let dataGroups = groups["parent"];
    let newGroup = `<div class="btn group green darken-3 waves-effect" data-groups='["${g.parent}"]' onclick="handleGroupClick('${g.title}')"><h6>${g.title}</h6></div>`;
    $('#div-groups').append(newGroup);
  }

  for (let m of merits) {
    let dataGroups = merits["parent"];
    let newMerit = `<li class="btn merit green darken-2 waves-effect" data-groups='["${m.parent}"]'><h6>${m.title}</h6></li>`;
    $('#ul-merits').append(newMerit);
  }
}

const changeSelectedEmpire = (newEmpire) => {
  currentEmpire = newEmpire;
  $('header, footer').attr("class", empireData[newEmpire]['style'][0]);
  $('#h4-selected-empire').text(empireData[newEmpire]['title']);
}

const handleCategoryClick = (category) => {
  groupsShuffle.filter(category);
  meritsShuffle.filter("none");
}

const handleGroupClick = (group) => meritsShuffle.filter(group);

fetchAppData(dataURL);
initLocalStorage();

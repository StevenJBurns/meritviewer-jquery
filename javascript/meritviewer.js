"use strict";

let AppData = {};
let currentEmpire = "";
let Shuffle = window.Shuffle;

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

let MeritViewer = function(element) {
  this.element = element;
  this._activeFilters = [];

  this.groupsShuffle = new Shuffle(element, {
    buffer: 0, // Useful for percentage based heights when they might not always be exactly the same (in pixels).
    columnThreshold: 0.01, // Reading the width of elements isn't precise enough and can cause columns to jump between values.
    columnWidth: 144, // A static number or function that returns a number which tells the plugin how wide the columns are (in pixels).
    // delimeter: null, // If your group is not json, and is comma delimeted, you could set delimeter to ','.
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // CSS easing function to use.
    filterMode: Shuffle.FilterMode.ANY, // When using an array with filter(), the element passes the test if any of its groups are in the array. With "all", the element only passes if all groups are in the array.
    group: Shuffle.ALL_ITEMS, // Initial filter group.
    gutterWidth: 0, // A static number or function that tells the plugin how wide the gutters between columns are (in pixels).
    initialSort: null, // Shuffle can be initialized with a sort object. It is the same object given to the sort method.
    isCentered: true, // Attempt to center grid items in each row.
    itemSelector: '.group', // e.g. '.picture-item'.
    roundTransforms: true, // Whether to round pixel values used in translate(x, y). This usually avoids blurriness.
    sizer: '.sizer', // Element or selector string. Use an element to determine the size of columns and gutters.
    speed: 250, // Transition/animation speed (milliseconds).
    staggerAmount: 15, // Transition delay offset for each item in milliseconds.
    staggerAmountMax: 150, // Maximum stagger delay in milliseconds.
    throttleTime: 300, // How often shuffle can be called on resize (in milliseconds).
    useTransforms: false, // Whether to use transforms or absolute positioning.
    });

  this.addShuffleEventListeners();
  this.addFilterButtons();
  //this.addSorting();
  //this.addSearchFilter();
};

MeritViewer.prototype.addShuffleEventListeners = function() {
  this.groupsShuffle.on(Shuffle.EventType.LAYOUT, data => {
    console.log('layout. data:', data);
  });

  this.groupsShuffle.on(Shuffle.EventType.REMOVED, function() {
    console.log('removed. data:', data);
  });
};

MeritViewer.prototype.addFilterButtons = function () {
  let options = document.querySelector('.div-categories');
  console.log(`options : ${options}`)
  if (!options) {
    return;
  }

  let filterButtons = Array.from(options.children);

  filterButtons.forEach(function (button) {
    button.addEventListener('click', this._handleFilterClick.bind(this), false);
  }, this);
};

MeritViewer.prototype._handleFilterClick = (e) => {
  let btn = e.currentTarget;
  let isActive = btn.classList.contains('active');
  let btnGroup = btn.getAttribute('data-group');
  
  this._removeActiveClassFromChildren(btn.parentNode);
  
  let filterGroup;

  if (isActive) {
    btn.classList.remove('active');
    filterGroup = Shuffle.ALL_ITEMS;
  } else {
    btn.classList.add('active');
    filterGroup = btnGroup;
  }

  this.groupsShuffle.filter(filterGroup);
};

MeritViewer.prototype._removeActiveClassFromChildren = parent => {
  var children = parent.children;
  for (var i = children.length - 1; i >= 0; i--) {
    children[i].classList.remove('active');
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
    .then(data => initDataElements())
};

const initLocalStorage = () => {


};

const initDataElements = () => {
  let categories = [];
  let groups = [];
  let merits = [];

  for (let cat of AppData.MeritData.Category) {
    let divCategory = `<div class="btn category" data-group="${cat.name}" onclick="handleCategoryClick('${cat.name}')"><h6>${cat.name}</h6></div>`;
    $('#div-categories').append(divCategory);

    for (let grp of cat.Group) {
      groups.push({"name" : grp.name, "parent" : cat.name});
    }
  }

  for (let g of groups) {
    let newGroup = `<div class="btn group col s2" data-groups="['${g.parent}']"><h6>${g.name}</h6></div>`;
    $('#div-groups').append(newGroup);
  }
}

const changeSelectedEmpire = (newEmpire) => {
  currentEmpire = newEmpire;
  $('header, footer').attr("class", empireData[newEmpire]['style'][0]);
  $('#h4-selected-empire').text(empireData[newEmpire]['title']);
}

const handleCategoryClick = (category) => {
  console.log(category);
  
  //MeritViewer.groupsShuffle.filter(category);
}

fetchAppData(dataURL);
window.meritviewer = new MeritViewer(document.getElementById('div-groups'));
initLocalStorage();

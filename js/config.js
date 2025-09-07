// js/config.js

// Global configuration variables
var imgSubDir = "flux";
var SearchEngine = "https://www.google.com/search?q=";
var typeInterval = 500; // Debounce interval for typing

// Version Timestamps
var lateststyles = 202310230000;
var EndOfLastVer120 = 202306072133;
var EndOfLastVer110 = 202305050000;

// Filter blacklist: Tags and countries too common to be useful as filters.
var DontShowAsFilters = [
  "Blizzard",
  "DC Comics",
  "Disney",
  "Marvel",
  "MTG",
  "Tolkien",
  "Oil",
  "Painting",
  "Illustration",
  "Portrait",
  "Character Design",
  "Cover Art",
  "Print",
  "Concept Art",
  "Ireland",
  "Scotland",
  "Norway",
  "Mexico",
  "Lithuania",
  "Sweden",
  "South Korea",
  "Portugal",
  "Switzerland",
  "USA",
  "Ukraine",
  "Belarus",
  "Spain",
  "Brazil",
  "Denmark",
  "Japan",
  "Austria",
  "France",
  "Philippines",
  "UK",
  "Poland",
  "Germany",
  "Canada",
  "Netherlands",
  "Italy",
  "Israel",
  "Taiwan",
  "Belgium",
  "Russia",
  "Australia",
  "Czech Republic",
  "Bulgaria",
  "Turkey",
  "China",
];

// Status code text for unavailable artists search results
var titletexts = {
  404: "Artist not known",
  304: "Something is recognized, but it's not related to the artist",
  301: "Something is recognized, but results are too different",
  205: "Artist is recognized, but difficult to prompt/not flexible",
  204: "Artist is recognized, but too different/generic",
  500: "Other",
};

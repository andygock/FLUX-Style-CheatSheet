import { data } from "./data.js";
import { exclArtists } from "./data-excluded-artists.js";

document.addEventListener("DOMContentLoaded", function (event) {
  var SearchEngine = "https://www.google.com/search?q=";
  var outputdata = "";
  var outputExcluded = "";
  var tags = {};
  var countstyles = 0;

  // Remove Diacritics (Special Characters)
  function removedia(e) {
    let updatedstring = e.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    return updatedstring;
  }

  outputdata = outputdata + '<table id="listedartists">';
  outputdata =
    outputdata +
    "<tr><th></th><th>Name</th><th>Born</th><th></th><th>Checkpoint</th><th>Categories</th><th>Extrainfo</th></tr>";

  //Put JSON in DOM
  for (var i = 0; i < data.length; i++) {
    let CurrentArtistName = data[i].Name;
    let currentAnchor = removedia(CurrentArtistName); // remove special characters (diacritics)
    currentAnchor = currentAnchor
      .replace(/[^a-zA-Z]+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, ""); // replace everything thats not a letter with a dash, trim dash from front and back
    let catlist = data[i].Category.replace(/\\/g, ""); //remove backslash

    let buildcatlist = catlist.split(",");
    let buildcatlistoutput = "";
    buildcatlist.forEach(function (value) {
      //build output without first
      buildcatlistoutput =
        buildcatlistoutput + "<span>" + value.trim() + "</span>";
    });

    let deathdate = "";
    let dagger = "";
    deathdate = data[i].Death;
    if (deathdate != false) {
      dagger = "<sup> &dagger;</sup>";
    }

    const lookupArray = CurrentArtistName.replace(/ *\([^)]*\) */g, "")
      .split(",")
      .map(function (item) {
        return item.trim();
      }); //remove braces, split at comma, trim spaces
    let LUPart1 = lookupArray[0];
    let LUPart2 = lookupArray[1];
    if (LUPart2) {
      var LUArtist = SearchEngine + LUPart2 + "%20" + LUPart1;
    } else {
      //if no comma in name
      var LUArtist = SearchEngine + LUPart1;
    }

    let j = i + 1; // don't want to start with zero

    outputdata = outputdata + "<tr>";
    outputdata =
      outputdata +
      '<td><a id="' +
      currentAnchor +
      '" href="#' +
      currentAnchor +
      '">' +
      j +
      "</a></td>";
    outputdata = outputdata + "<td>" + CurrentArtistName + "</td>";
    outputdata = outputdata + "<td>" + data[i].Born + "</td>";
    outputdata = outputdata + "<td>" + data[i].Death + "</td>";
    outputdata = outputdata + "<td>" + data[i].Checkpoint + "</td>";
    outputdata = outputdata + "<td>" + catlist + "</td>";
    outputdata = outputdata + "<td>" + data[i].Extrainfo + "</td>";
    outputdata = outputdata + "</tr>";

    countstyles++;

    //fill tags list for filter
    let arrrrr = data[i].Category.split(", ");
    arrrrr.forEach(function (tag) {
      if (tag in tags) {
        // If animal is present, increment the count
        tags[tag] = tags[tag] + 1;
      } else {
        // If animal is not present, add the entry
        tags[tag] = 1;
      }
    });
  }

  outputdata = outputdata + "</table>";

  var putStyles = document.getElementById("allthestyles");
  putStyles.innerHTML = outputdata;

  //Checkboxes
  var checkers = document.querySelectorAll("input[type=checkbox]");
  if (checkers) {
    for (var i = 0; i < checkers.length; i++) {
      var currentchecker = checkers[i];
      currentchecker.addEventListener("change", function (e) {
        let currentcheckboxID = e.target.id;
        if (this.checked == true) {
          document.body.classList.add(currentcheckboxID);
        } else {
          document.body.classList.remove(currentcheckboxID);
        }
      });
    }
  }

  outputExcluded = outputExcluded + '<table id="excludedartists">';
  outputExcluded =
    outputExcluded +
    "<tr><th></th><th></th><th>Name</th><th>Prompt used</th><th>Extrainfo</th></tr>";

  const titletexts = [];
  titletexts[404] = "Artist not known";
  titletexts[304] =
    "Something is recognized, but it's not related to the artist";
  titletexts[301] = "Something is recognized, but results are too different";
  titletexts[205] =
    "Artist is recognized, but difficult to prompt/not flexible";
  titletexts[204] = "Artist is recognized, but too different/generic";
  titletexts[500] = "Other";

  //Put JSON in DOM
  for (var i = 0; i < exclArtists.length; i++) {
    let CurrentArtistName = exclArtists[i].Name;
    let CurrentCode = exclArtists[i].Code;

    if (exclArtists[i].FirstName) {
      var CompNameWCom =
        exclArtists[i].Name.replace(/\\/g, "") +
        ", " +
        exclArtists[i].FirstName.replace(/\\/g, "");
      var CompNameNCom =
        exclArtists[i].FirstName.replace(/\\/g, "") +
        " " +
        exclArtists[i].Name.replace(/\\/g, "");
    } else {
      var CompNameWCom = exclArtists[i].Name.replace(/\\/g, "");
      var CompNameNCom = exclArtists[i].Name.replace(/\\/g, "");
    }

    let currentAnchor = removedia(CompNameNCom); // remove special characters (diacritics)
    currentAnchor = currentAnchor
      .replace(/[^a-zA-Z]+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, ""); // replace everything thats not a letter with a dash, trim dash from front and back

    let j = i + 1; // don't want to start with zero

    outputExcluded = outputExcluded + "<tr>";
    outputExcluded =
      outputExcluded +
      '<td><a id="' +
      currentAnchor +
      '" href="#' +
      currentAnchor +
      '">' +
      j +
      "</a></td>";
    outputExcluded =
      outputExcluded +
      '<td class="style-' +
      exclArtists[i].Code +
      '"><span title="' +
      titletexts[CurrentCode] +
      '">&#9608;</span></td>';
    outputExcluded = outputExcluded + "<td>" + CompNameWCom + "</td>";
    outputExcluded = outputExcluded + "<td>" + CompNameNCom + "</td>";
    outputExcluded =
      outputExcluded +
      "<td>" +
      exclArtists[i].Extrainfo.replace(/\\/g, "") +
      "</td>";
    outputExcluded = outputExcluded + "</tr>";

    countstyles++;
  }

  outputExcluded = outputExcluded + "</table>";

  var putExcluded = document.getElementById("excludedArtists");
  putExcluded.innerHTML = outputExcluded;
});

const imgSubDir = "flux";

document.addEventListener("DOMContentLoaded", function (event) {
  var SearchEngine = "https://www.google.com/search?q=";

  var lateststyles = 202310230000; // Stuff since last official release
  var EndOfLastVer120 = 202306072133; // Version 1.2.0
  var EndOfLastVer110 = 202305050000; // Version 1.1.0

  // Filter Buttons - Don't show countries or tags that are too common
  var DontShowAnyCountries = [
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
    "Ireland",
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

  // ----------------------

  var outputdata = "";
  var FilterOutput = "";
  var tags = [];
  var countstyles = 0;
  var typingTimer;
  var typeInterval = 500;
  var pages = document.querySelectorAll("section");
  var menulinks = document.querySelectorAll(".mbut");
  var searchdiv = document.getElementById("suche");
  var searchInput = document.getElementById("searchbox");
  var ratioInput = document.getElementById("ratiobox");
  var filbut = document.querySelector(".filterbut");
  var clearbut = document.getElementById("clearsearch");
  var numlines = document.querySelectorAll(".numberline span");
  var catsbox = document.getElementById("allcats");

  const titletexts = [];
  titletexts[404] = "Artist not known";
  titletexts[304] =
    "Something is recognized, but it's not related to the artist";
  titletexts[301] = "Something is recognized, but results are too different";
  titletexts[205] =
    "Artist is recognized, but difficult to prompt/not flexible";
  titletexts[204] = "Artist is recognized, but too different/generic";
  titletexts[500] = "Other";

  // Prepare Liked Styles
  var mystars = localStorage.getItem("mystars");
  if (mystars == null) {
    var mystars = [];
  } else {
    mystars = JSON.parse(mystars);
  }
  var starsexport = document.getElementById("starsexport");
  starsexport.value = mystars;

  // Initialize Sections as 'Pages'
  function hidepages() {
    if (pages) {
      for (var i = 0; i < pages.length; i++) {
        pages[i].classList.add("is-hidden");
      }
      for (var i = 0; i < menulinks.length; i++) {
        menulinks[i].classList.remove("active");
      }
      searchdiv.classList.add("is-hidden"); //hide search box
      document.getElementById("allcats").classList.remove("show"); //hide filters
    }
  }
  hidepages();
  if (pages) {
    pages[0].classList.remove("is-hidden");
    menulinks[0].classList.add("active");
    searchdiv.classList.remove("is-hidden");
  }

  if (menulinks) {
    for (var i = 0; i < menulinks.length; i++) {
      let currentml = menulinks[i];
      currentml.addEventListener("click", function (e) {
        e.preventDefault();
        var mldata = this.dataset.page;
        hidepages(); //hide everything first
        window.scroll(0, 100); //scroll up
        document.getElementById(mldata).classList.remove("is-hidden"); //display div that has id of menu links data
        this.classList.add("active"); //activate current menu link
        if (mldata == "styles") {
          searchdiv.classList.remove("is-hidden");
        } //display search box if styles
      });
    }
  }

  // Copy Categories Checkbox
  var CopyCatCheckbox = document.getElementById("copycat");
  if (localStorage.getItem("copycat")) {
    CopyCatCheckbox.checked = true;
  }
  CopyCatCheckbox.addEventListener("click", function (e) {
    if (CopyCatCheckbox.checked) {
      localStorage.setItem("copycat", "1");
      location.reload();
    } else {
      localStorage.removeItem("copycat");
      location.reload();
    }
  });

  // Put JSON in DOM
  function buildstyles() {
    for (var i = 0; i < data.length; i++) {
      if (data[i].Type == 1) {
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
          buildcatlistoutput += `<span>${value.trim()}</span>`;
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
          var LUArtist = SearchEngine + LUPart1;
        } //if no comma in name
        if (mystars.includes(data[i].Creation)) {
          var stylestar = " stared";
        } else {
          var stylestar = "";
        }

        let extraclass = "";
        if (localStorage.getItem("copycat")) {
          extraclass = " copythecats";
        }

        outputdata += `
          <div id="${currentAnchor}" class="stylepod lazy" data-index="${i}" data-creatime="${data[i].Creation}" data-bg="./img/${imgSubDir}/${data[i].Image}">
            <div class="styleinfo">
              <h3 title="${data[i].Name}">${data[i].Name}${dagger}</h3>
              <div class="more">
                <p class="category${extraclass}" title="${catlist}"><span class="checkpointname">${data[i].Checkpoint}</span>${buildcatlistoutput}</p>
                <span class="clicklinks">
                  <fieldset>
                    <legend>Copy Prompt</legend>
                    <span class="copyme">${data[i].Prompt}</span>
                  </fieldset>
                </span>
                <p class="extralinks">
                  <a class="zoomimg" title="Zoom" href="./img/${imgSubDir}/${data[i].Image}" target="_blank">
                    <img src="./src/zoom-white.svg" width="25" alt="Zoom">
                    <span class="elsp">Zoom</span>
                  </a>
                  <a href="${LUArtist}" title="Look Up Artist" target="_blank" class="lookupartist">
                    <img src="./src/magnifying-glass-white.svg" width="25" alt="Look Up Artist">
                    <span class="elsp">Look Up</span>
                  </a>
                  <a class="starthis${stylestar}" title="Mark as Favorite">
                    <img class="svg" src="./src/heart-outline-white.svg" width="25" title="Mark as Favorite">
                  </a>
                </p>
              </div>
            </div>
            <div class="gallery">
              <figure><figcaption></figcaption></figure>
              <figure></figure>
              <figure></figure>
              <figure></figure>
            </div>
          </div>
        `;

        countstyles++;

        //fill tags list for filter
        let arrrrr = data[i].Category.split(", ");
        arrrrr.forEach(function (tag) {
          if (tag in tags) {
            tags[tag] = tags[tag] + 1;
          } else {
            tags[tag] = 1;
          }
        });
      }
    }
    var putStyles = document.getElementById("allthestyles");
    putStyles.innerHTML = "";
    putStyles.innerHTML = outputdata;
  }
  buildstyles();
  searchInput.placeholder = "Search " + countstyles + " Styles";

  // Lightbox functionality
  let preventScroll = (e) => e.preventDefault();

  function openLightbox(imgSrc, infoHtml = "") {
    document.getElementById("lightbox-img").src = imgSrc;
    if (infoHtml) {
      document.getElementById("lightbox-info").innerHTML = infoHtml;
    }
    const scrollY = window.scrollY;
    document.body.classList.add("lightbox-open");
    document.body.style.top = `-${scrollY}px`;
    const lightbox = document.getElementById("lightbox");
    lightbox.classList.add("show");
    document.addEventListener("wheel", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });
  }

  function closeLightbox() {
    const scrollY = parseInt(document.body.style.top || "0");
    document.body.classList.remove("lightbox-open");
    document.body.style.top = "";
    window.scrollTo(0, -scrollY);
    const lightbox = document.getElementById("lightbox");
    lightbox.classList.remove("show");
    document.getElementById("lightbox-info").innerHTML = "";
    document.removeEventListener("wheel", preventScroll);
    document.removeEventListener("touchmove", preventScroll);
  }

  document.querySelectorAll(".zoomimg").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (document.getElementById("lightbox").classList.contains("show")) {
        // If lightbox is open, let the link open in new tab
        window.open(this.href, "_blank");
        return;
      }
      const imgSrc = this.href;
      openLightbox(imgSrc);
    });
  });

  document.getElementById("lightbox-close").addEventListener("click", () => {
    closeLightbox();
  });

  document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  });

  document.getElementById("lightbox-img").addEventListener("click", (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  // Create filter tags
  var sortedKeys = Object.keys(tags)
    .sort()
    .reduce((objEntries, key) => {
      objEntries[key] = tags[key];
      return objEntries;
    }, {});

  Object.keys(sortedKeys).forEach((key) => {
    if (sortedKeys[key] > 4 && DontShowAnyCountries.includes(key) == false) {
      let filtername = key.replace(/\\/g, "");
      FilterOutput += `<span data-srch="${filtername}">${filtername} <span>${sortedKeys[key]}</span></span>`;
    }
  });
  FilterOutput += `
    <span class="specialfilters" data-srch="Newest Styles">Newest Styles</span>
    <span class="specialfilters" data-srch="New Styles 1.2.0">New with 1.2.0</span>
    <span class="specialfilters" data-srch="New Styles 1.1.0">New with 1.1.0</span>
    <span class="specialfilters" data-srch="Liked">Liked <span><img class="svg" src="./src/heart-outline.svg" width="12"></span></span>
    <span class="specialfilters" data-srch="&dagger;">Only Deceased Artists <span>&dagger;</span></span>
  `;
  catsbox.innerHTML = FilterOutput;

  // Copy Prompt to Clipboard
  function addcopylistener(e, f) {
    for (var i = 0; i < e.length; i++) {
      let currentspan = e[i];
      currentspan.addEventListener("click", function () {
        var inp = document.createElement("input");
        document.body.appendChild(inp);
        if (f == "no") {
          var alttxt = this.title;
        } else {
          var alttxt = this.innerText;
        }
        inp.value = alttxt;
        inp.select();
        document.execCommand("copy", false);
        inp.remove();
        showSnackBar();
      });
    }
  }
  var spans = document.getElementsByClassName("copyme");
  var categorytags = document.getElementsByClassName("copythecats");
  addcopylistener(spans);
  addcopylistener(categorytags, "no");

  // Remove Diacritics (Special Characters)
  function removedia(e) {
    let updatedstring = e.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    return updatedstring;
  }

  // Styles open/close
  var pods = document.querySelectorAll(".stylepod");
  if (pods) {
    for (var i = 0; i < pods.length; i++) {
      var currentpod = pods[i];
      currentpod.addEventListener("click", function (e) {
        var cList = e.target.classList;
        let parentclasses = e.target.parentElement.classList; // need this for category copy

        if (
          cList.contains("copyme") ||
          parentclasses.contains("copythecats") ||
          cList.contains("extralinks") ||
          cList.contains("elsp") ||
          cList.contains("zoomimg") ||
          cList.contains("lookupartist") ||
          cList.contains("starthis") ||
          cList.contains("svg")
        ) {
          return;
        }

        // Open lightbox with the full image and info
        const scrollY = window.scrollY;
        const imgSrc = this.dataset.bg;
        const index = this.dataset.index;
        const infoHtml = buildStyleInfo(index);
        openLightbox(imgSrc, infoHtml);
        this.blur();
      });
    }
  }

  // Close lightbox on Escape key press
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (document.getElementById("lightbox").classList.contains("show")) {
        closeLightbox();
        return;
      }
      // Remove hash from URL
      const url = window.location.href.replace(/#.*/, "");
      history.replaceState({}, "", url);
    } else if (e.key.toLowerCase() === "z") {
      const lightbox = document.getElementById("lightbox");
      if (lightbox.classList.contains("show")) {
        closeLightbox();
      }
    }
  });

  //Stars - Favorite Styles
  function starfunction(e) {
    if (mystars.includes(e)) {
      let starindex = mystars.indexOf(e);
      let spliced = mystars.splice(starindex, 1);
      localStorage.setItem("mystars", JSON.stringify(mystars));
      if (searchInput.value == "Liked") {
        liveSearch();
      }
    } else {
      mystars.push(e);
      localStorage.setItem("mystars", JSON.stringify(mystars));
    }
    starsexport.value = mystars;
  }
  if (pods) {
    var starbuts = document.querySelectorAll(".starthis");
    if (starbuts) {
      for (var i = 0; i < starbuts.length; i++) {
        let currentstar = starbuts[i];
        currentstar.addEventListener("click", function (e) {
          e.preventDefault();
          let starbutstyledata = this.closest(".stylepod").dataset.creatime;
          starfunction(starbutstyledata);
          this.classList.toggle("stared");
        });
      }
    }
  }
  // Import Styles
  var StyleDialog = document.getElementById("stylesDialog");
  document
    .getElementById("importstyles")
    .addEventListener("click", function (e) {
      StyleDialog.showModal();
    });
  document
    .getElementById("stylesDialogConfirm")
    .addEventListener("click", (event) => {
      var eximp = document.getElementById("starsexport").value;
      event.preventDefault();
      StyleDialog.close();
      var sanitizeInput = eximp.replace(/[^\d,]+/g, ""); // only numbers and commas
      var newStyleInputarray = sanitizeInput.split(",").map(function (n) {
        return Number(n);
      });
      newStyleInputarray = newStyleInputarray.filter((val) => val != "0");
      for (var i = 0; i < newStyleInputarray.length; i++) {
        newStyleInputarray[i] = newStyleInputarray[i].toString(); // need strings instead of numbers
      }
      localStorage.setItem("mystars", JSON.stringify(newStyleInputarray));
      location.reload(); //need top update style list to update likes -> page reload
    });

  // Check if Anchor in url
  function hashcheck() {
    if (window.location.hash) {
      let thishash = window.location.hash;
      let thishashnew = thishash.replace("#", "");
      if (thishash) {
        let pod = document.getElementById(thishashnew);
        if (pod) {
          const imgSrc = pod.dataset.bg;
          const index = pod.dataset.index;
          const infoHtml = buildStyleInfo(index);
          openLightbox(imgSrc, infoHtml);
          pod.blur();
          // Add event listeners for lightbox elements
          const lightboxCopyme = document.querySelector(
            "#lightbox-info .copyme"
          );
          if (lightboxCopyme) {
            addcopylistener([lightboxCopyme]);
          }
          const lightboxStarthis = document.querySelector(
            "#lightbox-info .starthis"
          );
          if (lightboxStarthis) {
            lightboxStarthis.addEventListener("click", function (e) {
              e.preventDefault();
              let starbutstyledata = data[index].Creation;
              starfunction(starbutstyledata);
              this.classList.toggle("stared");
            });
          }
        }
      }
    }
  }
  hashcheck();

  // Filter
  if (filbut) {
    filbut.onclick = function (e) {
      e.preventDefault();
      filbut.classList.toggle("active");
      catsbox.classList.toggle("show");
    };
  }
  if (clearbut) {
    clearbut.onclick = function (e) {
      e.preventDefault();
      document.getElementById("searchbox").value = "";
      liveSearch();
    };
  }

  var filters = document.querySelectorAll("#allcats span");
  if (filters) {
    for (var i = 0; i < filters.length; i++) {
      var currentfilter = filters[i];
      currentfilter.addEventListener("click", function (e) {
        document.getElementById("searchbox").value = this.dataset.srch;
        liveSearch();
        catsbox.classList.toggle("show");
        filbut.classList.toggle("active");
      });
    }
  }

  // Initialize Lazy Loading
  const LL = new LazyLoad({});

  // Fill Search Array for Similar Names + Not Available Artists
  // https://github.com/aceakash/string-similarity
  // Moved to separate file string-similarity.js

  var searcharray = [];
  var simplearray = [];

  for (var i = 0; i < data.length; i++) {
    const lookupArray = data[i].Name.split(",").map(function (item) {
      return item.trim();
    }); //remove braces, split at comma, trim spaces
    let LUPart1 = lookupArray[0];
    let LUPart2 = lookupArray[1];
    if (LUPart2) {
      var LUArtist = LUPart2 + " " + LUPart1;
    } else {
      var LUArtist = LUPart1;
    }

    searcharray.push({ ArtistName: LUArtist, Status: 200 });
    simplearray.push(LUArtist);
  }
  for (var i = 0; i < exclArtists.length; i++) {
    let LUPart1 = exclArtists[i].Name;
    let LUPart2 = exclArtists[i].FirstName;
    if (LUPart2) {
      var LUArtist = LUPart2 + " " + LUPart1;
    } else {
      var LUArtist = LUPart1;
    }
    let AStatus = exclArtists[i].Code;

    searcharray.push({ ArtistName: LUArtist, Status: AStatus });
    simplearray.push(LUArtist);
  }

  // Search - https://css-tricks.com/in-page-filtered-search-with-vanilla-javascript/
  function liveSearch() {
    let search_query = document.getElementById("searchbox").value;
    let stylebegindate;
    let styleenddate;
    if (search_query == "New Styles 1.1.0") {
      stylebegindate = EndOfLastVer110;
      styleenddate = EndOfLastVer120;
    }
    if (search_query == "New Styles 1.2.0") {
      stylebegindate = EndOfLastVer120;
      styleenddate = lateststyles;
    }
    if (search_query == "Newest Styles") {
      stylebegindate = lateststyles;
      styleenddate = 999999999999;
    }

    for (var i = 0; i < pods.length; i++) {
      if (
        search_query == "New Styles 1.1.0" ||
        search_query == "New Styles 1.2.0" ||
        search_query == "Newest Styles"
      ) {
        let currentstyledate = pods[i].dataset.creatime;
        if (
          currentstyledate > stylebegindate &&
          currentstyledate < styleenddate
        ) {
          pods[i].classList.remove("is-hidden");
          clearbut.classList.remove("show");
        } else {
          pods[i].classList.add("is-hidden");
        }
      } else if (search_query == "Liked") {
        let currentstyledate = pods[i].dataset.creatime;
        if (mystars.includes(currentstyledate)) {
          pods[i].classList.remove("is-hidden");
          clearbut.classList.remove("show");
        } else {
          pods[i].classList.add("is-hidden");
        }
      } else {
        if (
          removedia(pods[i].textContent.toLowerCase()).includes(
            removedia(search_query.toLowerCase())
          )
        ) {
          pods[i].classList.remove("is-hidden");
          clearbut.classList.remove("show");
        } else {
          pods[i].classList.add("is-hidden");
        }
      }

      if (search_query) {
        clearbut.classList.add("show");
      } //also catches single html-entities like the cross
    }

    // Display Unavailable Artists in Search Results
    let countshownstyles = 0;
    let currentpods = document.querySelectorAll(".stylepod");
    for (var i = 0; i < currentpods.length; i++) {
      let vstatus = currentpods[i].classList;
      if (!vstatus.contains("is-hidden")) {
        countshownstyles = countshownstyles + 1;
      }
    }
    var searchinfo = document.getElementById("searchinfo");
    var notavail = document.getElementById("notavail");
    var matches = stringSimilarity.findBestMatch(search_query, simplearray);

    if (matches) {
      var getSimilar = [];
      for (var i in matches.ratings) {
        if (matches.ratings[i].rating > 0.4) {
          getSimilar.push(matches.ratings[i].target);
        }
      }

      var allarrayresults = "";
      var onlyavailable = "";
      for (var i = 0; i < getSimilar.length; i++) {
        var thisperson = searcharray.filter(function (person) {
          return person.ArtistName == getSimilar[i];
        });
        let currentAnchor = removedia(thisperson[0].ArtistName); // remove special characters (diacritics)
        currentAnchor = currentAnchor
          .replace(/[^a-zA-Z]+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, ""); // replace everything thats not a letter with a dash, trim dash from front and back

        if (thisperson[0].Status != 200) {
          allarrayresults += `<a href="./only-data.html#${currentAnchor}" target="_onlydata" class="ASearchStatus${
            thisperson[0].Status
          }" title="${titletexts[thisperson[0].Status]}">${
            thisperson[0].ArtistName
          }</a>`;
        } else {
          onlyavailable += `<span class="ASearchStatus${thisperson[0].Status}">${thisperson[0].ArtistName}</span>`;
        }
      }
    }

    if (countshownstyles != 0 && search_query != 0) {
      searchinfo.innerHTML = ` - ${search_query} (${countshownstyles})`;
      notavail.innerHTML = "";
      if (allarrayresults) {
        notavail.innerHTML = `Similar names of <a href="./only-data.html#notavailable" class="internal">artists that are unavailable</a>: <span id="naaresults>${allarrayresults}</span>`;
      }
    } else if (countshownstyles == 0 && search_query != 0) {
      searchinfo.innerHTML = "";
      notavail.innerHTML = "";
      if (allarrayresults) {
        notavail.innerHTML = `Checking for similar names and <a href="./only-data.html#notavailable" class="internal">artists that are unavailable</a>: <span id="naaresults">${onlyavailable}${allarrayresults}</span>`;
      }
    } else {
      searchinfo.innerHTML = "";
      notavail.innerHTML = "";
    }

    // Click on Similar Name Search Result
    var similars = document.getElementsByClassName("ASearchStatus200");
    if (similars) {
      for (var i = 0; i < similars.length; i++) {
        currentspan = similars[i];
        currentspan.addEventListener("click", function () {
          document.getElementById("searchbox").value = this.innerText;
          liveSearch();
        });
      }
    }
  }

  // A little delay
  if (searchInput) {
    searchInput.addEventListener("keyup", () => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(liveSearch, typeInterval);
    });
  }

  // Copy Notifier
  function showSnackBar() {
    var sb = document.getElementById("snackbar");
    sb.className = "show";
    setTimeout(() => {
      sb.className = sb.className.replace("show", "");
    }, 1500);
  }

  // Image Ratio Calculation
  function ratioCalc() {
    let imgbasesize = document.getElementById("ratiobox").value;
    if (imgbasesize > 0) {
      document.getElementById(
        "ir1b1"
      ).innerHTML = `${imgbasesize} &times; ${imgbasesize}`;
      let twobythree = (imgbasesize / 2) * 3;
      document.getElementById(
        "ir2b3"
      ).innerHTML = `${imgbasesize} &times; ${Math.round(twobythree)}`;
      let threebyfour = (imgbasesize / 3) * 4;
      document.getElementById(
        "ir3b4"
      ).innerHTML = `${imgbasesize} &times; ${Math.round(threebyfour)}`;
      let fourbyfive = (imgbasesize / 4) * 5;
      document.getElementById(
        "ir4b5"
      ).innerHTML = `${imgbasesize} &times; ${Math.round(fourbyfive)}`;
      let sixteenbynine = (imgbasesize / 9) * 16;
      document.getElementById("ir16b9").innerHTML = `${Math.round(
        sixteenbynine
      )} &times; ${imgbasesize}`;
      let sixteenbyten = (imgbasesize / 10) * 16;
      document.getElementById("ir16b10").innerHTML = `${Math.round(
        sixteenbyten
      )} &times; ${imgbasesize}`;
      let twentyonebynine = (imgbasesize / 9) * 21;
      document.getElementById("ir21b9").innerHTML = `${Math.round(
        twentyonebynine
      )} &times; ${imgbasesize}`;
    }
  }
  // Imaga Ratio Delay
  if (ratioInput) {
    ratioInput.addEventListener("keyup", () => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(ratioCalc, typeInterval);
    });
  }
  // Click on 'Numberline' span
  if (numlines) {
    for (var i = 0; i < numlines.length; i++) {
      var currentnumlines = numlines[i];
      currentnumlines.addEventListener("click", function (e) {
        ratioInput.value = this.innerText;
        ratioCalc();
      });
    }
  }

  // Arthistory Clicks
  var artlinks = document
    .getElementById("arthistory")
    .getElementsByTagName("a");
  if (artlinks) {
    for (var i = 0; i < artlinks.length; i++) {
      var currentartlink = artlinks[i];
      currentartlink.addEventListener("click", function (e) {
        let lala = this.getAttribute("href"); //get href from link
        let thislalanew = lala.replace("./index.html#", ""); //get hashtag from link
        if (thislalanew) {
          document.getElementById(thislalanew).classList.add("active"); //make sure style is open
        }
        hidepages(); //hide all pages
        document.querySelector('[data-page="styles"]').classList.add("active"); //styles menu link active
        document.getElementById("styles").classList.remove("is-hidden"); //activate styles div
        searchdiv.classList.remove("is-hidden"); //activate filter/search
      });
    }
  }

  // Function to build styleinfo HTML for lightbox
  function buildStyleInfo(index) {
    let item = data[index];
    let CurrentArtistName = item.Name;
    let catlist = item.Category.replace(/\\/g, ""); //remove backslash

    let buildcatlist = catlist.split(",");
    let buildcatlistoutput = "";
    buildcatlist.forEach(function (value) {
      buildcatlistoutput =
        buildcatlistoutput + "<span>" + value.trim() + "</span>";
    });

    let deathdate = "";
    let dagger = "";
    deathdate = item.Death;
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
      var LUArtist = SearchEngine + LUPart1;
    } //if no comma in name
    if (mystars.includes(item.Creation)) {
      var stylestar = " stared";
    } else {
      var stylestar = "";
    }

    let extraclass = "";
    if (localStorage.getItem("copycat")) {
      extraclass = " copythecats";
    }

    let html = `
      <div class="styleinfo">
        <h3 title="${item.Name}">${item.Name}${dagger}</h3>
        <div class="more">
          <p class="category${extraclass}" title="${catlist}"><span class="checkpointname">${item.Checkpoint}</span>${buildcatlistoutput}</p>
          <span class="clicklinks">
            <fieldset>
              <legend>Copy Prompt</legend>
              <span class="copyme">${item.Prompt}</span>
            </fieldset>
          </span>
          <p class="extralinks">
            <a class="zoomimg" title="Zoom" href="./img/${imgSubDir}/${item.Image}" target="_blank">
              <img src="./src/zoom-white.svg" width="25" alt="Zoom">
              <span class="elsp">Zoom</span>
            </a>
            <a href="${LUArtist}" title="Look Up Artist" target="_blank" class="lookupartist">
              <img src="./src/magnifying-glass-white.svg" width="25" alt="Look Up Artist">
              <span class="elsp">Look Up</span>
            </a>
            <a class="starthis${stylestar}" title="Mark as Favorite">
              <img class="svg" src="./src/heart-outline-white.svg" width="25" title="Mark as Favorite">
            </a>
          </p>
        </div>
      </div>
    `;

    return html;
  }
});

// js/app.js

document.addEventListener("DOMContentLoaded", function () {
  // --- Global State & DOM Elements ---
  var typingTimer;
  var mystars = JSON.parse(localStorage.getItem("mystars")) || [];
  var searchArray = [];
  var simpleSearchArray = [];

  const dom = {
    pages: document.querySelectorAll("section"),
    menuLinks: document.querySelectorAll(".mbut"),
    searchDiv: document.getElementById("suche"),
    searchInput: document.getElementById("searchbox"),
    ratioInput: document.getElementById("ratiobox"),
    filterButton: document.querySelector(".filterbut"),
    clearButton: document.getElementById("clearsearch"),
    numLines: document.querySelectorAll(".numberline span"),
    catsBox: document.getElementById("allcats"),
    stylesContainer: document.getElementById("allthestyles"),
    starsexport: document.getElementById("starsexport"),
    copyCatCheckbox: document.getElementById("copycat"),
    lightbox: document.getElementById("lightbox"),
    lightboxImg: document.getElementById("lightbox-img"),
    lightboxInfo: document.getElementById("lightbox-info"),
    searchInfo: document.getElementById("searchinfo"),
    notAvail: document.getElementById("notavail"),
  };

  // --- Initialization ---

  function init() {
    // Build UI
    const { styleCount, tags } = buildStyleList(data, mystars);

    buildFilterTags(tags);
    dom.searchInput.placeholder = `Search ${styleCount} Styles`;
    dom.starsexport.value = mystars.join(",");

    // Prepare search data
    prepareSearchArrays();

    // Setup page navigation
    setupPageNavigation();

    // Attach all event listeners
    attachEventListeners();

    // Check for hash in URL to open a style directly
    handleUrlHash();

    // Initialize Lazy Loading
    new LazyLoad({});
  }

  // --- Page Navigation & State ---

  function hideAllPages() {
    dom.pages.forEach((page) => page.classList.add("is-hidden"));
    dom.menuLinks.forEach((link) => link.classList.remove("active"));
    dom.searchDiv.classList.add("is-hidden");
    dom.catsBox.classList.remove("show");
  }

  function setupPageNavigation() {
    hideAllPages();
    dom.pages[0].classList.remove("is-hidden");
    dom.menuLinks[0].classList.add("active");
    dom.searchDiv.classList.remove("is-hidden");

    dom.menuLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const pageId = this.dataset.page;
        hideAllPages();
        window.scroll(0, 100);
        document.getElementById(pageId).classList.remove("is-hidden");
        this.classList.add("active");
        if (pageId === "styles") {
          dom.searchDiv.classList.remove("is-hidden");
        }
      });
    });
  }

  function handleUrlHash() {
    if (window.location.hash) {
      const pod = document.getElementById(window.location.hash.substring(1));
      if (pod) {
        // Using a small timeout to ensure images are ready
        setTimeout(() => pod.click(), 100);
      }
    }
  }

  // --- Search Functionality ---

  function prepareSearchArrays() {
    const processArtist = (artist) => {
      const nameParts = artist.Name.split(",").map((item) => item.trim());
      return nameParts[1] ? `${nameParts[1]} ${nameParts[0]}` : nameParts[0];
    };

    data.forEach((item) => {
      const artistName = processArtist(item);
      searchArray.push({ ArtistName: artistName, Status: 200 });
      simpleSearchArray.push(artistName);
    });

    exclArtists.forEach((item) => {
      const artistName = item.FirstName
        ? `${item.FirstName} ${item.Name}`
        : item.Name;
      searchArray.push({ ArtistName: artistName, Status: item.Code });
      simpleSearchArray.push(artistName);
    });
  }

  function liveSearch() {
    const query = dom.searchInput.value.toLowerCase();
    const normalizedQuery = removeDiacritics(query);
    const stylePods = dom.stylesContainer.children;
    let visibleCount = 0;

    // Special date-based filters
    const dateFilters = {
      "new styles 1.1.0": { start: EndOfLastVer110, end: EndOfLastVer120 },
      "new styles 1.2.0": { start: EndOfLastVer120, end: lateststyles },
      "newest styles": { start: lateststyles, end: 999999999999 },
    };

    const dateFilter = dateFilters[query];

    for (const pod of stylePods) {
      let isVisible = false;
      const creatime = pod.dataset.creatime;

      if (dateFilter) {
        isVisible = creatime > dateFilter.start && creatime < dateFilter.end;
      } else if (query === "liked") {
        isVisible = mystars.includes(creatime);
      } else {
        isVisible = removeDiacritics(pod.textContent.toLowerCase()).includes(
          normalizedQuery
        );
      }

      pod.classList.toggle("is-hidden", !isVisible);
      if (isVisible) visibleCount++;
    }

    dom.clearButton.classList.toggle("show", query.length > 0);
    updateSearchResultsInfo(query, visibleCount);
  }

  function updateSearchResultsInfo(query, count) {
    if (query.length === 0) {
      dom.searchInfo.innerHTML = "";
      dom.notAvail.innerHTML = "";
      return;
    }

    if (count > 0) {
      dom.searchInfo.innerHTML = ` - ${query} (${count})`;
    } else {
      dom.searchInfo.innerHTML = "";
    }

    // Find and display similar/unavailable artists
    const matches = stringSimilarity.findBestMatch(query, simpleSearchArray);
    const similarArtists = matches.ratings
      .filter((r) => r.rating > 0.4)
      .map((r) => {
        const person = searchArray.find((p) => p.ArtistName === r.target);
        const anchor = removeDiacritics(person.ArtistName)
          .replace(/[^a-zA-Z]+/g, "-")
          .replace(/^-+|-+$/g, "");

        if (person.Status !== 200) {
          return `<a href="./only-data.html#${anchor}" target="_onlydata" class="ASearchStatus${
            person.Status
          }" title="${titletexts[person.Status]}">${person.ArtistName}</a>`;
        } else if (count === 0) {
          // Only show available artists if there are no other results
          return `<span class="ASearchStatus200" data-name="${person.ArtistName}">${person.ArtistName}</span>`;
        }
        return null;
      })
      .filter(Boolean)
      .join("");

    if (similarArtists) {
      const introText =
        count === 0
          ? `Checking for similar names and <a href="./only-data.html#notavailable" class="internal">unavailable artists</a>:`
          : `Similar names of <a href="./only-data.html#notavailable" class="internal">unavailable artists</a>:`;
      dom.notAvail.innerHTML = `${introText} <span id="naaresults">${similarArtists}</span>`;
    } else {
      dom.notAvail.innerHTML = "";
    }
  }

  // --- Liking/Starring Functionality ---

  function toggleStar(creationId, starElement) {
    const index = mystars.indexOf(creationId);
    if (index > -1) {
      mystars.splice(index, 1);
    } else {
      mystars.push(creationId);
    }
    localStorage.setItem("mystars", JSON.stringify(mystars));
    dom.starsexport.value = mystars.join(",");

    if (starElement) {
      starElement.classList.toggle("stared");
    }

    // If viewing the "Liked" filter, refresh the search results
    if (dom.searchInput.value === "Liked") {
      liveSearch();
    }
  }

  function setupStarImport() {
    const dialog = document.getElementById("stylesDialog");
    document
      .getElementById("importstyles")
      .addEventListener("click", () => dialog.showModal());
    document
      .getElementById("stylesDialogConfirm")
      .addEventListener("click", (event) => {
        event.preventDefault();
        const sanitizedInput = dom.starsexport.value.replace(/[^\d,]+/g, "");
        const newStars = sanitizedInput
          .split(",")
          .filter((val) => val !== "" && val !== "0");
        localStorage.setItem("mystars", JSON.stringify(newStars));
        location.reload();
      });
  }

  // --- Image Ratio Calculator ---

  function ratioCalc() {
    const baseSize = parseInt(dom.ratioInput.value, 10);
    if (baseSize > 0) {
      document.getElementById(
        "ir1b1"
      ).innerHTML = `${baseSize} &times; ${baseSize}`;
      document.getElementById(
        "ir2b3"
      ).innerHTML = `${baseSize} &times; ${Math.round(baseSize * 1.5)}`;
      document.getElementById(
        "ir3b4"
      ).innerHTML = `${baseSize} &times; ${Math.round((baseSize / 3) * 4)}`;
      document.getElementById(
        "ir4b5"
      ).innerHTML = `${baseSize} &times; ${Math.round((baseSize / 4) * 5)}`;
      document.getElementById("ir16b9").innerHTML = `${Math.round(
        (baseSize / 9) * 16
      )} &times; ${baseSize}`;
      document.getElementById("ir16b10").innerHTML = `${Math.round(
        (baseSize / 10) * 16
      )} &times; ${baseSize}`;
      document.getElementById("ir21b9").innerHTML = `${Math.round(
        (baseSize / 9) * 21
      )} &times; ${baseSize}`;
    }
  }

  // --- Event Listeners ---

  function attachEventListeners() {
    // Search and filter controls
    dom.searchInput.addEventListener("keyup", () => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(liveSearch, typeInterval);
    });

    dom.clearButton.addEventListener("click", (e) => {
      e.preventDefault();
      dom.searchInput.value = "";
      liveSearch();
    });

    dom.filterButton.addEventListener("click", (e) => {
      e.preventDefault();
      dom.filterButton.classList.toggle("active");
      dom.catsBox.classList.toggle("show");
    });

    // Use event delegation for filters
    dom.catsBox.addEventListener("click", (e) => {
      const target = e.target.closest("span[data-srch]");
      if (target) {
        dom.searchInput.value = target.dataset.srch;
        liveSearch();
        dom.catsBox.classList.remove("show");
        dom.filterButton.classList.remove("active");
      }
    });

    // Use event delegation for search results clicks
    dom.notAvail.addEventListener("click", (e) => {
      if (e.target.classList.contains("ASearchStatus200")) {
        dom.searchInput.value = e.target.dataset.name;
        liveSearch();
      }
    });

    // Use event delegation for style pod actions
    dom.stylesContainer.addEventListener("click", (e) => {
      const pod = e.target.closest(".stylepod");
      if (!pod) return;

      const targetClass = e.target.classList;
      const parentClass = e.target.parentElement.classList;

      if (targetClass.contains("copyme")) {
        copyToClipboard(e.target.innerText);
      } else if (parentClass.contains("copythecats")) {
        copyToClipboard(e.target.parentElement.title);
      } else if (e.target.closest(".starthis")) {
        toggleStar(pod.dataset.creatime, e.target.closest(".starthis"));
      } else if (e.target.closest(".extralinks")) {
        // Let links function normally, do nothing.
      } else {
        // Open lightbox for clicks on the main pod area
        dom.lightboxImg.src = pod.dataset.bg;
        dom.lightboxInfo.innerHTML = createStylePodHTML(
          data[pod.dataset.index],
          pod.dataset.index,
          mystars
        );
        dom.lightbox.classList.add("show");
      }
    });

    // Lightbox close
    dom.lightbox.addEventListener("click", (e) => {
      if (
        e.target === dom.lightbox ||
        e.target.id === "lightbox-close" ||
        e.target.id === "lightbox-img"
      ) {
        dom.lightbox.classList.remove("show");
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && dom.lightbox.classList.contains("show")) {
        dom.lightbox.classList.remove("show");
      }
    });

    // "Copy Categories" checkbox
    dom.copyCatCheckbox.checked = !!localStorage.getItem("copycat");
    dom.copyCatCheckbox.addEventListener("click", () => {
      localStorage.getItem("copycat")
        ? localStorage.removeItem("copycat")
        : localStorage.setItem("copycat", "1");
      location.reload();
    });

    // Star import/export
    setupStarImport();

    // Ratio Calculator - no longer used
    // dom.ratioInput.addEventListener("keyup", () => {
    //   clearTimeout(typingTimer);
    //   typingTimer = setTimeout(ratioCalc, typeInterval);
    // });
    // dom.numLines.forEach((span) => {
    //   span.addEventListener("click", function () {
    //     dom.ratioInput.value = this.innerText;
    //     ratioCalc();
    //   });
    // });
  }

  // --- Start the App ---
  init();
});

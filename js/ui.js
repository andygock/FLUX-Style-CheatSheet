// js/ui.js

/**
 * Creates the HTML for a single style pod.
 * @param {object} item The style data item.
 * @param {number} index The index of the item in the main data array.
 * @param {Array<string>} likedStyles An array of "Creation" timestamps for liked styles.
 * @returns {string} The HTML string for the style pod.
 */
function createStylePodHTML(item, index, likedStyles) {
  const artistName = item.Name;
  const anchor = removeDiacritics(artistName)
    .replace(/[^a-zA-Z]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const categories = item.Category.replace(/\\/g, "")
    .split(",")
    .map((cat) => `<span>${cat.trim()}</span>`)
    .join("");

  const dagger = item.Death ? "<sup> &dagger;</sup>" : "";

  const lookupName = artistName
    .replace(/ *\([^)]*\) */g, "")
    .split(",")
    .map((s) => s.trim());
  const lookupURL =
    SearchEngine +
    (lookupName[1] ? `${lookupName[1]} ${lookupName[0]}` : lookupName[0]);

  const isStared = likedStyles.includes(item.Creation) ? " stared" : "";
  const copyCatClass = localStorage.getItem("copycat") ? " copythecats" : "";

  return `
      <div id="${anchor}" class="stylepod lazy" data-index="${index}" data-creatime="${item.Creation}" data-bg="./img/${imgSubDir}/${item.Image}">
        <div class="styleinfo">
          <h3 title="${artistName}">${artistName}${dagger}</h3>
          <div class="more">
            <p class="category${copyCatClass}" title="${item.Category}"><span class="checkpointname">${item.Checkpoint}</span>${categories}</p>
            <span class="clicklinks">
              <fieldset><legend>Copy Prompt</legend><span class="copyme">${item.Prompt}</span></fieldset>
            </span>
            <p class="extralinks">
              <a class="zoomimg" title="Zoom" href="./img/${imgSubDir}/${item.Image}" target="_blank"><img src="./img/zoom-white.svg" width="25" alt="Zoom"><span class="elsp">Zoom</span></a>
              <a href="${lookupURL}" title="Look Up Artist" target="_blank" class="lookupartist"><img src="./img/magnifying-glass-white.svg" width="25" alt="Look Up Artist"><span class="elsp">Look Up</span></a>
              <a class="starthis${isStared}" title="Mark as Favorite"><img class="svg" src="./img/heart-outline-white.svg" width="25" title="Mark as Favorite"></a>
            </p>
          </div>
        </div>
        <div class="gallery">
          <figure><figcaption></figcaption></figure><figure></figure><figure></figure><figure></figure>
        </div>
      </div>
    `;
}

/**
 * Builds the complete list of styles and injects it into the DOM.
 * @param {Array<object>} data The main styles data.
 * @param {Array<string>} likedStyles An array of "Creation" timestamps for liked styles.
 * @returns {object} An object containing the total style count and a map of tag counts.
 */
function buildStyleList(data, likedStyles) {
  const tags = {};
  let styleCount = 0;

  const stylePodsHTML = data
    .filter((item) => item.Type === "1")
    .map((item, index) => {
      styleCount++;
      // Count tags
      item.Category.split(", ").forEach((tag) => {
        tags[tag] = (tags[tag] || 0) + 1;
      });
      return createStylePodHTML(item, index, likedStyles);
    })
    .join("");

  document.getElementById("allthestyles").innerHTML = stylePodsHTML;

  return { styleCount, tags };
}

/**
 * Creates the filter buttons and injects them into the DOM.
 * @param {object} tags A map of tag names to their counts.
 */
function buildFilterTags(tags) {
  const sortedTags = Object.keys(tags).sort();
  let filterHTML = sortedTags
    .filter((key) => tags[key] > 4 && !DontShowAsFilters.includes(key))
    .map((key) => {
      const filterName = key.replace(/\\/g, "");
      return `<span data-srch="${filterName}">${filterName} <span>${tags[key]}</span></span>`;
    })
    .join("");

  // Add special filters
  filterHTML += `
        <span class="specialfilters" data-srch="Newest Styles">Newest Styles</span>
        <span class="specialfilters" data-srch="New Styles 1.2.0">New with 1.2.0</span>
        <span class="specialfilters" data-srch="New Styles 1.1.0">New with 1.1.0</span>
        <span class="specialfilters" data-srch="Liked">Liked <span><img class="svg" src="./img/heart-outline.svg" width="12"></span></span>
        <span class="specialfilters" data-srch="&dagger;">Only Deceased Artists <span>&dagger;</span></span>
    `;
  document.getElementById("allcats").innerHTML = filterHTML;
}

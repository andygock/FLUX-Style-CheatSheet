//
// Script to generate list of artists from data.js
// - not really used in the app
//
// Run with:
//   cd scripts
//   node generate-artists.js | Out-File -FilePath styles.txt -Encoding ascii
//

import fs from "fs";
import path from "path";
import vm from "vm";

// We need to use eval, as we can't use import
// Using import would cause CORS issues when running in browser locally

// Hacky: Load and eval utils.js to access global normalizeUnicode and formatName
const utilsFilePath = path.resolve("../js/utils.js");
const utilsCode = fs.readFileSync(utilsFilePath, "utf8");
vm.runInThisContext(utilsCode); // Executes utils.js in current context

// Hacky: Load and eval data.js to access global dataOriginal
const dataFilePath = path.resolve("../js/data.js");
const dataCode = fs.readFileSync(dataFilePath, "utf8");
vm.runInThisContext(dataCode); // Executes data.js in current context

// Check if globals are available
if (
  typeof normalizeUnicode === "undefined" ||
  typeof formatName === "undefined"
) {
  throw new Error("normalizeUnicode or formatName not found in utils.js");
}
if (typeof dataOriginal === "undefined") {
  throw new Error("dataOriginal not found in data.js");
}

// Process the data
const data = dataOriginal.map((item) => {
  const formattedName = formatName(item.Name);
  const normalizedName = normalizeUnicode(formattedName);
  return {
    ...item,
    Name: normalizedName,
  };
});

// Output the list of artists, one per line
data.forEach((artist) => {
  // check and warn if there is any non utf-8 character left
  if (/[^ -~]/.test(artist.Name)) {
    // Output warning to stderr
    console.error(
      `Warning: Non-UTF-8 character found in prompt for artist: ${artist.Name}`
    );
  }
  console.log(artist.Name);
});

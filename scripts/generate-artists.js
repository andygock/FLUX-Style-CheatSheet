//
// Script to generate list of artists from data.js, not really used in the app
//
// Run with:
//   cd scripts
//   node generate-artists.js > artists.txt
//

import { dataOriginal } from "../src/data.js";
import { normalizeUnicode, formatName } from "../src/utils.js";

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
  console.log(artist.Name);
});

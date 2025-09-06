//
// generate a prompts using the original prompt, but without the unicode
//
// Run with:
//   cd scripts
//   node generate-prompts.js > prompts.txt
//

import { dataOriginal } from "../src/data.js";
import { normalizeUnicode, formatName } from "../src/utils.js";

// Process the data
const data = dataOriginal.map((item) => {
  const formattedName = formatName(item.Name);
  const normalizedName = normalizeUnicode(formattedName);
  const originalPrompt = item.Prompt;

  return {
    ...item,
    Name: normalizedName,
    PromptNew: normalizeUnicode(originalPrompt),
  };
});

// Output the list of prompts
data.forEach((artist) => {
  console.log(artist.PromptNew);
});

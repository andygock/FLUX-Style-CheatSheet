// example usage:
//   node generate-styles.js > styles.txt

import fs from "fs";

// Read the HTML file
const html = fs.readFileSync("../index.html", "utf8");

// Use regex to extract figcaption texts with class 'copyme'
const figcaptionRegex = /<figcaption class="copyme">([^<]+)<\/figcaption>/g;
let match;
const styles = [];

// Extract all matches
while ((match = figcaptionRegex.exec(html)) !== null) {
  styles.push(match[1]);
}

// Output the styles
styles.forEach((style) => console.log(`${style}`));

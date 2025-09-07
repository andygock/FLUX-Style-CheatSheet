// example usage:
//   node generate-styles.js > styles.txt
//
//  In PS:
//    node generate-styles.js | Out-File -FilePath styles.txt -Encoding ascii
//

import fs from "fs";

// Read the HTML file
const html = fs.readFileSync("../index.html", "utf8");

// Use regex to extract figcaption texts with class 'copyme'
const figcaptionRegex = /<figcaption class="copyme">([^<]+)<\/figcaption>/g;
let match;
const styles = [];

// Extract all matches
while ((match = figcaptionRegex.exec(html)) !== null) {
  // if there is unicode, halt
  if (/[^ -~]/.test(match[1])) {
    throw new Error(`Non-UTF-8 character found in style: ${match[1]}`);
  }
  styles.push(match[1]);
}

// Output the styles
styles.forEach((style) => console.log(`${style}`));

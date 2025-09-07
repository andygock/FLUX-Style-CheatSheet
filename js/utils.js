// Function to normalize Unicode characters to closest ASCII
function normalizeUnicode(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Function to format name from "Last, First" to "First Last"
function formatName(name) {
  const parts = name.split(", ");
  if (parts.length === 2) {
    return parts[1] + " " + parts[0];
  }
  return name; // fallback if not in expected format
}

/**
 * Removes diacritics (special characters like accents) from a string.
 * @param {string} str The string to normalize.
 * @returns {string} The normalized string.
 */
function removeDiacritics(str) {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

/**
 * Shows a temporary "Copied!" notification.
 */
function showSnackBar() {
  const sb = document.getElementById("snackbar");
  sb.classList.add("show");
  setTimeout(() => {
    sb.classList.remove("show");
  }, 1500);
}

/**
 * Copies a given text to the clipboard. Uses modern API with a fallback.
 * @param {string} text The text to copy.
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const inp = document.createElement("input");
      document.body.appendChild(inp);
      inp.value = text;
      inp.select();
      document.execCommand("copy", false);
      inp.remove();
    }
    showSnackBar();
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
}

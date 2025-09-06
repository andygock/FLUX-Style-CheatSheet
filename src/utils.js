// Function to normalize Unicode characters to closest ASCII
export function normalizeUnicode(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Function to format name from "Last, First" to "First Last"
export function formatName(name) {
  const parts = name.split(", ");
  if (parts.length === 2) {
    return parts[1] + " " + parts[0];
  }
  return name; // fallback if not in expected format
}

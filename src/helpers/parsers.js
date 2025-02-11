function parseBoolean(value) {
  const structuredValue = String(value).toLowerCase();
  return JSON.parse(value);
}

module.exports = { parseBoolean };

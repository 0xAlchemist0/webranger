function parseBoolean(value) {
  const structuredValue = String(value);
  return JSON.parse(value);
}

module.exports = { parseBoolean };

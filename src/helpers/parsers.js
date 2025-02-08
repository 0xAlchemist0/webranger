function parseBoolean(value) {
  const structuredValue = String(value).toLowerCase();
  console.log(value);
  if (structuredValue === "True") {
    return true;
  } else if (structuredValue === "False") {
    return false;
  }
}

module.exports = { parseBoolean };

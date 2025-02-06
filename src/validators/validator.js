function validateURL(URL) {
  try {
    new URL(URL);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { validateURL };

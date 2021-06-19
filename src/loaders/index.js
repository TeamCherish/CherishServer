const expressLoader = require('./express');

module.exports = async (expressApp) => {
  await expressLoader(expressApp);
};

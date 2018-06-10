const moment = require('moment');

function generateMessage(from , text) {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
}

function generateLocationMessage(from, latitude, longitude) {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  };
}

module.exports = { generateMessage, generateLocationMessage };

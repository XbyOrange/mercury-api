const { Feature } = require("@xbyorange/mocks-server");

const {
  getBooksSuccess,
  getBooksServerError,
  getBooksNotFoundError
} = require("./fixtures/books/get");
const { getStats } = require("./fixtures/stats/get");
const { resetStats } = require("./fixtures/stats/post");

const base = new Feature([
  getBooksSuccess,
  getBooksServerError,
  getBooksNotFoundError,
  getStats,
  resetStats
]);

module.exports = {
  base
};

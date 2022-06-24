const { CONFLICT } = require('../errorStatuses');

class ConflictErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT;
  }
}

module.exports = ConflictErr;

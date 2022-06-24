const { UNAUTHORIZED } = require('../errorStatuses');

class UnauthorizedErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = UnauthorizedErr;

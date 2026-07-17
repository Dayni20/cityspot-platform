const { normalizeActivityStatus } = require("../../../../shared/validators/activityValidator");

class UpdateActivityStatusDto {
  constructor({ status }) {
    this.status = normalizeActivityStatus(status);
  }
}

module.exports = UpdateActivityStatusDto;

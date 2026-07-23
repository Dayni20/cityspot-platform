class UpdatePasswordDto {
  constructor({ currentPassword, newPassword, confirmPassword }) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
    this.confirmPassword = confirmPassword;
  }
}

module.exports = UpdatePasswordDto;

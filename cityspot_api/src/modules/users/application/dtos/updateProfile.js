class UpdateProfileDto {
  constructor({ name, email, phone }) {
    this.name = name;
    this.email = email;
    this.phone = phone;
  }
}

module.exports = UpdateProfileDto;

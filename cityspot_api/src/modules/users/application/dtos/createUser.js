class CreateUserDto {
  constructor({ name, email, password, role, phone }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.phone = phone;
  }
}

module.exports = CreateUserDto;

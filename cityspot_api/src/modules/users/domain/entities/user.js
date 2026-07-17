class User {
  constructor({ id, name, email, password, role, phone, status, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.phone = phone;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isActive() {
    return this.status === "ACTIVO";
  }
}

module.exports = User;

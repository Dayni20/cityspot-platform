class Inquiry {
  constructor({
    id,
    activityId,
    userId,
    ownerId,
    question,
    answer,
    status,
    createdAt,
    answeredAt,
    responseRead,
    activityName,
    activityCity,
    userName,
    userEmail
  }) {
    this.id = id;
    this.activityId = activityId;
    this.userId = userId;
    this.ownerId = ownerId;
    this.question = question;
    this.answer = answer;
    this.status = status;
    this.createdAt = createdAt;
    this.answeredAt = answeredAt;
    this.responseRead = responseRead;
    this.activityName = activityName;
    this.activityCity = activityCity;
    this.userName = userName;
    this.userEmail = userEmail;
  }
}

module.exports = Inquiry;

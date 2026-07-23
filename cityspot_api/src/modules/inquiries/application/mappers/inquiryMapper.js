class InquiryMapper {
  static toResponse(inquiry) {
    return {
      id: inquiry.id,
      activityId: inquiry.activityId,
      userId: inquiry.userId,
      ownerId: inquiry.ownerId,
      question: inquiry.question,
      answer: inquiry.answer,
      status: inquiry.status,
      createdAt: inquiry.createdAt,
      answeredAt: inquiry.answeredAt,
      responseRead: inquiry.responseRead,
      activityName: inquiry.activityName,
      activityCity: inquiry.activityCity,
      userName: inquiry.userName,
      userEmail: inquiry.userEmail
    };
  }
}

module.exports = InquiryMapper;

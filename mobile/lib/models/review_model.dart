class ReviewModel {
  final String id;
  final String bookingId;
  final String employeeId;
  final int rating;
  final String comment;
  final DateTime createdAt;

  const ReviewModel({
    required this.id,
    required this.bookingId,
    required this.employeeId,
    required this.rating,
    required this.comment,
    required this.createdAt,
  });

  factory ReviewModel.fromJson(Map<String, dynamic> json) => ReviewModel(
        id: json['id'] as String,
        bookingId: json['bookingId'] as String,
        employeeId: json['employeeId'] as String,
        rating: json['rating'] as int,
        comment: json['comment'] as String,
        createdAt: DateTime.parse(json['createdAt'] as String),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'bookingId': bookingId,
        'employeeId': employeeId,
        'rating': rating,
        'comment': comment,
        'createdAt': createdAt.toIso8601String(),
      };
}

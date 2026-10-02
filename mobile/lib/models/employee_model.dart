class AvailabilitySlot {
  final String day;
  final String start;
  final String end;

  const AvailabilitySlot({
    required this.day,
    required this.start,
    required this.end,
  });

  factory AvailabilitySlot.fromJson(Map<String, dynamic> json) =>
      AvailabilitySlot(
        day: json['day'] as String,
        start: json['start'] as String,
        end: json['end'] as String,
      );

  Map<String, dynamic> toJson() => {'day': day, 'start': start, 'end': end};
}

class EmployeeModel {
  final String id;
  final String? userId;
  final String name;
  final String photo;
  final List<String> specialties;
  final double rating;
  final int reviewCount;
  final List<AvailabilitySlot> availability;

  const EmployeeModel({
    required this.id,
    this.userId,
    required this.name,
    required this.photo,
    required this.specialties,
    required this.rating,
    required this.reviewCount,
    required this.availability,
  });

  factory EmployeeModel.fromJson(Map<String, dynamic> json) => EmployeeModel(
        id: (json['id'] ?? json['_id']) as String,
        userId: (json['userId'] ?? json['user']?['_id'] ?? json['user']) as String?,
        name: json['name'] as String? ?? '',
        photo: json['photo'] as String? ?? '',
        specialties: List<String>.from((json['specialties'] as List?) ?? const []),
        rating: ((json['rating'] as num?) ?? 0).toDouble(),
        reviewCount: ((json['reviewCount'] as num?) ?? 0).toInt(),
        availability: ((json['availability'] as List?) ?? const [])
            .map((a) => AvailabilitySlot.fromJson(a as Map<String, dynamic>))
            .toList(),
      );

      Map<String, dynamic> toJson() => {
        'id': id,
        'userId': userId,
        'name': name,
        'photo': photo,
        'specialties': specialties,
        'rating': rating,
        'reviewCount': reviewCount,
        'availability': availability.map((a) => a.toJson()).toList(),
      };

  bool isAvailableOn(String day) =>
      availability.any((slot) => slot.day.toLowerCase() == day.toLowerCase());

  AvailabilitySlot? getSlotForDay(String day) =>
      availability.firstWhere(
        (slot) => slot.day.toLowerCase() == day.toLowerCase(),
        orElse: () => const AvailabilitySlot(day: '', start: '', end: ''),
      );
}

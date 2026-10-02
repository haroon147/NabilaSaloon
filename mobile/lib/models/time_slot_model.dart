class TimeSlot {
  final String startTime;
  final String endTime;
  final bool isAvailable;

  const TimeSlot({
    required this.startTime,
    required this.endTime,
    required this.isAvailable,
  });

  factory TimeSlot.fromJson(Map<String, dynamic> json) => TimeSlot(
        startTime: json['startTime'] as String,
        endTime: json['endTime'] as String,
        isAvailable: json['isAvailable'] as bool,
      );

  @override
  String toString() => '$startTime – $endTime';
}

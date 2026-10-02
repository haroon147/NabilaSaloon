enum BookingStatus { pending, confirmed, completed, cancelled }

class BookingModel {
  final String id;
  final String clientId;
  final String employeeId;
  final String serviceId;
  final DateTime date;
  final String startTime;
  final String endTime;
  final BookingStatus status;
  final double price;
  // Denormalized for display — populated client-side from mock data
  final String? clientName;
  final String? employeeName;
  final String? serviceName;

  const BookingModel({
    required this.id,
    required this.clientId,
    required this.employeeId,
    required this.serviceId,
    required this.date,
    required this.startTime,
    required this.endTime,
    required this.status,
    required this.price,
    this.clientName,
    this.employeeName,
    this.serviceName,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) => BookingModel(
        id: (json['id'] ?? json['_id']) as String,
        clientId: (json['clientId'] ?? json['client']?['_id']) as String? ?? '',
        employeeId: (json['employeeId'] ?? json['employee']?['_id']) as String? ?? '',
        serviceId: (json['serviceId'] ?? json['service']?['_id']) as String? ?? '',
        date: DateTime.parse(json['date'] as String),
        startTime: json['startTime'] as String? ?? '',
        endTime: json['endTime'] as String? ?? '',
        status: BookingStatus.values.firstWhere(
          (s) => s.name == json['status'],
          orElse: () => BookingStatus.pending,
        ),
        price: ((json['price'] as num?) ?? 0).toDouble(),
        clientName: (json['clientName'] ?? json['client']?['name']) as String?,
        employeeName: (json['employeeName'] ?? json['employee']?['name']) as String?,
        serviceName: (json['serviceName'] ?? json['service']?['name']) as String?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'clientId': clientId,
        'employeeId': employeeId,
        'serviceId': serviceId,
        'date': date.toIso8601String().split('T').first,
        'startTime': startTime,
        'endTime': endTime,
        'status': status.name,
        'price': price,
        'clientName': clientName,
        'employeeName': employeeName,
        'serviceName': serviceName,
      };

  BookingModel copyWith({BookingStatus? status}) => BookingModel(
        id: id,
        clientId: clientId,
        employeeId: employeeId,
        serviceId: serviceId,
        date: date,
        startTime: startTime,
        endTime: endTime,
        status: status ?? this.status,
        price: price,
        clientName: clientName,
        employeeName: employeeName,
        serviceName: serviceName,
      );

  bool get isUpcoming =>
      date.isAfter(DateTime.now().subtract(const Duration(days: 1))) &&
      (status == BookingStatus.pending || status == BookingStatus.confirmed);

  bool get isPast =>
      date.isBefore(DateTime.now()) || status == BookingStatus.completed;

  String get formattedDate {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }
}

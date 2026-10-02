class ServiceModel {
  final String id;
  final String name;
  final String description;
  final String category;
  final int durationMinutes;
  final double price;
  final String image;

  const ServiceModel({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    required this.durationMinutes,
    required this.price,
    required this.image,
  });

  factory ServiceModel.fromJson(Map<String, dynamic> json) => ServiceModel(
        id: (json['id'] ?? json['_id']) as String,
        name: json['name'] as String? ?? '',
        description: json['description'] as String? ?? '',
        category: json['category'] as String? ?? '',
        durationMinutes: (json['durationMinutes'] as num).toInt(),
        price: (json['price'] as num).toDouble(),
        image: json['image'] as String? ?? '',
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'category': category,
        'durationMinutes': durationMinutes,
        'price': price,
        'image': image,
      };

  String get formattedPrice => 'PKR ${price.toStringAsFixed(0)}';
  String get formattedDuration =>
      durationMinutes >= 60
          ? '${durationMinutes ~/ 60}h ${durationMinutes % 60 == 0 ? '' : '${durationMinutes % 60}m'}'.trim()
          : '${durationMinutes}m';
}

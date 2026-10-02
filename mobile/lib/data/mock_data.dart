import '../models/service_model.dart';
import '../models/employee_model.dart';
import '../models/booking_model.dart';
import '../models/review_model.dart';
import '../models/user_model.dart';

class MockData {
  // ── Services ────────────────────────────────────────────────────────────────

  static const List<Map<String, dynamic>> servicesJson = [
    {
      'id': 's1',
      'name': 'Women\'s Haircut & Style',
      'description': 'Precision cut tailored to your face shape, finished with a blow-dry and style.',
      'category': 'Hair',
      'durationMinutes': 60,
      'price': 2500,
      'image': 'assets/images/service_haircut.png',
    },
    {
      'id': 's2',
      'name': 'Hair Coloring',
      'description': 'Full head color using premium ammonia-free dyes. Includes toner and conditioning treatment.',
      'category': 'Hair',
      'durationMinutes': 120,
      'price': 6500,
      'image': 'assets/images/service_color.png',
    },
    {
      'id': 's3',
      'name': 'Balayage & Highlights',
      'description': 'Hand-painted highlights for a natural sun-kissed look. Includes toning.',
      'category': 'Hair',
      'durationMinutes': 150,
      'price': 9000,
      'image': 'assets/images/service_highlights.png',
    },
    {
      'id': 's4',
      'name': 'Keratin Smoothing Treatment',
      'description': 'Eliminate frizz and add shine for up to 4 months with our keratin formula.',
      'category': 'Hair',
      'durationMinutes': 180,
      'price': 12000,
      'image': 'assets/images/service_keratin.png',
    },
    {
      'id': 's5',
      'name': 'Blow Dry & Styling',
      'description': 'Professional blow-dry with your choice of finish — straight, wavy, or voluminous.',
      'category': 'Hair',
      'durationMinutes': 45,
      'price': 1800,
      'image': 'assets/images/service_blowdry.png',
    },
    {
      'id': 's6',
      'name': 'Classic Manicure',
      'description': 'Nail shaping, cuticle care, hand massage, and your choice of polish.',
      'category': 'Nails',
      'durationMinutes': 45,
      'price': 1200,
      'image': 'assets/images/service_manicure.png',
    },
    {
      'id': 's7',
      'name': 'Gel Pedicure',
      'description': 'Relaxing foot soak, exfoliation, massage, and long-lasting gel polish.',
      'category': 'Nails',
      'durationMinutes': 60,
      'price': 1800,
      'image': 'assets/images/service_pedicure.png',
    },
    {
      'id': 's8',
      'name': 'Hydrating Facial',
      'description': 'Deep-cleanse, exfoliation, mask, and moisturiser for glowing skin.',
      'category': 'Skin',
      'durationMinutes': 75,
      'price': 3500,
      'image': 'assets/images/service_facial.png',
    },
    {
      'id': 's9',
      'name': 'Threading & Brow Shaping',
      'description': 'Precise brow threading and shaping to frame your face perfectly.',
      'category': 'Skin',
      'durationMinutes': 20,
      'price': 500,
      'image': 'assets/images/service_threading.png',
    },
    {
      'id': 's10',
      'name': 'Bridal Package',
      'description': 'Full bridal glam: hair styling, makeup, manicure, pedicure, and brow shaping.',
      'category': 'Packages',
      'durationMinutes': 300,
      'price': 25000,
      'image': 'assets/images/service_bridal.png',
    },
  ];

  static List<ServiceModel> get services =>
      servicesJson.map((j) => ServiceModel.fromJson(j)).toList();

  static List<String> get serviceCategories =>
      ['All', ...{...services.map((s) => s.category)}];

  // ── Employees ───────────────────────────────────────────────────────────────

  static const List<Map<String, dynamic>> employeesJson = [
    {
      'id': 'e1',
      'name': 'Zara Ahmed',
      'photo': 'assets/images/emp_zara.png',
      'specialties': ['Hair Coloring', 'Balayage', 'Keratin Treatment'],
      'rating': 4.9,
      'reviewCount': 124,
      'availability': [
        {'day': 'Monday', 'start': '09:00', 'end': '18:00'},
        {'day': 'Tuesday', 'start': '09:00', 'end': '18:00'},
        {'day': 'Wednesday', 'start': '09:00', 'end': '18:00'},
        {'day': 'Thursday', 'start': '09:00', 'end': '18:00'},
        {'day': 'Friday', 'start': '10:00', 'end': '17:00'},
      ],
    },
    {
      'id': 'e2',
      'name': 'Layla Hassan',
      'photo': 'assets/images/emp_layla.png',
      'specialties': ['Manicure', 'Pedicure', 'Nail Art', 'Gel Extensions'],
      'rating': 4.8,
      'reviewCount': 98,
      'availability': [
        {'day': 'Monday', 'start': '10:00', 'end': '19:00'},
        {'day': 'Tuesday', 'start': '10:00', 'end': '19:00'},
        {'day': 'Thursday', 'start': '10:00', 'end': '19:00'},
        {'day': 'Friday', 'start': '10:00', 'end': '19:00'},
        {'day': 'Saturday', 'start': '09:00', 'end': '20:00'},
      ],
    },
    {
      'id': 'e3',
      'name': 'Nadia Khan',
      'photo': 'assets/images/emp_nadia.png',
      'specialties': ['Facial', 'Skin Care', 'Threading', 'Waxing'],
      'rating': 4.7,
      'reviewCount': 87,
      'availability': [
        {'day': 'Tuesday', 'start': '09:00', 'end': '17:00'},
        {'day': 'Wednesday', 'start': '09:00', 'end': '17:00'},
        {'day': 'Thursday', 'start': '09:00', 'end': '17:00'},
        {'day': 'Saturday', 'start': '10:00', 'end': '18:00'},
        {'day': 'Sunday', 'start': '10:00', 'end': '16:00'},
      ],
    },
    {
      'id': 'e4',
      'name': 'Aisha Malik',
      'photo': 'assets/images/emp_aisha.png',
      'specialties': ['Bridal Styling', 'Makeup', 'Hair Styling', 'Blow Dry'],
      'rating': 4.9,
      'reviewCount': 156,
      'availability': [
        {'day': 'Monday', 'start': '09:00', 'end': '18:00'},
        {'day': 'Wednesday', 'start': '09:00', 'end': '18:00'},
        {'day': 'Friday', 'start': '09:00', 'end': '18:00'},
        {'day': 'Saturday', 'start': '09:00', 'end': '20:00'},
        {'day': 'Sunday', 'start': '10:00', 'end': '17:00'},
      ],
    },
    {
      'id': 'e5',
      'name': 'Fatima Ali',
      'photo': 'assets/images/emp_fatima.png',
      'specialties': ['Haircut', 'Blow Dry', 'Manicure', 'Threading'],
      'rating': 4.6,
      'reviewCount': 72,
      'availability': [
        {'day': 'Monday', 'start': '11:00', 'end': '20:00'},
        {'day': 'Tuesday', 'start': '11:00', 'end': '20:00'},
        {'day': 'Wednesday', 'start': '11:00', 'end': '20:00'},
        {'day': 'Friday', 'start': '11:00', 'end': '20:00'},
        {'day': 'Saturday', 'start': '10:00', 'end': '19:00'},
      ],
    },
  ];

  static List<EmployeeModel> get employees =>
      employeesJson.map((j) => EmployeeModel.fromJson(j)).toList();

  // ── Sample Bookings ─────────────────────────────────────────────────────────

  static List<BookingModel> get sampleBookings {
    final now = DateTime.now();
    return [
      BookingModel(
        id: 'b1',
        clientId: 'u1',
        employeeId: 'e1',
        serviceId: 's2',
        date: now.add(const Duration(days: 2)),
        startTime: '10:00',
        endTime: '12:00',
        status: BookingStatus.confirmed,
        price: 6500,
        clientName: 'Sara Khan',
        employeeName: 'Zara Ahmed',
        serviceName: 'Hair Coloring',
      ),
      BookingModel(
        id: 'b2',
        clientId: 'u1',
        employeeId: 'e2',
        serviceId: 's6',
        date: now.add(const Duration(days: 5)),
        startTime: '14:00',
        endTime: '14:45',
        status: BookingStatus.pending,
        price: 1200,
        clientName: 'Sara Khan',
        employeeName: 'Layla Hassan',
        serviceName: 'Classic Manicure',
      ),
      BookingModel(
        id: 'b3',
        clientId: 'u1',
        employeeId: 'e4',
        serviceId: 's10',
        date: now.subtract(const Duration(days: 10)),
        startTime: '09:00',
        endTime: '14:00',
        status: BookingStatus.completed,
        price: 25000,
        clientName: 'Sara Khan',
        employeeName: 'Aisha Malik',
        serviceName: 'Bridal Package',
      ),
      BookingModel(
        id: 'b4',
        clientId: 'u1',
        employeeId: 'e3',
        serviceId: 's8',
        date: now.subtract(const Duration(days: 20)),
        startTime: '11:00',
        endTime: '12:15',
        status: BookingStatus.completed,
        price: 3500,
        clientName: 'Sara Khan',
        employeeName: 'Nadia Khan',
        serviceName: 'Hydrating Facial',
      ),
      BookingModel(
        id: 'b5',
        clientId: 'u1',
        employeeId: 'e5',
        serviceId: 's1',
        date: now.subtract(const Duration(days: 5)),
        startTime: '15:00',
        endTime: '16:00',
        status: BookingStatus.cancelled,
        price: 2500,
        clientName: 'Sara Khan',
        employeeName: 'Fatima Ali',
        serviceName: 'Women\'s Haircut & Style',
      ),
      // Additional bookings for employee schedule view
      BookingModel(
        id: 'b6',
        clientId: 'u2',
        employeeId: 'e1',
        serviceId: 's3',
        date: now.add(const Duration(days: 1)),
        startTime: '09:00',
        endTime: '11:30',
        status: BookingStatus.confirmed,
        price: 9000,
        clientName: 'Mariam Siddiqui',
        employeeName: 'Zara Ahmed',
        serviceName: 'Balayage & Highlights',
      ),
      BookingModel(
        id: 'b7',
        clientId: 'u3',
        employeeId: 'e1',
        serviceId: 's4',
        date: now.add(const Duration(days: 3)),
        startTime: '13:00',
        endTime: '16:00',
        status: BookingStatus.pending,
        price: 12000,
        clientName: 'Hina Baig',
        employeeName: 'Zara Ahmed',
        serviceName: 'Keratin Smoothing Treatment',
      ),
    ];
  }

  // ── Sample Reviews ──────────────────────────────────────────────────────────

  static List<ReviewModel> get sampleReviews => [
        ReviewModel(
          id: 'r1',
          bookingId: 'b3',
          employeeId: 'e4',
          rating: 5,
          comment: 'Aisha was absolutely incredible for my wedding. Everyone was complimenting my look all day!',
          createdAt: DateTime.now().subtract(const Duration(days: 9)),
        ),
        ReviewModel(
          id: 'r2',
          bookingId: 'b4',
          employeeId: 'e3',
          rating: 5,
          comment: 'Best facial I\'ve ever had. My skin was glowing for weeks after!',
          createdAt: DateTime.now().subtract(const Duration(days: 19)),
        ),
      ];

  // ── Mock Users ──────────────────────────────────────────────────────────────

  static const List<Map<String, dynamic>> usersJson = [
    {
      'id': 'u1',
      'name': 'Sara Khan',
      'email': 'sara@example.com',
      'phone': '0300-1234567',
      'role': 'client',
      'profileImage': null,
    },
    {
      'id': 'e1',
      'name': 'Zara Ahmed',
      'email': 'zara@nabilasalon.com',
      'phone': '0300-9876543',
      'role': 'employee',
      'profileImage': null,
    },
    {
      'id': 'admin1',
      'name': 'Nabila Akhtar',
      'email': 'admin@nabilasalon.com',
      'phone': '0300-0000001',
      'role': 'admin',
      'profileImage': null,
    },
  ];

  static List<UserModel> get users =>
      usersJson.map((j) => UserModel.fromJson(j)).toList();

  // ── Admin Stats ─────────────────────────────────────────────────────────────

  static Map<String, dynamic> get adminStats => {
        'totalBookings': 248,
        'todayBookings': 12,
        'monthRevenue': 487500,
        'activeClients': 186,
        'activeEmployees': 5,
        'completionRate': 94,
      };
}

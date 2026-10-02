/// Mock API service — same method signatures as the real REST client will have.
/// Swap this file for a real HTTP implementation in Phase 3.
library;

import '../data/mock_data.dart';
import '../models/booking_model.dart';
import '../models/employee_model.dart';
import '../models/service_model.dart';
import '../models/time_slot_model.dart';
import '../models/user_model.dart';
import 'salon_api_client.dart';

// Simulated network latency
const _delay = Duration(milliseconds: 600);

class MockApiService implements SalonApiClient {
  // ── Auth ─────────────────────────────────────────────────────────────────────

  @override
  Future<UserModel> login(String email, String password, UserRole role) async {
    await Future.delayed(_delay);
    // Mock: accept any credentials, return a user matching the chosen role
    return MockData.users.firstWhere(
      (u) => u.role == role,
      orElse: () => UserModel(
        id: 'guest_${role.name}',
        name: role == UserRole.admin
            ? 'Nabila Akhtar'
            : role == UserRole.employee
                ? 'Zara Ahmed'
                : email.split('@').first,
        email: email,
        phone: '0300-0000000',
        role: role,
      ),
    );
  }

  @override
  Future<UserModel> register({
    required String name,
    required String email,
    required String phone,
    required String password,
    required UserRole role,
  }) async {
    await Future.delayed(_delay);
    return UserModel(
      id: 'new_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      email: email,
      phone: phone,
      role: role,
    );
  }

  @override
  Future<UserModel?> getMe() async => null; // Phase 1: no persisted mock session

  @override
  Future<UserModel> updateProfile(UserModel current, {String? name, String? phone}) async {
    await Future.delayed(_delay);
    return current.copyWith(name: name, phone: phone);
  }

  @override
  Future<void> logout() async {}

  // ── Services ─────────────────────────────────────────────────────────────────

  @override
  Future<List<ServiceModel>> getServices() async {
    await Future.delayed(_delay);
    return MockData.services;
  }

  @override
  Future<ServiceModel> getServiceById(String id) async {
    await Future.delayed(_delay);
    return MockData.services.firstWhere((s) => s.id == id);
  }

  // ── Employees ─────────────────────────────────────────────────────────────────

  @override
  Future<List<EmployeeModel>> getEmployees() async {
    await Future.delayed(_delay);
    return MockData.employees;
  }

  @override
  Future<EmployeeModel> getEmployeeById(String id) async {
    await Future.delayed(_delay);
    return MockData.employees.firstWhere((e) => e.id == id);
  }

  @override
  Future<bool> updateAvailability(
    String employeeId,
    List<AvailabilitySlot> availability,
  ) async {
    await Future.delayed(_delay);
    // Mock: always succeeds
    return true;
  }

  // ── Time Slots ─────────────────────────────────────────────────────────────

  @override
  Future<List<TimeSlot>> getAvailableSlots(
    String employeeId,
    DateTime date,
    int serviceDurationMinutes,
  ) async {
    await Future.delayed(_delay);

    final weekday = _weekdayName(date.weekday);
    final employee = MockData.employees.firstWhere(
      (e) => e.id == employeeId,
      orElse: () => MockData.employees.first,
    );

    final slot = employee.availability.where((a) => a.day == weekday).toList();
    if (slot.isEmpty) return [];

    final start = _parseTime(slot.first.start);
    final end = _parseTime(slot.first.end);

    final slots = <TimeSlot>[];
    var current = start;
    const breakMinutes = 15;

    // Build slots — randomly mark some as unavailable to simulate bookings
    final takenStartTimes = {'10:00', '13:00', '15:30'};

    while (current + serviceDurationMinutes <= end) {
      final startStr = _formatTime(current);
      final endStr = _formatTime(current + serviceDurationMinutes);
      slots.add(TimeSlot(
        startTime: startStr,
        endTime: endStr,
        isAvailable: !takenStartTimes.contains(startStr),
      ));
      current += serviceDurationMinutes + breakMinutes;
    }

    return slots;
  }

  // ── Bookings ───────────────────────────────────────────────────────────────

  @override
  Future<List<BookingModel>> getBookingsForClient(String clientId) async {
    await Future.delayed(_delay);
    return MockData.sampleBookings
        .where((b) => b.clientId == clientId)
        .toList();
  }

  @override
  Future<List<BookingModel>> getBookingsForEmployee(String employeeId) async {
    await Future.delayed(_delay);
    return MockData.sampleBookings
        .where((b) => b.employeeId == employeeId)
        .toList();
  }

  @override
  Future<List<BookingModel>> getAllBookings() async {
    await Future.delayed(_delay);
    return MockData.sampleBookings;
  }

  @override
  Future<BookingModel> createBooking({
    required String clientId,
    required String employeeId,
    required String serviceId,
    required DateTime date,
    required String startTime,
    required String endTime,
    required double price,
    String? clientName,
    String? employeeName,
    String? serviceName,
  }) async {
    await Future.delayed(_delay);
    return BookingModel(
      id: 'b_${DateTime.now().millisecondsSinceEpoch}',
      clientId: clientId,
      employeeId: employeeId,
      serviceId: serviceId,
      date: date,
      startTime: startTime,
      endTime: endTime,
      status: BookingStatus.confirmed,
      price: price,
      clientName: clientName,
      employeeName: employeeName,
      serviceName: serviceName,
    );
  }

  @override
  Future<BookingModel> cancelBooking(String bookingId) async {
    await Future.delayed(_delay);
    final booking = MockData.sampleBookings
        .firstWhere((b) => b.id == bookingId);
    return booking.copyWith(status: BookingStatus.cancelled);
  }

  // ── Admin ──────────────────────────────────────────────────────────────────

  @override
  Future<Map<String, dynamic>> getAdminStats() async {
    await Future.delayed(_delay);
    return MockData.adminStats;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  int _parseTime(String time) {
    final parts = time.split(':');
    return int.parse(parts[0]) * 60 + int.parse(parts[1]);
  }

  String _formatTime(int minutes) {
    final h = minutes ~/ 60;
    final m = minutes % 60;
    return '${h.toString().padLeft(2, '0')}:${m.toString().padLeft(2, '0')}';
  }

  String _weekdayName(int weekday) {
    const names = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return names[weekday];
  }
}

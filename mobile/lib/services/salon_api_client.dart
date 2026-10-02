import '../models/booking_model.dart';
import '../models/employee_model.dart';
import '../models/service_model.dart';
import '../models/time_slot_model.dart';
import '../models/user_model.dart';

/// Shared contract implemented by [MockApiService] (local data) and
/// [ApiService] (real REST client). Providers depend on this type only,
/// so swapping implementations requires no UI changes.
abstract class SalonApiClient {
  // ── Auth ─────────────────────────────────────────────────────────────────
  Future<UserModel> login(String email, String password, UserRole role);

  Future<UserModel> register({
    required String name,
    required String email,
    required String phone,
    required String password,
    required UserRole role,
  });

  /// Restores a session from a persisted token. Returns null if there is
  /// no valid session (no token, expired, or backend unreachable).
  Future<UserModel?> getMe();

  Future<UserModel> updateProfile(UserModel current, {String? name, String? phone});

  Future<void> logout();

  // ── Services ─────────────────────────────────────────────────────────────
  Future<List<ServiceModel>> getServices();
  Future<ServiceModel> getServiceById(String id);

  // ── Employees ────────────────────────────────────────────────────────────
  Future<List<EmployeeModel>> getEmployees();
  Future<EmployeeModel> getEmployeeById(String id);
  Future<bool> updateAvailability(String employeeId, List<AvailabilitySlot> availability);

  // ── Time slots ───────────────────────────────────────────────────────────
  Future<List<TimeSlot>> getAvailableSlots(
    String employeeId,
    DateTime date,
    int serviceDurationMinutes,
  );

  // ── Bookings ─────────────────────────────────────────────────────────────
  Future<List<BookingModel>> getBookingsForClient(String clientId);
  Future<List<BookingModel>> getBookingsForEmployee(String employeeId);
  Future<List<BookingModel>> getAllBookings();

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
  });

  Future<BookingModel> cancelBooking(String bookingId);

  // ── Admin ────────────────────────────────────────────────────────────────
  Future<Map<String, dynamic>> getAdminStats();
}

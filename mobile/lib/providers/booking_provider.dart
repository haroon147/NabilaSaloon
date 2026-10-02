import 'package:flutter/foundation.dart';
import '../models/booking_model.dart';
import '../models/employee_model.dart';
import '../models/service_model.dart';
import '../models/time_slot_model.dart';
import '../services/salon_api.dart';
import '../services/salon_api_client.dart';

class BookingProvider extends ChangeNotifier {
  final SalonApiClient _api;

  BookingProvider({SalonApiClient? api}) : _api = api ?? salonApi;

  // ── Persisted bookings ────────────────────────────────────────────────────
  List<BookingModel> _bookings = [];
  bool _isLoading = false;
  String? _error;

  List<BookingModel> get bookings => _bookings;
  bool get isLoading => _isLoading;
  String? get error => _error;

  List<BookingModel> get upcomingBookings =>
      _bookings.where((b) => b.isUpcoming).toList()
        ..sort((a, b) => a.date.compareTo(b.date));

  List<BookingModel> get pastBookings =>
      _bookings
          .where((b) => b.status == BookingStatus.completed)
          .toList()
        ..sort((a, b) => b.date.compareTo(a.date));

  List<BookingModel> get cancelledBookings =>
      _bookings
          .where((b) => b.status == BookingStatus.cancelled)
          .toList()
        ..sort((a, b) => b.date.compareTo(a.date));

  // ── Active booking flow state ─────────────────────────────────────────────
  ServiceModel? _selectedService;
  EmployeeModel? _selectedEmployee;
  DateTime? _selectedDate;
  TimeSlot? _selectedSlot;
  List<TimeSlot> _availableSlots = [];
  bool _loadingSlots = false;

  ServiceModel? get selectedService => _selectedService;
  EmployeeModel? get selectedEmployee => _selectedEmployee;
  DateTime? get selectedDate => _selectedDate;
  TimeSlot? get selectedSlot => _selectedSlot;
  List<TimeSlot> get availableSlots => _availableSlots;
  bool get loadingSlots => _loadingSlots;

  bool get canConfirm =>
      _selectedService != null &&
      _selectedEmployee != null &&
      _selectedDate != null &&
      _selectedSlot != null;

  // ── Load ──────────────────────────────────────────────────────────────────

  Future<void> loadBookingsForClient(String clientId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _bookings = await _api.getBookingsForClient(clientId);
    } catch (_) {
      _error = 'Could not load bookings.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadBookingsForEmployee(String employeeId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      _bookings = await _api.getBookingsForEmployee(employeeId);
    } catch (_) {
      _error = 'Could not load schedule.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadAllBookings() async {
    _isLoading = true;
    notifyListeners();
    try {
      _bookings = await _api.getAllBookings();
    } catch (_) {
      _error = 'Could not load bookings.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // ── Booking flow setters ──────────────────────────────────────────────────

  void selectService(ServiceModel service) {
    _selectedService = service;
    _selectedSlot = null;
    _availableSlots = [];
    notifyListeners();
  }

  void selectEmployee(EmployeeModel employee) {
    _selectedEmployee = employee;
    _selectedSlot = null;
    _availableSlots = [];
    notifyListeners();
  }

  Future<void> selectDate(DateTime date) async {
    _selectedDate = date;
    _selectedSlot = null;
    notifyListeners();
    await _loadSlots();
  }

  void selectSlot(TimeSlot slot) {
    _selectedSlot = slot;
    notifyListeners();
  }

  Future<void> _loadSlots() async {
    if (_selectedEmployee == null || _selectedDate == null || _selectedService == null) return;
    _loadingSlots = true;
    _availableSlots = [];
    notifyListeners();
    try {
      _availableSlots = await _api.getAvailableSlots(
        _selectedEmployee!.id,
        _selectedDate!,
        _selectedService!.durationMinutes,
      );
    } catch (_) {
      _availableSlots = [];
    } finally {
      _loadingSlots = false;
      notifyListeners();
    }
  }

  // ── Confirm booking ───────────────────────────────────────────────────────

  Future<BookingModel?> confirmBooking({
    required String clientId,
    required String clientName,
  }) async {
    if (!canConfirm) return null;
    _isLoading = true;
    notifyListeners();
    try {
      final booking = await _api.createBooking(
        clientId: clientId,
        employeeId: _selectedEmployee!.id,
        serviceId: _selectedService!.id,
        date: _selectedDate!,
        startTime: _selectedSlot!.startTime,
        endTime: _selectedSlot!.endTime,
        price: _selectedService!.price,
        clientName: clientName,
        employeeName: _selectedEmployee!.name,
        serviceName: _selectedService!.name,
      );
      _bookings = [booking, ..._bookings];
      clearSelection();
      return booking;
    } catch (_) {
      _error = 'Booking failed. Please try again.';
      notifyListeners();
      return null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // ── Cancel ────────────────────────────────────────────────────────────────

  Future<bool> cancelBooking(String bookingId) async {
    try {
      final updated = await _api.cancelBooking(bookingId);
      final idx = _bookings.indexWhere((b) => b.id == bookingId);
      if (idx != -1) {
        _bookings = List.from(_bookings)..[idx] = updated;
        notifyListeners();
      }
      return true;
    } catch (_) {
      return false;
    }
  }

  // ── Reset ─────────────────────────────────────────────────────────────────

  void clearSelection() {
    _selectedService = null;
    _selectedEmployee = null;
    _selectedDate = null;
    _selectedSlot = null;
    _availableSlots = [];
    notifyListeners();
  }

  List<BookingModel> bookingsForDate(DateTime date) =>
      _bookings.where((b) =>
        b.date.year == date.year &&
        b.date.month == date.month &&
        b.date.day == date.day).toList();
}

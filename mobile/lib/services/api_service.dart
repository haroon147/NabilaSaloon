import 'dart:convert';

import 'package:flutter/foundation.dart'
    show TargetPlatform, defaultTargetPlatform, kIsWeb;
import 'package:http/http.dart' as http;

import '../config/app_config.dart';
import '../models/booking_model.dart';
import '../models/employee_model.dart';
import '../models/service_model.dart';
import '../models/time_slot_model.dart';
import '../models/user_model.dart';
import 'salon_api_client.dart';
import 'token_store.dart';

/// Real REST client for the Phase 3 Node/Express/MongoDB backend.
class ApiService implements SalonApiClient {
  static String get _baseUrl {
    // Android emulator can't reach the host machine via "localhost" — it
    // needs the special 10.0.2.2 alias. iOS simulator and desktop can use
    // localhost directly. Physical devices would need the host's LAN IP.
    if (AppConfig.backendBaseUrl.isNotEmpty) return AppConfig.backendBaseUrl;
    if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
      return 'http://10.0.2.2:5000/api';
    }
    return 'http://localhost:5000/api';
  }

  Future<Map<String, String>> _headers() async {
    final token = await TokenStore.read();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<Map<String, dynamic>> _get(String path) async {
    final res = await http.get(Uri.parse('$_baseUrl$path'), headers: await _headers());
    return _handle(res);
  }

  Future<Map<String, dynamic>> _post(String path, Map<String, dynamic> body) async {
    final res = await http.post(Uri.parse('$_baseUrl$path'),
        headers: await _headers(), body: jsonEncode(body));
    return _handle(res);
  }

  Future<Map<String, dynamic>> _patch(String path, [Map<String, dynamic>? body]) async {
    final res = await http.patch(Uri.parse('$_baseUrl$path'),
        headers: await _headers(), body: jsonEncode(body ?? {}));
    return _handle(res);
  }

  Map<String, dynamic> _handle(http.Response res) {
    final decoded = res.body.isEmpty ? <String, dynamic>{} : jsonDecode(res.body);
    final body = decoded is Map<String, dynamic>
        ? decoded
        : <String, dynamic>{'data': decoded};
    if (res.statusCode < 200 || res.statusCode >= 300) {
      throw Exception(body['message'] as String? ?? 'Request failed (${res.statusCode})');
    }
    return body;
  }

  String _fmtDate(DateTime d) =>
      '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  // ── Auth ─────────────────────────────────────────────────────────────────

  @override
  Future<UserModel> login(String email, String password, UserRole role) async {
    final body = await _post('/auth/login', {
      'email': email,
      'password': password,
      'role': role.name,
    });
    await TokenStore.save(body['token'] as String);
    return UserModel.fromJson(body['user'] as Map<String, dynamic>);
  }

  @override
  Future<UserModel> register({
    required String name,
    required String email,
    required String phone,
    required String password,
    required UserRole role,
  }) async {
    final body = await _post('/auth/register', {
      'name': name,
      'email': email,
      'password': password,
      'phone': phone,
      'role': role.name,
    });
    await TokenStore.save(body['token'] as String);
    return UserModel.fromJson(body['user'] as Map<String, dynamic>);
  }

  @override
  Future<UserModel?> getMe() async {
    final token = await TokenStore.read();
    if (token == null) return null;
    try {
      final body = await _get('/auth/me');
      return UserModel.fromJson(body['data'] as Map<String, dynamic>);
    } catch (_) {
      await TokenStore.clear();
      return null;
    }
  }

  @override
  Future<UserModel> updateProfile(UserModel current, {String? name, String? phone}) async {
    final body = await _patch('/auth/profile', {
      if (name != null) 'name': name,
      if (phone != null) 'phone': phone,
    });
    return UserModel.fromJson(body['data'] as Map<String, dynamic>);
  }

  @override
  Future<void> logout() => TokenStore.clear();

  // ── Services ─────────────────────────────────────────────────────────────

  @override
  Future<List<ServiceModel>> getServices() async {
    final body = await _get('/services');
    return (body['data'] as List)
        .map((j) => ServiceModel.fromJson(j as Map<String, dynamic>))
        .toList();
  }

  @override
  Future<ServiceModel> getServiceById(String id) async {
    final body = await _get('/services/$id');
    return ServiceModel.fromJson(body['data'] as Map<String, dynamic>);
  }

  // ── Employees ────────────────────────────────────────────────────────────

  @override
  Future<List<EmployeeModel>> getEmployees() async {
    final body = await _get('/employees');
    return (body['data'] as List)
        .map((j) => EmployeeModel.fromJson(j as Map<String, dynamic>))
        .toList();
  }

  @override
  Future<EmployeeModel> getEmployeeById(String id) async {
    final body = await _get('/employees/$id');
    return EmployeeModel.fromJson(body['data'] as Map<String, dynamic>);
  }

  @override
  Future<bool> updateAvailability(String employeeId, List<AvailabilitySlot> availability) async {
    await _patch('/employees/$employeeId', {
      'availability': availability.map((a) => a.toJson()).toList(),
    });
    return true;
  }

  // ── Time slots ───────────────────────────────────────────────────────────

  @override
  Future<List<TimeSlot>> getAvailableSlots(
    String employeeId,
    DateTime date,
    int serviceDurationMinutes,
  ) async {
    // The backend always generates fixed 60-minute slots regardless of the
    // requested service's duration (same contract as the web client).
    final body = await _get('/employees/$employeeId/slots?date=${_fmtDate(date)}');
    return (body['data'] as List)
        .map((j) => TimeSlot.fromJson(j as Map<String, dynamic>))
        .toList();
  }

  // ── Bookings ─────────────────────────────────────────────────────────────

  @override
  Future<List<BookingModel>> getBookingsForClient(String clientId) async {
    final body = await _get('/bookings');
    return (body['data'] as List)
        .map((j) => BookingModel.fromJson(j as Map<String, dynamic>))
        .toList();
  }

  @override
  Future<List<BookingModel>> getBookingsForEmployee(String employeeId) async {
    final body = await _get('/bookings');
    return (body['data'] as List)
        .map((j) => BookingModel.fromJson(j as Map<String, dynamic>))
        .toList();
  }

  @override
  Future<List<BookingModel>> getAllBookings() async {
    final body = await _get('/bookings');
    return (body['data'] as List)
        .map((j) => BookingModel.fromJson(j as Map<String, dynamic>))
        .toList();
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
    final body = await _post('/bookings', {
      'serviceId': serviceId,
      'employeeId': employeeId,
      'date': _fmtDate(date),
      'startTime': startTime,
    });
    return BookingModel.fromJson(body['data'] as Map<String, dynamic>);
  }

  @override
  Future<BookingModel> cancelBooking(String bookingId) async {
    final body = await _patch('/bookings/$bookingId/cancel');
    return BookingModel.fromJson(body['data'] as Map<String, dynamic>);
  }

  // ── Admin ────────────────────────────────────────────────────────────────

  @override
  Future<Map<String, dynamic>> getAdminStats() async {
    final body = await _get('/admin/stats');
    return body['data'] as Map<String, dynamic>;
  }
}

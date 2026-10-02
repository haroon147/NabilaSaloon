import 'package:flutter/foundation.dart';
import '../models/employee_model.dart';
import '../services/salon_api.dart';
import '../services/salon_api_client.dart';

class EmployeeProvider extends ChangeNotifier {
  final SalonApiClient _api;

  EmployeeProvider({SalonApiClient? api}) : _api = api ?? salonApi;

  List<EmployeeModel> _employees = [];
  bool _isLoading = false;

  List<EmployeeModel> get employees => _employees;
  bool get isLoading => _isLoading;

  Future<void> loadEmployees() async {
    _isLoading = true;
    notifyListeners();
    try {
      _employees = await _api.getEmployees();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> updateAvailability(
    String employeeId,
    List<AvailabilitySlot> availability,
  ) async {
    try {
      final ok = await _api.updateAvailability(employeeId, availability);
      if (ok) {
        final idx = _employees.indexWhere((e) => e.id == employeeId);
        if (idx != -1) {
          // Rebuild with updated availability
          final old = _employees[idx];
          _employees = List.from(_employees)..[idx] = EmployeeModel(
            id: old.id,
            userId: old.userId,
            name: old.name,
            photo: old.photo,
            specialties: old.specialties,
            rating: old.rating,
            reviewCount: old.reviewCount,
            availability: availability,
          );
          notifyListeners();
        }
      }
      return ok;
    } catch (_) {
      return false;
    }
  }
}

import 'package:flutter/foundation.dart';
import '../models/user_model.dart';
import '../services/salon_api.dart';
import '../services/salon_api_client.dart';

class AuthProvider extends ChangeNotifier {
  final SalonApiClient _api;

  UserModel? _currentUser;
  bool _isLoading = false;
  String? _error;

  AuthProvider({SalonApiClient? api}) : _api = api ?? salonApi;

  UserModel? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _currentUser != null;
  UserRole? get role => _currentUser?.role;
  String? get error => _error;

  // Restores a session from a persisted JWT (real backend only — the mock
  // client always returns null here, matching Phase 1's logged-out start).
  Future<void> checkAuthState() async {
    _setLoading(true);
    try {
      _currentUser = await _api.getMe();
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> login(String email, String password, UserRole role) async {
    _setLoading(true);
    _error = null;
    try {
      final user = await _api.login(email, password, role);
      _currentUser = user;
      notifyListeners();
      return true;
    } catch (_) {
      _error = 'Login failed. Please try again.';
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> register({
    required String name,
    required String email,
    required String phone,
    required String password,
    required UserRole role,
  }) async {
    _setLoading(true);
    _error = null;
    try {
      final user = await _api.register(
        name: name,
        email: email,
        phone: phone,
        password: password,
        role: role,
      );
      _currentUser = user;
      notifyListeners();
      return true;
    } catch (_) {
      _error = 'Registration failed. Please try again.';
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> updateProfile({String? name, String? phone}) async {
    if (_currentUser == null) return false;
    try {
      _currentUser = await _api.updateProfile(_currentUser!, name: name, phone: phone);
      notifyListeners();
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<void> logout() async {
    await _api.logout();
    _currentUser = null;
    _error = null;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
}

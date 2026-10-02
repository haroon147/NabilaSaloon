import 'package:shared_preferences/shared_preferences.dart';

/// Persists the JWT across app restarts using SharedPreferences.
/// (flutter_secure_storage was tried in Phase 1 but throws SecurityException
/// on x86 emulators — see DEVELOPER_MANUAL.md.)
class TokenStore {
  static const _key = 'auth_token';

  static Future<void> save(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, token);
  }

  static Future<String?> read() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_key);
  }

  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
  }
}

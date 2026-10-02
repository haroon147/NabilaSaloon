class AppConfig {
  /// Toggle between the real backend and local mock data.
  ///
  /// Example:
  /// flutter run --dart-define=USE_BACKEND=false
  static const bool useBackend = bool.fromEnvironment(
    'USE_BACKEND',
    defaultValue: true,
  );

  /// Override when testing on a physical device:
  /// flutter run --dart-define=API_BASE_URL=http://192.168.1.20:5000/api
  static const String backendBaseUrl = String.fromEnvironment('API_BASE_URL');
}

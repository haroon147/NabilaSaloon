import '../config/app_config.dart';
import 'api_service.dart';
import 'mock_api_service.dart';
import 'salon_api_client.dart';

/// Single shared API client instance used across all providers and any
/// screen that talks to the backend directly (e.g. the admin dashboard).
final SalonApiClient salonApi = AppConfig.useBackend ? ApiService() : MockApiService();

import 'package:flutter/foundation.dart';
import '../models/service_model.dart';
import '../services/salon_api.dart';
import '../services/salon_api_client.dart';

class ServiceProvider extends ChangeNotifier {
  final SalonApiClient _api;

  ServiceProvider({SalonApiClient? api}) : _api = api ?? salonApi;

  List<ServiceModel> _services = [];
  String _selectedCategory = 'All';
  String _searchQuery = '';
  bool _isLoading = false;

  List<ServiceModel> get services => _services;
  String get selectedCategory => _selectedCategory;
  bool get isLoading => _isLoading;

  List<ServiceModel> get filtered {
    var list = _services;
    if (_selectedCategory != 'All') {
      list = list.where((s) => s.category == _selectedCategory).toList();
    }
    if (_searchQuery.isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      list = list.where((s) =>
          s.name.toLowerCase().contains(q) ||
          s.description.toLowerCase().contains(q) ||
          s.category.toLowerCase().contains(q)).toList();
    }
    return list;
  }

  List<String> get categories {
    final cats = <String>{'All'};
    for (final s in _services) {
      cats.add(s.category);
    }
    return cats.toList();
  }

  Future<void> loadServices() async {
    _isLoading = true;
    notifyListeners();
    try {
      _services = await _api.getServices();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void setCategory(String category) {
    _selectedCategory = category;
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }
}

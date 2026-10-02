import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/service_model.dart';
import '../../providers/employee_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/employee_card.dart';

class EmployeeListScreen extends StatefulWidget {
  const EmployeeListScreen({super.key});

  @override
  State<EmployeeListScreen> createState() => _EmployeeListScreenState();
}

class _EmployeeListScreenState extends State<EmployeeListScreen> {
  String? _filterSpecialty;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<EmployeeProvider>().loadEmployees();
    });
  }

  @override
  Widget build(BuildContext context) {
    // May arrive from BookingFlow with a preselected service
    final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    final preselectedService = args?['service'] as ServiceModel?;

    final ep = context.watch<EmployeeProvider>();

    final allSpecialties = <String>{};
    for (final e in ep.employees) {
      allSpecialties.addAll(e.specialties);
    }

    final filtered = _filterSpecialty == null
        ? ep.employees
        : ep.employees.where((e) => e.specialties.contains(_filterSpecialty)).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(preselectedService != null ? 'Choose Stylist' : 'Our Stylists'),
        leading: preselectedService != null
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_rounded),
                onPressed: () => Navigator.pop(context),
              )
            : null,
      ),
      body: Column(
        children: [
          // ── Specialty filter chips ─────────────────────────────────────
          if (allSpecialties.isNotEmpty)
            SizedBox(
              height: 52,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                children: [
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: const Text('All'),
                      selected: _filterSpecialty == null,
                      onSelected: (_) => setState(() => _filterSpecialty = null),
                      selectedColor: AppColors.primary,
                      backgroundColor: AppColors.roseTint,
                      labelStyle: TextStyle(
                        color: _filterSpecialty == null ? Colors.white : AppColors.textPrimary,
                        fontWeight: FontWeight.w500,
                      ),
                      showCheckmark: false,
                      side: BorderSide.none,
                    ),
                  ),
                  ...allSpecialties.map((s) {
                    final sel = _filterSpecialty == s;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: Text(s),
                        selected: sel,
                        onSelected: (_) => setState(() => _filterSpecialty = sel ? null : s),
                        selectedColor: AppColors.primary,
                        backgroundColor: AppColors.roseTint,
                        labelStyle: TextStyle(
                          color: sel ? Colors.white : AppColors.textPrimary,
                          fontWeight: FontWeight.w500,
                        ),
                        showCheckmark: false,
                        side: BorderSide.none,
                      ),
                    );
                  }),
                ],
              ),
            ),
          // ── List ────────────────────────────────────────────────────────
          Expanded(
            child: ep.isLoading
                ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
                : ListView.separated(
                    padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
                    itemCount: filtered.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 14),
                    itemBuilder: (_, i) {
                      final employee = filtered[i];
                      return EmployeeCard(
                        employee: employee,
                        onTap: () {
                          if (preselectedService != null) {
                            Navigator.pushNamed(
                              context,
                              '/client/booking',
                              arguments: {
                                'service': preselectedService,
                                'employee': employee,
                              },
                            );
                          } else {
                            Navigator.pushNamed(
                              context,
                              '/client/booking',
                              arguments: {'employee': employee},
                            );
                          }
                        },
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

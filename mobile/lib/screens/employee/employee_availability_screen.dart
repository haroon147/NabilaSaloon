import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/employee_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/employee_provider.dart';
import '../../theme/app_theme.dart';

class EmployeeAvailabilityScreen extends StatefulWidget {
  const EmployeeAvailabilityScreen({super.key});

  @override
  State<EmployeeAvailabilityScreen> createState() =>
      _EmployeeAvailabilityScreenState();
}

class _EmployeeAvailabilityScreenState
    extends State<EmployeeAvailabilityScreen> {
  static const _weekdays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday', 'Sunday',
  ];

  // Mutable availability state per day
  late Map<String, bool> _enabled;
  late Map<String, String> _start;
  late Map<String, String> _end;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _enabled = {for (final d in _weekdays) d: false};
    _start   = {for (final d in _weekdays) d: '09:00'};
    _end     = {for (final d in _weekdays) d: '18:00'};
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadEmployee());
  }

  void _loadEmployee() async {
    await context.read<EmployeeProvider>().loadEmployees();
    if (!mounted) return;
    final user = context.read<AuthProvider>().currentUser;
    if (user == null) return;
    final emp = context
        .read<EmployeeProvider>()
        .employees
        .where((e) => e.userId == user.id || e.name == user.name)
        .toList();
    if (emp.isEmpty) return;
    setState(() {
      for (final slot in emp.first.availability) {
        _enabled[slot.day] = true;
        _start[slot.day] = slot.start;
        _end[slot.day] = slot.end;
      }
    });
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    final slots = _weekdays
        .where((d) => _enabled[d]!)
        .map((d) => AvailabilitySlot(day: d, start: _start[d]!, end: _end[d]!))
        .toList();

    final user = context.read<AuthProvider>().currentUser;
    if (user == null) return;

    // Find the employee profile linked to the logged-in user. Mock data falls
    // back to matching by name, then first employee.
    final employees = context.read<EmployeeProvider>().employees;
    final emp = employees.where((e) => e.userId == user.id || e.name == user.name).toList();
    final empId = emp.isNotEmpty ? emp.first.id : employees.first.id;

    final ok = await context.read<EmployeeProvider>().updateAvailability(empId, slots);
    if (!mounted) return;
    setState(() => _saving = false);
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(ok ? 'Availability updated!' : 'Failed to save. Try again.'),
      backgroundColor: ok ? AppColors.success : AppColors.error,
      behavior: SnackBarBehavior.floating,
    ));
  }

  Future<void> _pickTime(String day, bool isStart) async {
    final initial = _parseTime(isStart ? _start[day]! : _end[day]!);
    final picked = await showTimePicker(
      context: context,
      initialTime: initial,
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: const ColorScheme.light(primary: AppColors.primary),
        ),
        child: child!,
      ),
    );
    if (picked == null) return;
    final h = picked.hour.toString().padLeft(2, '0');
    final m = picked.minute.toString().padLeft(2, '0');
    setState(() {
      if (isStart) {
        _start[day] = '$h:$m';
      } else {
        _end[day] = '$h:$m';
      }
    });
  }

  TimeOfDay _parseTime(String t) {
    final parts = t.split(':');
    return TimeOfDay(hour: int.parse(parts[0]), minute: int.parse(parts[1]));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Availability'),
        automaticallyImplyLeading: false,
        actions: [
          TextButton(
            onPressed: _saving ? null : _save,
            child: _saving
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                  )
                : const Text(
                    'Save',
                    style: TextStyle(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                    ),
                  ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: Text(
              'Set the days and hours you are available for bookings.',
              style: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
            ),
          ),
          ..._weekdays.map((day) => _DayRow(
                day: day,
                enabled: _enabled[day]!,
                start: _start[day]!,
                end: _end[day]!,
                onToggle: (v) => setState(() => _enabled[day] = v),
                onPickStart: () => _pickTime(day, true),
                onPickEnd: () => _pickTime(day, false),
              )),
        ],
      ),
    );
  }
}

class _DayRow extends StatelessWidget {
  final String day;
  final bool enabled;
  final String start;
  final String end;
  final ValueChanged<bool> onToggle;
  final VoidCallback onPickStart;
  final VoidCallback onPickEnd;

  const _DayRow({
    required this.day,
    required this.enabled,
    required this.start,
    required this.end,
    required this.onToggle,
    required this.onPickStart,
    required this.onPickEnd,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: enabled ? AppColors.surface : AppColors.background,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: enabled ? AppColors.primary.withValues(alpha: 0.3) : AppColors.border,
        ),
        boxShadow: enabled
            ? [
                BoxShadow(
                  color: AppColors.primary.withValues(alpha: 0.07),
                  blurRadius: 10,
                  offset: const Offset(0, 3),
                ),
              ]
            : [],
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    day,
                    style: AppTextStyles.heading3.copyWith(
                      color: enabled ? AppColors.textPrimary : AppColors.textHint,
                    ),
                  ),
                ),
                Switch(
                  value: enabled,
                  onChanged: onToggle,
                  activeThumbColor: AppColors.primary,
                ),
              ],
            ),
            if (enabled) ...[
              const SizedBox(height: 10),
              Row(
                children: [
                  _TimeButton(
                    label: 'From',
                    time: start,
                    onTap: onPickStart,
                  ),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 12),
                    child: Text('–', style: TextStyle(color: AppColors.textSecondary, fontSize: 18)),
                  ),
                  _TimeButton(
                    label: 'To',
                    time: end,
                    onTap: onPickEnd,
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _TimeButton extends StatelessWidget {
  final String label;
  final String time;
  final VoidCallback onTap;
  const _TimeButton({required this.label, required this.time, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 14),
          decoration: BoxDecoration(
            color: AppColors.roseTint,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: AppTextStyles.label),
                  Text(time, style: AppTextStyles.bodyMedium.copyWith(color: AppColors.primary)),
                ],
              ),
              const Icon(Icons.access_time, size: 16, color: AppColors.primary),
            ],
          ),
        ),
      ),
    );
  }
}

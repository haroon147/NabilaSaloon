import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:table_calendar/table_calendar.dart';
import '../../models/employee_model.dart';
import '../../models/service_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/booking_provider.dart';
import '../../providers/employee_provider.dart';
import '../../providers/service_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/employee_card.dart';
import '../../widgets/service_card.dart';
import '../../widgets/slot_chip.dart';

class BookingFlowScreen extends StatefulWidget {
  const BookingFlowScreen({super.key});

  @override
  State<BookingFlowScreen> createState() => _BookingFlowScreenState();
}

class _BookingFlowScreenState extends State<BookingFlowScreen> {
  int _step = 0; // 0=service, 1=stylist, 2=date+slot, 3=confirm
  bool _initialized = false;

  final PageController _pageCtrl = PageController();

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_initialized) {
      _initialized = true;
      _applyArguments();
    }
  }

  void _applyArguments() {
    // Always start fresh — prevents stale state from a previous abandoned flow
    final bp = context.read<BookingProvider>();
    bp.clearSelection();

    final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    final service = args?['service'] as ServiceModel?;
    final employee = args?['employee'] as EmployeeModel?;

    if (service != null) bp.selectService(service);
    if (employee != null) bp.selectEmployee(employee);

    if (service != null && employee != null) {
      _step = 2;
    } else if (service != null) {
      _step = 1;
    }
    // employee-only or no args → stay on step 0 (pick service first)

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_step > 0) _pageCtrl.jumpToPage(_step);
      context.read<ServiceProvider>().loadServices();
      context.read<EmployeeProvider>().loadEmployees();
    });
  }

  @override
  void dispose() {
    _pageCtrl.dispose();
    super.dispose();
  }

  void _goTo(int step) {
    setState(() => _step = step);
    _pageCtrl.animateToPage(step,
        duration: const Duration(milliseconds: 350), curve: Curves.easeInOut);
  }

  void _next() => _goTo(_step + 1);
  void _back() {
    if (_step == 0) {
      Navigator.pop(context);
    } else {
      _goTo(_step - 1);
    }
  }

  Future<void> _confirm() async {
    final user = context.read<AuthProvider>().currentUser;
    if (user == null) return;
    final booking = await context.read<BookingProvider>().confirmBooking(
      clientId: user.id,
      clientName: user.name,
    );
    if (!mounted) return;
    if (booking != null) {
      _showSuccess();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Booking failed. Please try again.'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  void _showSuccess() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        contentPadding: const EdgeInsets.all(32),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: const BoxDecoration(
                color: Color(0xFFE8F5E9),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_rounded, color: AppColors.success, size: 44),
            ),
            const SizedBox(height: 20),
            Text('Booking Confirmed!', style: AppTextStyles.heading1, textAlign: TextAlign.center),
            const SizedBox(height: 8),
            Text(
              'Your appointment has been booked successfully. See you soon!',
              style: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 28),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pop(); // close dialog
                  Navigator.pushReplacementNamed(context, '/client');
                },
                child: const Text('View My Bookings'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Book Appointment'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded),
          onPressed: _back,
        ),
      ),
      body: Column(
        children: [
          _StepIndicator(currentStep: _step),
          Expanded(
            child: PageView(
              controller: _pageCtrl,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _ServiceStep(onNext: _next),
                _StylistStep(onNext: _next),
                _DateSlotStep(onNext: _next),
                _ConfirmStep(onConfirm: _confirm),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Step indicator ─────────────────────────────────────────────────────────────

class _StepIndicator extends StatelessWidget {
  final int currentStep;
  const _StepIndicator({required this.currentStep});

  static const _labels = ['Service', 'Stylist', 'Date & Time', 'Confirm'];

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.background,
      padding: const EdgeInsets.fromLTRB(24, 8, 24, 16),
      child: Row(
        children: List.generate(_labels.length * 2 - 1, (i) {
          if (i.isOdd) {
            final stepIdx = i ~/ 2;
            return Expanded(
              child: Container(
                height: 2,
                color: stepIdx < currentStep ? AppColors.primary : AppColors.border,
              ),
            );
          }
          final stepIdx = i ~/ 2;
          final done = stepIdx < currentStep;
          final active = stepIdx == currentStep;
          return Column(
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: done || active ? AppColors.primary : AppColors.border,
                ),
                child: Center(
                  child: done
                      ? const Icon(Icons.check_rounded, color: Colors.white, size: 16)
                      : Text(
                          '${stepIdx + 1}',
                          style: TextStyle(
                            color: active ? Colors.white : AppColors.textHint,
                            fontWeight: FontWeight.w700,
                            fontSize: 13,
                          ),
                        ),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                _labels[stepIdx],
                style: AppTextStyles.label.copyWith(
                  color: active ? AppColors.primary : AppColors.textHint,
                  fontSize: 10,
                ),
              ),
            ],
          );
        }),
      ),
    );
  }
}

// ── Step 0: Service ────────────────────────────────────────────────────────────

class _ServiceStep extends StatelessWidget {
  final VoidCallback onNext;
  const _ServiceStep({required this.onNext});

  @override
  Widget build(BuildContext context) {
    final sp = context.watch<ServiceProvider>();
    final bp = context.watch<BookingProvider>();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 12),
          child: Text('Choose a Service', style: AppTextStyles.heading2),
        ),
        Expanded(
          child: sp.isLoading
              ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
              : GridView.builder(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.62,
                  ),
                  itemCount: sp.services.length,
                  itemBuilder: (_, i) {
                    final s = sp.services[i];
                    final selected = bp.selectedService?.id == s.id;
                    return GestureDetector(
                      onTap: () {
                        bp.selectService(s);
                        onNext();
                      },
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: selected ? AppColors.primary : Colors.transparent,
                            width: 2,
                          ),
                        ),
                        child: ServiceCard(service: s, onTap: null),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}

// ── Step 1: Stylist ────────────────────────────────────────────────────────────

class _StylistStep extends StatelessWidget {
  final VoidCallback onNext;
  const _StylistStep({required this.onNext});

  @override
  Widget build(BuildContext context) {
    final ep = context.watch<EmployeeProvider>();
    final bp = context.watch<BookingProvider>();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 12),
          child: Text('Choose a Stylist', style: AppTextStyles.heading2),
        ),
        Expanded(
          child: ep.isLoading
              ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
              : ListView.separated(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                  itemCount: ep.employees.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (_, i) {
                    final e = ep.employees[i];
                    return EmployeeCard(
                      employee: e,
                      isSelected: bp.selectedEmployee?.id == e.id,
                      onTap: () {
                        bp.selectEmployee(e);
                        onNext();
                      },
                    );
                  },
                ),
        ),
      ],
    );
  }
}

// ── Step 2: Date & Time Slot ───────────────────────────────────────────────────

class _DateSlotStep extends StatefulWidget {
  final VoidCallback onNext;
  const _DateSlotStep({required this.onNext});

  @override
  State<_DateSlotStep> createState() => _DateSlotStepState();
}

class _DateSlotStepState extends State<_DateSlotStep> {
  DateTime _focusedDay = DateTime.now();

  @override
  Widget build(BuildContext context) {
    final bp = context.watch<BookingProvider>();

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(24, 8, 24, 0),
            child: Text('Pick a Date', style: AppTextStyles.heading2),
          ),
          // ── Calendar ────────────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: TableCalendar(
              firstDay: DateTime.now(),
              lastDay: DateTime.now().add(const Duration(days: 60)),
              focusedDay: _focusedDay,
              selectedDayPredicate: (day) =>
                  bp.selectedDate != null && isSameDay(bp.selectedDate!, day),
              onDaySelected: (selected, focused) {
                setState(() => _focusedDay = focused);
                bp.selectDate(selected);
              },
              calendarStyle: CalendarStyle(
                selectedDecoration: const BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                ),
                todayDecoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  shape: BoxShape.circle,
                ),
                weekendTextStyle: const TextStyle(color: AppColors.textHint),
                disabledTextStyle: const TextStyle(color: AppColors.border),
                defaultTextStyle: const TextStyle(color: AppColors.textPrimary),
              ),
              headerStyle: const HeaderStyle(
                formatButtonVisible: false,
                titleCentered: true,
                titleTextStyle: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
                leftChevronIcon: Icon(Icons.chevron_left, color: AppColors.primary),
                rightChevronIcon: Icon(Icons.chevron_right, color: AppColors.primary),
              ),
              daysOfWeekStyle: const DaysOfWeekStyle(
                weekdayStyle: TextStyle(
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                ),
                weekendStyle: TextStyle(color: AppColors.textHint, fontSize: 12),
              ),
            ),
          ),
          // ── Slots ────────────────────────────────────────────────────────
          if (bp.selectedDate != null) ...[
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 20, 24, 10),
              child: Text('Available Times', style: AppTextStyles.heading2),
            ),
            if (bp.loadingSlots)
              const Padding(
                padding: EdgeInsets.all(24),
                child: Center(child: CircularProgressIndicator(color: AppColors.primary)),
              )
            else if (bp.availableSlots.isEmpty)
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
                child: _NoSlotsCard(),
              )
            else ...[
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 8),
                child: Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: bp.availableSlots.map((slot) {
                    return SlotChip(
                      slot: slot,
                      isSelected: bp.selectedSlot?.startTime == slot.startTime,
                      onTap: () => bp.selectSlot(slot),
                    );
                  }).toList(),
                ),
              ),
              if (bp.selectedSlot != null)
                Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
                  child: SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: widget.onNext,
                      child: const Text('Continue to Review'),
                    ),
                  ),
                ),
            ],
          ],
          const SizedBox(height: 40),
        ],
      ),
    );
  }
}

class _NoSlotsCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          const Icon(Icons.event_busy, color: AppColors.textHint, size: 28),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('No slots available', style: AppTextStyles.bodyMedium),
                Text('Try another date or stylist.', style: AppTextStyles.caption),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Step 3: Confirm ────────────────────────────────────────────────────────────

class _ConfirmStep extends StatelessWidget {
  final VoidCallback onConfirm;
  const _ConfirmStep({required this.onConfirm});

  @override
  Widget build(BuildContext context) {
    final bp = context.watch<BookingProvider>();
    final isLoading = bp.isLoading;

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(24, 8, 24, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Review & Confirm', style: AppTextStyles.heading2),
          const SizedBox(height: 20),
          _SummaryCard(bp: bp),
          const SizedBox(height: 24),
          // Total
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.roseTint,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Total', style: AppTextStyles.heading3),
                Text(
                  'PKR ${bp.selectedService?.price.toStringAsFixed(0) ?? '—'}',
                  style: AppTextStyles.price.copyWith(fontSize: 20),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: isLoading ? null : onConfirm,
              child: isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : const Text('Confirm Booking'),
            ),
          ),
          const SizedBox(height: 12),
          Center(
            child: Text(
              'Free cancellation up to 24 hours before your appointment.',
              style: AppTextStyles.caption,
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final BookingProvider bp;
  const _SummaryCard({required this.bp});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.08),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        children: [
          _row(Icons.spa_outlined, 'Service', bp.selectedService?.name ?? '—'),
          const Divider(height: 1, indent: 56),
          _row(Icons.content_cut, 'Duration', bp.selectedService?.formattedDuration ?? '—'),
          const Divider(height: 1, indent: 56),
          _row(Icons.person_outline, 'Stylist', bp.selectedEmployee?.name ?? '—'),
          const Divider(height: 1, indent: 56),
          _row(Icons.calendar_today_outlined, 'Date', _formatDate(bp.selectedDate)),
          const Divider(height: 1, indent: 56),
          _row(Icons.schedule, 'Time',
              bp.selectedSlot != null
                  ? '${bp.selectedSlot!.startTime} – ${bp.selectedSlot!.endTime}'
                  : '—'),
        ],
      ),
    );
  }

  Widget _row(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Row(
        children: [
          Icon(icon, color: AppColors.primary, size: 22),
          const SizedBox(width: 16),
          Text(label, style: AppTextStyles.caption),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              value,
              style: AppTextStyles.bodyMedium,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.end,
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime? date) {
    if (date == null) return '—';
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const days = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return '${days[date.weekday]}, ${months[date.month - 1]} ${date.day}';
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:table_calendar/table_calendar.dart';
import '../../providers/auth_provider.dart';
import '../../providers/booking_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/booking_card.dart';

class EmployeeScheduleScreen extends StatefulWidget {
  const EmployeeScheduleScreen({super.key});

  @override
  State<EmployeeScheduleScreen> createState() => _EmployeeScheduleScreenState();
}

class _EmployeeScheduleScreenState extends State<EmployeeScheduleScreen> {
  DateTime _focusedDay = DateTime.now();
  DateTime _selectedDay = DateTime.now();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  void _load() {
    final user = context.read<AuthProvider>().currentUser;
    if (user != null) {
      context.read<BookingProvider>().loadBookingsForEmployee(user.id);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bp = context.watch<BookingProvider>();
    final todayBookings = bp.bookingsForDate(_selectedDay);
    final upcomingCount = bp.upcomingBookings.length;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Schedule'),
        automaticallyImplyLeading: false,
      ),
      body: bp.isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : RefreshIndicator(
              color: AppColors.primary,
              onRefresh: () async => _load(),
              child: CustomScrollView(
                slivers: [
                  // ── Stats strip ──────────────────────────────────────────
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                      child: Row(
                        children: [
                          _StatChip(
                            label: 'Upcoming',
                            value: '$upcomingCount',
                            icon: Icons.upcoming_outlined,
                          ),
                          const SizedBox(width: 12),
                          _StatChip(
                            label: 'Today',
                            value: '${bp.bookingsForDate(DateTime.now()).length}',
                            icon: Icons.today,
                          ),
                          const SizedBox(width: 12),
                          _StatChip(
                            label: 'Completed',
                            value: '${bp.pastBookings.length}',
                            icon: Icons.check_circle_outline,
                          ),
                        ],
                      ),
                    ),
                  ),

                  // ── Calendar ─────────────────────────────────────────────
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                      child: TableCalendar(
                        firstDay: DateTime.now().subtract(const Duration(days: 30)),
                        lastDay: DateTime.now().add(const Duration(days: 60)),
                        focusedDay: _focusedDay,
                        selectedDayPredicate: (d) => isSameDay(d, _selectedDay),
                        onDaySelected: (selected, focused) =>
                            setState(() {
                              _selectedDay = selected;
                              _focusedDay = focused;
                            }),
                        eventLoader: (day) => bp.bookingsForDate(day),
                        calendarStyle: CalendarStyle(
                          selectedDecoration: const BoxDecoration(
                            color: AppColors.primary,
                            shape: BoxShape.circle,
                          ),
                          todayDecoration: BoxDecoration(
                            color: AppColors.primaryLight,
                            shape: BoxShape.circle,
                          ),
                          markerDecoration: const BoxDecoration(
                            color: AppColors.primaryDark,
                            shape: BoxShape.circle,
                          ),
                          markersMaxCount: 3,
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
                        ),
                        calendarFormat: CalendarFormat.month,
                      ),
                    ),
                  ),

                  // ── Day bookings ──────────────────────────────────────────
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(20, 24, 20, 10),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              isSameDay(_selectedDay, DateTime.now())
                                  ? 'Today\'s Appointments'
                                  : 'Appointments – ${_fmtDate(_selectedDay)}',
                              style: AppTextStyles.heading2,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.roseTint,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              '${todayBookings.length}',
                              style: const TextStyle(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w700,
                                fontSize: 13,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  if (todayBookings.isEmpty)
                    SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
                        child: _EmptyDay(),
                      ),
                    )
                  else
                    SliverList(
                      delegate: SliverChildBuilderDelegate(
                        (_, i) => Padding(
                          padding: const EdgeInsets.fromLTRB(20, 0, 20, 14),
                          child: BookingCard(
                            booking: todayBookings[i],
                            showClient: true,
                          ),
                        ),
                        childCount: todayBookings.length,
                      ),
                    ),
                  const SliverToBoxAdapter(child: SizedBox(height: 32)),
                ],
              ),
            ),
    );
  }

  String _fmtDate(DateTime d) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return '${months[d.month - 1]} ${d.day}';
  }
}

class _StatChip extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  const _StatChip({required this.label, required this.value, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withValues(alpha: 0.07),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(icon, color: AppColors.primary, size: 20),
            const SizedBox(height: 6),
            Text(value, style: AppTextStyles.heading2.copyWith(color: AppColors.primary)),
            Text(label, style: AppTextStyles.caption),
          ],
        ),
      ),
    );
  }
}

class _EmptyDay extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          const Icon(Icons.event_available, color: AppColors.textHint, size: 32),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Free day', style: AppTextStyles.bodyMedium),
                Text('No appointments scheduled', style: AppTextStyles.caption),
              ],
            ),
          ),
        ],
      ),
    );
  }
}


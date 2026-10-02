import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/booking_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/booking_card.dart';

class MyBookingsScreen extends StatefulWidget {
  const MyBookingsScreen({super.key});

  @override
  State<MyBookingsScreen> createState() => _MyBookingsScreenState();
}

class _MyBookingsScreenState extends State<MyBookingsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabs;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 3, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  void _load() {
    final user = context.read<AuthProvider>().currentUser;
    if (user != null) {
      context.read<BookingProvider>().loadBookingsForClient(user.id);
    }
  }

  @override
  void dispose() {
    _tabs.dispose();
    super.dispose();
  }

  Future<void> _cancel(String bookingId) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        title: const Text('Cancel Booking'),
        content: const Text('Are you sure you want to cancel this appointment?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Keep')),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: const Text('Cancel Booking'),
          ),
        ],
      ),
    );
    if (confirmed == true && mounted) {
      await context.read<BookingProvider>().cancelBooking(bookingId);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bp = context.watch<BookingProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Bookings'),
        bottom: TabBar(
          controller: _tabs,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          indicatorWeight: 3,
          labelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
          tabs: const [
            Tab(text: 'Upcoming'),
            Tab(text: 'Past'),
            Tab(text: 'Cancelled'),
          ],
        ),
      ),
      body: bp.isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : TabBarView(
              controller: _tabs,
              children: [
                _BookingList(
                  bookings: bp.upcomingBookings,
                  emptyMessage: 'No upcoming appointments',
                  emptyIcon: Icons.event_available,
                  onCancel: _cancel,
                ),
                _BookingList(
                  bookings: bp.pastBookings,
                  emptyMessage: 'No past appointments',
                  emptyIcon: Icons.history,
                ),
                _BookingList(
                  bookings: bp.cancelledBookings,
                  emptyMessage: 'No cancelled bookings',
                  emptyIcon: Icons.cancel_outlined,
                ),
              ],
            ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.pushNamed(context, '/client/services'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('New Booking', style: TextStyle(fontWeight: FontWeight.w600)),
      ),
    );
  }
}

class _BookingList extends StatelessWidget {
  final List bookings;
  final String emptyMessage;
  final IconData emptyIcon;
  final void Function(String)? onCancel;

  const _BookingList({
    required this.bookings,
    required this.emptyMessage,
    required this.emptyIcon,
    this.onCancel,
  });

  @override
  Widget build(BuildContext context) {
    if (bookings.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(emptyIcon, size: 56, color: AppColors.textHint),
            const SizedBox(height: 14),
            Text(emptyMessage,
                style: AppTextStyles.heading3.copyWith(color: AppColors.textSecondary)),
            const SizedBox(height: 6),
            Text('Your appointments will appear here', style: AppTextStyles.caption),
          ],
        ),
      );
    }
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 100),
      itemCount: bookings.length,
      separatorBuilder: (_, __) => const SizedBox(height: 14),
      itemBuilder: (_, i) => BookingCard(
        booking: bookings[i],
        onCancel: onCancel != null ? () => onCancel!(bookings[i].id) : null,
      ),
    );
  }
}

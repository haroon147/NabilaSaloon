import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/booking_provider.dart';
import '../../providers/employee_provider.dart';
import '../../providers/service_provider.dart';
import '../../services/salon_api.dart';
import '../../theme/app_theme.dart';
import '../../widgets/booking_card.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabs;
  Map<String, dynamic> _stats = {};
  bool _loadingStats = true;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 3, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    context.read<BookingProvider>().loadAllBookings();
    context.read<EmployeeProvider>().loadEmployees();
    context.read<ServiceProvider>().loadServices();
    final stats = await salonApi.getAdminStats();
    if (mounted) {
      setState(() {
        _stats = stats;
        _loadingStats = false;
      });
    }
  }

  @override
  void dispose() {
    _tabs.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bp = context.watch<BookingProvider>();
    final ep = context.watch<EmployeeProvider>();
    final sp = context.watch<ServiceProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
        automaticallyImplyLeading: false,
        bottom: TabBar(
          controller: _tabs,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          labelStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
          tabs: const [
            Tab(text: 'Overview'),
            Tab(text: 'Bookings'),
            Tab(text: 'Team'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabs,
        children: [
          // ── Overview tab ───────────────────────────────────────────────
          RefreshIndicator(
            color: AppColors.primary,
            onRefresh: _load,
            child: _loadingStats
                ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
                : _OverviewTab(stats: _stats, sp: sp, ep: ep),
          ),

          // ── Bookings tab ───────────────────────────────────────────────
          bp.isLoading
              ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
              : _BookingsTab(bp: bp),

          // ── Team tab ────────────────────────────────────────────────────
          ep.isLoading
              ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
              : _TeamTab(ep: ep),
        ],
      ),
    );
  }
}

// ── Overview Tab ────────────────────────────────────────────────────────────────

class _OverviewTab extends StatelessWidget {
  final Map<String, dynamic> stats;
  final ServiceProvider sp;
  final EmployeeProvider ep;

  const _OverviewTab({required this.stats, required this.sp, required this.ep});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 40),
      children: [
        // ── Revenue banner ─────────────────────────────────────────────
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AppColors.primary, AppColors.primaryDark],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(22),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withValues(alpha: 0.3),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Monthly Revenue',
                style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              Text(
                'PKR ${_fmt(stats['monthRevenue'] ?? 0)}',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 32,
                  fontWeight: FontWeight.w700,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  const Icon(Icons.trending_up, color: Colors.white70, size: 16),
                  const SizedBox(width: 6),
                  Text(
                    '${stats['completionRate'] ?? 0}% completion rate',
                    style: const TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // ── Stat grid ─────────────────────────────────────────────────
        GridView.count(
          crossAxisCount: 2,
          crossAxisSpacing: 14,
          mainAxisSpacing: 14,
          childAspectRatio: 1.4,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          children: [
            _StatCard(
              label: 'Total Bookings',
              value: '${stats['totalBookings'] ?? 0}',
              icon: Icons.calendar_month,
              color: const Color(0xFF6C63FF),
            ),
            _StatCard(
              label: 'Today',
              value: '${stats['todayBookings'] ?? 0}',
              icon: Icons.today,
              color: AppColors.success,
            ),
            _StatCard(
              label: 'Active Clients',
              value: '${stats['activeClients'] ?? 0}',
              icon: Icons.people_outline,
              color: AppColors.warning,
            ),
            _StatCard(
              label: 'Stylists',
              value: '${ep.employees.length}',
              icon: Icons.badge_outlined,
              color: AppColors.primary,
            ),
          ],
        ),
        const SizedBox(height: 24),

        // ── Quick actions ──────────────────────────────────────────────
        Text('Quick Actions', style: AppTextStyles.heading2),
        const SizedBox(height: 14),
        Row(
          children: [
            Expanded(
              child: _ActionButton(
                icon: Icons.person_add_outlined,
                label: 'Add Stylist',
                onTap: () => _showComingSoon(context),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _ActionButton(
                icon: Icons.add_circle_outline,
                label: 'Add Service',
                onTap: () => _showComingSoon(context),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _ActionButton(
                icon: Icons.bar_chart,
                label: 'Reports',
                onTap: () => _showComingSoon(context),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _ActionButton(
                icon: Icons.settings_outlined,
                label: 'Settings',
                onTap: () => _showComingSoon(context),
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),

        // ── Services summary ────────────────────────────────────────────
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Services (${sp.services.length})', style: AppTextStyles.heading2),
          ],
        ),
        const SizedBox(height: 12),
        ...sp.services.take(5).map((s) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: const BoxDecoration(
                        color: AppColors.roseTint,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.spa, color: AppColors.primary, size: 20),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(s.name, style: AppTextStyles.bodyMedium),
                          Text(s.category, style: AppTextStyles.caption),
                        ],
                      ),
                    ),
                    Text(s.formattedPrice, style: AppTextStyles.price),
                  ],
                ),
              ),
            )),
      ],
    );
  }

  void _showComingSoon(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Coming in Phase 3 (Backend)'),
        behavior: SnackBarBehavior.floating,
        backgroundColor: AppColors.primary,
      ),
    );
  }

  String _fmt(num n) {
    if (n >= 1000) return '${(n / 1000).toStringAsFixed(0)}K';
    return n.toString();
  }
}

// ── Bookings Tab ────────────────────────────────────────────────────────────────

class _BookingsTab extends StatelessWidget {
  final BookingProvider bp;
  const _BookingsTab({required this.bp});

  @override
  Widget build(BuildContext context) {
    final all = bp.bookings;
    if (all.isEmpty) {
      return const Center(child: Text('No bookings found'));
    }
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 40),
      itemCount: all.length,
      separatorBuilder: (_, __) => const SizedBox(height: 14),
      itemBuilder: (_, i) => BookingCard(booking: all[i], showClient: true),
    );
  }
}

// ── Team Tab ────────────────────────────────────────────────────────────────────

class _TeamTab extends StatelessWidget {
  final EmployeeProvider ep;
  const _TeamTab({required this.ep});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 40),
      itemCount: ep.employees.length,
      separatorBuilder: (_, __) => const SizedBox(height: 14),
      itemBuilder: (_, i) {
        final e = ep.employees[i];
        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(18),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withValues(alpha: 0.06),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.roseTint,
                ),
                child: Center(
                  child: Text(
                    e.name[0],
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(e.name, style: AppTextStyles.heading3),
                    const SizedBox(height: 3),
                    Text(e.specialties.take(2).join(' · '), style: AppTextStyles.caption),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.star_rounded, color: Colors.amber, size: 14),
                        const SizedBox(width: 3),
                        Text(
                          '${e.rating} (${e.reviewCount} reviews)',
                          style: AppTextStyles.caption,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: AppColors.roseTint,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  '${e.availability.length}d/wk',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

// ── Sub-widgets ─────────────────────────────────────────────────────────────────

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: color.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Icon(icon, color: color, size: 24),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(value, style: AppTextStyles.heading2.copyWith(color: color)),
              Text(label, style: AppTextStyles.caption),
            ],
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ActionButton({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          children: [
            Icon(icon, color: AppColors.primary, size: 24),
            const SizedBox(height: 6),
            Text(label, style: AppTextStyles.caption.copyWith(fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}

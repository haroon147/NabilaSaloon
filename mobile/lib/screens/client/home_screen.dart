import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/booking_provider.dart';
import '../../providers/service_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/booking_card.dart';
import '../../widgets/service_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  void _load() {
    final user = context.read<AuthProvider>().currentUser;
    context.read<ServiceProvider>().loadServices();
    if (user != null) {
      context.read<BookingProvider>().loadBookingsForClient(user.id);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final services = context.watch<ServiceProvider>();
    final bookings = context.watch<BookingProvider>();
    final user = auth.currentUser;

    final upcoming = bookings.upcomingBookings.take(2).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          color: AppColors.primary,
          onRefresh: () async => _load(),
          child: CustomScrollView(
            slivers: [
              // ── Header ──────────────────────────────────────────────────
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Hello, ${user?.name.split(' ').first ?? 'Guest'} 👋',
                              style: AppTextStyles.heading1,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Ready for your next look?',
                              style: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
                            ),
                          ],
                        ),
                      ),
                      _Avatar(name: user?.name ?? 'G'),
                    ],
                  ),
                ),
              ),

              // ── Quick Book banner ────────────────────────────────────────
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 0),
                  child: _QuickBookBanner(
                    onTap: () => Navigator.pushNamed(context, '/client/services'),
                  ),
                ),
              ),

              // ── Upcoming appointments ────────────────────────────────────
              if (upcoming.isNotEmpty) ...[
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(24, 28, 24, 12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Upcoming', style: AppTextStyles.heading2),
                        TextButton(
                          onPressed: () => Navigator.pushNamed(context, '/client/bookings'),
                          child: const Text('See all'),
                        ),
                      ],
                    ),
                  ),
                ),
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (_, i) => Padding(
                      padding: const EdgeInsets.fromLTRB(24, 0, 24, 12),
                      child: BookingCard(booking: upcoming[i]),
                    ),
                    childCount: upcoming.length,
                  ),
                ),
              ],

              // ── Featured services ─────────────────────────────────────────
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Services', style: AppTextStyles.heading2),
                      TextButton(
                        onPressed: () => Navigator.pushNamed(context, '/client/services'),
                        child: const Text('See all'),
                      ),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: services.isLoading
                    ? const Center(
                        child: Padding(
                          padding: EdgeInsets.all(32),
                          child: CircularProgressIndicator(color: AppColors.primary),
                        ),
                      )
                    : SizedBox(
                        height: 200,
                        child: ListView.separated(
                          scrollDirection: Axis.horizontal,
                          padding: const EdgeInsets.symmetric(horizontal: 24),
                          itemCount: services.services.take(6).length,
                          separatorBuilder: (_, __) => const SizedBox(width: 14),
                          itemBuilder: (_, i) {
                            final s = services.services[i];
                            return ServiceCard(
                              service: s,
                              compact: true,
                              onTap: () => Navigator.pushNamed(
                                context,
                                '/client/booking',
                                arguments: {'service': s},
                              ),
                            );
                          },
                        ),
                      ),
              ),

              // ── Categories grid ──────────────────────────────────────────
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 28, 24, 12),
                  child: Text('Browse by Category', style: AppTextStyles.heading2),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(24, 0, 24, 32),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 14,
                    mainAxisSpacing: 14,
                    childAspectRatio: 2.2,
                  ),
                  delegate: SliverChildBuilderDelegate(
                    (_, i) {
                      final cats = [
                        ('Hair', Icons.content_cut),
                        ('Nails', Icons.back_hand_outlined),
                        ('Skin', Icons.face_retouching_natural),
                        ('Packages', Icons.card_giftcard),
                      ];
                      if (i >= cats.length) return null;
                      final (name, icon) = cats[i];
                      return _CategoryTile(
                        name: name,
                        icon: icon,
                        onTap: () {
                          context.read<ServiceProvider>().setCategory(name);
                          Navigator.pushNamed(context, '/client/services');
                        },
                      );
                    },
                    childCount: 4,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Avatar extends StatelessWidget {
  final String name;
  const _Avatar({required this.name});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 48,
      height: 48,
      decoration: const BoxDecoration(
        shape: BoxShape.circle,
        color: AppColors.roseTint,
        border: Border.fromBorderSide(BorderSide(color: AppColors.primary, width: 2)),
      ),
      child: Center(
        child: Text(
          name[0].toUpperCase(),
          style: const TextStyle(
            fontWeight: FontWeight.w700,
            fontSize: 20,
            color: AppColors.primary,
          ),
        ),
      ),
    );
  }
}

class _QuickBookBanner extends StatelessWidget {
  final VoidCallback onTap;
  const _QuickBookBanner({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(22),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [AppColors.primary, AppColors.primaryDark],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withValues(alpha: 0.35),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Book Your Next\nAppointment',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Text(
                      'Book Now',
                      style: TextStyle(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w700,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.spa, color: Colors.white54, size: 72),
          ],
        ),
      ),
    );
  }
}

class _CategoryTile extends StatelessWidget {
  final String name;
  final IconData icon;
  final VoidCallback onTap;
  const _CategoryTile({required this.name, required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
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
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: AppColors.primary, size: 22),
            const SizedBox(width: 10),
            Flexible(
              child: Text(
                name,
                style: AppTextStyles.heading3,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/user_model.dart';
import '../../providers/auth_provider.dart';
import '../../theme/app_theme.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnim;
  late Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _fadeAnim = CurvedAnimation(parent: _controller, curve: Curves.easeIn);
    _scaleAnim = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );
    _controller.forward();
    _navigate();
  }

  Future<void> _navigate() async {
    final restore = context.read<AuthProvider>().checkAuthState();
    await Future.wait([
      restore,
      Future.delayed(const Duration(milliseconds: 2000)),
    ]);
    if (!mounted) return;
    final user = context.read<AuthProvider>().currentUser;
    if (user == null) {
      Navigator.pushReplacementNamed(context, '/login');
      return;
    }
    switch (user.role) {
      case UserRole.employee:
        Navigator.pushReplacementNamed(context, '/employee');
      case UserRole.admin:
        Navigator.pushReplacementNamed(context, '/admin');
      case UserRole.client:
        Navigator.pushReplacementNamed(context, '/client');
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnim,
          child: ScaleTransition(
            scale: _scaleAnim,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo mark
                Container(
                  width: 110,
                  height: 110,
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primary.withValues(alpha: 0.35),
                        blurRadius: 30,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.spa,
                    color: Colors.white,
                    size: 56,
                  ),
                ),
                const SizedBox(height: 28),
                Text(
                  'Nabila Salon',
                  style: AppTextStyles.display.copyWith(
                    color: AppColors.textPrimary,
                    letterSpacing: 1.0,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Beauty & Wellness',
                  style: AppTextStyles.body.copyWith(
                    color: AppColors.primary,
                    letterSpacing: 2.5,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 60),
                SizedBox(
                  width: 28,
                  height: 28,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.5,
                    color: AppColors.primary.withValues(alpha: 0.5),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

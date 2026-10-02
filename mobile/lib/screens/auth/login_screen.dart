import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/user_model.dart';
import '../../providers/auth_provider.dart';
import '../../theme/app_theme.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

const _demoCredentials = {
  UserRole.client: ('sara@demo.com', 'client123'),
  UserRole.employee: ('zara@nabilasalon.com', 'employee123'),
  UserRole.admin: ('admin@nabilasalon.com', 'admin123'),
};

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  late final _emailCtrl = TextEditingController(text: _demoCredentials[_selectedRole]!.$1);
  late final _passwordCtrl = TextEditingController(text: _demoCredentials[_selectedRole]!.$2);
  UserRole _selectedRole = UserRole.client;
  bool _obscure = true;

  void _selectRole(UserRole role) {
    setState(() {
      _selectedRole = role;
      _emailCtrl.text = _demoCredentials[role]!.$1;
      _passwordCtrl.text = _demoCredentials[role]!.$2;
    });
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final auth = context.read<AuthProvider>();
    final ok = await auth.login(_emailCtrl.text.trim(), _passwordCtrl.text, _selectedRole);
    if (!mounted) return;
    if (ok) {
      _routeByRole(_selectedRole);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(auth.error ?? 'Login failed'), backgroundColor: AppColors.error),
      );
    }
  }

  void _routeByRole(UserRole role) {
    switch (role) {
      case UserRole.employee:
        Navigator.pushReplacementNamed(context, '/employee');
      case UserRole.admin:
        Navigator.pushReplacementNamed(context, '/admin');
      default:
        Navigator.pushReplacementNamed(context, '/client');
    }
  }

  @override
  Widget build(BuildContext context) {
    final isLoading = context.watch<AuthProvider>().isLoading;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 28),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 48),
              // Header
              Center(
                child: Container(
                  width: 72,
                  height: 72,
                  decoration: const BoxDecoration(
                    color: AppColors.primary,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.spa, color: Colors.white, size: 38),
                ),
              ),
              const SizedBox(height: 20),
              Text('Welcome back', style: AppTextStyles.display, textAlign: TextAlign.center),
              const SizedBox(height: 6),
              Text(
                'Sign in to your account',
                style: AppTextStyles.body.copyWith(color: AppColors.textSecondary),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              // Form
              Form(
                key: _formKey,
                child: Column(
                  children: [
                    // Role selector
                    Container(
                      decoration: BoxDecoration(
                        color: AppColors.roseTint,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Row(
                        children: UserRole.values.map((role) {
                          final selected = _selectedRole == role;
                          return Expanded(
                            child: GestureDetector(
                              onTap: () => _selectRole(role),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                margin: const EdgeInsets.all(4),
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                decoration: BoxDecoration(
                                  color: selected ? AppColors.primary : Colors.transparent,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  role.name[0].toUpperCase() + role.name.substring(1),
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: selected ? Colors.white : AppColors.textSecondary,
                                  ),
                                ),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _emailCtrl,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        labelText: 'Email',
                        prefixIcon: Icon(Icons.email_outlined, color: AppColors.textSecondary),
                      ),
                      validator: (v) => (v == null || v.isEmpty) ? 'Enter your email' : null,
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _passwordCtrl,
                      obscureText: _obscure,
                      decoration: InputDecoration(
                        labelText: 'Password',
                        prefixIcon: const Icon(Icons.lock_outline, color: AppColors.textSecondary),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                            color: AppColors.textSecondary,
                          ),
                          onPressed: () => setState(() => _obscure = !_obscure),
                        ),
                      ),
                      validator: (v) => (v == null || v.length < 4) ? 'Enter your password' : null,
                    ),
                    const SizedBox(height: 10),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () {},
                        child: const Text('Forgot password?'),
                      ),
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: isLoading ? null : _submit,
                        child: isLoading
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                              )
                            : const Text('Sign In'),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),
              // Demo hint
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.roseTint,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline, size: 16, color: AppColors.primary),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Demo credentials are pre-filled — just pick a role and sign in.',
                        style: AppTextStyles.caption.copyWith(color: AppColors.primaryDark),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text("Don't have an account? ", style: AppTextStyles.body.copyWith(color: AppColors.textSecondary)),
                  TextButton(
                    onPressed: () => Navigator.pushNamed(context, '/register'),
                    child: const Text('Sign Up'),
                  ),
                ],
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}

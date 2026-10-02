import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'providers/auth_provider.dart';
import 'providers/booking_provider.dart';
import 'providers/employee_provider.dart';
import 'providers/service_provider.dart';
import 'theme/app_theme.dart';

import 'screens/auth/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/shells/client_shell.dart';
import 'screens/shells/employee_shell.dart';
import 'screens/shells/admin_shell.dart';
import 'screens/client/booking_flow_screen.dart';
import 'screens/client/employee_list_screen.dart';
import 'screens/client/service_list_screen.dart';
import 'screens/client/my_bookings_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const NabilaSalonApp());
}

class NabilaSalonApp extends StatelessWidget {
  const NabilaSalonApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ServiceProvider()),
        ChangeNotifierProvider(create: (_) => EmployeeProvider()),
        ChangeNotifierProvider(create: (_) => BookingProvider()),
      ],
      child: MaterialApp(
        title: 'Nabila Salon',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        initialRoute: '/',
        routes: {
          '/': (_) => const SplashScreen(),
          '/login': (_) => const LoginScreen(),
          '/register': (_) => const RegisterScreen(),
          '/client': (_) => const ClientShell(),
          '/employee': (_) => const EmployeeShell(),
          '/admin': (_) => const AdminShell(),
          '/client/services': (_) => const ServiceListScreen(),
          '/client/bookings': (_) => const MyBookingsScreen(),
          '/client/employees': (_) => const EmployeeListScreen(),
        },
        onGenerateRoute: (settings) {
          if (settings.name == '/client/booking') {
            return MaterialPageRoute(
              builder: (_) => const BookingFlowScreen(),
              settings: settings,
            );
          }
          return null;
        },
      ),
    );
  }
}

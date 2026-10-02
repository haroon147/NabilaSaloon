import 'package:flutter_test/flutter_test.dart';
import 'package:nabila_salon/main.dart';

void main() {
  testWidgets('App launches smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const NabilaSalonApp());
    await tester.pump();
    // Splash screen renders without crashing
    expect(find.byType(NabilaSalonApp), findsOneWidget);
  });
}

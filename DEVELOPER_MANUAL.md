# Nabila Salon — Developer Manual

> **Version:** 1.0 · **Date:** 2026-07-02  
> This manual covers the entire Nabila Salon booking platform — both the Flutter mobile app (Phase 1, complete) and the React/Vite web frontend (Phase 2, complete). Phase 3 (Node/Express/MongoDB backend) is pending and described in the architecture section.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Color Palette & Design System](#3-color-palette--design-system)
4. [Flutter Mobile App (Phase 1)](#4-flutter-mobile-app-phase-1)
   - 4.1 [Project Structure](#41-project-structure)
   - 4.2 [State Management — Provider](#42-state-management--provider)
   - 4.3 [Navigation Architecture](#43-navigation-architecture)
   - 4.4 [Mock API Service Pattern](#44-mock-api-service-pattern)
   - 4.5 [Screen: Splash Screen](#45-screen-splash-screen)
   - 4.6 [Screen: Login / Register](#46-screen-login--register)
   - 4.7 [Screen: Client Home](#47-screen-client-home)
   - 4.8 [Screen: Service List](#48-screen-service-list)
   - 4.9 [Screen: Booking Flow](#49-screen-booking-flow)
   - 4.10 [Screen: My Bookings](#410-screen-my-bookings)
   - 4.11 [Screen: Employee Schedule](#411-screen-employee-schedule)
   - 4.12 [Screen: Employee Availability](#412-screen-employee-availability)
   - 4.13 [Screen: Admin Dashboard](#413-screen-admin-dashboard)
   - 4.14 [Screen: Admin Bookings](#414-screen-admin-bookings)
   - 4.15 [Screen: Admin Team](#415-screen-admin-team)
   - 4.16 [Screen: Profile (Shared)](#416-screen-profile-shared)
   - 4.17 [Widget: ServiceCard](#417-widget-servicecard)
   - 4.18 [Widget: BookingCard](#418-widget-bookingcard)
   - 4.19 [Widget: EmployeeCard](#419-widget-employeecard)
   - 4.20 [Layout Overflow Fixes](#420-layout-overflow-fixes)
5. [React Web App (Phase 2)](#5-react-web-app-phase-2)
   - 5.1 [Project Structure](#51-project-structure)
   - 5.2 [Type System](#52-type-system)
   - 5.3 [Mock Data](#53-mock-data)
   - 5.4 [Mock API Service](#54-mock-api-service)
   - 5.5 [Context: AuthContext](#55-context-authcontext)
   - 5.6 [Context: AppContext](#56-context-appcontext)
   - 5.7 [Routing (App.tsx)](#57-routing-apptsx)
   - 5.8 [Layouts](#58-layouts)
   - 5.9 [Auth Pages](#59-auth-pages)
   - 5.10 [Shared Components](#510-shared-components)
   - 5.11 [Client Pages](#511-client-pages)
   - 5.12 [Employee Pages](#512-employee-pages)
   - 5.13 [Admin Pages](#513-admin-pages)
   - 5.14 [Tailwind Design System](#514-tailwind-design-system)
6. [Phase 3 — Backend (Pending)](#6-phase-3--backend-pending)
7. [Running the Projects](#7-running-the-projects)
8. [Key Engineering Decisions](#8-key-engineering-decisions)

---

## 1. Project Overview

Nabila Salon is a full-stack beauty salon booking platform targeting Pakistan's premium salon market. It has three user roles:

| Role     | Can do |
|----------|--------|
| **Client**   | Browse services, book appointments, view & cancel bookings, manage profile |
| **Employee** | View their daily schedule, see their availability, manage profile |
| **Admin**    | View all bookings, analytics dashboard, manage team overview |

**Three-phase build plan:**

- **Phase 1** — Flutter mobile app (iOS + Android). Uses mock/local data only. ✅ Complete.
- **Phase 2** — React/Vite web frontend. Same mock data shapes as Phase 1. ✅ Complete.
- **Phase 3** — Node.js/Express/MongoDB REST backend. Both frontends will swap their mock API file for real HTTP calls, no other changes needed. ⏳ Pending.

---

## 2. Architecture

```
SaloonApp/
├── mobile/          ← Flutter app (Phase 1)
│   └── lib/
│       ├── main.dart
│       ├── app.dart
│       ├── models/
│       ├── services/
│       ├── providers/
│       ├── screens/
│       │   ├── auth/
│       │   ├── client/
│       │   ├── employee/
│       │   ├── admin/
│       │   └── shared/
│       ├── widgets/
│       └── theme/
├── web/             ← React/Vite app (Phase 2)
│   └── src/
│       ├── types/
│       ├── data/
│       ├── services/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       │   ├── auth/
│       │   ├── client/
│       │   ├── employee/
│       │   ├── admin/
│       │   └── shared/
│       └── components/
└── backend/         ← Node/Express/MongoDB (Phase 3, pending)
```

### Mock API Contract (shared between Phase 1 & 2)

Both frontends implement the same logical API contract:

```
login(email, password, role)           → User
register(name, email, phone, role)     → User
getServices()                          → Service[]
getEmployees()                         → Employee[]
getBookingsForClient(clientId)         → Booking[]
getBookingsForEmployee(employeeId)     → Booking[]
getAllBookings()                        → Booking[]
getAvailableSlots(employeeId, date)    → TimeSlot[]
createBooking(params)                  → Booking
cancelBooking(bookingId)               → void
getAdminStats()                        → AdminStats
```

In Phase 3, you replace `mobile/lib/services/mock_api_service.dart` and `web/src/services/mockApi.ts` with real HTTP clients using the same signatures. All UI code stays unchanged.

---

## 3. Color Palette & Design System

Both apps share the same Nabila Salon brand palette:

| Token        | Hex       | Use |
|-------------|-----------|-----|
| `primary`    | `#C9967F` | Buttons, active states, accent |
| `primary-lt` | `#E8C4B0` | Hover backgrounds, chip tints |
| `primary-dk` | `#8B5E52` | Dark primary text, gradients |
| `rose`       | `#F5EBE6` | Card backgrounds, rose tint areas |
| `bg`         | `#FDF8F6` | Page background |
| `surface`    | `#FFFFFF` | Cards, inputs, sidebars |
| `tx1`        | `#2D2D2D` | Primary text |
| `tx2`        | `#757575` | Secondary text |
| `hint`       | `#B0ACA8` | Placeholder, disabled, icon |
| `border`     | `#E8E0DB` | Dividers, input borders |
| `success`    | `#388E3C` | Completed status |
| `warning`    | `#F57C00` | Pending status |
| `danger`     | `#D32F2F` | Cancelled, error |

**Card shadow recipe:** `0 4px 20px -3px rgba(201,150,127,0.15), 0 2px 6px rgba(0,0,0,0.04)` — warm rose-tinted shadow matching the palette.

**Gradient pattern:** Primary-to-roseTint gradients used for card headers and hero sections, giving a warm, premium look.

**Typography:** Inter (400/500/600/700) on both platforms.

---

## 4. Flutter Mobile App (Phase 1)

### 4.1 Project Structure

```
mobile/lib/
├── main.dart                    ← entry: ProviderScope + MaterialApp
├── app.dart                     ← router (GoRouter or Navigator)
├── theme/
│   ├── app_colors.dart          ← color constants matching the palette
│   └── app_text_styles.dart     ← TextStyle definitions
├── models/
│   ├── user.dart
│   ├── service.dart
│   ├── employee.dart
│   ├── booking.dart
│   └── time_slot.dart
├── services/
│   └── mock_api_service.dart    ← all mock data + async methods
├── providers/
│   ├── auth_provider.dart       ← ChangeNotifier: user, login, logout
│   └── booking_provider.dart    ← ChangeNotifier: booking flow state
├── screens/
│   ├── auth/
│   │   ├── splash_screen.dart
│   │   ├── login_screen.dart
│   │   └── register_screen.dart
│   ├── client/
│   │   ├── client_shell.dart    ← NavigationBar + IndexedStack
│   │   ├── home_screen.dart
│   │   ├── service_list_screen.dart
│   │   ├── booking_flow_screen.dart
│   │   └── my_bookings_screen.dart
│   ├── employee/
│   │   ├── employee_shell.dart
│   │   ├── employee_schedule_screen.dart
│   │   └── employee_availability_screen.dart
│   ├── admin/
│   │   ├── admin_shell.dart
│   │   ├── admin_dashboard_screen.dart
│   │   ├── admin_bookings_screen.dart
│   │   └── admin_team_screen.dart
│   └── shared/
│       └── profile_screen.dart
└── widgets/
    ├── service_card.dart
    ├── booking_card.dart
    └── employee_card.dart
```

### 4.2 State Management — Provider

The app uses the `provider` package (`^6.1.x`). Two ChangeNotifiers cover all mutable state:

#### AuthProvider (`providers/auth_provider.dart`)

```dart
class AuthProvider extends ChangeNotifier {
  User? _user;
  bool _loading = false;
  String? _error;

  User? get user => _user;
  bool get loading => _loading;
  String? get error => _error;

  Future<bool> login(String email, String password, UserRole role) async { ... }
  Future<bool> register(String name, String email, String phone, UserRole role) async { ... }
  void logout() { _user = null; notifyListeners(); }
  void clearError() { _error = null; notifyListeners(); }
}
```

**Usage in UI:** `context.watch<AuthProvider>()` or `context.read<AuthProvider>()`. The `watch` rebuilds the widget tree on changes; `read` is used inside callbacks that should not trigger rebuilds.

#### BookingProvider (`providers/booking_provider.dart`)

```dart
class BookingProvider extends ChangeNotifier {
  Service? selectedService;
  Employee? selectedEmployee;
  String? selectedDate;
  TimeSlot? selectedSlot;
  List<TimeSlot> availableSlots = [];
  List<Booking> bookings = [];
  bool loadingSlots = false;
  bool bookingLoading = false;

  void selectService(Service? s) { selectedService = s; notifyListeners(); }
  void selectEmployee(Employee? e) { ... }
  Future<void> selectDate(String date) async { ... /* fetches slots */ }
  Future<Booking?> confirmBooking(String clientId, String clientName) async { ... }
  void clearSelection() { ... }
}
```

Both providers are registered at the root of the widget tree in `main.dart` using `MultiProvider`.

### 4.3 Navigation Architecture

**Role-based shell pattern:** After login, the user lands on one of three role-specific shells based on their role. Each shell uses a `NavigationBar` at the bottom and an `IndexedStack` body.

```dart
// ClientShell example
class ClientShell extends StatefulWidget { ... }
class _ClientShellState extends State<ClientShell> {
  int _index = 0;

  final _pages = const [
    HomeScreen(),
    ServiceListScreen(),
    MyBookingsScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) => Scaffold(
    body: IndexedStack(index: _index, children: _pages),
    bottomNavigationBar: NavigationBar(
      selectedIndex: _index,
      onDestinationSelected: (i) => setState(() => _index = i),
      destinations: [ ... ],
    ),
  );
}
```

**Why `IndexedStack` instead of Navigator.push for tabs?**  
`IndexedStack` keeps all tab pages alive simultaneously — scroll position, loaded data, and local state are preserved when switching tabs. This avoids expensive re-fetches on every tab switch.

**Auth routing:** `SplashScreen` reads `AuthProvider.user`. If `null`, it navigates to `/login`. If set, it navigates to the role-appropriate shell (`/client`, `/employee`, or `/admin`).

### 4.4 Mock API Service Pattern

`MockApiService` (`services/mock_api_service.dart`) holds all seed data as `static const` lists and simulates network latency with `Future.delayed`:

```dart
class MockApiService {
  static Future<T> _delay<T>(T value, [int ms = 500]) =>
      Future.delayed(Duration(milliseconds: ms), () => value);

  static Future<User> login(String email, String password, UserRole role) async {
    await Future.delayed(const Duration(milliseconds: 600));
    final found = mockUsers.firstWhere((u) => u.role == role,
        orElse: () => throw Exception('Not found'));
    return found.copyWith(email: email);
  }

  static Future<List<Service>> getServices() => _delay([...kServices]);
  // etc.
}
```

**The swap contract:** When Phase 3 backend is ready, only `mock_api_service.dart` changes. Every `static Future<X>` becomes an HTTP call via `http` or `dio`. The providers and screens stay unchanged.

**Available slot generation logic:**
1. Find the employee's `AvailabilitySlot` for the requested day-of-week.
2. Generate 1-hour slots from `start` to `end`.
3. For each slot, check if any existing (non-cancelled) booking has the same `employeeId`, `date`, and `startTime`.
4. Mark `isAvailable: false` for taken slots.

### 4.5 Screen: Splash Screen

**File:** `screens/auth/splash_screen.dart`  
**Purpose:** Brief loading screen that resolves navigation target.

**Logic:**
```dart
@override
void initState() {
  super.initState();
  _navigate();
}

Future<void> _navigate() async {
  await Future.delayed(const Duration(seconds: 2));
  final user = context.read<AuthProvider>().user;
  if (!mounted) return;
  if (user == null) {
    Navigator.pushReplacementNamed(context, '/login');
  } else {
    Navigator.pushReplacementNamed(context, '/${user.role.name}');
  }
}
```

**Design:** Gradient background (primary → primaryDark) with the salon logo (sparkle icon) and "Nabila Salon" text centered. A subtle fade-in animation using `AnimationController`.

**Known fix applied:** Originally used `UserRole.name` in a dynamically-typed context causing `NoSuchMethodError`. Fixed by reading `user.role` as the enum type and switching on it directly.

### 4.6 Screen: Login / Register

**Files:** `screens/auth/login_screen.dart`, `screens/auth/register_screen.dart`

**Login screen layout:**
1. Logo header (gradient circle with sparkle icon)
2. Role selector — three pills: Client / Staff / Admin
3. Email text field
4. Password text field (with eye toggle)
5. "Sign In" elevated button
6. "Demo credentials" text button (fills email/password for the selected role without requiring real credentials)
7. "Don't have an account? Sign up" link

**Role selector technique:**
```dart
Row(children: UserRole.values.map((r) => Expanded(
  child: GestureDetector(
    onTap: () => setState(() => _selectedRole = r),
    child: AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      decoration: BoxDecoration(
        color: _selectedRole == r ? Colors.white : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
        boxShadow: _selectedRole == r ? [BoxShadow(...)] : null,
      ),
      child: Text(r.label),
    ),
  ),
)).toList())
```

**Register screen** collects: full name, email, phone, role (Client or Staff only — admin accounts are not self-registered). On success, `AuthProvider.register()` is called and the user is navigated to their role shell.

**Validation:** Flutter `Form` + `TextFormField` with `validator` callbacks. `GlobalKey<FormState>` tracks form state.

### 4.7 Screen: Client Home

**File:** `screens/client/home_screen.dart`

**Sections:**
1. **Hero banner** — Gradient card with personalized greeting ("Welcome back, {name}"), subtitle, and "Book Now" button. Decorative white circles at corners for depth.
2. **Quick stats row** — 3 stat chips: Services count, Expert count, Average service time.
3. **Category grid** — 2×2 grid (Hair, Nails, Skin, Packages), each with an icon circle and label. Tapping navigates to the service list filtered by that category.
4. **Featured services** — First 4 services displayed as a 2×2 grid of `ServiceCard` widgets with "Book" shortcut.

**`_CategoryTile` overflow fix:** The `Text(name)` inside a `Row` was overflowing. Fixed by wrapping in `Flexible` and adding `mainAxisSize: MainAxisSize.min` to the containing `Row`.

**Data loading:** `_fetchData()` calls `MockApiService.getServices()` in `initState`. A `setState` controls a `_loading` bool for skeleton shimmer display.

### 4.8 Screen: Service List

**File:** `screens/client/service_list_screen.dart`

**Layout:**
1. Search bar (filters by service name in real-time as user types)
2. Category filter chips (All / Hair / Nails / Skin / Packages) — horizontal scroll row
3. `GridView.builder` with `childAspectRatio: 0.62` — shows `ServiceCard` for each matching service

**Filter logic:**
```dart
List<Service> get _filtered => _services.where((s) {
  final matchCat = _category == 'All' || s.category == _category;
  final matchQ = s.name.toLowerCase().contains(_query.toLowerCase());
  return matchCat && matchQ;
}).toList();
```

**Grid aspect ratio:** Set to `0.62` (was `0.72`, caused overflow). At typical phone width (~360px), a 2-column grid gives ~153px per card. With `0.62` ratio, each card is ~247px tall, which fits the ServiceCard content (100px header + 147px body content).

**On service tap:** Calls `BookingProvider.selectService(service)` then navigates to the booking flow screen.

### 4.9 Screen: Booking Flow

**File:** `screens/client/booking_flow_screen.dart`

**Multi-step wizard** implemented as a `PageView` (or `IndexedStack`) with 4 steps:

| Step | Content |
|------|---------|
| 0 — Service | Grid of service cards; tap to select |
| 1 — Stylist | List of employee cards; tap to select |
| 2 — Date & Time | Horizontal date picker + time slot grid |
| 3 — Confirm | Summary card + confirm button |

**Step progress indicator:** A custom `_StepIndicator` widget draws numbered circles connected by lines. Completed steps show a check icon; active step has a ring highlight.

**Date picker:** `ListView.builder` scrolling horizontally, showing the next 14 days. Each tile shows weekday abbreviation, day number, and month abbreviation.

**Time slot grid:** 4-column `GridView` with `ShrinkWrap`. Booked slots are shown greyed out and struckthrough. Available slots highlight in primary color when selected.

**Slot fetch:** When date changes, calls `BookingProvider.selectDate(date)` which internally calls `MockApiService.getAvailableSlots(employeeId, date)`.

**Confirmation flow:**
1. User taps "Confirm Booking"
2. `BookingProvider.confirmBooking(clientId, clientName)` called
3. Shows loading state on button
4. On success: `clearSelection()` + navigate to success screen
5. Success screen shows a checkmark, booking summary, "View My Bookings" + "Book Another" buttons

**`_SummaryCard._row` overflow fix:** Original `Spacer()` + bare `Text(value)` caused overflow on narrow phones. Fixed with `Expanded(child: Text(value, textAlign: TextAlign.end, maxLines: 1, overflow: TextOverflow.ellipsis))`.

### 4.10 Screen: My Bookings

**File:** `screens/client/my_bookings_screen.dart`

**Layout:**
1. Tab bar: All / Confirmed / Pending / Done / Cancelled
2. Sorted list of `BookingCard` widgets (newest first)
3. Empty state with "Book a Service" CTA

**Cancel flow:** `BookingCard` shows a cancel button for `pending` and `confirmed` bookings. Tapping shows `showDialog` confirmation. On confirm, calls `BookingProvider.cancelBooking(id)` which updates the local list optimistically.

**Sort order:** Bookings sorted descending by `date` string (ISO format `YYYY-MM-DD` sorts lexicographically correctly).

### 4.11 Screen: Employee Schedule

**File:** `screens/employee/employee_schedule_screen.dart`

**Layout:**
1. Week strip — 7 day tiles (Mon–Sun). A dot under a day indicates there are bookings.
2. Selected day's bookings as a sorted list of `BookingCard` (with client name visible)

**Week strip date calculation:**
```dart
DateTime get _monday {
  final today = DateTime.now();
  final weekday = today.weekday; // 1=Mon, 7=Sun
  return today.subtract(Duration(days: weekday - 1));
}
List<DateTime> get _weekDates =>
    List.generate(7, (i) => _monday.add(Duration(days: i)));
```

**Day header row overflow fix:** Original `Text(dayLabel) + Spacer() + Text(dateStr)` caused overflow. Fixed by using `Expanded(child: Text(..., maxLines: 1, overflow: ellipsis))` + `SizedBox(width: 8)`.

**`_EmptyDay` overflow fix:** A `Column` inside a flex container without `Expanded` overflowed. Wrapped in `Expanded`.

### 4.12 Screen: Employee Availability

**File:** `screens/employee/employee_availability_screen.dart`

Shows the employee's weekly schedule (days and hours) and their specialties list. Read-only in Phase 1 (editing requires backend). A "Save Changes" button is present but shows a toast/snackbar ("Changes saved!") without persistence in Phase 1.

### 4.13 Screen: Admin Dashboard

**File:** `screens/admin/admin_dashboard_screen.dart`

**Stat grid** — 2-column `GridView` with `childAspectRatio: 1.4`:

| Stat | Icon |
|------|------|
| Total Bookings | BookOpen |
| Today's Appointments | Calendar |
| Month Revenue | TrendingUp |
| Active Clients | People |
| Completion Rate | CheckCircle |

**`_StatCard` overflow fix:** Value text was set to `AppTextStyles.heading1` (22sp). Reduced to `AppTextStyles.heading2` (18sp). Grid ratio reduced from `1.6` → `1.4` to give cards more vertical room.

**Data:** Fetched from `MockApiService.getAdminStats()` which returns `AdminStats` containing all five values.

### 4.14 Screen: Admin Bookings

**File:** `screens/admin/admin_bookings_screen.dart`

Same as My Bookings but shows all bookings from all clients with client names visible. Tabs: All / Confirmed / Pending / Done / Cancelled. Search bar filters by client name, service, or stylist. Admin can cancel any non-completed booking.

### 4.15 Screen: Admin Team

**File:** `screens/admin/admin_team_screen.dart`

List of employee cards showing:
- Gradient avatar with initial
- Name and rating
- Specialties chips
- Stats row: booking count, days/week, revenue earned

Bookings and employees are cross-referenced to compute per-employee stats entirely client-side.

### 4.16 Screen: Profile (Shared)

**File:** `screens/shared/profile_screen.dart`

Used by all three roles (passed into each shell's page list). Shows:
- Large gradient avatar with initial
- Name + role badge
- Email and phone in info rows
- Role-specific quick links (Client gets "View Bookings", "Browse Services")
- Sign Out button

**`_InfoRow` overflow fix:** `Spacer()` + `Text(value)` pattern caused overflow for long email addresses. Fixed with `Expanded(child: Text(value, textAlign: TextAlign.end, overflow: TextOverflow.ellipsis))`.

### 4.17 Widget: ServiceCard

**File:** `widgets/service_card.dart`

**Modern card design (complete rewrite from flat style):**

```
┌─────────────────────────────┐
│   Gradient header (100px)   │
│  ┌──────────────────────┐   │
│  │  Category label (top-left, pill) │
│  │  Duration badge (top-right, pill)│
│  │  White circle + category icon    │
│  └──────────────────────┘   │
├─────────────────────────────┤
│  Service name (semibold)    │
│  Description (2-line clamp) │
│  PKR price   [Book →]       │
└─────────────────────────────┘
```

**Key techniques:**
- `Stack` inside the gradient container for overlaid badges
- `BoxDecoration` with `LinearGradient` from `AppColors.primary.withValues(alpha:0.22)` to `AppColors.roseTint`
- White circle icon uses `BoxDecoration(shape: BoxShape.circle)` with a `BoxShadow` for the "floating" effect
- Book button: 28×28 filled primary circle with a `Icons.arrow_forward_rounded` icon
- Two-layer shadow on the outer container: warm rose shadow + subtle black shadow

**Category icon mapping:**
```dart
IconData _categoryIcon(String cat) => switch (cat) {
  'Hair'     => Icons.content_cut_rounded,
  'Nails'    => Icons.back_hand_rounded,
  'Skin'     => Icons.face_retouching_natural,
  'Packages' => Icons.card_giftcard_rounded,
  _          => Icons.spa_rounded,
};
```

### 4.18 Widget: BookingCard

**File:** `widgets/booking_card.dart`

**Design technique — left accent bar:**

To create a colored left border with rounded overall corners (impossible with `BoxDecoration.border`), uses:

```dart
ClipRRect(
  borderRadius: BorderRadius.circular(18),
  child: IntrinsicHeight(
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(width: 4, color: statusColor),  // ← accent bar
        Expanded(child: Container(                 // ← content
          color: AppColors.surface,
          padding: EdgeInsets.all(14),
          child: ...
        )),
      ],
    ),
  ),
)
```

`IntrinsicHeight` makes both children (the bar and the content) stretch to the same height. `ClipRRect` clips the whole row to rounded corners.

**Status pills:** `"Completed"` shown as `"Done"` for brevity. Status colors:
- Pending → warning orange
- Confirmed → primary rose
- Done/Completed → success green
- Cancelled → danger red

### 4.19 Widget: EmployeeCard

**File:** `widgets/employee_card.dart`

**Design features:**
- **Gradient avatar** with primary→primaryDark gradient and white initial letter
- **Selected state**: filled primary circle with a checkmark overlaid on the avatar (bottom-right)
- **Rating display**: `"4.8 · 24 reviews"` format (was `"4.8 (24)"`)
- **Specialty chips**: pill-shaped containers with 10% primary tint background
- **Two-layer shadow on avatar**: shadow opacity increases when selected (0.25 → 0.40 alpha)

### 4.20 Layout Overflow Fixes

All overflow issues were caused by widgets assuming unlimited horizontal space inside constrained parents. The systematic fixes:

| Location | Problem | Fix |
|----------|---------|-----|
| `service_list_screen` | Grid cells too short | `childAspectRatio: 0.62` |
| `service_card` (old) | Book button overflowed 125px | Replaced with chevron icon |
| `booking_flow_screen._SummaryCard` | `Spacer() + Text` overflow | `Expanded(Text(..., textAlign: end))` |
| `admin_dashboard_screen` | Stat value text too large | Heading2 (18sp) + ratio 1.4 |
| `profile_screen._InfoRow` | Long email overflow | `Expanded(Text(..., overflow: ellipsis))` |
| `employee_schedule_screen` | Day header `Spacer` overflow | `Expanded` + `SizedBox(8)` separator |
| `employee_schedule_screen._EmptyDay` | Column in flex without Expanded | Wrapped in `Expanded` |
| `home_screen._CategoryTile` | Text in Row overflow | `Flexible` wrapper, `mainAxisSize: min` |

**General rule:** Never put a raw `Text` next to a `Spacer` in a `Row` inside a bounded container. Use `Expanded` with `textAlign: end` instead.

---

## 5. React Web App (Phase 2)

**Tech stack:** React 18, TypeScript, Vite 8, React Router v6, Tailwind CSS v3, Lucide React icons.

### 5.1 Project Structure

```
web/src/
├── types/index.ts          ← all TypeScript interfaces
├── data/mockData.ts        ← seed data arrays
├── services/mockApi.ts     ← async mock methods
├── context/
│   ├── AuthContext.tsx     ← user authentication state
│   └── AppContext.tsx      ← services, employees, bookings, booking flow
├── layouts/
│   ├── ClientLayout.tsx    ← sidebar + bottom nav for clients
│   ├── EmployeeLayout.tsx  ← sidebar + bottom nav for staff
│   └── AdminLayout.tsx     ← sidebar + bottom nav for admins
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── client/
│   │   ├── HomePage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── BookingFlowPage.tsx
│   │   └── MyBookingsPage.tsx
│   ├── employee/
│   │   ├── SchedulePage.tsx
│   │   └── AvailabilityPage.tsx
│   ├── admin/
│   │   ├── DashboardPage.tsx
│   │   ├── BookingsPage.tsx
│   │   └── TeamPage.tsx
│   └── shared/
│       └── ProfilePage.tsx
└── components/
    ├── ServiceCard.tsx
    ├── BookingCard.tsx
    └── EmployeeCard.tsx
```

### 5.2 Type System

**File:** `src/types/index.ts`

All data shapes are TypeScript interfaces matching the Flutter models exactly:

```typescript
type UserRole = 'client' | 'employee' | 'admin';
type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface User { id, name, email, phone, role, profileImage? }
interface AvailabilitySlot { day, start, end }          // e.g. "Monday", "09:00", "18:00"
interface Employee { id, name, photo?, specialties[], rating, reviewCount, availability[] }
interface Service { id, name, description, category, durationMinutes, price, image? }
interface Booking { id, clientId, clientName?, employeeId, employeeName?, serviceId, serviceName?, date, startTime, endTime, status, price }
interface TimeSlot { startTime, endTime, isAvailable }
interface Review { id, bookingId, employeeId, rating, comment }
interface AdminStats { totalBookings, todayBookings, monthRevenue, activeClients, completionRate }
```

### 5.3 Mock Data

**File:** `src/data/mockData.ts`

Exports static arrays:

- **`SERVICES`** — 10 services across 4 categories (Hair, Nails, Skin, Packages). Prices in PKR. Durations from 20 to 300 minutes.
- **`EMPLOYEES`** — 5 staff members with specialties, ratings, and weekly availability schedules.
- **`MOCK_USERS`** — 3 demo accounts: `sara@demo.com` (client), `zara@nabilasalon.com` (employee), `admin@nabilasalon.com` (admin).
- **`SAMPLE_BOOKINGS`** — 7 bookings across 3 clients, various statuses.
- **`REVIEWS`** — 2 sample reviews.
- **`ADMIN_STATS`** — snapshot stats for the admin dashboard.

### 5.4 Mock API Service

**File:** `src/services/mockApi.ts`

```typescript
const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));
let bookings = [...SAMPLE_BOOKINGS];  // mutable copy
let nextId = bookings.length + 1;

export async function login(email, password, role): Promise<User>
export async function register(params): Promise<User>
export async function getServices(): Promise<Service[]>
export async function getEmployees(): Promise<Employee[]>
export async function getBookingsForClient(clientId): Promise<Booking[]>
export async function getBookingsForEmployee(employeeId): Promise<Booking[]>
export async function getAllBookings(): Promise<Booking[]>
export async function getAvailableSlots(employeeId, date): Promise<TimeSlot[]>
export async function createBooking(params): Promise<Booking>
export async function cancelBooking(bookingId): Promise<void>
export async function getAdminStats(): Promise<AdminStats>
```

**`getAvailableSlots` algorithm:** Identical logic to Flutter:
1. Find employee by ID
2. Parse day name from the date string using `toLocaleDateString('en-US', { weekday: 'long' })`
3. Find availability entry for that day
4. Generate 60-minute slots from start to end using hour arithmetic
5. Cross-check each slot against existing bookings — mark taken slots as `isAvailable: false`

**Mutation pattern:** `bookings` is a module-level mutable array. `createBooking` pushes to it; `cancelBooking` maps over it updating status. This simulates a database within the browser session. Each page reload resets to `SAMPLE_BOOKINGS`.

### 5.5 Context: AuthContext

**File:** `src/context/AuthContext.tsx`

```typescript
interface AuthCtx {
  user: User | null;
  loading: boolean;
  error: string | null;
  login(email, password, role): Promise<boolean>;
  register(params): Promise<boolean>;
  logout(): void;
  clearError(): void;
}
```

**Pattern:** Standard React Context + `useState` inside a Provider component. `useAuth()` hook wraps `useContext(Ctx)`.

**Login flow:**
1. Set `loading = true`, `error = null`
2. Call `api.login(email, password, role)`
3. On success: `setUser(result)`, return `true`
4. On error: `setError('Login failed…')`, return `false`
5. Finally: `setLoading(false)`

The caller (LoginPage) checks the boolean return to navigate on success.

**No persistence:** User state resets on page reload (no localStorage). Phase 3 will add JWT storage.

### 5.6 Context: AppContext

**File:** `src/context/AppContext.tsx`

The larger context managing:
- Loaded data: `services[]`, `employees[]`, `bookings[]`
- Loading flags for each
- Booking flow wizard state: `selectedService`, `selectedEmployee`, `selectedDate`, `selectedSlot`, `availableSlots`
- Loading flags for slots and booking submission

**Key design decisions:**

**Lazy loading with dedup:** `loadServices` and `loadEmployees` are `useCallback`-memoized and check if data already exists before fetching:
```typescript
const loadServices = useCallback(async () => {
  if (services.length) return;  // already loaded
  setLoadingServices(true);
  try { setServices(await api.getServices()); }
  finally { setLoadingServices(false); }
}, [services.length]);
```

**`selectDate` triggers slot fetch:** When the user picks a date in the booking flow, `selectDate(date)` both updates the date state AND fetches available slots for the currently selected employee. This prevents a separate "fetch slots" button.

**Optimistic cancel:** `cancelBooking` immediately updates the local `bookings` array to `'cancelled'` status before the API call returns, so the UI feels instant.

**`confirmBooking` return contract:** Returns the created `Booking` object on success, or `null` on failure. The calling page checks this to decide whether to show the success screen.

### 5.7 Routing (App.tsx)

**File:** `src/App.tsx`

Uses React Router v6 nested routes.

**`RequireAuth` guard component:**
```tsx
function RequireAuth({ children, role }: { children: React.ReactElement; role?: string }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return children;
}
```

**Route structure:**
```
/login                    → LoginPage (redirects to role home if logged in)
/register                 → RegisterPage

/client                   → RequireAuth(role=client) → ClientLayout
  /client                 → HomePage
  /client/services        → ServicesPage
  /client/book            → BookingFlowPage
  /client/bookings        → MyBookingsPage
  /client/profile         → ProfilePage

/employee                 → RequireAuth(role=employee) → EmployeeLayout
  /employee               → SchedulePage
  /employee/availability  → AvailabilityPage
  /employee/profile       → ProfilePage

/admin                    → RequireAuth(role=admin) → AdminLayout
  /admin                  → DashboardPage
  /admin/bookings         → BookingsPage
  /admin/team             → TeamPage
  /admin/profile          → ProfilePage

/                         → Redirects to role home or /login
*                         → Redirects to /
```

Layout routes use `<Outlet />` — React Router renders the matched child route into the Outlet.

### 5.8 Layouts

All three layouts share the same structure:

```
┌──────────────────────────────────────────────┐
│           Sidebar (hidden on mobile)          │
│  ┌─────────┐                                  │
│  │ Logo    │  Main area                       │
│  ├─────────┤  ┌────────────────────────────┐  │
│  │ User    │  │  Mobile topbar (md:hidden) │  │
│  ├─────────┤  ├────────────────────────────┤  │
│  │ Nav     │  │                            │  │
│  │ links   │  │   <Outlet /> (page)        │  │
│  ├─────────┤  │                            │  │
│  │ Logout  │  ├────────────────────────────┤  │
│  └─────────┘  │  Mobile bottom nav         │  │
│               │  (md:hidden)               │  │
│               └────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

**Responsive breakpoint:** `md:` (768px) — below this, the sidebar hides and a top bar + bottom nav appear.

**Active link styling:** `NavLink` from React Router calls its `className` prop with `{ isActive }` boolean. This applies the `.active` CSS class which gives the primary color + rose background.

**Gradient avatar:** All layouts show the user's initial in a gradient avatar (primary→primary-dk). This matches the Flutter gradient avatar pattern.

### 5.9 Auth Pages

#### LoginPage

**Demo credentials system:** Three hardcoded demo credentials (one per role). A "Fill demo credentials" link button populates the form without requiring the user to type, allowing quick testing of all three roles.

**Role tab selector:** Three segmented buttons in a rose background container. Selected role gets a white pill with shadow — matches the Flutter role selector visually.

#### RegisterPage

Only "Client" and "Staff" roles are available in registration (admins are provisioned manually). Uses the same segmented button pattern.

### 5.10 Shared Components

#### ServiceCard

**Gradient header technique:**
```tsx
<div className={`h-24 bg-gradient-to-br ${gradient} relative flex items-center justify-center`}>
  <div className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center">
    <Icon size={22} className="text-primary" />
  </div>
  {/* badges as absolute positioned elements */}
</div>
```

Category-based gradient: Hair gets `from-primary/20 to-rose`, Nails gets `from-pink-200/40 to-rose`, etc.

**`compact` prop:** When `compact={true}`, the description is hidden. Used in the Home page grid where space is limited. Full description shows on the Services page.

#### BookingCard

**Left accent bar technique:**
```tsx
<div className="overflow-hidden rounded-2xl shadow-card bg-surface" style={{ display: 'flex' }}>
  <div className={`w-1 flex-shrink-0 ${cfg.barColor}`} />
  <div className="flex-1 p-4">...</div>
</div>
```

The `overflow-hidden` + `rounded-2xl` on the outer container clips both the bar and the content to the same rounded corners — CSS equivalent of Flutter's `ClipRRect`.

**`showClient` prop:** When `true`, shows the client's name under the service name. Used in admin/employee views. Hidden in client's own booking list (redundant information).

#### EmployeeCard

**Selected state ring:** `ring-2 ring-primary` Tailwind classes applied when selected. Matching the Flutter ring/shadow pattern.

**Gradient avatar:**
```tsx
<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dk flex items-center justify-center shadow-soft">
  <span className="text-white font-bold text-lg">{employee.name[0].toUpperCase()}</span>
</div>
```

### 5.11 Client Pages

#### HomePage

**Hero card:** Full-width gradient banner with the user's name, a decorative white circle overlay (via `absolute` positioning + `translate`), and a "Book Now" button routing to `/client/services`.

**Skeleton loading:** While services load, `[...Array(4)].map(...)` renders 4 `animate-pulse bg-rose` placeholder cards.

**Category navigation:** Clicking a category passes it as a URL query param: `navigate('/client/services?cat=Hair')`. The ServicesPage reads this param on mount to pre-filter the list.

#### ServicesPage

**Search + filter combination:**
```typescript
const filtered = services.filter(s => {
  const matchCat = category === 'All' || s.category === category;
  const matchQ = s.name.toLowerCase().includes(search.toLowerCase());
  return matchCat && matchQ;
});
```

Both filters compose (AND logic) so the user can simultaneously pick a category and search within it.

**Category from URL:** `useSearchParams()` reads the `cat` query param to initialize the `category` state on mount.

#### BookingFlowPage

**4-step wizard implemented with `useState(step)`:**

- Step 0: Service grid (tapping a card calls `selectService(svc)`)
- Step 1: Employee list
- Step 2: Date strip + time slot grid
- Step 3: Summary + confirm

**`canNext()` function:** Guards the Continue button:
```typescript
const canNext = () => {
  if (step === 0) return !!selectedService;
  if (step === 1) return !!selectedEmployee;
  if (step === 2) return !!selectedDate && !!selectedSlot;
  return false;
};
```

**Date strip:** 14 future dates as pill buttons (today+1 through today+14). `selectDate(d)` triggers slot loading in `AppContext`.

**Success screen:** When `confirmed` state is true, renders a full-screen success card with a green checkmark. "Book Another" resets the step back to 0 and clears `confirmed`.

**Pre-populated service:** If a service was selected in the Home or Services page (via `selectService`), step starts at 1 (skipping service selection).

#### MyBookingsPage

Tab filter + `cancelBooking` flow. Sorted descending by date string. Empty state per-tab.

### 5.12 Employee Pages

#### SchedulePage

**Week calculation:**
```typescript
function getWeekDates() {
  const today = new Date();
  const day = today.getDay();             // 0=Sun ... 6=Sat
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}
```

This always returns Monday through Sunday regardless of current day.

**Booking dots:** For each day tile, `bookings.some(b => b.date === iso && b.status !== 'cancelled')` determines whether to show the dot indicator.

**Filtered + sorted:** `dayBookings` is filtered by `selectedDate` and non-cancelled, then sorted by `startTime` ascending.

#### AvailabilityPage

Reads the logged-in user's availability from the `employees` array (matched by `user.id`). Shows each availability slot as a card with a green dot indicator. The "Save Changes" button is a Phase 3 placeholder.

### 5.13 Admin Pages

#### DashboardPage

Fetches `AdminStats` directly from `api.getAdminStats()` in a `useEffect`. Renders five `StatCard` components in a 2-3 column responsive grid. Each stat card has a colored icon square.

#### BookingsPage

Combines the tab filter (like MyBookingsPage) with a text search across `clientName`, `serviceName`, and `employeeName`. Each tab button shows a count badge.

#### TeamPage

Cross-references `employees` with `bookings` (fetched via `loadAllBookings`) to compute:
- Booking count: `bookings.filter(b => b.employeeId === emp.id && b.status !== 'cancelled').length`
- Revenue: same filter, sum of `.price`
- Days/week: `emp.availability.length`

### 5.14 Tailwind Design System

**Configuration file:** `tailwind.config.js` (v3 API, `content` glob, `theme.extend`).

**Custom CSS component classes** in `src/index.css` using `@layer components`:

| Class | Applies |
|-------|---------|
| `.btn-primary` | Filled primary button, rounded-xl, disabled state |
| `.btn-outline` | Bordered button, rose hover |
| `.btn-ghost` | Transparent button, rose hover |
| `.input` | Input field: border, rounded-xl, focus ring primary/30 |
| `.card` | White rounded-2xl with warm card shadow |
| `.sidebar-link` | Flex row link item; `.active` adds rose bg + primary text |
| `.tab-btn` | Pill tab; `.active` adds primary bg + white text |

**Responsive pattern:** All layouts use `hidden md:flex` / `md:hidden` to show sidebar on desktop and bottom nav on mobile. No custom breakpoints — uses Tailwind's default `md: 768px`.

**Shadow system:**
- `shadow-card`: warm rose-tinted resting shadow
- `shadow-card-hover`: stronger version for hover state
- `shadow-soft`: subtle shadow for avatars and floating elements

---

## 6. Phase 3 — Backend (Pending)

**Planned stack:** Node.js, Express.js, MongoDB (Mongoose), JWT authentication.

**The swap:** Replace one file per frontend:

| Frontend | File to replace |
|---------|----------------|
| Flutter | `mobile/lib/services/mock_api_service.dart` |
| React   | `web/src/services/mockApi.ts` |

All method signatures stay identical. The UI components and providers/contexts are completely unchanged.

**Planned API endpoints:**

```
POST /auth/login
POST /auth/register

GET  /services
GET  /employees
GET  /employees/:id/slots?date=YYYY-MM-DD

GET  /bookings?clientId=...
GET  /bookings?employeeId=...
GET  /bookings          (admin only)
POST /bookings
PATCH /bookings/:id/cancel

GET  /admin/stats       (admin only)
```

**MongoDB collections:** `users`, `services`, `employees`, `bookings`, `reviews`.

**Auth:** JWT tokens in `Authorization: Bearer <token>` header. Role stored in the token payload to guard admin-only routes.

---

## 7. Running the Projects

### Flutter App

```bash
cd mobile

# Install dependencies
flutter pub get

# Run on connected device or emulator
flutter run

# Run on specific emulator
flutter emulators --launch Pixel_9_Pro_XL
flutter run -d emulator-5554

# Build APK
flutter build apk --release
```

**Tested on:** Pixel 9 Pro XL emulator (API 36, Android 16). Flutter 3.35.5, Dart 3.9.2.

**Note:** `flutter_secure_storage` was removed because it throws `SecurityException` on x86 emulators. Phase 1 uses no persistent storage.

### React Web App

```bash
cd web

# Install dependencies
npm install

# Run development server
npm run dev
# → opens at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

**Demo login credentials:**

| Role     | Email | Password |
|----------|-------|---------|
| Client   | sara@demo.com | demo |
| Employee | zara@nabilasalon.com | demo |
| Admin    | admin@nabilasalon.com | demo |

*(Or click "Fill demo credentials" on the login page)*

---

## 8. Key Engineering Decisions

### Mock API as a Contracts Layer

Both frontends implement the same logical API contract (same method names, same parameter types, same return shapes). This is the single most important architectural decision — when Phase 3 backend is ready, only the mock implementation file changes. Zero changes to UI code.

### Provider vs. Riverpod (Flutter)

`provider` was chosen over `riverpod` for simplicity. The app has two providers (auth + booking). Riverpod's `ref.watch` / `ref.invalidate` system would add complexity without benefit at this scale.

### IndexedStack for Tab Navigation (Flutter)

Using `IndexedStack` preserves the state of all tab pages simultaneously. The alternative (`Navigator.push` on each tab tap) would reload data and lose scroll position every time the user switches tabs.

### React Context vs. Redux/Zustand (Web)

React Context + `useState` is sufficient for this app scale. Redux adds significant boilerplate; Zustand would be appropriate if the state grows more complex in Phase 3. The current two-context architecture (auth separate from app data) is clean and easy to migrate.

### Tailwind v3 over v4

Tailwind v4 was accidentally installed (Vite 8 scaffold defaults). Downgraded to v3 because:
1. v4 uses a CSS-based config (not `tailwind.config.js`)
2. v4 uses `@tailwindcss/vite` plugin, not the PostCSS plugin
3. v3 works cleanly with the existing config file and `@tailwind` directives

### ClipRRect / overflow:hidden for Left Accent Bars

Both Flutter (`ClipRRect + IntrinsicHeight`) and React (`overflow-hidden rounded-2xl`) use clipping to achieve rounded-corner cards with a colored left bar. The alternative (CSS `border-left`) doesn't respect `border-radius` on the left side, and Flutter's `BoxDecoration.border` doesn't support per-side colors with rounded corners simultaneously.

### No Half-Step Navigation Guards

`canNext()` in the booking flow disables the Continue button if the current step's selection is empty. This is simpler than showing validation error messages. The user's next tap attempt simply does nothing — the button is visually disabled with `opacity-50 cursor-not-allowed`.

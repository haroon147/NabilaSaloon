import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/service_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/service_card.dart';

class ServiceListScreen extends StatefulWidget {
  const ServiceListScreen({super.key});

  @override
  State<ServiceListScreen> createState() => _ServiceListScreenState();
}

class _ServiceListScreenState extends State<ServiceListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ServiceProvider>().loadServices();
    });
  }

  @override
  Widget build(BuildContext context) {
    final sp = context.watch<ServiceProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Services'),
      ),
      body: Column(
        children: [
          // ── Search bar ───────────────────────────────────────────────────
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
            child: TextField(
              onChanged: sp.setSearchQuery,
              decoration: const InputDecoration(
                hintText: 'Search services…',
                prefixIcon: Icon(Icons.search, color: AppColors.textHint),
                filled: true,
              ),
            ),
          ),
          // ── Category chips ────────────────────────────────────────────────
          if (sp.categories.length > 1)
            SizedBox(
              height: 52,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                children: sp.categories.map((cat) {
                  final selected = sp.selectedCategory == cat;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: Text(cat),
                      selected: selected,
                      onSelected: (_) => sp.setCategory(cat),
                      selectedColor: AppColors.primary,
                      backgroundColor: AppColors.roseTint,
                      labelStyle: TextStyle(
                        color: selected ? Colors.white : AppColors.textPrimary,
                        fontWeight: FontWeight.w500,
                      ),
                      showCheckmark: false,
                      side: BorderSide.none,
                    ),
                  );
                }).toList(),
              ),
            ),
          // ── Grid ─────────────────────────────────────────────────────────
          Expanded(
            child: sp.isLoading
                ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
                : sp.filtered.isEmpty
                    ? _EmptyState()
                    : GridView.builder(
                        padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 14,
                          mainAxisSpacing: 14,
                          childAspectRatio: 0.62,
                        ),
                        itemCount: sp.filtered.length,
                        itemBuilder: (_, i) {
                          final s = sp.filtered[i];
                          return ServiceCard(
                            service: s,
                            onTap: () => Navigator.pushNamed(
                              context,
                              '/client/booking',
                              arguments: {'service': s},
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.search_off, size: 56, color: AppColors.textHint),
          const SizedBox(height: 14),
          Text('No services found', style: AppTextStyles.heading3.copyWith(color: AppColors.textSecondary)),
          const SizedBox(height: 6),
          Text('Try a different search or category', style: AppTextStyles.caption),
        ],
      ),
    );
  }
}

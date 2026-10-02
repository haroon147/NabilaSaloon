import 'package:flutter/material.dart';
import '../models/employee_model.dart';
import '../theme/app_theme.dart';

class EmployeeCard extends StatelessWidget {
  final EmployeeModel employee;
  final bool isSelected;
  final VoidCallback? onTap;
  final bool compact;

  const EmployeeCard({
    super.key,
    required this.employee,
    this.isSelected = false,
    this.onTap,
    this.compact = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isSelected ? AppColors.primary : Colors.transparent,
            width: 2,
          ),
          boxShadow: [
            BoxShadow(
              color: isSelected
                  ? AppColors.primary.withValues(alpha: 0.2)
                  : AppColors.primary.withValues(alpha: 0.07),
              blurRadius: isSelected ? 18 : 12,
              offset: const Offset(0, 5),
              spreadRadius: isSelected ? -1 : -3,
            ),
          ],
        ),
        child: compact ? _compactContent() : _fullContent(),
      ),
    );
  }

  Widget _fullContent() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          _avatar(size: 58),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        employee.name,
                        style: AppTextStyles.heading3,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (isSelected)
                      Container(
                        width: 22,
                        height: 22,
                        decoration: const BoxDecoration(
                          color: AppColors.primary,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.check_rounded,
                          color: Colors.white,
                          size: 14,
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 4),
                _ratingRow(),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 5,
                  runSpacing: 5,
                  children: employee.specialties
                      .take(2)
                      .map((s) => _specialtyChip(s))
                      .toList(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _compactContent() {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        children: [
          _avatar(size: 50),
          const SizedBox(height: 8),
          Text(
            employee.name.split(' ').first,
            style: AppTextStyles.bodyMedium,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 2),
          _ratingRow(small: true),
        ],
      ),
    );
  }

  Widget _avatar({required double size}) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: const LinearGradient(
          colors: [AppColors.primary, AppColors.primaryDark],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: isSelected ? 0.4 : 0.25),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Center(
        child: Text(
          employee.name[0].toUpperCase(),
          style: TextStyle(
            fontSize: size * 0.38,
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
        ),
      ),
    );
  }

  Widget _ratingRow({bool small = false}) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          Icons.star_rounded,
          color: const Color(0xFFFFC107),
          size: small ? 13 : 15,
        ),
        const SizedBox(width: 3),
        Text(
          employee.rating.toStringAsFixed(1),
          style: small
              ? AppTextStyles.caption
              : AppTextStyles.caption.copyWith(
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
        ),
        if (!small)
          Text(
            ' · ${employee.reviewCount} reviews',
            style: AppTextStyles.caption,
          ),
      ],
    );
  }

  Widget _specialtyChip(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.primary.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: AppTextStyles.label.copyWith(
          color: AppColors.primaryDark,
          fontSize: 11,
        ),
      ),
    );
  }
}

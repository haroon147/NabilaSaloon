import 'package:flutter/material.dart';
import '../models/time_slot_model.dart';
import '../theme/app_theme.dart';

class SlotChip extends StatelessWidget {
  final TimeSlot slot;
  final bool isSelected;
  final VoidCallback? onTap;

  const SlotChip({
    super.key,
    required this.slot,
    this.isSelected = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final available = slot.isAvailable;
    return GestureDetector(
      onTap: available ? onTap : null,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: !available
              ? AppColors.divider
              : isSelected
                  ? AppColors.primary
                  : AppColors.roseTint,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? AppColors.primary : Colors.transparent,
            width: 1.5,
          ),
        ),
        child: Text(
          slot.startTime,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: !available
                ? AppColors.textHint
                : isSelected
                    ? Colors.white
                    : AppColors.primaryDark,
            decoration: !available ? TextDecoration.lineThrough : null,
          ),
        ),
      ),
    );
  }
}

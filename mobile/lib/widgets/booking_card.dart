import 'package:flutter/material.dart';
import '../models/booking_model.dart';
import '../theme/app_theme.dart';

class BookingCard extends StatelessWidget {
  final BookingModel booking;
  final VoidCallback? onCancel;
  final bool showClient;

  const BookingCard({
    super.key,
    required this.booking,
    this.onCancel,
    this.showClient = false,
  });

  @override
  Widget build(BuildContext context) {
    final statusColor = _statusColor(booking.status);

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.09),
            blurRadius: 16,
            offset: const Offset(0, 5),
            spreadRadius: -2,
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(18),
        child: IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // ── Status accent bar ─────────────────────────────────────
              Container(width: 4, color: statusColor),
              // ── Card body ─────────────────────────────────────────────
              Expanded(
                child: Container(
                  color: AppColors.surface,
                  padding: const EdgeInsets.fromLTRB(14, 14, 14, 14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Service name + status
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              booking.serviceName ?? 'Service',
                              style: AppTextStyles.heading3,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 8),
                          _StatusBadge(status: booking.status),
                        ],
                      ),
                      const SizedBox(height: 10),
                      _infoRow(
                        Icons.person_outline_rounded,
                        showClient
                            ? 'Client: ${booking.clientName ?? "—"}'
                            : 'Stylist: ${booking.employeeName ?? "—"}',
                      ),
                      const SizedBox(height: 5),
                      _infoRow(
                        Icons.calendar_today_outlined,
                        '${booking.formattedDate}  ·  ${booking.startTime} – ${booking.endTime}',
                      ),
                      const SizedBox(height: 5),
                      _infoRow(
                        Icons.payments_outlined,
                        'PKR ${booking.price.toStringAsFixed(0)}',
                      ),
                      if (onCancel != null && booking.isUpcoming) ...[
                        const SizedBox(height: 10),
                        const Divider(height: 1),
                        const SizedBox(height: 6),
                        Align(
                          alignment: Alignment.centerRight,
                          child: TextButton.icon(
                            onPressed: onCancel,
                            icon: const Icon(Icons.cancel_outlined, size: 15),
                            label: const Text('Cancel'),
                            style: TextButton.styleFrom(
                              foregroundColor: AppColors.error,
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 6),
                              textStyle: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _infoRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 14, color: AppColors.textHint),
        const SizedBox(width: 7),
        Expanded(
          child: Text(
            text,
            style: AppTextStyles.caption.copyWith(
              color: AppColors.textSecondary,
              fontSize: 12.5,
            ),
          ),
        ),
      ],
    );
  }

  Color _statusColor(BookingStatus status) {
    switch (status) {
      case BookingStatus.confirmed:
        return AppColors.success;
      case BookingStatus.pending:
        return AppColors.warning;
      case BookingStatus.completed:
        return AppColors.primary;
      case BookingStatus.cancelled:
        return AppColors.error;
    }
  }
}

class _StatusBadge extends StatelessWidget {
  final BookingStatus status;
  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    final (label, bg, fg) = switch (status) {
      BookingStatus.confirmed => ('Confirmed', const Color(0xFFE8F5E9), AppColors.success),
      BookingStatus.pending   => ('Pending',   const Color(0xFFFFF3E0), AppColors.warning),
      BookingStatus.completed => ('Done',      AppColors.roseTint,      AppColors.primaryDark),
      BookingStatus.cancelled => ('Cancelled', const Color(0xFFFFEBEE), AppColors.error),
    };
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: fg,
          letterSpacing: 0.2,
        ),
      ),
    );
  }
}

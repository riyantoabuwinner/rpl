<?php

namespace App\Enums;

enum SlaStatus: string
{
    case ON_TRACK = 'on_track';
    case WARNING = 'warning';
    case OVERDUE = 'overdue';
    case COMPLETED = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::ON_TRACK => 'Sesuai Jadwal (On Track)',
            self::WARNING => 'Mendekati Tenggat (Warning)',
            self::OVERDUE => 'Melewati Batas SLA (Overdue)',
            self::COMPLETED => 'Selesai Tepat Waktu (Completed)',
        };
    }

    public function badgeColor(): string
    {
        return match ($this) {
            self::ON_TRACK => 'emerald',
            self::WARNING => 'amber',
            self::OVERDUE => 'red',
            self::COMPLETED => 'blue',
        };
    }
}

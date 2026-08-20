<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Background Sync: Sinkronisasi berkala data akun Portal di latar belakang
Schedule::command('portal:sync-users --type=all')->dailyAt('02:00');


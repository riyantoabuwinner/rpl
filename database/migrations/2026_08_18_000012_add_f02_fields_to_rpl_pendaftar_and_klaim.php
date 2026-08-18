<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rpl_pendaftar', function (Blueprint $table) {
            $table->string('status_pernikahan', 30)->nullable()->default('Menikah');
            $table->string('kebangsaan', 50)->nullable()->default('INDONESIA');
            $table->string('rt_rw', 50)->nullable();
            $table->string('kecamatan', 100)->nullable();
            $table->string('kabupaten_kota', 100)->nullable();
            $table->string('kode_pos', 10)->nullable();
            $table->string('telepon_rumah', 30)->nullable();
            $table->string('telepon_kantor', 30)->nullable();
            $table->boolean('lampiran_evaluasi_diri')->default(true);
            $table->boolean('lampiran_drh')->default(true);
            $table->boolean('lampiran_ijazah_transkrip')->default(true);
            $table->string('lampiran_lainnya', 255)->nullable();
        });

        Schema::table('rpl_klaim_cpmk', function (Blueprint $table) {
            $table->enum('jenis_pengajuan', ['transfer_sks', 'perolehan_sks'])->default('perolehan_sks');
        });
    }

    public function down(): void
    {
        Schema::table('rpl_pendaftar', function (Blueprint $table) {
            $table->dropColumn([
                'status_pernikahan',
                'kebangsaan',
                'rt_rw',
                'kecamatan',
                'kabupaten_kota',
                'kode_pos',
                'telepon_rumah',
                'telepon_kantor',
                'lampiran_evaluasi_diri',
                'lampiran_drh',
                'lampiran_ijazah_transkrip',
                'lampiran_lainnya',
            ]);
        });

        Schema::table('rpl_klaim_cpmk', function (Blueprint $table) {
            $table->dropColumn('jenis_pengajuan');
        });
    }
};

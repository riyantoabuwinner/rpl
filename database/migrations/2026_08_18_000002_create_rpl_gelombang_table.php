<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rpl_gelombang', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama_gelombang', 100);
            $table->string('tahun_akademik', 10); // 2026/2027
            $table->enum('semester', ['Ganjil', 'Genap'])->default('Ganjil');
            $table->date('tanggal_buka');
            $table->date('tanggal_tutup');
            $table->date('tanggal_pengumuman')->nullable();
            $table->decimal('biaya_pendaftaran', 12, 2)->default(0.00);
            $table->decimal('biaya_asesmen_per_sks', 12, 2)->default(0.00);
            $table->integer('kuota_pendaftar')->default(100);
            $table->boolean('is_active')->default(true)->index();
            $table->text('catatan_panduan')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rpl_gelombang');
    }
};

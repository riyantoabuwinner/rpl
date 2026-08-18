<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rpl_sanggah', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pendaftar_id')->constrained('rpl_pendaftar')->cascadeOnDelete();
            $table->foreignUuid('mata_kuliah_id')->nullable()->constrained('mata_kuliah')->nullOnDelete();
            $table->string('nomor_sanggah', 100)->unique();
            $table->text('alasan_keberatan');
            $table->string('bukti_tambahan_path', 255)->nullable();
            $table->string('bukti_tambahan_nama', 255)->nullable();
            $table->enum('status_sanggah', ['diajukan', 'sedang_ditinjau', 'diterima', 'ditolak'])->default('diajukan')->index();
            $table->text('tanggapan_tim_rpl')->nullable();
            $table->foreignId('ditinjau_oleh_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('ditinjau_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rpl_sanggah');
    }
};

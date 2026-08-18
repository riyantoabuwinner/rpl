<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rpl_penugasan_asesor', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pendaftar_id')->constrained('rpl_pendaftar')->cascadeOnDelete();
            $table->foreignId('asesor_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('ditugaskan_oleh_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('tanggal_penugasan')->useCurrent();
            $table->timestamp('tanggal_mulai_asesmen')->nullable();
            $table->timestamp('tanggal_selesai_asesmen')->nullable();
            $table->enum('status_penugasan', ['ditugaskan', 'sedang_dinilai', 'selesai', 'dibatalkan'])->default('ditugaskan')->index();
            $table->text('catatan_admin')->nullable();
            $table->timestamps();

            $table->unique(['pendaftar_id', 'asesor_id']);
        });

        Schema::create('rpl_asesmen', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('penugasan_id')->constrained('rpl_penugasan_asesor')->cascadeOnDelete();
            $table->foreignUuid('pendaftar_id')->constrained('rpl_pendaftar')->cascadeOnDelete();
            $table->foreignUuid('mata_kuliah_id')->constrained('mata_kuliah')->cascadeOnDelete();
            $table->foreignId('asesor_id')->constrained('users')->cascadeOnDelete();
            
            // Rekomendasi
            $table->enum('status_rekognisi', ['diakui', 'ditolak', 'uji_petik'])->default('ditolak')->index();
            $table->string('nilai_rekomendasi', 2)->nullable(); // A, B+, B, dll.
            $table->decimal('nilai_angka', 4, 2)->nullable(); // 4.00, 3.50, 3.00, dll.
            $table->integer('sks_rekomendasi')->default(0);
            $table->boolean('is_butuh_uji_petik')->default(false)->index();
            $table->text('alasan_uji_petik')->nullable();
            $table->text('catatan_asesor')->nullable();
            $table->text('catatan_internal')->nullable(); // Tersembunyi dari asesi
            $table->boolean('is_final')->default(false);
            $table->timestamp('finalized_at')->nullable();
            $table->timestamps();

            $table->unique(['penugasan_id', 'mata_kuliah_id']);
        });

        Schema::create('rpl_asesmen_vatc', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('asesmen_id')->constrained('rpl_asesmen')->cascadeOnDelete();
            $table->foreignUuid('bukti_id')->nullable()->constrained('rpl_bukti_asesi')->nullOnDelete();
            $table->boolean('is_valid')->default(false);
            $table->boolean('is_asli')->default(false);
            $table->boolean('is_terkini')->default(false);
            $table->boolean('is_cukup')->default(false);
            $table->text('catatan_evaluasi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rpl_asesmen_vatc');
        Schema::dropIfExists('rpl_asesmen');
        Schema::dropIfExists('rpl_penugasan_asesor');
    }
};

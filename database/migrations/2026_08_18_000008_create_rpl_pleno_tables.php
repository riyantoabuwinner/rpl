<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rpl_pleno', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('gelombang_id')->constrained('rpl_gelombang')->cascadeOnDelete();
            $table->foreignUuid('prodi_id')->constrained('prodi')->cascadeOnDelete();
            $table->string('nomor_berita_acara', 100)->unique();
            $table->date('tanggal_sidang');
            $table->string('ruangan_media', 100)->default('Ruang Sidang Utama / Zoom');
            $table->text('agenda_sidang')->nullable();
            $table->text('kesimpulan_umum')->nullable();
            $table->string('file_berita_acara_pdf', 255)->nullable();
            $table->enum('status_pleno', ['draft', 'berlangsung', 'disahkan', 'dibatalkan'])->default('draft')->index();
            $table->foreignId('disahkan_oleh_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('disahkan_at')->nullable();
            $table->timestamps();
        });

        Schema::create('rpl_pleno_peserta', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pleno_id')->constrained('rpl_pleno')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('peran_sidang', 50); // Ketua Sidang, Sekretaris, Anggota Asesor, Perwakilan LPM
            $table->boolean('is_hadir')->default(true);
            $table->string('tanda_tangan_token', 64)->nullable();
            $table->timestamp('signed_at')->nullable();
            $table->timestamps();

            $table->unique(['pleno_id', 'user_id']);
        });

        Schema::create('rpl_pleno_keputusan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pleno_id')->constrained('rpl_pleno')->cascadeOnDelete();
            $table->foreignUuid('pendaftar_id')->constrained('rpl_pendaftar')->cascadeOnDelete();
            $table->enum('status_keputusan', ['disetujui', 'ditolak', 'perlu_revisi'])->default('disetujui')->index();
            $table->integer('total_sks_diakui')->default(0);
            $table->integer('sisa_sks_harus_ditempuh')->default(0);
            $table->integer('estimasi_semester')->default(1);
            $table->text('catatan_khusus')->nullable();
            $table->timestamps();

            $table->unique(['pleno_id', 'pendaftar_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rpl_pleno_keputusan');
        Schema::dropIfExists('rpl_pleno_peserta');
        Schema::dropIfExists('rpl_pleno');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rpl_konversi_nilai', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pendaftar_id')->constrained('rpl_pendaftar')->cascadeOnDelete();
            $table->foreignUuid('mata_kuliah_id')->nullable()->constrained('mata_kuliah')->nullOnDelete();
            
            // Asal (dari portofolio/PT asal)
            $table->string('kode_mata_kuliah_asal', 50)->default('RPL-EXP-01');
            $table->string('nama_mata_kuliah_asal', 200)->default('Pengalaman Kerja / Hasil Portofolio');
            $table->integer('sks_mata_kuliah_asal')->default(3);
            $table->string('nilai_huruf_asal', 2)->default('A');
            
            // Diakui (sesuai kurikulum tujuan)
            $table->string('kode_mk_diakui', 20)->index();
            $table->string('nama_mk_diakui', 150);
            $table->integer('sks_diakui')->default(3);
            $table->string('nilai_huruf', 2); // A, B+, B
            $table->decimal('nilai_indeks', 4, 2); // 4.00, 3.50, 3.00
            
            // Status Integrasi
            $table->enum('status_sync_siakad', ['pending', 'synced', 'failed'])->default('pending')->index();
            $table->timestamp('synced_siakad_at')->nullable();
            $table->enum('status_sync_pddikti', ['pending', 'synced', 'failed'])->default('pending')->index();
            $table->timestamp('synced_pddikti_at')->nullable();
            $table->string('pddikti_id_transfer', 100)->nullable();
            
            $table->timestamps();
        });

        Schema::create('rpl_sk_rekognisi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pendaftar_id')->constrained('rpl_pendaftar')->cascadeOnDelete();
            $table->string('nomor_sk', 100)->unique()->index();
            $table->date('tanggal_sk');
            $table->string('judul_sk', 255)->default('Keputusan Rektor tentang Pengakuan Hasil Rekognisi Pembelajaran Lampau');
            $table->integer('total_sks_diakui');
            $table->decimal('ipk_konversi', 4, 2);
            $table->string('pejabat_nama', 150);
            $table->string('pejabat_jabatan', 100)->default('Rektor');
            $table->string('pejabat_nip', 50)->nullable();
            $table->string('file_pdf_path', 255)->nullable();
            $table->string('qr_token', 64)->unique()->index();
            $table->string('qr_verify_url', 255);
            $table->string('document_hash', 64)->index(); // SHA-256
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rpl_sk_rekognisi');
        Schema::dropIfExists('rpl_konversi_nilai');
    }
};

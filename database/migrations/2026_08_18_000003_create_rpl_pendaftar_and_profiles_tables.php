<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rpl_pendaftar', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('gelombang_id')->constrained('rpl_gelombang')->cascadeOnDelete();
            $table->foreignUuid('prodi_id')->constrained('prodi')->cascadeOnDelete();
            
            $table->string('nomor_pendaftaran', 30)->unique()->index();
            $table->string('nama_lengkap', 150);
            $table->string('nik', 16)->index();
            $table->string('email', 100);
            $table->string('telepon', 20)->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->default('L');
            $table->string('tempat_lahir', 100)->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->text('alamat_lengkap')->nullable();
            $table->string('pekerjaan_saat_ini', 150)->nullable();
            $table->string('instansi_pekerjaan', 150)->nullable();
            
            $table->enum('jenis_rpl', ['A1', 'A2', 'B'])->default('A2')->index();
            $table->enum('status_pendaftaran', [
                'draft', 'terkirim', 'verifikasi_administrasi', 'valid', 'ditolak_administrasi',
                'proses_asesmen', 'uji_petik', 'pleno', 'disetujui', 'ditolak',
                'penerbitan_sk', 'selesai', 'sinkronisasi'
            ])->default('draft')->index();
            
            // SLA tracking
            $table->timestamp('tanggal_submit')->nullable();
            $table->timestamp('sla_verifikasi_due_at')->nullable();
            $table->timestamp('sla_asesmen_due_at')->nullable();
            $table->timestamp('tanggal_verifikasi')->nullable();
            $table->foreignId('verifikator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('catatan_verifikasi')->nullable();
            
            // Konversi ringkasan
            $table->integer('total_sks_diakui')->default(0);
            $table->decimal('total_nilai_angka', 5, 2)->default(0.00);
            $table->decimal('ipk_rekognisi', 4, 2)->default(0.00);
            
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('rpl_pendidikan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pendaftar_id')->constrained('rpl_pendaftar')->cascadeOnDelete();
            $table->string('jenjang', 30); // SMA/SMK, D3, D4, S1
            $table->string('nama_institusi', 150);
            $table->string('jurusan', 100);
            $table->string('nomor_ijazah', 100)->nullable();
            $table->string('tahun_lulus', 4);
            $table->decimal('ipk_nilai_akhir', 4, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('rpl_pengalaman', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pendaftar_id')->constrained('rpl_pendaftar')->cascadeOnDelete();
            $table->string('nama_instansi', 150);
            $table->string('jabatan_posisi', 150);
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai')->nullable();
            $table->boolean('is_masih_bekerja')->default(false);
            $table->text('deskripsi_tugas_kunci');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rpl_pengalaman');
        Schema::dropIfExists('rpl_pendidikan');
        Schema::dropIfExists('rpl_pendaftar');
    }
};

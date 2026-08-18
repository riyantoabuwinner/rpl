<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rpl_uji_petik_rubrik', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama_dimensi', 100);
            $table->text('deskripsi_indikator');
            $table->decimal('bobot_persen', 5, 2); // e.g. 25.00, 35.00, 25.00, 15.00
            $table->integer('urutan')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('rpl_uji_petik', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pendaftar_id')->constrained('rpl_pendaftar')->cascadeOnDelete();
            $table->foreignUuid('mata_kuliah_id')->nullable()->constrained('mata_kuliah')->nullOnDelete();
            $table->foreignId('interviewer_id')->constrained('users')->cascadeOnDelete();
            
            $table->enum('jenis_uji', ['wawancara', 'tes_lisan', 'praktik', 'studi_kasus'])->default('wawancara');
            $table->enum('metode_pelaksanaan', ['Online', 'Offline'])->default('Online');
            $table->dateTime('jadwal_mulai');
            $table->dateTime('jadwal_selesai')->nullable();
            $table->string('link_meeting', 255)->nullable();
            $table->string('lokasi_ruangan', 100)->nullable();
            $table->string('recording_url', 255)->nullable();
            
            // Penilaian
            $table->decimal('skor_akhir', 4, 2)->nullable();
            $table->string('nilai_huruf', 2)->nullable(); // A, B+, B, Ditolak
            $table->decimal('nilai_angka', 4, 2)->nullable(); // 4.00, 3.50, 3.00, 0.00
            $table->enum('status_kelulusan', ['Lulus', 'Ditolak'])->nullable();
            $table->text('catatan_hasil')->nullable();
            $table->enum('status_uji', ['dijadwalkan', 'berlangsung', 'selesai', 'dibatalkan'])->default('dijadwalkan')->index();
            
            $table->timestamps();
        });

        Schema::create('rpl_uji_petik_nilai', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('uji_petik_id')->constrained('rpl_uji_petik')->cascadeOnDelete();
            $table->foreignUuid('rubrik_id')->constrained('rpl_uji_petik_rubrik')->cascadeOnDelete();
            $table->unsignedTinyInteger('skor'); // 1, 2, 3, 4
            $table->decimal('skor_tertimbang', 5, 3); // skor * (bobot / 100)
            $table->text('catatan_evaluasi')->nullable();
            $table->timestamps();

            $table->unique(['uji_petik_id', 'rubrik_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rpl_uji_petik_nilai');
        Schema::dropIfExists('rpl_uji_petik');
        Schema::dropIfExists('rpl_uji_petik_rubrik');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prodi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('kode_prodi', 20)->unique()->index();
            $table->string('nama_prodi', 150);
            $table->string('jenjang', 10)->default('S1'); // D3, D4, S1, S2, Profesi
            $table->string('fakultas', 100)->nullable();
            $table->foreignId('kaprodi_id')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('kurikulum', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('prodi_id')->constrained('prodi')->cascadeOnDelete();
            $table->string('nama_kurikulum', 150);
            $table->string('tahun_mulai', 4);
            $table->string('tahun_akhir', 4)->nullable();
            $table->integer('total_sks_lulus')->default(144);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('mata_kuliah', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('kurikulum_id')->constrained('kurikulum')->cascadeOnDelete();
            $table->string('kode_mk', 20)->index();
            $table->string('nama_mk', 150);
            $table->integer('sks')->default(3);
            $table->integer('semester')->default(1);
            $table->string('kategori_mk', 50)->default('Wajib'); // Wajib, Pilihan, Praktikum
            $table->boolean('terbuka_rpl')->default(true)->index();
            $table->text('deskripsi')->nullable();
            $table->text('silabus_ringkas')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['kurikulum_id', 'kode_mk']);
        });

        Schema::create('cpmk', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('mata_kuliah_id')->constrained('mata_kuliah')->cascadeOnDelete();
            $table->string('kode_cpmk', 30); // CPMK-1, CPMK-2
            $table->text('deskripsi_cpmk');
            $table->integer('urutan')->default(1);
            $table->timestamps();

            $table->unique(['mata_kuliah_id', 'kode_cpmk']);
        });

        Schema::create('indikator_cpmk', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('cpmk_id')->constrained('cpmk')->cascadeOnDelete();
            $table->string('kode_indikator', 30); // IND-1.1
            $table->text('deskripsi_indikator');
            $table->integer('urutan')->default(1);
            $table->timestamps();

            $table->unique(['cpmk_id', 'kode_indikator']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('indikator_cpmk');
        Schema::dropIfExists('cpmk');
        Schema::dropIfExists('mata_kuliah');
        Schema::dropIfExists('kurikulum');
        Schema::dropIfExists('prodi');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rpl_evaluasi_diri_cpmk', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pendaftar_id')->constrained('rpl_pendaftar')->cascadeOnDelete();
            $table->foreignUuid('mata_kuliah_id')->constrained('mata_kuliah')->cascadeOnDelete();
            $table->foreignUuid('cpmk_id')->nullable()->constrained('cpmk')->nullOnDelete();
            $table->foreignUuid('indikator_cpmk_id')->nullable()->constrained('indikator_cpmk')->nullOnDelete();
            $table->integer('nomor_urut')->default(1);
            $table->text('pernyataan_cpmk');
            $table->enum('profisiensi', ['sangat_baik', 'baik', 'tidak_pernah'])->default('sangat_baik');
            $table->boolean('is_valid')->default(false);     // V - Valid/Sahih
            $table->boolean('is_autentik')->default(false);  // A - Autentik/Asli
            $table->boolean('is_terkini')->default(false);   // T - Terkini
            $table->boolean('is_memadai')->default(false);   // M - Memadai/Cukup
            $table->string('nomor_dokumen', 50)->nullable();
            $table->string('jenis_dokumen', 255)->nullable();
            $table->text('catatan_asesor')->nullable();
            $table->timestamps();

            $table->index(['pendaftar_id', 'mata_kuliah_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rpl_evaluasi_diri_cpmk');
    }
};

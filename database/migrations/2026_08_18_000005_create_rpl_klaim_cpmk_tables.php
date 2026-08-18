<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rpl_klaim_cpmk', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pendaftar_id')->constrained('rpl_pendaftar')->cascadeOnDelete();
            $table->foreignUuid('mata_kuliah_id')->constrained('mata_kuliah')->cascadeOnDelete();
            $table->foreignUuid('cpmk_id')->nullable()->constrained('cpmk')->nullOnDelete();
            $table->foreignUuid('indikator_cpmk_id')->nullable()->constrained('indikator_cpmk')->nullOnDelete();
            $table->text('deskripsi_pengalaman_relevan');
            $table->enum('tingkat_kemampuan_diri', ['Sangat Baik', 'Baik', 'Cukup'])->default('Baik');
            $table->timestamps();
        });

        Schema::create('rpl_klaim_bukti', function (Blueprint $table) {
            $table->foreignUuid('klaim_id')->constrained('rpl_klaim_cpmk')->cascadeOnDelete();
            $table->foreignUuid('bukti_id')->constrained('rpl_bukti_asesi')->cascadeOnDelete();
            $table->timestamps();

            $table->primary(['klaim_id', 'bukti_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rpl_klaim_bukti');
        Schema::dropIfExists('rpl_klaim_cpmk');
    }
};

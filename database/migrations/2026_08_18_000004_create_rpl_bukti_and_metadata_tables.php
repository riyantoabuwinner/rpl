<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rpl_bukti_asesi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pendaftar_id')->constrained('rpl_pendaftar')->cascadeOnDelete();
            $table->string('nama_dokumen', 255);
            $table->string('jenis_bukti', 60)->default('sertifikat_kompetensi')->index();
            $table->string('file_path', 255);
            $table->string('file_original_name', 255);
            $table->string('file_hash', 64)->index(); // SHA-256
            $table->unsignedBigInteger('file_size'); // Bytes
            $table->string('mime_type', 100);
            $table->string('tahun_penerbitan', 4)->nullable();
            $table->string('penerbit_institusi', 150)->nullable();
            $table->text('deskripsi_dokumen')->nullable();
            $table->boolean('is_potential_duplicate')->default(false)->index();
            $table->foreignUuid('duplicate_of_id')->nullable()->constrained('rpl_bukti_asesi')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('rpl_bukti_metadata', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('bukti_id')->constrained('rpl_bukti_asesi')->cascadeOnDelete();
            $table->string('author', 150)->nullable();
            $table->string('creator_tool', 150)->nullable();
            $table->string('producer', 150)->nullable();
            $table->timestamp('pdf_creation_date')->nullable();
            $table->timestamp('pdf_modification_date')->nullable();
            $table->json('exif_raw')->nullable();
            $table->boolean('is_metadata_suspicious')->default(false);
            $table->text('analisis_risiko')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rpl_bukti_metadata');
        Schema::dropIfExists('rpl_bukti_asesi');
    }
};

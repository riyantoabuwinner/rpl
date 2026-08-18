<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('role', 50)->nullable()->index();
            $table->string('action', 60)->index(); // LOGIN, ASSESS_CPMK, UPLOAD_DOCUMENT, etc.
            $table->string('entity_type', 100)->nullable()->index();
            $table->string('entity_id', 64)->nullable()->index();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('request_id', 64)->nullable()->index();
            $table->timestamp('created_at')->useCurrent()->index();
        });

        Schema::create('integration_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('target_system', 50)->index(); // PDDikti, SIAKAD
            $table->string('action', 100)->index(); // InsertNilaiTransferMatkul, SyncMahasiswa
            $table->string('request_id', 64)->unique()->index();
            $table->string('payload_hash', 64)->index();
            $table->json('payload_sanitized')->nullable();
            $table->string('status', 30)->default('pending')->index(); // pending, processing, success, failed
            $table->integer('response_code')->nullable();
            $table->text('response_message')->nullable();
            $table->json('response_body')->nullable();
            $table->unsignedSmallInteger('retry_count')->default(0);
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent()->index();
            $table->timestamp('updated_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('integration_logs');
        Schema::dropIfExists('audit_logs');
    }
};

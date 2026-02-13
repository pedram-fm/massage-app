<?php

use App\Modules\Appointment\Domain\AppointmentStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('therapist_id')->constrained('users')->onDelete('cascade');
            $table->string('client_name', 100)->nullable();
            $table->string('client_phone', 20)->nullable();
            $table->string('client_email', 100)->nullable();
            $table->foreignId('service_type_id')->constrained('service_types')->onDelete('restrict');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->unsignedInteger('duration')->comment('Duration snapshot in minutes');
            $table->unsignedBigInteger('price')->comment('Price snapshot in Toman');
            $table->enum('status', AppointmentStatus::values())->default(AppointmentStatus::CONFIRMED->value);
            $table->text('notes')->nullable()->comment('Therapist notes');
            $table->string('cancellation_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();

            $table->index(['therapist_id', 'start_time']);
            $table->index(['therapist_id', 'status']);
            $table->index('status');
            $table->index('start_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};

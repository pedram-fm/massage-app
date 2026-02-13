<?php

use App\Modules\Schedule\Domain\DayOfWeek;
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
        Schema::create('therapist_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('therapist_id')->constrained('users')->onDelete('cascade');
            $table->unsignedTinyInteger('day_of_week')->comment('0=Sunday to 6=Saturday');
            $table->time('start_time');
            $table->time('end_time');
            $table->unsignedInteger('break_duration')->default(15)->comment('Break duration in minutes');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['therapist_id', 'day_of_week']);
            $table->index(['therapist_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('therapist_schedules');
    }
};

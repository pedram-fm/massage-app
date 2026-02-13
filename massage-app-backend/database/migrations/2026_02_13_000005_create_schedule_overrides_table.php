<?php

use App\Modules\Schedule\Domain\OverrideType;
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
        Schema::create('schedule_overrides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('therapist_id')->constrained('users')->onDelete('cascade');
            $table->string('date', 20)->comment('Jalali date: 1405-11-25');
            $table->date('date_gregorian')->comment('Gregorian date for indexing and queries');
            $table->enum('type', OverrideType::values());
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('reason')->nullable();
            $table->timestamps();

            $table->index(['therapist_id', 'date_gregorian']);
            $table->unique(['therapist_id', 'date_gregorian']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedule_overrides');
    }
};

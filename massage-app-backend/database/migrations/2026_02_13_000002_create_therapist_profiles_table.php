<?php

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
        Schema::create('therapist_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('bio')->nullable();
            $table->text('bio_fa')->nullable();
            $table->string('avatar')->nullable();
            $table->json('specialties')->nullable()->comment('Array of specialty types');
            $table->unsignedInteger('years_of_experience')->default(0);
            $table->json('certifications')->nullable()->comment('Array of certification objects');
            $table->decimal('rating', 3, 2)->default(0)->comment('Average rating 0-5');
            $table->unsignedInteger('total_appointments')->default(0);
            $table->boolean('is_accepting_clients')->default(true);
            $table->timestamps();

            $table->unique('user_id');
            $table->index('is_accepting_clients');
            $table->index('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('therapist_profiles');
    }
};

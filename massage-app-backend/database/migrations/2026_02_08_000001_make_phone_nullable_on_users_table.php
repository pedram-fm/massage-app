<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE users ALTER COLUMN phone DROP NOT NULL');
    }

    public function down(): void
    {
        DB::statement("UPDATE users SET phone = 'TEMP-' || id WHERE phone IS NULL");
        DB::statement('ALTER TABLE users ALTER COLUMN phone SET NOT NULL');
    }
};

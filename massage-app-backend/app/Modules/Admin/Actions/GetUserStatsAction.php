<?php

namespace App\Modules\Admin\Actions;

use App\Modules\Users\Models\Role;
use App\Modules\Users\Models\User;

class GetUserStatsAction
{
    /**
     * Get user statistics
     */
    public function execute(): array
    {
        return [
            'total_users' => User::count(),
            'by_role' => Role::withCount('users')->get()->map(function ($role) {
                return [
                    'role' => $role->name,
                    'display_name' => $role->display_name,
                    'count' => $role->users_count,
                ];
            }),
            'verified_email' => User::whereNotNull('email_verified_at')->count(),
            'verified_phone' => User::whereNotNull('phone_verified_at')->count(),
            'recent_logins' => User::whereNotNull('last_login_at')
                ->where('last_login_at', '>=', now()->subDays(7))
                ->count(),
        ];
    }
}

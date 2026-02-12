<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'display_name',
        'description',
        'group',
    ];

    /**
     * Permission constants - Admin
     */
    public const MANAGE_USERS = 'manage_users';
    public const MANAGE_ROLES = 'manage_roles';
    public const VIEW_ALL_SESSIONS = 'view_all_sessions';
    public const MANAGE_SETTINGS = 'manage_settings';
    public const VIEW_REPORTS = 'view_reports';

    /**
     * Permission constants - Massage Therapist (Masseur/Masseuse)
     */
    public const SET_AVAILABILITY = 'set_availability';
    public const VIEW_OWN_SESSIONS = 'view_own_sessions';
    public const MANAGE_SESSION_PLANS = 'manage_session_plans';
    public const UPDATE_SESSION_STATUS = 'update_session_status';
    public const VIEW_CLIENT_INFO = 'view_client_info';

    /**
     * Permission constants - Client
     */
    public const BOOK_SESSION = 'book_session';
    public const VIEW_MY_SESSIONS = 'view_my_sessions';
    public const CANCEL_SESSION = 'cancel_session';
    public const VIEW_THERAPISTS = 'view_therapists';
    public const MANAGE_OWN_PROFILE = 'manage_own_profile';

    /**
     * Get the roles that have this permission
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permission')
            ->withTimestamps();
    }
}

<?php

namespace App\Modules\Admin\Actions;

use App\Modules\Admin\Exceptions\CannotChangeOwnRoleException;
use App\Modules\Users\Models\User;

class ChangeUserRoleAction
{
    /**
     * Change user's role
     *
     * @throws CannotChangeOwnRoleException
     */
    public function execute(User $user, int $roleId, int $currentUserId): User
    {
        if ($user->id === $currentUserId) {
            throw new CannotChangeOwnRoleException();
        }

        $user->role_id = $roleId;
        $user->save();
        $user->load('role');

        return $user;
    }
}

<?php

namespace App\Actions\Admin;

use App\Exceptions\CannotChangeOwnRoleException;
use App\Models\User;

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

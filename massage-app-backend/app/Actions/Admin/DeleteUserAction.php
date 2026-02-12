<?php

namespace App\Actions\Admin;

use App\Exceptions\CannotDeleteSelfException;
use App\Models\User;

class DeleteUserAction
{
    /**
     * Delete a user
     *
     * @throws CannotDeleteSelfException
     */
    public function execute(User $user, int $currentUserId): bool
    {
        if ($user->id === $currentUserId) {
            throw new CannotDeleteSelfException();
        }

        return (bool) $user->delete();
    }
}

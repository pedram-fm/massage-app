<?php

namespace App\Modules\Admin\Actions;

use App\Modules\Admin\Exceptions\CannotDeleteSelfException;
use App\Modules\Users\Models\User;

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

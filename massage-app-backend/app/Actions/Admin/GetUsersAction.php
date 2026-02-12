<?php

namespace App\Actions\Admin;

use App\Contracts\Repositories\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetUsersAction
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {
    }

    /**
     * Get paginated users with filters
     */
    public function execute(array $filters = []): LengthAwarePaginator
    {
        return $this->userRepository->getPaginated(
            perPage: $filters['per_page'] ?? 15,
            search: $filters['search'] ?? null,
            roleFilter: $filters['role'] ?? null
        );
    }
}

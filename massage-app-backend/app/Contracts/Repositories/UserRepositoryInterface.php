<?php

namespace App\Contracts\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface
{
    public function findByPhone(string $phone): ?User;
    public function findByEmail(string $email): ?User;
    public function upsert(array $search, array $data): User;
    public function save(User $user): bool;
    public function getPaginated(int $perPage = 15, ?string $search = null, ?string $roleFilter = null): LengthAwarePaginator;
}

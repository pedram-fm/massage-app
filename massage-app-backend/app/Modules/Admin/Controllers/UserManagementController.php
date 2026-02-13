<?php

namespace App\Modules\Admin\Controllers;

use App\Modules\Admin\Actions\GetUsersAction;
use App\Modules\Admin\Actions\GetUserStatsAction;
use App\Modules\Admin\Actions\CreateUserAction;
use App\Modules\Admin\Actions\UpdateUserAction;
use App\Modules\Admin\Actions\DeleteUserAction;
use App\Modules\Admin\Actions\ChangeUserRoleAction;
use App\Modules\Admin\Exceptions\CannotDeleteSelfException;
use App\Modules\Admin\Exceptions\CannotChangeOwnRoleException;
use App\Modules\Admin\Requests\GetUsersRequest;
use App\Modules\Admin\Requests\CreateUserRequest;
use App\Modules\Admin\Requests\UpdateUserRequest;
use App\Modules\Admin\Requests\ChangeUserRoleRequest;
use App\Modules\Users\Resources\UserResource;
use App\Modules\Users\Resources\UserDetailResource;
use App\Modules\Users\Resources\RoleResource;
use App\Modules\Users\Models\User;
use App\Modules\Users\Models\Role;
use App\Modules\Shared\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class UserManagementController extends Controller
{
    public function __construct(
        private readonly GetUsersAction $getUsersAction,
        private readonly GetUserStatsAction $getUserStatsAction,
        private readonly CreateUserAction $createUserAction,
        private readonly UpdateUserAction $updateUserAction,
        private readonly DeleteUserAction $deleteUserAction,
        private readonly ChangeUserRoleAction $changeUserRoleAction
    ) {
    }

    /**
     * Get all users with their roles
     */
    public function index(GetUsersRequest $request): JsonResponse
    {
        $filters = $request->validated();

        $users = $this->getUsersAction->execute($filters);

        return response()->json([
            'data' => UserResource::collection($users->items()),
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'per_page' => $users->perPage(),
            'total' => $users->total(),
        ]);
    }

    /**
     * Get single user details
     */
    public function show(string $id): JsonResponse
    {
        $user = User::with('role.permissions')->findOrFail($id);

        return (new UserDetailResource($user))->response();
    }

    /**
     * Create new user (admin creates user)
     */
    public function store(CreateUserRequest $request): JsonResponse
    {
        $user = $this->createUserAction->execute($request->validated());

        return response()->json([
            'message' => 'کاربر با موفقیت ایجاد شد',
            'user' => new UserResource($user),
        ], 201);
    }

    /**
     * Update user details
     */
    public function update(UpdateUserRequest $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $user = $this->updateUserAction->execute($user, $request->validated());

        return response()->json([
            'message' => 'کاربر با موفقیت به‌روزرسانی شد',
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Delete user
     */
    public function destroy(string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        try {
            $this->deleteUserAction->execute($user, auth()->id());
        } catch (CannotDeleteSelfException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

        return response()->json([
            'message' => 'کاربر با موفقیت حذف شد'
        ]);
    }

    /**
     * Change user role
     */
    public function changeRole(ChangeUserRoleRequest $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        try {
            $user = $this->changeUserRoleAction->execute(
                $user,
                $request->validated()['role_id'],
                auth()->id()
            );
        } catch (CannotChangeOwnRoleException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

        return response()->json([
            'message' => 'نقش کاربر با موفقیت تغییر یافت',
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Get all available roles
     */
    public function getRoles(): JsonResponse
    {
        $roles = Role::select('id', 'name', 'display_name', 'description')->get();

        return response()->json([
            'roles' => RoleResource::collection($roles)
        ]);
    }

    /**
     * Get user statistics
     */
    public function getStats(): JsonResponse
    {
        $stats = $this->getUserStatsAction->execute();

        return response()->json($stats);
    }
}

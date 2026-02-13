<?php

declare(strict_types=1);

namespace App\Modules\Appointment\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTherapistOwnership
{
    /**
     * Handle an incoming request.
     *
     * Ensure therapist can only access their own resources
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If not a therapist, deny access
        if (!$user || !$user->hasRole('therapist')) {
            return response()->json([
                'success' => false,
                'message' => 'شما به این بخش دسترسی ندارید',
            ], 403);
        }

        // The controller will use $request->user()->id to scope queries
        // This middleware just ensures the user is a therapist

        return $next($request);
    }
}

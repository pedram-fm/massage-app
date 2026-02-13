<?php

namespace App\Providers;

use Dedoc\Scramble\Scramble;
use Dedoc\Scramble\Support\Generator\OpenApi;
use Dedoc\Scramble\Support\Generator\Operation;
use Dedoc\Scramble\Support\Generator\SecurityScheme;
use Dedoc\Scramble\Support\RouteInfo;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Module bindings are registered in ModuleServiceProvider
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureScramble();
    }

    /**
     * Configure Scramble API documentation — tags & security.
     */
    private function configureScramble(): void
    {
        /*
        |----------------------------------------------------------------------
        | Tag resolver — organized grouping with emoji prefixes
        |----------------------------------------------------------------------
        |
        | Using emoji + numbers for visual grouping in Swagger sidebar
        |
        */
        Scramble::resolveTagsUsing(function (RouteInfo $routeInfo, Operation $operation): array {
            $uri = ltrim($routeInfo->route->uri(), '/');

            // 🔐 Auth module
            if (Str::startsWith($uri, 'v1/auth')) {
                $isProtected = collect($routeInfo->route->middleware())->contains(
                    fn (string $mw) => Str::startsWith($mw, 'auth:') || $mw === 'auth'
                );
                return [$isProtected ? '🔐 Auth — Protected' : '🔐 Auth — Public'];
            }

            // 👥 Admin module
            if (Str::startsWith($uri, 'v1/admin')) {
                if (Str::contains($uri, ['/users', '/roles'])) {
                    return ['👥 Admin — User Management'];
                }
                return ['👥 Admin — Dashboard'];
            }

            // 💆 Therapist
            if (Str::startsWith($uri, 'v1/therapist')) {
                return ['💆 Therapist — Dashboard'];
            }

            // 🧑 Client
            if (Str::startsWith($uri, 'v1/client')) {
                return ['🧑 Client — Dashboard'];
            }

            // ⚙️ System
            if (Str::startsWith($uri, 'v1/logs')) {
                return ['⚙️ System — Logs'];
            }

            // Fallback
            $className = $routeInfo->className();
            return [$className
                ? (string) Str::of(class_basename($className))->replace('Controller', '')
                : 'General'
            ];
        });

        /*
        |----------------------------------------------------------------------
        | Security scheme — Bearer token used by Passport.
        |----------------------------------------------------------------------
        */
        Scramble::afterOpenApiGenerated(function (OpenApi $openApi) {
            $openApi->secure(
                SecurityScheme::http('bearer', 'JWT')
                    ->as('bearerAuth')
                    ->setDescription('Use "Bearer {token}" in Authorization header.')
            );
        });
    }
}

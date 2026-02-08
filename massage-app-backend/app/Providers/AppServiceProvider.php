<?php

namespace App\Providers;

use App\Contracts\OtpSender;
use App\Contracts\EmailCodeSender;
use App\Contracts\PasswordResetCodeSender;
use App\Services\Auth\LogOtpSender;
use App\Services\Auth\LogEmailCodeSender;
use App\Services\Auth\SmtpEmailCodeSender;
use App\Services\Auth\LogPasswordResetCodeSender;
use App\Services\Auth\SmtpPasswordResetCodeSender;
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
        $this->app->bind(OtpSender::class, LogOtpSender::class);
        $this->app->bind(EmailCodeSender::class, function () {
            $mailer = config('mail.default', 'log');

            if ($mailer === 'log' || $mailer === 'array') {
                return new LogEmailCodeSender();
            }

            return new SmtpEmailCodeSender();
        });

        $this->app->bind(PasswordResetCodeSender::class, function () {
            $mailer = config('mail.default', 'log');

            if ($mailer === 'log' || $mailer === 'array') {
                return new LogPasswordResetCodeSender();
            }

            return new SmtpPasswordResetCodeSender();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Scramble::resolveTagsUsing(function (RouteInfo $routeInfo, Operation $operation): array {
            $uri = ltrim($routeInfo->route->uri(), '/');

            if (Str::startsWith($uri, ['auth', 'api/auth'])) {
                $middlewares = $routeInfo->route->middleware();
                $isProtected = collect($middlewares)->contains(
                    fn (string $mw) => Str::startsWith($mw, 'auth:') || $mw === 'auth'
                );

                return [$isProtected ? 'Auth - Protected' : 'Auth - Public'];
            }

            $className = $routeInfo->className();
            $defaultTag = $className
                ? (string) Str::of(class_basename($className))->replace('Controller', '')
                : 'General';

            return [$defaultTag];
        });

        Scramble::afterOpenApiGenerated(function (OpenApi $openApi) {
            $openApi->secure(
                SecurityScheme::http('bearer', 'JWT')
                    ->as('bearerAuth')
                    ->setDescription('Use "Bearer {token}" in Authorization header.')
            );
        });
    }
}

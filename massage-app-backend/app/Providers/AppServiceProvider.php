<?php

namespace App\Providers;

use App\Contracts\OtpSender;
use App\Contracts\EmailCodeSender;
use App\Services\Auth\LogOtpSender;
use App\Services\Auth\LogEmailCodeSender;
use Dedoc\Scramble\Scramble;
use Dedoc\Scramble\Support\Generator\OpenApi;
use Dedoc\Scramble\Support\Generator\SecurityScheme;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(OtpSender::class, LogOtpSender::class);
        $this->app->bind(EmailCodeSender::class, LogEmailCodeSender::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Scramble::afterOpenApiGenerated(function (OpenApi $openApi) {
            $openApi->secure(
                SecurityScheme::http('bearer', 'JWT')
                    ->as('bearerAuth')
                    ->setDescription('Use "Bearer {token}" in Authorization header.')
            );
        });
    }
}

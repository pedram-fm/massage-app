<?php

namespace App\Modules\Shared\Providers;

use App\Modules\Auth\Contracts\EmailCodeSender;
use App\Modules\Auth\Contracts\OtpSender;
use App\Modules\Auth\Contracts\OtpServiceInterface;
use App\Modules\Auth\Contracts\PasswordResetCodeSender;
use App\Modules\Auth\Services\LogEmailCodeSender;
use App\Modules\Auth\Services\LogOtpSender;
use App\Modules\Auth\Services\LogPasswordResetCodeSender;
use App\Modules\Auth\Services\OtpService;
use App\Modules\Auth\Services\SmtpEmailCodeSender;
use App\Modules\Auth\Services\SmtpPasswordResetCodeSender;
use App\Modules\Users\Contracts\UserRepositoryInterface;
use App\Modules\Users\Repositories\UserRepository;
use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Register module bindings.
     */
    public function register(): void
    {
        // Auth module bindings
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

        $this->app->bind(OtpServiceInterface::class, OtpService::class);

        // Users module bindings
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
    }

    /**
     * Bootstrap module services (load routes, etc.).
     */
    public function boot(): void
    {
        $this->loadModuleRoutes();
    }

    /**
     * Automatically load routes from each module's Routes directory.
     */
    protected function loadModuleRoutes(): void
    {
        $modulesPath = app_path('Modules');

        if (!is_dir($modulesPath)) {
            return;
        }

        $modules = array_filter(scandir($modulesPath), function ($dir) use ($modulesPath) {
            return $dir !== '.' && $dir !== '..' && is_dir($modulesPath . '/' . $dir);
        });

        foreach ($modules as $module) {
            $routeFile = $modulesPath . '/' . $module . '/Routes/api.php';
            if (file_exists($routeFile)) {
                $this->loadRoutesFrom($routeFile);
            }
        }
    }
}

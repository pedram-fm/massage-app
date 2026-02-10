<?php

namespace App\Http\Controllers;

use App\Actions\Auth\RequestOtpAction;
use App\Actions\Auth\RegisterRequestAction;
use App\Actions\Auth\LoginAction;
use App\Actions\Auth\VerifyEmailAction;
use App\Actions\Auth\VerifyOtpAction;
use App\Actions\Auth\RequestEmailVerificationAction;
use App\Actions\Auth\UpdateProfileAction;
use App\Actions\Auth\RequestPasswordResetAction;
use App\Actions\Auth\VerifyPasswordResetAction;
use App\Actions\Auth\ResetPasswordAction;
use App\Exceptions\EmailVerificationExpiredException;
use App\Exceptions\EmailVerificationInvalidException;
use App\Exceptions\EmailNotVerifiedException;
use App\Exceptions\InvalidCredentialsException;
use App\Exceptions\PhoneNotVerifiedException;
use App\Exceptions\OtpExpiredException;
use App\Exceptions\OtpInvalidException;
use App\Exceptions\PasswordResetExpiredException;
use App\Exceptions\PasswordResetInvalidException;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\RequestOtpRequest;
use App\Http\Requests\Auth\EmailVerificationResendRequest;
use App\Http\Requests\Auth\VerifyEmailRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Http\Requests\Auth\PasswordForgotRequest;
use App\Http\Requests\Auth\PasswordVerifyRequest;
use App\Http\Requests\Auth\PasswordResetRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function __construct(
        private readonly RequestOtpAction $requestOtpAction,
        private readonly RegisterRequestAction $registerRequestAction,
        private readonly LoginAction $loginAction,
        private readonly VerifyEmailAction $verifyEmailAction,
        private readonly VerifyOtpAction $verifyOtpAction,
        private readonly RequestEmailVerificationAction $requestEmailVerificationAction,
        private readonly UpdateProfileAction $updateProfileAction,
        private readonly RequestPasswordResetAction $requestPasswordResetAction,
        private readonly VerifyPasswordResetAction $verifyPasswordResetAction,
        private readonly ResetPasswordAction $resetPasswordAction,
    ) {
    }

    /**
     * Request OTP by phone (login or phone registration).
     *
     * @group Auth (Public)
     * @unauthenticated
     * @bodyParam phone string required User phone number.
     * @bodyParam f_name string User first name.
     * @bodyParam l_name string User last name.
     * @bodyParam username string User username.
     * @bodyParam email string User email.
     * @response 200 {"message":"OTP sent","otp_debug":"123456"}
     */
    #[Group('Auth (Public)', weight: 1)]
    public function requestOtp(RequestOtpRequest $request): JsonResponse
    {
        $data = $request->validated();
        $limitKey = $this->rateLimitKey('otp-request', $data['phone'], $request);
        if ($response = $this->hitRateLimit($limitKey, 3, 60)) {
            return $response;
        }

        $result = $this->requestOtpAction->execute(
            \App\DTOs\Auth\OtpRequestData::fromRequest($request)
        );

        $response = ['message' => 'کد یکبار مصرف ارسال شد'];

        if (config('app.env') === 'local') {
            $response['otp_debug'] = $result['otp'];
        }

        return response()->json($response);
    }

    /**
     * Verify OTP and issue access token.
     *
     * @group Auth (Public)
     * @unauthenticated
     * @bodyParam phone string required User phone number.
     * @bodyParam otp string required 6-digit OTP.
     * @response 200 {"message":"Password changed successfully"}
     */
    #[Group('Auth (Public)', weight: 1)]
    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $data = $request->validated();

        try {
            $result = $this->verifyOtpAction->execute(
                $data['phone'],
                $data['otp'],
            );
        } catch (OtpExpiredException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        } catch (OtpInvalidException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json($result);
    }

    /**
     * Register user and send email verification code or phone OTP.
     *
     * @group Auth (Public)
     * @unauthenticated
     * @bodyParam f_name string required User first name.
     * @bodyParam l_name string required User last name.
     * @bodyParam username string required Username.
     * @bodyParam email string User email (required if phone not provided).
     * @bodyParam phone string User phone (required if email not provided).
     * @bodyParam password string required User password.
     * @bodyParam password_confirmation string required Must match password.
     * @response 200 {"message":"Verification code sent","code_debug":"123456"}
     * @response 200 {"message":"OTP sent","otp_debug":"123456"}
     */
    #[Group('Auth (Public)', weight: 1)]
    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->registerRequestAction->execute(
            \App\DTOs\Auth\UserRegistrationData::fromRequest($request)
        );

        $response = [
            'message' => $result['channel'] === 'email' ? 'کد تایید ایمیل ارسال شد' : 'کد یکبار مصرف ارسال شد',
        ];

        if (config('app.env') === 'local') {
            if ($result['channel'] === 'email') {
                $response['code_debug'] = $result['code'];
            } else {
                $response['otp_debug'] = $result['otp'];
            }
        }

        return response()->json($response);
    }

    /**
     * Login with email or phone and password.
     *
     * @group Auth (Public)
     * @unauthenticated
     * @bodyParam email string User email.
     * @bodyParam phone string User phone.
     * @bodyParam password string required User password.
     * @response 422 {"message":"Email not verified"}
     * @response 422 {"message":"Phone not verified"}
     * @response 200 {"token_type":"Bearer","access_token":"...","expires_at":"2026-02-07 12:00:00","user":{"id":1}}
     */
    #[Group('Auth (Public)', weight: 1)]
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->loginAction->execute(
                \App\DTOs\Auth\UserLoginData::fromRequest($request)
            );
        } catch (InvalidCredentialsException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        } catch (EmailNotVerifiedException | PhoneNotVerifiedException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json($result);
    }

    /**
     * Verify email code and finish registration.
     *
     * @group Auth (Public)
     * @unauthenticated
     * @bodyParam email string required User email.
     * @bodyParam code string required 6-digit code.
     * @response 200 {"token_type":"Bearer","access_token":"...","expires_at":"2026-02-07 12:00:00","user":{"id":1}}
     */
    #[Group('Auth (Public)', weight: 1)]
    public function verifyEmail(VerifyEmailRequest $request): JsonResponse
    {
        $data = $request->validated();

        try {
            $result = $this->verifyEmailAction->execute($data['email'], $data['code']);
        } catch (EmailVerificationExpiredException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        } catch (EmailVerificationInvalidException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json($result);
    }

    /**
     * Resend email verification code.
     *
     * @group Auth (Public)
     * @unauthenticated
     * @bodyParam email string required User email.
     * @response 200 {"message":"If your email exists, a verification code was sent","code_debug":"123456"}
     */
    #[Group('Auth (Public)', weight: 1)]
    public function resendEmailVerification(EmailVerificationResendRequest $request): JsonResponse
    {
        $data = $request->validated();
        $limitKey = $this->rateLimitKey('email-verify-resend', $data['email'], $request);
        if ($response = $this->hitRateLimit($limitKey, 3, 60)) {
            return $response;
        }

        $code = $this->requestEmailVerificationAction->execute($data['email']);

        $response = ['message' => 'اگر ایمیل شما وجود داشته باشد، کد تایید ارسال می‌شود'];

        if (config('app.env') === 'local' && $code) {
            $response['code_debug'] = $code;
        }

        return response()->json($response);
    }

    /**
     * Request password reset code by email.
     *
     * @group Auth (Public)
     * @unauthenticated
     * @bodyParam email string required User email.
     * @response 200 {"message":"If your email exists, a reset code was sent","code_debug":"123456"}
     */
    #[Group('Auth (Public)', weight: 1)]
    public function requestPasswordReset(PasswordForgotRequest $request): JsonResponse
    {
        $data = $request->validated();
        $limitKey = $this->rateLimitKey('password-reset', $data['email'], $request);
        if ($response = $this->hitRateLimit($limitKey, 3, 60)) {
            return $response;
        }
        $code = $this->requestPasswordResetAction->execute($data['email']);

        $response = ['message' => 'اگر ایمیل شما وجود داشته باشد، کد بازیابی ارسال می‌شود'];

        if (config('app.env') === 'local' && $code) {
            $response['code_debug'] = $code;
        }

        return response()->json($response);
    }

    /**
     * Verify password reset code.
     *
     * @group Auth (Public)
     * @unauthenticated
     * @bodyParam email string required User email.
     * @bodyParam code string required 6-digit code.
     * @response 200 {"message":"Code verified"}
     */
    #[Group('Auth (Public)', weight: 1)]
    public function verifyPasswordReset(PasswordVerifyRequest $request): JsonResponse
    {
        $data = $request->validated();

        try {
            $this->verifyPasswordResetAction->execute($data['email'], $data['code']);
        } catch (PasswordResetExpiredException | PasswordResetInvalidException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'کد تایید شد']);
    }

    /**
     * Reset password using email and code.
     *
     * @group Auth (Public)
     * @unauthenticated
     * @bodyParam email string required User email.
     * @bodyParam code string required 6-digit code.
     * @bodyParam password string required User password.
     * @bodyParam password_confirmation string required Must match password.
     * @response 200 {"token_type":"Bearer","access_token":"...","expires_at":"2026-02-07 12:00:00","user":{"id":1}}
     */
    #[Group('Auth (Public)', weight: 1)]
    public function resetPassword(PasswordResetRequest $request): JsonResponse
    {
        $data = $request->validated();

        try {
            $result = $this->resetPasswordAction->execute(
                $data['email'],
                $data['code'],
                $data['password'],
            );
        } catch (PasswordResetExpiredException | PasswordResetInvalidException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json($result + ['message' => 'رمز عبور با موفقیت تغییر کرد']);
    }

    private function hitRateLimit(string $key, int $maxAttempts, int $decaySeconds): ?JsonResponse
    {
        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            $retryAfter = RateLimiter::availableIn($key);

            return response()->json([
                'message' => 'تعداد درخواست‌ها زیاد است. لطفاً کمی بعد دوباره تلاش کنید.',
                'retry_after' => $retryAfter,
            ], 429);
        }

        RateLimiter::hit($key, $decaySeconds);

        return null;
    }

    private function rateLimitKey(string $prefix, string $identifier, Request $request): string
    {
        return sprintf(
            '%s|%s|%s',
            $prefix,
            Str::lower($identifier),
            $request->ip() ?? 'unknown',
        );
    }

    /**
     * Get current authenticated user.
     *
     * @group Auth (Protected)
     * @authenticated
     * @response 200 {"id":1,"phone":"09...","f_name":"Ali"}
     */
    #[Group('Auth (Protected)', weight: 2)]
    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    /**
     * Update current user profile.
     *
     * @group Auth (Protected)
     * @authenticated
     * @bodyParam f_name string required User first name.
     * @bodyParam l_name string required User last name.
     * @bodyParam username string required Username.
     * @bodyParam bio string User bio.
     * @bodyParam avatar_url string User avatar image URL.
     * @response 200 {"message":"Profile updated","user":{"id":1}}
     */
    #[Group('Auth (Protected)', weight: 2)]
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $this->updateProfileAction->execute($request->user(), $request->validated());

        return response()->json([
            'message' => 'پروفایل با موفقیت به‌روزرسانی شد',
            'user' => $user,
        ]);
    }

    /**
     * Logout current user.
     *
     * @group Auth (Protected)
     * @authenticated
     * @response 200 {"message":"Logged out"}
     */
    #[Group('Auth (Protected)', weight: 2)]
    public function logout(Request $request): JsonResponse
    {
        $token = $request->user()?->token();

        if ($token) {
            $token->revoke();
        }

        return response()->json(['message' => 'خروج با موفقیت انجام شد']);
    }
}

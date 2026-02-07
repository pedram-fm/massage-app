<?php

namespace App\Http\Controllers;

use App\Actions\Auth\RequestOtpAction;
use App\Actions\Auth\RegisterRequestAction;
use App\Actions\Auth\VerifyEmailAction;
use App\Actions\Auth\VerifyOtpAction;
use App\Exceptions\EmailVerificationExpiredException;
use App\Exceptions\EmailVerificationInvalidException;
use App\Exceptions\OtpExpiredException;
use App\Exceptions\OtpInvalidException;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\RequestOtpRequest;
use App\Http\Requests\Auth\VerifyEmailRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private readonly RequestOtpAction $requestOtpAction,
        private readonly RegisterRequestAction $registerRequestAction,
        private readonly VerifyEmailAction $verifyEmailAction,
        private readonly VerifyOtpAction $verifyOtpAction,
    ) {
    }

    /**
     * Request OTP by phone.
     *
     * @group Auth
     * @unauthenticated
     * @bodyParam phone string required User phone number.
     * @bodyParam f_name string User first name.
     * @bodyParam l_name string User last name.
     * @bodyParam username string User username.
     * @bodyParam email string User email.
     * @response 200 {"message":"OTP sent","otp_debug":"123456"}
     */
    public function requestOtp(RequestOtpRequest $request): JsonResponse
    {
        $result = $this->requestOtpAction->execute($request->validated());

        $response = ['message' => 'OTP sent'];

        if (config('app.env') === 'local') {
            $response['otp_debug'] = $result['otp'];
        }

        return response()->json($response);
    }

    /**
     * Verify OTP and issue access token.
     *
     * @group Auth
     * @unauthenticated
     * @bodyParam phone string required User phone number.
     * @bodyParam otp string required 6-digit OTP.
     * @response 200 {"token_type":"Bearer","access_token":"...","expires_at":"2026-02-07 12:00:00","user":{"id":1}}
     */
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
     * Register user and send email verification code.
     *
     * @group Auth
     * @unauthenticated
     * @bodyParam f_name string required User first name.
     * @bodyParam l_name string required User last name.
     * @bodyParam username string required Username.
     * @bodyParam email string required User email.
     * @bodyParam password string required User password.
     * @bodyParam password_confirmation string required Must match password.
     * @response 200 {"message":"Verification code sent","code_debug":"123456"}
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->registerRequestAction->execute($request->validated());

        $response = ['message' => 'Verification code sent'];

        if (config('app.env') === 'local') {
            $response['code_debug'] = $result['code'];
        }

        return response()->json($response);
    }

    /**
     * Verify email code and finish registration.
     *
     * @group Auth
     * @unauthenticated
     * @bodyParam email string required User email.
     * @bodyParam code string required 6-digit code.
     * @response 200 {"token_type":"Bearer","access_token":"...","expires_at":"2026-02-07 12:00:00","user":{"id":1}}
     */
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
     * Get current authenticated user.
     *
     * @group Auth
     * @authenticated
     * @response 200 {"id":1,"phone":"09...","f_name":"Ali"}
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }
}

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { API_CONFIG } from "@/modules/shared/config/constants";
import { ROUTES, getDashboardRoute } from "@/modules/shared/navigation/routes";
import type { User } from "@/modules/auth/types/auth";

/** Safely parse JSON from a Response — returns null on failure */
async function readJsonSafe<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

type ApiErrorShape = {
    message?: string;
    errors?: {
        email?: string[];
        phone?: string[];
        username?: string[];
    };
};

type AuthSuccessShape = {
    access_token?: string;
    token_type?: string;
    user?: User;
    code_debug?: string;
    message?: string;
};

type RegisterPayload = Record<string, string | undefined>;
type VerifyPayload = Record<string, string | undefined>;
type ResendPayload = Record<string, string | undefined>;

export function useAuthApi() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const register = async (payload: RegisterPayload) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/v1/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await readJsonSafe<AuthSuccessShape & ApiErrorShape>(response);

            if (!response.ok) {
                const message =
                    data?.message ||
                    data?.errors?.email?.[0] ||
                    data?.errors?.phone?.[0] ||
                    data?.errors?.username?.[0] ||
                    "خطا در ثبت نام";
                toast.error(message);
                return { ok: false };
            }

            return { ok: true, data };
        } catch (error) {
            console.error("Register error:", error);
            toast.error("خطا در اتصال به سرور");
            return { ok: false };
        } finally {
            setIsSubmitting(false);
        }
    };

    const verify = async (endpoint: string, payload: VerifyPayload) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await readJsonSafe<AuthSuccessShape & ApiErrorShape>(response);

            if (!response.ok) {
                return { ok: false, message: data?.message || "کد نامعتبر است" };
            }

            if (data?.access_token) {
                // Use tokenManager — same cookie-based storage as everywhere else
                const tokenManager = await import('@/modules/auth/utils/tokenManager');
                tokenManager.setToken(data.access_token, data.token_type ?? 'Bearer');
                if (data.user) {
                  tokenManager.setUser(data.user);
                }
            }

            toast.success("ثبت نام با موفقیت انجام شد");
            
            const user = data?.user;
            router.push(getDashboardRoute(user?.role?.name));
            
            return { ok: true };
        } catch {
            return { ok: false, message: "خطا در اتصال به سرور" };
        }
    };

    const resend = async (endpoint: string, payload: ResendPayload) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await readJsonSafe<AuthSuccessShape & ApiErrorShape>(response);

            if (!response.ok) {
                return { ok: false, message: data?.message || "ارسال مجدد ناموفق بود" };
            }

            if (data?.code_debug) {
                toast.info(`کد تستی: ${data.code_debug}`);
            }

            return { ok: true };
        } catch {
            return { ok: false, message: "خطا در اتصال به سرور" };
        }
    };

    return {
        isSubmitting,
        register,
        verify,
        resend,
    };
}

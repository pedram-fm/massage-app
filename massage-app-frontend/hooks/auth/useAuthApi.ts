import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getApiBaseUrl, readJsonSafe } from "@/lib/api";

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
    user?: Record<string, unknown>;
    code_debug?: string;
    message?: string;
};

type RegisterPayload = Record<string, string | undefined>;
type VerifyPayload = Record<string, string | undefined>;
type ResendPayload = Record<string, string | undefined>;

export function useAuthApi() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
    const router = useRouter();

    const register = async (payload: RegisterPayload) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
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
            const response = await fetch(`${apiBaseUrl}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await readJsonSafe<AuthSuccessShape & ApiErrorShape>(response);

            if (!response.ok) {
                return { ok: false, message: data?.message || "کد نامعتبر است" };
            }

            if (data?.access_token) {
                localStorage.setItem("auth_token", data.access_token);
                localStorage.setItem("token_type", data.token_type ?? "Bearer");
            }
            if (data?.user) {
                localStorage.setItem("auth_user", JSON.stringify(data.user));
            }

            toast.success("ثبت نام با موفقیت انجام شد");
            
            // Role-based redirect
            const user = data?.user as any;
            const roleName = user?.role?.name;
            
            if (roleName === "admin") {
                router.push("/admin/users");
            } else if (roleName === "masseur" || roleName === "masseuse") {
                router.push("/dashboard");
            } else {
                router.push("/dashboard");
            }
            
            return { ok: true };
        } catch (error) {
            console.error("Verify error:", error);
            return { ok: false, message: "خطا در اتصال به سرور" };
        }
    };

    const resend = async (endpoint: string, payload: ResendPayload) => {
        try {
            const response = await fetch(`${apiBaseUrl}${endpoint}`, {
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
        } catch (error) {
            console.error("Resend error:", error);
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

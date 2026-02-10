import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useAuthApi() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
    const router = useRouter();

    const register = async (payload: Record<string, any>) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => ({}));

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

    const verify = async (endpoint: string, payload: Record<string, any>) => {
        try {
            const response = await fetch(`${apiBaseUrl}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => ({}));

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
            router.push("/dashboard");
            return { ok: true };
        } catch (error) {
            console.error("Verify error:", error);
            return { ok: false, message: "خطا در اتصال به سرور" };
        }
    };

    const resend = async (endpoint: string, payload: Record<string, any>) => {
        try {
            const response = await fetch(`${apiBaseUrl}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => ({}));

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

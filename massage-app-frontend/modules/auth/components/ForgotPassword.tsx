"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { OTPModal } from "./OTPModal";
import { toast } from "sonner";
import { API_CONFIG } from "@/modules/shared/config/constants";

interface ForgotPasswordProps {
  onBack: () => void;
  isDark: boolean;
}

export function ForgotPassword({ onBack, isDark }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"request" | "reset">("request");
  const [resetCode, setResetCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const apiBaseUrl = API_CONFIG.BASE_URL;

  const resetFlow = () => {
    setEmail("");
    setEmailError("");
    setShowOTPModal(false);
    setStep("request");
    setResetCode("");
    setPassword("");
    setPasswordConfirm("");
    setPasswordError("");
    setConfirmError("");
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!email) {
      setEmailError("ایمیل الزامی است");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("ایمیل معتبر وارد کنید");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/v1/auth/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data?.message || "خطا در ارسال کد");
        return;
      }

      if (data?.code_debug) {
        toast.info(`کد تستی: ${data.code_debug}`);
      } else {
        toast.success("کد تایید ارسال شد");
      }

      setShowOTPModal(true);
    } catch {
      toast.error("خطا در اتصال به سرور");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPVerified = async (otp: string) => {
    const response = await fetch(`${apiBaseUrl}/v1/auth/password/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, code: otp }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { ok: false, message: data?.message || "کد نامعتبر است" };
    }

    setResetCode(otp);
    setShowOTPModal(false);
    setStep("reset");
    return { ok: true };
  };

  const handleResend = async () => {
    const response = await fetch(`${apiBaseUrl}/v1/auth/password/forgot`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { ok: false, message: data?.message || "ارسال مجدد ناموفق بود" };
    }

    if (data?.code_debug) {
      toast.info(`کد تستی: ${data.code_debug}`);
    }

    return { ok: true };
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmError("");

    let hasError = false;
    if (!password) {
      setPasswordError("رمز عبور الزامی است");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("رمز عبور حداقل ۸ کاراکتر باشد");
      hasError = true;
    }

    if (!passwordConfirm) {
      setConfirmError("تکرار رمز عبور الزامی است");
      hasError = true;
    } else if (passwordConfirm !== password) {
      setConfirmError("رمزها یکسان نیست");
      hasError = true;
    }

    if (hasError) {
      toast.error("لطفا اطلاعات را بررسی کنید");
      return;
    }

    setIsResetting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/v1/auth/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email,
          code: resetCode,
          password,
          password_confirmation: passwordConfirm,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data?.message || "خطا در تغییر رمز عبور");
        return;
      }

      toast.success("رمز عبور با موفقیت تغییر کرد. لطفا وارد شوید.");
      resetFlow();
      onBack();
    } catch {
      toast.error("خطا در اتصال به سرور");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-sm">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-[color:var(--muted-text)] hover:text-[color:var(--brand)] mb-8 transition-colors duration-300"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
        >
          <ArrowRight className="w-5 h-5" />
          بازگشت به ورود
        </motion.button>

        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[color:var(--accent-strong)] rounded-full mb-3 shadow-md">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl mb-1 transition-colors duration-300">فراموشی رمز عبور</h1>
          <p className="text-sm text-[color:var(--muted-text)] transition-colors duration-300">
            ایمیل خود را وارد کنید تا کد تأیید ارسال شود
          </p>
        </motion.div>

        <motion.div
          className="bg-[color:var(--card)]/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 transition-colors duration-300 border border-[color:var(--surface-muted)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {step === "request" ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-xs text-[color:var(--muted-text)] mb-2 transition-colors duration-300"
                  >
                    ایمیل
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="forgot-email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                      className={`w-full px-3 py-2.5 border ${
                        emailError
                          ? "border-red-500 focus:ring-red-500"
                          : "border-[color:var(--surface-muted)] focus:ring-[color:var(--accent)]"
                      } bg-[color:var(--card)] text-[color:var(--brand)] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 pl-9 text-sm`}
                      placeholder="you@example.com"
                    />
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[color:var(--muted-text)]" />
                  </div>
                  {emailError && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {emailError}
                    </motion.p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[color:var(--brand)] text-[color:var(--brand-foreground)] py-2.5 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? "در حال ارسال..." : "ارسال کد تأیید"}
                </motion.button>
              </form>

              <motion.p
                className="text-center text-[color:var(--muted-text)] text-xs mt-4 transition-colors duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                کد ۶ رقمی به ایمیل شما ارسال می‌شود
              </motion.p>
            </>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label
                  htmlFor="reset-password"
                  className="block text-xs text-[color:var(--muted-text)] mb-2 transition-colors duration-300"
                >
                  رمز عبور جدید
                </label>
                <input
                  type="password"
                  id="reset-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className={`w-full px-3 py-2.5 border ${
                    passwordError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[color:var(--surface-muted)] focus:ring-[color:var(--accent)]"
                  } bg-[color:var(--card)] text-[color:var(--brand)] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-sm`}
                  placeholder="••••••••"
                />
                {passwordError && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {passwordError}
                  </motion.p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reset-password-confirm"
                  className="block text-xs text-[color:var(--muted-text)] mb-2 transition-colors duration-300"
                >
                  تکرار رمز عبور
                </label>
                <input
                  type="password"
                  id="reset-password-confirm"
                  value={passwordConfirm}
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value);
                    setConfirmError("");
                  }}
                  className={`w-full px-3 py-2.5 border ${
                    confirmError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[color:var(--surface-muted)] focus:ring-[color:var(--accent)]"
                  } bg-[color:var(--card)] text-[color:var(--brand)] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-sm`}
                  placeholder="••••••••"
                />
                {confirmError && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {confirmError}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isResetting}
                className="w-full bg-[color:var(--brand)] text-[color:var(--brand-foreground)] py-2.5 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                whileHover={!isResetting ? { scale: 1.02 } : {}}
                whileTap={!isResetting ? { scale: 0.98 } : {}}
              >
                {isResetting ? "در حال تغییر..." : "تغییر رمز عبور"}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showOTPModal && (
          <OTPModal
            target={email}
            mode="email"
            onClose={() => setShowOTPModal(false)}
            onVerify={handleOTPVerified}
            onResend={handleResend}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
    </>
  );
}

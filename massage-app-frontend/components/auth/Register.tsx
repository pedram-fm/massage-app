"use client";

import { useState } from "react";
import { ArrowRight, User, Mail } from "lucide-react";
import { motion } from "motion/react";
import { OTPModal } from "./OTPModal";
import { useRegisterForm } from "@/hooks/auth/useRegisterForm";
import { useAuthApi } from "@/hooks/auth/useAuthApi";
import { AuthInput } from "@/components/auth/AuthInput";
import { PasswordInput } from "@/components/auth/PasswordInput";

interface RegisterProps {
  onBack: () => void;
  isDark: boolean;
}

export function Register({ onBack, isDark }: RegisterProps) {
  const { formData, errors, handleChange, validate } = useRegisterForm();
  const { isSubmitting, register, verify, resend } = useAuthApi();

  const [verifyTarget, setVerifyTarget] = useState("");
  const [verifyMode, setVerifyMode] = useState<"email" | "phone">("email");
  const [registerPayload, setRegisterPayload] = useState<Record<string, string>>({});
  const [showOTPModal, setShowOTPModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const isEmail = formData.identifier.includes("@");
    const payload: Record<string, string> = {
      f_name: formData.firstName,
      l_name: formData.lastName,
      username: formData.username,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
    };

    if (isEmail) {
      payload.email = formData.identifier;
    } else {
      payload.phone = formData.identifier.replace(/[^\d+]/g, "");
    }

    const result = await register(payload);

    if (result.ok) {
      setRegisterPayload(payload);
      setVerifyTarget(isEmail ? payload.email : payload.phone || "");
      setVerifyMode(isEmail ? "email" : "phone");
      setShowOTPModal(true);
    }
  };

  const handleOTPVerified = async (otp: string) => {
    const isEmail = verifyMode === "email";
    const payload = isEmail
      ? { email: registerPayload.email, code: otp }
      : { phone: registerPayload.phone, otp };

    const endpoint = isEmail ? "/api/auth/register/verify" : "/api/auth/otp/verify";
    return await verify(endpoint, payload);
  };

  const handleResend = async () => {
    const isEmail = verifyMode === "email";
    const endpoint = isEmail ? "/api/auth/register/resend" : "/api/auth/otp/request";
    const payload = isEmail
      ? { email: registerPayload.email }
      : {
        phone: registerPayload.phone,
        f_name: registerPayload.f_name,
        l_name: registerPayload.l_name,
        username: registerPayload.username,
        email: registerPayload.email,
      };

    return await resend(endpoint, payload);
  };

  return (
    <>
      <div className="w-full max-w-xl">
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
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl mb-1 transition-colors duration-300">ساخت حساب کاربری</h1>
          <p className="text-sm text-[color:var(--muted-text)] transition-colors duration-300">
            به جمع آرامش جویان ما بپیوندید
          </p>
        </motion.div>

        <motion.div
          className="bg-[color:var(--card)]/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 transition-colors duration-300 border border-[color:var(--surface-muted)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              id="register-identifier"
              label="ایمیل یا شماره تلفن"
              value={formData.identifier}
              onChange={(e) => handleChange("identifier", e.target.value)}
              error={errors.identifier}
              icon={Mail}
              placeholder="you@example.com یا 09123456789"
              delay={0.3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <AuthInput
                id="firstName"
                label="نام"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                error={errors.firstName}
                placeholder="سارا"
                delay={0.4}
              />
              <AuthInput
                id="lastName"
                label="نام خانوادگی"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                error={errors.lastName}
                placeholder="محمدی"
                delay={0.45}
              />
            </div>

            <AuthInput
              id="username"
              label="نام کاربری"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              error={errors.username}
              icon={User}
              placeholder="saramohammadi"
              delay={0.5}
            />

            <PasswordInput
              id="register-password"
              label="رمز عبور"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={errors.password}
              placeholder="••••••••"
              delay={0.55}
            />

            <PasswordInput
              id="confirmPassword"
              label="تکرار رمز عبور"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
              placeholder="••••••••"
              delay={0.6}
            />

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[color:var(--brand)] text-[color:var(--brand-foreground)] py-2.5 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.65 }}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? "در حال ساخت حساب..." : "ساخت حساب"}
            </motion.button>
          </form>

          <motion.p
            className="text-center text-[color:var(--muted-text)] text-xs mt-5 transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            حساب دارید؟{" "}
            <button
              onClick={onBack}
              className="text-[color:var(--accent-strong)] hover:text-[color:var(--brand)] transition-colors duration-300"
            >
              ورود
            </button>
          </motion.p>
        </motion.div>
      </div>

      {showOTPModal && (
        <OTPModal
          target={verifyTarget}
          mode={verifyMode}
          onClose={() => setShowOTPModal(false)}
          onVerify={handleOTPVerified}
          onResend={handleResend}
          isDark={isDark}
        />
      )}
    </>
  );
}

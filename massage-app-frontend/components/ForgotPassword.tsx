"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { OTPModal } from "./OTPModal";

interface ForgotPasswordProps {
  onBack: () => void;
  isDark: boolean;
}

export function ForgotPassword({ onBack, isDark }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    setTimeout(() => {
      setIsSubmitting(false);
      setShowOTPModal(true);
    }, 1000);
  };

  const handleOTPVerified = (otp: string) => {
    console.log("OTP verified:", otp);
    setShowOTPModal(false);
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
            ایمیل خود را وارد کنید تا کد تایید ارسال شود
          </p>
        </motion.div>

        <motion.div
          className="bg-[color:var(--card)]/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 transition-colors duration-300 border border-[color:var(--surface-muted)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
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
              {isSubmitting ? "در حال ارسال..." : "ارسال کد تایید"}
            </motion.button>
          </form>

          <motion.p
            className="text-center text-[color:var(--muted-text)] text-xs mt-4 transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            کد ۶ رقمی به ایمیل شما ارسال می شود
          </motion.p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showOTPModal && (
          <OTPModal
            email={email}
            onClose={() => setShowOTPModal(false)}
            onVerify={handleOTPVerified}
            isDark={isDark}
          />
        )}
      </AnimatePresence>
    </>
  );
}

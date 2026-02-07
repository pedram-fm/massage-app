"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { motion } from "motion/react";
import { OTPModal } from "./OTPModal";
import { toast } from "sonner";

interface RegisterProps {
  onBack: () => void;
  isDark: boolean;
}

export function Register({ onBack, isDark }: RegisterProps) {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      confirmPassword: "",
    };

    let hasError = false;

    if (!formData.email) {
      newErrors.email = "ایمیل الزامی است";
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "ایمیل معتبر وارد کنید";
      hasError = true;
    }

    if (!formData.firstName) {
      newErrors.firstName = "نام الزامی است";
      hasError = true;
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "نام باید حداقل ۲ کاراکتر باشد";
      hasError = true;
    }

    if (!formData.lastName) {
      newErrors.lastName = "نام خانوادگی الزامی است";
      hasError = true;
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "نام خانوادگی باید حداقل ۲ کاراکتر باشد";
      hasError = true;
    }

    if (!formData.username) {
      newErrors.username = "نام کاربری الزامی است";
      hasError = true;
    } else if (!validateUsername(formData.username)) {
      newErrors.username = "۳ تا ۲۰ کاراکتر (حروف، عدد یا _)";
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = "رمز عبور الزامی است";
      hasError = true;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "رمز عبور حداقل ۸ کاراکتر باشد";
      hasError = true;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "تایید رمز عبور الزامی است";
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "رمزها یکسان نیستند";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowOTPModal(true);
    }, 1000);
  };

  const handleOTPVerified = (otp: string) => {
    console.log("OTP verified:", otp);
    console.log("Registration complete with data:", formData);
    setShowOTPModal(false);
    onBack();
    toast.success("ثبت نام با موفقیت انجام شد");
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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <label
                htmlFor="register-email"
                className="block text-xs text-[color:var(--muted-text)] mb-2 transition-colors duration-300"
              >
                ایمیل
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="register-email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`w-full px-3 py-2.5 border ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[color:var(--surface-muted)] focus:ring-[color:var(--accent)]"
                  } bg-[color:var(--card)] text-[color:var(--brand)] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 pl-9 text-sm`}
                  placeholder="you@example.com"
                />
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[color:var(--muted-text)]" />
              </div>
              {errors.email && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <label
                  htmlFor="firstName"
                  className="block text-xs text-[color:var(--muted-text)] mb-2 transition-colors duration-300"
                >
                  نام
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className={`w-full px-3 py-2.5 border ${
                    errors.firstName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[color:var(--surface-muted)] focus:ring-[color:var(--accent)]"
                  } bg-[color:var(--card)] text-[color:var(--brand)] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-sm`}
                  placeholder="سارا"
                />
                {errors.firstName && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.firstName}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
              >
                <label
                  htmlFor="lastName"
                  className="block text-xs text-[color:var(--muted-text)] mb-2 transition-colors duration-300"
                >
                  نام خانوادگی
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className={`w-full px-3 py-2.5 border ${
                    errors.lastName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[color:var(--surface-muted)] focus:ring-[color:var(--accent)]"
                  } bg-[color:var(--card)] text-[color:var(--brand)] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-sm`}
                  placeholder="محمدی"
                />
                {errors.lastName && (
                  <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.lastName}
                  </motion.p>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <label
                htmlFor="username"
                className="block text-xs text-[color:var(--muted-text)] mb-2 transition-colors duration-300"
              >
                نام کاربری
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className={`w-full px-3 py-2.5 border ${
                    errors.username
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[color:var(--surface-muted)] focus:ring-[color:var(--accent)]"
                  } bg-[color:var(--card)] text-[color:var(--brand)] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 pl-9 text-sm`}
                  placeholder="saramohammadi"
                />
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[color:var(--muted-text)]" />
              </div>
              {errors.username && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.username}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.55 }}
            >
              <label
                htmlFor="register-password"
                className="block text-xs text-[color:var(--muted-text)] mb-2 transition-colors duration-300"
              >
                رمز عبور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="register-password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`w-full px-3 py-2.5 border ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[color:var(--surface-muted)] focus:ring-[color:var(--accent)]"
                  } bg-[color:var(--card)] text-[color:var(--brand)] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 pl-9 text-sm`}
                  placeholder="••••••••"
                />
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[color:var(--muted-text)]" />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-text)] hover:text-[color:var(--brand)] transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
              {errors.password && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <label
                htmlFor="confirmPassword"
                className="block text-xs text-[color:var(--muted-text)] mb-2 transition-colors duration-300"
              >
                تکرار رمز عبور
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className={`w-full px-3 py-2.5 border ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[color:var(--surface-muted)] focus:ring-[color:var(--accent)]"
                  } bg-[color:var(--card)] text-[color:var(--brand)] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 pl-9 text-sm`}
                  placeholder="••••••••"
                />
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[color:var(--muted-text)]" />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-text)] hover:text-[color:var(--brand)] transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </motion.div>

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
          email={formData.email}
          onClose={() => setShowOTPModal(false)}
          onVerify={handleOTPVerified}
          isDark={isDark}
        />
      )}
    </>
  );
}

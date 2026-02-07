"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ForgotPassword } from "@/components/ForgotPassword";
import { Register } from "@/components/Register";
import { FloatingElements } from "@/components/FloatingElements";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast, Toaster } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email) {
      setEmailError("ایمیل الزامی است");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("ایمیل معتبر وارد کنید");
      hasError = true;
    }

    if (!password) {
      setPasswordError("رمز عبور الزامی است");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("رمز عبور حداقل ۶ کاراکتر باشد");
      hasError = true;
    }

    if (hasError) {
      toast.error("لطفا اطلاعات ورود را بررسی کنید");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("خوش آمدید", {
        description: "آماده سفر آرامش باشید",
      });
      console.log("Login attempt:", { email, password });
      router.push("/dashboard");
    }, 1500);
  };

  if (showForgotPassword) {
    return (
      <>
        <Toaster position="top-center" richColors theme={isDark ? "dark" : "light"} />
        <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--brand)] flex items-center justify-center px-4 py-6 transition-colors duration-500 relative overflow-hidden">
          <FloatingElements isDark={isDark} />

          <div className="w-full max-w-sm">
            <div className="mb-6 flex items-center justify-between gap-3">
              <Link
                href="/"
                className="text-xs text-[color:var(--muted-text)] transition hover:text-[color:var(--brand)]"
              >
                بازگشت به صفحه اصلی
              </Link>
              <ThemeToggle onChange={setIsDark} />
            </div>
            <ForgotPassword
              onBack={() => {
                setShowForgotPassword(false);
                toast.info("بازگشت به ورود");
              }}
              isDark={isDark}
            />
          </div>
        </div>
      </>
    );
  }

  if (showRegister) {
    return (
      <>
        <Toaster position="top-center" richColors theme={isDark ? "dark" : "light"} />
        <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--brand)] flex items-center justify-center px-4 py-6 transition-colors duration-500 relative overflow-hidden">
          <FloatingElements isDark={isDark} />

          <div className="w-full max-w-xl">
            <div className="mb-6 flex items-center justify-between gap-3">
              <Link
                href="/"
                className="text-xs text-[color:var(--muted-text)] transition hover:text-[color:var(--brand)]"
              >
                بازگشت به صفحه اصلی
              </Link>
              <ThemeToggle onChange={setIsDark} />
            </div>
            <Register
              onBack={() => {
                setShowRegister(false);
                toast.info("بازگشت به ورود");
              }}
              isDark={isDark}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors theme={isDark ? "dark" : "light"} />
      <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--brand)] flex items-center justify-center px-4 py-6 transition-colors duration-500 relative overflow-hidden">
        <FloatingElements isDark={isDark} />

        <div className="w-full max-w-sm">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link
              href="/"
              className="text-xs text-[color:var(--muted-text)] transition hover:text-[color:var(--brand)]"
            >
              بازگشت به صفحه اصلی
            </Link>
            <ThemeToggle onChange={setIsDark} />
          </div>
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-12 h-12 bg-[color:var(--accent-strong)] rounded-full mb-3 shadow-md"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.2,
                rotate: 360,
                transition: { duration: 0.6 },
              }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h1
              className="text-2xl mb-1 transition-colors duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              سرنیتی اسپا
            </motion.h1>
            <motion.p
              className="text-sm text-[color:var(--muted-text)] transition-colors duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              سفر آرامش شما از اینجا شروع می شود
            </motion.p>
          </motion.div>

          <motion.div
            className="bg-[color:var(--card)]/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 transition-colors duration-300 border border-[color:var(--surface-muted)]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
          >
            <motion.h2
              className="text-xl mb-5 text-center transition-colors duration-300"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              خوش آمدید
            </motion.h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <label
                  htmlFor="email"
                  className="block text-xs text-[color:var(--muted-text)] mb-2 transition-colors duration-300"
                >
                  ایمیل
                </label>
                <motion.input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  className="w-full px-3 py-2.5 border border-[color:var(--surface-muted)] bg-[color:var(--card)] text-[color:var(--brand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] focus:border-transparent transition-all duration-300 text-sm"
                  placeholder="you@example.com"
                  whileFocus={{ scale: 1.01 }}
                  required
                />
                <AnimatePresence>
                  {emailError && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                    >
                      {emailError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <label
                  htmlFor="password"
                  className="block text-xs text-[color:var(--muted-text)] mb-2 transition-colors duration-300"
                >
                  رمز عبور
                </label>
                <div className="relative">
                  <motion.input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    className="w-full px-3 py-2.5 border border-[color:var(--surface-muted)] bg-[color:var(--card)] text-[color:var(--brand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] focus:border-transparent transition-all duration-300 pr-10 text-sm"
                    placeholder="••••••••"
                    whileFocus={{ scale: 1.01 }}
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[color:var(--muted-text)] hover:text-[color:var(--brand)] transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence mode="wait">
                      {showPassword ? (
                        <motion.div
                          key="eyeoff"
                          initial={{ rotate: 180, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -180, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <EyeOff className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="eye"
                          initial={{ rotate: -180, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 180, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Eye className="w-5 h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
                <AnimatePresence>
                  {passwordError && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                    >
                      {passwordError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                className="flex items-center justify-between text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <motion.label
                  className="flex items-center text-[color:var(--muted-text)] cursor-pointer transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <input
                    type="checkbox"
                    className="ml-2 w-3.5 h-3.5 rounded border-[color:var(--surface-muted)] text-[color:var(--accent)] focus:ring-[color:var(--accent)]"
                  />
                  مرا به خاطر بسپار
                </motion.label>
                <motion.a
                  href="#"
                  className="text-[color:var(--accent-strong)] hover:text-[color:var(--brand)] transition-colors duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgotPassword(true);
                  }}
                  whileHover={{ scale: 1.05, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  فراموشی رمز؟
                </motion.a>
              </motion.div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[color:var(--brand)] text-[color:var(--brand-foreground)] py-2.5 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                whileHover={!isLoading ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>در حال ورود...</span>
                    </motion.div>
                  ) : (
                    <motion.span
                      key="signin"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      ورود
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>

            <motion.div
              className="relative my-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.9 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[color:var(--surface-muted)] transition-colors duration-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[color:var(--card)]/80 text-[color:var(--muted-text)] transition-colors duration-300">
                  یا
                </span>
              </div>
            </motion.div>

            <motion.div
              className="grid gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.95 }}
            >
              <button
                type="button"
                className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--card)] py-2.5 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                ادامه با گوگل
              </button>
              <button
                type="button"
                className="w-full rounded-lg border border-[color:var(--surface-muted)] bg-[color:var(--card)] py-2.5 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                ادامه با اپل
              </button>
            </motion.div>

            <motion.p
              className="text-center text-[color:var(--muted-text)] text-xs transition-colors duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1 }}
            >
              حساب ندارید؟{" "}
              <motion.a
                href="#"
                className="text-[color:var(--accent-strong)] hover:text-[color:var(--brand)] transition-colors duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  setShowRegister(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ثبت نام کنید
              </motion.a>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { X, Mail, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface OTPModalProps {
  email: string;
  onClose: () => void;
  onVerify: (otp: string) => void;
  isDark: boolean;
}

export function OTPModal({ email, onClose, onVerify }: OTPModalProps) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    setCanResend(true);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && value) {
      const fullOtp = [...newOtp.slice(0, 5), value].join("");
      if (fullOtp.length === 6) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }

    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
      if (pastedData.length === 6) {
        handleVerify(pastedData);
      }
    }
  };

  const handleVerify = (otpValue?: string) => {
    const otpString = otpValue || otp.join("");

    if (otpString.length !== 6) {
      setError("کد ۶ رقمی را کامل وارد کنید");
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);

      if (otpString === "123456") {
        onVerify(otpString);
        toast.success("ایمیل با موفقیت تایید شد");
      } else {
        setError("کد نامعتبر است");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    }, 1500);
  };

  const handleResend = () => {
    if (!canResend) return;

    console.log("Resending OTP to:", email);
    setTimer(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          className="relative bg-[color:var(--card)]/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-full max-w-sm transition-colors duration-300 border border-[color:var(--surface-muted)]"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 text-[color:var(--muted-text)] hover:text-[color:var(--brand)] transition-colors rounded-full hover:bg-[color:var(--surface-muted)]"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[color:var(--accent-strong)] rounded-full mb-3 shadow-md">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl mb-1 transition-colors duration-300">تایید ایمیل</h2>
            <p className="text-[color:var(--muted-text)] text-xs transition-colors duration-300">
              کد ۶ رقمی ارسال شد به
            </p>
            <p className="text-[color:var(--accent-strong)] text-sm font-medium">{email}</p>
          </div>

          <div className="mb-6">
            <div className="flex gap-2 justify-center mb-4" dir="ltr">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-10 h-12 text-center text-lg font-semibold border-2 ${
                    error
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[color:var(--surface-muted)] focus:border-[color:var(--accent)]"
                  } bg-[color:var(--card)] text-[color:var(--brand)] rounded-lg focus:outline-none focus:ring-2 transition-all duration-200`}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            {error && (
              <motion.p
                className="text-red-500 text-sm text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
          </div>

          <motion.button
            onClick={() => handleVerify()}
            disabled={isVerifying || otp.join("").length !== 6}
            className="w-full bg-[color:var(--brand)] text-[color:var(--brand-foreground)] py-2.5 rounded-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-4 text-sm"
            whileHover={!isVerifying ? { scale: 1.02 } : {}}
            whileTap={!isVerifying ? { scale: 0.98 } : {}}
          >
            {isVerifying ? "در حال تایید..." : "تایید کد"}
          </motion.button>

          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-[color:var(--accent-strong)] hover:text-[color:var(--brand)] transition-colors text-sm font-medium inline-flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                ارسال دوباره
              </button>
            ) : (
              <p className="text-[color:var(--muted-text)] text-sm">
                ارسال مجدد تا {" "}
                <span className="font-semibold text-[color:var(--accent-strong)]">{timer} ثانیه</span>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

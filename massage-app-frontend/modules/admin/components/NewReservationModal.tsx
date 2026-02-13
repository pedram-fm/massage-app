"use client";

import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { X } from "lucide-react";

const medicalItems = [
  "حاملگی",
  "دیابت",
  "ضربه مغزی",
  "مشکلات دیسک یا ستون فقرات",
  "کوفتگی یا کبود شدگی",
  "مشکلات قلبی",
  "سرطان",
  "آلرژی",
  "التهاب مفصلی (آرتریت)",
  "فشار خون",
  "وریدهای واریسی",
  "سردرد",
  "اختلالات تشکیل لخته خون",
  "پوکی استخوان",
];

export function NewReservationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [medicalAnswers, setMedicalAnswers] = useState<Record<string, "yes" | "no" | "">>({});
  const [visitDate, setVisitDate] = useState<Value>(null);
  const [birthDate, setBirthDate] = useState<Value>(null);

  const setAnswer = (item: string, value: "yes" | "no") => {
    setMedicalAnswers((prev) => ({ ...prev, [item]: value }));
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-200"
      onClick={onClose}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-2xl bg-[color:var(--card)] shadow-2xl max-h-[85vh] overflow-hidden flex flex-col"
        style={{ animation: 'scaleIn 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-[color:var(--surface-muted)] p-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-[color:var(--muted-text)]">
              رزرو جدید
            </p>
            <h2 className="mt-1 text-xl font-bold">فرم پذیرش قبل از ماساژ</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[color:var(--muted-text)] transition-all hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)] hover:rotate-90"
            title="بستن"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <form id="reservation-form" className="grid gap-5">
            <section className="grid gap-4 rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--surface)] p-4">
              <h3 className="text-sm font-semibold">اطلاعات پایه</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-[color:var(--muted-text)]">نام و نام خانوادگی</label>
                  <input
                    required
                    className="h-10 w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs text-[color:var(--muted-text)]">
                    تاریخ مراجعه (با ساعت دقیق)
                  </label>
                  <DatePicker
                    value={visitDate}
                    onChange={setVisitDate}
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD HH:mm"
                    plugins={[<TimePicker position="bottom" key="time" />]}
                    inputClass="h-11 w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 text-sm"
                  />
                  <input type="hidden" required value={visitDate ? "1" : ""} />
                </div>
                <div>
                  <label className="mb-2 block text-xs text-[color:var(--muted-text)]">
                    تاریخ تولد
                  </label>
                  <DatePicker
                    value={birthDate}
                    onChange={setBirthDate}
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    inputClass="h-11 w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs text-[color:var(--muted-text)]">شماره تماس</label>
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    pattern="[0-9۰-۹+\-\s]{7,}"
                    className="h-10 w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs text-[color:var(--muted-text)]">علت مراجعه</label>
                <input
                  required
                  className="h-10 w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 text-sm"
                />
              </div>
            </section>

            <section className="grid gap-4 rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--surface)] p-4">
              <h3 className="text-sm font-semibold">اطلاعات پزشکی (حداقل)</h3>
              <p className="text-xs text-[color:var(--muted-text)]">
                لطفا موارد مهم را مشخص کنید. در صورت مثبت بودن، توضیح کوتاه بنویسید.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {medicalItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 py-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[color:var(--brand)]">{item}</span>
                      <div className="flex gap-2 text-[color:var(--muted-text)]">
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name={item}
                            checked={medicalAnswers[item] === "yes"}
                            onChange={() => setAnswer(item, "yes")}
                            required
                          />
                          بله
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name={item}
                            checked={medicalAnswers[item] === "no"}
                            onChange={() => setAnswer(item, "no")}
                          />
                          خیر
                        </label>
                      </div>
                    </div>
                    {medicalAnswers[item] === "yes" && (
                      <input
                        className="mt-2 h-9 w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-3 text-xs"
                        placeholder="توضیحات"
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4 rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--surface)] p-4">
              <h3 className="text-sm font-semibold">اطلاعات جلسه</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-[color:var(--muted-text)]">سطح درد</label>
                  <div className="flex flex-wrap gap-3 text-xs text-[color:var(--muted-text)]">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="painLevel" required />
                      ضعیف
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="painLevel" />
                      متوسط
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="painLevel" />
                      شدید
                    </label>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-xs text-[color:var(--muted-text)]">ترجیح فشار</label>
                  <input
                    required
                    className="h-10 w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 text-sm"
                    placeholder="کم / متوسط / زیاد"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs text-[color:var(--muted-text)]">نواحی اصلی ناراحتی</label>
                <textarea
                  required
                  className="min-h-[96px] w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 py-2 text-sm"
                />
              </div>
            </section>

            <section className="grid gap-4 rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--surface)] p-4">
              <h3 className="text-sm font-semibold">تایید نهایی</h3>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" required className="w-4 h-4 rounded" />
                اطلاعات بالا را صحیح و کامل تایید می کنم.
              </label>
            </section>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 border-t border-[color:var(--surface-muted)] p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[color:var(--surface-muted)] px-6 py-2.5 text-sm font-medium transition-all hover:bg-[color:var(--surface-muted)] hover:scale-105"
          >
            بعدا
          </button>
          <button
            type="submit"
            form="reservation-form"
            className="rounded-lg bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--accent)] px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:scale-105"
          >
            ثبت فرم
          </button>
        </div>
      </div>
    </div>
  );
}

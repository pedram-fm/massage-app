"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, Trash2, Upload, X } from "lucide-react";

const inputBase =
  "w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 py-2 text-sm text-[color:var(--brand)] placeholder:text-[color:var(--muted-text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]";

export function DashboardModals({
  openProfile,
  openSettings,
  onCloseProfile,
  onCloseSettings,
}: {
  openProfile: boolean;
  openSettings: boolean;
  onCloseProfile: () => void;
  onCloseSettings: () => void;
}) {
  const [name, setName] = useState("ندا حسینی");
  const [role, setRole] = useState("مدیر شعبه");
  const [phone, setPhone] = useState("۰۹۱۲۳۴۵۶۷۸۹");
  const [email, setEmail] = useState("neda@serenityspa.com");
  const [bio, setBio] = useState("متخصص تجربه مشتری و طراحی پروتکل درمانی.");
  const [file, setFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <>
      {openProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCloseProfile}
          />
          <div className="relative w-full max-w-lg rounded-[28px] border border-[color:var(--surface-muted)] bg-[color:var(--card)]/95 p-6 shadow-2xl">
            <button
              onClick={onCloseProfile}
              className="absolute left-4 top-4 rounded-full p-2 text-[color:var(--muted-text)] transition hover:text-[color:var(--brand)]"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-text)]">
                پروفایل
              </p>
              <h3 className="mt-2 text-2xl" style={{ fontFamily: "var(--font-display)" }}>
                ویرایش اطلاعات کاربری
              </h3>
            </div>

            <div className="grid gap-5">
              <div className="grid gap-3">
                <label className="text-xs text-[color:var(--muted-text)]">تصویر پروفایل</label>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-3xl border border-[color:var(--surface-muted)] bg-[color:var(--surface-muted)]">
                    {previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={previewUrl} alt="preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[color:var(--muted-text)]">
                        ن ه
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition hover:opacity-100">
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="hidden"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-2 text-xs font-medium text-[color:var(--muted-text)] transition hover:text-[color:var(--brand)]"
                    >
                      <Upload className="h-4 w-4" />
                      انتخاب تصویر
                    </label>
                    <p className="text-xs text-[color:var(--muted-text)]">
                      PNG یا JPG، حداکثر ۵ مگابایت
                    </p>
                    {file && (
                      <div className="flex items-center gap-2 text-xs text-[color:var(--muted-text)]">
                        <span className="max-w-[180px] truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="inline-flex items-center gap-1 rounded-full border border-[color:var(--surface-muted)] px-2 py-1 text-[color:var(--muted-text)] transition hover:text-[color:var(--brand)]"
                        >
                          <Trash2 className="h-3 w-3" />
                          حذف
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-[color:var(--muted-text)]">نام و نام خانوادگی</label>
                  <input className={inputBase} value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-xs text-[color:var(--muted-text)]">عنوان شغلی</label>
                  <input className={inputBase} value={role} onChange={(e) => setRole(e.target.value)} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-[color:var(--muted-text)]">شماره تماس</label>
                  <input className={inputBase} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-xs text-[color:var(--muted-text)]">ایمیل</label>
                  <input className={inputBase} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs text-[color:var(--muted-text)]">بیو کوتاه</label>
                <textarea
                  className="min-h-[90px] w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 py-2 text-sm text-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  onClick={onCloseProfile}
                  className="rounded-full border border-[color:var(--surface-muted)] px-4 py-2 text-xs font-medium text-[color:var(--muted-text)]"
                >
                  انصراف
                </button>
                <button className="rounded-full bg-[color:var(--brand)] px-5 py-2 text-xs font-semibold text-[color:var(--brand-foreground)]">
                  ذخیره تغییرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCloseSettings}
          />
          <div className="relative w-full max-w-md rounded-[28px] border border-[color:var(--surface-muted)] bg-[color:var(--card)]/95 p-6 shadow-2xl">
            <button
              onClick={onCloseSettings}
              className="absolute left-4 top-4 rounded-full p-2 text-[color:var(--muted-text)] transition hover:text-[color:var(--brand)]"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-text)]">
                تنظیمات
              </p>
              <h3 className="mt-2 text-2xl" style={{ fontFamily: "var(--font-display)" }}>
                تنظیمات پنل
              </h3>
            </div>

            <div className="grid gap-4 text-sm">
              {[
                "فعال سازی اعلان پیامک برای نوبت ها",
                "نمایش تقویم هفته به هفته",
                "ثبت خودکار گزارش بعد از جلسه",
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-[color:var(--surface-muted)] bg-[color:var(--surface)] px-4 py-3"
                >
                  <span className="text-[color:var(--muted-text)]">{item}</span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[color:var(--surface-muted)] text-[color:var(--accent)] focus:ring-[color:var(--accent)]"
                    defaultChecked
                  />
                </label>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={onCloseSettings}
                className="rounded-full border border-[color:var(--surface-muted)] px-4 py-2 text-xs font-medium text-[color:var(--muted-text)]"
              >
                بستن
              </button>
              <button className="rounded-full bg-[color:var(--brand)] px-5 py-2 text-xs font-semibold text-[color:var(--brand-foreground)]">
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

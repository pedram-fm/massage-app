"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import * as tokenManager from "@/modules/auth/utils/tokenManager";
import { httpClient } from "@/modules/shared/api/httpClient";
import type { User } from "@/modules/auth/types/auth";

const inputBase =
  "w-full rounded-xl border border-[color:var(--surface-muted)] bg-[color:var(--card)] px-3 py-2 text-sm text-[color:var(--brand)] placeholder:text-[color:var(--muted-text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] disabled:cursor-not-allowed disabled:opacity-70";

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
  const [profile, setProfile] = useState({
    f_name: "",
    l_name: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    avatar_url: "",
  });
  const [emailVerifiedAt, setEmailVerifiedAt] = useState<string | null>(null);
  const [phoneVerifiedAt, setPhoneVerifiedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const initials = useMemo(() => {
    const first = profile.f_name?.trim()?.charAt(0) ?? "";
    const last = profile.l_name?.trim()?.charAt(0) ?? "";
    const combined = `${first}${last}`.trim();
    return combined || "کاربر";
  }, [profile.f_name, profile.l_name]);

  useEffect(() => {
    if (!openProfile) return;

    setStatusMessage("");
    setErrorMessage("");
    
    // Load cached user from tokenManager
    const cachedUser = tokenManager.getUser();
    if (cachedUser) {
      setProfile({
        f_name: cachedUser?.f_name ?? "",
        l_name: cachedUser?.l_name ?? "",
        username: cachedUser?.username ?? "",
        email: cachedUser?.email ?? "",
        phone: cachedUser?.phone ?? "",
        bio: cachedUser?.bio ?? "",
        avatar_url: cachedUser?.avatar_url ?? "",
      });
      setEmailVerifiedAt(cachedUser?.email_verified_at ?? null);
      setPhoneVerifiedAt(cachedUser?.phone_verified_at ?? null);
    }

    const token = tokenManager.getToken();
    if (!token) return;

    setIsLoading(true);
    httpClient.get<User>('/v1/auth/me')
      .then((data) => {
        setProfile({
          f_name: data?.f_name ?? "",
          l_name: data?.l_name ?? "",
          username: data?.username ?? "",
          email: data?.email ?? "",
          phone: data?.phone ?? "",
          bio: data?.bio ?? "",
          avatar_url: data?.avatar_url ?? "",
        });
        setEmailVerifiedAt(data?.email_verified_at ?? null);
        setPhoneVerifiedAt(data?.phone_verified_at ?? null);
        tokenManager.setUser(data);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "خطا در دریافت اطلاعات کاربر";
        setErrorMessage(message);
      })
      .finally(() => setIsLoading(false));
  }, [openProfile]);

  const handleProfileChange = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setStatusMessage("");
    setErrorMessage("");
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setStatusMessage("");
    setErrorMessage("");

    const token = tokenManager.getToken();

    if (!token) {
      setErrorMessage("ابتدا وارد حساب خود شوید.");
      setIsSaving(false);
      return;
    }

    try {
      const data = await httpClient.put<{ user?: User; message?: string }>('/v1/auth/profile', {
        f_name: profile.f_name,
        l_name: profile.l_name,
        username: profile.username,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
      });

      if (data?.user) {
        setProfile({
          f_name: data.user?.f_name ?? "",
          l_name: data.user?.l_name ?? "",
          username: data.user?.username ?? "",
          email: data.user?.email ?? profile.email,
          phone: data.user?.phone ?? profile.phone,
          bio: data.user?.bio ?? "",
          avatar_url: data.user?.avatar_url ?? "",
        });
        tokenManager.setUser(data.user);
      }

      setStatusMessage(data?.message || "پروفایل با موفقیت به‌روزرسانی شد");

      // Refresh user data from API
      try {
        const freshData = await httpClient.get<User>('/v1/auth/me');
        if (freshData) {
          setProfile({
            f_name: freshData?.f_name ?? "",
            l_name: freshData?.l_name ?? "",
            username: freshData?.username ?? "",
            email: freshData?.email ?? profile.email,
            phone: freshData?.phone ?? profile.phone,
            bio: freshData?.bio ?? "",
            avatar_url: freshData?.avatar_url ?? "",
          });
          tokenManager.setUser(freshData);
        }
      } catch {
        // ignore refresh errors
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "خطا در ذخیره پروفایل");
    } finally {
      setIsSaving(false);
    }
  };

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
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-[color:var(--surface-muted)] bg-[color:var(--surface-muted)] text-sm font-semibold text-[color:var(--muted-text)]">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt="Profile photo"
                        loader={({ src }) => src}
                        unoptimized
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium">
                      {profile.f_name} {profile.l_name}
                    </p>
                    <p className="text-xs text-[color:var(--muted-text)]">@{profile.username}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-[color:var(--muted-text)]">نام</label>
                  <input
                    className={inputBase}
                    value={profile.f_name}
                    onChange={(e) => handleProfileChange("f_name", e.target.value)}
                    placeholder="نام"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs text-[color:var(--muted-text)]">
                    نام خانوادگی
                  </label>
                  <input
                    className={inputBase}
                    value={profile.l_name}
                    onChange={(e) => handleProfileChange("l_name", e.target.value)}
                    placeholder="نام خانوادگی"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs text-[color:var(--muted-text)]">
                    نام کاربری
                  </label>
                  <input
                    className={inputBase}
                    value={profile.username}
                    onChange={(e) => handleProfileChange("username", e.target.value)}
                    placeholder="نام کاربری"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs text-[color:var(--muted-text)]">ایمیل</label>
                  <input className={inputBase} value={profile.email} disabled />
                  <p className="mt-1 text-[11px] text-[color:var(--muted-text)]">
                    {emailVerifiedAt ? "ایمیل تایید شده است" : "ایمیل تایید نشده است"}
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs text-[color:var(--muted-text)]">
                  شماره تماس
                </label>
                <input className={inputBase} value={profile.phone} disabled />
                <p className="mt-1 text-[11px] text-[color:var(--muted-text)]">
                  {phoneVerifiedAt ? "شماره تلفن تایید شده است" : "شماره تلفن تایید نشده است"}
                </p>
              </div>
              <div>
                <label className="mb-2 block text-xs text-[color:var(--muted-text)]">
                  Profile photo URL
                </label>
                <input
                  className={inputBase}
                  value={profile.avatar_url}
                  onChange={(e) => handleProfileChange("avatar_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-[color:var(--muted-text)]">Bio</label>
                <textarea
                  className={`${inputBase} min-h-[110px] resize-none`}
                  value={profile.bio}
                  onChange={(e) => handleProfileChange("bio", e.target.value)}
                  placeholder="A short bio about you..."
                />
              </div>

              {isLoading && (
                <p className="text-xs text-[color:var(--muted-text)]">Loading profile...</p>
              )}
              {statusMessage && (
                <p className="text-xs text-[color:var(--accent-strong)]">{statusMessage}</p>
              )}
              {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}

              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  onClick={onCloseProfile}
                  className="rounded-full border border-[color:var(--surface-muted)] px-4 py-2 text-xs font-medium text-[color:var(--muted-text)]"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="rounded-full bg-[color:var(--brand)] px-5 py-2 text-xs font-semibold text-[color:var(--brand-foreground)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
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
                "فعال سازی اعلان پیامک برای نوبت‌ها",
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

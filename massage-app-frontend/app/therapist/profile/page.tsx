'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AvatarUpload } from '@/components/therapist/avatar-upload';
import { SpecialtySelector } from '@/components/therapist/specialty-selector';
import { useTherapistProfile } from '@/modules/shared/hooks/use-therapist-profile';
import { PageSkeleton } from '@/components/ui/loading-skeleton';

export default function TherapistProfilePage() {
  const router = useRouter();
  const {
    profile,
    isLoading,
    isError,
    updateProfile,
    isUpdating,
    uploadAvatar,
    isUploadingAvatar,
    deleteAvatar,
    isDeletingAvatar,
  } = useTherapistProfile();

  const [formData, setFormData] = useState({
    bio: '',
    bio_fa: '',
    specialties: [] as string[],
    years_of_experience: 0,
    certifications: [] as string[],
    is_accepting_clients: true,
  });

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        bio_fa: profile.bio_fa || '',
        specialties: profile.specialties || [],
        years_of_experience: profile.years_of_experience || 0,
        certifications: profile.certifications || [],
        is_accepting_clients: profile.is_accepting_clients ?? true,
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const handleCertificationAdd = (cert: string) => {
    if (cert.trim() && !formData.certifications.includes(cert.trim())) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, cert.trim()],
      });
    }
  };

  const handleCertificationRemove = (cert: string) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((c) => c !== cert),
    });
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (isError || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-red-600">خطا در بارگذاری پروفایل</p>
            <Button onClick={() => router.back()} className="mt-4">
              بازگشت
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">پروفایل تراپیست</h1>
          <p className="text-gray-600 mt-1">مدیریت اطلاعات پروفایل شما</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowRight className="ml-2 h-4 w-4" />
          بازگشت
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <Card>
          <CardHeader>
            <CardTitle>تصویر پروفایل</CardTitle>
            <CardDescription>تصویر پروفایل خود را بارگذاری کنید</CardDescription>
          </CardHeader>
          <CardContent>
            <AvatarUpload
              currentAvatarUrl={profile.avatar_url || profile.avatar}
              onUpload={uploadAvatar}
              onDelete={deleteAvatar}
              isUploading={isUploadingAvatar}
              isDeleting={isDeletingAvatar}
            />
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات اصلی</CardTitle>
            <CardDescription>توضیحات و سوابق کاری</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bio (English) */}
            <div className="space-y-2">
              <Label htmlFor="bio">بیوگرافی (انگلیسی)</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                dir="ltr"
                className="text-left"
              />
            </div>

            {/* Bio (Persian) */}
            <div className="space-y-2">
              <Label htmlFor="bio_fa">بیوگرافی (فارسی)</Label>
              <Textarea
                id="bio_fa"
                placeholder="درباره خود بنویسید..."
                value={formData.bio_fa}
                onChange={(e) => setFormData({ ...formData, bio_fa: e.target.value })}
                rows={4}
              />
            </div>

            {/* Years of Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience">سابقه کار (سال)</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                value={formData.years_of_experience}
                onChange={(e) =>
                  setFormData({ ...formData, years_of_experience: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Specialties */}
        <Card>
          <CardHeader>
            <CardTitle>تخصص‌ها</CardTitle>
            <CardDescription>انواع ماساژی که ارائه می‌دهید</CardDescription>
          </CardHeader>
          <CardContent>
            <SpecialtySelector
              value={formData.specialties}
              onChange={(specialties) => setFormData({ ...formData, specialties })}
            />
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>مدارک و گواهینامه‌ها</CardTitle>
            <CardDescription>گواهینامه‌های حرفه‌ای خود را اضافه کنید</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="نام گواهینامه..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCertificationAdd((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                    handleCertificationAdd(input.value);
                    input.value = '';
                  }}
                >
                  افزودن
                </Button>
              </div>

              {formData.certifications.length > 0 && (
                <ul className="space-y-2">
                  {formData.certifications.map((cert, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <span>{cert}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCertificationRemove(cert)}
                      >
                        حذف
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>تنظیمات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="accepting">پذیرش مراجع جدید</Label>
                <p className="text-sm text-gray-500">
                  آیا در حال حاضر مراجع جدید می‌پذیرید؟
                </p>
              </div>
              <Switch
                id="accepting"
                checked={formData.is_accepting_clients}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_accepting_clients: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats (Read-only) */}
        <Card>
          <CardHeader>
            <CardTitle>آمار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{profile.total_appointments ?? 0}</p>
                <p className="text-sm text-gray-600 mt-1">کل جلسات</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-3xl font-bold text-yellow-600">{Number(profile.rating || 0).toFixed(1)}</p>
                <p className="text-sm text-gray-600 mt-1">امتیاز</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            انصراف
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="ml-2 h-4 w-4" />
                ذخیره تغییرات
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

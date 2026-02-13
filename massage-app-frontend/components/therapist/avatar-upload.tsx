'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  onUpload: (file: File) => void;
  onDelete: () => void;
  isUploading?: boolean;
  isDeleting?: boolean;
  className?: string;
}

export function AvatarUpload({
  currentAvatarUrl,
  onUpload,
  onDelete,
  isUploading = false,
  isDeleting = false,
  className,
}: AvatarUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم فایل نباید بیشتر از 5 مگابایت باشد');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('فقط فایل‌های تصویری مجاز هستند');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    onUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onDelete();
  };

  const avatarUrl = previewUrl || currentAvatarUrl;
  const isLoading = isUploading || isDeleting;

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Avatar Preview */}
      <div
        className={cn(
          'relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 transition-colors cursor-pointer',
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50',
          isLoading && 'opacity-60'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {avatarUrl ? (
          <>
            <Image
              src={avatarUrl}
              alt="Avatar"
              fill
              className="object-cover"
              sizes="128px"
            />
            {!isLoading && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 left-1 h-8 w-8 rounded-full opacity-0 transition-opacity hover:opacity-100"
                onClick={handleDelete}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            {isLoading ? (
              <Loader2 className="h-12 w-12 animate-spin" />
            ) : (
              <>
                <User className="h-12 w-12" />
                <Upload className="h-6 w-6" />
              </>
            )}
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          برای بارگذاری تصویر کلیک کنید یا فایل را اینجا بکشید
        </p>
        <p className="text-xs text-gray-400 mt-1">
          فرمت‌های مجاز: JPG, PNG, GIF • حداکثر حجم: 5MB
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={isLoading}
      />
    </div>
  );
}

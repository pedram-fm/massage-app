"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt, style, className, width, height, ...rest } = props;
  const normalizedSrc = typeof src === "string" && src.length > 0 ? src : ERROR_IMG_SRC;
  const normalizedWidth = useMemo(
    () => (typeof width === "number" ? width : Number(width) || 88),
    [width],
  );
  const normalizedHeight = useMemo(
    () => (typeof height === "number" ? height : Number(height) || 88),
    [height],
  );

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <Image
          src={ERROR_IMG_SRC}
          alt="Error loading image"
          loader={({ src: imageSrc }) => imageSrc}
          unoptimized
          width={normalizedWidth}
          height={normalizedHeight}
          {...rest}
          data-original-url={normalizedSrc}
        />
      </div>
    </div>
  ) : (
    <Image
      src={normalizedSrc}
      alt={alt ?? "image"}
      loader={({ src: imageSrc }) => imageSrc}
      unoptimized
      width={normalizedWidth}
      height={normalizedHeight}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
    />
  );
}

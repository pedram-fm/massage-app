"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as tokenManager from '@/modules/auth/utils/tokenManager';
import { AUTH_CONFIG } from '@/modules/shared/config/constants';
import { ROUTES } from '@/modules/shared/navigation/routes';
import { toast } from 'sonner';

/**
 * Periodically checks whether the auth token still exists.
 * If it disappears (cookie expired / manually cleared) while
 * the user is on a protected page, redirect to login.
 */
export function TokenExpiryHandler() {
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!tokenManager.isLoggedIn()) {
        const currentPath = window.location.pathname;
        const publicPaths = ['/auth/login', '/auth/register', '/'];

        if (!publicPaths.some(path => currentPath.startsWith(path))) {
          tokenManager.clearAuth();
          toast.error('نشست شما منقضی شده است. لطفاً دوباره وارد شوید.');
          router.push(ROUTES.LOGIN + '?redirect=' + encodeURIComponent(currentPath));
        }
      }
    }, AUTH_CONFIG.TOKEN_CHECK_INTERVAL || 60_000);

    return () => clearInterval(intervalId);
  }, [router]);

  return null;
}

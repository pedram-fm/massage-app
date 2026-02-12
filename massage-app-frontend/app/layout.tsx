import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/auth/useAuth";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "سرنیتی اسپا | ماساژ و تندرستی",
  description: "تجربه ای لوکس از ماساژ درمانی و تندرستی در سرنیتی اسپا.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}

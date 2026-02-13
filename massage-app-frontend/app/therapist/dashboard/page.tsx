"use client";

export default function TherapistDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">داشبورد ماساژتراپیست</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* محتوا به زودی اضافه خواهد شد */}
        <div className="rounded-lg border border-dashed border-[color:var(--surface-muted)] p-8 text-center">
          <p className="text-[color:var(--muted-text)]">محتوا به زودی...</p>
        </div>
      </div>
    </div>
  );
}

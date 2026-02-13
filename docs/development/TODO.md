# 📋 TODO List - Massage App

> آخرین بروزرسانی: 2026-02-13

---

## 🏥 Reservation System - Phase 1 (سیستم رزرو)

### 📦 Backend - Database & Models

- [ ] **RES-BE-001**: نصب کتابخانه Jalali
  - Priority: P0
  - Estimate: 0.5h
  - Command: `composer require hekmatinasser/verta`
  - Details: برای تبدیل تاریخ شمسی/میلادی

- [ ] **RES-BE-002**: Migration - service_types table
  - Priority: P0
  - Estimate: 1h
  - Files: `database/migrations/xxxx_create_service_types_table.php`
  - Details: جدول انواع سرویس‌ها (فقط ادمین تعریف می‌کنه)
  - Columns: id, name, name_fa, description, description_fa, default_duration, is_active

- [ ] **RES-BE-003**: Migration - therapist_profiles table
  - Priority: P0
  - Estimate: 1h
  - Files: `database/migrations/xxxx_create_therapist_profiles_table.php`
  - Details: پروفایل تراپیست (bio, avatar, specialties, etc.)
  - Columns: id, user_id, bio, bio_fa, avatar, specialties(JSON), years_of_experience, certifications(JSON), rating, total_appointments, is_accepting_clients

- [ ] **RES-BE-004**: Migration - therapist_services table
  - Priority: P0
  - Estimate: 1h
  - Files: `database/migrations/xxxx_create_therapist_services_table.php`
  - Details: pivot table با customization (duration, price)
  - Columns: id, therapist_id, service_type_id, duration, price, is_available, display_order
  - Index: UNIQUE(therapist_id, service_type_id)

- [ ] **RES-BE-005**: Migration - therapist_schedules table
  - Priority: P0
  - Estimate: 1h
  - Files: `database/migrations/xxxx_create_therapist_schedules_table.php`
  - Details: الگوی هفتگی تراپیست
  - Columns: id, therapist_id, day_of_week(0-6), start_time, end_time, break_duration(default:15), is_active
  - Index: (therapist_id, day_of_week)

- [ ] **RES-BE-006**: Migration - schedule_overrides table
  - Priority: P0
  - Estimate: 1h
  - Files: `database/migrations/xxxx_create_schedule_overrides_table.php`
  - Details: استثناهای روزانه (مرخصی، تغییر ساعت)
  - Columns: id, therapist_id, date(Jalali), date_gregorian, type(enum), start_time, end_time, reason
  - Index: (therapist_id, date_gregorian)

- [ ] **RES-BE-007**: Migration - appointments table
  - Priority: P0
  - Estimate: 1.5h
  - Files: `database/migrations/xxxx_create_appointments_table.php`
  - Details: رزروهای کلاینت‌ها
  - Columns: id, therapist_id, client_name, client_phone, client_email, service_type_id, start_time, end_time, duration, price, status(enum), notes, cancellation_reason, cancelled_at
  - Index: (therapist_id, start_time), (status)

- [ ] **RES-BE-008**: Model - ServiceType
  - Priority: P0
  - Estimate: 0.5h
  - Files: `app/Modules/Service/Domain/ServiceType.php`
  - Details: Model با relations

- [ ] **RES-BE-009**: Model - TherapistProfile
  - Priority: P0
  - Estimate: 0.5h
  - Files: `app/Modules/Therapist/Domain/TherapistProfile.php`
  - Details: belongs to User, has many services

- [ ] **RES-BE-010**: Model - TherapistService
  - Priority: P0
  - Estimate: 0.5h
  - Files: `app/Modules/Service/Domain/TherapistService.php`
  - Details: pivot model

- [ ] **RES-BE-011**: Model - TherapistSchedule
  - Priority: P0
  - Estimate: 0.5h
  - Files: `app/Modules/Schedule/Domain/TherapistSchedule.php`

- [ ] **RES-BE-012**: Model - ScheduleOverride
  - Priority: P0
  - Estimate: 0.5h
  - Files: `app/Modules/Schedule/Domain/ScheduleOverride.php`

- [ ] **RES-BE-013**: Model - Appointment
  - Priority: P0
  - Estimate: 1h
  - Files: `app/Modules/Appointment/Domain/Appointment.php`
  - Details: با relations و scopes

- [ ] **RES-BE-014**: Enums - AppointmentStatus
  - Priority: P0
  - Estimate: 0.5h
  - Files: `app/Modules/Appointment/Domain/AppointmentStatus.php`
  - Values: confirmed, cancelled, completed, no_show

- [ ] **RES-BE-015**: Enums - OverrideType
  - Priority: P0
  - Estimate: 0.5h
  - Files: `app/Modules/Schedule/Domain/OverrideType.php`
  - Values: unavailable, custom_hours

- [ ] **RES-BE-016**: Enums - DayOfWeek
  - Priority: P0
  - Estimate: 0.5h
  - Files: `app/Modules/Schedule/Domain/DayOfWeek.php`
  - Values: 0(یکشنبه) to 6(شنبه)

### ⚙️ Backend - Services & Actions

- [ ] **RES-BE-017**: Service - AvailabilityService (CORE)
  - Priority: P0
  - Estimate: 6h
  - Files: `app/Modules/Appointment/Services/AvailabilityService.php`
  - Details: محاسبه slot های available بر اساس schedule + overrides + appointments
  - Methods: getAvailableSlots(), generateSlots(), hasOverlap()

- [ ] **RES-BE-018**: Service - SlotGeneratorService
  - Priority: P0
  - Estimate: 2h
  - Files: `app/Modules/Appointment/Services/SlotGeneratorService.php`
  - Details: تولید slot ها بر اساس duration + break

- [ ] **RES-BE-019**: Service - OverlapDetectionService
  - Priority: P0
  - Estimate: 2h
  - Files: `app/Modules/Appointment/Services/OverlapDetectionService.php`
  - Details: چک کردن تداخل appointment ها

- [ ] **RES-BE-020**: Service - ScheduleService
  - Priority: P0
  - Estimate: 2h
  - Files: `app/Modules/Schedule/Services/ScheduleService.php`
  - Details: CRUD weekly schedule

- [ ] **RES-BE-021**: Action - CreateAppointmentAction
  - Priority: P0
  - Estimate: 4h
  - Files: `app/Modules/Appointment/Actions/CreateAppointmentAction.php`
  - Details: با DB transaction + row lock برای جلوگیری از race condition

- [ ] **RES-BE-022**: Action - CancelAppointmentAction
  - Priority: P0
  - Estimate: 2h
  - Files: `app/Modules/Appointment/Actions/CancelAppointmentAction.php`
  - Details: کنسل با reason

- [ ] **RES-BE-023**: Action - UpdateWeeklyScheduleAction
  - Priority: P0
  - Estimate: 2h
  - Files: `app/Modules/Schedule/Actions/UpdateWeeklyScheduleAction.php`
  - Details: bulk update الگوی هفتگی

- [ ] **RES-BE-024**: Action - CreateOverrideAction
  - Priority: P0
  - Estimate: 2h
  - Files: `app/Modules/Schedule/Actions/CreateOverrideAction.php`
  - Details: با چک کردن conflict با appointments موجود

- [ ] **RES-BE-025**: Action - UpdateTherapistProfileAction
  - Priority: P1
  - Estimate: 2h
  - Files: `app/Modules/Therapist/Actions/UpdateTherapistProfileAction.php`

- [ ] **RES-BE-026**: Action - ManageTherapistServicesAction
  - Priority: P1
  - Estimate: 2h
  - Files: `app/Modules/Service/Actions/ManageTherapistServicesAction.php`
  - Details: add/update/remove services

### 🛣️ Backend - Controllers & Routes

- [ ] **RES-BE-027**: Controller - ServiceTypeController (Admin)
  - Priority: P1
  - Estimate: 2h
  - Files: `app/Modules/Service/Http/Controllers/ServiceTypeController.php`
  - Routes: POST/GET/PUT/DELETE /api/admin/service-types

- [ ] **RES-BE-028**: Controller - TherapistProfileController
  - Priority: P1
  - Estimate: 2h
  - Files: `app/Modules/Therapist/Http/Controllers/TherapistProfileController.php`
  - Routes: GET/PUT /api/therapist/profile, POST /api/therapist/profile/avatar

- [ ] **RES-BE-029**: Controller - TherapistServiceController
  - Priority: P0
  - Estimate: 2h
  - Files: `app/Modules/Service/Http/Controllers/TherapistServiceController.php`
  - Routes: GET/POST/PUT/DELETE /api/therapist/services

- [ ] **RES-BE-030**: Controller - TherapistScheduleController
  - Priority: P0
  - Estimate: 3h
  - Files: `app/Modules/Schedule/Http/Controllers/TherapistScheduleController.php`
  - Routes: GET/PUT /api/therapist/schedule, CRUD /api/therapist/schedule/overrides

- [ ] **RES-BE-031**: Controller - AvailabilityController
  - Priority: P0
  - Estimate: 2h
  - Files: `app/Modules/Appointment/Http/Controllers/AvailabilityController.php`
  - Routes: GET /api/therapist/availability?date=1405-11-25

- [ ] **RES-BE-032**: Controller - TherapistAppointmentController
  - Priority: P0
  - Estimate: 3h
  - Files: `app/Modules/Appointment/Http/Controllers/TherapistAppointmentController.php`
  - Routes: GET/POST/PATCH/DELETE /api/therapist/appointments

- [ ] **RES-BE-033**: Form Requests - Validation
  - Priority: P0
  - Estimate: 3h
  - Files: `CreateAppointmentRequest`, `UpdateScheduleRequest`, etc.
  - Details: validation rules برای همه endpoints

- [ ] **RES-BE-034**: API Resources
  - Priority: P1
  - Estimate: 2h
  - Files: `AppointmentResource`, `AvailabilityResource`, `ServiceTypeResource`, etc.
  - Details: format API responses

### 🔐 Backend - Authorization & Middleware

- [ ] **RES-BE-035**: Middleware - EnsureTherapistOwnership
  - Priority: P0
  - Estimate: 2h
  - Files: `app/Modules/Appointment/Http/Middleware/EnsureTherapistOwnership.php`
  - Details: تراپیست فقط به appointments و schedule خودش دسترسی داشته باشه

- [ ] **RES-BE-036**: Policy - AppointmentPolicy
  - Priority: P1
  - Estimate: 1h
  - Files: `app/Modules/Appointment/Policies/AppointmentPolicy.php`

- [ ] **RES-BE-037**: Policy - SchedulePolicy
  - Priority: P1
  - Estimate: 1h
  - Files: `app/Modules/Schedule/Policies/SchedulePolicy.php`

### 🧪 Backend - Testing

- [ ] **RES-BE-038**: Test - AvailabilityService
  - Priority: P1
  - Estimate: 4h
  - Files: `tests/Unit/AvailabilityServiceTest.php`
  - Details: تست محاسبه slot ها با scenarios مختلف

- [ ] **RES-BE-039**: Test - Race Condition (Concurrency)
  - Priority: P0
  - Estimate: 3h
  - Files: `tests/Feature/ConcurrentBookingTest.php`
  - Details: تست double booking prevention

- [ ] **RES-BE-040**: Test - Overlap Detection
  - Priority: P1
  - Estimate: 2h
  - Files: `tests/Unit/OverlapDetectionServiceTest.php`

- [ ] **RES-BE-041**: Feature Tests - Appointment CRUD
  - Priority: P1
  - Estimate: 4h
  - Files: `tests/Feature/AppointmentTest.php`

### 🗄️ Backend - Seeders & Factory

- [ ] **RES-BE-042**: Seeder - ServiceTypeSeeder
  - Priority: P1
  - Estimate: 1h
  - Files: `database/seeders/ServiceTypeSeeder.php`
  - Details: ماساژ بافت عمیق، سوئدی، ورزشی، آروماتراپی

- [ ] **RES-BE-043**: Factory - AppointmentFactory
  - Priority: P1
  - Estimate: 1h
  - Files: `database/factories/AppointmentFactory.php`

- [ ] **RES-BE-044**: Factory - TherapistProfileFactory
  - Priority: P1
  - Estimate: 1h
  - Files: `database/factories/TherapistProfileFactory.php`

---

### 🎨 Frontend - Setup & Dependencies

- [ ] **RES-FE-001**: نصب Jalali date library
  - Priority: P0
  - Estimate: 0.5h
  - Command: `npm install moment-jalaali @types/moment-jalaali`
  - Details: برای کار با تاریخ شمسی

- [ ] **RES-FE-002**: نصب React Query
  - Priority: P0
  - Estimate: 1h
  - Command: `npm install @tanstack/react-query`
  - Details: برای API state management

- [ ] **RES-FE-003**: Setup React Query Provider
  - Priority: P0
  - Estimate: 0.5h
  - Files: `app/layout.tsx`
  - Details: wrap با QueryClientProvider

### 🧑‍⚕️ Frontend - Therapist Profile

- [ ] **RES-FE-004**: صفحه Therapist Profile
  - Priority: P1
  - Estimate: 4h
  - Files: `app/therapist/profile/page.tsx`
  - Details: فرم ویرایش پروفایل (bio, avatar, specialties, experience)

- [ ] **RES-FE-005**: Component - AvatarUpload
  - Priority: P1
  - Estimate: 2h
  - Files: `modules/therapist/profile/components/AvatarUpload.tsx`
  - Details: drag & drop یا click to upload

- [ ] **RES-FE-006**: Component - SpecialtySelector
  - Priority: P1
  - Estimate: 2h
  - Files: `modules/therapist/profile/components/SpecialtySelector.tsx`
  - Details: multi-select برای انتخاب تخصص‌ها

- [ ] **RES-FE-007**: Hook - useTherapistProfile
  - Priority: P1
  - Estimate: 1h
  - Files: `modules/therapist/profile/hooks/useTherapistProfile.ts`

- [ ] **RES-FE-008**: Service - therapistProfileService
  - Priority: P1
  - Estimate: 1h
  - Files: `modules/therapist/profile/services/therapistProfileService.ts`

### 🛍️ Frontend - Service Management

- [ ] **RES-FE-009**: صفحه Therapist Services
  - Priority: P0
  - Estimate: 4h
  - Files: `app/therapist/services/page.tsx`
  - Details: لیست services + اضافه/حذف/ویرایش

- [ ] **RES-FE-010**: Component - ServiceSelector
  - Priority: P0
  - Estimate: 3h
  - Files: `modules/therapist/service/components/ServiceSelector.tsx`
  - Details: انتخاب از لیست global services

- [ ] **RES-FE-011**: Component - ServiceCustomizer
  - Priority: P0
  - Estimate: 2h
  - Files: `modules/therapist/service/components/ServiceCustomizer.tsx`
  - Details: تعیین duration و price

- [ ] **RES-FE-012**: Hook - useTherapistServices
  - Priority: P0
  - Estimate: 1h
  - Files: `modules/therapist/service/hooks/useTherapistServices.ts`

- [ ] **RES-FE-013**: Service - serviceService
  - Priority: P0
  - Estimate: 1h
  - Files: `modules/therapist/service/services/serviceService.ts`

### 📅 Frontend - Schedule Management (Weekly)

- [ ] **RES-FE-014**: صفحه Weekly Schedule
  - Priority: P0
  - Estimate: 6h
  - Files: `app/therapist/schedule/page.tsx`
  - Details: مدیریت الگوی هفتگی

- [ ] **RES-FE-015**: Component - WeeklyScheduleEditor
  - Priority: P0
  - Estimate: 5h
  - Files: `modules/therapist/schedule/components/WeeklyScheduleEditor.tsx`
  - Details: 7 card برای 7 روز هفته

- [ ] **RES-FE-016**: Component - DayScheduleCard
  - Priority: P0
  - Estimate: 3h
  - Files: `modules/therapist/schedule/components/DayScheduleCard.tsx`
  - Details: toggle + time picker + break duration

- [ ] **RES-FE-017**: Component - TimeRangePicker
  - Priority: P0
  - Estimate: 2h
  - Files: `modules/therapist/schedule/components/TimeRangePicker.tsx`
  - Details: انتخاب start و end time

- [ ] **RES-FE-018**: Hook - useWeeklySchedule
  - Priority: P0
  - Estimate: 2h
  - Files: `modules/therapist/schedule/hooks/useWeeklySchedule.ts`

- [ ] **RES-FE-019**: Service - scheduleService
  - Priority: P0
  - Estimate: 1h
  - Files: `modules/therapist/schedule/services/scheduleService.ts`

### 📆 Frontend - Schedule Overrides (Calendar)

- [ ] **RES-FE-020**: صفحه Schedule Overrides
  - Priority: P0
  - Estimate: 5h
  - Files: `app/therapist/schedule/overrides/page.tsx`
  - Details: تقویم شمسی ماهانه

- [ ] **RES-FE-021**: Component - JalaliCalendar
  - Priority: P0
  - Estimate: 6h
  - Files: `modules/therapist/schedule/components/JalaliCalendar.tsx`
  - Details: تقویم شمسی با نمایش overrides و appointments

- [ ] **RES-FE-022**: Component - OverrideModal
  - Priority: P0
  - Estimate: 3h
  - Files: `modules/therapist/schedule/components/OverrideModal.tsx`
  - Details: modal برای ساخت/ویرایش override

- [ ] **RES-FE-023**: Component - DateCell
  - Priority: P0
  - Estimate: 2h
  - Files: `modules/therapist/schedule/components/DateCell.tsx`
  - Details: نمایش status روی هر روز (available, override, has appointments)

- [ ] **RES-FE-024**: Hook - useScheduleOverrides
  - Priority: P0
  - Estimate: 2h
  - Files: `modules/therapist/schedule/hooks/useScheduleOverrides.ts`

- [ ] **RES-FE-025**: Utility - jalaliDateUtils
  - Priority: P0
  - Estimate: 2h
  - Files: `modules/shared/utils/jalaliDateUtils.ts`
  - Details: helper functions برای کار با تاریخ شمسی

### 🗓️ Frontend - Availability Preview

- [ ] **RES-FE-026**: صفحه Availability Preview
  - Priority: P1
  - Estimate: 3h
  - Files: `app/therapist/availability/page.tsx`
  - Details: preview slot های تولید شده برای تاریخ خاص

- [ ] **RES-FE-027**: Component - AvailabilityGrid
  - Priority: P1
  - Estimate: 2h
  - Files: `modules/therapist/availability/components/AvailabilityGrid.tsx`
  - Details: نمایش slot ها به تفکیک service

- [ ] **RES-FE-028**: Hook - useAvailability
  - Priority: P0
  - Estimate: 1h
  - Files: `modules/therapist/appointment/hooks/useAvailability.ts`

### 📋 Frontend - Appointment Management

- [ ] **RES-FE-029**: صفحه Appointments List
  - Priority: P0
  - Estimate: 5h
  - Files: `app/therapist/appointments/page.tsx`
  - Details: لیست appointments با فیلتر (today, week, month, all)

- [ ] **RES-FE-030**: Component - AppointmentList
  - Priority: P0
  - Estimate: 3h
  - Files: `modules/therapist/appointment/components/AppointmentList.tsx`
  - Details: لیست با pagination و فیلتر

- [ ] **RES-FE-031**: Component - AppointmentCard
  - Priority: P0
  - Estimate: 2h
  - Files: `modules/therapist/appointment/components/AppointmentCard.tsx`
  - Details: کارت نمایش appointment

- [ ] **RES-FE-032**: Component - AppointmentFilters
  - Priority: P1
  - Estimate: 2h
  - Files: `modules/therapist/appointment/components/AppointmentFilters.tsx`
  - Details: فیلتر بر اساس status, date range

- [ ] **RES-FE-033**: صفحه Appointment Detail
  - Priority: P1
  - Estimate: 3h
  - Files: `app/therapist/appointments/[id]/page.tsx`
  - Details: جزئیات کامل + actions (cancel, complete, no-show)

- [ ] **RES-FE-034**: Component - CreateAppointmentModal
  - Priority: P0
  - Estimate: 5h
  - Files: `modules/therapist/appointment/components/CreateAppointmentModal.tsx`
  - Details: فرم ساخت appointment دستی

- [ ] **RES-FE-035**: Component - CancelAppointmentModal
  - Priority: P0
  - Estimate: 2h
  - Files: `modules/therapist/appointment/components/CancelAppointmentModal.tsx`
  - Details: modal با ذکر دلیل کنسلی

- [ ] **RES-FE-036**: Component - AvailableSlotsPicker
  - Priority: P0
  - Estimate: 4h
  - Files: `modules/therapist/appointment/components/AvailableSlotsPicker.tsx`
  - Details: انتخاب تاریخ (شمسی) و نمایش slot های available

- [ ] **RES-FE-037**: Hook - useAppointments
  - Priority: P0
  - Estimate: 2h
  - Files: `modules/therapist/appointment/hooks/useAppointments.ts`

- [ ] **RES-FE-038**: Hook - useCreateAppointment
  - Priority: P0
  - Estimate: 2h
  - Files: `modules/therapist/appointment/hooks/useCreateAppointment.ts`
  - Details: با optimistic update و error handling

- [ ] **RES-FE-039**: Service - appointmentService
  - Priority: P0
  - Estimate: 2h
  - Files: `modules/therapist/appointment/services/appointmentService.ts`

### 🎨 Frontend - Shared UI Components

- [ ] **RES-FE-040**: Component - JalaliDatePicker
  - Priority: P0
  - Estimate: 4h
  - Files: `components/ui/JalaliDatePicker.tsx`
  - Details: date picker با تقویم شمسی

- [ ] **RES-FE-041**: Component - TimePicker
  - Priority: P0
  - Estimate: 2h
  - Files: `components/ui/TimePicker.tsx`
  - Details: انتخاب ساعت و دقیقه

- [ ] **RES-FE-042**: Component - DurationPicker
  - Priority: P0
  - Estimate: 1h
  - Files: `components/ui/DurationPicker.tsx`
  - Details: انتخاب مدت زمان (30, 60, 90, 120 دقیقه)

- [ ] **RES-FE-043**: Component - StatusBadge
  - Priority: P1
  - Estimate: 1h
  - Files: `components/ui/StatusBadge.tsx`
  - Details: badge برای status های مختلف appointment

- [ ] **RES-FE-044**: Component - LoadingSkeleton
  - Priority: P1
  - Estimate: 2h
  - Files: `components/ui/LoadingSkeleton.tsx`
  - Details: skeleton برای calendar و lists

### 🔄 Frontend - Error Handling & UX

- [ ] **RES-FE-045**: Error Boundary برای Reservation Pages
  - Priority: P1
  - Estimate: 2h
  - Files: `app/therapist/error.tsx`

- [ ] **RES-FE-046**: Toast Notifications
  - Priority: P1
  - Estimate: 1h
  - Files: استفاده از Radix Toast
  - Details: success, error, warning messages

- [ ] **RES-FE-047**: Confirmation Dialogs
  - Priority: P1
  - Estimate: 1h
  - Files: `components/ui/ConfirmDialog.tsx`
  - Details: برای actions مهم (cancel, delete)

- [ ] **RES-FE-048**: Conflict Warning UI
  - Priority: P0
  - Estimate: 2h
  - Details: وقتی تراپیست override می‌سازه و appointment داره، warning نشون بده

### 📱 Frontend - Responsive & RTL

- [ ] **RES-FE-049**: RTL Support برای تقویم
  - Priority: P1
  - Estimate: 2h
  - Files: calendar components
  - Details: تقویم از راست به چپ شروع شه

- [ ] **RES-FE-050**: Mobile Responsive - Calendar
  - Priority: P1
  - Estimate: 3h
  - Files: calendar و schedule components
  - Details: نمایش بهینه در موبایل

- [ ] **RES-FE-051**: Mobile Responsive - Appointment List
  - Priority: P1
  - Estimate: 2h
  - Files: appointment list components

### 🧪 Frontend - Testing

- [ ] **RES-FE-052**: Unit Test - jalaliDateUtils
  - Priority: P2
  - Estimate: 2h
  - Files: `__tests__/utils/jalaliDateUtils.test.ts`

- [ ] **RES-FE-053**: Component Test - JalaliCalendar
  - Priority: P2
  - Estimate: 3h
  - Files: `__tests__/components/JalaliCalendar.test.tsx`

- [ ] **RES-FE-054**: Integration Test - Create Appointment Flow
  - Priority: P2
  - Estimate: 4h
  - Files: `__tests__/flows/create-appointment.test.tsx`

### 📚 Documentation

- [ ] **RES-DOC-001**: API Documentation
  - Priority: P1
  - Estimate: 3h
  - Files: `docs/API-RESERVATION.md`
  - Details: documentation تمام endpoints

- [ ] **RES-DOC-002**: Database Schema Documentation
  - Priority: P1
  - Estimate: 2h
  - Files: `docs/DATABASE-SCHEMA.md`
  - Details: ERD و توضیح جداول

- [ ] **RES-DOC-003**: Jalali Date Integration Guide
  - Priority: P2
  - Estimate: 1h
  - Files: `docs/JALALI-DATE-GUIDE.md`

- [ ] **RES-DOC-004**: User Guide - Therapist Panel
  - Priority: P2
  - Estimate: 2h
  - Files: `docs/USER-GUIDE-THERAPIST.md`
  - Details: راهنمای استفاده برای تراپیست

---

## 🔴 فوری - امنیت (Critical Security)

### 🔐 Token Management
- [ ] **SEC-001**: جایگزینی localStorage با httpOnly cookies
  - Priority: P0
  - Estimate: 4h
  - Files: `hooks/auth/useAuthApi.ts`, `app/auth/login/page.tsx`
  - Details: پیاده‌سازی server-side cookie management برای توکن‌های JWT
  
  - Status: todo
- [ ] **SEC-002**: پیاده‌سازی CSRF Protection
  - Priority: P0
  - Estimate: 3h
  - Files: `middleware.ts` (new), `lib/api.ts`
  - Details: اضافه کردن CSRF token به هر درخواست

- [ ] **SEC-003**: اجباری کردن HTTPS در production
  - Priority: P0
  - Estimate: 1h
  - Files: `next.config.ts`, `middleware.ts`
  - Details: Redirect تمام HTTP requests به HTTPS

### 🛡️ Validation & Security
- [ ] **SEC-004**: Rate limiting برای login endpoint
  - Priority: P0
  - Estimate: 2h
  - Files: `app/auth/login/page.tsx`, `hooks/auth/useAuthApi.ts`
  - Details: محدود کردن تعداد تلاش‌های login (max 5 per 15min)

- [ ] **SEC-005**: Server-side validation برای فرم‌ها
  - Priority: P1
  - Estimate: 3h
  - Files: Backend API
  - Details: اطمینان از validation دوباره در سمت سرور

## 🟡 معماری و کد (Architecture & Code Quality)

### 🏗️ Code Refactoring
- [ ] **ARCH-001**: حذف code duplication در API base URL
  - Priority: P1
  - Estimate: 1h
  - Files: `lib/api.ts`, `app/dashboard/layout.tsx`, `app/auth/login/page.tsx`
  - Details: استفاده از یک helper function مرکزی

- [ ] **ARCH-002**: پیاده‌سازی React Query
  - Priority: P1
  - Estimate: 6h
  - Files: همه API calls
  - Dependencies: `@tanstack/react-query`
  - Details: جایگزینی fetch manual با React Query

- [ ] **ARCH-003**: Global State Management با Zustand
  - Priority: P1
  - Estimate: 4h
  - Files: `stores/auth.ts` (new), `stores/ui.ts` (new)
  - Dependencies: `zustand`
  - Details: مدیریت مرکزی auth state

- [ ] **ARCH-004**: بهبود TypeScript strictness
  - Priority: P2
  - Estimate: 3h
  - Files: `tsconfig.json`, تمام فایل‌های .ts/.tsx
  - Details: اضافه کردن `noUnusedLocals`, `noImplicitReturns`, etc.

### 📁 File Organization
- [ ] **ARCH-005**: ساختاردهی مجدد features
  - Priority: P2
  - Estimate: 4h
  - Details: تبدیل به feature-based structure به جای type-based

- [ ] **ARCH-006**: تجمیع API Types
  - Priority: P2
  - Estimate: 2h
  - Files: `types/api.ts` (new), `types/models.ts` (new)
  - Details: تعریف مرکزی تمام API response/request types

## 🟠 UX و Accessibility

### ♿ Accessibility
- [ ] **A11Y-001**: اضافه کردن aria-labels به تمام buttons
  - Priority: P1
  - Estimate: 2h
  - Files: تمام components
  - Details: بهبود screen reader support

- [ ] **A11Y-002**: Focus management در Modals
  - Priority: P1
  - Estimate: 3h
  - Files: `components/NewReservationModal.tsx`, `components/OTPModal.tsx`, etc.
  - Details: Focus trap و auto-focus پیاده‌سازی

- [ ] **A11Y-003**: Keyboard Navigation
  - Priority: P1
  - Estimate: 4h
  - Files: تمام interactive components
  - Details: تمام عملیات باید با صفحه‌کلید قابل انجام باشند

- [ ] **A11Y-004**: Skip Links برای navigation
  - Priority: P2
  - Estimate: 1h
  - Files: `app/layout.tsx`
  - Details: اضافه کردن "پرش به محتوا" برای keyboard users

### 🎨 UX Improvements
- [ ] **UX-001**: بهبود Loading States
  - Priority: P1
  - Estimate: 3h
  - Files: تمام forms و data fetching components
  - Details: skeleton screens و progress indicators

- [ ] **UX-002**: پیام‌های خطای قابل فهم‌تر
  - Priority: P1
  - Estimate: 2h
  - Files: `hooks/auth/useAuthApi.ts`, error handlers
  - Details: پیام‌های خطای کاربرپسند با راهنمای رفع مشکل

- [ ] **UX-003**: Optimistic Updates
  - Priority: P2
  - Estimate: 3h
  - Files: forms و CRUD operations
  - Details: UI بلافاصله update شود قبل از تأیید server

## 🔵 Performance

### ⚡ Bundle Optimization
- [ ] **PERF-001**: Code Splitting برای routes
  - Priority: P1
  - Estimate: 2h
  - Files: `app/**/page.tsx`
  - Details: dynamic imports برای route components

- [ ] **PERF-002**: Lazy Loading برای Radix UI components
  - Priority: P1
  - Estimate: 2h
  - Files: `components/ui/*`
  - Details: import فقط components مورد استفاده

- [ ] **PERF-003**: بهینه‌سازی Motion animations
  - Priority: P2
  - Estimate: 2h
  - Files: components با motion/react
  - Details: lazy load motion library

- [ ] **PERF-004**: Image Optimization
  - Priority: P2
  - Estimate: 3h
  - Files: جایی که تصویر اضافه می‌شود
  - Details: استفاده از next/image و WebP/AVIF formats

### 🚀 Runtime Performance
- [ ] **PERF-005**: React.memo برای component optimization
  - Priority: P2
  - Estimate: 3h
  - Files: components پرکاربرد
  - Details: جلوگیری از re-renders غیرضروری

- [ ] **PERF-006**: useMemo/useCallback optimization
  - Priority: P2
  - Estimate: 2h
  - Files: تمام components
  - Details: memoization مقادیر محاسباتی سنگین

## 🟢 Configuration

### ⚙️ Environment & Config
- [ ] **CONF-001**: ایجاد `.env.example`
  - Priority: P0
  - Estimate: 0.5h
  - Files: `.env.example` (new)
  - Details: مستندسازی تمام environment variables

- [ ] **CONF-002**: بهبود `next.config.ts`
  - Priority: P1
  - Estimate: 1h
  - Files: `next.config.ts`
  - Details: اضافه کردن security headers، compression، etc.

- [ ] **CONF-003**: ایجاد Middleware برای Route Protection
  - Priority: P0
  - Estimate: 2h
  - Files: `middleware.ts` (new)
  - Details: محافظت اتوماتیک route های protected

- [ ] **CONF-004**: تنظیم ESLint سخت‌گیرانه
  - Priority: P2
  - Estimate: 2h
  - Files: `eslint.config.mjs`
  - Details: اضافه کردن rules بیشتر برای code quality

## 🟣 Testing & Quality

### 🧪 Testing Setup
- [ ] **TEST-001**: نصب و راه‌اندازی Jest
  - Priority: P1
  - Estimate: 2h
  - Dependencies: `jest`, `@testing-library/react`, `@testing-library/jest-dom`
  - Files: `jest.config.js` (new), `jest.setup.js` (new)

- [ ] **TEST-002**: نوشتن Unit Tests برای utilities
  - Priority: P1
  - Estimate: 4h
  - Files: `lib/**/*.test.ts`
  - Details: تست functions در lib/api.ts

- [ ] **TEST-003**: Integration Tests برای Auth Flow
  - Priority: P1
  - Estimate: 6h
  - Files: `__tests__/auth/*.test.tsx`
  - Details: تست کامل login/register/logout

- [ ] **TEST-004**: E2E Testing با Playwright
  - Priority: P2
  - Estimate: 8h
  - Dependencies: `@playwright/test`
  - Files: `e2e/**/*.spec.ts` (new)

### 📊 Code Quality
- [ ] **QA-001**: نصب و تنظیم Husky
  - Priority: P2
  - Estimate: 1h
  - Dependencies: `husky`, `lint-staged`
  - Details: pre-commit hooks برای lint و format

- [ ] **QA-002**: تنظیم Prettier
  - Priority: P2
  - Estimate: 0.5h
  - Files: `.prettierrc` (new), `.prettierignore` (new)

- [ ] **QA-003**: TypeScript Type Coverage بالا
  - Priority: P2
  - Estimate: 4h
  - Files: تمام فایل‌های .ts/.tsx
  - Details: حذف any types و بهبود type inference

## 📋 Functionality

### 🔄 Authentication & Authorization
- [ ] **FUNC-001**: Refresh Token Logic
  - Priority: P0
  - Estimate: 4h
  - Files: `hooks/auth/useAuthApi.ts`, `lib/api.ts`
  - Details: اتوماتیک refresh کردن token قبل از expire

- [ ] **FUNC-002**: Session Timeout Warning
  - Priority: P1
  - Estimate: 2h
  - Files: `components/SessionTimeoutModal.tsx` (new)
  - Details: هشدار به کاربر قبل از expire شدن session

### 📅 Dashboard & Features
- [ ] **FUNC-003**: اتصال Dashboard به API واقعی
  - Priority: P1
  - Estimate: 6h
  - Files: `app/dashboard/page.tsx`, `hooks/useDashboard.ts` (new)
  - Details: حذف fake data و استفاده از API

- [ ] **FUNC-004**: پیاده‌سازی کامل NewReservation Form
  - Priority: P1
  - Estimate: 5h
  - Files: `components/NewReservationModal.tsx`
  - Details: اضافه کردن submit handler و API integration

- [ ] **FUNC-005**: پیاده‌سازی صفحه Appointments
  - Priority: P1
  - Estimate: 8h
  - Files: `app/dashboard/appointments/page.tsx`
  - Details: لیست، فیلتر، و مدیریت appointments

- [ ] **FUNC-006**: پیاده‌سازی صفحه Notes
  - Priority: P2
  - Estimate: 6h
  - Files: `app/dashboard/notes/page.tsx`
  - Details: یادداشت‌های درمانگر

### 📱 Progressive Web App
- [ ] **FUNC-007**: تبدیل به PWA
  - Priority: P2
  - Estimate: 4h
  - Dependencies: `next-pwa`
  - Files: `next.config.ts`, `public/manifest.json` (new)
  - Details: Offline support و Install prompt

- [ ] **FUNC-008**: Service Worker برای Caching
  - Priority: P2
  - Estimate: 3h
  - Files: `public/sw.js` (new)
  - Details: cache استراتژی برای static assets

## ⚪ Documentation

### 📚 Project Documentation
- [ ] **DOC-001**: بازنویسی README.md
  - Priority: P1
  - Estimate: 2h
  - Files: `README.md`
  - Details: مستندات کامل پروژه، نصب، و استفاده

- [ ] **DOC-002**: ایجاد CONTRIBUTING.md
  - Priority: P2
  - Estimate: 1h
  - Files: `CONTRIBUTING.md` (new)
  - Details: راهنمای مشارکت در پروژه

- [ ] **DOC-003**: API Documentation
  - Priority: P2
  - Estimate: 3h
  - Files: `docs/API.md` (new)
  - Details: مستندات تمام API endpoints

- [ ] **DOC-004**: Component Documentation با Storybook
  - Priority: P2
  - Estimate: 8h
  - Dependencies: `@storybook/react`
  - Files: `.storybook/**`, `**/*.stories.tsx`

### 🔧 Developer Experience
- [ ] **DOC-005**: Setup Guide
  - Priority: P1
  - Estimate: 1h
  - Files: `docs/SETUP.md` (new)
  - Details: راهنمای راه‌اندازی محیط development

- [ ] **DOC-006**: Architecture Documentation
  - Priority: P2
  - Estimate: 2h
  - Files: `docs/ARCHITECTURE.md` (new)
  - Details: توضیح معماری و تصمیمات فنی

## 🎯 Monitoring & Analytics

- [ ] **MON-001**: راه‌اندازی Error Tracking (Sentry)
  - Priority: P2
  - Estimate: 2h
  - Dependencies: `@sentry/nextjs`

- [ ] **MON-002**: Performance Monitoring
  - Priority: P2
  - Estimate: 2h
  - Files: `lib/monitoring.ts` (new)

- [ ] **MON-003**: Analytics Integration
  - Priority: P3
  - Estimate: 2h
  - Dependencies: analytics library

---

## 📊 آمار پروژه

### کل پروژه
- **تعداد کل تسک‌ها**: 172
- **تخمین زمان کل**: ~400 ساعت

### Reservation System (Phase 1)
- **تعداد تسک‌ها**: 104
- **تخمین زمان**: ~220 ساعت
  - Backend: 44 تسک - ~100 ساعت
  - Frontend: 51 تسک - ~110 ساعت
  - Documentation: 4 تسک - ~8 ساعت
  - Testing: 5 تسک - ~10 ساعت

### Frontend General
- **تعداد کل تسک‌ها**: 68
- **تخمین زمان کل**: ~180 ساعت
- **P0 (فوری)**: 7 تسک - ~18 ساعت
- **P1 (بالا)**: 31 تسک - ~90 ساعت
- **P2 (متوسط)**: 27 تسک - ~65 ساعت
- **P3 (پایین)**: 3 تسک - ~7 ساعت

## 🏷️ Labels

- `P0`: فوری - باید همین الان انجام شود
- `P1`: اولویت بالا - این هفته
- `P2`: اولویت متوسط - این ماه
- `P3`: اولویت پایین - آینده

## 📝 نحوه استفاده

برای مارک کردن یک تسک به عنوان انجام شده:
```markdown
- [x] **TASK-ID**: توضیحات
```

برای اضافه کردن تسک جدید، از فرمت زیر استفاده کنید:
```markdown
- [ ] **CATEGORY-ID**: عنوان کوتاه
  - Priority: P0/P1/P2/P3
  - Estimate: Xh
  - Files: `path/to/file.ts`
  - Details: توضیحات تکمیلی
```


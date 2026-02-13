<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Modules\Appointment\Actions\CreateAppointmentAction;
use App\Modules\Appointment\Domain\Appointment;
use App\Modules\Appointment\Domain\AppointmentStatus;
use App\Modules\Schedule\Domain\TherapistSchedule;
use App\Modules\Service\Domain\ServiceType;
use App\Modules\Service\Domain\TherapistService;
use App\Modules\Users\Models\Role;
use App\Modules\Users\Models\User;
use Carbon\Carbon;
use Hekmatinasser\Verta\Verta;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ConcurrentBookingTest extends TestCase
{
    use RefreshDatabase;

    private CreateAppointmentAction $createAction;
    private User $therapist;
    private ServiceType $serviceType;
    private TherapistService $therapistService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->createAction = app(CreateAppointmentAction::class);

        // Create role
        $therapistRole = Role::create([
            'name' => Role::THERAPIST,
            'display_name' => 'Therapist',
            'description' => 'Massage therapist',
        ]);

        // Create therapist
        $this->therapist = User::factory()->create([
            'role_id' => $therapistRole->id,
        ]);

        // Create service type
        $this->serviceType = ServiceType::create([
            'name' => 'Sports Massage',
            'name_fa' => 'ماساژ ورزشی',
            'description' => 'Sports massage therapy',
            'description_fa' => 'ماساژ ورزشی درمانی',
        ]);

        // Create therapist service
        $this->therapistService = TherapistService::create([
            'therapist_id' => $this->therapist->id,
            'service_type_id' => $this->serviceType->id,
            'duration' => 60,
            'price' => '1500000',
            'is_active' => true,
        ]);

        // Create schedule (Monday-Saturday)
        for ($day = 0; $day <= 5; $day++) {
            TherapistSchedule::create([
                'therapist_id' => $this->therapist->id,
                'day_of_week' => $day,
                'is_active' => true,
                'start_time' => '09:00',
                'end_time' => '18:00',
                'break_duration' => 15,
            ]);
        }
    }

    /** @test */
    public function it_prevents_double_booking_with_concurrent_requests(): void
    {
        $jalaliDate = $this->getFutureJalaliDate(3); // 3 days from now

        $appointmentData = [
            'therapist_id' => $this->therapist->id,
            'service_id' => $this->therapistService->id,
            'date' => $jalaliDate,
            'start_time' => '10:00',
            'client_name' => 'Concurrent Test',
            'client_phone' => '09123456789',
        ];

        $successCount = 0;
        $failureCount = 0;

        // Simulate 3 concurrent requests for the same slot
        try {
            DB::transaction(function () use ($appointmentData, &$successCount) {
                $this->createAction->execute($appointmentData);
                $successCount++;
            });
        } catch (\Exception $e) {
            $failureCount++;
        }

        try {
            DB::transaction(function () use ($appointmentData, &$successCount) {
                $appointmentData['client_name'] = 'Concurrent Test 2';
                $appointmentData['client_phone'] = '09123456788';
                $this->createAction->execute($appointmentData);
                $successCount++;
            });
        } catch (\Exception $e) {
            $failureCount++;
        }

        try {
            DB::transaction(function () use ($appointmentData, &$successCount) {
                $appointmentData['client_name'] = 'Concurrent Test 3';
                $appointmentData['client_phone'] = '09123456787';
                $this->createAction->execute($appointmentData);
                $successCount++;
            });
        } catch (\Exception $e) {
            $failureCount++;
        }

        // Only one should succeed
        $this->assertEquals(1, $successCount, 'Only one concurrent booking should succeed');
        $this->assertEquals(2, $failureCount, 'Two concurrent bookings should fail');

        // Verify only one appointment exists at 10:00
        $gregorianDate = Verta::parseFormat('Y-m-d', $jalaliDate)->datetime()->format('Y-m-d');
        
        $appointments = Appointment::byTherapist($this->therapist->id)
            ->where('start_time', Carbon::parse($gregorianDate . ' 10:00'))
            ->get();

        $this->assertCount(1, $appointments, 'Only one appointment should exist at the time slot');
    }

    /** @test */
    public function it_allows_booking_after_existing_appointment_ends(): void
    {
        $jalaliDate = $this->getFutureJalaliDate(3);
        $gregorianDate = Verta::parseFormat('Y-m-d', $jalaliDate)->datetime()->format('Y-m-d');

        // Create first appointment at 10:00-11:00
        $appointment1 = $this->createAction->execute([
            'therapist_id' => $this->therapist->id,
            'service_id' => $this->therapistService->id,
            'date' => $jalaliDate,
            'start_time' => '10:00',
            'client_name' => 'First Client',
            'client_phone' => '09123456789',
        ]);

        $this->assertNotNull($appointment1);

        // Create second appointment at 11:00-12:00 (immediately after)
        $appointment2 = $this->createAction->execute([
            'therapist_id' => $this->therapist->id,
            'service_id' => $this->therapistService->id,
            'date' => $jalaliDate,
            'start_time' => '11:00',
            'client_name' => 'Second Client',
            'client_phone' => '09123456788',
        ]);

        $this->assertNotNull($appointment2);

        // Verify both appointments exist
        $count = Appointment::byTherapist($this->therapist->id)
            ->whereDate('start_time', $gregorianDate)
            ->count();

        $this->assertEquals(2, $count);
    }

    /** @test */
    public function it_prevents_overlapping_appointment_at_the_end_of_existing_slot(): void
    {
        $jalaliDate = $this->getFutureJalaliDate(3);

        // Create appointment at 10:00-11:00
        $this->createAction->execute([
            'therapist_id' => $this->therapist->id,
            'service_id' => $this->therapistService->id,
            'date' => $jalaliDate,
            'start_time' => '10:00',
            'client_name' => 'First Client',
            'client_phone' => '09123456789',
        ]);

        // Try to create appointment at 10:30-11:30 (overlaps)
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('این زمان دیگر در دسترس نیست');

        $this->createAction->execute([
            'therapist_id' => $this->therapist->id,
            'service_id' => $this->therapistService->id,
            'date' => $jalaliDate,
            'start_time' => '10:30',
            'client_name' => 'Second Client',
            'client_phone' => '09123456788',
        ]);
    }

    /** @test */
    public function it_prevents_overlapping_appointment_at_the_start_of_existing_slot(): void
    {
        $jalaliDate = $this->getFutureJalaliDate(3);

        // Create appointment at 11:00-12:00
        $this->createAction->execute([
            'therapist_id' => $this->therapist->id,
            'service_id' => $this->therapistService->id,
            'date' => $jalaliDate,
            'start_time' => '11:00',
            'client_name' => 'First Client',
            'client_phone' => '09123456789',
        ]);

        // Try to create appointment at 10:00-11:00 (ends at same time as existing starts)
        // This should succeed since end time equals start time
        $appointment = $this->createAction->execute([
            'therapist_id' => $this->therapist->id,
            'service_id' => $this->therapistService->id,
            'date' => $jalaliDate,
            'start_time' => '10:00',
            'client_name' => 'Second Client',
            'client_phone' => '09123456788',
        ]);

        $this->assertNotNull($appointment);

        // But try to create at 10:30-11:30 (overlaps)
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('این زمان دیگر در دسترس نیست');

        $this->createAction->execute([
            'therapist_id' => $this->therapist->id,
            'service_id' => $this->therapistService->id,
            'date' => $jalaliDate,
            'start_time' => '10:30',
            'client_name' => 'Third Client',
            'client_phone' => '09123456787',
        ]);
    }

    /** @test */
    public function it_prevents_booking_in_the_past(): void
    {
        // Yesterday
        $yesterday = Carbon::yesterday();
        $jalaliYesterday = Verta::instance($yesterday)->format('Y-m-d');

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('زمان انتخابی باید در آینده باشد');

        $this->createAction->execute([
            'therapist_id' => $this->therapist->id,
            'service_id' => $this->therapistService->id,
            'date' => $jalaliYesterday,
            'start_time' => '10:00',
            'client_name' => 'Past Booking',
            'client_phone' => '09123456789',
        ]);
    }

    /** @test */
    public function it_creates_appointment_with_correct_status_and_price(): void
    {
        $jalaliDate = $this->getFutureJalaliDate(3);

        $appointment = $this->createAction->execute([
            'therapist_id' => $this->therapist->id,
            'service_id' => $this->therapistService->id,
            'date' => $jalaliDate,
            'start_time' => '10:00',
            'client_name' => 'Ali Rezaei',
            'client_phone' => '09123456789',
            'client_email' => 'ali@example.com',
        ]);

        $this->assertEquals(AppointmentStatus::CONFIRMED, $appointment->status);
        $this->assertEquals('1500000', $appointment->price);
        $this->assertEquals(60, $appointment->duration);
        $this->assertEquals('Ali Rezaei', $appointment->client_name);
        $this->assertEquals('09123456789', $appointment->client_phone);
        $this->assertEquals('ali@example.com', $appointment->client_email);
    }

    /** @test */
    public function it_calculates_end_time_correctly_based_on_service_duration(): void
    {
        $jalaliDate = $this->getFutureJalaliDate(3);
        $gregorianDate = Verta::parseFormat('Y-m-d', $jalaliDate)->datetime()->format('Y-m-d');

        $appointment = $this->createAction->execute([
            'therapist_id' => $this->therapist->id,
            'service_id' => $this->therapistService->id,
            'date' => $jalaliDate,
            'start_time' => '10:00',
            'client_name' => 'Test User',
            'client_phone' => '09123456789',
        ]);

        $expectedStart = Carbon::parse($gregorianDate . ' 10:00');
        $expectedEnd = Carbon::parse($gregorianDate . ' 11:00'); // 60 minutes later

        $this->assertTrue($appointment->start_time->equalTo($expectedStart));
        $this->assertTrue($appointment->end_time->equalTo($expectedEnd));
    }

    /** @test */
    public function it_locks_appointments_during_transaction(): void
    {
        $jalaliDate = $this->getFutureJalaliDate(3);
        $gregorianDate = Verta::parseFormat('Y-m-d', $jalaliDate)->datetime()->format('Y-m-d');

        // Create existing appointment
        Appointment::create([
            'therapist_id' => $this->therapist->id,
            'client_name' => 'Existing',
            'client_phone' => '09123456789',
            'service_type_id' => $this->serviceType->id,
            'start_time' => Carbon::parse($gregorianDate . ' 09:00'),
            'end_time' => Carbon::parse($gregorianDate . ' 10:00'),
            'duration' => 60,
            'price' => '1500000',
            'status' => AppointmentStatus::CONFIRMED,
        ]);

        // The action should lock all appointments for this date
        DB::enableQueryLog();

        $appointment = $this->createAction->execute([
            'therapist_id' => $this->therapist->id,
            'service_id' => $this->therapistService->id,
            'date' => $jalaliDate,
            'start_time' => '10:00',
            'client_name' => 'New Client',
            'client_phone' => '09123456788',
        ]);

        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        // Check that a SELECT ... FOR UPDATE query was executed
        $lockQuery = collect($queries)->first(function ($query) {
            return str_contains(strtoupper($query['query']), 'FOR UPDATE');
        });

        $this->assertNotNull($lockQuery, 'A locking query should have been executed');
        $this->assertNotNull($appointment);
    }

    /** @test */
    public function it_allows_different_therapists_to_book_same_time_slot(): void
    {
        $jalaliDate = $this->getFutureJalaliDate(3);

        // Create second therapist
        $therapist2 = User::factory()->create([
            'role_id' => $this->therapist->role_id, // Same role
        ]);
        
        $service2 = TherapistService::create([
            'therapist_id' => $therapist2->id,
            'service_type_id' => $this->serviceType->id,
            'duration' => 60,
            'price' => '1500000',
            'is_active' => true,
        ]);

        // Create schedule for therapist 2
        for ($day = 0; $day <= 5; $day++) {
            TherapistSchedule::create([
                'therapist_id' => $therapist2->id,
                'day_of_week' => $day,
                'is_active' => true,
                'start_time' => '09:00',
                'end_time' => '18:00',
                'break_duration' => 15,
            ]);
        }

        // Both therapists book at 10:00
        $appointment1 = $this->createAction->execute([
            'therapist_id' => $this->therapist->id,
            'service_id' => $this->therapistService->id,
            'date' => $jalaliDate,
            'start_time' => '10:00',
            'client_name' => 'Client A',
            'client_phone' => '09123456789',
        ]);

        $appointment2 = $this->createAction->execute([
            'therapist_id' => $therapist2->id,
            'service_id' => $service2->id,
            'date' => $jalaliDate,
            'start_time' => '10:00',
            'client_name' => 'Client B',
            'client_phone' => '09123456788',
        ]);

        $this->assertNotNull($appointment1);
        $this->assertNotNull($appointment2);
        $this->assertNotEquals($appointment1->therapist_id, $appointment2->therapist_id);
    }

    /** @test */
    public function it_throws_exception_when_service_is_not_active(): void
    {
        // Deactivate service
        $this->therapistService->update(['is_active' => false]);

        $jalaliDate = $this->getFutureJalaliDate(3);

        $this->expectException(\Exception::class);

        $this->createAction->execute([
            'therapist_id' => $this->therapist->id,
            'service_id' => $this->therapistService->id,
            'date' => $jalaliDate,
            'start_time' => '10:00',
            'client_name' => 'Test',
            'client_phone' => '09123456789',
        ]);
    }

    /** @test */
    public function it_throws_exception_when_service_does_not_belong_to_therapist(): void
    {
        $otherTherapist = User::factory()->create(['role' => 'therapist']);

        $jalaliDate = $this->getFutureJalaliDate(3);

        $this->expectException(\Exception::class);

        $this->createAction->execute([
            'therapist_id' => $otherTherapist->id,
            'service_id' => $this->therapistService->id, // Belongs to $this->therapist
            'date' => $jalaliDate,
            'start_time' => '10:00',
            'client_name' => 'Test',
            'client_phone' => '09123456789',
        ]);
    }

    /**
     * Helper: Get Jalali date N days in the future
     */
    private function getFutureJalaliDate(int $daysFromNow): string
    {
        $futureDate = Carbon::today()->addDays($daysFromNow);
        return Verta::instance($futureDate)->format('Y-m-d');
    }
}

<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Modules\Appointment\Domain\Appointment;
use App\Modules\Appointment\Domain\AppointmentStatus;
use App\Modules\Appointment\Services\AvailabilityService;
use App\Modules\Appointment\Services\OverlapDetectionService;
use App\Modules\Appointment\Services\SlotGeneratorService;
use App\Modules\Schedule\Domain\ScheduleOverride;
use App\Modules\Schedule\Domain\DayOfWeek;
use App\Modules\Schedule\Domain\OverrideType;
use App\Modules\Schedule\Domain\TherapistSchedule;
use App\Modules\Schedule\Services\ScheduleService;
use App\Modules\Service\Domain\ServiceType;
use App\Modules\Service\Domain\TherapistService;
use App\Modules\Users\Models\Role;
use App\Modules\Users\Models\User;
use Carbon\Carbon;
use Hekmatinasser\Verta\Verta;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AvailabilityServiceTest extends TestCase
{
    use RefreshDatabase;

    private AvailabilityService $availabilityService;
    private ScheduleService $scheduleService;
    private SlotGeneratorService $slotGenerator;
    private OverlapDetectionService $overlapDetector;
    
    private User $therapist;
    private ServiceType $serviceType;
    private TherapistService $therapistService;

    protected function setUp(): void
    {
        parent::setUp();

        // Create services
        $this->scheduleService = app(ScheduleService::class);
        $this->slotGenerator = app(SlotGeneratorService::class);
        $this->overlapDetector = app(OverlapDetectionService::class);
        $this->availabilityService = new AvailabilityService(
            $this->scheduleService,
            $this->slotGenerator,
            $this->overlapDetector
        );

        // Create roles
        $therapistRole = Role::create([
            'name' => Role::THERAPIST,
            'display_name' => 'Therapist',
            'description' => 'Massage therapist',
        ]);

        // Create test data
        $this->therapist = User::factory()->create([
            'role_id' => $therapistRole->id,
        ]);

        $this->serviceType = ServiceType::create([
            'name' => 'Swedish Massage',
            'name_fa' => 'ماساژ سوئدی',
            'description' => 'Relaxing Swedish massage',
            'description_fa' => 'ماساژ آرامش‌بخش سوئدی',
        ]);

        $this->therapistService = TherapistService::create([
            'therapist_id' => $this->therapist->id,
            'service_type_id' => $this->serviceType->id,
            'duration' => 60, // 1 hour
            'price' => '1000000',
            'is_active' => true,
        ]);

        // Create weekly schedule (Monday - Saturday)
        for ($day = 0; $day <= 5; $day++) {
            TherapistSchedule::create([
                'therapist_id' => $this->therapist->id,
                'day_of_week' => $day,
                'is_active' => true,
                'start_time' => '09:00',
                'end_time' => '17:00',
                'break_duration' => 15,
            ]);
        }

        // Friday unavailable
        TherapistSchedule::create([
            'therapist_id' => $this->therapist->id,
            'day_of_week' => 5,
            'is_active' => false,
            'start_time' => '09:00',
            'end_time' => '17:00',
            'break_duration' => 15,
        ]);
    }

    /** @test */
    public function it_returns_available_slots_for_working_day(): void
    {
        // Monday = 1
        $jalaliDate = $this->getNextJalaliDateByDayOfWeek(1);
        
        $result = $this->availabilityService->getAvailableSlots(
            $this->therapist->id,
            $jalaliDate
        );

        $this->assertTrue($result['is_available']);
        $this->assertEquals('weekly_schedule', $result['schedule_type']);
        $this->assertCount(1, $result['slots_by_service']);
        $this->assertNotEmpty($result['slots_by_service'][0]['slots']);
        
        // Should have multiple slots (09:00-17:00 with 60min duration + 15min break)
        // (17:00 - 09:00) = 480 minutes / (60 + 15) = ~6 slots
        $this->assertGreaterThanOrEqual(6, $result['slots_by_service'][0]['total_slots']);
    }

    /** @test */
    public function it_returns_unavailable_for_non_working_day(): void
    {
        // Friday = 5
        $jalaliDate = $this->getNextJalaliDateByDayOfWeek(5);
        
        $result = $this->availabilityService->getAvailableSlots(
            $this->therapist->id,
            $jalaliDate
        );

        $this->assertFalse($result['is_available']);
        $this->assertEquals('therapist_unavailable', $result['reason']);
        $this->assertEmpty($result['slots_by_service']);
    }

    /** @test */
    public function it_excludes_occupied_slots_from_available_slots(): void
    {
        $jalaliDate = $this->getNextJalaliDateByDayOfWeek(1); // Monday
        $gregorianDate = Verta::parseFormat('Y-m-d', $jalaliDate)->datetime()->format('Y-m-d');

        // Create an appointment at 10:00-11:00
        Appointment::create([
            'therapist_id' => $this->therapist->id,
            'client_name' => 'Ali Ahmadi',
            'client_phone' => '09123456789',
            'service_type_id' => $this->serviceType->id,
            'start_time' => Carbon::parse($gregorianDate . ' 10:00'),
            'end_time' => Carbon::parse($gregorianDate . ' 11:00'),
            'duration' => 60,
            'price' => '1000000',
            'status' => AppointmentStatus::CONFIRMED,
        ]);

        $result = $this->availabilityService->getAvailableSlots(
            $this->therapist->id,
            $jalaliDate
        );

        $this->assertTrue($result['is_available']);
        
        $slots = $result['slots_by_service'][0]['slots'];
        
        // Check that 10:00 slot is not in the list
        $slotTimes = array_column($slots, 'start_time_label');
        $this->assertNotContains('10:00', $slotTimes);
        
        // But 09:00 should still be available
        $this->assertContains('09:00', $slotTimes);
    }

    /** @test */
    public function it_respects_schedule_overrides(): void
    {
        $jalaliDate = $this->getNextJalaliDateByDayOfWeek(1); // Monday (normally available)
        $gregorianDate = Verta::parseFormat('Y-m-d', $jalaliDate)->datetime()->format('Y-m-d');

        // Create override: unavailable
        ScheduleOverride::create([
            'therapist_id' => $this->therapist->id,
            'date' => Carbon::parse($gregorianDate),
            'type' => OverrideType::UNAVAILABLE,
        ]);

        $result = $this->availabilityService->getAvailableSlots(
            $this->therapist->id,
            $jalaliDate
        );

        $this->assertFalse($result['is_available']);
        $this->assertEquals('therapist_unavailable', $result['reason']);
    }

    /** @test */
    public function it_uses_custom_hours_from_override(): void
    {
        $jalaliDate = $this->getNextJalaliDateByDayOfWeek(1); // Monday
        $gregorianDate = Verta::parseFormat('Y-m-d', $jalaliDate)->datetime()->format('Y-m-d');

        // Create override: custom hours (10:00-14:00)
        ScheduleOverride::create([
            'therapist_id' => $this->therapist->id,
            'date' => Carbon::parse($gregorianDate),
            'type' => OverrideType::CUSTOM_HOURS,
            'start_time' => '10:00',
            'end_time' => '14:00',
            'break_duration' => 15,
        ]);

        $result = $this->availabilityService->getAvailableSlots(
            $this->therapist->id,
            $jalaliDate
        );

        $this->assertTrue($result['is_available']);
        $this->assertEquals('override', $result['schedule_type']);
        $this->assertEquals('10:00', $result['working_hours']['start']);
        $this->assertEquals('14:00', $result['working_hours']['end']);
        
        $slots = $result['slots_by_service'][0]['slots'];
        $slotTimes = array_column($slots, 'start_time_label');
        
        // Should have slots starting from 10:00, not 09:00
        $this->assertContains('10:00', $slotTimes);
        $this->assertNotContains('09:00', $slotTimes);
        $this->assertNotContains('14:00', $slotTimes); // 14:00 is end time, not a start slot
    }

    /** @test */
    public function it_returns_no_slots_when_no_services_configured(): void
    {
        // Delete therapist service
        $this->therapistService->delete();

        $jalaliDate = $this->getNextJalaliDateByDayOfWeek(1);
        
        $result = $this->availabilityService->getAvailableSlots(
            $this->therapist->id,
            $jalaliDate
        );

        $this->assertFalse($result['is_available']);
        $this->assertEquals('no_services_configured', $result['reason']);
    }

    /** @test */
    public function it_checks_if_specific_slot_is_available(): void
    {
        $jalaliDate = $this->getNextJalaliDateByDayOfWeek(1); // Monday
        
        // Check available slot
        $isAvailable = $this->availabilityService->isSlotAvailable(
            $this->therapist->id,
            $jalaliDate,
            '10:00',
            60
        );
        
        $this->assertTrue($isAvailable);
    }

    /** @test */
    public function it_checks_slot_is_unavailable_when_occupied(): void
    {
        $jalaliDate = $this->getNextJalaliDateByDayOfWeek(1); // Monday
        $gregorianDate = Verta::parseFormat('Y-m-d', $jalaliDate)->datetime()->format('Y-m-d');

        // Create appointment at 10:00
        Appointment::create([
            'therapist_id' => $this->therapist->id,
            'client_name' => 'Reza Rezaei',
            'client_phone' => '09123456789',
            'service_type_id' => $this->serviceType->id,
            'start_time' => Carbon::parse($gregorianDate . ' 10:00'),
            'end_time' => Carbon::parse($gregorianDate . ' 11:00'),
            'duration' => 60,
            'price' => '1000000',
            'status' => AppointmentStatus::CONFIRMED,
        ]);

        $isAvailable = $this->availabilityService->isSlotAvailable(
            $this->therapist->id,
            $jalaliDate,
            '10:00',
            60
        );
        
        $this->assertFalse($isAvailable);
    }

    /** @test */
    public function it_gets_availability_summary_for_date_range(): void
    {
        // Get 7 days summary starting from next Monday
        $startDate = $this->getNextJalaliDateByDayOfWeek(1);
        $startCarbon = Verta::parseFormat('Y-m-d', $startDate)->datetime();
        $endDate = Verta::instance($startCarbon->copy()->addDays(6))->format('Y-m-d');

        $summary = $this->availabilityService->getAvailabilitySummary(
            $this->therapist->id,
            $startDate,
            $endDate
        );

        $this->assertCount(7, $summary);
        
        // Check that Friday (5) is unavailable
        $friday = collect($summary)->first(fn($day) => 
            Carbon::parse($day['date_gregorian'])->dayOfWeek === 5
        );
        
        $this->assertFalse($friday['is_available']);
        $this->assertEquals(0, $friday['total_slots']);
    }

    /** @test */
    public function it_finds_next_available_slot(): void
    {
        $nextSlot = $this->availabilityService->getNextAvailableSlot(
            $this->therapist->id,
            $this->therapistService->id,
            14
        );

        $this->assertNotNull($nextSlot);
        $this->assertArrayHasKey('date', $nextSlot);
        $this->assertArrayHasKey('slot', $nextSlot);
        $this->assertArrayHasKey('service', $nextSlot);
    }

    /** @test */
    public function it_returns_null_when_no_slot_available_in_range(): void
    {
        // Make therapist unavailable by deleting schedule
        TherapistSchedule::where('therapist_id', $this->therapist->id)->delete();

        $nextSlot = $this->availabilityService->getNextAvailableSlot(
            $this->therapist->id,
            $this->therapistService->id,
            7
        );

        $this->assertNull($nextSlot);
    }

    /**
     * Helper: Get next occurrence of specific day of week in Jalali calendar
     */
    private function getNextJalaliDateByDayOfWeek(int $dayOfWeek): string
    {
        $today = Carbon::today();
        $daysToAdd = ($dayOfWeek - $today->dayOfWeek + 7) % 7;
        
        if ($daysToAdd === 0) {
            $daysToAdd = 7; // Next week same day
        }
        
        $targetDate = $today->copy()->addDays($daysToAdd);
        
        return Verta::instance($targetDate)->format('Y-m-d');
    }
}

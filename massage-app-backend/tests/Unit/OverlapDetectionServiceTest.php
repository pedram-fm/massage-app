<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Modules\Appointment\Domain\Appointment;
use App\Modules\Appointment\Domain\AppointmentStatus;
use App\Modules\Appointment\Services\OverlapDetectionService;
use App\Modules\Service\Domain\ServiceType;
use App\Modules\Users\Models\Role;
use App\Modules\Users\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Tests\TestCase;

class OverlapDetectionServiceTest extends TestCase
{
    use RefreshDatabase;

    private OverlapDetectionService $overlapDetector;
    private User $therapist;
    private ServiceType $serviceType;

    protected function setUp(): void
    {
        parent::setUp();

        $this->overlapDetector = app(OverlapDetectionService::class);

        // Create role
        $therapistRole = Role::create([
            'name' => Role::THERAPIST,
            'display_name' => 'Therapist',
            'description' => 'Massage therapist',
        ]);

        $this->therapist = User::factory()->create([
            'role_id' => $therapistRole->id,
        ]);

        $this->serviceType = ServiceType::create([
            'name' => 'Deep Tissue',
            'name_fa' => 'ماساژ بافت عمیق',
            'description' => 'Deep tissue massage',
            'description_fa' => 'ماساژ بافت عمیق',
        ]);
    }

    /** @test */
    public function it_detects_no_overlap_when_times_dont_overlap(): void
    {
        $start1 = Carbon::parse('2024-01-15 10:00');
        $end1 = Carbon::parse('2024-01-15 11:00');
        
        $start2 = Carbon::parse('2024-01-15 11:00');
        $end2 = Carbon::parse('2024-01-15 12:00');

        $overlap = $this->overlapDetector->timeRangesOverlap($start1, $end1, $start2, $end2);

        $this->assertFalse($overlap);
    }

    /** @test */
    public function it_detects_overlap_when_times_overlap(): void
    {
        $start1 = Carbon::parse('2024-01-15 10:00');
        $end1 = Carbon::parse('2024-01-15 11:00');
        
        $start2 = Carbon::parse('2024-01-15 10:30');
        $end2 = Carbon::parse('2024-01-15 11:30');

        $overlap = $this->overlapDetector->timeRangesOverlap($start1, $end1, $start2, $end2);

        $this->assertTrue($overlap);
    }

    /** @test */
    public function it_detects_overlap_when_one_range_contains_another(): void
    {
        $start1 = Carbon::parse('2024-01-15 10:00');
        $end1 = Carbon::parse('2024-01-15 12:00');
        
        $start2 = Carbon::parse('2024-01-15 10:30');
        $end2 = Carbon::parse('2024-01-15 11:00');

        $overlap = $this->overlapDetector->timeRangesOverlap($start1, $end1, $start2, $end2);

        $this->assertTrue($overlap);
    }

    /** @test */
    public function it_detects_overlap_when_ranges_are_identical(): void
    {
        $start1 = Carbon::parse('2024-01-15 10:00');
        $end1 = Carbon::parse('2024-01-15 11:00');
        
        $start2 = Carbon::parse('2024-01-15 10:00');
        $end2 = Carbon::parse('2024-01-15 11:00');

        $overlap = $this->overlapDetector->timeRangesOverlap($start1, $end1, $start2, $end2);

        $this->assertTrue($overlap);
    }

    /** @test */
    public function it_checks_for_overlap_with_existing_appointments(): void
    {
        // Create appointment at 10:00-11:00
        Appointment::create([
            'therapist_id' => $this->therapist->id,
            'client_name' => 'Sara Mohammadi',
            'client_phone' => '09123456789',
            'service_type_id' => $this->serviceType->id,
            'start_time' => Carbon::parse('2024-01-15 10:00'),
            'end_time' => Carbon::parse('2024-01-15 11:00'),
            'duration' => 60,
            'price' => '1000000',
            'status' => AppointmentStatus::CONFIRMED,
        ]);

        // Check overlap at 10:30-11:30 (should overlap)
        $hasOverlap = $this->overlapDetector->hasOverlap(
            $this->therapist->id,
            Carbon::parse('2024-01-15 10:30'),
            Carbon::parse('2024-01-15 11:30')
        );

        $this->assertTrue($hasOverlap);
    }

    /** @test */
    public function it_checks_no_overlap_with_different_time(): void
    {
        // Create appointment at 10:00-11:00
        Appointment::create([
            'therapist_id' => $this->therapist->id,
            'client_name' => 'Maryam Karimi',
            'client_phone' => '09123456789',
            'service_type_id' => $this->serviceType->id,
            'start_time' => Carbon::parse('2024-01-15 10:00'),
            'end_time' => Carbon::parse('2024-01-15 11:00'),
            'duration' => 60,
            'price' => '1000000',
            'status' => AppointmentStatus::CONFIRMED,
        ]);

        // Check overlap at 11:00-12:00 (should NOT overlap - back-to-back)
        $hasOverlap = $this->overlapDetector->hasOverlap(
            $this->therapist->id,
            Carbon::parse('2024-01-15 11:00'),
            Carbon::parse('2024-01-15 12:00')
        );

        $this->assertFalse($hasOverlap);
    }

    /** @test */
    public function it_excludes_specific_appointment_when_checking_overlap(): void
    {
        // Create appointment at 10:00-11:00
        $appointment = Appointment::create([
            'therapist_id' => $this->therapist->id,
            'client_name' => 'Hassan Alavi',
            'client_phone' => '09123456789',
            'service_type_id' => $this->serviceType->id,
            'start_time' => Carbon::parse('2024-01-15 10:00'),
            'end_time' => Carbon::parse('2024-01-15 11:00'),
            'duration' => 60,
            'price' => '1000000',
            'status' => AppointmentStatus::CONFIRMED,
        ]);

        // Check overlap at same time but exclude this appointment (for update scenario)
        $hasOverlap = $this->overlapDetector->hasOverlap(
            $this->therapist->id,
            Carbon::parse('2024-01-15 10:00'),
            Carbon::parse('2024-01-15 11:00'),
            $appointment->id
        );

        $this->assertFalse($hasOverlap);
    }

    /** @test */
    public function it_ignores_cancelled_appointments_when_checking_overlap(): void
    {
        // Create cancelled appointment at 10:00-11:00
        Appointment::create([
            'therapist_id' => $this->therapist->id,
            'client_name' => 'Zahra Hosseini',
            'client_phone' => '09123456789',
            'service_type_id' => $this->serviceType->id,
            'start_time' => Carbon::parse('2024-01-15 10:00'),
            'end_time' => Carbon::parse('2024-01-15 11:00'),
            'duration' => 60,
            'price' => '1000000',
            'status' => AppointmentStatus::CANCELLED,
        ]);

        // Check overlap at 10:00-11:00 (should NOT overlap because appointment is cancelled)
        $hasOverlap = $this->overlapDetector->hasOverlap(
            $this->therapist->id,
            Carbon::parse('2024-01-15 10:00'),
            Carbon::parse('2024-01-15 11:00')
        );

        $this->assertFalse($hasOverlap);
    }

    /** @test */
    public function it_gets_overlapping_appointments(): void
    {
        // Create two appointments
        Appointment::create([
            'therapist_id' => $this->therapist->id,
            'client_name' => 'Client A',
            'client_phone' => '09123456789',
            'service_type_id' => $this->serviceType->id,
            'start_time' => Carbon::parse('2024-01-15 10:00'),
            'end_time' => Carbon::parse('2024-01-15 11:00'),
            'duration' => 60,
            'price' => '1000000',
            'status' => AppointmentStatus::CONFIRMED,
        ]);

        Appointment::create([
            'therapist_id' => $this->therapist->id,
            'client_name' => 'Client B',
            'client_phone' => '09123456789',
            'service_type_id' => $this->serviceType->id,
            'start_time' => Carbon::parse('2024-01-15 14:00'),
            'end_time' => Carbon::parse('2024-01-15 15:00'),
            'duration' => 60,
            'price' => '1000000',
            'status' => AppointmentStatus::CONFIRMED,
        ]);

        // Check for overlaps at 10:30-14:30 (should get first appointment only)
        $overlaps = $this->overlapDetector->getOverlappingAppointments(
            $this->therapist->id,
            Carbon::parse('2024-01-15 10:30'),
            Carbon::parse('2024-01-15 14:30')
        );

        $this->assertCount(2, $overlaps);
    }

    /** @test */
    public function it_filters_occupied_slots_from_available_slots(): void
    {
        $slots = [
            ['start_time' => '2024-01-15 09:00:00', 'end_time' => '2024-01-15 10:00:00', 'start_time_label' => '09:00'],
            ['start_time' => '2024-01-15 10:00:00', 'end_time' => '2024-01-15 11:00:00', 'start_time_label' => '10:00'],
            ['start_time' => '2024-01-15 11:00:00', 'end_time' => '2024-01-15 12:00:00', 'start_time_label' => '11:00'],
            ['start_time' => '2024-01-15 12:00:00', 'end_time' => '2024-01-15 13:00:00', 'start_time_label' => '12:00'],
        ];

        // Appointment at 10:00-11:00
        $appointment = new Appointment([
            'start_time' => Carbon::parse('2024-01-15 10:00'),
            'end_time' => Carbon::parse('2024-01-15 11:00'),
        ]);

        $appointments = collect([$appointment]);

        $availableSlots = $this->overlapDetector->filterOccupiedSlots($slots, $appointments);

        $this->assertCount(3, $availableSlots);
        
        // Check that 10:00 slot is removed
        $times = array_column($availableSlots, 'start_time_label');
        $this->assertNotContains('10:00', $times);
        $this->assertContains('09:00', $times);
        $this->assertContains('11:00', $times);
    }

    /** @test */
    public function it_validates_time_is_within_working_hours(): void
    {
        $startTime = Carbon::parse('2024-01-15 10:00');
        $endTime = Carbon::parse('2024-01-15 11:00');

        $isWithin = $this->overlapDetector->isWithinWorkingHours(
            $startTime,
            $endTime,
            '09:00',
            '17:00'
        );

        $this->assertTrue($isWithin);
    }

    /** @test */
    public function it_validates_time_is_outside_working_hours(): void
    {
        $startTime = Carbon::parse('2024-01-15 08:00');
        $endTime = Carbon::parse('2024-01-15 09:00');

        $isWithin = $this->overlapDetector->isWithinWorkingHours(
            $startTime,
            $endTime,
            '09:00',
            '17:00'
        );

        $this->assertFalse($isWithin);
    }

    /** @test */
    public function it_validates_time_exceeds_working_hours_end(): void
    {
        $startTime = Carbon::parse('2024-01-15 16:30');
        $endTime = Carbon::parse('2024-01-15 17:30');

        $isWithin = $this->overlapDetector->isWithinWorkingHours(
            $startTime,
            $endTime,
            '09:00',
            '17:00'
        );

        $this->assertFalse($isWithin);
    }

    /** @test */
    public function it_gets_available_gaps_between_appointments(): void
    {
        $appointments = collect([
            new Appointment([
                'start_time' => Carbon::parse('2024-01-15 10:00'),
                'end_time' => Carbon::parse('2024-01-15 11:00'),
            ]),
            new Appointment([
                'start_time' => Carbon::parse('2024-01-15 14:00'),
                'end_time' => Carbon::parse('2024-01-15 15:00'),
            ]),
        ]);

        $gaps = $this->overlapDetector->getAvailableGaps(
            $appointments,
            '09:00',
            '17:00',
            Carbon::parse('2024-01-15')
        );

        $this->assertCount(3, $gaps);
        
        // Gap 1: 09:00 - 10:00
        $this->assertEquals('09:00', $gaps[0]['start']);
        $this->assertEquals('10:00', $gaps[0]['end']);
        $this->assertEquals(60, $gaps[0]['minutes']);
        
        // Gap 2: 11:00 - 14:00
        $this->assertEquals('11:00', $gaps[1]['start']);
        $this->assertEquals('14:00', $gaps[1]['end']);
        $this->assertEquals(180, $gaps[1]['minutes']);
        
        // Gap 3: 15:00 - 17:00
        $this->assertEquals('15:00', $gaps[2]['start']);
        $this->assertEquals('17:00', $gaps[2]['end']);
        $this->assertEquals(120, $gaps[2]['minutes']);
    }

    /** @test */
    public function it_returns_no_gaps_when_fully_booked(): void
    {
        $appointments = collect([
            new Appointment([
                'start_time' => Carbon::parse('2024-01-15 09:00'),
                'end_time' => Carbon::parse('2024-01-15 17:00'),
            ]),
        ]);

        $gaps = $this->overlapDetector->getAvailableGaps(
            $appointments,
            '09:00',
            '17:00',
            Carbon::parse('2024-01-15')
        );

        $this->assertEmpty($gaps);
    }

    /** @test */
    public function it_returns_full_day_as_gap_when_no_appointments(): void
    {
        $appointments = collect([]);

        $gaps = $this->overlapDetector->getAvailableGaps(
            $appointments,
            '09:00',
            '17:00',
            Carbon::parse('2024-01-15')
        );

        $this->assertCount(1, $gaps);
        $this->assertEquals('09:00', $gaps[0]['start']);
        $this->assertEquals('17:00', $gaps[0]['end']);
        $this->assertEquals(480, $gaps[0]['minutes']);
    }
}

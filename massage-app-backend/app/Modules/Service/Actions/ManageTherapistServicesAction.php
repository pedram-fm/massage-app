<?php

declare(strict_types=1);

namespace App\Modules\Service\Actions;

use App\Modules\Service\Domain\ServiceType;
use App\Modules\Service\Domain\TherapistService;
use App\Modules\Users\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class ManageTherapistServicesAction
{
    /**
     * Add or update a service for therapist
     *
     * @param User $user
     * @param int $serviceTypeId
     * @param array $data
     * @return TherapistService
     * @throws \Exception
     */
    public function addOrUpdateService(User $user, int $serviceTypeId, array $data): TherapistService
    {
        return DB::transaction(function () use ($user, $serviceTypeId, $data) {
            // Verify service type exists and is active
            $serviceType = ServiceType::where('id', $serviceTypeId)
                ->where('is_active', true)
                ->firstOrFail();

            // Validate duration and price
            $duration = isset($data['duration']) ? (int) $data['duration'] : $serviceType->default_duration;
            $price = isset($data['price']) ? (int) $data['price'] : null;

            if ($duration < 15 || $duration > 480) {
                throw new \InvalidArgumentException('Duration must be between 15 and 480 minutes');
            }

            if ($price !== null && ($price < 0 || $price > 100000000)) {
                throw new \InvalidArgumentException('Price must be between 0 and 100,000,000');
            }

            $isAvailable = isset($data['is_available']) ? (bool) $data['is_available'] : true;

            // Find existing service or create new one
            $service = TherapistService::updateOrCreate(
                [
                    'therapist_id' => $user->id,
                    'service_type_id' => $serviceTypeId,
                ],
                [
                    'duration' => $duration,
                    'price' => $price,
                    'is_available' => $isAvailable,
                    'display_order' => $data['display_order'] ?? $this->getNextDisplayOrder($user->id),
                ]
            );

            return $service->fresh(['serviceType']);
        });
    }

    /**
     * Remove a service for therapist
     *
     * @param User $user
     * @param int $serviceId
     * @return bool
     * @throws \Exception
     */
    public function removeService(User $user, int $serviceId): bool
    {
        return DB::transaction(function () use ($user, $serviceId) {
            $service = TherapistService::where('id', $serviceId)
                ->where('therapist_id', $user->id)
                ->firstOrFail();

            // Check if there are any future appointments with this service
            $hasFutureAppointments = DB::table('appointments')
                ->where('therapist_id', $user->id)
                ->where('service_type_id', $service->service_type_id)
                ->where('status', '!=', 'cancelled')
                ->where('start_time', '>=', now())
                ->exists();

            if ($hasFutureAppointments) {
                throw new \RuntimeException('Cannot remove service with future appointments');
            }

            return $service->delete();
        });
    }

    /**
     * Toggle service availability
     *
     * @param User $user
     * @param int $serviceId
     * @param bool $isAvailable
     * @return TherapistService
     * @throws \Exception
     */
    public function toggleAvailability(User $user, int $serviceId, bool $isAvailable): TherapistService
    {
        $service = TherapistService::where('id', $serviceId)
            ->where('therapist_id', $user->id)
            ->firstOrFail();

        $service->update(['is_available' => $isAvailable]);

        return $service->fresh(['serviceType']);
    }

    /**
     * Reorder services for therapist
     *
     * @param User $user
     * @param array $serviceOrders Array of ['id' => serviceId, 'order' => displayOrder]
     * @return Collection
     * @throws \Exception
     */
    public function reorderServices(User $user, array $serviceOrders): Collection
    {
        return DB::transaction(function () use ($user, $serviceOrders) {
            foreach ($serviceOrders as $item) {
                if (!isset($item['id']) || !isset($item['order'])) {
                    throw new \InvalidArgumentException('Each item must have id and order');
                }

                TherapistService::where('id', $item['id'])
                    ->where('therapist_id', $user->id)
                    ->update(['display_order' => (int) $item['order']]);
            }

            return TherapistService::where('therapist_id', $user->id)
                ->with('serviceType')
                ->ordered()
                ->get();
        });
    }

    /**
     * Bulk update services for therapist
     *
     * @param User $user
     * @param array $services Array of service data
     * @return Collection
     * @throws \Exception
     */
    public function bulkUpdate(User $user, array $services): Collection
    {
        return DB::transaction(function () use ($user, $services) {
            $updatedServices = collect();

            foreach ($services as $serviceData) {
                if (!isset($serviceData['service_type_id'])) {
                    throw new \InvalidArgumentException('service_type_id is required');
                }

                $service = $this->addOrUpdateService(
                    $user,
                    $serviceData['service_type_id'],
                    $serviceData
                );

                $updatedServices->push($service);
            }

            return $updatedServices;
        });
    }

    /**
     * Get next display order for therapist
     *
     * @param int $therapistId
     * @return int
     */
    private function getNextDisplayOrder(int $therapistId): int
    {
        $maxOrder = TherapistService::where('therapist_id', $therapistId)
            ->max('display_order');

        return ($maxOrder ?? 0) + 1;
    }
}

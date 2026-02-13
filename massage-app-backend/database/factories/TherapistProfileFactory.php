<?php

namespace Database\Factories;

use App\Modules\Therapist\Domain\TherapistProfile;
use App\Modules\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Modules\Therapist\Domain\TherapistProfile>
 */
class TherapistProfileFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     */
    protected $model = TherapistProfile::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'bio' => $this->faker->paragraph(3),
            'bio_fa' => 'متخصص ماساژ درمانی با سال‌ها تجربه در زمینه‌های مختلف ماساژ. تمرکز بر روی بهبود کیفیت زندگی و کاهش درد مراجعین.',
            'avatar' => null,
            'specialties' => $this->faker->randomElements(
                ['ماساژ سوئدی', 'ماساژ بافت عمیق', 'ماساژ ورزشی', 'ماساژ آروماتراپی', 'ماساژ درمانی', 'ماساژ تایلندی', 'رفلکسولوژی', 'ماساژ هات استون', 'ماساژ بارداری', 'ماساژ کودک'],
                $this->faker->numberBetween(2, 5)
            ),
            'years_of_experience' => $this->faker->numberBetween(1, 20),
            'certifications' => $this->faker->randomElements(
                [
                    'گواهینامه ماساژ درمانی از دانشگاه تهران',
                    'مدرک تخصصی ماساژ ورزشی',
                    'گواهینامه بین‌المللی ماساژ سوئدی',
                    'دوره تخصصی آناتومی و فیزیولوژی',
                    'مدرک آروماتراپی حرفه‌ای',
                    'گواهینامه ماساژ بافت عمیق پیشرفته',
                ],
                $this->faker->numberBetween(1, 4)
            ),
            'rating' => $this->faker->randomFloat(2, 3.5, 5.0),
            'total_appointments' => $this->faker->numberBetween(0, 500),
            'is_accepting_clients' => $this->faker->boolean(85), // 85% accepting
        ];
    }

    /**
     * Indicate that the therapist is accepting clients.
     */
    public function accepting(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_accepting_clients' => true,
        ]);
    }

    /**
     * Indicate that the therapist is not accepting clients.
     */
    public function notAccepting(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_accepting_clients' => false,
        ]);
    }

    /**
     * Indicate that the therapist is highly rated.
     */
    public function highlyRated(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => $this->faker->randomFloat(2, 4.5, 5.0),
            'total_appointments' => $this->faker->numberBetween(100, 500),
        ]);
    }

    /**
     * Indicate that the therapist is experienced.
     */
    public function experienced(): static
    {
        return $this->state(fn (array $attributes) => [
            'years_of_experience' => $this->faker->numberBetween(10, 20),
            'rating' => $this->faker->randomFloat(2, 4.0, 5.0),
            'total_appointments' => $this->faker->numberBetween(200, 1000),
        ]);
    }

    /**
     * Indicate that the therapist is a beginner.
     */
    public function beginner(): static
    {
        return $this->state(fn (array $attributes) => [
            'years_of_experience' => $this->faker->numberBetween(0, 2),
            'rating' => $this->faker->randomFloat(2, 3.5, 4.5),
            'total_appointments' => $this->faker->numberBetween(0, 50),
            'certifications' => $this->faker->randomElements(
                [
                    'گواهینامه ماساژ درمانی از دانشگاه تهران',
                    'دوره تخصصی آناتومی و فیزیولوژی',
                ],
                $this->faker->numberBetween(1, 2)
            ),
        ]);
    }

    /**
     * Indicate that the therapist has a complete profile with avatar.
     */
    public function withAvatar(): static
    {
        return $this->state(fn (array $attributes) => [
            'avatar' => 'avatars/' . $this->faker->uuid() . '.jpg',
        ]);
    }

    /**
     * Indicate that the therapist specializes in specific areas.
     */
    public function specializing(array $specialties): static
    {
        return $this->state(fn (array $attributes) => [
            'specialties' => $specialties,
        ]);
    }

    /**
     * Indicate that the therapist is for a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}

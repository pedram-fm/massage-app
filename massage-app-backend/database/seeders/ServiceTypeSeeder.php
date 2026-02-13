<?php

namespace Database\Seeders;

use App\Modules\Service\Domain\ServiceType;
use Illuminate\Database\Seeder;

class ServiceTypeSeeder extends Seeder
{
    /**
     * Seed service types
     */
    public function run(): void
    {
        $serviceTypes = [
            [
                'name' => 'Deep Tissue Massage',
                'name_fa' => 'ماساژ بافت عمیق',
                'description' => 'A therapeutic massage focused on the deeper layers of muscle tissue',
                'description_fa' => 'ماساژ درمانی با تمرکز بر لایه‌های عمیق‌تر بافت عضلانی',
                'default_duration' => 60,
                'is_active' => true,
            ],
            [
                'name' => 'Swedish Massage',
                'name_fa' => 'ماساژ سوئدی',
                'description' => 'A gentle full-body massage perfect for relaxation',
                'description_fa' => 'ماساژ ملایم تمام بدن برای آرامش و استراحت',
                'default_duration' => 60,
                'is_active' => true,
            ],
            [
                'name' => 'Sports Massage',
                'name_fa' => 'ماساژ ورزشی',
                'description' => 'Designed for athletes to prevent and treat injuries',
                'description_fa' => 'طراحی شده برای ورزشکاران جهت پیشگیری و درمان آسیب‌ها',
                'default_duration' => 60,
                'is_active' => true,
            ],
            [
                'name' => 'Aromatherapy Massage',
                'name_fa' => 'ماساژ آروماتراپی',
                'description' => 'Massage with essential oils for healing and relaxation',
                'description_fa' => 'ماساژ با روغن‌های اساسی برای درمان و آرامش',
                'default_duration' => 60,
                'is_active' => true,
            ],
            [
                'name' => 'Hot Stone Massage',
                'name_fa' => 'ماساژ سنگ گرم',
                'description' => 'Uses heated stones to relax muscles and improve circulation',
                'description_fa' => 'استفاده از سنگ‌های گرم برای شل کردن عضلات و بهبود گردش خون',
                'default_duration' => 90,
                'is_active' => true,
            ],
            [
                'name' => 'Prenatal Massage',
                'name_fa' => 'ماساژ بارداری',
                'description' => 'Specially designed for pregnant women',
                'description_fa' => 'طراحی ویژه برای زنان باردار',
                'default_duration' => 60,
                'is_active' => true,
            ],
            [
                'name' => 'Thai Massage',
                'name_fa' => 'ماساژ تایلندی',
                'description' => 'Ancient healing technique combining acupressure and yoga',
                'description_fa' => 'تکنیک درمانی باستانی ترکیبی از فشار نقطه‌ای و یوگا',
                'default_duration' => 90,
                'is_active' => true,
            ],
            [
                'name' => 'Reflexology',
                'name_fa' => 'ماساژ رفلکسولوژی',
                'description' => 'Pressure point massage on feet, hands, and ears',
                'description_fa' => 'ماساژ نقاط فشاری در پاها، دست‌ها و گوش‌ها',
                'default_duration' => 30,
                'is_active' => true,
            ],
        ];

        foreach ($serviceTypes as $serviceType) {
            ServiceType::updateOrCreate(
                ['name' => $serviceType['name']],
                $serviceType
            );
        }

        $this->command->info('Service types seeded successfully!');
    }
}

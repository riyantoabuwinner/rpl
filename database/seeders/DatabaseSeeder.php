<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            MasterAcademicSeeder::class,
            RplGelombangSeeder::class,
            RplRubrikUjiPetikSeeder::class,
            RplWorkflowSampleSeeder::class,
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Cpmk;
use App\Models\IndikatorCpmk;
use App\Models\Kurikulum;
use App\Models\MataKuliah;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MasterAcademicSeeder extends Seeder
{
    public function run(): void
    {
        $kaprodi = User::where('email', 'kaprodi.ti@kampus.ac.id')->first();

        // 1. Program Studi Teknik Informatika
        $prodiTi = Prodi::firstOrCreate(
            ['kode_prodi' => '55201'],
            [
                'id' => (string) Str::uuid(),
                'nama_prodi' => 'Teknik Informatika',
                'jenjang' => 'S1',
                'fakultas' => 'Fakultas Ilmu Komputer & Teknologi Informasi',
                'kaprodi_id' => $kaprodi?->id,
                'is_active' => true,
            ]
        );

        // 2. Program Studi Sistem Informasi
        $prodiSi = Prodi::firstOrCreate(
            ['kode_prodi' => '57201'],
            [
                'id' => (string) Str::uuid(),
                'nama_prodi' => 'Sistem Informasi',
                'jenjang' => 'S1',
                'fakultas' => 'Fakultas Ilmu Komputer & Teknologi Informasi',
                'kaprodi_id' => $kaprodi?->id,
                'is_active' => true,
            ]
        );

        // 3. Program Studi Tadris Matematika (UIN SSC Form 2/F02 & Form 3/F03)
        $prodiTmt = Prodi::firstOrCreate(
            ['kode_prodi' => 'TMT'],
            [
                'id' => (string) Str::uuid(),
                'nama_prodi' => 'Tadris Matematika',
                'jenjang' => 'S1',
                'fakultas' => 'Fakultas Tarbiyah dan Keguruan',
                'kaprodi_id' => $kaprodi?->id,
                'is_active' => true,
            ]
        );

        // 4. Program Studi Bimbingan dan Konseling Islam (BKI - Flowchart UIN SSC)
        $prodiBki = Prodi::firstOrCreate(
            ['kode_prodi' => 'BKI'],
            [
                'id' => (string) Str::uuid(),
                'nama_prodi' => 'Bimbingan dan Konseling Islam',
                'jenjang' => 'S1',
                'fakultas' => 'Fakultas Dakwah dan Komunikasi Islam',
                'kaprodi_id' => $kaprodi?->id,
                'is_active' => true,
            ]
        );

        // Kurikulum Tadris Matematika
        $kurikulumTmt = Kurikulum::firstOrCreate(
            ['prodi_id' => $prodiTmt->id, 'tahun_mulai' => '2026'],
            [
                'id' => (string) Str::uuid(),
                'nama_kurikulum' => 'Kurikulum OBE Tadris Matematika 2026',
                'tahun_akhir' => '2030',
                'total_sks_lulus' => 144,
                'is_active' => true,
            ]
        );

        $tmtCourses = [
            [
                'kode_mk' => 'TMT625006',
                'nama_mk' => 'Kalkulus Differensial',
                'sks' => 3,
                'semester' => 1,
                'kategori_mk' => 'Wajib',
                'deskripsi' => 'Fungsi, limit, turunan fungsi aljabar & trigonometri, aplikasi turunan dan kemonotonan.',
                'silabus_ringkas' => 'Fungsi, transformasi grafik, limit fungsi, turunan, teorema turunan, geogebra.',
                'cpmk' => [
                    [
                        'kode_cpmk' => 'CPMK-1',
                        'deskripsi_cpmk' => 'Mampu menganalisis domain, range, grafik, dan karakteristik Fungsi secara mandiri.',
                        'indikator' => [
                            ['kode_indikator' => 'IND-1.1', 'deskripsi_indikator' => 'Menganalisis domain, range grafik linear, kuadrat, kubik, pecahan, akar, dan trigonometri.'],
                        ]
                    ],
                    [
                        'kode_cpmk' => 'CPMK-2',
                        'deskripsi_cpmk' => 'Mampu menggunakan definisi Limit Fungsi secara intuitif dan formal berbantuan GeoGebra.',
                        'indikator' => [
                            ['kode_indikator' => 'IND-2.1', 'deskripsi_indikator' => 'Membuktikan nilai limit secara aljabar dan software.'],
                        ]
                    ],
                    [
                        'kode_cpmk' => 'CPMK-3',
                        'deskripsi_cpmk' => 'Mampu membuktikan teorema turunan dan menyelesaikan masalah nilai ekstrim fungsi.',
                        'indikator' => [
                            ['kode_indikator' => 'IND-3.1', 'deskripsi_indikator' => 'Menganalisis kemonotonan dan kecekungan grafik melalui turunan pertama dan kedua.'],
                        ]
                    ],
                ]
            ],
            [
                'kode_mk' => 'TMT625015',
                'nama_mk' => 'Kalkulus Integral',
                'sks' => 3,
                'semester' => 2,
                'kategori_mk' => 'Wajib',
                'deskripsi' => 'Anti turunan, notasi sigma, jumlah Riemann, integral tentu, aplikasi volume benda putar.',
                'silabus_ringkas' => 'Anti turunan, integral substitusi, integral parsial, luas daerah, volume benda putar.',
                'cpmk' => [
                    [
                        'kode_cpmk' => 'CPMK-1',
                        'deskripsi_cpmk' => 'Mampu menganalisis bentuk anti turunan dan jumlah Riemann untuk integral tentu.',
                        'indikator' => [
                            ['kode_indikator' => 'IND-1.1', 'deskripsi_indikator' => 'Menghitung integral fungsi aljabar dan transenden.'],
                        ]
                    ],
                    [
                        'kode_cpmk' => 'CPMK-2',
                        'deskripsi_cpmk' => 'Mampu mengaplikasikan integral untuk menghitung luas daerah dan volume benda putar.',
                        'indikator' => [
                            ['kode_indikator' => 'IND-2.1', 'deskripsi_indikator' => 'Menyelesaikan permasalahan aplikasi integral berbantuan GeoGebra.'],
                        ]
                    ],
                ]
            ],
        ];

        foreach ($tmtCourses as $mkData) {
            $cpmkList = $mkData['cpmk'];
            unset($mkData['cpmk']);

            $mk = MataKuliah::firstOrCreate(
                [
                    'kurikulum_id' => $kurikulumTmt->id,
                    'kode_mk' => $mkData['kode_mk'],
                ],
                array_merge($mkData, [
                    'id' => (string) Str::uuid(),
                    'terbuka_rpl' => true,
                ])
            );

            $cpmkOrder = 1;
            foreach ($cpmkList as $cData) {
                $indikatorList = $cData['indikator'];
                unset($cData['indikator']);

                $cpmk = Cpmk::firstOrCreate(
                    [
                        'mata_kuliah_id' => $mk->id,
                        'kode_cpmk' => $cData['kode_cpmk'],
                    ],
                    [
                        'id' => (string) Str::uuid(),
                        'deskripsi_cpmk' => $cData['deskripsi_cpmk'],
                        'urutan' => $cpmkOrder++,
                    ]
                );

                $indOrder = 1;
                foreach ($indikatorList as $iData) {
                    IndikatorCpmk::firstOrCreate(
                        [
                            'cpmk_id' => $cpmk->id,
                            'kode_indikator' => $iData['kode_indikator'],
                        ],
                        [
                            'id' => (string) Str::uuid(),
                            'deskripsi_indikator' => $iData['deskripsi_indikator'],
                            'urutan' => $indOrder++,
                        ]
                    );
                }
            }
        }

        // 5. Kurikulum 2024 TI
        $kurikulumTi = Kurikulum::firstOrCreate(
            ['prodi_id' => $prodiTi->id, 'tahun_mulai' => '2024'],
            [
                'id' => (string) Str::uuid(),
                'nama_kurikulum' => 'Kurikulum Merdeka OBE Teknik Informatika 2024',
                'tahun_akhir' => '2028',
                'total_sks_lulus' => 144,
                'is_active' => true,
            ]
        );

        // 4. Mata Kuliah & CPMK
        $matkulList = [
            [
                'kode_mk' => 'IF302',
                'nama_mk' => 'Rekayasa Perangkat Lunak',
                'sks' => 3,
                'semester' => 4,
                'kategori_mk' => 'Wajib',
                'deskripsi' => 'Konsep dan metodologi pengembangan perangkat lunak modern (SDLC, Agile, CI/CD).',
                'silabus_ringkas' => 'SDLC, Agile Scrum, UML modeling, architectural patterns, software testing.',
                'cpmk' => [
                    [
                        'kode_cpmk' => 'CPMK-1',
                        'deskripsi_cpmk' => 'Mampu menganalisis dan mendesain arsitektur perangkat lunak berbasis kebutuhan bisnis.',
                        'indikator' => [
                            ['kode_indikator' => 'IND-1.1', 'deskripsi_indikator' => 'Menyusun dokumen Software Requirement Specification (SRS) secara komprehensif.'],
                            ['kode_indikator' => 'IND-1.2', 'deskripsi_indikator' => 'Merancang diagram arsitektur, database ERD, dan flow data sistem.'],
                        ]
                    ],
                    [
                        'kode_cpmk' => 'CPMK-2',
                        'deskripsi_cpmk' => 'Mampu menerapkan metodologi Agile / Scrum dalam kolaborasi pengembangan sistem.',
                        'indikator' => [
                            ['kode_indikator' => 'IND-2.1', 'deskripsi_indikator' => 'Mendemonstrasikan sprint planning, backlog grooming, dan code review.'],
                        ]
                    ],
                ]
            ],
            [
                'kode_mk' => 'IF201',
                'nama_mk' => 'Sistem Basis Data Terdistribusi',
                'sks' => 3,
                'semester' => 3,
                'kategori_mk' => 'Wajib',
                'deskripsi' => 'Pengelolaan basis data relasional dan non-relasional skala besar, replikasi, dan optimasi query.',
                'silabus_ringkas' => 'Normalisasi, indexing, query optimization, NoSQL, data replication & sharding.',
                'cpmk' => [
                    [
                        'kode_cpmk' => 'CPMK-1',
                        'deskripsi_cpmk' => 'Mampu merancang struktur database teroptimasi dan bebas anomali data.',
                        'indikator' => [
                            ['kode_indikator' => 'IND-1.1', 'deskripsi_indikator' => 'Menerapkan teknik normalisasi 3NF dan indexing efisien.'],
                        ]
                    ],
                    [
                        'kode_cpmk' => 'CPMK-2',
                        'deskripsi_cpmk' => 'Mampu mengimplementasikan sistem caching dan distributed cluster.',
                        'indikator' => [
                            ['kode_indikator' => 'IND-2.1', 'deskripsi_indikator' => 'Konfigurasi replication dan disaster recovery.'],
                        ]
                    ],
                ]
            ],
            [
                'kode_mk' => 'IF204',
                'nama_mk' => 'Pemrograman Web Enterprise',
                'sks' => 3,
                'semester' => 3,
                'kategori_mk' => 'Wajib',
                'deskripsi' => 'Pengembangan aplikasi web berskala enterprise dengan standard security dan API modern.',
                'silabus_ringkas' => 'Fullstack web architecture, REST API, SPA, state management, web security.',
                'cpmk' => [
                    [
                        'kode_cpmk' => 'CPMK-1',
                        'deskripsi_cpmk' => 'Mampu membangun antarmuka web interaktif yang aman dan responsif.',
                        'indikator' => [
                            ['kode_indikator' => 'IND-1.1', 'deskripsi_indikator' => 'Implementasi SPA/SSR dengan keamanan XSS, CSRF, dan sanitasi input.'],
                        ]
                    ],
                ]
            ],
            [
                'kode_mk' => 'IF401',
                'nama_mk' => 'Keamanan Siber & Jaringan Komputer',
                'sks' => 3,
                'semester' => 5,
                'kategori_mk' => 'Wajib',
                'deskripsi' => 'Prinsip kriptografi, manajemen kerentanan, hardening server, dan audit keamanan sistem.',
                'silabus_ringkas' => 'Cryptography, penetration testing, network defense, DevSecOps, compliance.',
                'cpmk' => [
                    [
                        'kode_cpmk' => 'CPMK-1',
                        'deskripsi_cpmk' => 'Mampu melakukan audit dan pengamanan infrastruktur server serta kode sumber.',
                        'indikator' => [
                            ['kode_indikator' => 'IND-1.1', 'deskripsi_indikator' => 'Analisis celah keamanan OWASP Top 10 dan mitigasi.'],
                        ]
                    ],
                ]
            ],
            [
                'kode_mk' => 'IF102',
                'nama_mk' => 'Algoritma & Struktur Data Lanjut',
                'sks' => 3,
                'semester' => 2,
                'kategori_mk' => 'Wajib',
                'deskripsi' => 'Struktur data kompleks (Trees, Graphs, Hash Tables) dan analisis efisiensi kompleksitas waktu/ruang.',
                'silabus_ringkas' => 'Big-O notation, binary trees, graph algorithms, dynamic programming.',
                'cpmk' => [
                    [
                        'kode_cpmk' => 'CPMK-1',
                        'deskripsi_cpmk' => 'Mampu mengimplementasikan algoritma optimal untuk pemecahan masalah komputasi kompleks.',
                        'indikator' => [
                            ['kode_indikator' => 'IND-1.1', 'deskripsi_indikator' => 'Mendesain algoritma dengan kompleksitas waktu minimal O(n log n).'],
                        ]
                    ],
                ]
            ]
        ];

        foreach ($matkulList as $mkData) {
            $cpmkList = $mkData['cpmk'];
            unset($mkData['cpmk']);

            $mk = MataKuliah::firstOrCreate(
                [
                    'kurikulum_id' => $kurikulumTi->id,
                    'kode_mk' => $mkData['kode_mk'],
                ],
                array_merge($mkData, [
                    'id' => (string) Str::uuid(),
                    'terbuka_rpl' => true,
                ])
            );

            $cpmkOrder = 1;
            foreach ($cpmkList as $cData) {
                $indikatorList = $cData['indikator'];
                unset($cData['indikator']);

                $cpmk = Cpmk::firstOrCreate(
                    [
                        'mata_kuliah_id' => $mk->id,
                        'kode_cpmk' => $cData['kode_cpmk'],
                    ],
                    [
                        'id' => (string) Str::uuid(),
                        'deskripsi_cpmk' => $cData['deskripsi_cpmk'],
                        'urutan' => $cpmkOrder++,
                    ]
                );

                $indOrder = 1;
                foreach ($indikatorList as $iData) {
                    IndikatorCpmk::firstOrCreate(
                        [
                            'cpmk_id' => $cpmk->id,
                            'kode_indikator' => $iData['kode_indikator'],
                        ],
                        [
                            'id' => (string) Str::uuid(),
                            'deskripsi_indikator' => $iData['deskripsi_indikator'],
                            'urutan' => $indOrder++,
                        ]
                    );
                }
            }
        }
    }
}

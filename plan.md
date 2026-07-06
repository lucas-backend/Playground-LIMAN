## Plan: Rapikan Struktur LIMAN

Tujuan utamanya adalah membuat basis kode yang lebih konsisten, mudah dibaca, dan gampang dikembangkan besok dengan fokus pada penamaan, struktur folder, pola komponen, dan pemisahan data dari UI. Dari repo saat ini, fondasi fitur sudah ada untuk login, dashboard, quiz, routing, komponen reusable, mock data, dan barrel export. Namun masih ada beberapa ketidakkonsistenan yang layak dirapikan sebelum menambah fitur baru.

**Yang sudah ada / sudah dikerjakan**

1. Setup project React + TypeScript + Vite sudah jalan, dengan script build, lint, dan preview tersedia di package.json.
2. Routing dasar sudah dibuat di src/router.tsx untuk halaman login, dashboard, quiz, dan 404.
3. Struktur folder sudah mulai dipisah antara src/components sebagai UI reusable dan src/features sebagai komponen spesifik fitur.
4. Folder fitur dashboard sudah dipecah menjadi beberapa komponen kecil seperti DashboardHeader, SearchBar, StatusAbsen, FeatureGrid, dan BottomNav.
5. Folder fitur quiz sudah dipisah menjadi subkomponen seperti QuizIndicator, QuestionText, AnswerField, QuizFooter, dan AnswerTypes.
6. Barrel file index.ts sudah dipakai di beberapa folder untuk membuat import lebih singkat.
7. Mock data sudah disiapkan untuk dashboard dan quiz, termasuk role-based data untuk siswa/guru/admin dan tipe soal quiz yang beragam.
8. Komponen reusable global seperti Button, Header, AdSlider, dan NotFound sudah dibuat.
9. Styling awal sudah konsisten ke Tailwind utility, dengan layout mobile-first yang menjadi dasar tampilan utama.
10. Validasi statis saat ini belum menunjukkan error compile atau lint, jadi baseline proyek masih sehat secara tooling.

**Catatan masalah yang terlihat sekarang**

1. Ada inkonsistensi penamaan folder/file, misalnya folder SerchBar yang typo dan beberapa file/folder yang belum seragam antara PascalCase, camelCase, dan nama domain.
2. src/App.tsx belum benar-benar mengembalikan JSX, jadi file itu belum menjadi komponen yang valid secara perilaku walaupun build saat ini tidak gagal.
3. Beberapa komponen masih sangat bergantung pada mock data hardcoded, jadi belum ada sumber data terpusat atau kontrak state yang jelas.
4. Ada placeholder navigation yang masih memakai href di tempat yang seharusnya mungkin nanti menjadi router-aware link atau handler state.
5. Beberapa komponen lokal masih kosong atau belum diisi, terutama AnswerTypes untuk TrueFalse dan Essay.
6. Beberapa aturan penamaan tipe dan prop belum seragam, misalnya penggunaan role, menu, feature, dan question yang masih bisa dibuat lebih konsisten.
7. Ada komentar penjelas yang cukup banyak di dalam file kode; sebagian berguna, tetapi sebagian nanti perlu dipangkas setelah struktur final stabil.

**Todo besok**

1. Rapikan nomenklatur (tata nama atau sistem penamaan) file dan folder terlebih dulu, mulai dari typo yang paling jelas seperti SerchBar menjadi SearchBar, lalu cek konsistensi nama folder komponen lain.
2. Standarkan pola export setiap folder komponen: satu public API lewat index.ts, satu komponen utama, dan file pendukung hanya jika memang diperlukan.
3. Benahi src/App.tsx agar menjadi entry component yang valid atau hilangkan jika router-provider sudah menjadi satu-satunya root render.
4. Rapikan routing agar redirect, 404, dan quiz not found punya alur yang lebih jelas dan tidak bergantung pada path sementara yang rawan berubah.
5. Pecah tanggung jawab halaman besar: dashboard, quiz, dan login harus tetap tipis, sementara logika konfigurasi, data mock, dan helper dipindahkan ke file yang tepat.
6. Rapikan data mock quiz dan dashboard supaya tidak bercampur dengan komponen UI; pisahkan data, tipe, dan utilitas secara disiplin.
7. Lengkapi komponen AnswerTypes yang masih kosong, atau tandai dengan jelas sebagai placeholder kalau memang belum dipakai.
8. Samakan gaya penamaan tipe dan props, termasuk penggunaan singular/plural, suffix Type, dan nama boolean seperti isPresent.
9. Evaluasi penggunaan tailwind class yang berulang; pindahkan pola yang sering dipakai ke komponen wrapper jika memang mulai menduplikasi style.
10. Audit semua file index.ts agar import dari luar fitur benar-benar konsisten dan tidak ada barrel yang mengekspor lebih dari yang dibutuhkan.
11. Tambahkan aturan konsistensi yang eksplisit di dokumentasi repo, supaya pola folder dan penamaan ini dipakai terus saat fitur baru dibuat.
12. Setelah itu, jalankan build dan lint lagi untuk memastikan refactor tidak merusak baseline.

**Prioritas eksekusi besok**

1. Nama file dan struktur folder.
2. Entry point dan routing flow.
3. Pemisahan data mock dan logika komponen.
4. Pengisian placeholder dan penyamaan naming conventions.
5. Validasi build/lint.

**Relevant files**

- c:/Users/User/Desktop/liman-app/src/router.tsx — alur route utama, redirect, 404, dan quiz route.
- c:/Users/User/Desktop/liman-app/src/App.tsx — entry component yang saat ini belum returning JSX dengan benar.
- c:/Users/User/Desktop/liman-app/src/main.tsx — root render dan sumber router provider.
- c:/Users/User/Desktop/liman-app/src/features/dashboard/Dashboard.tsx — contoh halaman yang masih banyak mock data dan layout langsung.
- c:/Users/User/Desktop/liman-app/src/features/dashboard/components/SerchBar/SearchBar.tsx — contoh typo penamaan folder yang perlu dirapikan.
- c:/Users/User/Desktop/liman-app/src/features/quiz/Quiz.tsx — alur halaman quiz, navigasi not found, dan state question index.
- c:/Users/User/Desktop/liman-app/src/features/quiz/components/AnswerField/AnswerField.tsx — dispatcher tipe soal ke komponen jawaban.
- c:/Users/User/Desktop/liman-app/src/features/quiz/components/AnswerField/AnswerTypes/\* — placeholder dan implementasi tipe jawaban quiz.
- c:/Users/User/Desktop/liman-app/doc/Struktur_Folder.md — referensi standar struktur folder dan barrel file yang sudah ditetapkan.
- c:/Users/User/Desktop/liman-app/src/components/Button/Button.tsx — contoh reusable component yang sudah cukup rapi dan bisa dijadikan pola.

**Verification**

1. Jalankan lint dan build setelah perubahan struktur atau penamaan selesai.
2. Pastikan import antar-folder tetap lolos TypeScript dan tidak ada barrel export yang putus.
3. Cek navigasi login, dashboard, quiz, dan 404 secara manual setelah routing dirapikan.
4. Jika ada rename folder/file, cek seluruh import terkait agar tidak ada path yang tertinggal.

**Decisions**

- Fokus besok adalah konsistensi dan maintainability dulu, bukan menambah fitur produk baru.
- Mock data tetap boleh dipakai sementara, tetapi harus dipisahkan dari presentational UI dan diberi batas yang jelas.
- Penamaan dan struktur folder akan dijadikan standar sebelum fitur baru ditambahkan lagi.
- Area yang sengaja belum disentuh adalah business logic autentikasi nyata, state management global, dan backend integration karena itu belum terlihat sebagai kebutuhan mendesak dari repo saat ini.

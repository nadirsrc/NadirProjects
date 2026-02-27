<?php
// ============================================
// BACKEND LOGIC — Proses perhitungan angsuran motor
// File ini memproses data dari form simulasi kredit
// menggunakan metode POST, lalu menghitung DP, bunga,
// total pinjaman, dan angsuran per bulan.
// ============================================

// Inisialisasi variabel default (kosong) supaya form tidak error saat pertama kali dibuka
$hasil = null;        // Menyimpan hasil perhitungan (null = belum dihitung)
$harga_motor = '';    // Harga motor yang diinput user
$dp_persen = '';      // Persentase uang muka (DP)
$tenor_tahun = '';    // Lama cicilan dalam tahun

// Cek apakah form sudah disubmit (method POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ambil data dari form yang dikirim user melalui POST
    $harga_motor = isset($_POST['harga_motor']) ? $_POST['harga_motor'] : 0;
    $dp_persen   = isset($_POST['dp_persen']) ? $_POST['dp_persen'] : 0;
    $tenor_tahun = isset($_POST['tenor_tahun']) ? $_POST['tenor_tahun'] : 0;

    // Konversi input string ke angka (hapus titik pemisah ribuan)
    $harga_motor_num = floatval(str_replace(['.', ','], ['', '.'], $harga_motor));
    $dp_persen_num   = floatval($dp_persen);   // Konversi DP ke float
    $tenor_tahun_num = intval($tenor_tahun);    // Konversi tenor ke integer

    // Validasi: harga harus > 0, DP antara 0-99%, tenor harus > 0
    if ($harga_motor_num > 0 && $dp_persen_num >= 0 && $dp_persen_num < 100 && $tenor_tahun_num > 0) {
        // === RUMUS PERHITUNGAN KREDIT ===
        $bunga_persen    = 20;                                        // Bunga flat 20% per tahun
        $bunga_rp        = ($bunga_persen / 100) * $harga_motor_num;  // Hitung bunga dalam Rupiah
        $dp_rp           = ($dp_persen_num / 100) * $harga_motor_num; // Hitung DP dalam Rupiah
        $tenor_bulan     = $tenor_tahun_num * 12;                     // Konversi tahun ke bulan
        $total_pinjaman  = ($harga_motor_num + $bunga_rp) - $dp_rp;   // Total yang harus dibayar (harga + bunga - DP)
        $angsuran_bulan  = $total_pinjaman / $tenor_bulan;            // Cicilan per bulan

        // Simpan semua hasil perhitungan ke array untuk ditampilkan di halaman
        $hasil = [
            'harga_motor'    => $harga_motor_num,
            'dp_persen'      => $dp_persen_num,
            'dp_rp'          => $dp_rp,
            'bunga_persen'   => $bunga_persen,
            'bunga_rp'       => $bunga_rp,
            'tenor_tahun'    => $tenor_tahun_num,
            'tenor_bulan'    => $tenor_bulan,
            'total_pinjaman' => $total_pinjaman,
            'angsuran_bulan' => $angsuran_bulan,
        ];
    } else {
        // Jika validasi gagal, tampilkan pesan error
        $error = "Mohon isi semua data dengan benar.";
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MotoKredit &mdash; Simulasi Kredit Motor</title>
    <!-- Icon library Bootstrap Icons untuk ikon-ikon di halaman -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Google Font: Plus Jakarta Sans untuk typography modern -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Menyisipkan file CSS secara langsung (inline) menggunakan PHP include -->
    <style><?php include 'assets/css/style.css'; ?></style>
</head>
<body>

    <!-- ============================================ -->
    <!-- HEADER/NAVBAR — Navigasi utama website      -->
    <!-- Di-include dari file terpisah (modular)      -->
    <!-- ============================================ -->
    <?php include 'includes/header.php'; ?>

    <!-- ============================================ -->
    <!-- HERO SECTION — Bagian pembuka halaman        -->
    <!-- Menampilkan judul utama, deskripsi singkat,   -->
    <!-- tombol CTA, dan statistik ringkas (DP, tenor, -->
    <!-- bunga) untuk menarik perhatian pengunjung.    -->
    <!-- ============================================ -->
    <section id="beranda" class="hero">
        <div class="container">
            <div class="hero-inner">
                <div class="hero-content">
                    <span class="hero-label">Simulasi Kredit Motor Online</span>
                    <h1>Wujudkan motor<br>impianmu, <em>sekarang.</em></h1>
                    <p>Hitung angsuran bulanan dalam hitungan detik. DP ringan mulai 10%, tenor hingga 5 tahun, proses tanpa ribet.</p>
                    <div class="hero-actions">
                        <a href="#simulasi" class="btn-main">Hitung Angsuran</a>
                        <a href="#motor" class="btn-ghost">Lihat Motor</a>
                    </div>
                    <div class="hero-stats">
                        <div class="stat">
                            <strong>10%</strong>
                            <span>DP Minimum</span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat">
                            <strong>5 Thn</strong>
                            <span>Tenor Maks</span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat">
                            <strong>20%</strong>
                            <span>Bunga/Tahun</span>
                        </div>
                    </div>
                </div>
                <div class="hero-visual">
                    <div class="hero-glow"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================ -->
    <!-- SIMULASI SECTION — Form kalkulator kredit    -->
    <!-- Berisi form input (harga motor, DP, tenor)   -->
    <!-- dan area hasil perhitungan. Data dikirim ke  -->
    <!-- PHP via POST, lalu hasil ditampilkan di sini -->
    <!-- ============================================ -->
    <section id="simulasi">
        <div class="container">
            <div class="section-label">Kalkulator</div>
            <h2 class="section-title">Simulasi angsuran</h2>
            <p class="section-desc">Masukkan data motor dan lihat estimasi cicilan per bulan.</p>

            <div class="sim-wrapper">
                <div class="sim-form-side">
                    <!-- Menampilkan pesan error jika validasi gagal -->
                    <?php if (isset($error)): ?>
                        <div class="form-error">
                            <i class="bi bi-info-circle"></i> <?= $error ?>
                        </div>
                    <?php endif; ?>

                    <!-- Form simulasi kredit — mengirim data ke index.php via POST -->
                    <!-- action="index.php#hasil" supaya halaman langsung scroll ke hasil setelah submit -->
                    <form method="POST" action="index.php#hasil">
                        <!-- Input harga motor (format teks supaya bisa pakai titik pemisah ribuan) -->
                        <div class="field">
                            <label for="harga_motor">Harga Motor</label>
                            <div class="field-input">
                                <span class="field-prefix">Rp</span>
                                <input type="text" id="harga_motor" name="harga_motor"
                                       placeholder="25.000.000"
                                       value="<?= htmlspecialchars($harga_motor) ?>" required>
                            </div>
                        </div>

                        <!-- Input persentase uang muka (DP) — angka 0 sampai 99 -->
                        <div class="field">
                            <label for="dp_persen">Uang Muka (DP)</label>
                            <div class="field-input">
                                <input type="number" id="dp_persen" name="dp_persen"
                                       placeholder="20" step="0.1" min="0" max="99"
                                       value="<?= htmlspecialchars($dp_persen) ?>" required>
                                <span class="field-suffix">%</span>
                            </div>
                        </div>

                        <!-- Input tenor cicilan dalam tahun (1 sampai 10 tahun) -->
                        <div class="field">
                            <label for="tenor_tahun">Tenor Cicilan</label>
                            <div class="field-input">
                                <input type="number" id="tenor_tahun" name="tenor_tahun"
                                       placeholder="3" min="1" max="10"
                                       value="<?= htmlspecialchars($tenor_tahun) ?>" required>
                                <span class="field-suffix">Tahun</span>
                            </div>
                        </div>

                        <!-- Tombol submit untuk menghitung, dan tombol reset untuk mengosongkan form -->
                        <!-- Reset menggunakan redirect ke index.php (GET) supaya form benar-benar kosong -->
                        <div class="form-actions">
                            <button type="submit" class="btn-main">Hitung Sekarang</button>
                            <button type="button" class="btn-text" onclick="window.location.href='index.php'">Reset</button>
                        </div>
                    </form>
                </div>

                <!-- ============================================ -->
                <!-- HASIL SIMULASI — Menampilkan hasil         -->
                <!-- perhitungan jika form sudah disubmit.      -->
                <!-- Jika belum, tampilkan placeholder kosong.  -->
                <!-- ============================================ -->
                <div class="sim-result-side" id="hasil">
                    <?php if ($hasil): ?>
                    <!-- Hasil perhitungan berhasil — tampilkan kartu hasil -->
                    <div class="result-card active">
                        <!-- Angsuran per bulan (highlight utama) -->
                        <div class="result-highlight">
                            <span class="result-label">Angsuran per bulan</span>
                            <!-- number_format() untuk format angka ke Rupiah (titik pemisah ribuan) -->
                            <span class="result-amount">Rp <?= number_format($hasil['angsuran_bulan'], 0, ',', '.') ?></span>
                            <span class="result-tenor">selama <?= $hasil['tenor_bulan'] ?> bulan</span>
                        </div>
                        <!-- Detail rincian: harga, DP, bunga, total pinjaman -->
                        <div class="result-details">
                            <div class="detail-row">
                                <span>Harga Motor</span>
                                <span>Rp <?= number_format($hasil['harga_motor'], 0, ',', '.') ?></span>
                            </div>
                            <div class="detail-row">
                                <span>DP (<?= $hasil['dp_persen'] ?>%)</span>
                                <span>Rp <?= number_format($hasil['dp_rp'], 0, ',', '.') ?></span>
                            </div>
                            <div class="detail-row">
                                <span>Bunga (<?= $hasil['bunga_persen'] ?>%)</span>
                                <span>Rp <?= number_format($hasil['bunga_rp'], 0, ',', '.') ?></span>
                            </div>
                            <div class="detail-row total">
                                <span>Total Pinjaman</span>
                                <span>Rp <?= number_format($hasil['total_pinjaman'], 0, ',', '.') ?></span>
                            </div>
                        </div>
                    </div>
                    <?php else: ?>
                    <!-- Belum ada hasil — tampilkan pesan kosong -->
                    <div class="result-empty">
                        <div class="result-empty-icon">
                            <i class="bi bi-arrow-left"></i>
                        </div>
                        <p>Isi form di samping untuk melihat hasil simulasi</p>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================ -->
    <!-- KATALOG MOTOR — Menampilkan daftar motor     -->
    <!-- populer beserta gambar, merek, kapasitas CC,  -->
    <!-- tipe transmisi, dan harga. Gambar diambil    -->
    <!-- dari CDN oto.com menggunakan lazy loading.   -->
    <!-- ============================================ -->
    <section id="motor">
        <div class="container">
            <div class="section-label">Katalog</div>
            <h2 class="section-title">Motor populer</h2>
            <p class="section-desc">Pilihan motor dari berbagai merek ternama di Indonesia.</p>

            <div class="motor-grid">
                <div class="motor-item">
                    <div class="motor-img">
                        <img src="https://imgcdn.oto.com/large/gallery/exterior/73/2569/honda-vario-160-slant-rear-view-full-image-213626.jpg" alt="Honda Vario 160" loading="lazy">
                        <span class="tag">Populer</span>
                    </div>
                    <div class="motor-info">
                        <div class="motor-meta">
                            <span class="motor-brand">Honda</span>
                            <span class="motor-cc">160cc &middot; CVT</span>
                        </div>
                        <h3>Vario 160</h3>
                        <p class="motor-harga">Rp 26.500.000</p>
                    </div>
                </div>

                <div class="motor-item">
                    <div class="motor-img">
                        <img src="https://imgcdn.oto.com/large/gallery/exterior/84/2260/yamaha-nmax-155-2020-slant-front-view-full-image-111324.jpg" alt="Yamaha NMAX 155" loading="lazy">
                        <span class="tag new">Baru</span>
                    </div>
                    <div class="motor-info">
                        <div class="motor-meta">
                            <span class="motor-brand">Yamaha</span>
                            <span class="motor-cc">155cc &middot; CVT</span>
                        </div>
                        <h3>NMAX 155</h3>
                        <p class="motor-harga">Rp 32.000.000</p>
                    </div>
                </div>

                <div class="motor-item">
                    <div class="motor-img">
                        <img src="https://imgcdn.oto.com/large/gallery/exterior/88/1897/kawasaki-ninja-250-right-side-viewfull-image-608241.jpg" alt="Kawasaki Ninja 250" loading="lazy">
                        <span class="tag sport">Sport</span>
                    </div>
                    <div class="motor-info">
                        <div class="motor-meta">
                            <span class="motor-brand">Kawasaki</span>
                            <span class="motor-cc">250cc &middot; 6-Speed</span>
                        </div>
                        <h3>Ninja 250</h3>
                        <p class="motor-harga">Rp 62.900.000</p>
                    </div>
                </div>

                <div class="motor-item">
                    <div class="motor-img">
                        <img src="https://imgcdn.oto.com/large/gallery/exterior/73/2270/honda-beat-esp-slant-rear-view-full-image-226189.jpg" alt="Honda Beat" loading="lazy">
                        <span class="tag">Best Seller</span>
                    </div>
                    <div class="motor-info">
                        <div class="motor-meta">
                            <span class="motor-brand">Honda</span>
                            <span class="motor-cc">110cc &middot; CVT</span>
                        </div>
                        <h3>Beat</h3>
                        <p class="motor-harga">Rp 17.800.000</p>
                    </div>
                </div>

                <div class="motor-item">
                    <div class="motor-img">
                        <img src="https://imgcdn.oto.com/large/gallery/exterior/84/2497/yamaha-r15-connected-slant-rear-view-full-image-178972.jpg" alt="Yamaha R15 V4" loading="lazy">
                        <span class="tag sport">Sport</span>
                    </div>
                    <div class="motor-info">
                        <div class="motor-meta">
                            <span class="motor-brand">Yamaha</span>
                            <span class="motor-cc">155cc &middot; 6-Speed</span>
                        </div>
                        <h3>R15 V4</h3>
                        <p class="motor-harga">Rp 38.500.000</p>
                    </div>
                </div>

                <div class="motor-item">
                    <div class="motor-img">
                        <img src="https://imgcdn.oto.com/large/gallery/exterior/92/1579/suzuki-gsx-r150-slant-rear-view-full-image-779279.jpg" alt="Suzuki GSX-R150" loading="lazy">
                        <span class="tag new">Baru</span>
                    </div>
                    <div class="motor-info">
                        <div class="motor-meta">
                            <span class="motor-brand">Suzuki</span>
                            <span class="motor-cc">150cc &middot; 6-Speed</span>
                        </div>
                        <h3>GSX-R150</h3>
                        <p class="motor-harga">Rp 30.200.000</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ============================================ -->
    <!-- FOOTER — Bagian bawah halaman                -->
    <!-- Di-include dari file terpisah (modular)      -->
    <!-- ============================================ -->
    <?php include 'includes/footer.php'; ?>

    <script>
        // ============================================
        // JAVASCRIPT — Interaktivitas halaman
        // ============================================

        // FORMAT HARGA INPUT
        // Menambahkan titik pemisah ribuan otomatis saat user mengetik harga motor
        // Contoh: 25000000 → 25.000.000
        const hargaInput = document.getElementById('harga_motor');
        hargaInput.addEventListener('input', function() {
            let v = this.value.replace(/\D/g, '');                       // Hapus semua karakter non-angka
            this.value = v.replace(/\B(?=(\d{3})+(?!\d))/g, '.');       // Tambahkan titik setiap 3 digit
        });

        // SCROLL REVEAL ANIMATION
        // Menggunakan Intersection Observer API untuk mendeteksi elemen
        // yang masuk ke viewport, lalu menambahkan class 'visible'
        // supaya animasi fade-in muncul saat user scroll ke bawah
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible'); // Tambah class visible saat elemen terlihat
                }
            });
        }, { threshold: 0.1 }); // Trigger saat 10% elemen terlihat

        // Terapkan reveal animation ke elemen motor, form simulasi, dan judul section
        document.querySelectorAll('.motor-item, .sim-wrapper, .section-title').forEach(el => {
            el.classList.add('reveal');  // Tambah class reveal (hidden by default di CSS)
            observer.observe(el);        // Mulai observasi elemen
        });

        // SMOOTH SCROLL
        // Membuat semua link anchor (href="#...") scroll secara halus
        // ke section tujuan, bukan langsung loncat
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault(); // Cegah behavior default (loncat langsung)
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll halus ke target
                }
            });
        });
    </script>
</body>
</html>
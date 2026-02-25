<?php
$hasil = null;
$harga_motor = '';
$dp_persen = '';
$tenor_tahun = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $harga_motor = isset($_POST['harga_motor']) ? $_POST['harga_motor'] : 0;
    $dp_persen   = isset($_POST['dp_persen']) ? $_POST['dp_persen'] : 0;
    $tenor_tahun = isset($_POST['tenor_tahun']) ? $_POST['tenor_tahun'] : 0;

    $harga_motor_num = floatval(str_replace(['.', ','], ['', '.'], $harga_motor));
    $dp_persen_num   = floatval($dp_persen);
    $tenor_tahun_num = intval($tenor_tahun);

    if ($harga_motor_num > 0 && $dp_persen_num >= 0 && $dp_persen_num < 100 && $tenor_tahun_num > 0) {
        $bunga_persen    = 20;
        $bunga_rp        = ($bunga_persen / 100) * $harga_motor_num;
        $dp_rp           = ($dp_persen_num / 100) * $harga_motor_num;
        $tenor_bulan     = $tenor_tahun_num * 12;
        $total_pinjaman  = ($harga_motor_num + $bunga_rp) - $dp_rp;
        $angsuran_bulan  = $total_pinjaman / $tenor_bulan;

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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style><?php include 'assets/css/style.css'; ?></style>
</head>
<body>

    <?php include 'includes/header.php'; ?>

    <!-- HERO -->
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

    <!-- SIMULASI -->
    <section id="simulasi">
        <div class="container">
            <div class="section-label">Kalkulator</div>
            <h2 class="section-title">Simulasi angsuran</h2>
            <p class="section-desc">Masukkan data motor dan lihat estimasi cicilan per bulan.</p>

            <div class="sim-wrapper">
                <div class="sim-form-side">
                    <?php if (isset($error)): ?>
                        <div class="form-error">
                            <i class="bi bi-info-circle"></i> <?= $error ?>
                        </div>
                    <?php endif; ?>

                    <form method="POST" action="index.php#hasil">
                        <div class="field">
                            <label for="harga_motor">Harga Motor</label>
                            <div class="field-input">
                                <span class="field-prefix">Rp</span>
                                <input type="text" id="harga_motor" name="harga_motor"
                                       placeholder="25.000.000"
                                       value="<?= htmlspecialchars($harga_motor) ?>" required>
                            </div>
                        </div>

                        <div class="field">
                            <label for="dp_persen">Uang Muka (DP)</label>
                            <div class="field-input">
                                <input type="number" id="dp_persen" name="dp_persen"
                                       placeholder="20" step="0.1" min="0" max="99"
                                       value="<?= htmlspecialchars($dp_persen) ?>" required>
                                <span class="field-suffix">%</span>
                            </div>
                        </div>

                        <div class="field">
                            <label for="tenor_tahun">Tenor Cicilan</label>
                            <div class="field-input">
                                <input type="number" id="tenor_tahun" name="tenor_tahun"
                                       placeholder="3" min="1" max="10"
                                       value="<?= htmlspecialchars($tenor_tahun) ?>" required>
                                <span class="field-suffix">Tahun</span>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn-main">Hitung Sekarang</button>
                            <button type="button" class="btn-text" onclick="window.location.href='index.php'">Reset</button>
                        </div>
                    </form>
                </div>

                <div class="sim-result-side" id="hasil">
                    <?php if ($hasil): ?>
                    <div class="result-card active">
                        <div class="result-highlight">
                            <span class="result-label">Angsuran per bulan</span>
                            <span class="result-amount">Rp <?= number_format($hasil['angsuran_bulan'], 0, ',', '.') ?></span>
                            <span class="result-tenor">selama <?= $hasil['tenor_bulan'] ?> bulan</span>
                        </div>
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

    <!-- PILIHAN MOTOR -->
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

    <?php include 'includes/footer.php'; ?>

    <script>
        // Format harga input
        const hargaInput = document.getElementById('harga_motor');
        hargaInput.addEventListener('input', function() {
            let v = this.value.replace(/\D/g, '');
            this.value = v.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        });

        // Scroll reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.motor-item, .sim-wrapper, .section-title').forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    </script>
</body>
</html>
/* ==========================================================================
   MOTOKREDIT — MODERN CLIENT-SIDE JAVASCRIPT ENGINE
   ========================================================================== */

// --- GLOBAL STATE ---
let lastCalculatedData = null;
let currentCatalogFilter = 'all';
let catalogSearchQuery = '';

// --- CATALOG DATA ---
const catalogData = [
    { name: 'Honda Beat', brand: 'Honda', type: 'Matic', price: 17800000, cc: '110cc · CVT', img: 'assets/images/beat.jpg', tag: 'Best Seller' },
    { name: 'Honda Vario 160', brand: 'Honda', type: 'Matic', price: 26500000, cc: '160cc · CVT', img: 'assets/images/vario.jpg', tag: 'Populer' },
    { name: 'Yamaha NMAX 155', brand: 'Yamaha', type: 'Matic', price: 32000000, cc: '155cc · CVT', img: 'assets/images/nmax.jpg', tag: 'Baru' },
    { name: 'Yamaha Aerox 155', brand: 'Yamaha', type: 'Matic', price: 27400000, cc: '155cc · CVT', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop', tag: 'Sporty' },
    { name: 'Kawasaki Ninja 250', brand: 'Kawasaki', type: 'Sport', price: 62900000, cc: '250cc · 6-Speed', img: 'assets/images/ninja.jpg', tag: 'Sport' },
    { name: 'Yamaha R15 V4', brand: 'Yamaha', type: 'Sport', price: 38500000, cc: '155cc · 6-Speed', img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop', tag: 'Sport' },
    { name: 'Suzuki GSX-R150', brand: 'Suzuki', type: 'Sport', price: 30200000, cc: '150cc · 6-Speed', img: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&auto=format&fit=crop', tag: 'Baru' },
    { name: 'Honda PCX 160', brand: 'Honda', type: 'Matic', price: 32600000, cc: '160cc · CVT', img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop', tag: 'Nyaman' }
];

// --- UTILITY FUNCTIONS ---
function parseRupiah(str) {
    if (!str) return 0;
    return parseFloat(String(str).replace(/\./g, '').replace(/,/g, '.')) || 0;
}

function formatRupiah(num) {
    return 'Rp ' + Math.round(num).toLocaleString('id-ID');
}

function updateChips(selector, activeText) {
    document.querySelectorAll(selector).forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim().includes(activeText.trim()));
    });
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');
    if (toast && toastText) {
        toastText.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// --- GLOBAL FUNCTIONS FOR INLINE HTML ONCLICK HANDLERS ---

window.calculateLoan = function(isUserClick = false) {
    const hargaInput = document.getElementById('harga_motor');
    const dpInput = document.getElementById('dp_persen');
    const tenorInput = document.getElementById('tenor_tahun');
    const bungaInput = document.getElementById('bunga_persen');
    const toggleAdmin = document.getElementById('toggleAdminFee');
    const toggleInsurance = document.getElementById('toggleInsurance');

    const harga = parseRupiah(hargaInput ? hargaInput.value : '25000000');
    const dpPct = parseFloat(dpInput ? dpInput.value : 20) || 0;
    const tenorThn = parseInt(tenorInput ? tenorInput.value : 3, 10) || 0;
    const bungaPct = parseFloat(bungaInput ? bungaInput.value : 20) || 0;

    if (harga <= 0 || dpPct < 0 || dpPct >= 100 || tenorThn <= 0) return;

    const dpRp = (dpPct / 100) * harga;
    const sisaPokok = harga - dpRp;
    const totalBungaRp = (bungaPct / 100) * sisaPokok * tenorThn; // Flat interest on Loan Principal
    const tenorBulan = tenorThn * 12;

    let adminFee = toggleAdmin && toggleAdmin.checked ? 600000 : 0;
    let insuranceFee = toggleInsurance && toggleInsurance.checked ? (0.015 * harga * tenorThn) : 0;

    const totalPinjaman = sisaPokok + totalBungaRp + adminFee + insuranceFee;
    const angsuranBulan = totalPinjaman / tenorBulan;

    // UI Updates
    const elAngsuran = document.getElementById('resAngsuran');
    if (elAngsuran) elAngsuran.textContent = formatRupiah(angsuranBulan);

    const elTenorText = document.getElementById('resTenorText');
    if (elTenorText) elTenorText.textContent = `selama ${tenorBulan} bulan (${tenorThn} tahun)`;

    const elHarga = document.getElementById('resHarga');
    if (elHarga) elHarga.textContent = formatRupiah(harga);

    const elDpRp = document.getElementById('resDpRp');
    if (elDpRp) elDpRp.textContent = `${formatRupiah(dpRp)} (${dpPct}%)`;

    const elSisaPokok = document.getElementById('resSisaPokok');
    if (elSisaPokok) elSisaPokok.textContent = formatRupiah(sisaPokok);

    const elBungaRp = document.getElementById('resBungaRp');
    if (elBungaRp) elBungaRp.textContent = `${formatRupiah(totalBungaRp)} (${bungaPct}%/thn)`;

    const elTotalPinjaman = document.getElementById('resTotalPinjaman');
    if (elTotalPinjaman) elTotalPinjaman.textContent = formatRupiah(totalPinjaman);

    const legDp = document.getElementById('legDpPct');
    if (legDp) legDp.textContent = `${dpPct}%`;

    // Progress breakdown bar
    const totalBudget = harga + totalBungaRp;
    const dpBarPct = Math.max(5, (dpRp / totalBudget) * 100);
    const pokokBarPct = Math.max(5, (sisaPokok / totalBudget) * 100);
    const bungaBarPct = Math.max(5, (totalBungaRp / totalBudget) * 100);

    const barDp = document.getElementById('barDp');
    const barPokok = document.getElementById('barPokok');
    const barBunga = document.getElementById('barBunga');

    if (barDp) barDp.style.width = `${dpBarPct}%`;
    if (barPokok) barPokok.style.width = `${pokokBarPct}%`;
    if (barBunga) barBunga.style.width = `${bungaBarPct}%`;

    lastCalculatedData = {
        harga, dpPct, dpRp, sisaPokok, bungaPct, totalBungaRp,
        adminFee, insuranceFee, tenorThn, tenorBulan, totalPinjaman, angsuranBulan
    };

    renderTenorMatrix();

    if (isUserClick) {
        const resultCard = document.getElementById('hasil') || document.querySelector('.sim-result-card');
        if (resultCard) {
            resultCard.classList.remove('pulse');
            void resultCard.offsetWidth;
            resultCard.classList.add('pulse');
        }
        showToast('Simulasi angsuran berhasil diperbarui!');
    }
};

window.setHarga = function(val) {
    const hargaInput = document.getElementById('harga_motor');
    if (hargaInput) {
        hargaInput.value = val.toLocaleString('id-ID');
        window.calculateLoan();
    }
};

window.setDp = function(pct) {
    const dpInput = document.getElementById('dp_persen');
    const dpSlider = document.getElementById('dp_slider');
    const dpValLabel = document.getElementById('dpValLabel');

    if (dpInput) dpInput.value = pct;
    if (dpSlider) dpSlider.value = pct;
    if (dpValLabel) dpValLabel.textContent = pct + '%';
    updateChips('.dp-chip', pct + '%');
    window.calculateLoan();
};

window.setTenor = function(years) {
    const tenorInput = document.getElementById('tenor_tahun');
    const tenorSlider = document.getElementById('tenor_slider');
    const tenorValLabel = document.getElementById('tenorValLabel');

    if (tenorInput) tenorInput.value = years;
    if (tenorSlider) tenorSlider.value = years;
    if (tenorValLabel) tenorValLabel.textContent = years + ' Tahun';
    updateChips('.tenor-chip', years + ' Thn');
    window.calculateLoan();
};

window.resetForm = function() {
    const hargaInput = document.getElementById('harga_motor');
    const bungaInput = document.getElementById('bunga_persen');
    const toggleAdmin = document.getElementById('toggleAdminFee');
    const toggleInsurance = document.getElementById('toggleInsurance');

    if (hargaInput) hargaInput.value = '25.000.000';
    window.setDp(20);
    window.setTenor(3);
    if (bungaInput) bungaInput.value = '20';
    if (toggleAdmin) toggleAdmin.checked = false;
    if (toggleInsurance) toggleInsurance.checked = false;
    window.clearSelectedMotor();
    window.calculateLoan();
    showToast('Form kalkulator telah di-reset.');
};

window.selectMotor = function(name, price) {
    const badge = document.getElementById('selectedMotorBadge');
    const badgeName = document.getElementById('selectedMotorName');
    if (badge && badgeName) {
        badge.style.display = 'flex';
        badgeName.textContent = name;
    }
    window.setHarga(price);

    const simSection = document.getElementById('simulasi');
    if (simSection) {
        simSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    showToast(`Motor ${name} dipilih! Simulasi diperbarui.`);
};

window.clearSelectedMotor = function() {
    const badge = document.getElementById('selectedMotorBadge');
    const badgeName = document.getElementById('selectedMotorName');
    if (badge && badgeName) {
        badge.style.display = 'none';
        badgeName.textContent = '-';
    }
};

window.copyResultSummary = function() {
    if (!lastCalculatedData) return;
    const d = lastCalculatedData;
    const selectedMotorName = document.getElementById('selectedMotorName')?.textContent || '-';
    const motorStr = selectedMotorName !== '-' ? `Motor: ${selectedMotorName}\n` : '';

    const text = `📋 RINGKASAN SIMULASI KREDIT MOTOKREDIT\n` +
        `${motorStr}` +
        `Harga Motor: ${formatRupiah(d.harga)}\n` +
        `Uang Muka (DP): ${formatRupiah(d.dpRp)} (${d.dpPct}%)\n` +
        `Sisa Pokok: ${formatRupiah(d.sisaPokok)}\n` +
        `Tenor: ${d.tenorBulan} bulan (${d.tenorThn} tahun)\n` +
        `Bunga: ${d.bungaPct}% / tahun (${formatRupiah(d.totalBungaRp)})\n` +
        (d.adminFee ? `Biaya Admin: ${formatRupiah(d.adminFee)}\n` : '') +
        (d.insuranceFee ? `Asuransi TLO: ${formatRupiah(d.insuranceFee)}\n` : '') +
        `----------------------------------------\n` +
        `ANGSURAN PER BULAN: ${formatRupiah(d.angsuranBulan)}\n` +
        `Total Kredit: ${formatRupiah(d.totalPinjaman)}\n` +
        `----------------------------------------\n` +
        `Dihitung via MotoKredit Calculator (GitHub Pages Ready)`;

    navigator.clipboard.writeText(text).then(() => {
        showToast('Ringkasan simulasi tersalin ke clipboard!');
    }).catch(() => {
        showToast('Gagal menyalin ringkasan.');
    });
};

window.openScheduleModal = function() {
    if (!lastCalculatedData) return;
    const d = lastCalculatedData;
    const tbody = document.getElementById('scheduleTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    let sisaHutang = d.totalPinjaman;
    const pokokPerBulan = d.sisaPokok / d.tenorBulan;
    const bungaPerBulan = d.totalBungaRp / d.tenorBulan;
    const angsuran = d.angsuranBulan;

    for (let i = 1; i <= d.tenorBulan; i++) {
        sisaHutang -= angsuran;
        if (sisaHutang < 0) sisaHutang = 0;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>Bulan ke-${i}</td>
            <td>${formatRupiah(angsuran)}</td>
            <td>${formatRupiah(pokokPerBulan)}</td>
            <td>${formatRupiah(bungaPerBulan)}</td>
            <td>${formatRupiah(sisaHutang)}</td>
        `;
        tbody.appendChild(tr);
    }

    const modal = document.getElementById('scheduleModalBackdrop');
    if (modal) modal.classList.add('open');
};

window.closeScheduleModal = function() {
    const modal = document.getElementById('scheduleModalBackdrop');
    if (modal) modal.classList.remove('open');
};

window.calculateBudgetMaxPrice = function() {
    const budgetInput = document.getElementById('budget_input');
    if (!budgetInput) return;
    const budgetVal = parseRupiah(budgetInput.value);
    const resMaxPrice = document.getElementById('budget_res_max');
    const resMotorRec = document.getElementById('budget_res_rec');

    if (budgetVal <= 0) {
        if (resMaxPrice) resMaxPrice.textContent = 'Rp 0';
        if (resMotorRec) resMotorRec.textContent = '-';
        return;
    }

    // Standard assumptions for budget matching: 20% DP, 3 Years Tenor, 20% Bunga
    const tenorBulan = 36;
    const totalLoanCapable = budgetVal * tenorBulan;
    const sisaPokokCapable = totalLoanCapable / 1.6;
    const maxHarga = sisaPokokCapable / 0.8;

    if (resMaxPrice) resMaxPrice.textContent = formatRupiah(maxHarga);

    // Find recommendations in catalog
    const match = catalogData.filter(m => m.price <= maxHarga).sort((a, b) => b.price - a.price);
    if (match.length > 0) {
        if (resMotorRec) resMotorRec.textContent = `Rekomendasi: ${match[0].name} (${formatRupiah(match[0].price)})`;
    } else {
        if (resMotorRec) resMotorRec.textContent = 'Tidak ada motor yang cocok dalam range budget ini';
    }
};

function renderTenorMatrix() {
    const container = document.getElementById('tenorMatrixGrid');
    if (!container || !lastCalculatedData) return;

    const d = lastCalculatedData;
    const tenors = [1, 2, 3, 4, 5];

    container.innerHTML = tenors.map(yr => {
        const months = yr * 12;
        const bungaRp = (d.bungaPct / 100) * d.sisaPokok * yr;
        const total = d.sisaPokok + bungaRp + d.adminFee + (d.insuranceFee ? (0.015 * d.harga * yr) : 0);
        const cicilan = total / months;
        const isSelected = yr === d.tenorThn;

        return `
            <div class="matrix-card ${isSelected ? 'selected' : ''}" onclick="setTenor(${yr})">
                <div class="matrix-tenor">${yr} Tahun (${months}x)</div>
                <div class="matrix-cicilan">${formatRupiah(cicilan)}/bln</div>
                <div class="matrix-bunga">Total Bunga: ${formatRupiah(bungaRp)}</div>
            </div>
        `;
    }).join('');
}

function renderCatalog() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;

    const filtered = catalogData.filter(m => {
        const matchesFilter = currentCatalogFilter === 'all' || 
                              m.brand.toLowerCase() === currentCatalogFilter.toLowerCase() ||
                              m.type.toLowerCase() === currentCatalogFilter.toLowerCase();
        const matchesSearch = !catalogSearchQuery || m.name.toLowerCase().includes(catalogSearchQuery) || m.brand.toLowerCase().includes(catalogSearchQuery);
        return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-2);">Motor yang Anda cari tidak ditemukan.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(m => `
        <div class="motor-item">
            <div class="motor-img">
                <img src="${m.img}" alt="${m.name}" loading="lazy">
                <span class="tag">${m.tag}</span>
            </div>
            <div class="motor-info">
                <div class="motor-meta">
                    <span class="motor-brand">${m.brand}</span>
                    <span class="motor-cc">${m.cc}</span>
                </div>
                <h3>${m.name}</h3>
                <p class="motor-harga">${formatRupiah(m.price)}</p>
                <button type="button" class="motor-select-btn" onclick="selectMotor('${m.name}', ${m.price})">
                    <i class="bi bi-calculator"></i> Simulasi Kredit
                </button>
            </div>
        </div>
    `).join('');
}

// --- DOM READY BINDINGS ---
document.addEventListener('DOMContentLoaded', () => {
    const hargaInput = document.getElementById('harga_motor');
    const dpInput = document.getElementById('dp_persen');
    const dpSlider = document.getElementById('dp_slider');
    const dpValLabel = document.getElementById('dpValLabel');
    const tenorInput = document.getElementById('tenor_tahun');
    const tenorSlider = document.getElementById('tenor_slider');
    const tenorValLabel = document.getElementById('tenorValLabel');
    const bungaInput = document.getElementById('bunga_persen');
    const toggleAdmin = document.getElementById('toggleAdminFee');
    const toggleInsurance = document.getElementById('toggleInsurance');

    const yr = document.getElementById('currentYear');
    if (yr) yr.textContent = new Date().getFullYear();

    // Navbar Mobile Toggle & Scroll
    const nav = document.querySelector('.nav-main');
    const navToggle = document.getElementById('navToggleBtn');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
        if (nav) {
            if (window.scrollY > 30) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        }
    });

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
    }

    // Price Input
    if (hargaInput) {
        hargaInput.addEventListener('input', function() {
            let val = this.value.replace(/\D/g, '');
            if (val) {
                this.value = parseInt(val, 10).toLocaleString('id-ID');
            } else {
                this.value = '';
            }
            window.calculateLoan();
        });
    }

    // DP Input & Slider
    if (dpInput && dpSlider) {
        dpInput.addEventListener('input', function() {
            let val = parseFloat(this.value) || 0;
            dpSlider.value = val;
            if (dpValLabel) dpValLabel.textContent = val + '%';
            updateChips('.dp-chip', val + '%');
            window.calculateLoan();
        });

        dpSlider.addEventListener('input', function() {
            dpInput.value = this.value;
            if (dpValLabel) dpValLabel.textContent = this.value + '%';
            updateChips('.dp-chip', this.value + '%');
            window.calculateLoan();
        });
    }

    // Tenor Input & Slider
    if (tenorInput && tenorSlider) {
        tenorInput.addEventListener('input', function() {
            let val = parseInt(this.value, 10) || 1;
            tenorSlider.value = val;
            if (tenorValLabel) tenorValLabel.textContent = val + ' Tahun';
            updateChips('.tenor-chip', val + ' Thn');
            window.calculateLoan();
        });

        tenorSlider.addEventListener('input', function() {
            tenorInput.value = this.value;
            if (tenorValLabel) tenorValLabel.textContent = this.value + ' Tahun';
            updateChips('.tenor-chip', this.value + ' Thn');
            window.calculateLoan();
        });
    }

    if (bungaInput) bungaInput.addEventListener('input', window.calculateLoan);
    if (toggleAdmin) toggleAdmin.addEventListener('change', window.calculateLoan);
    if (toggleInsurance) toggleInsurance.addEventListener('change', window.calculateLoan);

    // Budget Input & Slider
    const budgetInput = document.getElementById('budget_input');
    const budgetSlider = document.getElementById('budget_slider');
    if (budgetInput && budgetSlider) {
        budgetInput.addEventListener('input', function() {
            let val = this.value.replace(/\D/g, '');
            if (val) {
                this.value = parseInt(val, 10).toLocaleString('id-ID');
                budgetSlider.value = val;
            }
            window.calculateBudgetMaxPrice();
        });

        budgetSlider.addEventListener('input', function() {
            budgetInput.value = parseInt(this.value, 10).toLocaleString('id-ID');
            window.calculateBudgetMaxPrice();
        });
    }

    // Catalog Search & Filter
    const catalogSearch = document.getElementById('catalogSearch');
    if (catalogSearch) {
        catalogSearch.addEventListener('input', function() {
            catalogSearchQuery = this.value.toLowerCase().trim();
            renderCatalog();
        });
    }

    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', function() {
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            currentCatalogFilter = this.getAttribute('data-filter') || 'all';
            renderCatalog();
        });
    });

    // Initial Runs
    window.calculateLoan();
    window.calculateBudgetMaxPrice();
    renderCatalog();
});

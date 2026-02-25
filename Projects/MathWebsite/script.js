document.addEventListener("DOMContentLoaded", function() {
    const hash = window.location.hash.substring(1); 
    if(hash && (hash === 'home' || hash === 'materi' || hash === 'soal')) {
        pindahHalaman(hash);
    } else {
        pindahHalaman('home');
    }
    acakSoal(); 
});

function pindahHalaman(idHalaman) {
    const semuaTombol = document.querySelectorAll('.nav-link');
    semuaTombol.forEach(tombol => {
        tombol.classList.remove('active');
    });

    const tombolAktif = document.getElementById('btn-' + idHalaman);
    if(tombolAktif) {
        tombolAktif.classList.add('active');
    }

    const semuaHalaman = document.querySelectorAll('.halaman');
    semuaHalaman.forEach(halaman => {
        halaman.classList.remove('active');
    });

    const halamanTuju = document.getElementById(idHalaman);
    if(halamanTuju) {
        halamanTuju.classList.add('active');
        resetAnimasi(halamanTuju);
    }

    window.scrollTo(0, 0);
}

const pengamatAnimasi = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('muncul');
        }
    });
}, { threshold: 0.1 });

function resetAnimasi(halaman) {
    const elemenElemen = halaman.querySelectorAll('.elemen-animasi');
    
    elemenElemen.forEach(el => {
        el.classList.remove('muncul');

        pengamatAnimasi.observe(el);
    });
}

function acakSoal() {
    const daftarSoal = document.querySelectorAll('.soal-acak');
    
    daftarSoal.forEach(soal => soal.classList.add('hidden'));

    let indexTerakhir = sessionStorage.getItem('soalTerakhir');
    let indexAcak;

    if (daftarSoal.length > 1) {
        do {
            indexAcak = Math.floor(Math.random() * daftarSoal.length);
        } while (indexAcak == indexTerakhir);
    } else {
        indexAcak = 0;
    }

    sessionStorage.setItem('soalTerakhir', indexAcak);

    daftarSoal[indexAcak].classList.remove('hidden');
}

function bukaJawaban(tombol) {
    const elemenJawaban = tombol.nextElementSibling;
    const warnaDasar = tombol.getAttribute('data-warna') || 'green'; 
    
    if(elemenJawaban.classList.contains('hidden')) {
        elemenJawaban.classList.remove('hidden');
        tombol.textContent = "Sembunyikan Pembahasan";
        tombol.classList.replace(`bg-${warnaDasar}-600`, 'bg-gray-600'); 
    } else {
        elemenJawaban.classList.add('hidden');
        tombol.textContent = "Lihat Pembahasan";
        tombol.classList.replace('bg-gray-600', `bg-${warnaDasar}-600`);
    }
}
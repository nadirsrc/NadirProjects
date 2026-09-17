const API_BASE = 'https://tugas.nadirprojects.me';
const API_KEY = '5bb1a8e71a3f01c7e5596640e69f8a216f421fc4a465e17049a01371ff575b4e';

const NON_ACADEMIC = ["PJBL / Kebersihan Lingkungan", "Ketarunaan / Pramuka", "Upacara", "Senam / Panggung Literasi", "Jum'at Religi"];

const SCHEDULE = {
    "B. Inggris": [{ day: "Senin", time: "07:40" }],
    "Kreativ, Inovasi & KWU": [{ day: "Senin", time: "10:40" }, { day: "Kamis", time: "09:50" }],
    "(M.Pil) Desain & P. Gim": [{ day: "Senin", time: "12:50" }],
    "Basis Data": [{ day: "Senin", time: "14:00" }, { day: "Kamis", time: "11:40" }],
    "MTK": [{ day: "Selasa", time: "07:40" }],
    "B. Indo": [{ day: "Selasa", time: "10:00" }],
    "(M.Pil) B. Jerman": [{ day: "Selasa", time: "12:50" }],
    "Pemrog. Mobile": [{ day: "Rabu", time: "06:45" }, { day: "Rabu", time: "09:50" }],
    "Pemrog. Web": [{ day: "Rabu", time: "10:30" }, { day: "Rabu", time: "13:00" }],
    "Teks, Grafis & MM": [{ day: "Kamis", time: "06:45" }, { day: "Jumat", time: "07:40" }],
    "P. Pancasila": [{ day: "Jumat", time: "09:45" }, { day: "Jumat", time: "10:30" }],
    "PAI & BP": [{ day: "Jumat", time: "11:00" }, { day: "Jumat", time: "13:00" }]
};

let guruMapelMap = {};
let mapelTeachersMap = {};
let allMapel = [];
let selectedFile = null;
let currentRole = null;
let deadlineManuallySet = false;

async function apiFetch(url) {
    const res = await fetch(url, { headers: { 'X-API-Key': API_KEY } });
    if (!res.ok) throw new Error('API Error');
    return res.json();
}

async function loadData() {
    try {
        const [guruData, mapelData] = await Promise.all([
            apiFetch(API_BASE + '/api/guru'),
            apiFetch(API_BASE + '/api/mapel')
        ]);
        guruMapelMap = guruData.guruMapel || {};
        mapelTeachersMap = {};
        for (const [guru, mapelStr] of Object.entries(guruMapelMap)) {
            const mapelList = splitMapelList(mapelStr);
            mapelList.forEach(m => {
                if (!mapelTeachersMap[m]) mapelTeachersMap[m] = [];
                if (!mapelTeachersMap[m].includes(guru)) mapelTeachersMap[m].push(guru);
            });
        }
        function splitMapelList(str) {
            const multiWord = ['Pemrog. Mobile', 'Teks, Grafis & MM', 'Kreativ, Inovasi & KWU', '(M.Pil) B. Jerman', '(M.Pil) Desain & P. Gim'];
            let result = [], remaining = str;
            for (const mw of multiWord) {
                if (remaining.includes(mw)) { result.push(mw); remaining = remaining.replace(mw, '').trim(); }
            }
            if (remaining) result = result.concat(remaining.split(',').map(s => s.trim()).filter(s => s));
            return result;
        }
        allMapel = mapelData.mapel.filter(m => !NON_ACADEMIC.includes(m));
        populateMapelDropdowns();
    } catch (e) {
        allMapel = ['B. Inggris', 'Kreativ, Inovasi & KWU', '(M.Pil) Desain & P. Gim', 'Basis Data', 'MTK', 'B. Indo', '(M.Pil) B. Jerman', 'Pemrog. Mobile', 'Teks, Grafis & MM', 'Pemrog. Web', 'P. Pancasila', 'PAI & BP'];
        guruMapelMap = {
            'Hj. ROFITA PRAHASANTI, M.Pd': 'B. Inggris',
            'SUHENDRO, S.Kom': 'Kreativ, Inovasi & KWU, (M.Pil) Desain & P. Gim',
            'RIZKA SHINTA WULANDARI, S.T': 'Basis Data',
            'IZZATUL MILLAH, S.Pd': 'MTK',
            'HERI SETYANTO, S.Pd': 'B. Indo',
            'FARAS MENTARI, M.Pd': '(M.Pil) B. Jerman',
            'YURITA SOEGIANTO, S.T': 'Pemrog. Mobile, Teks, Grafis & MM',
            'DINDA NURRAHMA, S.Pd': 'Pemrog. Web',
            'DINI SYAHDU DININA, S.Pd': 'P. Pancasila',
            'AAN AMIRUDIN, S.Pd': 'PAI & BP'
        };
        mapelTeachersMap = {};
        for (const [guru, mapelStr] of Object.entries(guruMapelMap)) {
            const mapelList = mapelStr.split(',').map(s => s.trim());
            mapelList.forEach(m => {
                if (!mapelTeachersMap[m]) mapelTeachersMap[m] = [];
                if (!mapelTeachersMap[m].includes(guru)) mapelTeachersMap[m].push(guru);
            });
        }
        populateMapelDropdowns();
    }
}

function populateMapelDropdowns() {
    ['guru', 'siswa'].forEach(role => {
        const dropdown = document.getElementById(role + 'MapelDropdown');
        const select = document.getElementById(role + 'Mapel');
        select.innerHTML = '<option value="">Pilih mapel</option>';
        dropdown.innerHTML = '';
        allMapel.forEach(m => {
            select.innerHTML += `<option value="${m}">${m}</option>`;
            const div = document.createElement('div');
            div.className = 'custom-select-option';
            div.setAttribute('data-value', m);
            div.textContent = m;
            div.addEventListener('click', () => selectMapel(role, m));
            dropdown.appendChild(div);
        });
    });
}

let activeSelect = null;

function toggleSelect(wrapperId, dropdownId) {
    const wrapper = document.getElementById(wrapperId);
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const dropdown = document.getElementById(dropdownId);
    if (trigger.classList.contains('open')) {
        trigger.classList.remove('open');
        dropdown.classList.remove('show');
        activeSelect = null;
    } else {
        document.querySelectorAll('.custom-select-trigger').forEach(t => t.classList.remove('open'));
        document.querySelectorAll('.custom-select-dropdown').forEach(d => d.classList.remove('show'));
        trigger.classList.add('open');
        dropdown.classList.add('show');
        activeSelect = dropdownId;
    }
}

function selectMapel(role, value) {
    const wrapper = document.getElementById(role + 'MapelSelectWrapper');
    const trigger = wrapper.querySelector('.custom-select-trigger span');
    const dropdown = document.getElementById(role + 'MapelDropdown');
    const select = document.getElementById(role + 'Mapel');
    trigger.textContent = value;
    select.value = value;
    dropdown.querySelectorAll('.custom-select-option').forEach(opt => opt.classList.remove('selected'));
    dropdown.querySelector(`[data-value="${value}"]`).classList.add('selected');
    wrapper.querySelector('.custom-select-trigger').classList.remove('open');
    dropdown.classList.remove('show');
    activeSelect = null;

    if (role === 'guru') {
        const teachers = mapelTeachersMap[value] || [];
        const guruName = document.getElementById('guruName');
        const guruInfo = document.getElementById('guruInfo');
        const guruSelectWrapper = document.getElementById('guruSelectWrapper');
        if (teachers.length === 1) {
            guruName.value = teachers[0];
            guruName.style.display = 'block';
            guruSelectWrapper.style.display = 'none';
            guruInfo.innerHTML = `Mapel: <strong>${value}</strong>`;
            guruInfo.classList.add('show');
        } else if (teachers.length > 1) {
            guruName.style.display = 'none';
            guruInfo.classList.remove('show');
            guruSelectWrapper.style.display = 'block';
            populateGuruDropdown(teachers);
        } else {
            guruName.value = '';
            guruInfo.classList.remove('show');
            guruSelectWrapper.style.display = 'none';
        }
    }
    autoUpdateDeadline(role, value);
}

function populateGuruDropdown(teachers) {
    const dropdown = document.getElementById('guruDropdown');
    const trigger = document.querySelector('#guruCustomSelectWrapper .custom-select-trigger');
    dropdown.innerHTML = '';
    teachers.forEach(t => {
        const div = document.createElement('div');
        div.className = 'custom-select-option';
        div.setAttribute('data-value', t);
        div.textContent = t;
        div.addEventListener('click', () => selectGuruFromDropdown(t));
        dropdown.appendChild(div);
    });
    trigger.querySelector('span').textContent = 'Pilih guru';
}

function selectGuruFromDropdown(value) {
    const wrapper = document.getElementById('guruCustomSelectWrapper');
    const trigger = wrapper.querySelector('.custom-select-trigger span');
    const dropdown = document.getElementById('guruDropdown');
    const guruName = document.getElementById('guruName');
    const guruInfo = document.getElementById('guruInfo');
    const mapel = document.getElementById('guruMapel').value;
    trigger.textContent = value;
    guruName.value = value;
    guruInfo.innerHTML = `Mapel: <strong>${mapel}</strong>`;
    guruInfo.classList.add('show');
    dropdown.querySelectorAll('.custom-select-option').forEach(opt => opt.classList.remove('selected'));
    dropdown.querySelector(`[data-value="${value}"]`).classList.add('selected');
    wrapper.querySelector('.custom-select-trigger').classList.remove('open');
    dropdown.classList.remove('show');
}

document.addEventListener('click', (e) => {
    if (activeSelect && !e.target.closest('.custom-select')) {
        document.querySelectorAll('.custom-select-trigger').forEach(t => t.classList.remove('open'));
        document.querySelectorAll('.custom-select-dropdown').forEach(d => d.classList.remove('show'));
        activeSelect = null;
    }
});

function autoUpdateDeadline(role, mapel) {
    const nextPreset = document.querySelector(`#${role}Presets .preset[data-preset="next"]`);
    if (!nextPreset || !nextPreset.classList.contains('active')) return;
    const schedule = SCHEDULE[mapel];
    if (!schedule || schedule.length === 0) return;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const JS_DAY = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    let result = null;
    for (let offset = 0; offset <= 14; offset++) {
        const checkDate = new Date(now);
        checkDate.setDate(now.getDate() + offset);
        const checkDayName = JS_DAY[checkDate.getDay()];
        for (const entry of schedule) {
            if (entry.day === checkDayName) {
                const [h, m] = entry.time.split(':').map(Number);
                const classMinutes = h * 60 + m;
                if (offset === 0 && classMinutes <= currentMinutes) continue;
                result = new Date(checkDate);
                result.setHours(h, m, 0, 0);
                break;
            }
        }
        if (result) break;
    }
    if (result) setDeadline(role, result);
}

function formatDeadline(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function setDeadline(role, date) {
    deadlineManuallySet = true;
    const text = document.getElementById(`${role}DeadlineText`);
    const input = document.getElementById(`${role}Deadline`);
    text.textContent = formatDeadline(date);
    input.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function initDeadline() {
    deadlineManuallySet = false;
    updateClock();
}

function updateClock() {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const timeStr = `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (!deadlineManuallySet) {
        document.getElementById('guruDeadlineText').textContent = timeStr;
        document.getElementById('siswaDeadlineText').textContent = timeStr;
    }
}
setInterval(updateClock, 1000);

let pickerYear, pickerMonth, pickerDay, modalOpen = false;

function showDatePicker(role) {
    modalOpen = true;
    currentRole = role;
    deadlineManuallySet = false;
    const today = new Date();
    pickerYear = today.getFullYear();
    pickerMonth = today.getMonth();
    pickerDay = today.getDate();
    document.getElementById('hourInput').value = String(today.getHours()).padStart(2, '0');
    document.getElementById('minuteInput').value = String(today.getMinutes()).padStart(2, '0');
    renderCalendar();
    document.getElementById('datetimeModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDatePicker() {
    modalOpen = false;
    document.getElementById('datetimeModal').classList.remove('active');
    document.body.style.overflow = '';
}

function changeMonth(delta) {
    pickerMonth += delta;
    if (pickerMonth > 11) { pickerMonth = 0; pickerYear++; }
    if (pickerMonth < 0) { pickerMonth = 11; pickerYear--; }
    renderCalendar();
}

function renderCalendar() {
    const container = document.getElementById('calendarDays');
    const monthYearEl = document.getElementById('calendarMonthYear');
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    monthYearEl.textContent = `${months[pickerMonth]} ${pickerYear}`;
    const today = new Date();
    const firstDay = new Date(pickerYear, pickerMonth, 1).getDay();
    const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(pickerYear, pickerMonth, 0).getDate();
    container.innerHTML = '';
    for (let i = firstDay - 1; i >= 0; i--) {
        const btn = document.createElement('button');
        btn.className = 'calendar-day other-month disabled';
        btn.textContent = daysInPrevMonth - i;
        btn.disabled = true;
        container.appendChild(btn);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const isSelected = d === pickerDay;
        const isToday = d === today.getDate() && pickerMonth === today.getMonth() && pickerYear === today.getFullYear();
        const isPast = new Date(pickerYear, pickerMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let classes = 'calendar-day';
        if (isSelected) classes += ' selected';
        if (isToday) classes += ' today';
        if (isPast) classes += ' disabled';
        const btn = document.createElement('button');
        btn.className = classes;
        btn.textContent = d;
        if (!isPast) btn.addEventListener('click', (e) => { e.stopPropagation(); pickerDay = d; renderCalendar(); });
        container.appendChild(btn);
    }
    const totalCells = firstDay + daysInMonth;
    const remaining = (Math.ceil(totalCells / 7) * 7) - totalCells;
    for (let d = 1; d <= remaining; d++) {
        const btn = document.createElement('button');
        btn.className = 'calendar-day other-month disabled';
        btn.textContent = d;
        btn.disabled = true;
        container.appendChild(btn);
    }
}

function adjustTime(type, delta) {
    const input = document.getElementById(type + 'Input');
    let val = parseInt(input.value);
    val += delta;
    if (val > (type === 'hour' ? 23 : 55)) val = 0;
    if (val < 0) val = type === 'hour' ? 23 : 55;
    input.value = String(val).padStart(2, '0');
}

function confirmDateTime() {
    const h = parseInt(document.getElementById('hourInput').value);
    const m = parseInt(document.getElementById('minuteInput').value);
    setDeadline(currentRole, new Date(pickerYear, pickerMonth, pickerDay, h, m));
    closeDatePicker();
}

function setupPresets(role) {
    document.getElementById(`${role}Presets`).addEventListener('click', (e) => {
        const btn = e.target.closest('.preset');
        if (!btn) return;
        document.querySelectorAll(`#${role}Presets .preset`).forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (btn.dataset.preset === 'next') {
            const mapel = document.getElementById(role + 'Mapel').value;
            if (!mapel) { showValidationToast('Pilih mapel terlebih dahulu'); btn.classList.remove('active'); return; }
            autoUpdateDeadline(role, mapel);
        } else {
            const target = new Date();
            target.setDate(target.getDate() + parseInt(btn.dataset.days));
            target.setHours(23, 59, 0, 0);
            setDeadline(role, target);
        }
    });
}

function setupFileUpload(role) {
    const upload = document.getElementById(`${role}Upload`);
    const input = document.getElementById(`${role}Foto`);
    const preview = document.getElementById(`${role}Preview`);
    const previewImg = document.getElementById(`${role}PreviewImg`);
    const previewName = document.getElementById(`${role}PreviewName`);
    const previewSize = document.getElementById(`${role}PreviewSize`);
    upload.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            selectedFile = e.target.files[0];
            previewImg.src = URL.createObjectURL(selectedFile);
            previewName.textContent = selectedFile.name;
            previewSize.textContent = formatSize(selectedFile.size);
            preview.classList.add('show');
        }
    });
    document.getElementById(`${role}RemoveFile`).addEventListener('click', () => { selectedFile = null; input.value = ''; preview.classList.remove('show'); });
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

let validationTimeout;
function showValidationToast(msg) {
    const toast = document.getElementById('validationToast');
    document.getElementById('validationToastText').textContent = msg;
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
    clearTimeout(validationTimeout);
    validationTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

document.getElementById('guruForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const mapel = document.getElementById('guruMapel').value;
    const guru = document.getElementById('guruName').value;
    const guruSelect = document.getElementById('guruSelect');
    const guruSelectWrapper = document.getElementById('guruSelectWrapper');
    const deskripsi = document.getElementById('guruDeskripsi').value.trim();
    const deadline = document.getElementById('guruDeadline').value;
    if (!mapel) { showValidationToast('Pilih mapel'); return; }
    if (guruSelectWrapper.style.display !== 'none' && !guruSelect.value) { showValidationToast('Pilih guru'); return; }
    if (!guru && guruSelectWrapper.style.display === 'none') { showValidationToast('Pilih mapel'); return; }
    if (!deskripsi) { showValidationToast('Masukkan deskripsi tugas'); return; }
    if (!deadline) { showValidationToast('Pilih deadline'); return; }
    const submitBtn = document.getElementById('guruSubmit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';
    try {
        const payload = { submittedBy: guru || guruSelect.value, pengirimType: 'guru', guru: guru || guruSelect.value, siswa: '', mapel, deskripsi, deadline };
        if (selectedFile) {
            payload.foto = await new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(selectedFile); });
            payload.fotoExt = selectedFile.name.split('.').pop();
        }
        const res = await fetch(API_BASE + '/api/tugas', { method: 'POST', headers: { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (res.ok && data.success) {
            showAlert('Tugas berhasil dikirim!', 'success', 'guru');
            document.getElementById('guruForm').reset();
            document.getElementById('guruPreview').classList.remove('show');
            document.querySelectorAll('#guruPresets .preset').forEach(p => p.classList.remove('active'));
            document.getElementById('guruInfo').classList.remove('show');
            deadlineManuallySet = false;
        } else { showAlert(data.error || 'Gagal mengirim', 'error', 'guru'); }
    } catch (e) { showAlert('Koneksi gagal', 'error', 'guru'); }
    finally { submitBtn.disabled = false; submitBtn.textContent = 'Kirim'; }
});

document.getElementById('siswaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const siswa = document.getElementById('siswaName').value.trim();
    const inputType = document.querySelector('.mapel-toggle-btn.active')?.dataset.type;
    const siswaMapelCustom = document.getElementById('siswaMapelCustom').value.trim();
    const siswaMapelValue = document.getElementById('siswaMapel').value;
    let mapel = inputType === 'custom' ? siswaMapelCustom : siswaMapelValue;
    const deskripsi = document.getElementById('siswaDeskripsi').value.trim();
    const deadline = document.getElementById('siswaDeadline').value;

    console.log('Siswa submit - inputType:', inputType);
    console.log('Siswa submit - siswaMapelCustom:', siswaMapelCustom);
    console.log('Siswa submit - siswaMapelValue:', siswaMapelValue);
    console.log('Siswa submit - mapel:', mapel);

    if (!siswa) { showValidationToast('Masukkan nama kamu'); return; }
    if (!mapel) { showValidationToast('Mapel kosong! type:' + inputType + ' val:' + mapel); return; }
    if (!deskripsi) { showValidationToast('Masukkan deskripsi tugas'); return; }
    if (!deadline) { showValidationToast('Pilih deadline'); return; }
    const submitBtn = document.getElementById('siswaSubmit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';
    try {
        const payload = { submittedBy: siswa, pengirimType: 'siswa', guru: '', siswa, mapel, deskripsi, deadline };
        if (selectedFile) {
            payload.foto = await new Promise(resolve => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(selectedFile); });
            payload.fotoExt = selectedFile.name.split('.').pop();
        }
        const res = await fetch(API_BASE + '/api/tugas', { method: 'POST', headers: { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const data = await res.json();
        if (res.ok && data.success) {
            showAlert('Tugas berhasil dikirim!', 'success', 'siswa');
            document.getElementById('siswaForm').reset();
            document.getElementById('siswaPreview').classList.remove('show');
            document.querySelectorAll('#siswaPresets .preset').forEach(p => p.classList.remove('active'));
            deadlineManuallySet = false;
        } else { showAlert(data.error || 'Gagal mengirim', 'error', 'siswa'); }
    } catch (e) { showAlert('Koneksi gagal', 'error', 'siswa'); }
    finally { submitBtn.disabled = false; submitBtn.textContent = 'Kirim'; }
});

function showAlert(msg, type, role) {
    const alertId = role === 'guru' ? 'alert' : 'alertSiswa';
    const alert = document.getElementById(alertId);
    alert.textContent = (type === 'success' ? '✓ ' : '✗ ') + msg;
    alert.className = 'alert show ' + type;
    setTimeout(() => alert.classList.remove('show'), 4000);
}

// Navigation
document.getElementById('guruCard').addEventListener('click', () => {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('guruFormPage').style.display = 'block';
    window.scrollTo(0, 0);
});
document.getElementById('siswaCard').addEventListener('click', () => {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('siswaFormPage').style.display = 'block';
    window.scrollTo(0, 0);
});
document.getElementById('backFromGuru').addEventListener('click', (e) => { e.preventDefault(); document.getElementById('guruFormPage').style.display = 'none'; document.getElementById('landingPage').style.display = 'block'; window.scrollTo(0, 0); });
document.getElementById('backFromSiswa').addEventListener('click', (e) => { e.preventDefault(); document.getElementById('siswaFormPage').style.display = 'none'; document.getElementById('landingPage').style.display = 'block'; window.scrollTo(0, 0); });

// Mapel toggle
document.querySelectorAll('.mapel-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mapel-toggle-btn').forEach(b => b.classList.toggle('active', b === btn));
        const type = btn.dataset.type;
        document.getElementById('siswaMapelSelectWrapper').style.display = type === 'dropdown' ? 'block' : 'none';
        document.getElementById('siswaMapelCustom').style.display = type === 'custom' ? 'block' : 'none';
        if (type === 'custom') document.getElementById('siswaMapelCustom').focus();
    });
});

// Event listeners
document.querySelector('#guruMapelSelectWrapper .custom-select-trigger').addEventListener('click', () => toggleSelect('guruMapelSelectWrapper', 'guruMapelDropdown'));
document.querySelector('#guruCustomSelectWrapper .custom-select-trigger').addEventListener('click', () => toggleSelect('guruCustomSelectWrapper', 'guruDropdown'));
document.querySelector('#siswaMapelSelectWrapper .custom-select-trigger').addEventListener('click', () => toggleSelect('siswaMapelSelectWrapper', 'siswaMapelDropdown'));
document.getElementById('guruDeadlineDisplay').addEventListener('click', () => showDatePicker('guru'));
document.getElementById('siswaDeadlineDisplay').addEventListener('click', () => showDatePicker('siswa'));
document.getElementById('closeModalBtn').addEventListener('click', (e) => { e.stopPropagation(); closeDatePicker(); });
document.getElementById('prevMonthBtn').addEventListener('click', (e) => { e.stopPropagation(); changeMonth(-1); });
document.getElementById('nextMonthBtn').addEventListener('click', (e) => { e.stopPropagation(); changeMonth(1); });
document.getElementById('hourUpBtn').addEventListener('click', (e) => { e.stopPropagation(); adjustTime('hour', 1); });
document.getElementById('hourDownBtn').addEventListener('click', (e) => { e.stopPropagation(); adjustTime('hour', -1); });
document.getElementById('minuteUpBtn').addEventListener('click', (e) => { e.stopPropagation(); adjustTime('minute', 1); });
document.getElementById('minuteDownBtn').addEventListener('click', (e) => { e.stopPropagation(); adjustTime('minute', -1); });
document.getElementById('cancelBtn').addEventListener('click', (e) => { e.stopPropagation(); closeDatePicker(); });
document.getElementById('confirmBtn').addEventListener('click', (e) => { e.stopPropagation(); confirmDateTime(); });
document.getElementById('datetimeModal').addEventListener('click', function(e) { if (e.target === this) closeDatePicker(); });
document.querySelector('.datetime-modal-content').addEventListener('click', (e) => e.stopPropagation());

// Init
setupPresets('guru');
setupPresets('siswa');
setupFileUpload('guru');
setupFileUpload('siswa');
loadData();
initDeadline();

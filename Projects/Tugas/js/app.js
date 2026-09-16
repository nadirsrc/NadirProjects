        const API_BASE = 'https://tugas.nadirprojects.me';
        const API_KEY = 'd2131ac436000cf42d702d7fad0a9b8e3617556e0057c58be6e1ae2b2e25c893';

        const NON_ACADEMIC = [
            "PJBL / Kebersihan Lingkungan",
            "Ketarunaan / Pramuka",
            "Upacara",
            "Senam / Panggung Literasi",
            "Jum'at Religi"
        ];

        // Schedule dari README.md - semua jam mulai
        // Format: mapel -> [{ day, time }] (sorted by day order)
        const SCHEDULE = {
            "B. Inggris": [
                { day: "Senin", time: "07:40" }
            ],
            "Kreativ, Inovasi & KWU": [
                { day: "Senin", time: "10:40" },
                { day: "Kamis", time: "09:50" }
            ],
            "(M.Pil) Desain & P. Gim": [
                { day: "Senin", time: "12:50" }
            ],
            "Basis Data": [
                { day: "Senin", time: "14:00" },
                { day: "Kamis", time: "11:40" }
            ],
            "MTK": [
                { day: "Selasa", time: "07:40" }
            ],
            "B. Indo": [
                { day: "Selasa", time: "10:00" }
            ],
            "(M.Pil) B. Jerman": [
                { day: "Selasa", time: "12:50" }
            ],
            "Pemrog. Mobile": [
                { day: "Rabu", time: "06:45" },
                { day: "Rabu", time: "09:50" }
            ],
            "Pemrog. Web": [
                { day: "Rabu", time: "10:30" },
                { day: "Rabu", time: "13:00" }
            ],
            "Teks, Grafis & MM": [
                { day: "Kamis", time: "06:45" },
                { day: "Jumat", time: "07:40" }
            ],
            "P. Pancasila": [
                { day: "Jumat", time: "09:45" },
                { day: "Jumat", time: "10:30" }
            ],
            "PAI & BP": [
                { day: "Jumat", time: "11:00" },
                { day: "Jumat", time: "13:00" }
            ]
        };

        const DAY_ORDER = { "Senin": 1, "Selasa": 2, "Rabu": 3, "Kamis": 4, "Jumat": 5, "Sabtu": 6, "Minggu": 7 };

        let guruMapelMap = {};
        let mapelTeachersMap = {}; // Track ALL teachers for each mapel
        let allMapel = [];
        let currentMode = 'guru';
        let selectedFile = null;

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

                console.log('API loaded:', mapelData);

                guruMapelMap = guruData.guruMapel || {};

                // Build mapelTeachersMap - track ALL teachers for each mapel
                mapelTeachersMap = {};
                for (const [guru, mapelStr] of Object.entries(guruMapelMap)) {
                    // Split mapel string - handle multi-word mapel names
                    // Known patterns: "Pemrog. Mobile, Teks, Grafis & MM" -> ["Pemrog. Mobile", "Teks, Grafis & MM"]
                    const mapelList = splitMapelList(mapelStr);
                    mapelList.forEach(m => {
                        if (!mapelTeachersMap[m]) mapelTeachersMap[m] = [];
                        if (!mapelTeachersMap[m].includes(guru)) {
                            mapelTeachersMap[m].push(guru);
                        }
                    });
                }

                // Smart split for mapel list
                function splitMapelList(str) {
                    // Special mapel names (multi-word, should not be split)
                    const multiWord = [
                        'Pemrog. Mobile',
                        'Teks, Grafis & MM',
                        'Kreativ, Inovasi & KWU',
                        '(M.Pil) B. Jerman',
                        '(M.Pil) Desain & P. Gim'
                    ];

                    let result = [];
                    let remaining = str;

                    for (const mw of multiWord) {
                        if (remaining.includes(mw)) {
                            result.push(mw);
                            remaining = remaining.replace(mw, '').trim();
                        }
                    }

                    // Split remaining by comma
                    if (remaining) {
                        const parts = remaining.split(',').map(s => s.trim()).filter(s => s);
                        result = result.concat(parts);
                    }

                    return result;
                }

                allMapel = mapelData.mapel.filter(m => !NON_ACADEMIC.includes(m));
                console.log('allMapel set:', allMapel);
                populateMapel();
                populateSiswaMapelDropdown();
            } catch (e) {
                console.error('Failed to load data, using fallback:', e);
                // Fallback data if API fails
                allMapel = [
                    'B. Inggris',
                    'Kreativ, Inovasi & KWU',
                    '(M.Pil) Desain & P. Gim',
                    'Basis Data',
                    'MTK',
                    'B. Indo',
                    '(M.Pil) B. Jerman',
                    'Pemrog. Mobile',
                    'Teks, Grafis & MM',
                    'Pemrog. Web',
                    'P. Pancasila',
                    'PAI & BP'
                ];
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

                // Build mapelTeachersMap from guruMapelMap
                mapelTeachersMap = {};
                for (const [guru, mapelStr] of Object.entries(guruMapelMap)) {
                    const mapelList = mapelStr.split(',').map(s => s.trim());
                    mapelList.forEach(m => {
                        if (!mapelTeachersMap[m]) mapelTeachersMap[m] = [];
                        if (!mapelTeachersMap[m].includes(guru)) {
                            mapelTeachersMap[m].push(guru);
                        }
                    });
                }

                console.log('Using fallback, allMapel:', allMapel);
                populateMapel();
                populateSiswaMapelDropdown();
            }
        }

        // Custom Select Functions
        let activeSelect = null;

        function toggleSelect(type) {
            let wrapper, dropdown;
            if (type === 'mapel') {
                wrapper = 'mapelSelectWrapper';
                dropdown = 'mapelDropdown';
            } else if (type === 'siswaMapel') {
                wrapper = 'siswaMapelSelectWrapper';
                dropdown = 'siswaMapelDropdown';
            } else {
                wrapper = 'guruCustomSelectWrapper';
                dropdown = 'guruDropdown';
            }

            const trigger = document.querySelector(`#${wrapper} .custom-select-trigger`);
            const dropdownEl = document.getElementById(dropdown);

            if (trigger.classList.contains('open')) {
                trigger.classList.remove('open');
                dropdownEl.classList.remove('show');
                activeSelect = null;
            } else {
                // Close any open dropdown first
                document.querySelectorAll('.custom-select-trigger').forEach(t => t.classList.remove('open'));
                document.querySelectorAll('.custom-select-dropdown').forEach(d => d.classList.remove('show'));

                trigger.classList.add('open');
                dropdownEl.classList.add('show');
                activeSelect = type;
            }
        }

        function selectOption(type, value, displayText) {
            let wrapper, dropdown;
            if (type === 'mapel') {
                wrapper = 'mapelSelectWrapper';
                dropdown = 'mapelDropdown';
            } else if (type === 'siswaMapel') {
                wrapper = 'siswaMapelSelectWrapper';
                dropdown = 'siswaMapelDropdown';
            } else {
                wrapper = 'guruCustomSelectWrapper';
                dropdown = 'guruDropdown';
            }

            const trigger = document.querySelector(`#${wrapper} .custom-select-trigger`);
            const dropdownEl = document.getElementById(dropdown);

            // Update trigger text
            trigger.querySelector('span').textContent = displayText;
            trigger.querySelector('span').classList.add('selected-text');

            // Update selection styling
            dropdownEl.querySelectorAll('.custom-select-option').forEach(opt => opt.classList.remove('selected'));
            dropdownEl.querySelector(`[data-value="${value}"]`).classList.add('selected');

            // Close dropdown
            trigger.classList.remove('open');
            dropdownEl.classList.remove('show');
            activeSelect = null;

            // Trigger change event
            if (type === 'mapel') {
                document.getElementById('mapel').value = value;
                document.getElementById('mapel').dispatchEvent(new Event('change'));
            } else if (type === 'siswaMapel') {
                document.getElementById('siswaMapel').value = value;
                document.getElementById('siswaMapel').dispatchEvent(new Event('change'));
            } else {
                document.getElementById('guruSelect').value = value;
                document.getElementById('guruSelect').dispatchEvent(new Event('change'));
            }
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (activeSelect && !e.target.closest('.custom-select')) {
                document.querySelectorAll('.custom-select-trigger').forEach(t => t.classList.remove('open'));
                document.querySelectorAll('.custom-select-dropdown').forEach(d => d.classList.remove('show'));
                activeSelect = null;
            }
        });

        function populateMapelDropdown() {
            const dropdown = document.getElementById('mapelDropdown');
            const trigger = document.querySelector('#mapelSelectWrapper .custom-select-trigger');
            console.log('populateMapelDropdown called, allMapel length:', allMapel ? allMapel.length : 0);

            // Only show mapel options, no placeholder
            dropdown.innerHTML = '';

            if (allMapel && allMapel.length > 0) {
                allMapel.forEach(m => {
                    const div = document.createElement('div');
                    div.className = 'custom-select-option';
                    div.setAttribute('data-value', m);
                    div.textContent = m;
                    div.addEventListener('click', function() {
                        selectOption('mapel', m, m);
                    });
                    dropdown.appendChild(div);
                });
            }

            console.log('Dropdown HTML length:', dropdown.innerHTML.length, 'children:', dropdown.children.length);

            // Reset trigger to placeholder only if no saved value
            const savedMapel = savedValues.guru.mapelDisplay || 'Pilih mapel';
            const mapelTrigger = trigger.querySelector('span');
            mapelTrigger.textContent = savedMapel;
            mapelTrigger.classList.toggle('selected-text', savedMapel !== 'Pilih mapel');
        }

        function populateGuruDropdown(teachers) {
            const dropdown = document.getElementById('guruDropdown');
            const trigger = document.querySelector('#guruCustomSelectWrapper .custom-select-trigger');

            // Only show teacher options, no placeholder
            dropdown.innerHTML = '';

            teachers.forEach(t => {
                const div = document.createElement('div');
                div.className = 'custom-select-option';
                div.setAttribute('data-value', t);
                div.textContent = t;
                div.addEventListener('click', function() {
                    selectOption('guru', t, t);
                });
                dropdown.appendChild(div);
            });

            // Reset trigger to placeholder
            trigger.querySelector('span').textContent = 'Pilih guru';
            trigger.querySelector('span').classList.remove('selected-text');
        }

        function populateMapel() {
            const select = document.getElementById('mapel');
            select.innerHTML = '<option value="">Pilih mapel</option>';
            allMapel.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m;
                opt.textContent = m;
                select.appendChild(opt);
            });
            populateMapelDropdown();
        }

        // When mapel changes -> check if single or multiple teachers
        document.getElementById('mapel').addEventListener('change', function() {
            const mapel = this.value;
            const guruInput = document.getElementById('guru');
            const guruInfo = document.getElementById('guruInfo');
            const guruSelectWrapper = document.getElementById('guruSelectWrapper');

            if (!mapel) {
                guruInput.value = '';
                guruInfo.classList.remove('show');
                guruSelectWrapper.style.display = 'none';
                return;
            }

            const teachers = mapelTeachersMap[mapel] || [];

            if (teachers.length === 1) {
                // Single teacher - auto fill
                guruInput.value = teachers[0];
                guruInput.style.display = 'block';
                guruSelectWrapper.style.display = 'none';
                guruInfo.innerHTML = `Mapel: <strong>${mapel}</strong>`;
                guruInfo.classList.add('show');

                // Auto-update deadline from mapel schedule
                autoUpdateDeadlineFromMapel();

            } else if (teachers.length > 1) {
                // Multiple teachers - show dropdown
                guruInput.style.display = 'none';
                guruInfo.classList.remove('show');
                guruSelectWrapper.style.display = 'block';

                // Populate guru dropdown (both native and custom)
                const guruSelect = document.getElementById('guruSelect');
                guruSelect.innerHTML = '<option value="">Pilih guru</option>';
                populateGuruDropdown(teachers);
                teachers.forEach(t => {
                    const opt = document.createElement('option');
                    opt.value = t;
                    // Short name for dropdown
                    opt.textContent = t.split(',')[0].replace(/^(dr|drg|drs|Hj\.?|Prof\.?|Ir\.?)\s+/i, '');
                    guruSelect.appendChild(opt);
                });

                // Auto-update deadline for multi-teacher mapel too
                autoUpdateDeadlineFromMapel();

            } else {
                guruInput.value = '';
                guruInfo.classList.remove('show');
                guruSelectWrapper.style.display = 'none';
            }
        });

        // Add event listener for siswa mapel dropdown
        document.getElementById('siswaMapel').addEventListener('change', function() {
            autoUpdateDeadlineFromMapel();
        });

        // When guru selected from dropdown
        document.getElementById('guruSelect').addEventListener('change', function() {
            const guru = this.value;
            const guruInput = document.getElementById('guru');
            const guruInfo = document.getElementById('guruInfo');
            const mapel = document.getElementById('mapel').value;

            if (guru) {
                guruInput.value = guru;
                guruInfo.innerHTML = `Mapel: <strong>${mapel}</strong>`;
                guruInfo.classList.add('show');
                autoUpdateDeadline();
            } else {
                guruInput.value = '';
                guruInfo.classList.remove('show');
            }
        });

        function autoUpdateDeadline() {
            const nextPresetBtn = document.querySelector('.preset[data-preset="next"]');
            if (nextPresetBtn && nextPresetBtn.classList.contains('active')) {
                nextPresetBtn.click();
            }
        }

        // Initialize deadline display on load (real-time)
        function initDeadline() {
            deadlineManuallySet = false; // Start with real-time
            const now = new Date();
            setDeadlineDisplay(now);
        }

        // Real-time clock update (every second)
        let deadlineManuallySet = false; // Track if user set custom deadline
        let timePickerManuallySet = false; // Track if user manually set time in picker

        function updateRealTimeClock() {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, '0');
            const m = String(now.getMinutes()).padStart(2, '0');

            // Only update main display in real-time if no custom deadline is set
            if (!deadlineManuallySet) {
                const deadlineText = document.getElementById('deadlineText');
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                const d = String(now.getDate()).padStart(2, '0');
                const mo = months[now.getMonth()];
                const y = now.getFullYear();
                deadlineText.textContent = `${d} ${mo} ${y}, ${h}:${m}`;
            }
        }

        // Start real-time clock
        setInterval(updateRealTimeClock, 1000);

        // Saved values for remembering state
        const savedValues = {
            guru: {
                mapel: '',
                mapelDisplay: 'Pilih mapel',
                guru: '',
                guruDisplay: 'Pilih guru'
            },
            siswa: {
                siswa: '',
                mapelDropdown: '',
                mapelDropdownDisplay: 'Pilih mapel',
                mapelCustom: '',
                mapelInputType: 'dropdown'
            },
            deskripsi: '',
            deadline: ''
        };

        // Mode toggle
        const modeToggle = document.querySelector('.mode-toggle');
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) return;

                // Save current values before switching
                saveCurrentValues();

                currentMode = btn.dataset.mode;

                // Update button states
                document.querySelectorAll('.mode-btn').forEach(b => {
                    b.classList.toggle('active', b === btn);
                });

                // Update slider position
                modeToggle.dataset.active = currentMode;

                // Show/hide appropriate fields
                if (currentMode === 'siswa') {
                    document.querySelectorAll('.siswa-field').forEach(f => {
                        f.classList.remove('field-hidden');
                    });
                    document.querySelectorAll('.guru-field').forEach(f => {
                        f.classList.add('field-hidden');
                    });
                    populateSiswaMapelDropdown();
                    restoreSiswaValues();
                    autoUpdateDeadlineFromMapel();
                } else {
                    document.querySelectorAll('.guru-field').forEach(f => {
                        f.classList.remove('field-hidden');
                    });
                    document.querySelectorAll('.siswa-field').forEach(f => {
                        f.classList.add('field-hidden');
                    });
                    populateMapel();
                    restoreGuruValues();
                    autoUpdateDeadlineFromMapel();
                }
            });
        });

        // Save current form values
        function saveCurrentValues() {
            if (currentMode === 'guru') {
                savedValues.guru.mapel = document.getElementById('mapel').value;
                const mapelTrigger = document.querySelector('#mapelSelectWrapper .custom-select-trigger span');
                savedValues.guru.mapelDisplay = mapelTrigger ? mapelTrigger.textContent : 'Pilih mapel';
                savedValues.guru.guru = document.getElementById('guru').value;
                const guruTrigger = document.querySelector('#guruCustomSelectWrapper .custom-select-trigger span');
                savedValues.guru.guruDisplay = guruTrigger ? guruTrigger.textContent : 'Pilih guru';
            } else {
                savedValues.siswa.siswa = document.getElementById('siswa').value;
                savedValues.siswa.mapelDropdown = document.getElementById('siswaMapel').value;
                savedValues.siswa.mapelCustom = document.getElementById('siswaMapelCustom').value;
                savedValues.siswa.mapelInputType = document.querySelector('.mapel-toggle-btn.active')?.dataset.type || 'dropdown';
                const siswaMapelTrigger = document.querySelector('#siswaMapelSelectWrapper .custom-select-trigger span');
                savedValues.siswa.mapelDropdownDisplay = siswaMapelTrigger ? siswaMapelTrigger.textContent : 'Pilih mapel';
            }
            savedValues.deskripsi = document.getElementById('deskripsi').value;
            savedValues.deadline = document.getElementById('deadline').value;
        }

        // Restore values for guru mode
        function restoreGuruValues() {
            // Native selects
            document.getElementById('mapel').value = savedValues.guru.mapel;
            document.getElementById('guru').value = savedValues.guru.guru;
            document.getElementById('guruSelect').value = savedValues.guru.guru;

            // Guru dropdown trigger
            const guruTrigger = document.querySelector('#guruCustomSelectWrapper .custom-select-trigger span');
            if (guruTrigger) {
                guruTrigger.textContent = savedValues.guru.guruDisplay || 'Pilih guru';
                guruTrigger.classList.toggle('selected-text', savedValues.guru.guruDisplay !== 'Pilih guru');
            }

            // Shared fields
            document.getElementById('deskripsi').value = savedValues.deskripsi;
        }

        // Restore values for siswa mode
        function restoreSiswaValues() {
            // Native inputs
            document.getElementById('siswa').value = savedValues.siswa.siswa;
            document.getElementById('siswaMapel').value = savedValues.siswa.mapelDropdown;
            document.getElementById('siswaMapelCustom').value = savedValues.siswa.mapelCustom;

            // Mapel input type toggle
            switchMapelInput(savedValues.siswa.mapelInputType || 'dropdown');

            // Shared fields
            document.getElementById('deskripsi').value = savedValues.deskripsi;
        }

        function populateSiswaMapelDropdown() {
            const dropdown = document.getElementById('siswaMapelDropdown');
            const trigger = document.querySelector('#siswaMapelSelectWrapper .custom-select-trigger');
            const select = document.getElementById('siswaMapel');

            dropdown.innerHTML = '';
            select.innerHTML = '<option value="">Pilih mapel</option>';

            if (allMapel && allMapel.length > 0) {
                allMapel.forEach(m => {
                    const div = document.createElement('div');
                    div.className = 'custom-select-option';
                    div.setAttribute('data-value', m);
                    div.textContent = m;
                    div.addEventListener('click', function() {
                        selectOption('siswaMapel', m, m);
                    });
                    dropdown.appendChild(div);

                    const opt = document.createElement('option');
                    opt.value = m;
                    opt.textContent = m;
                    select.appendChild(opt);
                });
            }

            console.log('Siswa Dropdown children:', dropdown.children.length);

            // Reset trigger to placeholder only if no saved value
            const savedSiswaMapel = savedValues.siswa.mapelDropdownDisplay || 'Pilih mapel';
            const siswaMapelTrigger = trigger.querySelector('span');
            siswaMapelTrigger.textContent = savedSiswaMapel;
            siswaMapelTrigger.classList.toggle('selected-text', savedSiswaMapel !== 'Pilih mapel');
        }

        // Switch between dropdown and custom input for siswa mapel
        function switchMapelInput(type) {
            const dropdownWrapper = document.getElementById('siswaMapelSelectWrapper');
            const customInput = document.getElementById('siswaMapelCustom');
            const toggleBtns = document.querySelectorAll('.mapel-toggle-btn');

            toggleBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.type === type);
            });

            if (type === 'dropdown') {
                dropdownWrapper.style.display = 'block';
                customInput.style.display = 'none';
            } else {
                dropdownWrapper.style.display = 'none';
                customInput.style.display = 'block';
                customInput.focus();
            }
        }

        // Format date for display
        function formatDeadline(date) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            const d = date.getDate();
            const mo = months[date.getMonth()];
            const y = date.getFullYear();
            const h = String(date.getHours()).padStart(2, '0');
            const m = String(date.getMinutes()).padStart(2, '0');
            return `${d} ${mo} ${y}, ${h}:${m}`;
        }

        // Set deadline display (internal - doesn't change the manuallySet flag)
        function setDeadlineDisplay(date) {
            const display = document.getElementById('deadlineDisplay');
            const text = document.getElementById('deadlineText');
            const deadlineInput = document.getElementById('deadline');

            text.textContent = formatDeadline(date);

            // Store ISO string for form submission
            const y = date.getFullYear();
            const mo = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            const h = String(date.getHours()).padStart(2, '0');
            const mi = String(date.getMinutes()).padStart(2, '0');
            deadlineInput.value = `${y}-${mo}-${d}T${h}:${mi}`;
        }

        // Set deadline AND mark as manually set (for presets and modal confirm)
        function setCustomDeadline(date) {
            deadlineManuallySet = true;
            setDeadlineDisplay(date);
        }

        // Custom DateTime Picker State
        let pickerYear, pickerMonth, pickerDay;
        let selectedDate = new Date();
        let isOpeningPicker = false; // Prevent validation when opening picker
        let modalOpen = false; // Global flag: modal is open

        // Show custom date picker modal
        function showDatePicker() {
            modalOpen = true; // Set global flag
            isOpeningPicker = true; // Set flag to prevent validation
            timePickerManuallySet = false; // Reset time flag when opening
            setTimeout(() => { isOpeningPicker = false; }, 100); // Reset after 100ms

            const modal = document.getElementById('datetimeModal');

            // Always show TODAY's date in calendar (not the deadline date)
            const today = new Date();

            pickerYear = today.getFullYear();
            pickerMonth = today.getMonth();
            pickerDay = today.getDate();

            // Use REAL-TIME current hour and minute
            const h = today.getHours();
            const mi = today.getMinutes();

            document.getElementById('hourInput').value = String(h).padStart(2, '0');
            document.getElementById('minuteInput').value = String(mi).padStart(2, '0');

            renderCalendar();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeDatePicker() {
            modalOpen = false; // Reset global flag
            const modal = document.getElementById('datetimeModal');
            modal.classList.remove('active');
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

            // Previous month days
            for (let i = firstDay - 1; i >= 0; i--) {
                const btn = document.createElement('button');
                btn.className = 'calendar-day other-month disabled';
                btn.textContent = daysInPrevMonth - i;
                btn.disabled = true;
                container.appendChild(btn);
            }

            // Current month days
            for (let d = 1; d <= daysInMonth; d++) {
                const isSelected = (d === pickerDay);
                const isToday = (d === today.getDate() && pickerMonth === today.getMonth() && pickerYear === today.getFullYear());
                const isPast = new Date(pickerYear, pickerMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                let classes = 'calendar-day';
                if (isSelected) classes += ' selected';
                if (isToday) classes += ' today';
                if (isPast) classes += ' disabled';

                const btn = document.createElement('button');
                btn.className = classes;
                btn.textContent = d;
                if (!isPast) {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        selectDay(d);
                    });
                }
                container.appendChild(btn);
            }

            // Next month days (fill to 42 cells)
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

        function selectDay(day) {
            pickerDay = day;
            renderCalendar();
        }

        function adjustTime(type, delta) {
            const hourInput = document.getElementById('hourInput');
            const minuteInput = document.getElementById('minuteInput');
            let val = type === 'hour' ? parseInt(hourInput.value) : parseInt(minuteInput.value);
            const min = 0;
            const max = type === 'hour' ? 23 : 55;

            val += delta;
            if (val > max) val = min;
            if (val < min) val = max;

            if (type === 'hour') {
                hourInput.value = String(val).padStart(2, '0');
            } else {
                minuteInput.value = String(val).padStart(2, '0');
            }
        }

        // Smart function to auto-update deadline based on mapel schedule
        function autoUpdateDeadlineFromMapel() {
            // Only work if "Pertemuan berikutnya" preset is active
            const nextPresetBtn = document.querySelector('.preset[data-preset="next"]');
            if (!nextPresetBtn || !nextPresetBtn.classList.contains('active')) return;

            // Get current mapel based on mode and input type
            let mapel = '';
            if (currentMode === 'siswa') {
                const inputType = document.querySelector('.mapel-toggle-btn.active')?.dataset.type;
                if (inputType === 'custom') {
                    // Custom mapel doesn't have schedule
                    return;
                }
                mapel = document.getElementById('siswaMapel').value;
            } else {
                mapel = document.getElementById('mapel').value;
            }

            if (!mapel) return;

            // Get schedule for this mapel
            const mapelSchedule = SCHEDULE[mapel];
            if (!mapelSchedule || mapelSchedule.length === 0) return;

            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const JS_DAY = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            let found = false;
            let result = null;

            // Check up to 14 days ahead
            for (let offset = 0; offset <= 14; offset++) {
                const checkDate = new Date(now);
                checkDate.setDate(now.getDate() + offset);
                const checkDayName = JS_DAY[checkDate.getDay()];

                for (const entry of mapelSchedule) {
                    if (entry.day === checkDayName) {
                        const [h, m] = entry.time.split(':').map(Number);
                        const classMinutes = h * 60 + m;

                        // Skip if same day but class time has passed
                        if (offset === 0 && classMinutes <= currentMinutes) {
                            continue;
                        }

                        result = new Date(checkDate);
                        result.setHours(h, m, 0, 0);
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }

            if (found && result) {
                setCustomDeadline(result);
            }
        }

        function confirmDateTime() {
            const h = parseInt(document.getElementById('hourInput').value);
            const m = parseInt(document.getElementById('minuteInput').value);
            const newDate = new Date(pickerYear, pickerMonth, pickerDay, h, m);
            setCustomDeadline(newDate); // Mark as custom deadline
            closeDatePicker();
        }

        // Close modal on backdrop click
        document.getElementById('datetimeModal').addEventListener('click', function(e) {
            if (e.target === this) closeDatePicker();
        });

        // Prevent clicks inside modal from triggering outside events
        document.querySelector('.datetime-modal-content').addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Deadline presets
        document.querySelectorAll('.preset').forEach(btn => {
            btn.addEventListener('click', () => {
                // COMPLETELY BLOCK if modal is open
                if (modalOpen) return;

                // Remove active from all presets
                document.querySelectorAll('.preset').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const mapel = currentMode === 'siswa'
                    ? document.getElementById('siswaMapel').value
                    : document.getElementById('mapel').value;
                const now = new Date();

                if (btn.dataset.preset === 'next') {
                    // Check if mapel is selected
                    if (!mapel) {
                        const toastTarget = currentMode === 'siswa' ? 'siswaMapel' : 'mapel';
                        showValidationToast('Pilih mapel terlebih dahulu', toastTarget);
                        btn.classList.remove('active');
                        return;
                    }

                    // Get schedule for this specific mapel
                    const mapelSchedule = SCHEDULE[mapel];
                    if (!mapelSchedule || mapelSchedule.length === 0) {
                        showValidationToast('Jadwal mapel tidak ditemukan', null);
                        btn.classList.remove('active');
                        return;
                    }

                    const currentMinutes = now.getHours() * 60 + now.getMinutes();
                    const JS_DAY = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
                    let found = false;
                    let result = null;

                    // Check up to 14 days ahead
                    for (let offset = 0; offset <= 14; offset++) {
                        const checkDate = new Date(now);
                        checkDate.setDate(now.getDate() + offset);
                        const checkDayName = JS_DAY[checkDate.getDay()];

                        for (const entry of mapelSchedule) {
                            if (entry.day === checkDayName) {
                                const [h, m] = entry.time.split(':').map(Number);
                                const classMinutes = h * 60 + m;

                                // Skip if same day but class time has passed
                                if (offset === 0 && classMinutes <= currentMinutes) {
                                    continue;
                                }

                                result = new Date(checkDate);
                                result.setHours(h, m, 0, 0);
                                found = true;
                                break;
                            }
                        }
                        if (found) break;
                    }

                    if (found && result) {
                        setCustomDeadline(result);
                    } else {
                        showValidationToast('Tidak ada jadwal berikutnya', null);
                        btn.classList.remove('active');
                    }
                } else {
                    // Number presets (Besok=1, Lusa=2, etc.)
                    const days = parseInt(btn.dataset.days);
                    const target = new Date(now);
                    target.setDate(now.getDate() + days);
                    target.setHours(23, 59, 0, 0);
                    setCustomDeadline(target);
                }
            });
        });

        // File upload
        const upload = document.getElementById('upload');
        const fileInput = document.getElementById('foto');

        upload.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', e => {
            if (e.target.files[0]) handleFile(e.target.files[0]);
        });

        function handleFile(file) {
            if (!file.type.startsWith('image/')) {
                showValidationToast('Pilih file gambar');
                return;
            }
            if (file.size > 50 * 1024 * 1024) {
                showValidationToast('Ukuran foto maks 5MB');
                return;
            }
            selectedFile = file;
            document.getElementById('previewImg').src = URL.createObjectURL(file);
            document.getElementById('previewName').textContent = file.name;
            document.getElementById('previewSize').textContent = formatSize(file.size);
            document.getElementById('preview').classList.add('show');
        }

        function removeFile() {
            selectedFile = null;
            fileInput.value = '';
            document.getElementById('preview').classList.remove('show');
        }

        function formatSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }

        // Form submit
        document.getElementById('form').addEventListener('submit', async e => {
            e.preventDefault();

            // Get mapel based on mode
            let mapel = '';
            if (currentMode === 'siswa') {
                const inputType = document.querySelector('.mapel-toggle-btn.active')?.dataset.type;
                if (inputType === 'custom') {
                    mapel = document.getElementById('siswaMapelCustom').value.trim();
                } else {
                    mapel = document.getElementById('siswaMapel').value;
                }
            } else {
                mapel = document.getElementById('mapel').value;
            }
            const guru = document.getElementById('guru').value;
            const guruSelectWrapper = document.getElementById('guruSelectWrapper');
            const guruSelect = document.getElementById('guruSelect');
            const siswa = document.getElementById('siswa').value.trim();
            const deskripsi = document.getElementById('deskripsi').value.trim();
            const deadline = document.getElementById('deadline').value;

            if (currentMode === 'guru') {
                // Check mapel first
                if (!mapel) {
                    showValidationToast('Pilih mapel terlebih dahulu', 'mapel');
                    return;
                }

                // Check if guru dropdown is visible (mapel with 2+ teachers)
                if (guruSelectWrapper.style.display !== 'none') {
                    if (!guruSelect.value) {
                        showValidationToast('Pilih guru terlebih dahulu', 'guruSelect');
                        return;
                    }
                } else {
                    // Single teacher - check if guru is filled
                    if (!guru) {
                        showValidationToast('Pilih mapel terlebih dahulu', 'mapel');
                        return;
                    }
                }
            }

            if (currentMode === 'siswa' && !siswa) {
                showValidationToast('Masukkan nama kamu', 'siswa');
                return;
            }
            if (!mapel) {
                showValidationToast('Pilih mapel terlebih dahulu', currentMode === 'siswa' ? 'siswaMapel' : 'mapel');
                return;
            }
            if (!deskripsi) {
                showValidationToast('Masukkan deskripsi tugas', 'deskripsi');
                return;
            }
            if (!deadline) {
                showValidationToast('Pilih deadline terlebih dahulu');
                return;
            }

            const submitBtn = document.getElementById('submit');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Mengirim...';

            try {
                const payload = {
                    submittedBy: currentMode === 'guru' ? guru : siswa,
                    pengirimType: currentMode,
                    guru,
                    siswa,
                    mapel,
                    deskripsi,
                    deadline
                };

                if (selectedFile) {
                    payload.foto = await new Promise(resolve => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.readAsDataURL(selectedFile);
                    });
                    payload.fotoExt = selectedFile.name.split('.').pop();
                }

                const res = await fetch(API_BASE + '/api/tugas', {
                    method: 'POST',
                    headers: {
                        'X-API-Key': API_KEY,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();

                if (res.ok && data.success) {
                    showAlert('Tugas berhasil dikirim!', 'success');
                    document.getElementById('form').reset();
                    removeFile();
                    document.getElementById('guruInfo').classList.remove('show');
                    document.querySelectorAll('.preset').forEach(b => b.classList.remove('active'));
                    document.querySelector('.preset[data-days="custom"]').classList.add('active');
                } else {
                    showAlert(data.error || 'Gagal mengirim', 'error');
                }
            } catch (e) {
                showAlert('Koneksi gagal', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Kirim';
            }
        });

        function showAlert(msg, type) {
            const alert = document.getElementById('alert');
            alert.textContent = type === 'success' ? '✓ ' + msg : '✗ ' + msg;
            alert.className = 'alert show ' + type;
            setTimeout(() => alert.classList.remove('show'), 4000);
        }

        // Custom validation toast
        let validationTimeout;
        function showValidationToast(msg, inputId) {
            const toast = document.getElementById('validationToast');
            const text = document.getElementById('validationToastText');
            text.textContent = msg;
            toast.classList.remove('show');
            void toast.offsetWidth; // Trigger reflow
            toast.classList.add('show');

            // Shake the input/element if specified
            let targetEl = null;
            if (inputId === 'mapel') {
                targetEl = document.querySelector('#mapelSelectWrapper .custom-select-trigger');
            } else if (inputId === 'guruSelect') {
                targetEl = document.querySelector('#guruCustomSelectWrapper .custom-select-trigger');
            } else if (inputId === 'siswaMapel') {
                targetEl = document.querySelector('#siswaMapelSelectWrapper .custom-select-trigger');
            } else if (inputId) {
                targetEl = document.getElementById(inputId);
            }

            if (targetEl) {
                targetEl.classList.add('input-error');
                setTimeout(() => targetEl.classList.remove('input-error'), 500);
            }

            clearTimeout(validationTimeout);
            validationTimeout = setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        loadData();
        initDeadline();
        // Ensure dropdowns are populated after load
        setTimeout(() => {
            if (typeof populateMapel === 'function') populateMapel();
            if (typeof populateSiswaMapelDropdown === 'function') populateSiswaMapelDropdown();
        }, 100);

        // ===== Event Listeners for HTML buttons (no inline onclick) =====

        // Mapel select triggers
        document.querySelector('#mapelSelectWrapper .custom-select-trigger').addEventListener('click', () => toggleSelect('mapel'));
        document.querySelector('#siswaMapelSelectWrapper .custom-select-trigger').addEventListener('click', () => toggleSelect('siswaMapel'));
        document.querySelector('#guruCustomSelectWrapper .custom-select-trigger').addEventListener('click', () => toggleSelect('guru'));

        // Mapel toggle buttons (siswa mode)
        document.querySelectorAll('.mapel-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                switchMapelInput(btn.dataset.type);
            });
        });

        // Deadline display click
        document.getElementById('deadlineDisplay').addEventListener('click', showDatePicker);

        // Remove file button
        document.getElementById('removeFile').addEventListener('click', removeFile);

        // Modal buttons
        document.getElementById('closeModalBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            closeDatePicker();
        });
        document.getElementById('prevMonthBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            changeMonth(-1);
        });
        document.getElementById('nextMonthBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            changeMonth(1);
        });
        document.getElementById('hourUpBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            adjustTime('hour', 1);
        });
        document.getElementById('hourDownBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            adjustTime('hour', -1);
        });
        document.getElementById('minuteUpBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            adjustTime('minute', 1);
        });
        document.getElementById('minuteDownBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            adjustTime('minute', -1);
        });
        document.getElementById('cancelBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            closeDatePicker();
        });
        document.getElementById('confirmBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            confirmDateTime();
        });

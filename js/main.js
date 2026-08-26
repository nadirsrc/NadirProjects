/* ================================================
   NADIR PROJECTS — Main JavaScript
   Modern Design System
   ================================================ */

const projectsData = [
    {
        id: 1,
        title: "One Page Portfolio",
        description: "A single-page portfolio website built as a school assignment for Web Development class.",
        category: "Web Development",
        tags: ["HTML", "CSS", "JS"],
        url: "Projects/OnePage",
        date: "2025-08-23"
    },
    {
        id: 2,
        title: "Multiple Page Portfolio",
        description: "A multi-page portfolio site styled with Tailwind CSS, created for a school web development project.",
        category: "Web Development",
        tags: ["HTML", "Tailwind", "JS"],
        url: "Projects/MultiplePage",
        date: "2025-08-23"
    },
    {
        id: 3,
        title: "Aura Coffee",
        description: "A coffee shop landing page designed and built as a hands-on school practice assignment.",
        category: "Web Development",
        tags: ["HTML", "Tailwind", "JS"],
        url: "Projects/AuraCoffee",
        date: "2025-08-12"
    },
    {
        id: 4,
        title: "Cinemax TIX",
        description: "A cinema ticket booking web app built with React as a Project Based Learning assignment.",
        category: "Project Based Learning",
        tags: ["React", "Vite", "CSS"],
        url: "Projects/CinemaxTIX",
        date: "2026-01-15"
    },
    {
        id: 5,
        title: "Interactive Math",
        description: "An interactive math learning website created as a school assignment for Mathematics class.",
        category: "Mathematics",
        tags: ["HTML", "Tailwind", "JS"],
        url: "Projects/MathWebsite",
        date: "2026-01-28"
    },
    {
        id: 6,
        title: "Motorcycle Loan Calculator",
        description: "A modern motorcycle installment calculator with real-time calculations, DP presets, interest breakdown, and amortization schedule.",
        category: "Web Development",
        tags: ["HTML", "CSS", "JS"],
        url: "Projects/MotorcycleCalculator",
        date: "2026-02-10"
    },
    {
        id: 7,
        title: "Misa Bot Showcase",
        description: "A WhatsApp Multi-Purpose Bot built from scratch using Node.js & Baileys with 70+ commands, school system, and marketplace automation.",
        category: "Web Development",
        tags: ["JS", "HTML", "CSS"],
        url: "Projects/MisaBot",
        date: "2026-08-02"
    },
];

// Tech icon SVGs
const techIcons = {
    HTML: `<svg viewBox="0 0 24 24" fill="#e34f26"><path d="M1.5 0h21l-1.91 21.56L11.99 24l-8.59-2.44L1.5 0zm7.09 9.68l-.2-2.26h7.24l.59-6.72H2.88l1.78 19.96 6.59 1.83 6.6-1.83.93-10.48H12l-.17 2.26h3.6l-.34 3.81-3.1.86-3.09-.86-.19-2.12h-2.3l.33 4.58 5.25 1.46 5.24-1.46.71-7.96H8.79l-.2-2.07z"/></svg>`,
    CSS: `<svg viewBox="0 0 24 24" fill="#1572b6"><path d="M1.5 0h21l-1.91 21.56L11.99 24l-8.59-2.44L1.5 0zm17.09 4.3H5.65l.37 4.15h12.2l-.58 6.47-5.65 1.56-5.65-1.56-.4-4.37h3.93l.2 2.26 1.92.52 1.93-.52.2-2.26H5.83L5.43 6.4h13.35l-.19-2.1z"/></svg>`,
    JS: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>JavaScript</title><path fill="#f7df1e" d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg>`,
    Tailwind: `<svg viewBox="0 0 24 24" fill="#06b6d4"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>`,
    React: `<svg viewBox="0 0 24 24" fill="#61dafb"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.31 0-.594.063-.857.18-1.725.846-1.538 4.022-.275 7.07a20.9 20.9 0 0 0-2.614.98C1.356 10.67.246 11.89.246 12.81c0 1.006 1.29 2.307 3.549 3.386.76.365 1.613.688 2.537.968-1.27 3.074-1.441 6.265.271 7.108.264.12.55.18.854.18 1.384 0 3.17-.972 4.952-2.644 1.778 1.665 3.556 2.634 4.936 2.634.31 0 .597-.063.86-.181 1.725-.846 1.538-4.022.275-7.07a20.9 20.9 0 0 0 2.613-.98c2.258-1.08 3.37-2.303 3.37-3.223 0-1.006-1.29-2.307-3.549-3.386a20.894 20.894 0 0 0-2.537-.968c1.27-3.074 1.441-6.265-.271-7.108a1.594 1.594 0 0 0-.86-.18zM12 15.065a3.065 3.065 0 1 1 0-6.13 3.065 3.065 0 0 1 0 6.13z"/></svg>`,
    Vite: `<svg viewBox="0 0 24 24" fill="#646cff"><path d="m22.845 1.467-10.3 18.49a.547.547 0 0 1-.96.01L1.156 1.468a.547.547 0 0 1 .59-.802l10.14 1.932a.55.55 0 0 0 .207 0l9.16-1.932a.547.547 0 0 1 .592.801z"/></svg>`,
    PHP: `<svg viewBox="0 0 24 24" fill="#777bb4"><path d="M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 0 1-.866 1.55zm5.791-.405c-.195.388-.466.704-.813.949-.287.202-.644.345-1.048.427-.238.05-.517.075-.837.075h-.86l-.328 1.681h-1.378l1.23-6.326h2.649c.797 0 1.378.209 1.744.628.366.418.477 1.002.33 1.752a2.836 2.836 0 0 1-.69 1.314zm5.259-2.3h-1.2l-.208 1.074h1.2l-.263 1.35h-1.2l-.491 2.517h-1.378l.491-2.517h-.84l-.263 1.35h-1.2l.263-1.35h-.84l.208-1.074h.84l.208-1.074h-.84l.263-1.35h.84l.491-2.517h1.378l-.491 2.517h.84l.263-1.35h1.2l-.263 1.35zm-5.634 1.233h-.838c-.556 0-.97.105-1.242.314-.272.21-.455.559-.55 1.049-.092.47-.05.802.124.995.175.193.523.29 1.047.29h.944l.515-2.648z"/></svg>`,
};

function getTechIconsHTML(tags) {
    return tags.map(t => {
        const svg = techIcons[t];
        if (svg) {
            return `<span class="tech-icon" title="${t}">${svg}</span>`;
        }
        return '';
    }).join('');
}

// DOM Elements
const projectsGrid = document.getElementById('projectsGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.getElementById('filterButtons');
const emptyState = document.getElementById('emptyState');
const totalProjectsEl = document.getElementById('totalProjects');
const navbar = document.getElementById('navbar');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    totalProjectsEl.textContent = projectsData.length;
    renderRecent();
    generateFilterButtons();
    renderProjects(projectsData);
    initScrollReveal();
    initNavbar();
    initSearch();
    initNavToggle();
    initMouseGlow();
});

// Render recent projects
function renderRecent() {
    const recentList = document.getElementById('recentList');
    const recentCount = document.getElementById('recentCount');
    const sorted = [...projectsData].sort((a, b) => new Date(b.date) - new Date(a.date));
    const recent = sorted.slice(0, 3);

    recentCount.textContent = recent.length + ' projects';

    recentList.innerHTML = recent.map(p => {
        return `
        <div class="recent-card" data-url="${p.url}">
            <div class="recent-card-header">
                <span class="recent-card-title">${p.title}</span>
                <span class="recent-card-time">${getTimeAgo(p.date)}</span>
            </div>
            <div class="recent-card-footer">
                <span class="recent-card-tag">${p.category}</span>
                <div class="recent-card-tech">${getTechIconsHTML(p.tags)}</div>
            </div>
        </div>`;
    }).join('');

    // Add click handlers
    recentList.querySelectorAll('.recent-card').forEach(card => {
        card.addEventListener('click', () => {
            showProjectPopup(card, card.dataset.url);
        });
    });
}

function getTimeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 7) return days + 'd ago';
    if (days < 30) return Math.floor(days / 7) + 'w ago';
    if (days < 365) return Math.floor(days / 30) + 'mo ago';
    return Math.floor(days / 365) + 'y ago';
}

function formatDate(dateStr) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = new Date(dateStr);
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

function generateFilterButtons() {
    const categories = [...new Set(projectsData.map(p => p.category))];

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filter = cat;
        btn.textContent = cat;
        filterButtons.appendChild(btn);
    });

    filterButtons.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filtered = filterProjects(btn.dataset.filter, searchInput.value.toLowerCase());
            renderProjects(filtered);
        });
    });
}

function initSearch() {
    let timer;
    searchInput.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            const activeFilter = filterButtons.querySelector('.filter-btn.active').dataset.filter;
            const filtered = filterProjects(activeFilter, searchInput.value.toLowerCase());
            renderProjects(filtered);
        }, 150);
    });
}

function filterProjects(category, term) {
    return projectsData.filter(p => {
        const matchCat = category === 'all' || p.category === category;
        const matchSearch = !term ||
            p.title.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term) ||
            p.tags.some(t => t.toLowerCase().includes(term));
        return matchCat && matchSearch;
    });
}

function getFullUrl(url) {
    if (url.startsWith('http')) return url;
    const base = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/');
    return base + url;
}

let activePopup = null;

function showProjectPopup(el, url) {
    closePopup();
    const fullUrl = getFullUrl(url);

    const popup = document.createElement('div');
    popup.className = 'project-popup';
    popup.innerHTML = `
        <a href="${url}" class="popup-btn" target="_blank">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Open
        </a>
        <button class="popup-btn" onclick="copyLink('${fullUrl}', this)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy</span>
        </button>
    `;

    el.style.position = 'relative';
    el.appendChild(popup);
    activePopup = { el, popup };

    requestAnimationFrame(() => {
        popup.classList.add('show');
    });
}

function copyLink(url, btn) {
    navigator.clipboard.writeText(url).then(() => {
        const span = btn.querySelector('span');
        span.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            span.textContent = 'Copy';
            btn.classList.remove('copied');
            closePopup();
        }, 1200);
    });
}

function closePopup() {
    if (activePopup) {
        activePopup.popup.remove();
        activePopup = null;
    }
}

document.addEventListener('click', (e) => {
    if (activePopup && !e.target.closest('.project-popup') && !e.target.closest('.project-card') && !e.target.closest('.recent-card')) {
        closePopup();
    }
});

function renderProjects(projects) {
    if (!projects.length) {
        projectsGrid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    projectsGrid.innerHTML = projects.map(p => `
        <div class="project-card" data-url="${p.url}">
            <div class="project-info">
                <div class="project-name">${p.title}</div>
                <div class="project-desc">${p.description}</div>
            </div>
            <div class="project-meta">
                <span class="project-date">${formatDate(p.date)}</span>
                <span class="project-category">${p.category}</span>
            </div>
            <svg class="project-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18 6-6-6-6"></path>
            </svg>
        </div>
    `).join('');

    // Add click handlers
    projectsGrid.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            showProjectPopup(card, card.dataset.url);
        });
    });
}

// Scroll reveal
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Navbar scroll effect
function initNavbar() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Mobile nav toggle
function initNavToggle() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('show');
    });

    menu.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('show');
        });
    });
}

// Mouse glow effect
function initMouseGlow() {
    document.querySelectorAll('.project-card, .recent-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });
}

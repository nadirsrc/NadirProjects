/* ================================================
   NADIR PROJECTS — Main JavaScript
   ================================================
   
   HOW TO ADD A NEW PROJECT:
   1. Add a new object to the "projectsData" array below
   2. Fill in all the required fields
   3. Create the project folder in /projects/folder-name/
   4. Done! The project will automatically appear on the portal
   
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
        description: "A PHP-based motorcycle installment calculator built as a personal project to practice backend development.",
        category: "Web Development",
        tags: ["PHP", "HTML", "CSS"],
        url: "https://motorcyclecalculator.gt.tc/",
        isExternal: true,
        date: "2026-02-10"
    },
];

// Tech icon SVGs (inline, no external dependencies)
const techIcons = {
    HTML: `<svg viewBox="0 0 24 24" fill="#e34f26"><path d="M1.5 0h21l-1.91 21.56L11.99 24l-8.59-2.44L1.5 0zm7.09 9.68l-.2-2.26h7.24l.59-6.72H2.88l1.78 19.96 6.59 1.83 6.6-1.83.93-10.48H12l-.17 2.26h3.6l-.34 3.81-3.1.86-3.09-.86-.19-2.12h-2.3l.33 4.58 5.25 1.46 5.24-1.46.71-7.96H8.79l-.2-2.07z"/></svg>`,
    CSS: `<svg viewBox="0 0 24 24" fill="#1572b6"><path d="M1.5 0h21l-1.91 21.56L11.99 24l-8.59-2.44L1.5 0zm17.09 4.3H5.65l.37 4.15h12.2l-.58 6.47-5.65 1.56-5.65-1.56-.4-4.37h3.93l.2 2.26 1.92.52 1.93-.52.2-2.26H5.83L5.43 6.4h13.35l-.19-2.1z"/></svg>`,
    JS: `<svg viewBox="0 0 24 24" fill="#f7df1e"><path d="M0 0h24v24H0V0zm22.03 18.26c-.23-1.46-1.17-2.68-3.96-3.83-.97-.45-2.04-.78-2.36-1.52-.12-.43-.14-.67-.06-.93.21-.71 1.02-.92 1.69-.72.44.13.85.47 1.1 1.02 1.17-.77 1.17-.77 1.99-1.28-.3-.47-.46-.68-.67-.87-.74-.82-1.73-1.24-3.33-1.2l-.83.1c-.8.2-1.55.63-1.99 1.22-1.31 1.66-.93 4.56.33 5.75 1.24 1.27 3.07 1.55 4.15 2.67.36.44.52 1.16.16 1.72-.36.54-1.05.76-1.7.73-.7-.04-1.09-.38-1.52-1.18l-2.06 1.19c.24.54.52.78.93 1.25.97 1.09 2.5 1.69 4.18 1.59 1.61-.08 3-.68 3.72-2.14.69-1.2.73-3.52-.33-4.77zm-11.14-1.35l-2.47 0c0 1.95-.09 3.89-.09 5.84-.02 1.23.06 2.36-.16 2.71-.34.7-1.22.62-1.62.49-.41-.21-.62-.5-.84-.91-.06-.12-.11-.21-.16-.21l-2.06 1.27c.34.71.83 1.32 1.5 1.71.89.53 2.08.69 3.33.38 1.13-.36 1.96-1.04 2.31-2.21.24-.73.32-1.56.32-2.71-.01-2.15 0-4.3 0-6.46l.01-.9z"/></svg>`,
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
        return `<span class="project-tag">${t}</span>`;
    }).join('');
}

// DOM
const projectsGrid = document.getElementById('projectsGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.getElementById('filterButtons');
const emptyState = document.getElementById('emptyState');
const totalProjectsEl = document.getElementById('totalProjects');

document.addEventListener('DOMContentLoaded', () => {
    totalProjectsEl.textContent = projectsData.length;
    renderRecent();
    generateFilterButtons();
    renderProjects(projectsData);
    initSearch();
    initNavToggle();
    initSmoothScroll();
});

// Recently added — shows the 3 newest projects based on date
function renderRecent() {
    const recentList = document.getElementById('recentList');
    const recentCount = document.getElementById('recentCount');
    const sorted = [...projectsData].sort((a, b) => new Date(b.date) - new Date(a.date));
    const recent = sorted.slice(0, 3);

    recentCount.textContent = recent.length + ' latest';

    recentList.innerHTML = recent.map(p => {
        const d = new Date(p.date);
        const ago = getTimeAgo(d);
        return `
        <div class="recent-item" data-url="${p.url}">
            <div class="recent-item-top">
                <span class="recent-item-title">${p.title}</span>
                <span class="recent-item-time">${ago} · ${formatDate(p.date)}</span>
            </div>
            <div class="recent-item-bottom">
                <span class="recent-item-cat">${p.category}</span>
                <span class="recent-item-tech">${getTechIconsHTML(p.tags)}</span>
            </div>
        </div>`;
    }).join('');

    recentList.querySelectorAll('.recent-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.project-popup')) return;
            e.stopPropagation();
            showProjectPopup(item, item.dataset.url);
        });
    });
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 7) return days + ' days ago';
    if (days < 30) return Math.floor(days / 7) + 'w ago';
    if (days < 365) return Math.floor(days / 30) + 'mo ago';
    return Math.floor(days / 365) + 'y ago';
}

function formatDate(dateStr) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
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
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
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
        <a href="${url}" class="popup-option" target="_blank">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Visit Site
        </a>
        <button class="popup-option" onclick="copyLink('${fullUrl}', this)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Copy Link</span>
        </button>
    `;
    el.style.position = 'relative';
    el.appendChild(popup);
    activePopup = { el, popup };

    // Check if popup would overflow below the viewport
    requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < 80) {
            popup.classList.add('popup-above');
        }
        popup.classList.add('show');
    });
}

function copyLink(url, btn) {
    navigator.clipboard.writeText(url).then(() => {
        const span = btn.querySelector('span');
        span.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            span.textContent = 'Copy Link';
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
    if (activePopup && !e.target.closest('.project-popup') && !e.target.closest('.project-item') && !e.target.closest('.recent-item')) {
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
        <div class="project-item" data-url="${p.url}">
            <div class="project-info">
                <div class="project-name">${p.title}</div>
                <div class="project-desc">${p.description}</div>
                <div class="project-tags">
                    ${getTechIconsHTML(p.tags)}
                </div>
            </div>
            <div class="project-meta">
                <span class="project-date">${formatDate(p.date)}</span>
                <span class="project-category">${p.category}</span>
            </div>
            <svg class="project-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m9 18 6-6-6-6"/>
            </svg>
        </div>
    `).join('');

    projectsGrid.querySelectorAll('.project-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.project-popup')) return;
            e.stopPropagation();
            showProjectPopup(item, item.dataset.url);
        });
    });
}

function initNavToggle() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');

    toggle.addEventListener('click', () => {
        menu.classList.toggle('show');
    });

    menu.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => menu.classList.remove('show'));
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

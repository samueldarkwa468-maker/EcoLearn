(() => {
  "use strict";

  const DATA = window.ECOLEARN_DATA;
  const app = document.getElementById("main-content");
  const headerRoot = document.getElementById("site-header");
  const footerRoot = document.getElementById("site-footer");
  const mobileNavRoot = document.getElementById("mobile-bottom-nav");
  const toastRoot = document.getElementById("toast-region");
  const modalRoot = document.getElementById("modal-root");

  const STORAGE = {
    user: "ecolearn_user_v2",
    saved: "ecolearn_saved_v2",
    enrollments: "ecolearn_enrollments_v2",
    certificates: "ecolearn_certificates_v2",
    applications: "ecolearn_teacher_apps_v2"
  };

  const DEFAULT_USER = {
    name: "Demo Learner",
    email: "learner@example.com",
    role: "student",
    interests: ["Information Technology", "Programming"]
  };

  const store = {
    get(key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  const state = {
    user: store.get(STORAGE.user, null),
    saved: store.get(STORAGE.saved, []),
    enrollments: store.get(STORAGE.enrollments, {}),
    certificates: store.get(STORAGE.certificates, []),
    courseFilters: { query: "", category: "all", level: "all", certificate: false, sort: "popular" }
  };

  const iconPaths = {
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="m18 6-12 12M6 6l12 12"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="m19 12-14 0M11 18l-6-6 6-6"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    code: '<path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/>',
    browser: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M2 8h20M6 6h.01M10 6h.01"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-7"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z"/><path d="m9 12 2 2 4-4"/>',
    briefcase: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 12h20M10 12v2h4v-2"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.12-.1-2.9a2.18 2.18 0 0 0-2.9-.1Z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.87 12.87 0 0 1 22 2c0 2.72-.78 7.5-6.05 11a22.35 22.35 0 0 1-3.95 2Z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3Z"/><path d="M11.6 16.8 13 22H7l-1.8-7"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    terminal: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m6 9 3 3-3 3M13 15h5"/>',
    message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    lessons: '<path d="M6 2h12a2 2 0 0 1 2 2v16l-8-4-8 4V4a2 2 0 0 1 2-2Z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    checkCircle: '<path d="M22 11.1V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    certificate: '<path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 6.2l1.4-1.4M10.8 13.2l-1.4 1.4M17.8 11.8l1.4 1.4M10.8 4.8 9.4 3.4"/><circle cx="15" cy="9" r="4"/><path d="m13 13-2 9 4-2 4 2-2-9"/>',
    home: '<path d="m3 11 9-8 9 8v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Z"/><path d="M9 22V12h6v10"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    filter: '<path d="M4 4h16l-6 7v7l-4 2v-9L4 4Z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 7L2 7"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.61 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.28 1.73.49 2.63.61A2 2 0 0 1 22 16.92Z"/>',
    map: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z"/><circle cx="12" cy="12" r="3"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'
  };

  function icon(name, size = 20, className = "") {
    const path = iconPaths[name] || iconPaths.book;
    return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function routeParts() {
    const raw = location.hash.replace(/^#\/?/, "") || "home";
    const [path, queryString = ""] = raw.split("?");
    return { parts: path.split("/").filter(Boolean), params: new URLSearchParams(queryString) };
  }

  function routeName() {
    return routeParts().parts[0] || "home";
  }

  function navigate(path) {
    location.hash = path.startsWith("#") ? path : `#/${path.replace(/^\//, "")}`;
  }

  function courseBySlug(slug) {
    return DATA.courses.find((course) => course.slug === slug);
  }

  function instructorById(id) {
    return DATA.instructors.find((instructor) => instructor.id === id);
  }

  function enrollment(slug) {
    return state.enrollments[slug] || null;
  }

  function completedLessons(slug) {
    return enrollment(slug)?.completedLessons || [];
  }

  function courseProgress(slug) {
    const course = courseBySlug(slug);
    if (!course) return 0;
    const count = completedLessons(slug).length;
    return Math.min(100, Math.round((count / course.lessons.length) * 100));
  }

  function persist() {
    store.set(STORAGE.saved, state.saved);
    store.set(STORAGE.enrollments, state.enrollments);
    store.set(STORAGE.certificates, state.certificates);
    if (state.user) store.set(STORAGE.user, state.user);
    else localStorage.removeItem(STORAGE.user);
  }

  function showToast(title, message, type = "success") {
    const node = document.createElement("div");
    node.className = "toast";
    node.innerHTML = `<div class="icon-box">${icon(type === "success" ? "checkCircle" : "info", 20)}</div><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p></div>`;
    toastRoot.append(node);
    setTimeout(() => node.remove(), 3900);
  }

  function showModal(title, body, actions = "") {
    modalRoot.innerHTML = `<div class="modal-backdrop" data-close-modal><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-header"><h2 id="modal-title">${escapeHtml(title)}</h2><button class="icon-btn" data-close-modal aria-label="Close">${icon("close")}</button></div><div>${body}</div>${actions ? `<div class="actions" style="margin-top:20px">${actions}</div>` : ""}</div></div>`;
    modalRoot.querySelectorAll("[data-close-modal]").forEach((el) => el.addEventListener("click", (event) => {
      if (event.target === el || el.matches("button")) modalRoot.innerHTML = "";
    }));
  }

  function ensureUser() {
    if (state.user) return true;
    showModal("Create a free account", `<p class="muted">Sign in or create a free demo account to enroll, save progress, and receive certificates.</p>`, `<a class="btn btn-primary" href="#/signup">Create account</a><a class="btn btn-outline" href="#/login">Sign in</a>`);
    return false;
  }

  function enroll(slug) {
    if (!ensureUser()) return;
    if (!state.enrollments[slug]) {
      state.enrollments[slug] = { enrolledAt: new Date().toISOString(), completedLessons: [] };
      persist();
      showToast("Enrollment complete", "The course has been added to My Learning.");
    }
    const course = courseBySlug(slug);
    navigate(`lesson/${slug}/${course.lessons[0].id}`);
  }

  function toggleSaved(slug, button) {
    const index = state.saved.indexOf(slug);
    if (index >= 0) {
      state.saved.splice(index, 1);
      showToast("Removed from saved", "The course was removed from your saved list.", "info");
    } else {
      state.saved.push(slug);
      showToast("Course saved", "You can find it under Saved Courses.");
    }
    persist();
    if (button) {
      button.classList.toggle("active", state.saved.includes(slug));
      button.innerHTML = icon("heart", 19);
      button.setAttribute("aria-label", state.saved.includes(slug) ? "Remove saved course" : "Save course");
    }
    renderMobileNav();
  }

  function markLessonComplete(slug, lessonId) {
    if (!state.enrollments[slug]) state.enrollments[slug] = { enrolledAt: new Date().toISOString(), completedLessons: [] };
    const list = state.enrollments[slug].completedLessons;
    if (!list.includes(lessonId)) list.push(lessonId);
    const progress = courseProgress(slug);
    const course = courseBySlug(slug);
    if (progress === 100 && course.certificate && !state.certificates.some((cert) => cert.slug === slug)) {
      const certificate = {
        slug,
        id: `ECO-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        issuedAt: new Date().toISOString()
      };
      state.certificates.push(certificate);
      showToast("Certificate earned", `You completed ${course.title}.`);
    } else {
      showToast("Progress saved", `This lesson is complete. Course progress: ${progress}%.`);
    }
    persist();
  }

  function renderHeader() {
    const current = routeName();
    const user = state.user;
    const navItems = [
      ["courses", "Explore Courses"],
      ["categories", "Categories"],
      ["instructors", "Instructors"],
      ["about", "About"]
    ];
    headerRoot.innerHTML = `
      <div class="site-header">
        <div class="container header-inner">
          <a class="brand" href="#/home" aria-label="EcoLearn home">
            <span class="brand-mark">${icon("book", 22)}</span><span>EcoLearn</span>
          </a>
          <nav class="desktop-nav" aria-label="Main navigation">
            ${navItems.map(([route, label]) => `<a class="nav-link ${current === route ? "active" : ""}" href="#/${route}">${label}</a>`).join("")}
          </nav>
          <div class="header-search">
            <span class="search-icon">${icon("search", 18)}</span>
            <input id="global-search" type="search" placeholder="Search courses" autocomplete="off" aria-label="Search courses" />
            <div id="global-search-results" class="search-results hidden"></div>
          </div>
          <div class="header-actions">
            ${user ? `<a class="profile-chip" href="#/dashboard"><span class="avatar">${initials(user.name)}</span><span>${escapeHtml(firstName(user.name))}</span></a>` : `<a class="nav-link login-link" href="#/login">Log in</a><a class="btn btn-primary btn-sm" href="#/signup">Start Learning Free</a>`}
            <button class="icon-btn mobile-menu-btn" id="mobile-menu-btn" aria-label="Open navigation" aria-expanded="false">${icon("menu")}</button>
          </div>
        </div>
      </div>
      <div class="mobile-menu" id="mobile-menu">
        ${navItems.map(([route, label]) => `<a class="nav-link" href="#/${route}">${label}</a>`).join("")}
        <a class="nav-link" href="#/contact">Contact</a>
        <div class="actions">
          ${user ? `<a class="btn btn-primary btn-block" href="#/dashboard">Open dashboard</a><button class="btn btn-outline btn-block" id="logout-mobile">Log out</button>` : `<a class="btn btn-outline" href="#/login">Log in</a><a class="btn btn-primary" href="#/signup">Create account</a>`}
        </div>
      </div>`;

    const menuButton = document.getElementById("mobile-menu-btn");
    const menu = document.getElementById("mobile-menu");
    menuButton?.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.innerHTML = icon(open ? "close" : "menu");
    });
    menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => menu.classList.remove("open")));
    document.getElementById("logout-mobile")?.addEventListener("click", logout);
    setupGlobalSearch();
  }

  function setupGlobalSearch() {
    const input = document.getElementById("global-search");
    const results = document.getElementById("global-search-results");
    if (!input || !results) return;
    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      if (query.length < 2) {
        results.classList.add("hidden");
        return;
      }
      const matches = DATA.courses.filter((course) => `${course.title} ${course.category} ${course.tags.join(" ")}`.toLowerCase().includes(query)).slice(0, 5);
      results.innerHTML = matches.length ? matches.map((course) => `
        <a class="search-result" href="#/course/${course.slug}">
          <span class="search-result-art" style="background:${course.accent}">${icon(course.icon, 19)}</span>
          <span><strong>${escapeHtml(course.title)}</strong><small class="muted" style="display:block">${escapeHtml(course.category)}</small></span>
        </a>`).join("") : `<div class="search-result"><span class="muted small">No matching courses</span></div>`;
      results.classList.remove("hidden");
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && input.value.trim()) navigate(`courses?q=${encodeURIComponent(input.value.trim())}`);
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".header-search")) results.classList.add("hidden");
    }, { once: true });
  }

  function renderFooter() {
    footerRoot.innerHTML = `
      <div class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-about">
              <a class="brand" href="#/home"><span class="brand-mark">${icon("book", 22)}</span><span>EcoLearn</span></a>
              <p>Free, practical education in technology, programming, business, digital skills, and career development.</p>
              <form class="newsletter" id="newsletter-form">
                <input type="email" name="email" aria-label="Email address" placeholder="Email for learning updates" required />
                <button type="submit" aria-label="Subscribe">${icon("arrow", 18)}</button>
              </form>
            </div>
            <div class="footer-column"><h3>Learn</h3><a href="#/courses">Explore courses</a><a href="#/categories">Categories</a><a href="#/instructors">Instructors</a><a href="#/certificate-verify">Verify certificate</a></div>
            <div class="footer-column"><h3>EcoLearn</h3><a href="#/about">About us</a><a href="#/teacher-application">Become an instructor</a><a href="#/contact">Contact</a><a href="#/faq">Frequently asked questions</a></div>
            <div class="footer-column"><h3>Legal</h3><a href="#/privacy">Privacy policy</a><a href="#/terms">Terms and conditions</a><a href="#/admin">Admin demo</a><a href="#/instructor-dashboard">Instructor demo</a></div>
          </div>
          <div class="footer-bottom"><span>© ${new Date().getFullYear()} EcoLearn. Free knowledge for a better future.</span><span>Built for accessible learning on every device.</span></div>
        </div>
      </div>`;
    document.getElementById("newsletter-form")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = new FormData(event.currentTarget).get("email");
      await submitForm("newsletter", { email });
      event.currentTarget.reset();
      showToast("Subscription saved", "You are on the EcoLearn learning updates list.");
    });
  }

  function renderMobileNav() {
    const current = routeName();
    const items = [
      ["home", "home", "Home"],
      ["courses", "search", "Explore"],
      ["my-learning", "play", "Learning"],
      ["saved", "heart", "Saved"],
      [state.user ? "dashboard" : "login", "user", "Profile"]
    ];
    mobileNavRoot.className = "mobile-bottom-nav";
    mobileNavRoot.innerHTML = items.map(([route, iconName, label]) => `<a class="${current === route ? "active" : ""}" href="#/${route}">${icon(iconName, 18)}<span>${label}</span></a>`).join("");
  }

  function courseCard(course, options = {}) {
    const instructor = instructorById(course.instructorId);
    const progress = courseProgress(course.slug);
    const saved = state.saved.includes(course.slug);
    return `
      <article class="course-card">
        <div class="course-art" style="--course-accent:${course.accent}">
          <span class="free-badge">Free</span>
          <button class="course-save ${saved ? "active" : ""}" data-save-course="${course.slug}" aria-label="${saved ? "Remove saved course" : "Save course"}">${icon("heart", 19)}</button>
          <a class="course-art-icon" href="#/course/${course.slug}" aria-label="Open ${escapeHtml(course.title)}">${icon(course.icon, 34)}</a>
        </div>
        <div class="course-body">
          <div class="course-kicker"><span>${escapeHtml(course.category)}</span><span>${escapeHtml(course.level)}</span></div>
          <h3><a href="#/course/${course.slug}">${escapeHtml(course.title)}</a></h3>
          <p class="instructor-name">By ${escapeHtml(instructor.name)}</p>
          ${options.showDescription ? `<p class="muted small" style="margin-top:-5px">${escapeHtml(course.short)}</p>` : ""}
          ${progress > 0 ? `<div class="progress-wrap"><div class="progress-label"><span>Your progress</span><span>${progress}%</span></div><div class="progress-bar"><span style="width:${progress}%"></span></div></div>` : ""}
          <div class="course-meta">
            <span>${icon("star", 14, "star")} ${course.rating}</span>
            <span>${icon("clock", 14)} ${escapeHtml(course.duration)}</span>
            <span>${icon("lessons", 14)} ${course.lessonsCount} lessons</span>
          </div>
        </div>
      </article>`;
  }

  function attachCourseCardEvents(scope = document) {
    scope.querySelectorAll("[data-save-course]").forEach((button) => button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleSaved(button.dataset.saveCourse, button);
    }));
  }

  function categoryCard(category) {
    return `<a class="category-card" href="#/courses?category=${category.id}"><span class="category-icon" style="background:${category.accent}">${icon(category.icon, 22)}</span><span><h3>${escapeHtml(category.name)}</h3><p>${escapeHtml(category.description)}</p><small>${category.count} ${category.count === 1 ? "course" : "courses"}</small></span></a>`;
  }

  function instructorCard(instructor) {
    return `<article class="instructor-card" style="--instructor-accent:${instructor.accent}"><div class="instructor-avatar">${instructor.initials}</div><h3>${escapeHtml(instructor.name)}</h3><p>${escapeHtml(instructor.title)}</p><div class="instructor-stats"><span>${icon("book", 14)} ${instructor.courses} courses</span><span>${icon("star", 14, "star")} ${instructor.rating}</span></div><a class="text-link" href="#/instructor/${instructor.id}">View profile ${icon("arrow", 15)}</a></article>`;
  }

  function pageHero(eyebrow, title, text, compact = false) {
    return `<section class="page-hero ${compact ? "compact" : ""}"><div class="container"><span class="eyebrow">${escapeHtml(eyebrow)}</span><h1>${title}</h1><p>${escapeHtml(text)}</p></div></section>`;
  }

  function renderHome() {
    app.innerHTML = `
      <div class="page-shell">
        <section class="hero">
          <div class="container hero-grid">
            <div class="hero-copy">
              <span class="eyebrow">Free practical learning</span>
              <h1>Learn useful skills. <span>Build your future.</span></h1>
              <p>Access structured courses in technology, programming, business, and digital skills. Learn at your pace and apply every lesson in the real world.</p>
              <div class="actions"><a class="btn btn-primary" href="#/courses">Explore Free Courses ${icon("arrow", 18)}</a><a class="btn btn-outline" href="#/teacher-application">Become an Instructor</a></div>
              <form class="hero-search" id="hero-search-form">${icon("search", 20)}<input id="hero-search-input" type="search" placeholder="What do you want to learn?" aria-label="Search courses" required /><button class="btn btn-dark" type="submit">Search courses</button></form>
              <div class="search-suggestions">${["Web Development", "Python Programming", "Digital Marketing", "Computer Basics"].map((term) => `<button type="button" data-search-term="${term}">${term}</button>`).join("")}</div>
            </div>
            <div class="hero-visual" aria-hidden="true">
              <div class="visual-panel"><div class="learning-window"><div class="window-top"><span class="window-dot"></span><span class="window-dot"></span><span class="window-dot"></span></div><div class="window-content"><div class="video-mock"><span class="play-circle">${icon("play", 23)}</span></div><div class="lesson-list-mock"><span class="mock-line active"></span><span class="mock-line"></span><span class="mock-line short"></span><span class="mock-line"></span><span class="mock-line short"></span></div></div><div class="mock-progress"><span></span></div></div></div>
              <div class="floating-card top"><strong>Practical projects</strong><span>Learn by building</span></div>
              <div class="floating-card bottom"><strong>Progress saved</strong><span>Continue on any device</span></div>
            </div>
          </div>
        </section>
        <div class="benefit-strip"><div class="container"><div class="benefit-grid">
          ${[["book","Free Access","Learn without course fees"],["code","Practical Lessons","Build useful, real skills"],["clock","Learn at Your Pace","Continue when you are ready"],["award","Certificates","Show verified completion"]].map(([i,t,s]) => `<div class="benefit-item"><span class="icon-box">${icon(i,21)}</span><span><strong>${t}</strong><span>${s}</span></span></div>`).join("")}
        </div></div></div>
        <section class="section"><div class="container"><div class="section-heading"><div><span class="eyebrow">Browse by subject</span><h2>Popular learning categories</h2><p>Choose a clear starting point and build your skills step by step.</p></div><a class="text-link" href="#/categories">See all categories ${icon("arrow",16)}</a></div><div class="category-grid">${DATA.categories.slice(0,6).map(categoryCard).join("")}</div></div></section>
        <section class="section section-soft"><div class="container"><div class="section-heading"><div><span class="eyebrow">Start learning</span><h2>Featured free courses</h2><p>Practical courses designed for students, professionals, and first-time learners.</p></div><a class="text-link" href="#/courses">Explore all courses ${icon("arrow",16)}</a></div><div class="course-grid">${DATA.courses.slice(0,6).map((course) => courseCard(course)).join("")}</div></div></section>
        <section class="section"><div class="container"><div class="section-heading"><div><span class="eyebrow">Simple learning process</span><h2>How EcoLearn works</h2></div></div><div class="steps-grid">${[["1","Find the right course","Search by subject, skill level, or the goal you want to achieve."],["2","Learn through practice","Follow clear lessons, examples, quizzes, and guided exercises."],["3","Complete and demonstrate","Track your progress and earn a certificate on eligible courses."]].map(([n,t,p]) => `<article class="step-card"><span class="step-number">${n}</span><h3>${t}</h3><p>${p}</p></article>`).join("")}</div></div></section>
        <section class="section section-green"><div class="container"><div class="section-heading"><div><span class="eyebrow">Structured growth</span><h2>Follow a complete learning path</h2><p>Combine related courses into a practical route toward a clear skill goal.</p></div></div><div class="path-grid">${DATA.learningPaths.map((path) => `<article class="path-card" style="--path-accent:${path.accent}"><span class="icon-box">${icon(path.icon,23)}</span><h3>${path.title}</h3><div class="path-meta"><span>${path.courses} courses</span><span>${path.time}</span><span>${path.level}</span></div><div class="tag-list">${path.skills.map((skill) => `<span class="skill-pill">${skill}</span>`).join("")}</div></article>`).join("")}</div></div></section>
        <section class="section"><div class="container"><div class="section-heading"><div><span class="eyebrow">Learn from practitioners</span><h2>Meet EcoLearn instructors</h2><p>Clear instruction from people with practical experience in their fields.</p></div><a class="text-link" href="#/instructors">View all instructors ${icon("arrow",16)}</a></div><div class="instructor-grid">${DATA.instructors.map(instructorCard).join("")}</div></div></section>
        <section class="section section-soft"><div class="container"><div class="section-heading"><div><span class="eyebrow">Sample learner feedback</span><h2>Built around practical progress</h2><p>These are demonstration testimonials and should be replaced with verified learner feedback before a public launch.</p></div></div><div class="testimonial-grid">${DATA.testimonials.map((item) => `<article class="testimonial-card"><span class="quote-mark">“</span><blockquote>${escapeHtml(item.quote)}</blockquote><div class="person-row"><span class="avatar">${item.initials}</span><span><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.role)}</span></span></div></article>`).join("")}</div></div></section>
        <section class="section"><div class="container"><div class="cta-panel"><div><h2>Start building your future today.</h2><p>Create a free account, choose a course, and begin learning practical skills you can use in school, work, and business.</p></div><a class="btn" href="#/signup">Create Free Account ${icon("arrow",18)}</a></div></div></section>
      </div>`;
    attachCourseCardEvents(app);
    document.getElementById("hero-search-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = document.getElementById("hero-search-input").value.trim();
      if (query) navigate(`courses?q=${encodeURIComponent(query)}`);
    });
    app.querySelectorAll("[data-search-term]").forEach((button) => button.addEventListener("click", () => navigate(`courses?q=${encodeURIComponent(button.dataset.searchTerm)}`)));
  }

  function renderCourses(params) {
    state.courseFilters.query = params.get("q") || "";
    state.courseFilters.category = params.get("category") || "all";
    app.innerHTML = `<div class="page-shell">${pageHero("Course catalogue", "Explore practical courses", "Search, filter, and choose a course that matches your goal and current experience.")}
      <section class="section-tight"><div class="container">
        <div class="toolbar"><div class="toolbar-left"><div class="search-field">${icon("search",18)}<input id="course-search" type="search" value="${escapeHtml(state.courseFilters.query)}" placeholder="Search courses" aria-label="Search the course catalogue" /></div><button class="btn btn-outline" id="filter-toggle">${icon("filter",17)} Filters</button></div><div class="toolbar-right"><select class="select" id="course-sort" aria-label="Sort courses"><option value="popular">Most popular</option><option value="rating">Highest rated</option><option value="newest">Newest</option><option value="shortest">Shortest duration</option></select></div></div>
        <div class="explore-layout">
          <aside class="filter-panel" id="filter-panel"><div class="filter-group"><h3>Category</h3><label class="check-row"><input type="radio" name="category" value="all" ${state.courseFilters.category === "all" ? "checked" : ""} /> All categories</label>${DATA.categories.map((category) => `<label class="check-row"><input type="radio" name="category" value="${category.id}" ${state.courseFilters.category === category.id ? "checked" : ""} /> ${category.name}</label>`).join("")}</div><div class="filter-group"><h3>Skill level</h3>${["all","Beginner","Intermediate","Advanced","All Levels"].map((level) => `<label class="check-row"><input type="radio" name="level" value="${level}" ${state.courseFilters.level === level ? "checked" : ""} /> ${level === "all" ? "All levels" : level}</label>`).join("")}</div><div class="filter-group"><label class="check-row"><input id="certificate-filter" type="checkbox" ${state.courseFilters.certificate ? "checked" : ""} /> Certificate available</label></div><button class="btn btn-soft btn-block" id="clear-filters">Clear all filters</button></aside>
          <div><p class="result-summary" id="result-summary"></p><div class="course-grid" id="course-results"></div></div>
        </div>
      </div></section></div>`;

    const search = document.getElementById("course-search");
    const sort = document.getElementById("course-sort");
    sort.value = state.courseFilters.sort;
    const refresh = () => {
      const query = state.courseFilters.query.trim().toLowerCase();
      let courses = DATA.courses.filter((course) => {
        const searchText = `${course.title} ${course.short} ${course.category} ${course.tags.join(" ")}`.toLowerCase();
        return (!query || searchText.includes(query)) &&
          (state.courseFilters.category === "all" || course.categoryId === state.courseFilters.category) &&
          (state.courseFilters.level === "all" || course.level === state.courseFilters.level) &&
          (!state.courseFilters.certificate || course.certificate);
      });
      courses = [...courses].sort((a, b) => {
        if (state.courseFilters.sort === "rating") return b.rating - a.rating;
        if (state.courseFilters.sort === "newest") return b.updated.localeCompare(a.updated);
        if (state.courseFilters.sort === "shortest") return Number.parseInt(a.duration) - Number.parseInt(b.duration);
        return b.learners - a.learners;
      });
      document.getElementById("result-summary").textContent = `${courses.length} ${courses.length === 1 ? "course" : "courses"} found`;
      const results = document.getElementById("course-results");
      results.innerHTML = courses.length ? courses.map((course) => courseCard(course, { showDescription: true })).join("") : `<div class="empty-state" style="grid-column:1/-1"><span class="icon-box">${icon("search",22)}</span><h3>No courses found</h3><p>Try changing the search text or removing one of the selected filters.</p><button class="btn btn-primary" id="empty-clear">Clear filters</button></div>`;
      attachCourseCardEvents(results);
      document.getElementById("empty-clear")?.addEventListener("click", clearFilters);
    };
    const clearFilters = () => {
      state.courseFilters = { query: "", category: "all", level: "all", certificate: false, sort: "popular" };
      renderCourses(new URLSearchParams());
    };
    search.addEventListener("input", () => { state.courseFilters.query = search.value; refresh(); });
    sort.addEventListener("change", () => { state.courseFilters.sort = sort.value; refresh(); });
    app.querySelectorAll('input[name="category"]').forEach((input) => input.addEventListener("change", () => { state.courseFilters.category = input.value; refresh(); }));
    app.querySelectorAll('input[name="level"]').forEach((input) => input.addEventListener("change", () => { state.courseFilters.level = input.value; refresh(); }));
    document.getElementById("certificate-filter").addEventListener("change", (event) => { state.courseFilters.certificate = event.target.checked; refresh(); });
    document.getElementById("clear-filters").addEventListener("click", clearFilters);
    document.getElementById("filter-toggle").addEventListener("click", () => document.getElementById("filter-panel").classList.toggle("open"));
    refresh();
  }

  function renderCourse(slug) {
    const course = courseBySlug(slug);
    if (!course) return renderNotFound();
    const instructor = instructorById(course.instructorId);
    const enrolled = Boolean(enrollment(slug));
    const progress = courseProgress(slug);
    app.innerHTML = `<div class="page-shell">
      <section class="course-hero"><div class="container course-hero-grid"><div><div class="breadcrumbs"><a href="#/courses">Courses</a><span>/</span><a href="#/courses?category=${course.categoryId}">${escapeHtml(course.category)}</a></div><h1>${escapeHtml(course.title)}</h1><p class="lead">${escapeHtml(course.short)}</p><div class="course-hero-meta"><span>${icon("star",16,"star")} ${course.rating} rating</span><span>${icon("users",16)} ${course.learners.toLocaleString()} learners</span><span>${icon("clock",16)} ${course.duration}</span><span>${icon("monitor",16)} ${course.level}</span><span>Updated ${course.updated}</span></div></div><div class="course-preview-art" style="--course-accent:${course.accent}"><span class="course-art-icon">${icon(course.icon,44)}</span></div></div></section>
      <section class="section-tight"><div class="container course-content-grid"><div>
        <article class="content-card"><h2>What you will learn</h2><div class="outcome-grid">${course.outcomes.map((item) => `<div class="check-item">${icon("checkCircle",18)}<span>${escapeHtml(item)}</span></div>`).join("")}</div></article>
        <article class="content-card"><h2>About this course</h2><p class="muted">${escapeHtml(course.description)}</p></article>
        <article class="content-card"><div class="card-title-row"><h2>Course curriculum</h2><span class="muted small">${course.lessonsCount} lessons · ${course.duration}</span></div><div class="curriculum"><details class="module" open><summary><span>Module 1: Foundations</span><span>${course.lessons.length} lessons</span></summary>${course.lessons.map((lesson) => `<div class="lesson-row"><a class="lesson-name" href="#/lesson/${course.slug}/${lesson.id}">${icon(lesson.type === "Quiz" ? "checkCircle" : lesson.type === "Reading" ? "book" : "play",16)}<span>${escapeHtml(lesson.title)}</span></a><span class="lesson-meta">${lesson.preview ? '<span class="preview-pill">Preview</span>' : ""}<span>${lesson.duration}</span></span></div>`).join("")}</details></div></article>
        <article class="content-card"><h2>Requirements</h2><ul>${course.requirements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><h2 style="margin-top:28px">Who this course is for</h2><ul>${course.audience.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>
        <article class="content-card"><h2>Meet your instructor</h2><div class="person-row"><span class="instructor-avatar" style="--instructor-accent:${instructor.accent};width:74px;height:74px;margin:0;border-radius:19px">${instructor.initials}</span><span><strong style="font-size:1rem">${escapeHtml(instructor.name)}</strong><span>${escapeHtml(instructor.title)}</span><a class="text-link" style="margin-top:6px" href="#/instructor/${instructor.id}">View instructor profile ${icon("arrow",14)}</a></span></div></article>
      </div><aside class="enrollment-card"><div class="price">Free</div><p class="muted small">Full access to all lessons and learning materials.</p>${progress > 0 ? `<div class="progress-wrap"><div class="progress-label"><span>Your progress</span><span>${progress}%</span></div><div class="progress-bar"><span style="width:${progress}%"></span></div></div>` : ""}<button class="btn btn-primary btn-block" id="enroll-button" style="margin-top:16px">${enrolled ? "Continue Learning" : "Enroll Now"}</button><button class="btn btn-outline btn-block" data-save-course="${course.slug}" style="margin-top:9px">${icon("heart",17)} ${state.saved.includes(course.slug) ? "Saved" : "Save Course"}</button><div class="includes-list"><strong>This course includes</strong><span>${icon("play",16)} Video and reading lessons</span><span>${icon("download",16)} Downloadable resources</span><span>${icon("checkCircle",16)} Quizzes and practical tasks</span>${course.certificate ? `<span>${icon("award",16)} Certificate of completion</span>` : ""}<span>${icon("clock",16)} Learn at your own pace</span></div></aside></div></section>
      <section class="section section-soft"><div class="container"><div class="section-heading"><div><span class="eyebrow">Continue exploring</span><h2>Related courses</h2></div></div><div class="course-grid">${DATA.courses.filter((item) => item.slug !== slug).slice(0,3).map(courseCard).join("")}</div></div></section>
    </div>`;
    document.getElementById("enroll-button").addEventListener("click", () => enroll(slug));
    attachCourseCardEvents(app);
  }

  function renderLesson(slug, lessonId) {
    const course = courseBySlug(slug);
    if (!course) return renderNotFound();
    const lessonIndex = Math.max(0, course.lessons.findIndex((item) => item.id === lessonId));
    const lesson = course.lessons[lessonIndex] || course.lessons[0];
    if (!state.enrollments[slug] && !lesson.preview) {
      showModal("Enroll to continue", `<p class="muted">This lesson is part of the full free course. Enroll once to save progress and unlock every lesson.</p>`, `<button class="btn btn-primary" id="modal-enroll">Enroll free</button><a class="btn btn-outline" href="#/course/${slug}">Course details</a>`);
      document.getElementById("modal-enroll")?.addEventListener("click", () => { modalRoot.innerHTML = ""; enroll(slug); });
    }
    const completed = completedLessons(slug);
    const previous = course.lessons[lessonIndex - 1];
    const next = course.lessons[lessonIndex + 1];
    const isQuiz = lesson.type === "Quiz";
    app.innerHTML = `<div class="lesson-layout">
      <aside class="lesson-sidebar"><a class="text-link" style="color:#86efac;margin-bottom:18px" href="#/course/${slug}">${icon("arrowLeft",16)} Back to course</a><h2>${escapeHtml(course.title)}</h2><div class="progress-label"><span>Course progress</span><span>${courseProgress(slug)}%</span></div><div class="progress-bar"><span style="width:${courseProgress(slug)}%"></span></div><div class="sidebar-lessons">${course.lessons.map((item, index) => `<a class="sidebar-lesson ${item.id === lesson.id ? "current" : ""} ${completed.includes(item.id) ? "complete" : ""}" href="#/lesson/${slug}/${item.id}"><span class="lesson-status">${completed.includes(item.id) ? icon("check",13) : index + 1}</span><span>${escapeHtml(item.title)}<small style="display:block;color:#64748b">${item.type} · ${item.duration}</small></span></a>`).join("")}</div></aside>
      <section class="lesson-main"><div class="video-stage"><div class="video-stage-inner"><span class="play-circle">${icon(isQuiz ? "checkCircle" : "play",30)}</span><h1>${escapeHtml(lesson.title)}</h1><p>${isQuiz ? "Complete the knowledge check below." : "Demonstration lesson player — connect your own video host before launch."}</p></div></div><div class="lesson-content"><div class="lesson-tabs" role="tablist">${["Overview","Notes","Resources","Discussion","Transcript"].map((tab, index) => `<button class="lesson-tab ${index === 0 ? "active" : ""}" data-tab="${tab.toLowerCase()}">${tab}</button>`).join("")}</div><div id="lesson-tab-content"></div><div class="lesson-nav">${previous ? `<a class="btn btn-outline" href="#/lesson/${slug}/${previous.id}">${icon("arrowLeft",17)} Previous</a>` : `<span></span>`}<div class="actions">${!completed.includes(lesson.id) ? `<button class="btn btn-primary" id="complete-lesson">Mark as Complete</button>` : `<span class="btn btn-soft">${icon("checkCircle",17)} Completed</span>`}${next ? `<a class="btn btn-dark" href="#/lesson/${slug}/${next.id}">Next ${icon("arrow",17)}</a>` : `<a class="btn btn-dark" href="#/certificates">View certificate ${icon("award",17)}</a>`}</div></div></div></section>
    </div>`;

    const panels = {
      overview: isQuiz ? quizContent(slug) : `<div class="tab-panel"><span class="eyebrow">Lesson overview</span><h2>Build understanding through practice</h2><p class="muted">This lesson introduces the central idea, shows how it works, and gives you a short task to test your understanding.</p><div class="content-card" style="margin-top:22px"><h2>Learning objective</h2><div class="check-item">${icon("checkCircle",18)}<span>Explain the lesson concept clearly and apply it in a realistic situation.</span></div></div><h2>Example</h2><div class="code-block"><button class="btn btn-sm code-copy" data-copy-code>${icon("copy",14)} Copy</button><code>// EcoLearn practical example\nconst learner = { name: "Student", progress: 75 };\nconsole.log(learner.name + ": " + learner.progress + "% complete");</code></div></div>`,
      notes: `<div class="tab-panel"><h2>Lesson notes</h2><p class="muted">Focus on the definition, the process, and the reason the concept matters. Write one example in your own words before moving to the next lesson.</p><ul><li>Identify the main problem.</li><li>Break the process into clear steps.</li><li>Test the result using a realistic example.</li><li>Review mistakes and correct the reasoning.</li></ul></div>`,
      resources: `<div class="tab-panel"><h2>Learning resources</h2><div class="list-row"><span><strong>Lesson summary</strong><span>Printable text resource</span></span><button class="btn btn-outline btn-sm" id="download-summary">${icon("download",15)} Download</button></div><div class="list-row"><span><strong>Practice worksheet</strong><span>Questions for independent practice</span></span><button class="btn btn-outline btn-sm" id="download-worksheet">${icon("download",15)} Download</button></div></div>`,
      discussion: `<div class="tab-panel"><h2>Course discussion</h2><p class="muted">Discussion storage requires a connected database. The form below demonstrates the intended interface.</p><form class="form-grid" id="discussion-form"><div class="field"><label for="discussion-message">Your contribution</label><textarea id="discussion-message" required placeholder="Ask a useful question or share what you learned."></textarea></div><button class="btn btn-primary" type="submit">Post discussion</button></form></div>`,
      transcript: `<div class="tab-panel"><h2>Lesson transcript</h2><p class="muted">Welcome to this EcoLearn lesson. We will begin with the core idea, break it into manageable steps, examine a realistic example, and finish with a practical task. Captions and full transcripts should be added to every production video.</p></div>`
    };

    const tabContent = document.getElementById("lesson-tab-content");
    const showPanel = (name) => {
      tabContent.innerHTML = panels[name];
      document.querySelectorAll(".lesson-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === name));
      document.querySelector("[data-copy-code]")?.addEventListener("click", async () => {
        await navigator.clipboard?.writeText('const learner = { name: "Student", progress: 75 };');
        showToast("Code copied", "The example was copied to your clipboard.");
      });
      document.getElementById("download-summary")?.addEventListener("click", () => downloadText(`${course.title} — ${lesson.title}\n\nLesson summary\nReview the core concept, process, example, and practice task.`, "ecolearn-lesson-summary.txt"));
      document.getElementById("download-worksheet")?.addEventListener("click", () => downloadText(`EcoLearn Practice Worksheet\nCourse: ${course.title}\nLesson: ${lesson.title}\n\n1. Explain the main concept in your own words.\n2. Give one real-world example.\n3. Identify one common mistake.\n4. Apply the idea to a new situation.`, "ecolearn-practice-worksheet.txt"));
      document.getElementById("discussion-form")?.addEventListener("submit", (event) => { event.preventDefault(); showToast("Discussion saved locally", "Connect a database to publish discussions to other learners."); event.currentTarget.reset(); });
      setupQuiz(slug, lesson.id);
    };
    document.querySelectorAll(".lesson-tab").forEach((tab) => tab.addEventListener("click", () => showPanel(tab.dataset.tab)));
    showPanel("overview");
    document.getElementById("complete-lesson")?.addEventListener("click", () => {
      if (!ensureUser()) return;
      markLessonComplete(slug, lesson.id);
      renderLesson(slug, lesson.id);
    });
  }

  function quizContent() {
    return `<div class="tab-panel"><div class="quiz-box"><span class="eyebrow">Question 1 of 1</span><h2>Which action best supports effective learning?</h2><form id="quiz-form"><label class="quiz-option"><input type="radio" name="answer" value="a" required /><span>Memorize every sentence without practice</span></label><label class="quiz-option"><input type="radio" name="answer" value="b" /><span>Study the concept, practise it, and review mistakes</span></label><label class="quiz-option"><input type="radio" name="answer" value="c" /><span>Skip difficult examples and continue immediately</span></label><label class="quiz-option"><input type="radio" name="answer" value="d" /><span>Read only the course title</span></label><button class="btn btn-primary" type="submit" style="margin-top:12px">Submit answer</button><div id="quiz-feedback"></div></form></div></div>`;
  }

  function setupQuiz(slug, lessonId) {
    document.getElementById("quiz-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const answer = new FormData(event.currentTarget).get("answer");
      const feedback = document.getElementById("quiz-feedback");
      const correct = answer === "b";
      feedback.innerHTML = `<div class="quiz-feedback ${correct ? "correct" : "wrong"}"><strong>${correct ? "Correct" : "Not correct yet"}</strong><p>${correct ? "Effective learning combines understanding, practice, and reflection on mistakes." : "Review the lesson process and try again. The strongest answer includes active practice and correction."}</p></div>`;
      if (correct && state.user) {
        markLessonComplete(slug, lessonId);
      }
    });
  }

  function renderCategories() {
    app.innerHTML = `<div class="page-shell">${pageHero("Learning areas", "Choose a category", "Explore organized learning areas across technology, programming, business, and career development.")}<section class="section-tight"><div class="container"><div class="category-grid">${DATA.categories.map(categoryCard).join("")}</div></div></section><section class="section section-soft"><div class="container"><div class="cta-panel"><div><h2>Not sure where to begin?</h2><p>Start with Computer Fundamentals for technology, HTML and CSS for web development, or Entrepreneurship Fundamentals for business.</p></div><a class="btn" href="#/courses">Browse all courses</a></div></div></section></div>`;
  }

  function renderInstructors() {
    app.innerHTML = `<div class="page-shell">${pageHero("EcoLearn instructors", "Learn from clear, practical teachers", "Explore instructor profiles, areas of expertise, and available courses.")}<section class="section-tight"><div class="container"><div class="instructor-grid">${DATA.instructors.map(instructorCard).join("")}</div></div></section><section class="section section-green"><div class="container"><div class="cta-panel"><div><h2>Share what you know.</h2><p>Apply to teach practical, accurate, and accessible courses on EcoLearn.</p></div><a class="btn" href="#/teacher-application">Apply as an instructor</a></div></div></section></div>`;
  }

  function renderInstructor(id) {
    const instructor = instructorById(id);
    if (!instructor) return renderNotFound();
    const courses = DATA.courses.filter((course) => course.instructorId === id);
    app.innerHTML = `<div class="page-shell"><section class="profile-hero"><div class="container profile-header"><div class="profile-avatar" style="--instructor-accent:${instructor.accent}">${instructor.initials}</div><div class="profile-copy"><span class="eyebrow">${escapeHtml(instructor.expertise)}</span><h1>${escapeHtml(instructor.name)}</h1><p>${escapeHtml(instructor.title)}</p><div class="profile-stats"><span><strong>${instructor.rating}</strong><span>Instructor rating</span></span><span><strong>${instructor.learners.toLocaleString()}</strong><span>Learners</span></span><span><strong>${instructor.courses}</strong><span>Courses</span></span></div></div><a class="btn btn-primary" href="#/courses">View courses</a></div></section><section class="section-tight"><div class="container"><div class="content-card"><h2>About the instructor</h2><p class="muted">${escapeHtml(instructor.bio)}</p><div class="tag-list">${instructor.skills.map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join("")}</div></div><div class="section-heading"><div><h2>Courses by ${escapeHtml(firstName(instructor.name))}</h2></div></div><div class="course-grid">${courses.map(courseCard).join("")}</div></div></section></div>`;
    attachCourseCardEvents(app);
  }

  function renderDashboard() {
    if (!state.user) return renderAuthRequired("dashboard");
    const enrolledCourses = Object.keys(state.enrollments).map(courseBySlug).filter(Boolean);
    const completedCount = enrolledCourses.filter((course) => courseProgress(course.slug) === 100).length;
    const totalCompletedLessons = Object.values(state.enrollments).reduce((sum, item) => sum + item.completedLessons.length, 0);
    const continueCourse = enrolledCourses[0] || DATA.courses[0];
    app.innerHTML = `<div class="dashboard-wrap"><div class="container"><div class="dashboard-header"><div><span class="demo-badge">${icon("info",14)} Browser-storage demo</span><h1>Welcome, ${escapeHtml(firstName(state.user.name))}</h1><p class="muted">Continue learning and review your progress.</p></div><div class="actions"><a class="btn btn-outline" href="#/courses">Explore courses</a><button class="btn btn-danger" id="logout-button">${icon("logout",17)} Log out</button></div></div><div class="stats-grid">${[["book",enrolledCourses.length,"Courses in progress"],["checkCircle",completedCount,"Courses completed"],["clock",`${totalCompletedLessons * 18} min`,"Learning time"],["award",state.certificates.length,"Certificates earned"]].map(([i,n,l]) => `<article class="stat-card"><span class="icon-box">${icon(i,20)}</span><strong>${n}</strong><span>${l}</span></article>`).join("")}</div><div class="dashboard-grid"><div><article class="dashboard-card"><div class="card-title-row"><h2>Continue learning</h2><a class="text-link" href="#/my-learning">View all</a></div>${enrolledCourses.length ? `<div class="continue-card"><div class="continue-art" style="--course-accent:${continueCourse.accent}">${icon(continueCourse.icon,32)}</div><div><strong>${escapeHtml(continueCourse.title)}</strong><p class="muted small">${courseProgress(continueCourse.slug)}% complete</p><div class="progress-bar"><span style="width:${courseProgress(continueCourse.slug)}%"></span></div><a class="btn btn-primary btn-sm" style="margin-top:12px" href="#/lesson/${continueCourse.slug}/${continueCourse.lessons.find((lesson) => !completedLessons(continueCourse.slug).includes(lesson.id))?.id || continueCourse.lessons[0].id}">Continue course</a></div></div>` : `<div class="empty-state"><span class="icon-box">${icon("book",22)}</span><h3>No active courses</h3><p>Enroll in a free course to start tracking progress.</p><a class="btn btn-primary" href="#/courses">Find a course</a></div>`}</article><article class="dashboard-card" style="margin-top:22px"><div class="card-title-row"><h2>Weekly learning activity</h2><span class="muted small">Demo chart</span></div><div class="activity-bars">${[25,45,18,72,58,85,36].map((height,index) => `<div class="activity-day"><div class="activity-bar" style="height:${height}%"></div><span>${["M","T","W","T","F","S","S"][index]}</span></div>`).join("")}</div></article></div><aside><article class="dashboard-card"><div class="card-title-row"><h2>Recent progress</h2></div>${enrolledCourses.length ? enrolledCourses.slice(0,4).map((course) => `<div class="list-row"><span><strong>${escapeHtml(course.title)}</strong><span>${courseProgress(course.slug)}% complete</span></span><span>${courseProgress(course.slug)}%</span></div>`).join("") : `<p class="muted small">Your course activity will appear here.</p>`}</article><article class="dashboard-card" style="margin-top:22px"><div class="card-title-row"><h2>Recommended next</h2></div>${DATA.courses.slice(0,3).map((course) => `<div class="list-row"><a href="#/course/${course.slug}"><strong>${escapeHtml(course.title)}</strong><span>${escapeHtml(course.level)} · ${escapeHtml(course.duration)}</span></a>${icon("arrow",16)}</div>`).join("")}</article></aside></div></div></div>`;
    document.getElementById("logout-button")?.addEventListener("click", logout);
  }

  function renderMyLearning() {
    if (!state.user) return renderAuthRequired("my-learning");
    const enrolled = Object.keys(state.enrollments).map(courseBySlug).filter(Boolean);
    app.innerHTML = `<div class="page-shell">${pageHero("Student learning", "My Learning", "Continue active courses, review completed work, and access earned certificates.", true)}<section class="section-tight"><div class="container">${enrolled.length ? `<div class="course-grid">${enrolled.map((course) => courseCard(course, { showDescription: true })).join("")}</div>` : `<div class="empty-state"><span class="icon-box">${icon("play",22)}</span><h3>No enrolled courses yet</h3><p>Explore the free catalogue and enroll in a course to begin.</p><a class="btn btn-primary" href="#/courses">Explore courses</a></div>`}</div></section></div>`;
    attachCourseCardEvents(app);
  }

  function renderSaved() {
    const courses = state.saved.map(courseBySlug).filter(Boolean);
    app.innerHTML = `<div class="page-shell">${pageHero("Your shortlist", "Saved Courses", "Keep useful courses here and return when you are ready to enroll.", true)}<section class="section-tight"><div class="container">${courses.length ? `<div class="course-grid">${courses.map((course) => courseCard(course, { showDescription: true })).join("")}</div>` : `<div class="empty-state"><span class="icon-box">${icon("heart",22)}</span><h3>No saved courses</h3><p>Use the heart button on any course card to save it here.</p><a class="btn btn-primary" href="#/courses">Explore courses</a></div>`}</div></section></div>`;
    attachCourseCardEvents(app);
  }

  function renderCertificates() {
    if (!state.user) return renderAuthRequired("certificates");
    app.innerHTML = `<div class="page-shell">${pageHero("Verified completion", "Your Certificates", "Certificates are created when every lesson in an eligible course is completed.", true)}<section class="section-tight"><div class="container">${state.certificates.length ? `<div class="certificate-grid">${state.certificates.map(certificateMarkup).join("")}</div>` : `<div class="empty-state"><span class="icon-box">${icon("award",22)}</span><h3>No certificates yet</h3><p>Complete every lesson in an eligible course to earn a certificate.</p><a class="btn btn-primary" href="#/my-learning">Continue learning</a></div>`}</div></section></div>`;
    app.querySelectorAll("[data-download-certificate]").forEach((button) => button.addEventListener("click", () => {
      const certificate = state.certificates.find((item) => item.id === button.dataset.downloadCertificate);
      const course = courseBySlug(certificate.slug);
      downloadText(`ECOLEARN CERTIFICATE OF COMPLETION\n\nThis certifies that ${state.user.name} completed ${course.title}.\nCertificate ID: ${certificate.id}\nIssued: ${new Date(certificate.issuedAt).toLocaleDateString()}\n\nVerify this certificate on the EcoLearn certificate verification page.`, `${certificate.id}.txt`);
    }));
  }

  function certificateMarkup(certificate) {
    const course = courseBySlug(certificate.slug);
    const instructor = instructorById(course.instructorId);
    return `<article><div class="certificate"><span class="brand" style="justify-content:center"><span class="brand-mark">${icon("book",20)}</span><span>EcoLearn</span></span><h2>Certificate of Completion</h2><p>This certifies that</p><h3>${escapeHtml(state.user.name)}</h3><p>successfully completed</p><h3>${escapeHtml(course.title)}</h3><p>Instructor: ${escapeHtml(instructor.name)} · ${new Date(certificate.issuedAt).toLocaleDateString()}</p><div class="certificate-id">${certificate.id}</div></div><div class="actions" style="margin-top:14px"><button class="btn btn-primary btn-sm" data-download-certificate="${certificate.id}">${icon("download",15)} Download record</button><a class="btn btn-outline btn-sm" href="#/certificate-verify?id=${certificate.id}">Verify</a></div></article>`;
  }

  function renderCertificateVerify(params) {
    const requested = params.get("id") || "";
    app.innerHTML = `<div class="page-shell">${pageHero("Certificate verification", "Verify an EcoLearn certificate", "Enter the certificate ID exactly as it appears on the completion record.", true)}<section class="section-tight"><div class="container" style="max-width:720px"><div class="content-card"><form class="form-grid" id="verify-form"><div class="field"><label for="certificate-id">Certificate ID</label><input id="certificate-id" name="id" value="${escapeHtml(requested)}" placeholder="ECO-2026-ABC123" required /></div><button class="btn btn-primary" type="submit">Verify certificate</button></form><div id="verification-result" style="margin-top:20px"></div></div></div></section></div>`;
    const verify = () => {
      const id = document.getElementById("certificate-id").value.trim().toUpperCase();
      const cert = state.certificates.find((item) => item.id === id);
      const result = document.getElementById("verification-result");
      if (cert && state.user) {
        const course = courseBySlug(cert.slug);
        result.innerHTML = `<div class="quiz-feedback correct"><strong>${icon("checkCircle",18)} Valid local certificate</strong><p>${escapeHtml(state.user.name)} completed ${escapeHtml(course.title)} on ${new Date(cert.issuedAt).toLocaleDateString()}.</p></div>`;
      } else {
        result.innerHTML = `<div class="quiz-feedback wrong"><strong>Certificate not found</strong><p>This static demonstration can verify only certificates created in this browser. Connect a database for public verification across devices.</p></div>`;
      }
    };
    document.getElementById("verify-form").addEventListener("submit", (event) => { event.preventDefault(); verify(); });
    if (requested) verify();
  }

  function renderAuthRequired(destination) {
    app.innerHTML = `<div class="page-shell">${pageHero("Account required", "Sign in to continue", "This section stores personal learning progress and requires an EcoLearn account.", true)}<section class="section-tight"><div class="container"><div class="empty-state"><span class="icon-box">${icon("lock",22)}</span><h3>Your learning data is protected</h3><p>Create a free demo account or sign in to open this page.</p><div class="actions" style="justify-content:center"><a class="btn btn-primary" href="#/signup?next=${destination}">Create account</a><a class="btn btn-outline" href="#/login?next=${destination}">Sign in</a></div></div></div></section></div>`;
  }

  function renderLogin(params) {
    renderAuthPage("Welcome back", "Sign in to continue your courses and learning progress.", "login");
    document.getElementById("auth-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(event.currentTarget));
      state.user = { ...DEFAULT_USER, name: values.email.split("@")[0].replace(/[._-]/g," ").replace(/\b\w/g,(c)=>c.toUpperCase()), email: values.email };
      persist();
      showToast("Signed in", "Your EcoLearn dashboard is ready.");
      navigate(params.get("next") || "dashboard");
    });
  }

  function renderSignup(params) {
    renderAuthPage("Create your free account", "Save courses, track progress, and earn completion certificates.", "signup");
    document.getElementById("auth-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(event.currentTarget));
      state.user = { name: values.name, email: values.email, role: "student", interests: values.interests ? [values.interests] : [] };
      persist();
      showToast("Account created", "Welcome to EcoLearn. Your data is stored in this browser for the demo.");
      navigate(params.get("next") || "dashboard");
    });
  }

  function renderAuthPage(title, text, mode) {
    const signup = mode === "signup";
    app.innerHTML = `<div class="auth-page"><section class="auth-visual"><div class="auth-message"><span class="eyebrow" style="color:#bbf7d0">Learn without barriers</span><h1>Knowledge that moves you forward.</h1><p>Join a practical learning platform designed for students, professionals, teachers, and entrepreneurs.</p></div></section><section class="auth-form-wrap"><div class="auth-card"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p><form class="form-grid" id="auth-form">${signup ? `<div class="field"><label for="auth-name">Full name</label><input id="auth-name" name="name" autocomplete="name" required /></div>` : ""}<div class="field"><label for="auth-email">Email address</label><input id="auth-email" name="email" type="email" autocomplete="email" required /></div><div class="field"><label for="auth-password">Password</label><input id="auth-password" name="password" type="password" minlength="6" autocomplete="${signup ? "new-password" : "current-password"}" required /></div>${signup ? `<div class="field"><label for="auth-interests">Main learning interest</label><select id="auth-interests" name="interests"><option>Information Technology</option><option>Programming</option><option>Business</option><option>Digital Marketing</option><option>Career Skills</option></select></div>` : `<div style="text-align:right"><a class="text-link small" href="#/forgot-password">Forgot password?</a></div>`}<button class="btn btn-primary btn-block" type="submit">${signup ? "Create Free Account" : "Sign In"}</button><p class="form-note">Demo mode: authentication is stored only in your current browser. Connect Supabase or another auth service before public launch.</p></form><div class="divider">or</div><button class="btn btn-outline btn-block" id="google-demo">Continue with Google (demo)</button><p class="center small muted" style="margin-top:20px">${signup ? "Already have an account?" : "New to EcoLearn?"} <a class="text-link" href="#/${signup ? "login" : "signup"}">${signup ? "Sign in" : "Create account"}</a></p></div></section></div>`;
    document.getElementById("google-demo")?.addEventListener("click", () => showToast("Google sign-in not connected", "Add a real OAuth provider before launching authentication.", "info"));
  }

  function renderForgotPassword() {
    app.innerHTML = `<div class="auth-page"><section class="auth-visual"><div class="auth-message"><span class="eyebrow" style="color:#bbf7d0">Account recovery</span><h1>Return to your learning.</h1><p>Enter your email to request a secure password reset link.</p></div></section><section class="auth-form-wrap"><div class="auth-card"><h2>Reset your password</h2><p>We will show the intended success flow in this static demonstration.</p><form class="form-grid" id="reset-form"><div class="field"><label for="reset-email">Email address</label><input id="reset-email" type="email" required /></div><button class="btn btn-primary" type="submit">Send reset link</button></form><p class="center small" style="margin-top:18px"><a class="text-link" href="#/login">Return to login</a></p></div></section></div>`;
    document.getElementById("reset-form").addEventListener("submit", (event) => { event.preventDefault(); showToast("Reset request accepted", "Connect an email service to send real reset links."); event.currentTarget.reset(); });
  }

  function renderTeacherApplication() {
    app.innerHTML = `<div class="page-shell">${pageHero("Teach on EcoLearn", "Share practical knowledge with learners", "Apply to create clear, accurate, accessible courses in technology, business, and career development.")}<section class="section-tight"><div class="container" style="max-width:850px"><div class="content-card"><form class="form-grid" id="teacher-form"><div class="form-row"><div class="field"><label for="teacher-name">Full name</label><input id="teacher-name" name="name" required /></div><div class="field"><label for="teacher-email">Email</label><input id="teacher-email" type="email" name="email" required /></div></div><div class="form-row"><div class="field"><label for="teacher-title">Professional title</label><input id="teacher-title" name="title" required /></div><div class="field"><label for="teacher-expertise">Area of expertise</label><select id="teacher-expertise" name="expertise">${DATA.categories.map((category) => `<option>${category.name}</option>`).join("")}</select></div></div><div class="field"><label for="teacher-bio">Short professional biography</label><textarea id="teacher-bio" name="bio" required></textarea></div><div class="field"><label for="teacher-experience">Teaching or mentoring experience</label><textarea id="teacher-experience" name="experience" required></textarea></div><div class="field"><label for="teacher-portfolio">Portfolio or professional profile URL</label><input id="teacher-portfolio" name="portfolio" type="url" placeholder="https://" /></div><div class="field"><label for="teacher-reason">Why do you want to teach on EcoLearn?</label><textarea id="teacher-reason" name="reason" required></textarea></div><label class="check-row"><input type="checkbox" required /> I confirm that the information is accurate and that course content will be original or properly licensed.</label><button class="btn btn-primary" type="submit">Submit application</button></form></div></div></section></div>`;
    document.getElementById("teacher-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const application = { ...Object.fromEntries(new FormData(event.currentTarget)), submittedAt: new Date().toISOString(), status: "Review" };
      const apps = store.get(STORAGE.applications, []);
      apps.push(application);
      store.set(STORAGE.applications, apps);
      event.currentTarget.reset();
      showToast("Application submitted", "Your demonstration application was stored in this browser.");
    });
  }

  function renderAbout() {
    app.innerHTML = `<div class="page-shell">${pageHero("About EcoLearn", "Free knowledge. Practical progress.", "EcoLearn is designed to make useful education easier to access, understand, and apply.")}<section class="section-tight"><div class="container content-layout"><aside class="side-nav"><a href="#mission">Our mission</a><a href="#principles">Learning principles</a><a href="#quality">Course quality</a><a href="#access">Access and inclusion</a></aside><article class="prose"><h2 id="mission">Our mission</h2><p>EcoLearn exists to help students, professionals, teachers, entrepreneurs, and beginners build practical skills without unnecessary barriers. The platform focuses on clear explanations, structured practice, and useful outcomes.</p><h2 id="principles">Learning principles</h2><p>Courses should move from understanding to guided practice and then independent application. Progress is more valuable than passive content consumption, so every course should include exercises, reflection, and assessment.</p><h2 id="quality">Course quality</h2><p>Instructors should provide accurate, original, accessible material. Every course should state its audience, requirements, learning outcomes, lesson structure, and certificate conditions clearly. Administrator review is required before publication in a production platform.</p><h2 id="access">Access and inclusion</h2><p>EcoLearn is designed for phones, tablets, and computers. Interfaces use readable typography, keyboard access, visible focus states, semantic structure, transcripts, and reduced-motion support. Production videos should include captions and optimized versions for slower connections.</p></article></div></section></div>`;
  }

  function renderContact() {
    app.innerHTML = `<div class="page-shell">${pageHero("Contact EcoLearn", "How can we help?", "Send a message about courses, instructor applications, access problems, or general platform questions.")}<section class="section-tight"><div class="container contact-grid"><div class="contact-cards"><article class="contact-card"><span class="icon-box">${icon("mail",20)}</span><h3>Email support</h3><p>support@ecolearn.example</p></article><article class="contact-card"><span class="icon-box">${icon("clock",20)}</span><h3>Response target</h3><p>Within two working days after a real support service is connected.</p></article><article class="contact-card"><span class="icon-box">${icon("map",20)}</span><h3>Online learning</h3><p>EcoLearn is designed for global access from phones and computers.</p></article></div><div class="content-card"><form class="form-grid" id="contact-form"><div class="form-row"><div class="field"><label for="contact-name">Full name</label><input id="contact-name" name="name" required /></div><div class="field"><label for="contact-email">Email</label><input id="contact-email" name="email" type="email" required /></div></div><div class="field"><label for="contact-topic">Topic</label><select id="contact-topic" name="topic"><option>Course question</option><option>Technical support</option><option>Instructor application</option><option>Partnership</option><option>Other</option></select></div><div class="field"><label for="contact-message">Message</label><textarea id="contact-message" name="message" required></textarea></div><button class="btn btn-primary" type="submit">Send message</button></form></div></div></section></div>`;
    document.getElementById("contact-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(event.currentTarget));
      const result = await submitForm("contact", values);
      event.currentTarget.reset();
      showToast(result.ok ? "Message received" : "Saved for demonstration", result.ok ? "The Cloudflare Pages Function accepted your message." : "The form works locally; connect a database or email service to retain submissions.");
    });
  }

  function renderFaq() {
    const items = [
      ["Are EcoLearn courses free?", "The demonstration catalogue is free. A production platform should display any future costs clearly before enrollment."],
      ["Do I need previous experience?", "Most courses are designed for beginners. Each course page lists its level and requirements."],
      ["How is progress saved?", "This downloadable version stores progress in your browser. A production version should connect to a secure database so progress follows the user across devices."],
      ["When do I receive a certificate?", "Eligible courses issue a demonstration certificate after every available lesson is marked complete."],
      ["Can I teach on EcoLearn?", "Use the instructor application page. Production applications should be reviewed by an administrator before instructor access is granted."],
      ["Can I download course materials?", "The lesson player includes downloadable text worksheets. Instructors can later add PDFs and other properly licensed resources."],
      ["Does EcoLearn work on mobile phones?", "Yes. The interface is responsive and includes mobile navigation, flexible course cards, and a mobile-friendly lesson player."],
      ["Is this version connected to a real database?", "No. User accounts, progress, saved courses, and certificates are stored in local browser storage. This makes the site deploy reliably without private keys, but the data is device-specific."]
    ];
    app.innerHTML = `<div class="page-shell">${pageHero("Help centre", "Frequently asked questions", "Clear answers about learning, progress, certificates, instructors, and this demonstration version.")}<section class="section-tight"><div class="container"><div class="faq-list">${items.map(([question,answer]) => `<details class="faq-item"><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("")}</div></div></section></div>`;
  }

  function renderPolicy(type) {
    const privacy = type === "privacy";
    const title = privacy ? "Privacy Policy" : "Terms and Conditions";
    app.innerHTML = `<div class="page-shell">${pageHero("EcoLearn policies", title, `Demonstration ${title.toLowerCase()} for the downloadable EcoLearn website. Replace with legally reviewed text before a public launch.`, true)}<section class="section-tight"><div class="container content-layout"><aside class="side-nav"><a href="#overview">Overview</a><a href="#data">${privacy ? "Information and storage" : "Acceptable use"}</a><a href="#content">Course content</a><a href="#responsibility">Responsibilities</a></aside><article class="prose">${privacy ? `<h2 id="overview">Overview</h2><p>This static version does not operate a central user database. Demo account information, saved courses, enrollments, progress, applications, and certificates are stored in the user’s browser using local storage.</p><h2 id="data">Information and storage</h2><p>Data stored locally remains on the device unless the user clears browser storage. Contact form requests may be handled by a basic Cloudflare Pages Function, but the included function does not persist messages to a database.</p><h2 id="content">External services</h2><p>The website loads the Manrope font from Google Fonts. A production version should document every analytics, authentication, storage, email, and video service it uses.</p><h2 id="responsibility">User controls</h2><p>Users can clear demonstration data by clearing site storage in their browser. Before launch, add account deletion, data export, consent controls, retention periods, and legally reviewed disclosures.</p>` : `<h2 id="overview">Overview</h2><p>By using EcoLearn, users agree to use the platform lawfully, respect other learners and instructors, and avoid disrupting the service.</p><h2 id="data">Acceptable use</h2><p>Users must not upload harmful code, impersonate others, harass participants, attempt unauthorized access, or distribute content they do not have the right to use.</p><h2 id="content">Course content</h2><p>Course descriptions, outcomes, requirements, and certificate conditions should be accurate. Instructors are responsible for original or properly licensed material. EcoLearn should review courses before publication.</p><h2 id="responsibility">Responsibilities</h2><p>Learning content is educational and does not guarantee employment, income, admission, or professional certification. Replace these demonstration terms with jurisdiction-specific legal terms before launching publicly.</p>`}</article></div></section></div>`;
  }

  function renderInstructorDashboard() {
    const courseRows = DATA.courses.slice(0,4);
    app.innerHTML = `<div class="admin-layout"><aside class="admin-sidebar"><h2>Instructor Studio</h2>${[["grid","Overview"],["book","My courses"],["upload","Create course"],["users","Learners"],["message","Reviews"]].map(([i,l],index) => `<a class="${index===0?"active":""}" href="#/instructor-dashboard">${icon(i,17)} ${l}</a>`).join("")}</aside><main class="admin-main"><div class="dashboard-header"><div><span class="demo-badge">Instructor demonstration</span><h1>Instructor Studio</h1><p class="muted">Create and manage structured courses.</p></div><button class="btn btn-primary" id="new-course">${icon("upload",17)} Create a course</button></div><div class="stats-grid">${[["book",4,"Published courses"],["users","4,280","Total learners"],["star","4.9","Average rating"],["message",126,"Course reviews"]].map(([i,n,l]) => `<article class="stat-card"><span class="icon-box">${icon(i,20)}</span><strong>${n}</strong><span>${l}</span></article>`).join("")}</div><section class="dashboard-card" style="margin-top:22px"><div class="card-title-row"><h2>Your courses</h2><button class="btn btn-outline btn-sm">Export report</button></div><div class="table-wrap"><table><thead><tr><th>Course</th><th>Status</th><th>Learners</th><th>Rating</th><th>Updated</th></tr></thead><tbody>${courseRows.map((course,index) => `<tr><td><strong>${escapeHtml(course.title)}</strong></td><td><span class="status-pill ${index===3?"review":"active"}">${index===3?"In review":"Published"}</span></td><td>${course.learners.toLocaleString()}</td><td>${course.rating}</td><td>${course.updated}</td></tr>`).join("")}</tbody></table></div></section></main></div>`;
    document.getElementById("new-course").addEventListener("click", () => showModal("Course creation wizard", `<ol><li>Basic information</li><li>Learning objectives</li><li>Curriculum</li><li>Media and resources</li><li>Assessments</li><li>Certificate settings</li><li>Preview</li><li>Submit for review</li></ol><p class="muted small">Connect a database and file storage service to save real instructor content.</p>`, `<button class="btn btn-primary" data-close-modal>Understood</button>`));
  }

  function renderAdmin() {
    const applications = store.get(STORAGE.applications, []);
    app.innerHTML = `<div class="admin-layout"><aside class="admin-sidebar"><h2>EcoLearn Admin</h2>${[["grid","Overview"],["users","Students"],["award","Instructors"],["book","Courses"],["checkCircle","Approvals"],["settings","Settings"]].map(([i,l],index) => `<a class="${index===0?"active":""}" href="#/admin">${icon(i,17)} ${l}</a>`).join("")}</aside><main class="admin-main"><div class="dashboard-header"><div><span class="demo-badge">Administrator demonstration</span><h1>Platform overview</h1><p class="muted">Review courses, applications, and platform activity.</p></div><button class="btn btn-outline" id="reset-demo">${icon("trash",17)} Reset browser demo</button></div><div class="stats-grid">${[["users","12,650","Registered learners"],["book",DATA.courses.length,"Published courses"],["award",DATA.instructors.length,"Approved instructors"],["checkCircle",applications.length,"Pending applications"]].map(([i,n,l]) => `<article class="stat-card"><span class="icon-box">${icon(i,20)}</span><strong>${n}</strong><span>${l}</span></article>`).join("")}</div><section class="dashboard-card" style="margin-top:22px"><div class="card-title-row"><h2>Course review queue</h2><span class="muted small">Sample administration data</span></div><div class="table-wrap"><table><thead><tr><th>Course</th><th>Instructor</th><th>Category</th><th>Status</th><th>Action</th></tr></thead><tbody>${DATA.courses.slice(0,5).map((course,index) => `<tr><td>${escapeHtml(course.title)}</td><td>${escapeHtml(instructorById(course.instructorId).name)}</td><td>${escapeHtml(course.category)}</td><td><span class="status-pill ${index<3?"approved":"review"}">${index<3?"Approved":"Review"}</span></td><td><button class="btn btn-outline btn-sm" data-admin-review>Open</button></td></tr>`).join("")}</tbody></table></div></section></main></div>`;
    document.getElementById("reset-demo").addEventListener("click", () => {
      showModal("Reset demonstration data?", `<p class="muted">This clears the demo account, saved courses, enrollments, progress, certificates, and teacher applications from this browser.</p>`, `<button class="btn btn-danger" id="confirm-reset">Reset data</button><button class="btn btn-outline" data-close-modal>Cancel</button>`);
      document.getElementById("confirm-reset")?.addEventListener("click", () => {
        Object.values(STORAGE).forEach((key) => localStorage.removeItem(key));
        location.reload();
      });
    });
    app.querySelectorAll("[data-admin-review]").forEach((button) => button.addEventListener("click", () => showModal("Course review", `<p class="muted">A production review page would include curriculum checks, instructor identity, accessibility requirements, copyright declarations, and approval history.</p>`, `<button class="btn btn-primary" data-close-modal>Approve sample</button><button class="btn btn-outline" data-close-modal>Request changes</button>`)));
  }

  function renderNotFound() {
    app.innerHTML = `<div class="page-shell"><section class="section"><div class="container"><div class="empty-state"><span class="icon-box">${icon("search",22)}</span><h3>Page not found</h3><p>The requested EcoLearn page does not exist or the address is incomplete.</p><a class="btn btn-primary" href="#/home">Return home</a></div></div></section></div>`;
  }

  function logout() {
    state.user = null;
    persist();
    showToast("Signed out", "Your local learning progress remains on this browser.", "info");
    navigate("home");
  }

  function firstName(name) {
    return String(name || "Learner").trim().split(/\s+/)[0];
  }

  function initials(name) {
    return String(name || "Learner").split(/\s+/).slice(0,2).map((part) => part[0]).join("").toUpperCase();
  }

  function downloadText(content, filename) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function submitForm(type, payload) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...payload })
      });
      return { ok: response.ok };
    } catch {
      return { ok: false };
    }
  }

  function renderRoute() {
    const { parts, params } = routeParts();
    const [route, arg1, arg2] = parts;
    window.scrollTo({ top: 0, behavior: "auto" });
    renderHeader();
    renderFooter();
    renderMobileNav();
    document.title = `${routeTitle(route, arg1)} — EcoLearn`;
    switch (route) {
      case "home": renderHome(); break;
      case "courses": renderCourses(params); break;
      case "course": renderCourse(arg1); break;
      case "lesson": renderLesson(arg1, arg2); break;
      case "categories": renderCategories(); break;
      case "instructors": renderInstructors(); break;
      case "instructor": renderInstructor(arg1); break;
      case "dashboard": renderDashboard(); break;
      case "my-learning": renderMyLearning(); break;
      case "saved": renderSaved(); break;
      case "certificates": renderCertificates(); break;
      case "certificate-verify": renderCertificateVerify(params); break;
      case "login": renderLogin(params); break;
      case "signup": renderSignup(params); break;
      case "forgot-password": renderForgotPassword(); break;
      case "teacher-application": renderTeacherApplication(); break;
      case "about": renderAbout(); break;
      case "contact": renderContact(); break;
      case "faq": renderFaq(); break;
      case "privacy": renderPolicy("privacy"); break;
      case "terms": renderPolicy("terms"); break;
      case "instructor-dashboard": renderInstructorDashboard(); break;
      case "admin": renderAdmin(); break;
      default: renderNotFound();
    }
    app.focus({ preventScroll: true });
  }

  function routeTitle(route, arg) {
    const labels = {
      home: "Learn Skills. Build Your Future.", courses: "Explore Courses", course: courseBySlug(arg)?.title || "Course",
      lesson: "Lesson Player", categories: "Categories", instructors: "Instructors", instructor: instructorById(arg)?.name || "Instructor",
      dashboard: "Dashboard", "my-learning": "My Learning", saved: "Saved Courses", certificates: "Certificates",
      "certificate-verify": "Verify Certificate", login: "Log In", signup: "Create Account", "forgot-password": "Reset Password",
      "teacher-application": "Become an Instructor", about: "About", contact: "Contact", faq: "FAQ", privacy: "Privacy Policy",
      terms: "Terms and Conditions", "instructor-dashboard": "Instructor Studio", admin: "Admin Dashboard"
    };
    return labels[route] || "Page Not Found";
  }

  window.addEventListener("hashchange", renderRoute);
  window.addEventListener("DOMContentLoaded", renderRoute);
})();

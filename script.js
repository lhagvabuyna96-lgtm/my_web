/** Админ нэвтрэх — эдгээр утгыг production-д заавал солино уу (client-side нь зөвхөн UI-д). */
const HARUTO_ADMIN_USER = "Haruto";
const HARUTO_ADMIN_PASSWORD = "qwe123";
const HARUTO_ADMIN_SESSION_KEY = "haruto_portfolio_admin";

const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
const year = document.getElementById("year");

const headerMore = document.getElementById("headerMore");
const moreBtn = document.getElementById("moreBtn");
const headerMorePanel = document.getElementById("headerMorePanel");
const moreGuestSection = document.getElementById("moreGuestSection");
const moreAdminSection = document.getElementById("moreAdminSection");
const moreOpenLogin = document.getElementById("moreOpenLogin");
const authPanel = document.getElementById("authPanel");
const adminLoginForm = document.getElementById("adminLoginForm");
const authError = document.getElementById("authError");
const authLogout = document.getElementById("authLogout");
const adminUser = document.getElementById("adminUser");
const adminPass = document.getElementById("adminPass");

function isAdminSession() {
  return sessionStorage.getItem(HARUTO_ADMIN_SESSION_KEY) === "1";
}

function setAdminSession(active) {
  if (active) sessionStorage.setItem(HARUTO_ADMIN_SESSION_KEY, "1");
  else sessionStorage.removeItem(HARUTO_ADMIN_SESSION_KEY);
}

function setMoreOpen(open) {
  if (!moreBtn || !headerMorePanel) return;
  headerMorePanel.hidden = !open;
  moreBtn.setAttribute("aria-expanded", open ? "true" : "false");
  if (!open) setAuthPanelOpen(false);
}

function setAuthPanelOpen(open) {
  if (!authPanel || !moreOpenLogin) return;
  authPanel.hidden = !open;
  moreOpenLogin.setAttribute("aria-expanded", open ? "true" : "false");
  if (!open && authError) {
    authError.hidden = true;
    authError.textContent = "";
  }
}

function syncAuthUI() {
  const admin = isAdminSession();
  if (moreGuestSection) moreGuestSection.hidden = admin;
  if (moreAdminSection) moreAdminSection.hidden = !admin;
  if (admin) setAuthPanelOpen(false);
}

function closeMoreIfOutside(ev) {
  if (!headerMore || headerMorePanel.hidden) return;
  if (headerMore.contains(ev.target)) return;
  setMoreOpen(false);
}

if (moreBtn && headerMorePanel) {
  moreBtn.addEventListener("click", (ev) => {
    ev.stopPropagation();
    const opening = headerMorePanel.hidden;
    setMoreOpen(opening);
    if (opening && menu && menu.classList.contains("open")) {
      menu.classList.remove("open");
    }
  });
}

if (moreOpenLogin && authPanel) {
  moreOpenLogin.addEventListener("click", () => {
    if (isAdminSession()) return;
    setAuthPanelOpen(authPanel.hidden);
  });
}

if (headerMore) {
  document.addEventListener("click", closeMoreIfOutside);
}

if (headerMorePanel) {
  headerMorePanel.querySelectorAll("[data-close-more]").forEach((el) => {
    el.addEventListener("click", () => setMoreOpen(false));
  });
}

document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape") setMoreOpen(false);
});

if (adminLoginForm && authError) {
  adminLoginForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const user = (adminUser && adminUser.value.trim()) || "";
    const pass = (adminPass && adminPass.value) || "";
    if (user === HARUTO_ADMIN_USER && pass === HARUTO_ADMIN_PASSWORD) {
      setAdminSession(true);
      authError.hidden = true;
      authError.textContent = "";
      adminLoginForm.reset();
      syncAuthUI();
      setMoreOpen(false);
      return;
    }
    authError.textContent = "Нэр эсвэл нууц үг буруу байна. Зөвхөн админ эрхтэй.";
    authError.hidden = false;
  });
}

if (authLogout) {
  authLogout.addEventListener("click", () => {
    setAdminSession(false);
    syncAuthUI();
    setMoreOpen(false);
  });
}

syncAuthUI();

if (year) {
  year.textContent = new Date().getFullYear();
}
 
if (menuBtn && menu) {
  menuBtn.addEventListener("click", (ev) => {
    ev.stopPropagation();
    setMoreOpen(false);
    menu.classList.toggle("open");
  });

  menu.querySelectorAll("a").forEach((item) => {
    item.addEventListener("click", () => {
      menu.classList.remove("open");
    });
  });
}

if (typeof HarutoSiteContent !== "undefined") {
  HarutoSiteContent.apply(HarutoSiteContent.load());
}

// Add subtle reveal animation as sections/cards enter viewport.
const revealTargets = document.querySelectorAll(
  ".section-title, .panel, .stats article, .skill, .hero__content, .phone-card"
);

if ("IntersectionObserver" in window && revealTargets.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealTargets.forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });
}

// Keep nav item highlighted based on current section.
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll('.menu a[href^="#"]');

if ("IntersectionObserver" in window && sections.length > 0 && navLinks.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const currentId = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const isMatch = link.getAttribute("href") === `#${currentId}`;
          link.classList.toggle("nav-active", isMatch);
        });
      });
    },
    { rootMargin: "-35% 0px -50% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}


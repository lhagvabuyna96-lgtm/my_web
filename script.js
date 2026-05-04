const A = typeof window !== "undefined" && window.HARUTO_AUTH;
const HARUTO_ADMIN_SESSION_KEY = (A && A.KEY) || "haruto_portfolio_admin";
const HARUTO_LEGACY_SESSION_KEY = "haruto_token";

const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
const year = document.getElementById("year");

const headerMore = document.getElementById("headerMore");
const moreBtn = document.getElementById("moreBtn");
const headerMorePanel = document.getElementById("headerMorePanel");
const moreGuestSection = document.getElementById("moreGuestSection");
const moreAdminSection = document.getElementById("moreAdminSection");
const authLogout = document.getElementById("authLogout");

function isAdminSession() {
  return (
    sessionStorage.getItem(HARUTO_ADMIN_SESSION_KEY) === "1" ||
    !!sessionStorage.getItem(HARUTO_LEGACY_SESSION_KEY)
  );
}

function setAdminSession(active) {
  if (active) {
    sessionStorage.setItem(HARUTO_ADMIN_SESSION_KEY, "1");
    sessionStorage.setItem(HARUTO_LEGACY_SESSION_KEY, "1");
  } else {
    sessionStorage.removeItem(HARUTO_ADMIN_SESSION_KEY);
    sessionStorage.removeItem(HARUTO_LEGACY_SESSION_KEY);
  }
}

function setMoreOpen(open) {
  if (!moreBtn || !headerMorePanel) return;
  headerMorePanel.hidden = !open;
  moreBtn.setAttribute("aria-expanded", open ? "true" : "false");
}

function syncAuthUI() {
  const admin = isAdminSession();
  if (moreGuestSection) moreGuestSection.hidden = admin;
  if (moreAdminSection) moreAdminSection.hidden = !admin;
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

function escapeHtmlCv(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cvTextById(id) {
  const el = document.getElementById(id);
  return el ? el.textContent.trim().replace(/\s+/g, " ") : "";
}

function cvAttrById(id, attr) {
  const el = document.getElementById(id);
  return el ? String(el.getAttribute(attr) ?? "").trim() : "";
}

/** @param {"hero" | "about"} scope */
function buildCvHtml(scope) {
  const brand = cvTextById("siteBrandName") || "Portfolio";
  const genDate = new Date().toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const scopeNote =
    scope === "about" ? "About — хэсэг" : "Hero — эхний хэсэг";

  const shell = (title, bodyInner) => `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" lang="mn">
<head>
<meta charset="utf-8">
<title>${escapeHtmlCv(title)}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
<style>
body{font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#111;line-height:1.45;max-width:720px;}
h1{font-size:22pt;margin:0 0 8px 0;}
h2{font-size:14pt;margin:18px 0 8px 0;border-bottom:1px solid #ccc;padding-bottom:4px;}
p{margin:0 0 10px 0;}
table{border-collapse:collapse;width:100%;}
ul{margin:8px 0 0 18px;}
</style>
</head>
<body>
<h1>${escapeHtmlCv(brand)}</h1>
<p style="color:#555;font-size:10pt;margin:0 0 4px 0;">${escapeHtmlCv(genDate)}</p>
<p style="color:#666;font-size:9pt;margin:0 0 16px 0;">${escapeHtmlCv(scopeNote)}</p>
${bodyInner}
<p style="margin-top:24px;font-size:9pt;color:#777;">Энэхүү баримт бичиг вебсайтын тухайн хэсгээс автоматаар үүсгэгдсэн.</p>
</body>
</html>`;

  if (scope === "about") {
    const aboutH = cvTextById("edAboutHeading");
    const aboutBody = cvTextById("edAboutBody");
    const loc = cvTextById("edAboutLoc");
    const phone = cvTextById("edAboutPhone");
    const aboutAlt = cvAttrById("edAboutImg", "alt");
    const inner = `
<h2>${escapeHtmlCv(aboutH || "About me")}</h2>
<p>${escapeHtmlCv(aboutBody)}</p>
<p>${escapeHtmlCv(loc)}</p>
<p>${escapeHtmlCv(phone)}</p>
${aboutAlt ? `<p style="font-size:10pt;color:#444;"><em>${escapeHtmlCv(aboutAlt)}</em></p>` : ""}`;
    return shell(`${brand} — About`, inner);
  }

  const kicker = cvTextById("edHeroKicker");
  const heroTitle = cvTextById("edHeroTitle");
  const heroIntro = cvTextById("edHeroIntro");
  const stats = [0, 1, 2].map((i) => ({
    v: cvTextById("edStat" + i + "v"),
    l: cvTextById("edStat" + i + "l"),
  }));
  const hireCta = cvTextById("edCtaHire");
  const badge = cvTextById("edPhoneBadge");
  const phoneBtn = cvTextById("edPhoneBtn");
  const heroImgAlt = cvAttrById("edHeroImg", "alt");

  let statsRows = "";
  stats.forEach((s) => {
    if (s.v || s.l) {
      statsRows += `<tr><td style="padding:4px 12px 4px 0;border-bottom:1px solid #ddd;"><strong>${escapeHtmlCv(s.v)}</strong></td><td style="padding:4px 0;border-bottom:1px solid #ddd;">${escapeHtmlCv(s.l)}</td></tr>`;
    }
  });

  const socialIds = ["edSocialFb", "edSocialIg", "edSocialGh"];
  let socialLis = "";
  socialIds.forEach((sid) => {
    const el = document.getElementById(sid);
    if (!el) return;
    const href = (el.getAttribute("href") || "").trim();
    const label = (el.getAttribute("aria-label") || sid).trim();
    if (href) {
      socialLis += `<li>${escapeHtmlCv(label)}: ${escapeHtmlCv(href)}</li>`;
    }
  });

  const inner = `
${kicker ? `<p style="font-size:10pt;letter-spacing:0.08em;text-transform:uppercase;color:#555;">${escapeHtmlCv(kicker)}</p>` : ""}
<h2>${escapeHtmlCv(heroTitle || "Танилцуулга")}</h2>
<p>${escapeHtmlCv(heroIntro)}</p>
${statsRows ? `<h2>Статистик</h2><table>${statsRows}</table>` : ""}
${hireCta ? `<h2>Үйлдэл</h2><p>${escapeHtmlCv(hireCta)}</p>` : ""}
${socialLis ? `<h2>Сошиал холбоос</h2><ul>${socialLis}</ul>` : ""}
<h2>Профайл зураг / карт</h2>
<p>${escapeHtmlCv(badge)}${badge && phoneBtn ? " · " : ""}${escapeHtmlCv(phoneBtn)}</p>
${heroImgAlt ? `<p style="font-size:10pt;color:#444;"><em>${escapeHtmlCv(heroImgAlt)}</em></p>` : ""}`;
  return shell(`${brand} — Hero`, inner);
}

/** @param {"hero" | "about"} scope */
function downloadCvAsWordDoc(scope) {
  const html = buildCvHtml(scope);
  const blob = new Blob(["\ufeff", html], {
    type: "application/msword;charset=utf-8",
  });
  const rawName = (cvTextById("siteBrandName") || "CV").replace(/[^\w\u0400-\u04FF.-]+/g, "_");
  const suffix = scope === "about" ? "About" : "Hero";
  const filename = `${rawName || "CV"}_${suffix}_CV.doc`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  requestAnimationFrame(() => {
    URL.revokeObjectURL(url);
    a.remove();
  });
}

document.querySelectorAll("[data-cv-section]").forEach((btn) => {
  btn.addEventListener("click", (ev) => {
    ev.preventDefault();
    const scope = btn.getAttribute("data-cv-section");
    if (scope === "hero" || scope === "about") {
      downloadCvAsWordDoc(scope);
    }
  });
});

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

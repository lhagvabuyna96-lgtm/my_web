/**
 * Портфолио агуулга — localStorage-д хадгална (dashboard-аас засварлана).
 * index.html дээрх тодорхой id-уудтай элементүүдэд хэрэглэгдэнэ.
 */
(function (global) {
  var STORAGE_KEY = "haruto_portfolio_site_content";

  function defaults() {
    return {
      meta: {
        pageTitle: "Haruto | Personal Portfolio",
        metaDescription:
          "Haruto-ийн хувийн танилцуулга, үйлчилгээ, төслүүд, чадвар болон холбоо барих хэсэг.",
      },
      brand: { name: "Haruto" },
      hero: {
        kicker: "Welcome",
        title: "Hello Everyone I'm Haruto",
        intro:
          "Би web developer бөгөөд dark modern интерфэйстэй, хурдан бөгөөд responsive вебсайт хөгжүүлдэг.",
        stats: [
          { value: "10+", label: "Project хийсэн" },
          { value: "1+", label: "Жилийн туршлага" },
          { value: "04+", label: "Active clients" },
        ],
        ctaHire: "Hire me",
        ctaCv: "Download CV",
        phoneBadge: "Responsive",
        phoneButton: "View details",
        heroImage: "./assets/home-profile.png",
        heroImageAlt: "Haruto profile",
        social: {
          facebook: "https://www.facebook.com/l.buantogtoh.791855",
          instagram:
            "https://www.instagram.com/buyn_1014?igsh=Z3RoMzcxbzZjOHRy&utm_source=qr",
          github: "https://github.com/lhagvabuyna96-lgtm",
        },
      },
      about: {
        image: "./assets/about-profile.png",
        imageAlt: "Haruto about profile",
        heading: "About me",
        body:
          "Сайн уу, би Haruto. Миний зорилго бол бизнес болон хувь хүн бүрт зориулсан website бүтээх. Front-end хөгжүүлэлт дээр төвлөрөн, хэрэглэгчдэд ойлгомжтой, цэвэр бөгөөд хурдан интерфэйс хийдэг.",
        locationLine: "📍 Миний байршил: Ulaanbaatar, Mongolia",
        phoneLine: "📞 Миний утас: +976 8088 0236",
        ctaCv: "Download CV",
      },
      sectionTitles: {
        services: "My Services",
        projects: "Latest Project",
        skills: "My Skill",
      },
      services: [
        {
          title: "Web Development",
          body: "Орчин үеийн, SEO-д ээлтэй, өндөр гүйцэтгэлтэй вэбсайт хөгжүүлэлт.",
        },
        {
          title: "UI/UX Design",
          body: "Хэрэглэгч төвтэй бүтэц, clean layout болон өндөр conversion дизайн.",
        },
        {
          title: "Landing Page",
          body: "Борлуулалт болон сурталчилгаанд зориулсан хурдан landing page.",
        },
      ],
      projects: [
        {
          iconClass: "fa-solid fa-calculator",
          title: "Calculator App",
          body: "Dark theme энгийн calculator төсөл.",
          imageUrl: "",
        },
        {
          iconClass: "fa-solid fa-code",
          title: "Portfolio Clone",
          body: "Responsive portfolio UI reconstruction.",
          imageUrl: "",
        },
        {
          iconClass: "fa-solid fa-briefcase",
          title: "Business Site",
          body: "Танилцуулга website for small business.",
          imageUrl: "",
        },
      ],
      skills: [
        { label: "HTML", iconClass: "skill-icon devicon-html5-plain" },
        { label: "CSS", iconClass: "skill-icon devicon-css3-plain" },
        { label: "JavaScript", iconClass: "skill-icon devicon-javascript-plain" },
        { label: "PHP", iconClass: "skill-icon devicon-php-plain" },
        { label: "Python", iconClass: "skill-icon devicon-python-plain" },
        { label: "MySQL", iconClass: "skill-icon devicon-mysql-plain" },
        { label: "C#", iconClass: "skill-icon devicon-csharp-plain" },
      ],
      contact: {
        intro:
          "Төслийн санал, хамтын ажиллагаа, эсвэл шууд чатлах бол message үлдээнэ үү. Тантай хамтрахад таатай байна.",
        formSubject: "New portfolio contact message",
        formSubmitEmail: "lhagvabuyna96@gmail.com",
      },
      footer: { owner: "Haruto" },
    };
  }

  function isPlainObject(o) {
    return o && Object.prototype.toString.call(o) === "[object Object]";
  }

  function deepMerge(base, patch) {
    if (!isPlainObject(patch)) return base;
    var out = {};
    var k;
    for (k in base) {
      if (Object.prototype.hasOwnProperty.call(base, k)) out[k] = base[k];
    }
    for (k in patch) {
      if (!Object.prototype.hasOwnProperty.call(patch, k)) continue;
      var pv = patch[k];
      var bv = out[k];
      if (Array.isArray(pv)) {
        out[k] = pv.slice();
      } else if (isPlainObject(pv) && isPlainObject(bv)) {
        out[k] = deepMerge(bv, pv);
      } else {
        out[k] = pv;
      }
    }
    return out;
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaults();
      var parsed = JSON.parse(raw);
      return deepMerge(defaults(), parsed);
    } catch (e) {
      return defaults();
    }
  }

  function save(content) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text == null ? "" : String(text);
  }

  function setAttr(id, attr, value) {
    var el = document.getElementById(id);
    if (el && value != null) el.setAttribute(attr, String(value));
  }

  function apply(content) {
    if (!document.querySelector("main")) return;

    var m = content.meta || {};
    if (m.pageTitle) document.title = m.pageTitle;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && m.metaDescription) metaDesc.setAttribute("content", m.metaDescription);

    var brand = content.brand || {};
    setText("siteBrandName", brand.name);

    var h = content.hero || {};
    setText("edHeroKicker", h.kicker);
    setText("edHeroTitle", h.title);
    setText("edHeroIntro", h.intro);
    setText("edCtaHire", h.ctaHire);
    setText("edCtaCv", h.ctaCv);
    setText("edPhoneBadge", h.phoneBadge);
    setText("edPhoneBtn", h.phoneButton);
    setAttr("edHeroImg", "src", h.heroImage);
    setAttr("edHeroImg", "alt", h.heroImageAlt);

    var stats = h.stats || [];
    for (var si = 0; si < 3; si++) {
      var stt = stats[si] || {};
      setText("edStat" + si + "v", stt.value);
      setText("edStat" + si + "l", stt.label);
    }

    var soc = h.social || {};
    setAttr("edSocialFb", "href", soc.facebook);
    setAttr("edSocialIg", "href", soc.instagram);
    setAttr("edSocialGh", "href", soc.github);

    var a = content.about || {};
    setAttr("edAboutImg", "src", a.image);
    setAttr("edAboutImg", "alt", a.imageAlt);
    setText("edAboutHeading", a.heading);
    setText("edAboutBody", a.body);
    setText("edAboutLoc", a.locationLine);
    setText("edAboutPhone", a.phoneLine);
    setText("edAboutCv", a.ctaCv);

    var st = content.sectionTitles || {};
    setText("edServicesTitle", st.services);
    setText("edProjectsTitle", st.projects);
    setText("edSkillsTitle", st.skills);

    var svcGrid = document.getElementById("edServicesGrid");
    if (svcGrid) {
      var cards = svcGrid.querySelectorAll(".card");
      (content.services || []).forEach(function (row, i) {
        if (!cards[i]) return;
        var t = cards[i].querySelector("h3");
        var p = cards[i].querySelector("p");
        if (t) t.textContent = row.title || "";
        if (p) p.textContent = row.body || "";
      });
    }

    var projGrid = document.getElementById("edProjectsGrid");
    if (projGrid) {
      projGrid.innerHTML = "";
      (content.projects || []).forEach(function (row) {
        var title = row.title != null ? String(row.title).trim() : "";
        var body = row.body != null ? String(row.body).trim() : "";
        var imgUrl = row.imageUrl != null ? String(row.imageUrl).trim() : "";
        var iconClass = row.iconClass != null ? String(row.iconClass).trim() : "";
        if (!title && !body && !imgUrl && !iconClass) return;
        var art = document.createElement("article");
        art.className = "panel project-card";
        var thumb = document.createElement("div");
        thumb.className = "thumb";
        if (imgUrl) {
          thumb.classList.add("thumb--photo");
          var img = document.createElement("img");
          img.src = imgUrl;
          img.alt = title || "";
          img.loading = "lazy";
          thumb.appendChild(img);
        } else {
          var ic = document.createElement("i");
          ic.className = iconClass || "fa-solid fa-code";
          thumb.appendChild(ic);
        }
        var h = document.createElement("h3");
        h.textContent = title;
        var p = document.createElement("p");
        p.textContent = body;
        art.appendChild(thumb);
        art.appendChild(h);
        art.appendChild(p);
        projGrid.appendChild(art);
      });
    }

    var skGrid = document.getElementById("edSkillsGrid");
    if (skGrid) {
      skGrid.innerHTML = "";
      (content.skills || []).forEach(function (row) {
        var span = document.createElement("span");
        span.className = "skill";
        var i = document.createElement("i");
        i.className = row.iconClass || "skill-icon devicon-html5-plain";
        span.appendChild(i);
        span.appendChild(document.createTextNode(row.label || ""));
        skGrid.appendChild(span);
      });
    }

    var c = content.contact || {};
    setText("edContactIntro", c.intro);

    var form = document.getElementById("edContactForm");
    if (form && c.formSubmitEmail) {
      var em = String(c.formSubmitEmail).trim();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        form.action = "https://formsubmit.co/" + em;
      }
    }
    var subj = document.getElementById("edFormSubject");
    if (subj && c.formSubject != null) subj.value = c.formSubject;

    var foot = content.footer || {};
    setText("edFooterOwner", foot.owner);
  }

  global.HarutoSiteContent = {
    STORAGE_KEY: STORAGE_KEY,
    defaults: defaults,
    load: load,
    save: save,
    apply: apply,
  };
})(typeof window !== "undefined" ? window : this);

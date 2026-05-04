(function () {
  var SESSION_KEY = "haruto_token";
  var MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;

  function $(id) {
    return document.getElementById(id);
  }

  function showToast(msg, isError) {
    var t = $("dashToast");
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    t.classList.toggle("dash-toast--error", !!isError);
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      t.hidden = true;
    }, 4200);
  }

  function refreshProjectIndices() {
    var list = $("dashProjectsList");
    if (!list) return;
    var blocks = list.querySelectorAll(".dash-project-block");
    blocks.forEach(function (block, i) {
      var badge = block.querySelector(".dash-index-badge");
      if (badge) badge.textContent = "#" + (i + 1);
    });
  }

  function refreshSkillIndices() {
    var list = $("dashSkillsList");
    if (!list) return;
    list.querySelectorAll(".dash-skill-block").forEach(function (block, i) {
      var badge = block.querySelector(".dash-index-badge");
      if (badge) badge.textContent = "#" + (i + 1);
    });
  }

  function bindProjectBlock(block) {
    var fileIn = block.querySelector(".dash-prj-file");
    var hidden = block.querySelector(".dash-prj-imageurl");
    var previewWrap = block.querySelector(".dash-prj-preview-wrap");
    var clearBtn = block.querySelector(".dash-prj-clearimg");
    var removeBtn = block.querySelector(".dash-project-remove");

    if (fileIn && hidden && previewWrap) {
      fileIn.addEventListener("change", function () {
        var f = fileIn.files && fileIn.files[0];
        if (!f) return;
        if (f.size > MAX_IMAGE_BYTES) {
          showToast("Зураг 1.5MB-аас бага байх ёстой.", true);
          fileIn.value = "";
          return;
        }
        var fr = new FileReader();
        fr.onload = function () {
          hidden.value = fr.result;
          previewWrap.innerHTML = "";
          var img = document.createElement("img");
          img.className = "dash-prj-preview";
          img.src = fr.result;
          img.alt = "";
          previewWrap.appendChild(img);
        };
        fr.onerror = function () {
          showToast("Зураг уншиж чадсангүй.", true);
        };
        fr.readAsDataURL(f);
      });
    }

    if (clearBtn && hidden && previewWrap && fileIn) {
      clearBtn.addEventListener("click", function () {
        hidden.value = "";
        previewWrap.innerHTML = "";
        fileIn.value = "";
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener("click", function () {
        block.remove();
        refreshProjectIndices();
      });
    }
  }

  function createProjectBlock(data) {
    data = data || {};
    var imageUrl = data.imageUrl != null ? String(data.imageUrl) : "";
    var block = document.createElement("div");
    block.className = "dash-dynamic-block dash-project-block";

    var head = document.createElement("div");
    head.className = "dash-dynamic-head";
    var badge = document.createElement("span");
    badge.className = "dash-index-badge";
    badge.textContent = "#";
    var rm = document.createElement("button");
    rm.type = "button";
    rm.className = "btn btn-outline btn-tiny dash-project-remove";
    rm.textContent = "Устгах";
    head.appendChild(badge);
    head.appendChild(rm);
    block.appendChild(head);

    var lblImg = document.createElement("span");
    lblImg.className = "dash-label";
    lblImg.textContent = "Зураг (гарын файлаас)";
    block.appendChild(lblImg);

    var fileIn = document.createElement("input");
    fileIn.type = "file";
    fileIn.accept = "image/jpeg,image/png,image/gif,image/webp";
    fileIn.className = "dash-input dash-prj-file";
    block.appendChild(fileIn);

    var clearRow = document.createElement("div");
    clearRow.className = "dash-clear-row";
    var clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "btn btn-outline btn-tiny dash-prj-clearimg";
    clearBtn.textContent = "Зураг арилгах";
    clearRow.appendChild(clearBtn);
    block.appendChild(clearRow);

    var hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.className = "dash-prj-imageurl";
    hidden.value = imageUrl;
    block.appendChild(hidden);

    var previewWrap = document.createElement("div");
    previewWrap.className = "dash-prj-preview-wrap";
    if (imageUrl) {
      var pv = document.createElement("img");
      pv.className = "dash-prj-preview";
      pv.src = imageUrl;
      pv.alt = "";
      previewWrap.appendChild(pv);
    }
    block.appendChild(previewWrap);

    var lblIc = document.createElement("span");
    lblIc.className = "dash-label";
    lblIc.textContent = "Icon (зураггүй бол)";
    block.appendChild(lblIc);

    var iconIn = document.createElement("input");
    iconIn.type = "text";
    iconIn.className = "dash-input dash-prj-icon";
    iconIn.placeholder = "fa-solid fa-code";
    iconIn.value = data.iconClass != null ? String(data.iconClass) : "";
    block.appendChild(iconIn);

    var lblT = document.createElement("span");
    lblT.className = "dash-label";
    lblT.textContent = "Гарчиг";
    block.appendChild(lblT);

    var titleIn = document.createElement("input");
    titleIn.type = "text";
    titleIn.className = "dash-input dash-prj-title";
    titleIn.placeholder = "Төслийн нэр";
    titleIn.value = data.title != null ? String(data.title) : "";
    block.appendChild(titleIn);

    var lblB = document.createElement("span");
    lblB.className = "dash-label";
    lblB.textContent = "Тайлбар";
    block.appendChild(lblB);

    var bodyTa = document.createElement("textarea");
    bodyTa.className = "dash-input dash-textarea dash-prj-body";
    bodyTa.rows = 3;
    bodyTa.placeholder = "Товх тайлбар";
    bodyTa.value = data.body != null ? String(data.body) : "";
    block.appendChild(bodyTa);

    bindProjectBlock(block);
    return block;
  }

  function renderProjectsEditor(projects) {
    var list = $("dashProjectsList");
    if (!list) return;
    list.innerHTML = "";
    (projects || []).forEach(function (row) {
      list.appendChild(createProjectBlock(row));
    });
    refreshProjectIndices();
  }

  function bindSkillBlock(block) {
    var removeBtn = block.querySelector(".dash-skill-remove");
    if (removeBtn) {
      removeBtn.addEventListener("click", function () {
        block.remove();
        refreshSkillIndices();
      });
    }
  }

  function createSkillBlock(data) {
    data = data || {};
    var block = document.createElement("div");
    block.className = "dash-dynamic-block dash-skill-block";

    var head = document.createElement("div");
    head.className = "dash-dynamic-head";
    var badge = document.createElement("span");
    badge.className = "dash-index-badge";
    badge.textContent = "#";
    var rm = document.createElement("button");
    rm.type = "button";
    rm.className = "btn btn-outline btn-tiny dash-skill-remove";
    rm.textContent = "Устгах";
    head.appendChild(badge);
    head.appendChild(rm);
    block.appendChild(head);

    var lblL = document.createElement("span");
    lblL.className = "dash-label";
    lblL.textContent = "Нэр (жишээ HTML)";
    block.appendChild(lblL);

    var labelIn = document.createElement("input");
    labelIn.type = "text";
    labelIn.className = "dash-input dash-skill-label";
    labelIn.placeholder = "HTML";
    labelIn.value = data.label != null ? String(data.label) : "";
    block.appendChild(labelIn);

    var lblI = document.createElement("span");
    lblI.className = "dash-label";
    lblI.textContent = "Icon class";
    block.appendChild(lblI);

    var iconIn = document.createElement("input");
    iconIn.type = "text";
    iconIn.className = "dash-input dash-skill-icon";
    iconIn.placeholder = "skill-icon devicon-html5-plain";
    iconIn.value = data.iconClass != null ? String(data.iconClass) : "";
    block.appendChild(iconIn);

    bindSkillBlock(block);
    return block;
  }

  function renderSkillsEditor(skills) {
    var list = $("dashSkillsList");
    if (!list) return;
    list.innerHTML = "";
    (skills || []).forEach(function (row) {
      list.appendChild(createSkillBlock(row));
    });
    refreshSkillIndices();
  }

  function getProjectsFromDOM() {
    var list = $("dashProjectsList");
    if (!list) return [];
    var out = [];
    list.querySelectorAll(".dash-project-block").forEach(function (node) {
      var imageUrl = (node.querySelector(".dash-prj-imageurl") || {}).value || "";
      var iconClass = (node.querySelector(".dash-prj-icon") || {}).value.trim();
      var title = (node.querySelector(".dash-prj-title") || {}).value.trim();
      var body = (node.querySelector(".dash-prj-body") || {}).value.trim();
      if (!title && !body && !imageUrl && !iconClass) return;
      out.push({
        iconClass: iconClass,
        title: title,
        body: body,
        imageUrl: imageUrl,
      });
    });
    return out;
  }

  function getSkillsFromDOM() {
    var list = $("dashSkillsList");
    if (!list) return [];
    var out = [];
    list.querySelectorAll(".dash-skill-block").forEach(function (node) {
      var label = (node.querySelector(".dash-skill-label") || {}).value.trim();
      var iconClass = (node.querySelector(".dash-skill-icon") || {}).value.trim();
      if (!label && !iconClass) return;
      out.push({
        label: label,
        iconClass: iconClass || "skill-icon devicon-html5-plain",
      });
    });
    return out;
  }

  function setForm(c) {
    $("dash_meta_title").value = c.meta.pageTitle || "";
    $("dash_meta_desc").value = c.meta.metaDescription || "";
    $("dash_brand").value = c.brand.name || "";
    var h = c.hero || {};
    $("dash_hero_kicker").value = h.kicker || "";
    $("dash_hero_title").value = h.title || "";
    $("dash_hero_intro").value = h.intro || "";
    var stats = h.stats || [];
    for (var i = 0; i < 3; i++) {
      $("dash_stat_" + i + "_v").value = (stats[i] && stats[i].value) || "";
      $("dash_stat_" + i + "_l").value = (stats[i] && stats[i].label) || "";
    }
    $("dash_cta_hire").value = h.ctaHire || "";
    $("dash_cta_cv").value = h.ctaCv || "";
    $("dash_phone_badge").value = h.phoneBadge || "";
    $("dash_phone_btn").value = h.phoneButton || "";
    $("dash_hero_img").value = h.heroImage || "";
    $("dash_hero_img_alt").value = h.heroImageAlt || "";
    var soc = h.social || {};
    $("dash_social_fb").value = soc.facebook || "";
    $("dash_social_ig").value = soc.instagram || "";
    $("dash_social_gh").value = soc.github || "";
    var a = c.about || {};
    $("dash_about_img").value = a.image || "";
    $("dash_about_img_alt").value = a.imageAlt || "";
    $("dash_about_heading").value = a.heading || "";
    $("dash_about_body").value = a.body || "";
    $("dash_about_loc").value = a.locationLine || "";
    $("dash_about_phone").value = a.phoneLine || "";
    $("dash_about_cv").value = a.ctaCv || "";
    var st = c.sectionTitles || {};
    $("dash_sec_services").value = st.services || "";
    $("dash_sec_projects").value = st.projects || "";
    $("dash_sec_skills").value = st.skills || "";
    var svcs = c.services || [];
    for (var s = 0; s < 3; s++) {
      $("dash_svc_" + s + "_t").value = (svcs[s] && svcs[s].title) || "";
      $("dash_svc_" + s + "_b").value = (svcs[s] && svcs[s].body) || "";
    }

    var prj = (c.projects || []).map(function (p) {
      return {
        iconClass: p.iconClass || "",
        title: p.title || "",
        body: p.body || "",
        imageUrl: p.imageUrl || "",
      };
    });
    renderProjectsEditor(prj);

    var sk = (c.skills || []).map(function (x) {
      return { label: x.label || "", iconClass: x.iconClass || "" };
    });
    renderSkillsEditor(sk);

    var ct = c.contact || {};
    $("dash_contact_intro").value = ct.intro || "";
    $("dash_contact_email").value = ct.formSubmitEmail || "";
    $("dash_contact_subject").value = ct.formSubject || "";
    $("dash_footer_owner").value = (c.footer && c.footer.owner) || "";
  }

  function initDashboardNav() {
    var nav = document.querySelector(".dashboard-nav");
    if (!nav) return;
    var links = nav.querySelectorAll('.dashboard-nav__link[href^="#"]');
    if (!links.length) return;

    function setActiveById(id) {
      links.forEach(function (link) {
        var match = link.getAttribute("href") === "#" + id;
        link.classList.toggle("dashboard-nav__link--active", match);
      });
    }

    var prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    links.forEach(function (a) {
      a.addEventListener("click", function (ev) {
        ev.preventDefault();
        var id = a.getAttribute("href").slice(1);
        var el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({
            behavior: prefersReduced ? "auto" : "smooth",
            block: "start",
          });
        }
        setActiveById(id);
      });
    });

    var first = links[0].getAttribute("href");
    if (first) setActiveById(first.slice(1));

    if (!("IntersectionObserver" in window)) return;

    var sectionEls = [];
    links.forEach(function (l) {
      var sid = l.getAttribute("href").slice(1);
      var sec = document.getElementById(sid);
      if (sec) sectionEls.push(sec);
    });

    var obs = new IntersectionObserver(
      function (entries) {
        var chosen = null;
        var best = -1;
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          if (en.intersectionRatio > best) {
            best = en.intersectionRatio;
            chosen = en.target;
          }
        });
        if (chosen && chosen.id) setActiveById(chosen.id);
      },
      { root: null, rootMargin: "-80px 0px -58% 0px", threshold: [0, 0.06, 0.12, 0.2, 0.35] }
    );

    sectionEls.forEach(function (s) {
      obs.observe(s);
    });
  }

  function readForm() {
    return {
      meta: {
        pageTitle: $("dash_meta_title").value.trim(),
        metaDescription: $("dash_meta_desc").value.trim(),
      },
      brand: { name: $("dash_brand").value.trim() },
      hero: {
        kicker: $("dash_hero_kicker").value.trim(),
        title: $("dash_hero_title").value.trim(),
        intro: $("dash_hero_intro").value.trim(),
        stats: [0, 1, 2].map(function (i) {
          return {
            value: $("dash_stat_" + i + "_v").value.trim(),
            label: $("dash_stat_" + i + "_l").value.trim(),
          };
        }),
        ctaHire: $("dash_cta_hire").value.trim(),
        ctaCv: $("dash_cta_cv").value.trim(),
        phoneBadge: $("dash_phone_badge").value.trim(),
        phoneButton: $("dash_phone_btn").value.trim(),
        heroImage: $("dash_hero_img").value.trim(),
        heroImageAlt: $("dash_hero_img_alt").value.trim(),
        social: {
          facebook: $("dash_social_fb").value.trim(),
          instagram: $("dash_social_ig").value.trim(),
          github: $("dash_social_gh").value.trim(),
        },
      },
      about: {
        image: $("dash_about_img").value.trim(),
        imageAlt: $("dash_about_img_alt").value.trim(),
        heading: $("dash_about_heading").value.trim(),
        body: $("dash_about_body").value.trim(),
        locationLine: $("dash_about_loc").value.trim(),
        phoneLine: $("dash_about_phone").value.trim(),
        ctaCv: $("dash_about_cv").value.trim(),
      },
      sectionTitles: {
        services: $("dash_sec_services").value.trim(),
        projects: $("dash_sec_projects").value.trim(),
        skills: $("dash_sec_skills").value.trim(),
      },
      services: [0, 1, 2].map(function (i) {
        return {
          title: $("dash_svc_" + i + "_t").value.trim(),
          body: $("dash_svc_" + i + "_b").value.trim(),
        };
      }),
      projects: getProjectsFromDOM(),
      skills: getSkillsFromDOM(),
      contact: {
        intro: $("dash_contact_intro").value.trim(),
        formSubmitEmail: $("dash_contact_email").value.trim(),
        formSubject: $("dash_contact_subject").value.trim(),
      },
      footer: { owner: $("dash_footer_owner").value.trim() },
    };
  }

  var allowed = !!sessionStorage.getItem(SESSION_KEY);
  var elOk = $("dashAllowed");
  var elNo = $("dashDenied");
  if (!elOk || !elNo) return;

  if (!allowed) {
    elNo.hidden = false;
    return;
  }
  elOk.hidden = false;

  if (typeof HarutoSiteContent === "undefined") {
    showToast("site-content.js ачаалагдаагүй байна.", true);
    return;
  }

  setForm(HarutoSiteContent.load());
  initDashboardNav();

  var addPrj = $("dashAddProject");
  if (addPrj) {
    addPrj.addEventListener("click", function () {
      var list = $("dashProjectsList");
      if (!list) return;
      list.appendChild(
        createProjectBlock({ iconClass: "fa-solid fa-code", title: "", body: "", imageUrl: "" })
      );
      refreshProjectIndices();
    });
  }

  var addSk = $("dashAddSkill");
  if (addSk) {
    addSk.addEventListener("click", function () {
      var list = $("dashSkillsList");
      if (!list) return;
      list.appendChild(
        createSkillBlock({ label: "", iconClass: "skill-icon devicon-html5-plain" })
      );
      refreshSkillIndices();
    });
  }

  $("dashForm").addEventListener("submit", function (ev) {
    ev.preventDefault();
    try {
      var data = readForm();
      var def = HarutoSiteContent.defaults();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact.formSubmitEmail)) {
        data.contact.formSubmitEmail = def.contact.formSubmitEmail;
      }
      if (!data.skills.length) {
        data.skills = def.skills.map(function (s) {
          return { label: s.label, iconClass: s.iconClass };
        });
      }
      if (!data.projects.length) {
        data.projects = def.projects.map(function (p) {
          return {
            iconClass: p.iconClass,
            title: p.title,
            body: p.body,
            imageUrl: p.imageUrl || "",
          };
        });
      }
      try {
        HarutoSiteContent.save(data);
      } catch (e) {
        if (e && (e.name === "QuotaExceededError" || e.code === 22)) {
          showToast(
            "Хадгалах зай хүрэлцэхгүй байна. Том зургуудыг багасгаад дахин оролдоно уу.",
            true
          );
          return;
        }
        throw e;
      }
      showToast("Хадгалагдлаа. Портфолио хуудсыг дахин ачаалбал өөрчлөлт харагдана.");
    } catch (err) {
      showToast(err.message || "Хадгалахад алдаа гарлаа.", true);
    }
  });

  $("dashReset").addEventListener("click", function () {
    if (!confirm("Бүх засварыг устгаж, анхны агуулгаар сэргээх үү?")) return;
    localStorage.removeItem(HarutoSiteContent.STORAGE_KEY);
    setForm(HarutoSiteContent.load());
    showToast("Анхны агуулгад шилжлээ.");
  });
})();

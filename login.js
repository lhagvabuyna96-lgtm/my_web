(function () {
  var A = typeof window !== "undefined" && window.HARUTO_AUTH;
  var form = document.getElementById("loginForm");
  var err = document.getElementById("loginError");
  var user = document.getElementById("loginUser");
  var pass = document.getElementById("loginPass");
  if (!form) return;

  function safeNextUrl() {
    var params = new URLSearchParams(window.location.search);
    var raw = (params.get("next") || params.get("return") || "dashboard.html").trim();
    if (!raw) return "dashboard.html";
    if (/^[a-z]+:/i.test(raw) || raw.indexOf("//") === 0 || raw.indexOf("..") >= 0) {
      return "index.html";
    }
    if (!/\.[a-z0-9]{2,8}$/i.test(raw)) {
      raw += ".html";
    }
    return raw;
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var u = (user && user.value.trim()) || "";
    var p = (pass && pass.value) || "";

    if (!u || !p) {
      if (err) { err.textContent = "Нэр болон нууц үгээ оруулна уу."; err.hidden = false; }
      return;
    }

    var apiUrl = (A && A.API_URL) ? A.API_URL : "http://localhost:3000/api";

    fetch(apiUrl + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: u, password: p }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          try {
            sessionStorage.setItem("haruto_token", data.token);
            sessionStorage.setItem("haruto_user", data.username);
          } catch (e) {}
          if (err) { err.hidden = true; err.textContent = ""; }
          window.location.href = safeNextUrl();
        } else {
          if (err) { err.textContent = data.message || "Нэр эсвэл нууц үг буруу байна."; err.hidden = false; }
        }
      })
      .catch(function () {
        if (err) { err.textContent = "Сервертэй холбогдоход алдаа гарлаа."; err.hidden = false; }
      });
  });
})();
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Toast ---------- */
  var toast = document.getElementById("toast");
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 1800);
  }

  /* ---------- Cambio de casa (acento) ---------- */
  var houseButtons = document.querySelectorAll(".house-btn");
  function setHouse(house) {
    document.body.setAttribute("data-house", house);
    houseButtons.forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.house === house);
    });
    try { localStorage.setItem("house", house); } catch (e) {}
  }
  houseButtons.forEach(function (b) {
    b.addEventListener("click", function () { setHouse(b.dataset.house); });
  });
  try {
    var saved = localStorage.getItem("house");
    if (saved) setHouse(saved);
  } catch (e) {}

  /* ---------- Copiar color ---------- */
  document.querySelectorAll(".swatch").forEach(function (s) {
    s.addEventListener("click", function () {
      var hex = s.dataset.hex;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(hex).then(
          function () { showToast("Copiado " + hex); },
          function () { showToast(hex); }
        );
      } else {
        showToast(hex);
      }
    });
  });

  /* ---------- Tipografía interactiva ---------- */
  var specimen = document.getElementById("specimen");
  var range = document.getElementById("sizeRange");
  if (range && specimen) {
    range.addEventListener("input", function () {
      specimen.style.fontSize = range.value + "px";
    });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Enlace activo en el menú ---------- */
  var links = document.querySelectorAll('.nav__links a[href^="#"]');
  var sections = Array.prototype.map.call(links, function (a) {
    return document.querySelector(a.getAttribute("href"));
  });
  function markActive() {
    var y = window.scrollY + 120, current = null;
    sections.forEach(function (sec, i) {
      if (sec && sec.offsetTop <= y) current = links[i];
    });
    links.forEach(function (l) { l.classList.toggle("is-active", l === current); });
  }
  window.addEventListener("scroll", markActive, { passive: true });
  markActive();

  /* ---------- Botones sin destino ---------- */
  document.querySelectorAll("[data-noop]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });

  /* ---------- Formulario de demostración ---------- */
  var form = document.getElementById("demoForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".form__msg");
      var ok = true;
      form.querySelectorAll("input").forEach(function (inp) {
        var valid = inp.checkValidity() && inp.value.trim() !== "";
        inp.classList.toggle("is-invalid", !valid);
        if (!valid) ok = false;
      });
      msg.textContent = ok
        ? "Tu lechuza ha partido. Recibirás respuesta pronto."
        : "Revisa los campos marcados.";
      if (ok) form.reset();
    });
  }

  /* ---------- Campo de estrellas ---------- */
  var canvas = document.getElementById("stars");
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var stars = [];
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      var count = Math.min(140, Math.floor((canvas.width * canvas.height) / 14000));
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.4 + 0.3,
          p: Math.random() * Math.PI * 2,
          s: Math.random() * 0.02 + 0.005
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(function (st) {
        st.p += st.s;
        var a = 0.35 + Math.sin(st.p) * 0.3;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(241,230,204," + a.toFixed(2) + ")";
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    window.addEventListener("resize", resize);
    resize();
    draw();
  }
})();

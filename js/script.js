document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     DISASTER TABS (Hero)
  ========================== */

  const tabs = document.querySelectorAll(".dtab");

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // optional behavior: you can extend this later
      console.log("Selected disaster tab:", index);
    });
  });


  /* =========================
     CHECKLIST + PROGRESS BAR
  ========================== */

  const checkboxes = document.querySelectorAll(".checklist-item");
  const progressFill = document.querySelector(".progress-fill");

  let checkedCount = 0;
  const total = checkboxes.length;

  function updateProgress() {
    const percent = (checkedCount / total) * 100;
    if (progressFill) {
      progressFill.style.width = percent + "%";
    }
  }

  checkboxes.forEach(item => {
    const box = item.querySelector(".check-box");

    item.addEventListener("click", () => {
      const isChecked = item.classList.toggle("checked");

      if (box) {
        box.textContent = isChecked ? "✓" : "";
      }

      checkedCount += isChecked ? 1 : -1;
      updateProgress();
    });
  });


  /* =========================
     QUIZ SYSTEM
  ========================== */

  const options = document.querySelectorAll(".quiz-opt");
  const feedback = document.querySelector(".quiz-feedback");
  const nextBtn = document.querySelector(".quiz-btn");

  const correctAnswerIndex = 0;

  options.forEach((opt, index) => {
    opt.addEventListener("click", () => {

      options.forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");

      if (index === correctAnswerIndex) {
        feedback.textContent = "✔ Benar! Berlindung di bawah meja saat gempa.";
        feedback.style.color = "#2ecc71";
      } else {
        feedback.textContent = "✖ Kurang tepat. Hindari kaca dan benda berbahaya.";
        feedback.style.color = "#e74c3c";
      }
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      feedback.textContent = "";
      options.forEach(o => o.classList.remove("selected"));
    });
  }

  const canvas = document.getElementById("hero-canvas");

  if (canvas) {
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    // simple background animation placeholder
    function draw() {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(draw);
    }

    draw();
  }

});

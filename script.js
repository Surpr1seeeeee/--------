const letterButton = document.querySelector("#letterButton");
const letter = document.querySelector("#letter");
const letterClose = document.querySelector("#letterClose");
const canvas = document.querySelector("#glitter");
const ctx = canvas.getContext("2d");

let particles = [];
let animationFrame = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.setTransform(
    window.devicePixelRatio,
    0,
    0,
    window.devicePixelRatio,
    0,
    0
  );
}

function openLetter() {
  letter.hidden = false;
  letterButton.setAttribute("aria-expanded", "true");
  letterClose.focus();
  celebrate();
}

function closeLetter() {
  letter.hidden = true;
  letterButton.setAttribute("aria-expanded", "false");
  letterButton.focus();
}

function celebrate() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rect = letterButton.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const colors = ["#eef2ff", "#aeb9d4", "#697598", "#ffffff"];

  for (let i = 0; i < 42; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.8 + Math.random() * 5;

    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: 2 + Math.random() * 5,
      color: colors[i % colors.length],
      life: 55 + Math.random() * 35,
      rotation: Math.random() * Math.PI,
      spin: Math.random() * 0.16 - 0.08
    });
  }

  if (!animationFrame) paint();
}

function paint() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter((particle) => particle.life > 0);

  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += 0.06;
    particle.rotation += particle.spin;
    particle.life -= 1;

    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);
    ctx.globalAlpha = Math.min(particle.life / 30, 1);
    ctx.fillStyle = particle.color;

    ctx.fillRect(
      -particle.size / 2,
      -particle.size / 3,
      particle.size,
      particle.size * 0.6
    );

    ctx.restore();
  });

  if (particles.length) {
    animationFrame = requestAnimationFrame(paint);
  } else {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }
}

letterButton.addEventListener("click", openLetter);
letterClose.addEventListener("click", closeLetter);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !letter.hidden) closeLetter();
});

const cover = document.querySelector(".cover");

function moveScene(event) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const x = (event.clientX / window.innerWidth - 0.5) * 2;
  const y = (event.clientY / window.innerHeight - 0.5) * 2;

  cover.style.setProperty("--halo-x", `${x * 18}px`);
  cover.style.setProperty("--halo-y", `${y * 18}px`);

  cover.style.setProperty("--left-x", `${x * -8}px`);
  cover.style.setProperty("--left-y", `${y * -5}px`);

  cover.style.setProperty("--right-x", `${x * 12}px`);
  cover.style.setProperty("--right-y", `${y * 8}px`);

  cover.style.setProperty("--copy-x", `${x * -3}px`);
  cover.style.setProperty("--copy-y", `${y * -2}px`);
}

window.addEventListener("pointermove", moveScene, { passive: true });
window.addEventListener("resize", resizeCanvas);

const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

reveals.forEach((element) => revealObserver.observe(element));

const nextChapter = document.querySelector("#nextChapter");
const wishChapter = document.querySelector("#wishChapter");

nextChapter.addEventListener("click", () => {
  wishChapter.scrollIntoView({ behavior: "smooth", block: "start" });
});

const magicOrb = document.querySelector("#magicOrb");

magicOrb.addEventListener("click", () => {
  wishChapter.classList.remove("is-energized");
  void wishChapter.offsetWidth;
  wishChapter.classList.add("is-energized");
  magicOrb.classList.remove("is-active");
  void magicOrb.offsetWidth;
  magicOrb.classList.add("is-active");

  const rect = magicOrb.getBoundingClientRect();
  for (let i = 0; i < 9; i += 1) {
    setTimeout(() => {
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      particles.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * 9,
        vy: -2 - Math.random() * 8,
        size: 3 + Math.random() * 7,
        color: i % 3 === 0 ? "#ffffff" : i % 3 === 1 ? "#aeb9d4" : "#697598",
        life: 65 + Math.random() * 45,
        rotation: Math.random() * Math.PI,
        spin: Math.random() * 0.2 - 0.1
      });
    }, i * 55);
  }

  if (!animationFrame) paint();
  setTimeout(() => magicOrb.classList.remove("is-active"), 1300);
});

resizeCanvas();
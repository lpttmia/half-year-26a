const PHOTO_COUNT = 30;
const PHOTO_DIR = "assets/photos/";
const PHOTO_EXT = "jpg";
const SWIPE_DISTANCE = 50; // px

const deck = document.querySelector(".deck");
const prevBtn = document.querySelector('.arrow[data-dir="prev"]');
const nextBtn = document.querySelector('.arrow[data-dir="next"]');
const currentLabel = document.querySelector(".gallery__current");
const totalLabel = document.querySelector(".gallery__total");

let current = 0;
deck.replaceChildren();
const cards = [];

/* ---------- Створення карток ---------- */

deck.style.setProperty("--n", PHOTO_COUNT);
totalLabel.textContent = PHOTO_COUNT;

for (let i = 0; i < PHOTO_COUNT; i++) {
    const n = i + 1;

    const card = document.createElement("figure");
    card.className = "photo";
    card.dataset.n = n;
    card.style.setProperty("--i", i);
    card.style.setProperty("--tilt", `${((i * 7) % 9) - 4}deg`); // від -4° до +4°

    const img = document.createElement("img");
    img.alt = `Фото ${n}`;
    img.decoding = "async";
    if (i > 2) img.loading = "lazy";

    const markOrientation = () =>
        card.classList.toggle("is-portrait", img.naturalHeight > img.naturalWidth);

    img.addEventListener("load", markOrientation);
    img.addEventListener("error", () => card.classList.add("is-missing"));
    img.src = `${PHOTO_DIR}${n}.${PHOTO_EXT}`;
    if (img.complete && img.naturalWidth) markOrientation();

    card.append(img);
    deck.append(card);
    cards.push(card);
}

/* ---------- Відображення стану ---------- */

function render() {
    cards.forEach((card, i) => {
        const d = i - current;
        card.dataset.pos = d < 0 ? "gone" : d > 2 ? "far" : d;
        card.setAttribute("aria-hidden", d === 0 ? "false" : "true");
    });

    currentLabel.textContent = current + 1;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === PHOTO_COUNT - 1;
}

function go(step) {
    const next = Math.min(Math.max(current + step, 0), PHOTO_COUNT - 1);
    if (next === current) return;
    current = next;
    render();
}

/* ---------- Керування ---------- */

prevBtn.addEventListener("click", () => go(-1));
nextBtn.addEventListener("click", () => go(1));

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
});

// Свайп на телефоні
let startX = null;
deck.addEventListener("pointerdown", (e) => (startX = e.clientX));
deck.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) >= SWIPE_DISTANCE) go(dx < 0 ? 1 : -1);
});
deck.addEventListener("pointercancel", () => (startX = null));

render();
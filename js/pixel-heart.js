/* ================= НАЛАШТУВАННЯ ================= */

// Форма сердечка: X = плитка з фото, крапка = порожньо.
// Тут рівно 46 плиток, за кількістю ваших фото.
const SHAPE = [
    ".XX...XX.",
    "XXXX.XXXX",
    "XXXXXXXXX",
    "XXXXXXXXX",
    ".XXXXXXX.",
    "..XXXXX..",
    "...XXX...",
    "....X....",
];

const PHOTO_DIR = "assets/heart-photos/";
const PHOTO_EXT = "jpg";
const PHOTO_COUNT = 46;

const STEP = 70;               // мс між появою плиток (46 × 70 мс ≈ 3.2 с)
const VISIBLE_THRESHOLD = 0.4; // яка частина сердечка має бути на екрані для старту

/* ================================================ */

const heart = document.querySelector(".pixel-heart");
const rand = (min, max) => Math.random() * (max - min) + min;

if (heart) {
    /* ---------- Клітинки зі схеми ---------- */
    const cells = [];
    SHAPE.forEach((row, r) => {
        [...row].forEach((ch, c) => {
            if (ch === "X") cells.push({ row: r + 1, col: c + 1 });
        });
    });

    /* ---------- Випадковий порядок появи (Фішер-Єйтс) ---------- */
    const order = cells.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }

    /* ---------- Створення плиток ---------- */
    const fragment = document.createDocumentFragment();

    cells.forEach((cell, i) => {
        const tile = document.createElement("div");
        tile.className = "pixel";
        tile.setAttribute("aria-hidden", "true");
        tile.style.setProperty("--col", cell.col);
        tile.style.setProperty("--row", cell.row);
        tile.style.setProperty("--delay", `${order[i] * STEP}ms`);
        tile.style.setProperty("--rot", `${rand(-25, 25).toFixed(0)}deg`);

        const img = document.createElement("img");
        img.alt = "";
        img.decoding = "async";
        img.addEventListener("error", () => tile.classList.add("is-missing"));
        img.src = `${PHOTO_DIR}${(i % PHOTO_COUNT) + 1}.${PHOTO_EXT}`;

        tile.append(img);
        fragment.append(tile);
    });

    heart.append(fragment);

    // Початок «биття» після того, як з'явилась остання плитка
    heart.style.setProperty("--total", `${cells.length * STEP + 700}ms`);

    /* ---------- Запуск, коли сердечко видно на екрані ---------- */
    const reveal = () => heart.classList.add("is-visible");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    reveal();
                    observer.disconnect();
                }
            },
            { threshold: VISIBLE_THRESHOLD }
        );
        observer.observe(heart);
    } else {
        reveal();
    }
}
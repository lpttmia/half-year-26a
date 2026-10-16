/* ================= НАЛАШТУВАННЯ ================= */

const PHOTO_DIR = "assets/photos/";
const PHOTO_EXT = "jpg";
const PHOTOS = [31, 32, 33, 34, 35];
const LEAVES_PER_PHOTO = 2;           // 1 = кожне фото падає по одному

// Розмір мінікартки, % ширини сцени
const SIZE_MIN = 16;
const SIZE_MAX = 26;

// Бічні доріжки (% ширини сцени): гіфка займає приблизно 25–75%
const LANE_LEFT_END = 19;             // ліва доріжка закінчується тут (з запасом на гойдання)
const LANE_RIGHT_START = 81;          // права починається тут

/* ================================================ */

const stage = document.querySelector(".leaves");
const rand = (min, max) => Math.random() * (max - min) + min;

/* Орієнтація (горизонтальна / вертикальна) + заглушка, якщо файлу немає */
function trackImage(img, el) {
    const mark = () =>
        el.classList.toggle("is-portrait", img.naturalHeight > img.naturalWidth);

    img.addEventListener("load", mark);
    img.addEventListener("error", () => el.classList.add("is-missing"));
    if (img.complete && img.naturalWidth) mark();
}

if (stage) {
    /* ---------- Гіфка ---------- */
    const gifImg = stage.querySelector(".gif-frame img");
    if (gifImg) trackImage(gifImg, gifImg.closest(".gif-frame"));

    /* ---------- Висота падіння = висота сцени ---------- */
    const setFall = () =>
        stage.style.setProperty("--fall", `${stage.clientHeight + 20}px`);
    setFall();
    window.addEventListener("resize", setFall);

    /* ---------- Нові випадкові параметри польоту ---------- */
    function randomize(leaf) {
        const w = stage.clientWidth;
        const size = rand(SIZE_MIN, SIZE_MAX);
        const leftSide = Math.random() < 0.5;
        const flip = Math.random() < 0.5 ? 1 : -1;

        // Позиція всередині однієї з двох бічних доріжок
        const x = leftSide
            ? rand(1, Math.max(1, LANE_LEFT_END - size))
            : rand(LANE_RIGHT_START, 99 - size);

        leaf.style.setProperty("--size", `${size.toFixed(1)}%`);
        leaf.style.setProperty("--x", `${x.toFixed(1)}%`);
        leaf.style.setProperty("--drift", `${(rand(-0.02, 0.02) * w).toFixed(0)}px`);
        leaf.style.setProperty("--amp", `${(rand(0.015, 0.03) * w).toFixed(0)}px`);
        leaf.style.setProperty("--rot-a", `${(flip * rand(-35, -5)).toFixed(0)}deg`);
        leaf.style.setProperty("--rot-b", `${(flip * rand(5, 35)).toFixed(0)}deg`);
        leaf.style.setProperty("--y", `${rand(0, 70).toFixed(0)}%`);   // для reduced-motion
    }

    /* ---------- Створення листя ---------- */
    const fragment = document.createDocumentFragment();

    for (let r = 0; r < LEAVES_PER_PHOTO; r++) {
        PHOTOS.forEach((n) => {
            const dur = rand(9, 15);

            const leaf = document.createElement("div");
            leaf.className = "leaf";
            leaf.setAttribute("aria-hidden", "true");
            leaf.style.setProperty("--dur", `${dur.toFixed(1)}s`);
            leaf.style.setProperty("--sway-dur", `${rand(2.2, 3.6).toFixed(1)}s`);
            // Від'ємна затримка: листя вже в польоті з першої секунди
            leaf.style.setProperty("--delay", `${(-rand(0, dur)).toFixed(1)}s`);

            const card = document.createElement("div");
            card.className = "leaf__card";

            const img = document.createElement("img");
            img.alt = "";
            img.decoding = "async";
            img.loading = "lazy";
            trackImage(img, card);
            img.src = `${PHOTO_DIR}${n}.${PHOTO_EXT}`;

            card.append(img);
            leaf.append(card);
            randomize(leaf);

            // Кожен новий політ: новий кут, розмір і доріжка
            leaf.addEventListener("animationiteration", (e) => {
                if (e.animationName === "leaf-fall") randomize(leaf);
            });

            fragment.append(leaf);
        });
    }

    stage.append(fragment);
}
const container = document.querySelector(".hearts");

const COUNT_DESKTOP = 22;
const COUNT_MOBILE = 12;
const COLORS = ["#ff8fb8", "#7cc4ff", "#ffffff", "#ffb3d1"];

const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

if (container) {
    const count = window.innerWidth < 700 ? COUNT_MOBILE : COUNT_DESKTOP;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
        const dur = rand(18, 40);

        const heart = document.createElement("span");
        heart.className = "heart";

        heart.style.setProperty("--x", `${rand(0, 96).toFixed(1)}%`);
        heart.style.setProperty("--y", `${rand(0, 92).toFixed(1)}%`);       // для reduced-motion
        heart.style.setProperty("--size", `${rand(18, 70).toFixed(0)}px`);
        heart.style.setProperty("--c", pick(COLORS));
        heart.style.setProperty("--op", rand(0.25, 0.6).toFixed(2));
        heart.style.setProperty("--rot", `${rand(-30, 30).toFixed(0)}deg`);
        heart.style.setProperty("--drift", `${rand(-80, 80).toFixed(0)}px`);
        heart.style.setProperty("--dur", `${dur.toFixed(1)}s`);
        // Від'ємна затримка: сердечка вже «в польоті» з першої секунди
        heart.style.setProperty("--delay", `${(-rand(0, dur)).toFixed(1)}s`);

        fragment.append(heart);
    }

    container.append(fragment);
}
/* ================= НАЛАШТУВАННЯ ================= */

// Початок відліку для годин і секунд.
// Увага: місяць рахується з нуля! 0 = січень, 3 = квітень, 11 = грудень.
const START_YEAR = 2026;
const START_MONTH = 3;
const START_DAY = 16;
const START_HOUR = 20;
const START_MINUTE = 34;

// Часовий пояс початкового часу відносно UTC:
// Київ влітку = 3 (EEST), узимку = 2 (EET).
const START_UTC_OFFSET = 3;

// Фіксовані значення
const FIXED_MONTHS = 6;
const FIXED_DAYS = 183;

const DURATION = 3000;    // тривалість інтро-лічби 0 → N, мс
const START_DELAY = 300;  // пауза перед стартом, мс

/* ================================================ */

const HOUR_MS = 3600 * 1000;
const START = new Date(
    Date.UTC(START_YEAR, START_MONTH, START_DAY, START_HOUR, START_MINUTE) -
    START_UTC_OFFSET * HOUR_MS
);

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function getValues(now = new Date()) {
    const ms = Math.max(0, now - START);
    return {
        months: FIXED_MONTHS,
        days: FIXED_DAYS,
        hours: Math.floor(ms / HOUR_MS),
        seconds: Math.floor(ms / 1000),
    };
}

/* ---------- Відображення ---------- */

const items = [...document.querySelectorAll(".counter__value")].map((el) => ({
    el,
    unit: el.dataset.unit,
    shown: null,
}));

function show(item, value) {
    if (item.shown === value) return;   // не чіпаємо DOM без потреби
    item.shown = value;
    item.el.textContent = value;
}

function updateLive() {
    const values = getValues();
    items.forEach((item) => show(item, values[item.unit]));
}

/* ---------- Запуск ---------- */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function startLive() {
    updateLive();
    setInterval(updateLive, 250);
}

if (items.length) {
    if (reduceMotion) {
        startLive();
    } else {
        items.forEach((item) => show(item, 0));

        setTimeout(() => {
            const t0 = performance.now();

            function frame(now) {
                const t = Math.min((now - t0) / DURATION, 1);
                const progress = easeOutCubic(t);
                const values = getValues();

                items.forEach((item) => show(item, Math.round(values[item.unit] * progress)));

                if (t < 1) {
                    requestAnimationFrame(frame);
                } else {
                    startLive();
                }
            }

            requestAnimationFrame(frame);
        }, START_DELAY);
    }
}
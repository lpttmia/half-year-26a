import { sendAnswer, SEPARATOR } from "./answer.js";

const COOLDOWN = 3000; // мс між записами відмов

const start = document.querySelector('[data-state="start"]');
const invite = document.querySelector('[data-state="invite"]');
const readBtn = document.querySelector('[data-action="read"]');
const declineBtn = document.querySelector('[data-action="decline"]');

readBtn?.addEventListener("click", () => {
    start.hidden = true;
    invite.hidden = false;
    invite.querySelector(".card__title")?.focus({ preventScroll: true });
});

// Візуально нічого не відбувається, але відмова записується
let lastDecline = 0;
declineBtn?.addEventListener("click", () => {
    const now = Date.now();
    if (now - lastDecline < COOLDOWN) return;
    lastDecline = now;

    sendAnswer(`Зафіксовано відмову\n${SEPARATOR}`, "Відмова").catch(console.error);
});
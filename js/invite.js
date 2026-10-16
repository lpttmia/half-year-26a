import { sendAnswer, SEPARATOR } from "./answer.js";

const form = document.querySelector("#invite-form");
const status = document.querySelector("#form-status");
const done = document.querySelector("#invite-done");
const submit = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (e) => {
    e.preventDefault();   // сюди потрапляємо лише після успішної перевірки required

    const data = new FormData(form);
    const text = [
        `Де зустрінемось: ${data.get("place")}`,
        `Коли зустрінемось: ${data.get("time")}`,
        `Куди підемо: ${String(data.get("where")).trim()}`,
        SEPARATOR,
    ].join("\n");

    submit.disabled = true;
    status.textContent = "Надсилаю…";

    try {
        await sendAnswer(text, "Відповідь на запрошення");
        form.hidden = true;
        status.textContent = "";
        done.hidden = false;
        done.focus();
    } catch (err) {
        console.error(err);
        status.textContent = "Не вдалося надіслати. Спробуй ще раз.";
        submit.disabled = false;
    }
});
/* ================= НАЛАШТУВАННЯ ================= */

// Ключ із https://web3forms.com (вводите свою пошту, ключ приходить листом).
// Поки він не вписаний, відповіді лише виводяться в консоль.
const ACCESS_KEY = "33447920-da90-4023-a0ea-decb41ac45e6";

const ENDPOINT = "https://api.web3forms.com/submit";

/* ================================================ */

export const SEPARATOR = "---------------";

export async function sendAnswer(text, subject = "Відповідь з листівки") {
    if (ACCESS_KEY.startsWith("ВСТАВТЕ")) {
        console.info("[answer, ключ не вписаний]\n" + text);
        return;
    }

    const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
            access_key: ACCESS_KEY,
            subject,
            from_name: "Листівка",
            message: text,
        }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
        throw new Error(data.message || `HTTP ${res.status}`);
    }
}
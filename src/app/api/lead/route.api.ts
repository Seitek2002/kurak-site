import { NextResponse } from "next/server";

/**
 * Заявка с сайта → Telegram-бот агентства.
 * Нужны TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID (см. .env.example).
 * Без них отвечаем 503 и форма честно говорит, что заявка не ушла.
 */

type Lead = {
  name?: unknown;
  contact?: unknown;
  task?: unknown;
  timing?: unknown;
  budget?: unknown;
  services?: unknown;
  page?: unknown;
};

const str = (v: unknown, max = 600) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (v: string) => v.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);

export async function POST(req: Request) {
  let body: Lead;
  try {
    body = (await req.json()) as Lead;
  } catch {
    return NextResponse.json({ message: "Не получилось прочитать заявку." }, { status: 400 });
  }

  const name = str(body.name, 120);
  const contact = str(body.contact, 120);
  if (name.length < 2 || contact.length < 5) {
    return NextResponse.json({ message: "Нужны имя и телефон или Telegram." }, { status: 422 });
  }

  const services = Array.isArray(body.services)
    ? body.services.filter((x): x is string => typeof x === "string").slice(0, 30)
    : [];

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) {
    return NextResponse.json(
      { message: "Форма пока не подключена к Telegram-боту агентства, заявка не отправлена." },
      { status: 503 },
    );
  }

  const lines = [
    "<b>Заявка с сайта</b>",
    `Имя: ${esc(name)}`,
    `Контакт: ${esc(contact)}`,
    services.length ? `Подборка: ${esc(services.join(", "))}` : "",
    str(body.task) ? `Задача: ${esc(str(body.task))}` : "",
    str(body.timing, 60) ? `Сроки: ${esc(str(body.timing, 60))}` : "",
    str(body.budget, 60) ? `Бюджет: ${esc(str(body.budget, 60))}` : "",
    str(body.page, 80) ? `Страница: ${esc(str(body.page, 80))}` : "",
  ].filter(Boolean);

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text: lines.join("\n"), parse_mode: "HTML" }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) throw new Error(String(r.status));
  } catch {
    return NextResponse.json({ message: "Заявка не ушла. Попробуйте ещё раз через минуту." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

const APP_ORIGIN = "https://amiraammiirr1000-ai.github.io";

function corsHeaders(origin) {
  const allowed = origin === APP_ORIGIN || origin === "http://localhost:8788";
  return {
    "Access-Control-Allow-Origin": allowed ? origin : APP_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}
function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) }
  });
}
function extractText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text.trim();
  const parts = [];
  for (const item of (data.output || [])) {
    if (item.type !== "message") continue;
    for (const part of (item.content || [])) {
      if (part.type === "output_text" && typeof part.text === "string") parts.push(part.text);
    }
  }
  return parts.join("\n").trim();
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    const url = new URL(request.url);
    if (url.pathname === "/health" && request.method === "GET") {
      return json({
        ok: true,
        configured: Boolean(env.OPENAI_API_KEY),
        accessProtected: Boolean(env.APP_ACCESS_TOKEN),
        service: "amoozesh-ba-amir-smart-teacher"
      }, 200, origin);
    }
    if (url.pathname !== "/api/tutor" || request.method !== "POST") {
      return json({ error: "مسیر درخواست پیدا نشد." }, 404, origin);
    }
    if (!env.OPENAI_API_KEY) return json({ error: "کلید هوش مصنوعی در تنظیمات سرور ثبت نشده است." }, 503, origin);
    if (env.APP_ACCESS_TOKEN) {
      const auth = request.headers.get("Authorization") || "";
      if (auth !== `Bearer ${env.APP_ACCESS_TOKEN}`) return json({ error: "دسترسی مجاز نیست." }, 401, origin);
    }
    let body;
    try { body = await request.json(); } catch { return json({ error: "درخواست معتبر نیست." }, 400, origin); }
    const question = typeof body.question === "string" ? body.question.trim() : "";
    if (!question || question.length > 2500) return json({ error: "سؤال باید بین ۱ تا ۲۵۰۰ نویسه باشد." }, 400, origin);

    const instructions = `تو «معلم هوشمند امیر» هستی؛ آموزگار صبور و متخصص آموزش ابتدایی، به‌ویژه ریاضی پایه ششم ایران.
به فارسی روان و متناسب با سن دانش‌آموز پاسخ بده. ابتدا مفهوم را ساده توضیح بده، سپس راه‌حل را مرحله‌به‌مرحله نشان بده و در پایان یک سؤال کوتاه برای سنجش فهم دانش‌آموز بپرس.
اگر سؤال ریاضی است، محاسبات را دقیق انجام بده و پاسخ را دوباره بررسی کن. اگر صورت سؤال مبهم است، فقط یک سؤال روشن‌کننده بپرس و حدس نزن.
از تحقیر، سرزنش، پاسخ‌های طولانی و اصطلاحات پیچیده دوری کن. جواب را با تیترهای کوتاه و مثال ساده منظم کن.
در موضوعات خارج از آموزش مدرسه، صادقانه محدودیت را بگو و ادعای دانستن چیزی را که نمی‌دانی مطرح نکن. اطلاعات شخصی دانش‌آموز را درخواست نکن.`;

    let upstream;
    try {
      upstream = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: env.AI_MODEL || "gpt-4.1-mini",
          instructions,
          input: question,
          max_output_tokens: 650,
          store: false
        })
      });
    } catch {
      return json({ error: "ارتباط با سرویس هوش مصنوعی برقرار نشد." }, 502, origin);
    }
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return json({ error: data.error?.message || "سرویس هوش مصنوعی خطا داد." }, 502, origin);
    }
    const answer = extractText(data);
    if (!answer) return json({ error: "پاسخ متنی از مدل دریافت نشد." }, 502, origin);
    return json({ answer, mode: "online" }, 200, origin);
  }
};

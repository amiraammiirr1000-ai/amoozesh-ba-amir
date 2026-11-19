const APP_ORIGINS = new Set([
  "https://amiraammiirr1000-ai.github.io",
  "capacitor://localhost",
  "http://localhost"
]);

function corsHeaders(origin) {
  const allowed = APP_ORIGINS.has(origin) || origin === "http://localhost:8788";
  return {
    ...(allowed ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}
function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...corsHeaders(origin) }
  });
}
const INSTRUCTIONS = `تو «معلم هوشمند امیر» هستی؛ آموزگار صبور و متخصص آموزش ابتدایی، به‌ویژه ریاضی پایه ششم ایران.
به فارسی روان و متناسب با سن دانش‌آموز پاسخ بده. ابتدا مفهوم را ساده توضیح بده، سپس راه‌حل را مرحله‌به‌مرحله نشان بده و در پایان یک سؤال کوتاه برای سنجش فهم دانش‌آموز بپرس.
اگر سؤال ریاضی است، محاسبات را دقیق انجام بده و پاسخ را بررسی کن. اگر صورت سؤال مبهم است، یک سؤال روشن‌کننده بپرس.
از تحقیر، سرزنش و اصطلاحات پیچیده دوری کن. اطلاعات شخصی دانش‌آموز را درخواست نکن.`;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });

    const url = new URL(request.url);
    if (url.pathname === "/health" && request.method === "GET") {
      return json({
        ok: true,
        configured: Boolean(env.GROQ_API_KEY),
        accessProtected: Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY),
        service: "amoozesh-ba-amir-smart-teacher",
        provider: "Groq"
      }, 200, origin);
    }
    if (url.pathname !== "/api/tutor" || request.method !== "POST") {
      return json({ error: "مسیر درخواست پیدا نشد." }, 404, origin);
    }

    if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
      return json({ error: "تنظیم احراز هویت Supabase روی سرور کامل نشده است." }, 503, origin);
    }
    const auth = request.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) return json({ error: "برای استفاده از معلم هوشمند ابتدا وارد حساب کاربری شو." }, 401, origin);
    let authCheck;
    try {
      authCheck = await fetch(env.SUPABASE_URL.replace(/\/+$/, "") + "/auth/v1/user", {
        method: "GET",
        headers: {
          "apikey": env.SUPABASE_ANON_KEY,
          "Authorization": auth
        }
      });
    } catch {
      return json({ error: "بررسی نشست کاربر در Supabase ناموفق بود." }, 502, origin);
    }
    if (!authCheck.ok) return json({ error: "نشست ورود معتبر نیست یا منقضی شده است؛ دوباره وارد حساب شو." }, 401, origin);
    const user = await authCheck.json().catch(() => null);
    if (!user || !user.id) return json({ error: "هویت کاربر تأیید نشد." }, 401, origin);

    if (!env.GROQ_API_KEY) return json({ error: "کلید Groq در تنظیمات محرمانه سرور ثبت نشده است." }, 503, origin);
    let body;
    try { body = await request.json(); } catch { return json({ error: "درخواست معتبر نیست." }, 400, origin); }
    const question = typeof body.question === "string" ? body.question.trim() : "";
    if (!question || question.length > 2500) return json({ error: "سؤال باید بین ۱ تا ۲۵۰۰ نویسه باشد." }, 400, origin);

    let upstream;
    try {
      upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: env.GROQ_MODEL || "openai/gpt-oss-120b",
          temperature: 0.35,
          max_completion_tokens: 1200,
          messages: [
            { role: "system", content: INSTRUCTIONS },
            { role: "user", content: question }
          ],
          stream: false
        })
      });
    } catch {
      return json({ error: "ارتباط با سرویس DeepSeek برقرار نشد." }, 502, origin);
    }
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return json({ error: data.error?.message || "سرویس هوش مصنوعی خطا داد." }, 502, origin);
    }
    const answer = data.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) return json({ error: "پاسخ متنی از مدل دریافت نشد." }, 502, origin);
    return json({ answer: answer.trim(), mode: "online" }, 200, origin);
  }
};

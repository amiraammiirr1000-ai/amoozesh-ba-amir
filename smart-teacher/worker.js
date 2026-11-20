// Groq-backed smart teacher Worker; deployed through Cloudflare Git integration.
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
const INSTRUCTIONS = `تو «معلم هوشمند امیر» هستی؛ آموزگار حرفه‌ای، صبور و خلاق آموزش ابتدایی ایران. مأموریت تو فقط جواب دادن نیست؛ باید یادگیری عمیق و مستقل ایجاد کنی.

قانون دقت ریاضی: پیش از پاسخ، نوع عمل و خواسته سؤال را تشخیص بده. «کسر» را هرگز با «منها» اشتباه نگیر. خط کسری به معنی تقسیم صورت بر مخرج است؛ علامت منفی فقط وقتی وجود دارد که صریحاً کنار عدد یا کسر آمده باشد. اگر سؤال مبهم است، قبل از حل یک سؤال روشن‌کننده بپرس. همه محاسبات را دوباره کنترل کن و اگر پاسخ قبلی اشتباه بود، صریحاً اصلاح و دلیلش را بگو.\n\nاصول تدریس:
۱) ابتدا سطح و هدف سؤال را تشخیص بده. اگر پایه مشخص نیست، با فرض پایه ششم ابتدایی توضیح بده و در صورت نیاز یک سؤال کوتاه برای روشن شدن موضوع بپرس.
۲) پاسخ را با یک عنوان روشن و توضیح شهودی و ساده آغاز کن؛ پیش‌نیازها و معنی اصطلاحات را توضیح بده.
۳) آموزش را مرحله‌به‌مرحله پیش ببر و هیچ جهش محاسباتی نداشته باش. در ریاضی، هر مرحله محاسبه را بنویس و در پایان پاسخ را با روش دوم یا جایگذاری کنترل کن.
۴) دست‌کم دو مثال حل‌شده مرتبط ارائه کن: یکی ساده و یکی کمی چالشی. مثال‌ها باید اعداد و موقعیت‌های واقعی و متنوع داشته باشند و راه‌حل کامل داشته باشند.
۵) پس از مثال‌ها، یک روش یا نکته کلیدی، اشتباه رایج و راه جلوگیری از آن را توضیح بده.
۶) در پایان دو تمرین متناسب با سطح دانش‌آموز بده؛ پاسخ تمرین را فوراً لو نده. از دانش‌آموز بخواه جواب بدهد تا بررسی و بازخورد مرحله‌ای ارائه کنی.
۷) اگر دانش‌آموز فقط جواب نهایی خواست، پاسخ را بده اما توضیح کوتاه و قابل فهم را نیز اضافه کن. اگر گفت کوتاه، خلاصه کن؛ اگر گفت بیشتر، عمیق‌تر و با مثال‌های تازه ادامه بده.
۸) در گفت‌وگوی چندمرحله‌ای، پیام‌های قبلی را در نظر بگیر، از تکرار بی‌دلیل پرهیز کن و درس را از همان نقطه ادامه بده.
۹) برای موضوعات غیر درسی نیز مفید و محترمانه پاسخ بده؛ اگر چیزی خارج از دانش یا نامطمئن است، صادقانه بیان کن و منبع یا واقعیت ساختگی نساز.
۱۰) فارسی روان، لحن تشویق‌کننده و مناسب کودک به کار ببر. از سرزنش، تحقیر، اطلاعات شخصی و پاسخ‌های کلیشه‌ای دوری کن.

قالب پیشنهادی برای درس‌ها:
- مفهوم به زبان ساده
- مراحل حل یا توضیح
- مثال حل‌شده ۱ و ۲
- نکته طلایی و اشتباه رایج
- تمرین برای دانش‌آموز

قواعد ویژه نمایش ریاضی در پاسخ فارسی: هر فرمول یا عبارت محاسباتی را در یک خط جداگانه بنویس؛ از چسباندن عددها به متن فارسی خودداری کن. کسر را به شکل روشن «۳/۴» بنویس و بلافاصله معنی آن را با واژه‌ها توضیح بده (۳ قسمت از ۴ قسمت مساوی). برای جمع و تفریق، علامت عمل را دقیق و جداگانه بنویس؛ نمونه: «۱/۴ + ۲/۴ = ۳/۴». هرگز برای نمایش کسر از خط تیره یا علامت منها استفاده نکن. از نوشتن فرمول مبهم مانند «۳ ۴» خودداری کن. عددها را یکدست با رقم فارسی بنویس.\n\nبرای آموزش کسرها: ابتدا صورت و مخرج و مفهوم قسمت‌های مساوی را با مثال تصویریِ کلامی توضیح بده؛ سپس تفاوت کسر با عدد منفی و تفاوت خط کسری با علامت منها را روشن کن. برای جمع/تفریق کسرها، فقط وقتی سؤال عمل جمع/تفریق خواسته آن عمل را انجام بده. برای مقایسه کسرها از روش مناسب و با توضیح استفاده کن. دو مثال حل‌شده را با بررسی پاسخ ارائه کن.\n\nبرای ریاضی ششم ایران، به مفاهیم کتاب درسی وفادار بمان. اگر متن دقیق کتاب یا تصویر سؤال در اختیار تو نیست، ادعا نکن که عین عبارت کتاب را نقل می‌کنی. `;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });

    const url = new URL(request.url);
    if (url.pathname === "/health" && request.method === "GET") {
      return json({
        ok: true,
        configured: Boolean(env.GROQ_API_KEY),
        keyStartsCorrectly: String(env.GROQ_API_KEY || "").trim().startsWith("gsk_"),
        keyHasWhitespace: /\\s/.test(String(env.GROQ_API_KEY || "")),
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

    const groqApiKey = String(env.GROQ_API_KEY || "").trim();
    if (!groqApiKey) return json({ error: "کلید Groq در تنظیمات محرمانه سرور ثبت نشده است." }, 503, origin);
    let body;
    try { body = await request.json(); } catch { return json({ error: "درخواست معتبر نیست." }, 400, origin); }
    const question = typeof body.question === "string" ? body.question.trim() : "";\n    const history = Array.isArray(body.history) ? body.history.slice(-10).filter(m => m && ["user","assistant"].includes(m.role) && typeof m.content === "string").map(m => ({ role: m.role, content: m.content.slice(0, 5000) })) : [];
    if (!question || question.length > 2500) return json({ error: "سؤال باید بین ۱ تا ۲۵۰۰ نویسه باشد." }, 400, origin);

    let upstream;
    try {
      upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: env.GROQ_MODEL || "openai/gpt-oss-120b",
          temperature: 0.35,
          max_completion_tokens: 3000,
          messages: [
            { role: "system", content: INSTRUCTIONS },
            { role: "user", content: question }
          ],
          stream: false
        })
      });
    } catch {
      return json({ error: "ارتباط با سرویس Groq برقرار نشد." }, 502, origin);
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

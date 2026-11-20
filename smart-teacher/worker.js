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
const INSTRUCTIONS = `تو «معلم هوشمند آموزش با امیر» هستی؛ یک معلم خصوصی دقیق، خوش‌بیان، صبور و باتجربه برای دانش‌آموزان ایرانی، به‌ویژه پایه‌های اول تا ششم. هدف تو یادگیری واقعی است، نه تولید متن طولانی.

اصل اول ــ دقیقاً به سؤال پاسخ بده:
- ابتدا منظور و نوع درخواست را تشخیص بده و پاسخ مستقیم را در همان ۱ تا ۳ جمله اول ارائه کن.
- اگر سؤال ساده است، پاسخ را کوتاه و روشن نگه دار: یک توضیح ساده و حداکثر یک مثال کافی است. در پایان فقط در صورت مفید بودن پیشنهاد بده بیشتر توضیح بدهی.
- اگر کاربر صریحاً «کامل»، «با جزئیات»، «چند مثال» یا «مرحله‌به‌مرحله» خواست، توضیح را متناسب گسترش بده.
- برای یک سؤال، بی‌دلیل چندین عنوان، جدول، تمرین، نکته تکراری و مثال اضافه تولید نکن. جدول فقط وقتی لازم است که مقایسه خواسته شده باشد.
- سطح توضیح را از متن سؤال و سابقه گفت‌وگو تشخیص بده. اگر پایه معلوم نیست، برای مفاهیم درسی با زبان ساده و مناسب پایه ششم شروع کن؛ سؤال روشن‌کننده غیرضروری نپرس.
- لحن گرم و محترمانه باشد، اما از خطاب‌های کودکانه و ایموجی‌های فراوان پرهیز کن.

اصل دوم ــ آموزش مفهومی و مرحله‌ای:
- مفهوم را با زبان روزمره و مثال ملموس توضیح بده؛ اصطلاحات را همان‌جا تعریف کن.
- در حل مسئله، مراحل را شماره‌گذاری کن و هیچ جهش محاسباتی نداشته باش.
- ابتدا روش استاندارد و ساده متناسب با کتاب درسی ایران را آموزش بده؛ روش‌های پیشرفته را فقط در صورت نیاز مطرح کن.
- اگر دانش‌آموز پاسخ یا راه‌حل خودش را فرستاد، ابتدا همان را بررسی کن، محل دقیق اشتباه را نشان بده و از نو درس طولانی نده.
- اگر فقط جواب نهایی خواسته شد، جواب را مستقیم بده و توضیح را کوتاه نگه دار.
- اگر موضوع مبهم یا داده‌ها ناکافی‌اند، فقط یک سؤال روشن‌کننده و مشخص بپرس.

اصل سوم ــ دقت ریاضی:
- پیش از پاسخ، نوع عمل و خواسته را تشخیص بده. کسر را هرگز با تفریق اشتباه نگیر؛ خط کسری یعنی تقسیم صورت بر مخرج. علامت منفی فقط وقتی وجود دارد که صریحاً نوشته شده باشد.
- صورت کسر بالای خط و مخرج پایین خط است. در جمع و تفریق کسرها، ابتدا مخرج مشترک می‌گیریم و سپس صورت‌ها را جمع یا تفریق می‌کنیم؛ مخرج‌ها را با هم جمع یا تفریق نمی‌کنیم.
- همه محاسبات را در ذهن دوباره کنترل کن؛ اگر پاسخ قبلی اشتباه بود، صریحاً اصلاحش کن.
- هیچ فرمول، نتیجه، نقل‌قول از کتاب یا منبعی را جعل نکن. اگر مطمئن نیستی، صادقانه بگو.

قواعد نمایش فارسی و ریاضی:
- پاسخ فارسی، راست‌چین و روان باشد. از رقم‌های فارسی استفاده کن.
- هر عبارت ریاضی را در خطی جدا و خوانا بنویس؛ مثال: «۱/۴ + ۲/۴ = ۳/۴».
- کسر را با خط مورب روشن بنویس و بلافاصله در صورت نیاز معنایش را به کلام توضیح بده. هرگز خط کسر را با خط تیره جایگزین نکن.
- از فرمول‌های لاتک پیچیده، جدول‌های عریض، خط‌های شکسته و مخلوط کردن چند عبارت در یک خط پرهیز کن؛ مگر کاربر نمایش پیشرفته بخواهد.
- از نشانه‌گذاری منظم استفاده کن؛ هر بند فقط یک ایده داشته باشد.

قواعد تعامل:
- سابقه مکالمه را بخوان و از تکرار مطالبی که قبلاً توضیح داده‌ای خودداری کن.
- پاسخ تمرین را تا وقتی دانش‌آموز درخواست نکرده، لو نده.
- برای تمرین یا آزمون، تعداد سؤال‌ها را فقط مطابق درخواست کاربر تعیین کن.
- در موضوعات خارج از درس نیز مفید و مسئولانه پاسخ بده و محدودیت دانشت را پنهان نکن.

نمونه رفتار مطلوب:
اگر دانش‌آموز بپرسد «جمع و تفریق دو کسر چطوری میشه؟»، ابتدا کوتاه بگو: «اگر مخرج‌ها برابر باشند، صورت‌ها را جمع یا تفریق می‌کنیم و مخرج ثابت می‌ماند؛ اگر متفاوت باشند، اول مخرج مشترک می‌گیریم.» سپس یک مثال با مخرج برابر و یک مثال با مخرج متفاوت بیاور. از جدول، تاریخچه، تمرین‌های متعدد و توضیح‌های نامرتبط خودداری کن.

برای ریاضی ششم ایران، با مفاهیم و سطح کتاب درسی هماهنگ باش. اگر متن یا تصویر دقیق کتاب در دسترس نیست، ادعا نکن عین متن کتاب را نقل می‌کنی.`;

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
    const question = typeof body.question === "string" ? body.question.trim() : "";
    const history = Array.isArray(body.history) ? body.history.slice(-8).filter(m => m && ["user","assistant"].includes(m.role) && typeof m.content === "string").map(m => ({ role: m.role, content: m.content.slice(0, 2500) })) : [];
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
          temperature: 0.2,
          max_completion_tokens: 3000,
          messages: [
            { role: "system", content: INSTRUCTIONS },
            ...history,
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

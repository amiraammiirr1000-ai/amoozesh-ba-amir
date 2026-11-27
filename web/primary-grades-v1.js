/* Primary mathematics pathways, grades 1–5. Original supplementary lessons; align final worksheets with the current textbook edition. */
(()=>{
'use strict';
const curriculum={
1:{name:'اول ابتدایی',topics:[
['شمارش و عددهای ۰ تا ۲۰','هر عدد نشان می‌دهد چند چیز داریم. برای شمردن، هر شیء را فقط یک بار بشمار.','اگر ۷ مداد داشته باشیم و ۲ مداد دیگر بگیریم، تعداد ۹ می‌شود.','اشیا را یکی‌یکی لمس کن و بشمار؛ بعد عدد را با رقم بنویس.',[['۵ تا سیب داریم؛ ۲ تا دیگر اضافه کنیم چندتا می‌شود؟','۷'],['عدد بعد از ۱۲ چیست؟','۱۳'],['کدام بیشتر است: ۸ یا ۶؟','۸'] ]],
['جمع و تفریق تا ۲۰','جمع یعنی کنار هم گذاشتن و بیشتر شدن؛ تفریق یعنی کم کردن یا پیدا کردن باقی‌مانده.','۸+۵ را می‌توانیم با رسیدن از ۸ به ۱۰ حل کنیم: ۲ تا برداریم، ۳ تا می‌ماند؛ پاسخ ۱۳.','برای جمع از چوب‌خط یا انگشت کمک بگیر؛ برای تفریق از عدد بزرگ‌تر به عقب بشمار.',[['۶+۷ چند می‌شود؟','۱۳'],['۱۵−۸ چند می‌شود؟','۷'],['۴+۹ چند می‌شود؟','۱۳']]],
['الگو و دسته‌بندی','الگو یعنی ترتیبی که با یک قانون تکرار می‌شود.','قرمز، آبی، قرمز، آبی… پس بعدی قرمز است.','رنگ، شکل یا عددهای تکرارشونده را پیدا کن و قانون را با زبان خودت بگو.',[['۲،۴،۶،… عدد بعدی؟','۸'],['دایره، مربع، دایره، مربع؛ بعدی چیست؟','دایره'],['۱،۲،۱،۲،… دو عدد بعدی؟','۱،۲']]],
['شکل‌های هندسی','شکل‌ها را از روی گوشه‌ها و ضلع‌ها می‌شناسیم.','مثلث ۳ ضلع و ۳ گوشه دارد؛ مربع ۴ ضلع برابر دارد.','شکل‌ها را در محیط پیدا کن؛ ضلع‌ها و گوشه‌ها را بشمار.',[['مثلث چند ضلع دارد؟','۳'],['مربع چند گوشه دارد؟','۴'],['کدام گرد است و گوشه ندارد؟ دایره یا مستطیل؟','دایره']]],
['اندازه‌گیری و زمان','برای مقایسه طول، جرم و زمان از واحد و ابزار مناسب استفاده می‌کنیم.','مداد را با خط‌کش اندازه می‌گیریم؛ طول آن ممکن است ۱۲ سانتی‌متر باشد.','برای طول از خط‌کش، برای زمان از ساعت و برای جرم از ترازو استفاده کن.',[['یک ساعت چند دقیقه است؟','۶۰'],['برای اندازه‌گیری طول میز از چه ابزاری استفاده می‌کنیم؟','خط‌کش یا متر'],['کدام بلندتر است: ۲۰ سانتی‌متر یا ۱۵ سانتی‌متر؟','۲۰ سانتی‌متر']]],
['مسئله‌های روزمره','در مسئله باید بدانیم چه چیزی را می‌دانیم و چه چیزی را می‌خواهیم.','۳ توپ داریم؛ ۲ توپ دیگر می‌خریم؛ روی‌هم ۵ توپ داریم.','داستان را نقاشی کن، داده‌ها را پیدا کن و سپس جمع یا تفریق را انتخاب کن.',[['سارا ۵ گل داشت و ۳ گل چید؛ حالا چند گل دارد؟','۸'],['۱۰ بادکنک بود؛ ۴ تا ترکید؛ چندتا ماند؟','۶'],['۲ گربه و ۳ سگ داریم؛ چند حیوان داریم؟','۵']]]]},
2:{name:'دوم ابتدایی',topics:[
['عددهای سه‌رقمی','هر عدد سه‌رقمی از صدگان، دهگان و یکان ساخته می‌شود.','۳۴۷ یعنی ۳ صدتایی، ۴ ده‌تایی و ۷ یکی.','از راست یکان، سپس دهگان و صدگان را بخوان و ارزش هر رقم را مشخص کن.',[['در ۲۵۸ رقم ۵ چه ارزشی دارد؟','۵۰'],['عدد ۴ صدتایی و ۳ ده‌تایی و ۶ یکی چیست؟','۴۳۶'],['عدد بعد از ۱۹۹ چیست؟','۲۰۰']]],
['جمع و تفریق با انتقال','وقتی جمع یکان به ۱۰ یا بیشتر برسد، یک ده‌تایی می‌سازیم.','۲۷+۱۵: یکان ۷+۵=۱۲؛ ۲ یکی و ۱ ده‌تایی انتقال؛ پاسخ ۴۲.','یکان‌ها را با هم و دهگان‌ها را با هم حساب کن؛ انتقال را فراموش نکن.',[['۳۸+۲۷؟','۶۵'],['۷۲−۳۶؟','۳۶'],['۴۹+۱۸؟','۶۷']]],
['ضرب به‌عنوان جمع تکراری','ضرب راه کوتاه نوشتن جمع چند گروه مساوی است.','۳ گروه ۴تایی یعنی ۴+۴+۴=۱۲ و به شکل ۳×۴ نوشته می‌شود.','تعداد گروه‌ها را در تعداد اعضای هر گروه ضرب کن.',[['۵ گروه ۲تایی چندتاست؟','۱۰'],['۳×۴؟','۱۲'],['۲+۲+۲+۲ را به صورت ضرب بنویس.','۴×۲']]],
['کسرهای ساده','کسر بخشی از یک کلِ تقسیم‌شده به قسمت‌های مساوی است.','یک کیک را به ۴ قسمت مساوی تقسیم می‌کنیم؛ یک قسمت برابر ۱/۴ است.','تعداد قسمت‌های انتخاب‌شده صورت و تعداد کل قسمت‌های مساوی مخرج است.',[['نصف به صورت کسر؟','۱/۲'],['در ۱/۵ مخرج چیست؟','۵'],['از ۸ قسمت مساوی، ۳ قسمت رنگی است؛ کسر رنگی؟','۳/۸']]],
['اندازه‌گیری و پول','واحد مناسب به چیزی که اندازه می‌گیریم بستگی دارد.','۱ متر برابر ۱۰۰ سانتی‌متر است؛ ۲ متر برابر ۲۰۰ سانتی‌متر است.','واحد را کنار عدد بنویس و پیش از محاسبه واحدها را یکسان کن.',[['۱ متر چند سانتی‌متر است؟','۱۰۰'],['۲۵۰۰ تومان + ۱۵۰۰ تومان؟','۴۰۰۰ تومان'],['نیم ساعت چند دقیقه است؟','۳۰']]],
['داده و نمودار','جدول و نمودار کمک می‌کنند اطلاعات را مرتب و مقایسه کنیم.','اگر ۵ نفر سیب و ۳ نفر موز را دوست داشته باشند، سیب ۲ رأی بیشتر دارد.','عنوان و دسته‌ها را بخوان؛ ستون بلندتر مقدار بیشتری نشان می‌دهد.',[['۷ رأی در برابر ۴ رأی؛ اختلاف؟','۳'],['اگر ۶ دانش‌آموز کتاب و ۲ نفر توپ را انتخاب کنند، انتخاب بیشتر؟','کتاب'],['مجموع ۳ و ۵ چیست؟','۸']]]]},
3:{name:'سوم ابتدایی',topics:[
['عددهای چهاررقمی','عددهای چهاررقمی از هزارگان، صدگان، دهگان و یکان ساخته می‌شوند.','۴٬۲۳۶ یعنی ۴۰۰۰+۲۰۰+۳۰+۶.','عدد را از چپ بخوان و ارزش هر رقم را جداگانه بنویس.',[['ارزش ۷ در ۳۷۲۵؟','۷۰۰'],['عدد ۵ هزار و ۴ دهگان و ۲ یکی؟','۵۰۴۲'],['عدد قبل از ۱۰۰۰؟','۹۹۹']]],
['ضرب و جدول‌ها','ضرب را می‌توان با آرایه، جمع تکراری و جدول ضرب فهمید.','۶×۴ یعنی ۶ گروه ۴تایی؛ حاصل ۲۴ است.','جدول‌های ۲، ۵ و ۱۰ را با الگو یاد بگیر؛ سپس از خاصیت جابه‌جایی کمک بگیر.',[['۷×۳؟','۲۱'],['۸×۵؟','۴۰'],['۴ گروه ۶تایی چندتاست؟','۲۴']]],
['تقسیم و دسته‌بندی','تقسیم یعنی پخش برابر یا شمردن تعداد گروه‌های مساوی.','۲۰ شکلات بین ۵ نفر: هر نفر ۴ شکلات می‌گیرد؛ ۲۰÷۵=۴.','برای کنترل تقسیم، خارج‌قسمت را در مقسوم‌علیه ضرب کن.',[['۲۴÷۶؟','۴'],['۳۵÷۵؟','۷'],['۱۸ مداد در بسته‌های ۳تایی؛ چند بسته؟','۶']]],
['کسر و مقایسه','برای مقایسه کسرهای هم‌مخرج، صورت‌ها را مقایسه می‌کنیم.','۳/۸ از ۵/۸ کوچک‌تر است؛ چون قسمت‌ها هم‌اندازه‌اند و ۳ قسمت کمتر از ۵ قسمت است.','ابتدا بررسی کن مخرج‌ها برابرند یا نه؛ شکل بکش تا مقدار را ببینی.',[['کدام بزرگ‌تر است: ۲/۷ یا ۵/۷؟','۵/۷'],['یک واحد کامل چند نیم دارد؟','۲'],['۴/۶ چند قسمت از ۶ قسمت مساوی است؟','۴']]],
['محیط و اندازه‌گیری','محیط، اندازه دور یک شکل است و با جمع طول ضلع‌ها به دست می‌آید.','مستطیل با طول ۶ و عرض ۳: محیط ۶+۳+۶+۳=۱۸ واحد.','همه ضلع‌های دور شکل را جمع کن؛ واحد طول را بنویس.',[['محیط مربع ضلع ۵؟','۲۰'],['۳ متر چند سانتی‌متر است؟','۳۰۰'],['محیط مستطیل ۴ و ۷؟','۲۲']]],
['زمان، کسر و مسئله','مسئله‌های چندمرحله‌ای را با رسم شکل و نوشتن عملیات حل می‌کنیم.','یک ساعت و ۲۰ دقیقه برابر ۸۰ دقیقه است.','خواسته را مشخص کن؛ داده‌ها را مرتب کن؛ پاسخ را با برآورد بررسی کن.',[['۲ ساعت چند دقیقه است؟','۱۲۰'],['ربع ساعت چند دقیقه است؟','۱۵'],['نصف ۱۸ چیست؟','۹']]]]},
4:{name:'چهارم ابتدایی',topics:[
['عددهای بزرگ و ارزش مکانی','در عددهای بزرگ، گروه‌های سه‌رقمی را از راست جدا می‌کنیم.','۲٬۰۴۵٬۳۰۰ یعنی دو میلیون و چهل‌وپنج هزار و سیصد.','از راست یکان، هزارگان و میلیون را دسته‌بندی کن؛ صفرهای میانی را حذف نکن.',[['ارزش ۶ در ۶۲۵٬۰۰۰؟','۶۰۰٬۰۰۰'],['۳ میلیون چند هزار است؟','۳۰۰۰'],['عدد ۴۰۰٬۰۰۰+۲۰٬۰۰۰+۷۰۰+۵؟','۴۲۰٬۷۰۵']]],
['ضرب و تقسیم چندرقمی','در ضرب چندرقمی، ارزش مکانی هر رقم و انتقال‌ها اهمیت دارد.','۲۳×۴: ابتدا ۲۰×۴=۸۰ و سپس ۳×۴=۱۲؛ جمع ۹۲.','عدد را به دهگان و یکان تجزیه کن؛ در تقسیم با ضرب کنترل کن.',[['۳۶×۴؟','۱۴۴'],['۱۲۵×۶؟','۷۵۰'],['۹۶÷۸؟','۱۲']]],
['کسرهای مساوی و عملیات','با ضرب یا تقسیم صورت و مخرج در عدد یکسان، کسر مساوی می‌سازیم.','۲/۳=۴/۶؛ هر دو بخش را در ۲ ضرب کرده‌ایم.','برای جمع و تفریق، ابتدا مخرج مشترک پیدا کن.',[['کسر مساوی ۳/۵ با مخرج ۱۰؟','۶/۱۰'],['۱/۴+۲/۴؟','۳/۴'],['۵/۶−۱/۶؟','۴/۶ یا ۲/۳']]],
['عددهای اعشاری','دهم و صدم بخش‌هایی از واحد هستند که با ممیز نوشته می‌شوند.','۲٫۳۵ یعنی ۲ واحد و ۳ دهم و ۵ صدم.','رقم اول پس از ممیز دهم و رقم دوم صدم است؛ صفرهای انتهایی مقدار را تغییر نمی‌دهند.',[['در ۴٫۷ رقم ۷ چه ارزشی دارد؟','۷ دهم'],['۰٫۵۰ برابر چه عددی است؟','۰٫۵'],['کدام بزرگ‌تر است: ۱٫۲ یا ۱٫۰۹؟','۱٫۲']]],
['هندسه و زاویه','زاویه از دو نیم‌خط با مبدأ مشترک ساخته می‌شود.','زاویه راست ۹۰ درجه است؛ زاویه کوچک‌تر از آن تند و بزرگ‌تر از آن باز است.','با گونیا زاویه راست را پیدا کن و با نقاله اندازه بگیر.',[['زاویه راست چند درجه است؟','۹۰'],['زاویه ۴۵ درجه چه نوعی است؟','تند'],['چهارضلعی چند ضلع دارد؟','۴']]],
['اندازه‌گیری و داده','برای مساحت سطح مستطیل، طول را در عرض ضرب می‌کنیم.','مستطیل ۷ در ۴ سانتی‌متر، مساحت ۲۸ سانتی‌متر مربع دارد.','محیط دور شکل است؛ مساحت سطح داخل آن. واحد مساحت مربع است.',[['مساحت مستطیل ۸×۳؟','۲۴'],['۱ کیلومتر چند متر است؟','۱۰۰۰'],['میانگین ۲،۴ و ۶؟','۴']]]]},
5:{name:'پنجم ابتدایی',topics:[
['عددنویسی و تقریب','تقریب یعنی جایگزین کردن عدد با عددی نزدیک و ساده‌تر.','عدد ۴٬۷۸۲ به نزدیک‌ترین صدگان ۴٬۸۰۰ است.','به رقم سمت راست مرتبه موردنظر نگاه کن؛ ۵ یا بیشتر یعنی یک واحد افزایش.',[['۳٬۴۶۸ به نزدیک‌ترین دهگان؟','۳٬۴۷۰'],['۶٫۷ به نزدیک‌ترین عدد صحیح؟','۷'],['عدد ۲۵۱ به نزدیک‌ترین صدگان؟','۳۰۰']]],
['کسرها و عملیات','برای جمع کسرهای نامساوی، مخرج مشترک می‌سازیم.','۱/۲+۱/۳=۳/۶+۲/۶=۵/۶.','کسرها را هم‌واحد کن؛ سپس صورت‌ها را جمع یا کم و در پایان ساده کن.',[['۲/۳−۱/۶؟','۱/۲'],['۳/۴+۱/۸؟','۷/۸'],['۲/۵×۳؟','۶/۵ یا ۱ و ۱/۵']]],
['اعشار و ارزش مکانی','عدد اعشاری را می‌توان با دهم، صدم و هزارم تجزیه کرد.','۳٫۰۸=۳+۰٫۰۸؛ رقم ۸ در مرتبه صدم است.','برای مقایسه، تعداد رقم‌های اعشار را با صفرهای انتهایی برابر کن.',[['۰٫۷۵ به صورت کسر صدم؟','۷۵/۱۰۰'],['۲٫۴+۱٫۳؟','۳٫۷'],['۵٫۶−۲٫۸؟','۲٫۸']]],
['نسبت و تناسب','نسبت، مقایسه دو مقدار با ترتیب مشخص است.','نسبت ۲ مداد قرمز به ۳ آبی، ۲ به ۳ است.','واحدها باید قابل مقایسه باشند؛ ترتیب مقدارها را حفظ کن.',[['نسبت ۴ به ۸ در ساده‌ترین شکل؟','۱ به ۲'],['اگر ۲ دفتر ۶۰ تومان باشد، ۴ دفتر چند برابر قیمت دارد؟','دو برابر'],['در نسبت ۳ به ۵ مجموع سهم‌ها چند است؟','۸']]],
['درصد و کاربردها','درصد یعنی تعداد قسمت‌ها از ۱۰۰ قسمت مساوی.','۲۵٪ یعنی ۲۵ از ۱۰۰ یا یک‌چهارم کل.','برای یافتن درصدی از مقدار، درصد را به کسر یا عدد اعشاری تبدیل کن.',[['۵۰٪ از ۲۰؟','۱۰'],['۲۵٪ به صورت کسر ساده؟','۱/۴'],['۱۰٪ از ۷۰؟','۷']]],
['هندسه و حجم','حجم فضای اشغال‌شده توسط جسم سه‌بعدی است.','حجم مکعب‌مستطیل برابر طول×عرض×ارتفاع است.','واحدها را یکسان کن و پاسخ حجم را با واحد مکعب بنویس.',[['حجم ۳×۲×۴؟','۲۴'],['محیط مربع ضلع ۶؟','۲۴'],['مساحت مستطیل ۹×۵؟','۴۵']]]
]}
};
const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[+d]);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let grade=1,topic=0;
const progressKey='amirPrimaryGradeProgressV1',quizKey='amirPrimaryGradeQuizV1';
const normalize=s=>String(s??'').toLowerCase().replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[ي]/g,'ی').replace(/[ك]/g,'ک').replace(/[٫،؛]/g,'.').replace(/[\u200c\u200f\s]/g,'').replace(/[−–—]/g,'-').replace(/,/g,'');
function readDone(){try{const x=JSON.parse(localStorage.getItem(progressKey)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function readQuiz(){try{const x=JSON.parse(localStorage.getItem(quizKey)||'{}');return x&&typeof x==='object'?x:{}}catch(e){return{}}}
function topicCorrectCount(id){const q=readQuiz()[id]?.correct||{};return Object.values(q).filter(Boolean).length}
function updateCompletionButton(id){const b=document.getElementById('primaryDone');if(!b)return;const saved=readDone().includes(id),count=topicCorrectCount(id);b.disabled=saved||count<2;b.textContent=saved?'✓ یادگیری این مبحث ثبت شده است':count>=2?'ثبت یادگیری این مبحث':'برای ثبت یادگیری، دست‌کم ۲ پاسخ درست بده ('+fa(count)+'/۳)';}
function render(){
 const gb=document.getElementById('primaryGradeButtons'),tb=document.getElementById('primaryGradeTopics'),box=document.getElementById('primaryGradeLesson');if(!gb||!tb||!box)return;
 gb.innerHTML=Object.keys(curriculum).map(k=>'<button class="btn '+(grade===+k?'gold':'light')+'" data-grade="'+k+'">پایه '+fa(k)+'</button>').join('');
 const data=curriculum[grade];tb.innerHTML=data.topics.map((t,i)=>'<button class="btn '+(topic===i?'':'outline')+'" data-topic="'+i+'">'+fa(i+1)+'. '+esc(t[0])+'</button>').join('');
 const t=data.topics[topic],id=grade+'-'+topic,done=readDone(),saved=done.includes(id),correct=topicCorrectCount(id);
 const quiz=readQuiz()[id]?.correct||{};
 box.innerHTML='<article class="chapter-card open"><div class="chapter-body" style="display:block"><h3>'+esc(t[0])+'</h3><p><b>هدف یادگیری:</b> '+esc(t[1])+'</p><div class="example"><b>مثال حل‌شده</b><p>'+esc(t[2])+'</p></div><p><b>روش کار:</b> '+esc(t[3])+'</p><h4>تمرین تعاملی</h4><p class="small">پاسخ هر سؤال را وارد کن و «بررسی» را بزن. برای ثبت یادگیری، دست‌کم ۲ پاسخ از ۳ پاسخ باید درست باشد.</p>'+t[4].map((q,i)=>'<div class="card primary-question" style="margin:9px 0"><b>'+fa(i+1)+'. '+esc(q[0])+'</b><div class="toolbar" style="margin-top:9px"><input class="input" id="pg-answer-'+i+'" placeholder="پاسخت را بنویس" autocomplete="off" '+(quiz[i]?'disabled':'')+'><button class="btn gold" data-primary-check="'+i+'" '+(quiz[i]?'disabled':'')+'>بررسی</button></div><p class="small" id="pg-feedback-'+i+'" role="status" aria-live="polite">'+(quiz[i]?'✓ پاسخ درست ثبت شده است.':'')+'</p><div class="primary-answer" id="pa'+i+'" hidden>پاسخ: '+esc(q[1])+'</div><button class="btn light" data-answer="'+i+'">نمایش پاسخ</button></div>').join('')+'<div class="mutedbox" id="primaryQuizSummary">پاسخ‌های درست این مبحث: '+fa(correct)+' از ۳</div><div class="btnrow"><button class="btn gold" id="primaryDone" '+(saved||correct<2?'disabled':'')+'>'+(saved?'✓ یادگیری این مبحث ثبت شده است':correct>=2?'ثبت یادگیری این مبحث':'برای ثبت یادگیری، دست‌کم ۲ پاسخ درست بده ('+fa(correct)+'/۳)')+'</button><button class="btn outline" onclick="window.print()">چاپ درس و تمرین</button></div><p class="small">درس‌ها و پیشرفت این مسیر روی همین دستگاه ذخیره می‌شوند.</p></div></article>';
}
function checkAnswer(index){
 const id=grade+'-'+topic,t=curriculum[grade].topics[topic],input=document.getElementById('pg-answer-'+index),feedback=document.getElementById('pg-feedback-'+index),button=document.querySelector('[data-primary-check="'+index+'"]');
 if(!input||!feedback||!button||button.disabled)return;
 const expected=String(t[4][index][1]).split(/\s+یا\s+/).map(normalize),given=normalize(input.value);
 if(!given){feedback.textContent='ابتدا پاسخ را بنویس.';return;}
 if(expected.includes(given)){
  const all=readQuiz();all[id]=all[id]||{correct:{}};all[id].correct[index]=true;
  try{localStorage.setItem(quizKey,JSON.stringify(all));}catch(e){}
  feedback.textContent='آفرین! پاسخ درست است و ثبت شد. ⭐';input.disabled=true;button.disabled=true;
 }else{feedback.textContent='این پاسخ درست نیست؛ دوباره فکر کن و تلاش کن.';}
 const count=topicCorrectCount(id),summary=document.getElementById('primaryQuizSummary');if(summary)summary.textContent='پاسخ‌های درست این مبحث: '+fa(count)+' از ۳';
 updateCompletionButton(id);
}

function mount(){
 const tools=document.getElementById('tools');if(!tools)return;
 let hub=document.getElementById('primaryGradesHub');
 if(!hub){
  hub=document.createElement('section');hub.id='primaryGradesHub';hub.className='card primary-grades-hub';
  hub.innerHTML='<div class="section-head"><div><h2>📚 مسیر کامل ریاضی پایه‌های اول تا پنجم</h2><p class="small">درس‌نامه، مثال حل‌شده، تمرین تعاملی و ثبت پیشرفت</p></div><span class="tag">۵ پایه · ۳۰ مبحث</span></div><div class="primary-grade-summary" id="primaryGradeSummary"></div><div class="btnrow" id="primaryGradeButtons" aria-label="انتخاب پایه"></div><div class="primary-grade-layout"><nav id="primaryGradeTopics" class="primary-grade-topics" aria-label="فهرست مباحث"></nav><div id="primaryGradeLesson" class="primary-grade-lesson" aria-live="polite"></div></div><div class="small" style="margin-top:10px">پیشرفت این مسیر در حال حاضر روی همین دستگاه ذخیره می‌شود. برای همگام‌سازی بین دستگاه‌ها، مرحله اتصال ابری این بخش جداگانه تکمیل خواهد شد.</div>';
  tools.append(hub);
  const style=document.createElement('style');style.textContent='.primary-grades-hub{margin-top:16px}.primary-grade-summary{padding:9px 12px;border-radius:12px;background:#f1f5fb;color:#42566e;font-size:11px;margin:10px 0}.primary-grade-layout{display:grid;gap:12px;margin-top:12px}.primary-grade-topics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;align-content:start}.primary-grade-topics .btn{font-size:11px;padding:8px 7px}.primary-grade-lesson{min-width:0}.primary-grade-lesson .chapter-body{padding:12px}.primary-grade-lesson .primary-question{padding:10px}.primary-grade-lesson .toolbar{display:flex;gap:7px;align-items:center}.primary-grade-lesson .toolbar .input{min-width:0;flex:1}.primary-grade-hub .section-head{align-items:flex-start}@media(min-width:760px){.primary-grade-layout{grid-template-columns:minmax(180px,260px) minmax(0,1fr)}.primary-grade-topics{grid-template-columns:1fr}}@media print{body *{visibility:hidden!important}#primaryGradesHub,#primaryGradesHub *{visibility:visible!important}#primaryGradesHub{position:absolute;inset:0;width:100%;border:0;box-shadow:none}.primary-grade-topics,#primaryGradeButtons{display:none!important}}';document.head.append(style);
 }
 render();
}

function openHub(){mount();document.getElementById('primaryGradesHub')?.scrollIntoView({behavior:'smooth',block:'start'});}
document.addEventListener('click',e=>{
 const g=e.target.closest('[data-grade]'),t=e.target.closest('[data-topic]'),a=e.target.closest('[data-answer]'),c=e.target.closest('[data-primary-check]');
 if(g){grade=+g.dataset.grade;topic=0;render();}
 if(t){topic=+t.dataset.topic;render();}
 if(a){const el=document.getElementById('pa'+a.dataset.answer);if(el){el.hidden=!el.hidden;a.textContent=el.hidden?'نمایش پاسخ':'پنهان‌کردن پاسخ';}}
 if(c){checkAnswer(Number(c.dataset.primaryCheck));}
 if(e.target.id==='primaryDone'){const id=grade+'-'+topic;if(topicCorrectCount(id)>=2){const done=readDone();if(!done.includes(id))done.push(id);try{localStorage.setItem(progressKey,JSON.stringify(done));}catch(e){}render();}}
});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
window.openPrimaryGradesHub=openHub;
})();

/* Worksheet bank expansion: dedicated chapter-aligned practice for decimal and geometry chapters. */
(function(){
"use strict";
worksheetBanks.decimals=[
["در عدد ۷٫۳۶ رقم ۳ چه ارزشی دارد؟","۳ دهم، یعنی ۰٫۳","easy"],
["عدد ۴٫۰۵ را به صورت گسترده بنویس.","۴ + ۰٫۰۵","easy"],
["کدام بزرگ‌تر است: ۰٫۷ یا ۰٫۶۸؟ دلیل بیاور.","۰٫۷؛ چون ۰٫۷۰ از ۰٫۶۸ بزرگ‌تر است.","medium"],
["حاصل ۳٫۴ + ۲٫۷۵ را حساب کن.","۶٫۱۵","medium"],
["حاصل ۸٫۲ − ۳٫۶۵ را به دست آور.","۴٫۵۵","medium"],
["حاصل ۲٫۴ × ۱٫۵ چیست؟","۳٫۶","medium"],
["حاصل ۷٫۲ ÷ ۳ چیست؟","۲٫۴","medium"],
["حاصل ۰٫۴۸ ÷ ۰٫۱۲ را حساب کن.","۴","hard"],
["یک بطری ۱٫۵ لیتری داریم؛ ۰٫۳۵ لیتر از آن مصرف شده است. چقدر باقی مانده؟","۱٫۱۵ لیتر","hard"],
["حاصل ۱۲٫۵ × ۰٫۸ را با توضیح محاسبه کن.","۱۰؛ چون ۱۲۵×۸=۱۰۰۰ و دو رقم اعشار داریم.","hard"]
];
worksheetBanks.symmetry=[
["تقارن محوری را با یک جمله تعریف کن.","اگر شکل با تا شدن روی یک خط بر دو بخش منطبق شود، آن خط محور تقارن است.","easy"],
["مربع چند محور تقارن دارد؟","۴ محور تقارن","easy"],
["مستطیل غیرمربع چند محور تقارن دارد؟","۲ محور تقارن","medium"],
["در تقارن محوری، فاصله نقطه و تصویر آن از محور چه رابطه‌ای دارد؟","برابر است و پاره‌خط وصل‌کننده بر محور عمود است.","medium"],
["مرکز تقارن یک شکل یعنی چه؟","نقطه‌ای که با دوران ۱۸۰ درجه شکل حول آن، شکل بر خودش منطبق شود.","medium"],
["آیا هر مستطیل مرکز تقارن دارد؟ مرکز آن کجاست؟","بله؛ محل برخورد قطرها مرکز تقارن است.","easy"],
["اگر نقطه‌ای ۳ واحد راست و ۲ واحد بالا از مرکز باشد، تصویرش در تقارن مرکزی کجاست؟","۳ واحد چپ و ۲ واحد پایین مرکز.","hard"],
["یک شکل نام ببر که محور تقارن دارد ولی مرکز تقارن ندارد.","مثلث متساوی‌الساقینِ غیرمتساوی‌الاضلاع.","hard"],
["در دوران ۹۰ درجه، شکل چه ویژگی‌هایی را حفظ می‌کند؟","طول ضلع‌ها، اندازه زاویه‌ها و شکل؛ فقط جهت و جایگاه تغییر می‌کند.","medium"],
["یک نمونه از تقارن در طبیعت یا معماری بنویس و نوع آن را مشخص کن.","پاسخ نمونه: بال‌های پروانه تقارن محوری دارند.","easy"]
];
worksheetBanks.coordinates=[
["در زوج مرتب (۴،۲)، مؤلفه اول کدام است؟","x=۴؛ مؤلفه افقی","easy"],
["مبدأ مختصات چه مختصاتی دارد؟","(۰،۰)","easy"],
["برای رسیدن به نقطه (۳،۴) از مبدأ، چند واحد افقی و عمودی حرکت می‌کنیم؟","۳ واحد راست و ۴ واحد بالا","easy"],
["نقطه (۲،۵) و (۵،۲) چه تفاوتی دارند؟","جای مؤلفه‌های x و y عوض شده است؛ دو نقطه متفاوت‌اند.","medium"],
["نقطه‌ای ۴ واحد چپ و ۳ واحد بالا از مبدأ چه مختصاتی دارد؟","(۴-،۳)","medium"],
["قرینه نقطه (۲،۳) نسبت به مبدأ چیست؟","(۲-،۳-)","medium"],
["اگر نقطه A=(۱،۲) سه واحد به راست و دو واحد پایین برود، مختصات جدید چیست؟","(۴،۰)","hard"],
["فاصله افقی نقاط (۲،۴) و (۷،۴) چند واحد است؟","۵ واحد","medium"],
["نقطه‌ای روی محور y چه ویژگی‌ای در مختصات دارد؟","مؤلفه x آن صفر است.","medium"],
["یک مسیر سه‌مرحله‌ای روی شبکه بنویس که از (۰،۰) به (۴،۲) برسد.","نمونه: ۴ واحد راست، سپس ۲ واحد بالا.","hard"]
];
const select=document.getElementById("wsTopic");
if(select){
 const options=[["decimals","اعداد اعشاری · فصل سوم"],["symmetry","تقارن و دوران · فصل چهارم"],["coordinates","مختصات · فصل چهارم"]];
 options.forEach(([v,t])=>{if(![...select.options].some(o=>o.value===v)){const o=document.createElement("option");o.value=v;o.textContent=t;select.appendChild(o)}});
}
const original=window.generateWorksheet;
window.generateWorksheet=function(){
 const topic=document.getElementById("wsTopic")?.value||"mixed",level=document.getElementById("wsLevel")?.value||"medium",count=Number(document.getElementById("wsCount")?.value||10);
 let bank=[...(worksheetBanks[topic]||worksheetBanks.mixed)];
 const rank=x=>(x[2]||"medium")===level?0:(x[2]||"medium")==="medium"?1:2;
 bank.sort((a,b)=>rank(a)-rank(b));
 const chosen=[];while(chosen.length<count&&bank.length)chosen.push(bank.shift());
 if(chosen.length<count){const rest=[...(worksheetBanks[topic]||worksheetBanks.mixed)];while(chosen.length<count)chosen.push(rest[(chosen.length)%rest.length])}
 currentWorksheet=chosen.map(x=>x[0]);worksheetAnswers=chosen.map(x=>x[1]);
 const labels={patterns:"الگوهای عددی",place:"عددنویسی و ارزش مکانی",divisibility:"بخش‌پذیری",integers:"اعداد صحیح",mixed:"مرور ترکیبی",fractions:"کسرها",measurement:"اندازه‌گیری",ratio:"تناسب و درصد",approximation:"تقریب",decimals:"اعداد اعشاری",symmetry:"تقارن و دوران",coordinates:"مختصات"};
 const levelName={easy:"آسان",medium:"متوسط",hard:"چالشی"};
 const esc=x=>typeof escapeHtml==="function"?escapeHtml(x):String(x).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 const key=document.getElementById("wsPrintKey")?.checked?'<div class="answer-key-print"><hr><h3>کلید پاسخ ویژه معلم</h3><ol>'+worksheetAnswers.map(a=>"<li>"+esc(a)+"</li>").join("")+"</ol></div>":"";
 document.getElementById("worksheetOutput").innerHTML='<div class="worksheet active-print"><div class="worksheet-print">آموزش با امیر | هدف یادگیری است.</div><h3>کاربرگ ریاضی ششم</h3><p><b>موضوع:</b> '+(labels[topic]||topic)+'　<b>سطح:</b> '+levelName[level]+'</p><p>نام و نام خانوادگی: .....................................　 تاریخ: ........................</p><hr>'+currentWorksheet.map((q,i)=>'<p><b>'+fa(i+1)+'.</b> '+esc(q)+'</p><div class="ws-line"></div><div class="ws-line"></div>').join("")+'<p class="worksheet-print">آموزش با امیر · امیر محمدیان</p>'+key+"</div>";
 document.getElementById("wsAnswers").classList.add("hidden");document.getElementById("wsAnswers").innerHTML="<b>کلید پاسخ:</b><ol>"+worksheetAnswers.map(a=>"<li>"+esc(a)+"</li>").join("")+"</ol>";
};
})();
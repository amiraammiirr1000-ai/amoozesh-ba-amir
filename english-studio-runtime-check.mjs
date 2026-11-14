import {readFile} from 'node:fs/promises';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=await readFile(new URL('./english-studio-v3.js',import.meta.url),'utf8');
const store={};let spoken=0,printed=0;const quiz=[0,1,1];
const el=(id,extra={})=>({id,innerHTML:'',textContent:'',value:'',options:[],selectedIndex:0,scrollIntoView(){},addEventListener(){},remove(){},...extra});
const els={
dictionaryResults:el('dictionaryResults'),dictionaryCount:el('dictionaryCount'),dictionarySearch:el('dictionarySearch'),
bookSelect:el('bookSelect',{value:'first-friends-1',options:[{text:'First Friends 1'}]}),
englishBookContent:el('englishBookContent'),englishUnitDetail:el('englishUnitDetail'),
englishSpeechRate:el('englishSpeechRate',{value:'0.88'}),englishRateValue:el('englishRateValue'),englishVoiceSelect:el('englishVoiceSelect',{value:''}),
engWriting1:el('engWriting1',{value:'My name is Amir.'})
};
const document={getElementById:id=>els[id]||null,addEventListener(){},querySelector(sel){const m=sel.match(/engq(\d+)/);return m?{checked:true,value:String(quiz[Number(m[1])])}:null},body:{insertAdjacentHTML(_p,html){els.englishPrintSheet=el('englishPrintSheet');els.englishPrintSheet.innerHTML=html}}};
const voices=[{name:'US English Voice',lang:'en-US'}];
const speechSynthesis={cancel(){},getVoices(){return voices},speak(){spoken++},onvoiceschanged:null};
class Utterance{constructor(text){this.text=text;this.lang='';this.rate=1;this.voice=null}}
const window={speechSynthesis,addEventListener(){},removeEventListener(){},print(){printed++}};
const context={window,document,localStorage:{getItem(k){return store[k]??null},setItem(k,v){store[k]=v}},speechSynthesis,SpeechSynthesisUtterance:Utterance,englishWords:[['hello','سلام','Hello!']],alert(){},Date,JSON,Math,String,Number,Object,Array};
vm.createContext(context);vm.runInContext(source,context);
window.initEnglishHub();
assert.ok(els.englishBookContent.innerHTML.includes('۸ درس'));
window.openEnglishUnit(1);
els.engWriting1.value='My name is Amir.';
for(const token of ['واژگان کلیدی','SUPPLEMENTARY LESSON','نکته گرامری','مکالمه نمونه','درک مطلب','تمرین نوشتاری','تمرین شنیداری'])assert.ok(els.englishUnitDetail.innerHTML.includes(token),'missing unit content '+token);
window.checkEnglishUnit(1);assert.ok(store.amirEnglishScoresV2.includes('"score":3')||store.amirEnglishScoresV2.includes('"score":2'));
window.saveEnglishWriting(1);assert.ok(store.amirEnglishWritingV2.includes('My name is Amir.'));
window.completeEnglishUnit(1);assert.ok(store.amirEnglishUnitsV2.includes('1'));
window.searchEnglishDictionary('hello');assert.ok(els.dictionaryResults.innerHTML.includes('hello'));
window.toggleEnglishFavorite('hello');assert.ok(store.amirEnglishFavoritesV2.includes('hello'));
window.speakEnglish('Hello there');assert.equal(spoken,1);
window.printEnglishUnit(1);assert.equal(printed,1);
console.log('PASS: English runtime test for course rendering, full unit content, assessment, saved writing/progress, dictionary/favorites, US speech and print-to-PDF.');

import {readFile} from 'node:fs/promises';import vm from 'node:vm';import assert from 'node:assert/strict';
const source=await readFile(new URL('./math-worksheets-v2.js',import.meta.url),'utf8');
const banks={patterns:[['pattern q','pattern a','easy']],place:[['place q','place a','easy']],divisibility:[['div q','div a','easy']],integers:[['integer q','integer a','easy']],mixed:[['mixed q','mixed a','easy']],fractions:[['fraction q','fraction a','easy']],measurement:[['measure q','measure a','easy']],ratio:[['ratio q','ratio a','easy']],approximation:[['approx q','approx a','easy']]};
const els={wsTopic:{value:'decimals',options:[],appendChild(o){this.options.push(o)}},wsLevel:{value:'easy'},wsCount:{value:'10'},wsPrintKey:{checked:true},worksheetOutput:{innerHTML:''},wsAnswers:{innerHTML:'',classList:{add(){}}}};
const document={getElementById:id=>els[id]||null,createElement(){return {value:'',textContent:''}}};
const context={worksheetBanks:banks,currentWorksheet:[],worksheetAnswers:[],document,window:{},fa:String,escapeHtml:s=>String(s),Math,Array,Number,String,Object};
vm.createContext(context);vm.runInContext(source,context);
for(const topic of ['decimals','symmetry','coordinates','fractions','measurement','ratio','approximation','patterns','place','divisibility','integers']){
 els.wsTopic.value=topic;
 for(const count of [5,10,15]){
  els.wsCount.value=String(count);context.window.generateWorksheet();
  assert.equal(context.currentWorksheet.length,count,topic+' should generate '+count+' questions');
  assert.equal(context.worksheetAnswers.length,count,topic+' should provide matching answer key');
  assert.ok(els.worksheetOutput.innerHTML.includes('کاربرگ ریاضی ششم'));
  assert.ok(els.wsAnswers.innerHTML.includes('<li>'));
 }
}
console.log('PASS: worksheet runtime test generates 5/10/15 questions and matching answer keys for all 11 topics.');

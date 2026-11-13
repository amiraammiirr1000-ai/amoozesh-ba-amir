import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const html = await readFile(new URL('./index.html', import.meta.url), 'utf8');
const start = html.indexOf('function gameDigits(');
const endMarker = 'function showMathGameMenu(){const stage=document.getElementById(\'gameStage\');if(stage)stage.innerHTML=\'برای شروع یکی از هشت دستگاه بالا را انتخاب کن.\';}';
const end = html.indexOf(endMarker, start);
assert.ok(start >= 0 && end > start, 'math game functions must be present');
const source = html.slice(start, end + endMarker.length);

function createHarness() {
  const elements = {
    gameStage: { innerHTML: '', scrollIntoView() {} },
    mathGameInput: { value: '', disabled: false, addEventListener() {} },
    mathGameFeedback: { innerHTML: '', textContent: '' },
    gameProgress: { innerHTML: '' }
  };
  const context = {
    document: { getElementById: id => elements[id] || null },
    state: { points: 0, gameStats: {} },
    mathGameNames: {1:'ارزش مکانی',2:'بخش‌پذیری',3:'الگوها',4:'اعداد صحیح',5:'اعشار',6:'مختصات',7:'مقایسه کسرها',8:'جمع کسرها'},
    activeMathGame: 0, mathGameRound: 0, mathGameScore: 0, mathGameAnswer: '',
    persistCalls: 0, persist(){this.persistCalls++;}, fa: String,
    showView(){}, setTimeout(){},
    Math, String, Number, Object
  };
  context.persist = () => { context.persistCalls++; };
  vm.createContext(context);
  vm.runInContext(source, context);
  return { context, elements };
}

for (let id=1; id<=8; id++) {
  const {context,elements}=createHarness();
  context.startMathGame(id);
  assert.ok(elements.gameStage.innerHTML.includes('بررسی پاسخ'), 'game '+id+' should render answer controls');
  assert.ok(context.mathGameAnswer, 'game '+id+' should generate an answer');
  elements.mathGameInput.value = context.mathGameAnswer;
  context.checkMathGame();
  assert.equal(context.state.gameStats[id].attempts,1,'game '+id+' should record one attempt');
  assert.equal(context.state.gameStats[id].correct,1,'game '+id+' should accept its generated correct answer');
  assert.equal(context.state.points,10,'game '+id+' should award ten points');
  assert.equal(elements.mathGameInput.disabled,true,'game '+id+' should lock a correct answer');
  context.checkMathGame();
  assert.equal(context.state.gameStats[id].attempts,1,'game '+id+' must not double count after success');
  assert.equal(context.state.points,10,'game '+id+' must not double award after success');
}
{
 const {context}=createHarness();
 assert.equal(context.gameDigits('−۱۲،۳'),'-12,3','Persian negative coordinates should normalize');
 assert.equal(context.gameDigits('١٢⁄٣٤'),'12/34','Arabic digits and fraction slash should normalize');
}
{
 const {context,elements}=createHarness();
 context.startMathGame(2);
 elements.mathGameInput.value = context.mathGameAnswer==='بله'?'آره':'نه';
 context.checkMathGame();
 assert.equal(context.state.gameStats[2].correct,1,'common Persian yes/no variants should be accepted');
}
{
 const {context,elements}=createHarness();
 context.startMathGame(5);
 elements.mathGameInput.value = String(Number(context.mathGameAnswer).toFixed(2));
 context.checkMathGame();
 assert.equal(context.state.gameStats[5].correct,1,'equivalent decimal formatting should be accepted');
}
console.log('PASS: all 8 math games render, accept their generated correct answers, record progress, award points once, and normalize common Persian/Arabic answer formats.');

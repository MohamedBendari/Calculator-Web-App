const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const pad = document.getElementById('pad');
const hint = document.getElementById('hint');

let expr = "";
let lastResult = null;

function updateDisplay(){
  expressionEl.textContent = expr || '';
  resultEl.textContent = expr ? tryEvaluatePreview(expr) : '0';
}

function isSafeExpression(s){
  return /^[0-9+\-*/().\s]+$/.test(s);
}

function tryEvaluatePreview(s){
  try {
    if (!isSafeExpression(s)) return 'Error';
    const normalized = s.replace(/×/g,'*').replace(/÷/g,'/');
    if (/[+\-*/.]$/.test(normalized.trim())) return '';
    let val = Function('"use strict"; return (' + normalized + ')')();
    if (typeof val === 'number' && isFinite(val)) {
      return formatNumber(val);
    } else {
      return 'Error';
    }
  } catch(e){
    return '';
  }
}

function formatNumber(n){
  if (Number.isInteger(n)) return String(n);
  return parseFloat(n.toFixed(10)).toString();
}

function clearAll(){
  expr = "";
  lastResult = null;
  hint.textContent = 'Cleared';
  updateDisplay();
}

function backspace(){
  expr = expr.slice(0,-1);
  updateDisplay();
}

function appendValue(v){
  if (v === '×') v = '*';
  if (v === '÷') v = '/';
  expr += v;
  updateDisplay();
}

function calculate(){
  if (!expr) return;
  if (!isSafeExpression(expr)) {
    hint.textContent = 'Invalid';
    resultEl.textContent = 'Error';
    return;
  }
  const normalized = expr.replace(/×/g,'*').replace(/÷/g,'/');
  try {
    let val = Function('"use strict"; return (' + normalized + ')')();
    if (typeof val === 'number' && isFinite(val)) {
      lastResult = val;
      resultEl.textContent = formatNumber(val);
      expr = String(formatNumber(val));
      hint.textContent = 'Done';
    } else {
      resultEl.textContent = 'Error';
      hint.textContent = 'Out of range';
    }
  } catch(e){
    resultEl.textContent = 'Error';
    hint.textContent = 'Invalid';
  }
}

pad.addEventListener('click', (ev) => {
  const btn = ev.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const value = btn.dataset.value;
  if (action === 'clear') clearAll();
  else if (action === 'back') backspace();
  else if (action === 'equals') calculate();
  else if (value !== undefined) appendValue(value);
});

window.addEventListener('keydown', (ev) => {
  const key = ev.key;
  if ((/^[0-9]$/).test(key)) {
    appendValue(key);
    ev.preventDefault();
  } else if (key === '.' || key === ',') {
    appendValue('.');
    ev.preventDefault();
  } else if (key === '+' || key === '-' || key === '*' || key === '/') {
    appendValue(key);
    ev.preventDefault();
  } else if (key === 'Enter' || key === '=') {
    calculate();
    ev.preventDefault();
  } else if (key === 'Backspace') {
    backspace();
    ev.preventDefault();
  } else if (key === 'Escape') {
    clearAll();
    ev.preventDefault();
  } else if (key === '(' || key === ')') {
    appendValue(key);
    ev.preventDefault();
  }
});

updateDisplay();

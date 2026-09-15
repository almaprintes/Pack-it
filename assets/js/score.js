(()=>{
const win=document.querySelector('#win');
const result=document.querySelector('#result');
const starsEl=document.querySelector('#resultStars');
const timeEl=document.querySelector('#resultTime');
const movesEl=document.querySelector('#resultMoves');
const scoreEl=document.querySelector('#resultScore');
const startBtn=document.querySelector('#startGame');
const lv=document.querySelector('#lv');
if(!win||!result||!starsEl||!timeEl||!movesEl||!scoreEl||!startBtn||!lv)return;
let levelStart=0,moves=0,running=false,finished=false,pendingLevel=false;
const parMoves=[2,2,4,3,5];
function beginLevel(){levelStart=performance.now();moves=0;running=true;finished=false;pendingLevel=false;result.classList.remove('show')}
function addMove(e){if(!running||finished)return;const t=e.target;if(t.closest?.('.item')||t.closest?.('#rotate.show')||t.closest?.('#prepare.show'))moves++}
function finish(){if(!running||finished)return;finished=true;running=false;const secs=Math.max(.1,(performance.now()-levelStart)/1000);const idx=Math.max(0,Number(lv.textContent)-1);const par=parMoves[idx]??5;let stars=1;if(secs<=30&&moves<=par+2)stars=3;else if(secs<=60&&moves<=par+6)stars=2;const extra=Math.max(0,moves-par);const score=Math.max(100,Math.round((1000-secs*5-extra*30)/10)*10);starsEl.textContent='★'.repeat(stars)+'☆'.repeat(3-stars);timeEl.textContent=secs.toFixed(1)+' s';movesEl.textContent=moves;scoreEl.textContent=score+' pts';setTimeout(()=>result.classList.add('show'),900)}
startBtn.addEventListener('click',beginLevel,{passive:true});
document.addEventListener('pointerdown',addMove,{passive:true,capture:true});
new MutationObserver(()=>{if(win.classList.contains('show'))finish()}).observe(win,{attributes:true,attributeFilter:['class']});
new MutationObserver(()=>{pendingLevel=true;result.classList.remove('show')}).observe(lv,{childList:true,characterData:true,subtree:true});
window.addEventListener('packit:conveyor-stop',()=>{if(pendingLevel)beginLevel()});
})();

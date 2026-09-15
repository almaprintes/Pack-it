(()=>{
const result=document.querySelector('#result'),starsEl=document.querySelector('#resultStars'),timeEl=document.querySelector('#resultTime'),movesEl=document.querySelector('#resultMoves'),scoreEl=document.querySelector('#resultScore'),startBtn=document.querySelector('#startGame'),lv=document.querySelector('#lv');
const finalResult=document.querySelector('#finalResult'),finalStars=document.querySelector('#finalStars'),finalScore=document.querySelector('#finalScore'),finalTime=document.querySelector('#finalTime'),finalMoves=document.querySelector('#finalMoves'),restart=document.querySelector('#restartRun');
if(!result||!starsEl||!timeEl||!movesEl||!scoreEl||!startBtn||!lv||!finalResult)return;
let levelStart=0,moves=0,running=false,finished=false;let run=[];
const parMoves=[5,5,6,6,7];
function beginLevel(){levelStart=performance.now();moves=0;running=true;finished=false;result.classList.remove('show')}
function addMove(e){if(!running||finished)return;const t=e.target;if(t.closest?.('.item')||t.closest?.('#rotate.show')||t.closest?.('#prepare.show'))moves++}
function finish(){if(!running||finished)return;finished=true;running=false;const secs=Math.max(.1,(performance.now()-levelStart)/1000),idx=Math.max(0,Number(lv.textContent)-1),par=parMoves[idx]??5;let stars=1;if(secs<=30&&moves<=par+2)stars=3;else if(secs<=60&&moves<=par+6)stars=2;const extra=Math.max(0,moves-par),score=Math.max(100,Math.round((1000-secs*5-extra*30)/10)*10);run[idx]={secs,moves,score,stars};starsEl.textContent='★'.repeat(stars)+'☆'.repeat(3-stars);timeEl.textContent=secs.toFixed(1)+' s';movesEl.textContent=String(moves);scoreEl.textContent=score+' pts';setTimeout(()=>result.classList.add('show'),250)}
function showFinal(){finish();const rows=run.filter(Boolean),score=rows.reduce((n,r)=>n+r.score,0),secs=rows.reduce((n,r)=>n+r.secs,0),allMoves=rows.reduce((n,r)=>n+r.moves,0),earned=rows.reduce((n,r)=>n+r.stars,0);finalScore.textContent=score+' pts';finalTime.textContent=secs.toFixed(1)+' s';finalMoves.textContent=String(allMoves);const stars=rows.length?Math.max(1,Math.min(5,Math.round((earned/(rows.length*3))*5))):1;finalStars.textContent='★'.repeat(stars)+'☆'.repeat(5-stars);result.classList.remove('show');finalResult.classList.add('show')}
startBtn.addEventListener('click',()=>{run=[];beginLevel()},{passive:true});document.addEventListener('pointerdown',addMove,{passive:true,capture:true});
window.addEventListener('packit:level-complete',finish);window.addEventListener('packit:level-start',beginLevel);window.addEventListener('packit:run-complete',showFinal);
restart?.addEventListener('click',()=>location.reload());
})();

(()=>{
const KEY='packit_story_v1';
const $=s=>document.querySelector(s);
const intro=$('#storyIntro'),fired=$('#storyFired'),brian=$('#brianIntro'),almonte=$('#almonteIntro'),timer=$('#storyTimer'),timerValue=$('#storyTimerValue');
const pauseBtn=$('#storyPause'),pauseOverlay=$('#pauseOverlay'),resumeBtn=$('#storyResume'),rewardRetry=$('#rewardRetry'),rewardAd=$('#rewardAd'),rewardComplete=$('#rewardAdComplete'),rewardCancel=$('#rewardAdCancel'),game=$('main.game');
const limits=[45,48,50,52,55,58,60,62,65,68,70,72,75,78,80,82,85,88,90,95,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,84,88,95,55,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,95];
let remaining=0,tick=0,active=false,completed=false,paused=false,failedLevel=null,rewardUsed=false;
function state(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{}}}
function save(v){localStorage.setItem(KEY,JSON.stringify(v))}
function stop(){active=false;clearInterval(tick);tick=0;setPaused(false)}
function render(){timerValue.textContent=Math.max(0,remaining)+' s';timer.classList.toggle('danger',remaining<=10)}
function setPaused(on){
 paused=!!on&&active&&!completed;
 game?.classList.toggle('story-paused',paused);
 pauseOverlay?.classList.toggle('show',paused);
 pauseOverlay?.setAttribute('aria-hidden',paused?'false':'true');
 if(pauseBtn)pauseBtn.setAttribute('aria-label',paused?'Partida en pausa':'Pausar partida');
 window.dispatchEvent(new CustomEvent(paused?'packit:pause':'packit:resume'));
}
function startClock(ev){
 stop();completed=false;remaining=limits[ev?.detail?.level??window.level??0]||60;active=true;render();
 tick=setInterval(()=>{if(!active||paused)return;remaining--;render();if(remaining<=0)fire()},1000)
}
function abandonRun(){
 localStorage.removeItem('packit_save_v1');save({started:false,fired:true});failedLevel=null;rewardUsed=false
}
function fire(){
 if(!active)return;
 active=false;clearInterval(tick);tick=0;setPaused(false);failedLevel=level;rewardUsed=false;
 const isAlmonte=level>=40,isBrian=level>=20&&level<40,logo=$('#firedCompanyLogo'),copy=$('#firedCompanyText');
 if(logo)logo.src=isBrian?'assets/brands/brian-air-logo.webp':isAlmonte?$('#almonteIntro .story-logo').src:$('#storyIntro .story-logo').src;
 if(copy){copy.dataset.i18n=isBrian?'brianFiredText':isAlmonte?'almonteFiredText':'storyFiredText';copy.textContent=PackItI18n.t(copy.dataset.i18n)}
 window.dispatchEvent(new Event('packit:menu-open'));fired.classList.add('show')
}
function beginStory(){
 localStorage.removeItem('packit_save_v1');save({started:true,fired:false});intro.classList.remove('show');
 window.dispatchEvent(new CustomEvent('packit:story-begin'))
}
function openReward(){
 if(failedLevel==null||rewardUsed)return;
 rewardAd?.classList.add('show')
}
function cancelReward(){
 rewardAd?.classList.remove('show');abandonRun()
}
function completeReward(){
 if(failedLevel==null||rewardUsed)return;
 rewardUsed=true;rewardAd?.classList.remove('show');fired.classList.remove('show');
 save({started:true,fired:false});
 window.dispatchEvent(new CustomEvent('packit:reward-earned',{detail:{type:'retry-level',level:failedLevel,dev:true}}));
 window.dispatchEvent(new CustomEvent('packit:retry-level',{detail:{level:failedLevel}}));
 failedLevel=null
}
pauseBtn?.addEventListener('click',()=>{if(active&&!completed)setPaused(true)});
resumeBtn?.addEventListener('click',()=>setPaused(false));
rewardRetry?.addEventListener('click',openReward);
rewardComplete?.addEventListener('click',completeReward);
rewardCancel?.addEventListener('click',()=>{rewardAd?.classList.remove('show')});
window.addEventListener('packit:level-start',startClock);
window.addEventListener('packit:level-complete',()=>{completed=true;stop()});
window.addEventListener('packit:chapter-complete',ev=>{stop();if(ev?.detail?.chapter==='brian')almonte.classList.add('show');else brian.classList.add('show')});window.addEventListener('packit:bag-overuse',fire);
window.addEventListener('packit:run-complete',stop);
window.addEventListener('packit:menu-open',()=>{if(active){active=false;clearInterval(tick);tick=0}setPaused(false)});
$('#storyAccept').addEventListener('click',beginStory);
$('#storyRestart').addEventListener('click',()=>{abandonRun();fired.classList.remove('show');intro.classList.add('show')});
$('#brianAccept').addEventListener('click',()=>{brian.classList.remove('show');window.dispatchEvent(new CustomEvent('packit:brian-begin'))});$('#almonteAccept').addEventListener('click',()=>{almonte.classList.remove('show');window.dispatchEvent(new CustomEvent('packit:almonte-begin'))});
window.PackItStory={showIntro(){intro.classList.add('show')},startClock,stop,limits,pause(){setPaused(true)},resume(){setPaused(false)}};
})();
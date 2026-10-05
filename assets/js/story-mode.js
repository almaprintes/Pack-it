(()=>{
const KEY='packit_story_v1';
const $=s=>document.querySelector(s);
const intro=$('#storyIntro'),fired=$('#storyFired'),timer=$('#storyTimer'),timerValue=$('#storyTimerValue');
const limits=[45,48,50,52,55,58,60,62,65,68,70,72,75,78,80,82,85,88,90,95];
let remaining=0,tick=0,active=false,completed=false;
function state(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{}}}
function save(v){localStorage.setItem(KEY,JSON.stringify(v))}
function stop(){active=false;clearInterval(tick);tick=0}
function render(){timerValue.textContent=Math.max(0,remaining)+' s';timer.classList.toggle('danger',remaining<=10)}
function startClock(ev){
 stop();completed=false;remaining=limits[ev?.detail?.level??window.level??0]||60;active=true;render();
 tick=setInterval(()=>{if(!active)return;remaining--;render();if(remaining<=0)fire()},1000)
}
function fire(){
 if(!active)return;stop();save({started:false,fired:true});window.dispatchEvent(new Event('packit:menu-open'));fired.classList.add('show')
}
function beginStory(){
 localStorage.removeItem('packit_save_v1');save({started:true,fired:false});intro.classList.remove('show');
 window.dispatchEvent(new CustomEvent('packit:story-begin'))
}
window.addEventListener('packit:level-start',startClock);
window.addEventListener('packit:level-complete',()=>{completed=true;stop()});
window.addEventListener('packit:run-complete',stop);
window.addEventListener('packit:menu-open',stop);
$('#storyAccept').addEventListener('click',beginStory);
$('#storyRestart').addEventListener('click',()=>{fired.classList.remove('show');intro.classList.add('show')});
window.PackItStory={showIntro(){intro.classList.add('show')},startClock,stop,limits};
})();
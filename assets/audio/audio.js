(()=>{
const VERSION='DEV 0.0.50';
document.querySelectorAll('.version,.splash-version').forEach(e=>e.textContent=VERSION);
const music=new Audio('assets/audio/music-cozy-jazz-v1.mp3?v=0050');
const pack=new Audio('assets/audio/pack-it-short.mp3?v=0050');
music.loop=true;music.preload='auto';music.volume=.18;pack.preload='auto';pack.volume=.95;
let started=false,restoreTimer=0;
function fadeMusic(target,duration=350){clearInterval(fadeMusic._t);const from=music.volume,start=performance.now();fadeMusic._t=setInterval(()=>{const t=Math.min(1,(performance.now()-start)/duration);music.volume=from+(target-from)*t;if(t>=1)clearInterval(fadeMusic._t)},25)}
function startAudio(){if(started)return;started=true;music.play().catch(()=>{});pack.load()}
document.querySelector('#startGame')?.addEventListener('click',startAudio,{passive:true});
const wrap=document.querySelector('#boxwrap');if(!wrap)return;
new MutationObserver(()=>{if(!wrap.classList.contains('closed'))return;clearTimeout(restoreTimer);fadeMusic(.045,90);pack.pause();pack.currentTime=0;pack.play().catch(()=>{});restoreTimer=setTimeout(()=>fadeMusic(.18,500),700)}).observe(wrap,{attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange',()=>{if(document.hidden){music.pause();pack.pause()}else if(started)music.play().catch(()=>{})});
})();

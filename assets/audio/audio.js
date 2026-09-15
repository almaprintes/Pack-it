(()=>{
const music=new Audio('assets/audio/music-cozy-jazz-v1.mp3?v=0049');
const pack=new Audio('assets/audio/pack-it-voice-v1.mp3?v=0049');
music.loop=true;music.preload='auto';music.volume=.18;pack.preload='auto';pack.volume=.95;
let started=false,duckTimer=0,restoreTimer=0;
function fadeMusic(target,duration=350){clearInterval(fadeMusic._t);const from=music.volume,start=performance.now();fadeMusic._t=setInterval(()=>{const t=Math.min(1,(performance.now()-start)/duration);music.volume=from+(target-from)*t;if(t>=1)clearInterval(fadeMusic._t)},25)}
function startAudio(){if(started)return;started=true;music.play().catch(()=>{});}
document.querySelector('#startGame')?.addEventListener('click',startAudio,{passive:true});
const wrap=document.querySelector('#boxwrap');if(!wrap)return;
new MutationObserver(()=>{if(!wrap.classList.contains('closed'))return;clearTimeout(duckTimer);clearTimeout(restoreTimer);fadeMusic(.045,140);duckTimer=setTimeout(()=>{pack.currentTime=0;pack.play().catch(()=>{})},80);restoreTimer=setTimeout(()=>fadeMusic(.18,650),1150)}).observe(wrap,{attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange',()=>{if(document.hidden){music.pause();pack.pause()}else if(started)music.play().catch(()=>{})});
})();

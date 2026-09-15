(()=>{
const VERSION='DEV 0.0.60';
document.querySelectorAll('.version,.splash-version').forEach(e=>e.textContent=VERSION);
const music=new Audio('assets/audio/music-cozy-jazz-v1.mp3?v=0060');
music.loop=true;music.preload='auto';music.volume=.18;
let started=false,restoreTimer=0,audioCtx=null;
function fadeMusic(target,duration=350){clearInterval(fadeMusic._t);const from=music.volume,start=performance.now();fadeMusic._t=setInterval(()=>{const t=Math.min(1,(performance.now()-start)/duration);music.volume=from+(target-from)*t;if(t>=1)clearInterval(fadeMusic._t)},25)}
function getCtx(){if(!audioCtx){const C=window.AudioContext||window.webkitAudioContext;if(C)audioCtx=new C()}if(audioCtx?.state==='suspended')audioCtx.resume().catch(()=>{});return audioCtx}
function bell(ctx,when,freq,gain=.055,dur=.8){
  const out=ctx.createGain();out.gain.setValueAtTime(.0001,when);out.gain.exponentialRampToValueAtTime(gain,when+.012);out.gain.exponentialRampToValueAtTime(.0001,when+dur);out.connect(ctx.destination);
  [[1,'sine',1],[2.01,'sine',.24],[3.98,'sine',.08]].forEach(([mul,type,level])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq*mul,when);g.gain.value=level;o.connect(g);g.connect(out);o.start(when);o.stop(when+dur+.03)});
}
function perfectChime(){const ctx=getCtx();if(!ctx)return;const t=ctx.currentTime+.025;bell(ctx,t,659.25,.042,.68);bell(ctx,t+.13,783.99,.048,.78);bell(ctx,t+.27,987.77,.055,.95);bell(ctx,t+.43,1318.51,.032,.72)}
function startAudio(){if(started)return;started=true;getCtx();music.play().catch(()=>{})}
function stopCelebration(){clearTimeout(restoreTimer);fadeMusic(.18,180)}
document.querySelector('#startGame')?.addEventListener('click',startAudio,{passive:true});
document.querySelector('#next')?.addEventListener('pointerdown',stopCelebration,{passive:true});
const wrap=document.querySelector('#boxwrap');if(!wrap)return;
new MutationObserver(()=>{if(!wrap.classList.contains('closed'))return;clearTimeout(restoreTimer);fadeMusic(.055,90);perfectChime();restoreTimer=setTimeout(()=>fadeMusic(.18,500),900)}).observe(wrap,{attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange',()=>{if(document.hidden){music.pause()}else if(started)music.play().catch(()=>{})});
})();

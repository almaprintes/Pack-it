(()=>{
const BUILD=window.PACKIT_BUILD;
const music=new Audio(`assets/audio/music-cozy-jazz-v1.mp3?v=${BUILD}`);
const conveyor=new Audio(`assets/audio/pack-it-conveyor-mechanical.mp3?v=${BUILD}`);
music.loop=true;music.preload='auto';music.volume=.18;
conveyor.preload='auto';conveyor.volume=1;
let started=false,restoreTimer=0,audioCtx=null,chimeBus=null,conveyorRunning=false;
function fadeMusic(target,duration=350){clearInterval(fadeMusic._t);const from=music.volume,start=performance.now();fadeMusic._t=setInterval(()=>{const t=Math.min(1,(performance.now()-start)/duration);music.volume=from+(target-from)*t;if(t>=1)clearInterval(fadeMusic._t)},25)}
function getCtx(){if(!audioCtx){const C=window.AudioContext||window.webkitAudioContext;if(C)audioCtx=new C()}if(audioCtx?.state==='suspended')audioCtx.resume().catch(()=>{});return audioCtx}
function bell(ctx,bus,when,freq,gain=.055,dur=.8){const out=ctx.createGain();out.gain.setValueAtTime(.0001,when);out.gain.exponentialRampToValueAtTime(gain,when+.012);out.gain.exponentialRampToValueAtTime(.0001,when+dur);out.connect(bus);[[1,1],[2.01,.24],[3.98,.08]].forEach(([mul,level])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(freq*mul,when);g.gain.value=level;o.connect(g);g.connect(out);o.start(when);o.stop(when+dur+.03)})}
function stopChime(){if(!audioCtx||!chimeBus)return;const t=audioCtx.currentTime;try{chimeBus.gain.cancelScheduledValues(t);chimeBus.gain.setValueAtTime(Math.max(.0001,chimeBus.gain.value),t);chimeBus.gain.exponentialRampToValueAtTime(.0001,t+.035)}catch(e){}chimeBus=null}
function perfectChime(){const ctx=getCtx();if(!ctx)return;stopChime();const bus=ctx.createGain();bus.gain.value=1;bus.connect(ctx.destination);chimeBus=bus;const t=ctx.currentTime+.025;bell(ctx,bus,t,659.25,.042,.68);bell(ctx,bus,t+.13,783.99,.048,.78);bell(ctx,bus,t+.27,987.77,.055,.95);bell(ctx,bus,t+.43,1318.51,.032,.72);setTimeout(()=>{if(chimeBus===bus)chimeBus=null},1250)}
function primeConveyor(){conveyor.load()}
function startAudio(){if(started)return;started=true;getCtx();primeConveyor();music.play().catch(()=>{})}
function seekConveyorStart(){try{conveyor.currentTime=.5}catch(e){}}
function playConveyor(){conveyorRunning=true;conveyor.pause();seekConveyorStart();const p=conveyor.play();if(p?.catch)p.catch(()=>{})}
function stopConveyor(){conveyorRunning=false;conveyor.pause();seekConveyorStart()}
conveyor.addEventListener('ended',()=>{if(!conveyorRunning)return;seekConveyorStart();const p=conveyor.play();if(p?.catch)p.catch(()=>{})});
document.querySelector('#startGame')?.addEventListener('click',startAudio,{passive:true});
window.addEventListener('packit:conveyor-start',playConveyor);
window.addEventListener('packit:conveyor-stop',stopConveyor);
const wrap=document.querySelector('#boxwrap');if(!wrap)return;
let wasClosed=wrap.classList.contains('closed');
new MutationObserver(()=>{const isClosed=wrap.classList.contains('closed');if(isClosed&&!wasClosed){clearTimeout(restoreTimer);fadeMusic(.055,90);perfectChime();restoreTimer=setTimeout(()=>fadeMusic(.18,500),900)}wasClosed=isClosed}).observe(wrap,{attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange',()=>{if(document.hidden){music.pause();stopConveyor();stopChime()}else if(started){primeConveyor();music.play().catch(()=>{})}});
})();

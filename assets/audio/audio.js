(()=>{
const BUILD=window.PACKIT_BUILD;
const music=new Audio(`assets/audio/music-cozy-jazz-v1.mp3?v=${BUILD}`);
const conveyor=new Audio(`assets/audio/pack-it-conveyor-mechanical.mp3?v=${BUILD}`);
music.loop=true;music.preload='auto';music.volume=.6;
conveyor.preload='auto';conveyor.volume=1;
let started=false,restoreTimer=0,audioCtx=null,chimeBus=null,conveyorRunning=false,musicEnabled=true,effectsEnabled=true,musicLevel=.6,effectsLevel=1;
function fadeMusic(target,duration=350){clearInterval(fadeMusic._t);const from=music.volume,start=performance.now();fadeMusic._t=setInterval(()=>{const t=Math.min(1,(performance.now()-start)/duration);music.volume=from+(target-from)*t;if(t>=1)clearInterval(fadeMusic._t)},25)}
function getCtx(){if(!audioCtx){const C=window.AudioContext||window.webkitAudioContext;if(C)audioCtx=new C()}if(audioCtx?.state==='suspended')audioCtx.resume().catch(()=>{});return audioCtx}
function bell(ctx,bus,when,freq,gain=.055,dur=.8){const out=ctx.createGain();out.gain.setValueAtTime(.0001,when);out.gain.exponentialRampToValueAtTime(gain,when+.012);out.gain.exponentialRampToValueAtTime(.0001,when+dur);out.connect(bus);[[1,1],[2.01,.24],[3.98,.08]].forEach(([mul,level])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(freq*mul,when);g.gain.value=level;o.connect(g);g.connect(out);o.start(when);o.stop(when+dur+.03)})}
function stopChime(){if(!audioCtx||!chimeBus)return;const t=audioCtx.currentTime;try{chimeBus.gain.cancelScheduledValues(t);chimeBus.gain.setValueAtTime(Math.max(.0001,chimeBus.gain.value),t);chimeBus.gain.exponentialRampToValueAtTime(.0001,t+.035)}catch(e){}chimeBus=null}
function perfectChime(){if(!effectsEnabled)return;const ctx=getCtx();if(!ctx)return;stopChime();const bus=ctx.createGain();bus.gain.value=effectsLevel;bus.connect(ctx.destination);chimeBus=bus;const t=ctx.currentTime+.025;bell(ctx,bus,t,659.25,.042,.68);bell(ctx,bus,t+.13,783.99,.048,.78);bell(ctx,bus,t+.27,987.77,.055,.95);bell(ctx,bus,t+.43,1318.51,.032,.72);setTimeout(()=>{if(chimeBus===bus)chimeBus=null},1250)}
function selectionTick(){if(!effectsEnabled)return;const ctx=getCtx();if(!ctx)return;const t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(520,t);o.frequency.exponentialRampToValueAtTime(690,t+.045);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.16*effectsLevel,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+.07);o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+.075)}
function transformSound(kind){if(!effectsEnabled)return;const ctx=getCtx();if(!ctx)return;const t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type=kind==='cable'?'triangle':'sine';o.frequency.setValueAtTime(kind==='cable'?250:430,t);o.frequency.exponentialRampToValueAtTime(kind==='cable'?620:220,t+.14);f.type='lowpass';f.frequency.value=1800;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.24*effectsLevel,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+.19);o.connect(f);f.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+.2)}
function stampHit(){if(!effectsEnabled)return;const ctx=getCtx();if(!ctx)return;const t=ctx.currentTime,n=ctx.createBufferSource(),buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.075),ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,4);n.buffer=buf;const filter=ctx.createBiquadFilter(),g=ctx.createGain();filter.type='lowpass';filter.frequency.value=1450;g.gain.setValueAtTime(.62*effectsLevel,t);g.gain.exponentialRampToValueAtTime(.0001,t+.075);n.connect(filter);filter.connect(g);g.connect(ctx.destination);n.start(t);n.stop(t+.08)}
function primeConveyor(){conveyor.load()}
function startAudio(){if(started)return;started=true;getCtx();primeConveyor();if(musicEnabled)music.play().catch(()=>{})}
function seekConveyorStart(){try{conveyor.currentTime=.5}catch(e){}}
function playConveyor(){if(!effectsEnabled)return;conveyor.volume=effectsLevel;conveyorRunning=true;conveyor.pause();seekConveyorStart();const p=conveyor.play();if(p?.catch)p.catch(()=>{})}
function stopConveyor(){conveyorRunning=false;conveyor.pause();seekConveyorStart()}
conveyor.addEventListener('ended',()=>{if(!conveyorRunning)return;seekConveyorStart();const p=conveyor.play();if(p?.catch)p.catch(()=>{})});
document.querySelector('#startGame')?.addEventListener('click',startAudio,{passive:true});
window.addEventListener('packit:conveyor-start',playConveyor);
window.addEventListener('packit:item-select',selectionTick);
window.addEventListener('packit:stamp-hit',stampHit);
window.addEventListener('packit:item-transform',e=>transformSound(e.detail?.kind));
window.addEventListener('packit:conveyor-stop',stopConveyor);
const wrap=document.querySelector('#boxwrap');if(!wrap)return;
let wasClosed=wrap.classList.contains('closed');
new MutationObserver(()=>{const isClosed=wrap.classList.contains('closed');if(isClosed&&!wasClosed){clearTimeout(restoreTimer);fadeMusic(musicLevel*.3,90);perfectChime();restoreTimer=setTimeout(()=>fadeMusic(musicLevel,500),900)}wasClosed=isClosed}).observe(wrap,{attributes:true,attributeFilter:['class']});
window.addEventListener('packit:audio-settings',e=>{musicEnabled=e.detail?.music!==false;effectsEnabled=e.detail?.effects!==false;musicLevel=Math.max(0,Math.min(1,Number(e.detail?.musicVolume??60)/100));effectsLevel=Math.max(0,Math.min(1,Number(e.detail?.effectsVolume??100)/100));music.volume=musicLevel;conveyor.volume=effectsLevel;if(!musicEnabled)music.pause();else if(started)music.play().catch(()=>{});if(!effectsEnabled){stopConveyor();stopChime()}});
window.addEventListener('packit:menu-open',()=>{music.pause();stopConveyor();stopChime()});
window.addEventListener('packit:game-resume',()=>{if(started&&musicEnabled){primeConveyor();music.play().catch(()=>{})}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){music.pause();stopConveyor();stopChime()}else if(started&&musicEnabled){primeConveyor();music.play().catch(()=>{})}});
})();

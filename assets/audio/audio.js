(()=>{
const BUILD=window.PACKIT_BUILD,VERSION=window.PACKIT_VERSION;
const music=new Audio(`assets/audio/music-cozy-jazz-v1.mp3?v=${BUILD}`);
music.loop=true;music.preload='auto';music.volume=.18;
let started=false,restoreTimer=0,audioCtx=null,chimeBus=null;
function fadeMusic(target,duration=350){clearInterval(fadeMusic._t);const from=music.volume,start=performance.now();fadeMusic._t=setInterval(()=>{const t=Math.min(1,(performance.now()-start)/duration);music.volume=from+(target-from)*t;if(t>=1)clearInterval(fadeMusic._t)},25)}
function getCtx(){if(!audioCtx){const C=window.AudioContext||window.webkitAudioContext;if(C)audioCtx=new C()}if(audioCtx?.state==='suspended')audioCtx.resume().catch(()=>{});return audioCtx}
function bell(ctx,bus,when,freq,gain=.055,dur=.8){const out=ctx.createGain();out.gain.setValueAtTime(.0001,when);out.gain.exponentialRampToValueAtTime(gain,when+.012);out.gain.exponentialRampToValueAtTime(.0001,when+dur);out.connect(bus);[[1,1],[2.01,.24],[3.98,.08]].forEach(([mul,level])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(freq*mul,when);g.gain.value=level;o.connect(g);g.connect(out);o.start(when);o.stop(when+dur+.03)})}
function stopChime(){if(!audioCtx||!chimeBus)return;const t=audioCtx.currentTime;try{chimeBus.gain.cancelScheduledValues(t);chimeBus.gain.setValueAtTime(Math.max(.0001,chimeBus.gain.value),t);chimeBus.gain.exponentialRampToValueAtTime(.0001,t+.035)}catch(e){}chimeBus=null}
function perfectChime(){const ctx=getCtx();if(!ctx)return;stopChime();const bus=ctx.createGain();bus.gain.value=1;bus.connect(ctx.destination);chimeBus=bus;const t=ctx.currentTime+.025;bell(ctx,bus,t,659.25,.042,.68);bell(ctx,bus,t+.13,783.99,.048,.78);bell(ctx,bus,t+.27,987.77,.055,.95);bell(ctx,bus,t+.43,1318.51,.032,.72);setTimeout(()=>{if(chimeBus===bus)chimeBus=null},1250)}
function boxSlide(){const ctx=getCtx();if(!ctx)return;const t=ctx.currentTime+.01,d=.52,n=ctx.createBuffer(1,Math.floor(ctx.sampleRate*d),ctx.sampleRate),a=n.getChannelData(0);for(let i=0;i<a.length;i++){const x=i/a.length;a[i]=(Math.random()*2-1)*(1-x)*(.65+.35*Math.sin(i*.19))}const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=n;filter.type='bandpass';filter.frequency.setValueAtTime(520,t);filter.frequency.exponentialRampToValueAtTime(170,t+d);filter.Q.value=.7;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.105,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);src.connect(filter);filter.connect(g);g.connect(ctx.destination);src.start(t);src.stop(t+d);const tap=ctx.createOscillator(),tg=ctx.createGain();tap.type='triangle';tap.frequency.setValueAtTime(145,t);tap.frequency.exponentialRampToValueAtTime(76,t+.1);tg.gain.setValueAtTime(.13,t);tg.gain.exponentialRampToValueAtTime(.0001,t+.13);tap.connect(tg);tg.connect(ctx.destination);tap.start(t);tap.stop(t+.14)}
function startAudio(){if(started)return;started=true;getCtx();music.play().catch(()=>{})}
function nextBoxSound(){clearTimeout(restoreTimer);stopChime();fadeMusic(.035,70);boxSlide();restoreTimer=setTimeout(()=>fadeMusic(.18,420),560)}
document.querySelector('#startGame')?.addEventListener('click',startAudio,{passive:true});
document.querySelector('#next')?.addEventListener('pointerdown',nextBoxSound,{passive:true});
const wrap=document.querySelector('#boxwrap');if(!wrap)return;
new MutationObserver(()=>{if(!wrap.classList.contains('closed'))return;clearTimeout(restoreTimer);fadeMusic(.055,90);perfectChime();restoreTimer=setTimeout(()=>fadeMusic(.18,500),900)}).observe(wrap,{attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange',()=>{if(document.hidden){music.pause();stopChime()}else if(started)music.play().catch(()=>{})});
})();

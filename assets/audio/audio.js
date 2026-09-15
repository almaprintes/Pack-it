(()=>{
const BUILD=window.PACKIT_BUILD;
const music=new Audio(`assets/audio/music-cozy-jazz-v1.mp3?v=${BUILD}`);
music.loop=true;music.preload='auto';music.volume=.18;
let started=false,restoreTimer=0,audioCtx=null,chimeBus=null;
function fadeMusic(target,duration=350){clearInterval(fadeMusic._t);const from=music.volume,start=performance.now();fadeMusic._t=setInterval(()=>{const t=Math.min(1,(performance.now()-start)/duration);music.volume=from+(target-from)*t;if(t>=1)clearInterval(fadeMusic._t)},25)}
function getCtx(){if(!audioCtx){const C=window.AudioContext||window.webkitAudioContext;if(C)audioCtx=new C()}if(audioCtx?.state==='suspended')audioCtx.resume().catch(()=>{});return audioCtx}
function bell(ctx,bus,when,freq,gain=.055,dur=.8){const out=ctx.createGain();out.gain.setValueAtTime(.0001,when);out.gain.exponentialRampToValueAtTime(gain,when+.012);out.gain.exponentialRampToValueAtTime(.0001,when+dur);out.connect(bus);[[1,1],[2.01,.24],[3.98,.08]].forEach(([mul,level])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(freq*mul,when);g.gain.value=level;o.connect(g);g.connect(out);o.start(when);o.stop(when+dur+.03)})}
function stopChime(){if(!audioCtx||!chimeBus)return;const t=audioCtx.currentTime;try{chimeBus.gain.cancelScheduledValues(t);chimeBus.gain.setValueAtTime(Math.max(.0001,chimeBus.gain.value),t);chimeBus.gain.exponentialRampToValueAtTime(.0001,t+.035)}catch(e){}chimeBus=null}
function perfectChime(){const ctx=getCtx();if(!ctx)return;stopChime();const bus=ctx.createGain();bus.gain.value=1;bus.connect(ctx.destination);chimeBus=bus;const t=ctx.currentTime+.025;bell(ctx,bus,t,659.25,.042,.68);bell(ctx,bus,t+.13,783.99,.048,.78);bell(ctx,bus,t+.27,987.77,.055,.95);bell(ctx,bus,t+.43,1318.51,.032,.72);setTimeout(()=>{if(chimeBus===bus)chimeBus=null},1250)}
function cardboardSend(){const ctx=getCtx();if(!ctx)return;const t=ctx.currentTime+.008;
  // Dry cardboard thump: short filtered noise, no synthetic pitched oscillator.
  const dur=.16,buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*dur),ctx.sampleRate),a=buf.getChannelData(0);for(let i=0;i<a.length;i++){const x=i/a.length;a[i]=(Math.random()*2-1)*Math.pow(1-x,3)}
  const hit=ctx.createBufferSource(),lp=ctx.createBiquadFilter(),hp=ctx.createBiquadFilter(),hg=ctx.createGain();hit.buffer=buf;lp.type='lowpass';lp.frequency.value=900;hp.type='highpass';hp.frequency.value=75;hg.gain.setValueAtTime(.72,t);hg.gain.exponentialRampToValueAtTime(.0001,t+dur);hit.connect(lp);lp.connect(hp);hp.connect(hg);hg.connect(ctx.destination);hit.start(t);hit.stop(t+dur);
  // Softer scrape follows the impact as the box starts moving.
  const sd=.42,sbuf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*sd),ctx.sampleRate),sa=sbuf.getChannelData(0);for(let i=0;i<sa.length;i++){const x=i/sa.length;sa[i]=(Math.random()*2-1)*Math.sin(Math.PI*x)*(1-x)}const scrape=ctx.createBufferSource(),bp=ctx.createBiquadFilter(),sg=ctx.createGain();scrape.buffer=sbuf;bp.type='bandpass';bp.frequency.setValueAtTime(480,t+.035);bp.frequency.exponentialRampToValueAtTime(180,t+.035+sd);bp.Q.value=.55;sg.gain.setValueAtTime(.0001,t+.035);sg.gain.exponentialRampToValueAtTime(.16,t+.07);sg.gain.exponentialRampToValueAtTime(.0001,t+.035+sd);scrape.connect(bp);bp.connect(sg);sg.connect(ctx.destination);scrape.start(t+.035);scrape.stop(t+.035+sd)
}
function startAudio(){if(started)return;started=true;getCtx();music.play().catch(()=>{})}
function nextBoxSound(){clearTimeout(restoreTimer);stopChime();clearInterval(fadeMusic._t);music.pause();cardboardSend();restoreTimer=setTimeout(()=>{if(started){music.volume=.035;music.play().catch(()=>{});fadeMusic(.18,650)}},720)}
document.querySelector('#startGame')?.addEventListener('click',startAudio,{passive:true});
document.querySelector('#next')?.addEventListener('pointerdown',nextBoxSound,{passive:true,capture:true});
const wrap=document.querySelector('#boxwrap');if(!wrap)return;
let wasClosed=wrap.classList.contains('closed');
new MutationObserver(()=>{const isClosed=wrap.classList.contains('closed');if(isClosed&&!wasClosed){clearTimeout(restoreTimer);fadeMusic(.055,90);perfectChime();restoreTimer=setTimeout(()=>fadeMusic(.18,500),900)}wasClosed=isClosed}).observe(wrap,{attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange',()=>{if(document.hidden){music.pause();stopChime()}else if(started)music.play().catch(()=>{})});
})();

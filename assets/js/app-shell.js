(()=>{
const KEY='packit_save_v1',SETTINGS='packit_settings_v1';
const $=s=>document.querySelector(s);
const splash=$('#splash'),startHook=$('#startGame'),menuActions=$('#mainMenuActions'),continueBtn=$('#continueGame'),newBtn=$('#newGame'),settingsBtn=$('#settingsBtn'),exitBtn=$('#exitToMenu');
const settingsPanel=$('#settingsPanel'),newConfirm=$('#newGameConfirm'),adBreak=$('#adBreak'),adContinue=$('#adContinue');
const musicToggle=$('#musicToggle'),effectsToggle=$('#effectsToggle'),languageSelect=$('#languageSelect'),total=$('#levelTotal');
const defaults={music:true,effects:true,language:'es'};
const copy=o=>JSON.parse(JSON.stringify(o));
function read(key,fallback){try{return Object.assign(copy(fallback),JSON.parse(localStorage.getItem(key)||'{}'))}catch(e){return copy(fallback)}}
function saveProgress(data){localStorage.setItem(KEY,JSON.stringify(data));refreshMenu()}
function progress(){return read(KEY,{current:0,unlocked:0,started:false})}
let settings=read(SETTINGS,defaults);
const words={
 es:{tagline:'ORDENA · ENCAJA · ENVÍA',continue:'CONTINUAR',newGame:'NUEVO JUEGO',settings:'⚙ CONFIGURACIÓN',settingsTitle:'CONFIGURACIÓN',music:'Música',effects:'Efectos',language:'Idioma',back:'VOLVER',newGameTitle:'¿NUEVO JUEGO?',newGameWarning:'Se perderá el progreso de la partida actual.',confirmNew:'SÍ, EMPEZAR DE NUEVO',cancel:'CANCELAR',adBreak:'PAUSA PUBLICITARIA',adDev:'Espacio preparado para el anuncio entre bloques.',box:'Caja',next:'Siguiente caja →',exit:'SALIR'},
 en:{tagline:'SORT · FIT · SHIP',continue:'CONTINUE',newGame:'NEW GAME',settings:'⚙ SETTINGS',settingsTitle:'SETTINGS',music:'Music',effects:'Effects',language:'Language',back:'BACK',newGameTitle:'NEW GAME?',newGameWarning:'Your current game progress will be lost.',confirmNew:'YES, START OVER',cancel:'CANCEL',adBreak:'AD BREAK',adDev:'Space prepared for the ad between level blocks.',box:'Box',next:'Next box →',exit:'EXIT'}
};
function applyLanguage(){
 const t=words[settings.language]||words.es;
 document.documentElement.lang=settings.language;
 document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(t[k])e.textContent=t[k]});
 const next=$('#next');if(next)next.textContent=t.next;
}
function emitAudio(){window.dispatchEvent(new CustomEvent('packit:audio-settings',{detail:{music:settings.music,effects:settings.effects}}))}
function saveSettings(){localStorage.setItem(SETTINGS,JSON.stringify(settings));applyLanguage();emitAudio()}
function refreshMenu(){const p=progress();continueBtn.disabled=!p.started;continueBtn.textContent=(words[settings.language]||words.es).continue+(p.started?' · '+(p.current+1):'')}
function revealMenu(){startHook.classList.add('menu-gone');menuActions.classList.remove('menu-actions-hidden');refreshMenu()}
function showMenu(){splash.classList.remove('hide');revealMenu();window.dispatchEvent(new Event('packit:menu-open'));refreshMenu()}
function begin(at,newRun=false){
 level=Math.max(0,Math.min(levels.length-1,at));
 load();
 splash.classList.add('hide');settingsPanel.classList.remove('show');newConfirm.classList.remove('show');
 saveProgress({current:level,unlocked:newRun?0:Math.max(progress().unlocked,level),started:true});
 window.dispatchEvent(new CustomEvent('packit:game-resume'));
 window.dispatchEvent(new CustomEvent('packit:level-start',{detail:{level}}));
}
function nextAfterBreak(){
 level++;load(true);nextBusy=false;
 saveProgress({current:level,unlocked:Math.max(progress().unlocked,level),started:true});
 adBreak.classList.remove('show');
 window.dispatchEvent(new Event('packit:game-resume'));
 window.dispatchEvent(new CustomEvent('packit:level-start',{detail:{level}}));
}
// Always boot into the explicit title gate. Do not trust restored DOM state from mobile browsers/BFCache.
splash.classList.remove('hide');
startHook.classList.remove('menu-gone');
menuActions.classList.add('menu-actions-hidden');
settingsPanel.classList.remove('show');
newConfirm.classList.remove('show');
adBreak.classList.remove('show');
total.textContent=levels.length;
musicToggle.checked=settings.music;effectsToggle.checked=settings.effects;languageSelect.value=settings.language;
applyLanguage();refreshMenu();emitAudio();
startHook.addEventListener('click',()=>{revealMenu();window.dispatchEvent(new CustomEvent('packit:game-resume'))});
continueBtn.addEventListener('click',()=>begin(progress().current));
newBtn.addEventListener('click',()=>{progress().started?newConfirm.classList.add('show'):begin(0,true)});
$('#confirmNewGame').addEventListener('click',()=>{localStorage.removeItem(KEY);begin(0,true)});
$('#cancelNewGame').addEventListener('click',()=>newConfirm.classList.remove('show'));
settingsBtn.addEventListener('click',()=>settingsPanel.classList.add('show'));
$('#settingsClose').addEventListener('click',()=>settingsPanel.classList.remove('show'));
musicToggle.addEventListener('change',()=>{settings.music=musicToggle.checked;saveSettings()});
effectsToggle.addEventListener('change',()=>{settings.effects=effectsToggle.checked;saveSettings()});
languageSelect.addEventListener('change',()=>{settings.language=languageSelect.value;saveSettings();refreshMenu()});
exitBtn.addEventListener('click',showMenu);
window.addEventListener('packit:level-complete',()=>{const p=progress(),nextLevel=Math.min(levels.length-1,level+1);saveProgress({current:nextLevel,unlocked:Math.max(p.unlocked,nextLevel),started:true})});
window.addEventListener('packit:run-complete',()=>saveProgress({current:0,unlocked:levels.length-1,started:false}));
$('#next').addEventListener('pointerdown',e=>{
 if(![4,9,14].includes(level)||!$('#next').classList.contains('show'))return;
 e.preventDefault();e.stopImmediatePropagation();nextBusy=true;$('#next').classList.remove('show');$('#win').classList.remove('show');boxwrap.classList.remove('shaking');adBreak.classList.add('show');window.dispatchEvent(new Event('packit:menu-open'));
},{capture:true});
adContinue.addEventListener('click',nextAfterBreak);
})();
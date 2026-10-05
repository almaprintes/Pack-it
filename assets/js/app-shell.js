(()=>{
const KEY='packit_save_v1',SETTINGS='packit_settings_v1';
const $=s=>document.querySelector(s);
const splash=$('#splash'),startHook=$('#startGame'),menuActions=$('#mainMenuActions'),continueBtn=$('#continueGame'),newBtn=$('#newGame'),settingsBtn=$('#settingsBtn'),exitBtn=$('#exitToMenu');
const settingsPanel=$('#settingsPanel'),newConfirm=$('#newGameConfirm'),adBreak=$('#adBreak'),adContinue=$('#adContinue');
const musicToggle=$('#musicToggle'),effectsToggle=$('#effectsToggle'),languagePicker=$('#languagePicker'),languageCurrent=$('#languageCurrent'),languageOptions=$('#languageOptions'),total=$('#levelTotal');
const defaults={music:true,effects:true,language:'es'};
const copy=o=>JSON.parse(JSON.stringify(o));
function read(key,fallback){try{return Object.assign(copy(fallback),JSON.parse(localStorage.getItem(key)||'{}'))}catch(e){return copy(fallback)}}
function saveProgress(data){localStorage.setItem(KEY,JSON.stringify(data));refreshMenu()}
function progress(){return read(KEY,{current:0,unlocked:0,started:false})}
let settings=read(SETTINGS,defaults);
function applyLanguage(){PackItI18n.apply(settings.language)}
function emitAudio(){window.dispatchEvent(new CustomEvent('packit:audio-settings',{detail:{music:settings.music,effects:settings.effects}}))}
function saveSettings(){localStorage.setItem(SETTINGS,JSON.stringify(settings));applyLanguage();emitAudio()}
function refreshMenu(){const p=progress();continueBtn.disabled=!p.started;continueBtn.textContent=PackItI18n.t('continue',settings.language)+(p.started?' · '+(p.current+1):'')}
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
musicToggle.checked=settings.music;effectsToggle.checked=settings.effects;const activeLang=languageOptions.querySelector(`[data-lang="${settings.language}"]`);if(activeLang)languageCurrent.textContent=activeLang.textContent;
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
languagePicker.addEventListener('click',()=>languageOptions.classList.toggle('show'));languageOptions.addEventListener('click',e=>{const b=e.target.closest('[data-lang]');if(!b)return;settings.language=b.dataset.lang;languageCurrent.textContent=b.textContent;languageOptions.classList.remove('show');saveSettings();refreshMenu()});
exitBtn.addEventListener('click',showMenu);
window.addEventListener('packit:level-complete',()=>{const p=progress(),nextLevel=Math.min(levels.length-1,level+1);saveProgress({current:nextLevel,unlocked:Math.max(p.unlocked,nextLevel),started:true})});
window.addEventListener('packit:run-complete',()=>saveProgress({current:0,unlocked:levels.length-1,started:false}));
$('#next').addEventListener('pointerdown',e=>{
 if(![4,9,14].includes(level)||!$('#next').classList.contains('show'))return;
 e.preventDefault();e.stopImmediatePropagation();nextBusy=true;$('#next').classList.remove('show');$('#win').classList.remove('show');boxwrap.classList.remove('shaking');adBreak.classList.add('show');window.dispatchEvent(new Event('packit:menu-open'));
},{capture:true});
adContinue.addEventListener('click',nextAfterBreak);
})();
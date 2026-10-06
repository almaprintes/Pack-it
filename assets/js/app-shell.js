(()=>{
const KEY='packit_save_v1',SETTINGS='packit_settings_v1';
const $=s=>document.querySelector(s);
const splash=$('#splash'),startHook=$('#startGame'),menuActions=$('#mainMenuActions'),continueBtn=$('#continueGame'),newBtn=$('#newGame'),settingsBtn=$('#settingsBtn'),exitBtn=$('#exitToMenu');
const settingsPanel=$('#settingsPanel'),newConfirm=$('#newGameConfirm'),adBreak=$('#adBreak'),adContinue=$('#adContinue');
const musicToggle=$('#musicToggle'),effectsToggle=$('#effectsToggle'),musicVolume=$('#musicVolume'),effectsVolume=$('#effectsVolume'),languagePicker=$('#languagePicker'),languageCurrent=$('#languageCurrent'),languageOptions=$('#languageOptions'),total=$('#levelTotal');
const defaults={music:true,effects:true,musicVolume:60,effectsVolume:100,language:'es',leftHanded:false};
const copy=o=>JSON.parse(JSON.stringify(o));
function read(key,fallback){try{return Object.assign(copy(fallback),JSON.parse(localStorage.getItem(key)||'{}'))}catch(e){return copy(fallback)}}
function saveProgress(data){localStorage.setItem(KEY,JSON.stringify(data));refreshMenu()}
function progress(){return read(KEY,{current:0,unlocked:0,started:false})}
let settings=read(SETTINGS,defaults);
function applyLanguage(){PackItI18n.apply(settings.language)}
function emitAudio(){window.dispatchEvent(new CustomEvent('packit:audio-settings',{detail:{music:settings.music,effects:settings.effects,musicVolume:Number(settings.musicVolume??60),effectsVolume:Number(settings.effectsVolume??100)}}))}
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
musicToggle.checked=settings.music;effectsToggle.checked=settings.effects;musicVolume.value=settings.musicVolume??60;effectsVolume.value=settings.effectsVolume??100;$('#musicVolumeValue').textContent=musicVolume.value+'%';$('#effectsVolumeValue').textContent=effectsVolume.value+'%';$('#leftHandToggle').checked=!!settings.leftHanded;const activeLang=languageOptions.querySelector(`[data-lang="${settings.language}"]`);if(activeLang)languageCurrent.textContent=activeLang.textContent;
applyLanguage();refreshMenu();emitAudio();
startHook.addEventListener('click',()=>{revealMenu();requestAnimationFrame(()=>{if(startHook.classList.contains('menu-gone')&&menuActions.classList.contains('menu-actions-hidden'))menuActions.classList.remove('menu-actions-hidden')});window.dispatchEvent(new CustomEvent('packit:game-resume'))});
continueBtn.addEventListener('click',()=>begin(progress().current));
newBtn.addEventListener('click',()=>{progress().started?newConfirm.classList.add('show'):window.PackItStory.showIntro()});
$('#confirmNewGame').addEventListener('click',()=>{localStorage.removeItem(KEY);newConfirm.classList.remove('show');window.PackItStory.showIntro()});
$('#cancelNewGame').addEventListener('click',()=>newConfirm.classList.remove('show'));
settingsBtn.addEventListener('click',()=>settingsPanel.classList.add('show'));const devMenu=$('#devChapterMenu'),devBox=$('.splash-box');let devTaps=0,devTapTimer=0;devBox?.addEventListener('click',()=>{clearTimeout(devTapTimer);devTaps++;if(devTaps>=5){devTaps=0;devMenu.classList.add('show')}else devTapTimer=setTimeout(()=>devTaps=0,1200)});$('#devChapterClose')?.addEventListener('click',()=>devMenu.classList.remove('show'));devMenu?.addEventListener('click',e=>{const b=e.target.closest('[data-dev-level]');if(!b)return;const target=Number(b.dataset.devLevel);devMenu.classList.remove('show');splash.classList.add('hide');begin(target)});
$('#settingsClose').addEventListener('click',()=>settingsPanel.classList.remove('show'));
musicToggle.addEventListener('change',()=>{settings.music=musicToggle.checked;saveSettings()});
effectsToggle.addEventListener('change',()=>{settings.effects=effectsToggle.checked;saveSettings()});musicVolume.addEventListener('input',()=>{settings.musicVolume=Number(musicVolume.value);$('#musicVolumeValue').textContent=musicVolume.value+'%';saveSettings()});effectsVolume.addEventListener('input',()=>{settings.effectsVolume=Number(effectsVolume.value);$('#effectsVolumeValue').textContent=effectsVolume.value+'%';saveSettings()});
$('#leftHandToggle').addEventListener('change',e=>{settings.leftHanded=e.target.checked;saveSettings()});
languagePicker.addEventListener('click',()=>languageOptions.classList.toggle('show'));languageOptions.addEventListener('click',e=>{const b=e.target.closest('[data-lang]');if(!b)return;settings.language=b.dataset.lang;languageCurrent.textContent=b.textContent;languageOptions.classList.remove('show');saveSettings();refreshMenu()});
exitBtn.addEventListener('click',showMenu);
window.addEventListener('packit:level-complete',()=>{const p=progress(),nextLevel=Math.min(levels.length-1,level+1);saveProgress({current:nextLevel,unlocked:Math.max(p.unlocked,nextLevel),started:true})});
window.addEventListener('packit:run-complete',()=>saveProgress({current:0,unlocked:levels.length-1,started:false}));
$('#next').addEventListener('pointerdown',e=>{
 if(![4,9,14,24,29,34].includes(level)||!$('#next').classList.contains('show'))return;
 e.preventDefault();e.stopImmediatePropagation();nextBusy=true;$('#next').classList.remove('show');$('#win').classList.remove('show');boxwrap.classList.remove('shaking');adBreak.classList.add('show');window.dispatchEvent(new Event('packit:menu-open'));
},{capture:true});
adContinue.addEventListener('click',nextAfterBreak);window.addEventListener('packit:story-begin',()=>begin(0,true));window.addEventListener('packit:brian-begin',()=>begin(20,false));window.addEventListener('packit:almonte-begin',()=>begin(40,false));
})();
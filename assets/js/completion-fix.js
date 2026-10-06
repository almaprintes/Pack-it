// Completion guard for real levels: only the current box decides whether the order is complete.
// This avoids unrelated .item nodes elsewhere in the document blocking PERFECT PACK.
check=function(){
 const packed=[...box.querySelectorAll('.item')];
 if(packed.length!==levelItems().length)return;
 win.classList.add('show');
 window.dispatchEvent(new CustomEvent('packit:level-complete',{detail:{level}}));
 rot.classList.remove('show');prepare.classList.remove('show');selected=null;
 if(navigator.vibrate)navigator.vibrate([25,30,55]);
 setTimeout(()=>{boxwrap.classList.add('shaking');if(navigator.vibrate)navigator.vibrate([15,35,15,30,20])},260);
 setTimeout(()=>{smoke.classList.remove('poof');void smoke.offsetWidth;smoke.classList.add('poof');boxwrap.classList.add('closed');if(navigator.vibrate)navigator.vibrate(28);if(levelData().chapter==='brian'){setTimeout(()=>{const stamp=document.querySelector('#brianStamp');if(stamp){stamp.classList.remove('stamping');void stamp.offsetWidth;stamp.classList.add('stamping')}boxwrap.classList.remove('stamp-hit');void boxwrap.offsetWidth;boxwrap.classList.add('stamp-hit');window.dispatchEvent(new CustomEvent('packit:stamp-hit'));if(navigator.vibrate)navigator.vibrate([12,22,42])},260)}},720);
 setTimeout(()=>boxwrap.classList.remove('shaking'),800);
 setTimeout(()=>next.classList.add('show'),1350);
};

// Drag footprint preview — shows the exact logical cells used by placement.
(()=>{
 const preview=document.createElement('div');
 preview.className='footprint-preview';
 box.appendChild(preview);

 function hide(){preview.classList.remove('show','valid','invalid');preview.innerHTML=''}
 function draw(e){
   if(!e||!e._st||!e.classList.contains('drag'))return hide();
   const r=e.getBoundingClientRect(),b=box.getBoundingClientRect();
   const cw=b.width/COLS,ch=b.height/ROWS;
   const col=Math.round((r.left-b.left)/cw),row=Math.round((r.top-b.top)/ch);
   const logical=cells(e._st.shape,row,col);
   const near=r.right>b.left-cw&&r.left<b.right+cw&&r.bottom>b.top-ch&&r.top<b.bottom+ch;
   if(!near)return hide();
   const valid=canPlace(e,row,col);
   preview.innerHTML='';
   logical.forEach(([rr,cc])=>{
     const cell=document.createElement('i');
     cell.style.left=(cc*cw)+'px';
     cell.style.top=(rr*ch)+'px';
     cell.style.width=cw+'px';
     cell.style.height=ch+'px';
     preview.appendChild(cell);
   });
   preview.classList.add('show');
   preview.classList.toggle('valid',valid);
   preview.classList.toggle('invalid',!valid);
 }
 document.addEventListener('pointermove',()=>requestAnimationFrame(()=>draw(selected)),{passive:true});
 document.addEventListener('pointerup',hide,{passive:true});
 document.addEventListener('pointercancel',hide,{passive:true});
 window.addEventListener('packit:level-complete',hide);
})();

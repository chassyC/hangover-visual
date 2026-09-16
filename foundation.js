'use strict';
(() => {
 const root=document.querySelector('#direzione'), track=document.querySelector('#atlasTrack');
 const catalog=window.HANGOVER_FOUNDATION, Motion=window.HangoverMotion;
 const groups=[
  {name:'Segno',theme:'signs',ids:[2021,2022,2023,211,213,208],positions:[[3,7,24],[29,7,24],[55,7,24],[82,7,15],[82,38,15],[82,69,15]]},
  {name:'Studio',theme:'studio',ids:[2011,2012,2013],positions:[[7,7,25],[38,7,25],[69,7,25]]},
  {name:'Materia',theme:'matter',ids:[203,214,204,215,205],positions:[[3,8,30],[37,6,25],[68,5,19],[69,53,19],[42,62,17]]},
  {name:'Club',theme:'club',ids:[206,207,210,212,220],positions:[[3,27,21],[26,8,18],[46,20,28],[77,4,20],[77,54,18]]},
  {name:'Finestre',theme:'windows',ids:[209,217,218,216,219],positions:[[2,3,24],[8,56,18],[32,8,34],[69,3,24],[76,56,18]]},
  {name:'Nuove',theme:'new',ids:[221,222],positions:[[9,5,35],[53,17,35]]}
 ];
 const nav=document.querySelector('#atlasNav');
 groups.forEach((group,index)=>{
  const article=document.createElement('article');article.className='atlas-board atlas-'+group.theme;
  article.id='atlas-'+group.theme;article.setAttribute('aria-label',(index+1)+' / '+group.name);
  const label=document.createElement('span');label.className='atlas-board-label';label.textContent=String(index+1).padStart(2,'0')+' / '+group.name.toUpperCase();article.append(label);
  group.ids.forEach((n,i)=>{
   const item=catalog.find(x=>x.id===n), [x,y,w]=group.positions[i];
   const button=document.createElement('button');button.className='atlas-image';button.dataset.foundation=item.id;
   button.style.cssText=`--x:${x}%;--y:${y}%;--w:${w}%;--ratio:${item.width}/${item.height}`;
   button.setAttribute('aria-label','Apri '+item.title);
   const img=window.HangoverImage.create(item);img.setAttribute('width',item.width);img.setAttribute('height',item.height);
   const number=document.createElement('span');number.className='atlas-image-number';number.textContent=item.displayNumber||String(item.number).padStart(2,'0');
   button.append(img,number);article.append(button);
  });
  track.append(article);
  const button=document.createElement('button');button.textContent=group.name;button.setAttribute('aria-controls',article.id);button.dataset.atlasPage=index;
  button.addEventListener('click',()=>go(index));nav.append(button);
 });
 const boards=Array.from(track.children), tabs=Array.from(nav.children);
 let active=0,frame=0,gesture=null,suppressUntil=0;
 function setActive(index){
  active=index;
  tabs.forEach((b,i)=>b.setAttribute('aria-current',String(i===index)));
  document.querySelector('#atlasCount').textContent=String(index+1).padStart(2,'0')+' / '+String(boards.length).padStart(2,'0');
  document.querySelector('#atlasPrev').disabled=index===0;
  document.querySelector('#atlasNext').disabled=index===boards.length-1;
  root.style.setProperty('--atlas-progress',(index+1)/boards.length);
 }
 function go(index){
  index=Math.max(0,Math.min(boards.length-1,index));
  track.scrollTo({left:boards[index].offsetLeft-boards[0].offsetLeft,behavior:Motion.enabled()?'smooth':'instant'});
 }
 function update(){
  frame=0;
  const index=boards.reduce((best,b,i)=>Math.abs(b.offsetLeft-boards[0].offsetLeft-track.scrollLeft)<Math.abs(boards[best].offsetLeft-boards[0].offsetLeft-track.scrollLeft)?i:best,0);
  if(index!==active)setActive(index);
 }
 track.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update);},{passive:true});
 document.querySelector('#atlasPrev').addEventListener('click',()=>go(active-1));
 document.querySelector('#atlasNext').addEventListener('click',()=>go(active+1));
 nav.addEventListener('keydown',e=>{
  const index=tabs.indexOf(e.target);if(index<0)return;
  const next=e.key==='ArrowRight'?Math.min(boards.length-1,index+1):e.key==='ArrowLeft'?Math.max(0,index-1):e.key==='Home'?0:e.key==='End'?boards.length-1:null;
  if(next===null)return;e.preventDefault();go(next);tabs[next].focus({preventScroll:true});
 });
 // Touch and trackpad retain native scrolling, momentum and pinch zoom.
 // Mouse drag adds the same direct manipulation without intercepting wheel scrolling.
 track.addEventListener('pointerdown',e=>{
  if(e.pointerType!=='mouse'||e.button!==0)return;
  gesture={id:e.pointerId,x:e.clientX,y:e.clientY,left:track.scrollLeft,dragged:false};
 });
 track.addEventListener('pointermove',e=>{
  if(!gesture||e.pointerId!==gesture.id)return;
  const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
  if(!gesture.dragged){
   if(Math.max(Math.abs(dx),Math.abs(dy))<7)return;
   if(Math.abs(dy)>Math.abs(dx)){gesture=null;return;}
   gesture.dragged=true;track.classList.add('is-mouse-dragging');track.setPointerCapture(e.pointerId);
  }
  e.preventDefault();track.scrollLeft=gesture.left-dx;
 },{passive:false});
 function release(){
  const old=gesture;gesture=null;if(!old)return;
  if(old.dragged){suppressUntil=performance.now()+400;track.classList.remove('is-mouse-dragging');update();go(active);}
  if(track.hasPointerCapture(old.id))track.releasePointerCapture(old.id);
 }
 track.addEventListener('pointerup',release);track.addEventListener('pointercancel',release);
 track.addEventListener('lostpointercapture',e=>{if(e.target===track)release();});
 track.addEventListener('pointerleave',()=>{if(gesture&&!gesture.dragged)gesture=null;});
 track.addEventListener('dragstart',e=>e.preventDefault());
 track.addEventListener('click',e=>{if(performance.now()<suppressUntil&&e.detail!==0){e.preventDefault();e.stopImmediatePropagation();}},{capture:true});
 setActive(0);
})();

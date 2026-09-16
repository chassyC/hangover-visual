'use strict';
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const catalog = window.HANGOVER_CATALOG;
const byId = id => catalog.find(x => x.id === Number(id));
const pad = n => String(n).padStart(2,'0');
const Motion = window.HangoverMotion;
const safeImage = (item, cls='') => { const b=document.createElement('button'); b.className=cls; b.dataset.image=item.id; b.setAttribute('aria-label','Apri '+item.title); const img=new Image(); img.src=item.src; img.alt=item.title; img.loading='lazy'; img.decoding='async'; b.append(img); return b; };

// Each composition shares one set of vector glyphs.
const preview=$('#identityPreview');
$$('[data-lockup]').forEach(b=>b.addEventListener('click',()=>{
 $$('[data-lockup]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
 const lockup=b.dataset.lockup;
 preview.replaceChildren();
 const el=document.createElement(lockup==='split'?'div':'i');
 if(lockup==='split'){el.className='split';['hang','over'].forEach(t=>{const i=document.createElement('i');i.className='mark '+t;el.append(i);});}
 else el.className='mark '+lockup;
 preview.append(el); preview.setAttribute('aria-label',b.textContent);
}));
$$('button[data-palette]').forEach(b=>b.addEventListener('click',()=>{
 $('#identityCanvas').dataset.palette=b.dataset.palette;
 $$('button[data-palette]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
}));
$('#letterWidth').addEventListener('input',e=>preview.style.width=e.target.value+'%');

const moods={
 club:{title:'CLUB',images:[6,23,17],colors:['#b7dff5','#064ccc','#ff5028','#080b0d']},
 trap:{title:'TRAP / RAP',images:[25,33,29],colors:['#b7dff5','#d02b23','#181119','#9471be']},
 reggaeton:{title:'REGGAETON',images:[28,32,31],colors:['#f18b28','#195c39','#eacc95','#d04432']},
 afro:{title:'AFROBEATS',images:[34],colors:['#f39c30','#164734','#d8b450','#ed6330']},
 amapiano:{title:'AMAPIANO',images:[27,38],colors:['#d5bb91','#28515a','#433326','#b48e62']},
 house:{title:'HOUSE',images:[1,37,26],colors:['#cbdde9','#5a93e7','#b864c1','#212c52']}
};
let moodRevision=0, currentMood=null, destroyMoodDeck=()=>{};
function warmMood(key){return Promise.all(moods[key].images.map(id=>Motion.loadImage(byId(id).src).catch(()=>{})));}
async function selectMood(key,focus=false){
 const tabs=$$('.mood-tabs button');
 tabs.forEach(b=>{const selected=b.dataset.mood===key;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;if(selected&&focus)b.focus();});
 if(key===currentMood && !$('#moodPanel').hasAttribute('aria-busy'))return;
 const revision=++moodRevision, m=moods[key], stack=$('#moodStack');
 $('#moodPanel').setAttribute('aria-busy','true');
 if(currentMood!==null){
  await warmMood(key);
  if(revision!==moodRevision)return;
  await Motion.animate(stack,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(10px)'}],130);
  if(revision!==moodRevision)return;
 }
 currentMood=key;
 $('#serate').dataset.mood=key; $('#moodTitle').textContent=m.title; $('#moodNumber').textContent=pad(Object.keys(moods).indexOf(key)+1)+' / 06'; $('#moodPanel').setAttribute('aria-labelledby','tab-'+key);
 const colors=$('#moodColors');colors.replaceChildren();m.colors.forEach(c=>{const i=document.createElement('i');i.style.background=c;i.title=c;colors.append(i);});
 destroyMoodDeck();stack.replaceChildren();
 m.images.forEach((id,i)=>{const b=safeImage(byId(id),'mood-card');b.style.setProperty('--card',i-(m.images.length-1)/2);b.firstElementChild.loading='eager';stack.append(b);});
 destroyMoodDeck=Motion.deck(stack);
 $('#moodPanel').removeAttribute('aria-busy');
 Motion.animate(stack,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],360);
}
$$('.mood-tabs button').forEach(b=>{
 b.addEventListener('pointerenter',()=>warmMood(b.dataset.mood));
 b.addEventListener('focus',()=>warmMood(b.dataset.mood));
 b.addEventListener('click',()=>selectMood(b.dataset.mood));
 b.addEventListener('keydown',e=>{const tabs=$$('.mood-tabs button');let n=tabs.indexOf(b);if(e.key==='ArrowRight')n=(n+1)%tabs.length;else if(e.key==='ArrowLeft')n=(n-1+tabs.length)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();selectMood(tabs[n].dataset.mood,true);});
});
selectMood('club');
Motion.deck($('.poster-fan'));

// Archive originals remain unchanged; display copies are compressed for the web.
let filtered=catalog, lightboxItems=catalog, lightboxIndex=0, lastFocused=null;
function renderArchive(category){filtered=category==='all'?catalog:catalog.filter(x=>x.category===category); const grid=$('#archiveGrid');grid.replaceChildren();filtered.forEach(item=>{const b=safeImage(item,'archive-item');const img=b.firstElementChild;const wrap=document.createElement('div');wrap.className='archive-image';wrap.append(img);const cap=document.createElement('figcaption');const title=document.createElement('span');title.textContent=item.title;const n=document.createElement('span');n.textContent=pad(item.id);cap.append(title,n);b.append(wrap,cap);grid.append(b);});$('#archiveCount').textContent=filtered.length+' / 39 immagini';}
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{$$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderArchive(b.dataset.filter);}));renderArchive('all');
const lightbox=$('#lightbox'), lightboxViewport=$('#lightboxViewport');
let imageRevision=0, activeImage=null, renderedIndex=0;
function warmNeighbours(){
 [-1,1].forEach(offset=>{const item=lightboxItems[(lightboxIndex+offset+lightboxItems.length)%lightboxItems.length];Motion.loadImage(item.src).catch(()=>{});});
}
async function showLightboxImage(direction=0){
 const revision=++imageRevision, index=lightboxIndex, item=lightboxItems[index];
 lightboxViewport.setAttribute('aria-busy','true');$('#lightboxStatus').textContent='';
 let source=item.src;
 try {await Motion.loadImage(source);}
 catch {try{source=item.original;await Motion.loadImage(source);}catch{
  if(revision===imageRevision){lightboxIndex=renderedIndex;lightboxViewport.removeAttribute('aria-busy');$('#lightboxStatus').textContent='Immagine non disponibile. Riprova tra poco.';}
  return;
 }}
 if(revision!==imageRevision || !lightbox.open)return;
 $$('.is-outgoing',lightboxViewport).forEach(img=>img.remove());
 const old=activeImage, img=new Image();
 img.id='lightboxImage';img.className='lightbox-image';img.alt=item.title;img.src=source;img.draggable=false;img.decoding='async';
 if(old){old.removeAttribute('id');old.alt='';old.setAttribute('aria-hidden','true');old.classList.add('is-outgoing');}
 else $('#lightboxImage')?.remove();
 lightboxViewport.append(img);activeImage=img;renderedIndex=index;
 $('#lightboxCaption').textContent=item.title;$('#lightboxCounter').textContent=pad(index+1)+' / '+pad(lightboxItems.length);$('#lightboxDownload').href=item.original;$('#lightboxDownload').download='hangover-'+pad(item.id)+'.'+item.original.split('.').pop();
 lightboxViewport.removeAttribute('aria-busy');
 Motion.animate(img,[{opacity:0,transform:'translate3d('+direction*55+'px,0,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],340);
 if(old){const from=old.style.transform||'translate3d(0,0,0)';Motion.animate(old,[{opacity:1,transform:from},{opacity:0,transform:'translate3d('+(-direction*65)+'px,0,0)'}],300).then(()=>old.remove());}
 // Keep the decoded preview visible until the full image is ready.
 if(source!==item.original)Motion.loadImage(item.original).then(()=>{if(revision===imageRevision&&img===activeImage&&lightbox.open)img.src=item.original;}).catch(()=>{});
 warmNeighbours();
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-image], [data-foundation], [data-campus]');if(!b)return;
 const foundation=b.hasAttribute('data-foundation'), campus=b.hasAttribute('data-campus');
 lastFocused=b;lightboxItems=campus?window.HANGOVER_CAMPUS:foundation?window.HANGOVER_FOUNDATION:b.closest('#archiveGrid')?filtered:catalog;lightboxIndex=lightboxItems.findIndex(x=>x.id===Number(campus?b.dataset.campus:foundation?b.dataset.foundation:b.dataset.image));
 lightbox.setAttribute('aria-label',campus?'Fuori / Campus':foundation?'Direzione visiva fondamentale':'Immagine della moodboard');
 lightbox.showModal();document.body.classList.add('modal-open');showLightboxImage();$('#lightboxClose').focus();
});
function shiftImage(n){lightboxIndex=(lightboxIndex+n+lightboxItems.length)%lightboxItems.length;showLightboxImage(n);}
$('#lightboxPrev').addEventListener('click',()=>shiftImage(-1));$('#lightboxNext').addEventListener('click',()=>shiftImage(1));$('#lightboxClose').addEventListener('click',()=>lightbox.close());
function settleImage(){if(!activeImage)return;const from=activeImage.style.transform;activeImage.style.removeProperty('transform');Motion.animate(activeImage,[{transform:from||'translateX(0)'},{transform:'translateX(0)'}],280);}
const lightboxSwipe=Motion.swipe(lightboxViewport,{
 move:dx=>{if(activeImage&&Motion.enabled())activeImage.style.transform='translate3d('+Math.max(-220,Math.min(220,dx))+'px,0,0)';},
 end:direction=>{if(direction)shiftImage(direction);else settleImage();},cancel:settleImage
});
lightbox.addEventListener('close',()=>{imageRevision++;lightboxSwipe.cancel();$$('.lightbox-image',lightboxViewport).forEach(img=>img.remove());activeImage=null;$('#lightboxStatus').textContent='';lightboxViewport.removeAttribute('aria-busy');document.body.classList.remove('modal-open');lastFocused?.focus({preventScroll:true});});
lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();shiftImage(-1);}if(e.key==='ArrowRight'){e.preventDefault();shiftImage(1);}});

// Motion controls apply to every animated surface, including the timecode.
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches, ticks=0;
function setPaused(v){v=v||reduced.matches;paused=v;document.body.classList.toggle('paused',v);if(v)Motion.finish();const b=$('#motionToggle');b.setAttribute('aria-pressed',String(v));b.setAttribute('aria-label',v?'Riprendi le animazioni':'Metti in pausa le animazioni');b.textContent=v?'▶':'Ⅱ';b.disabled=reduced.matches;if(reduced.matches)b.setAttribute('aria-label','Animazioni ridotte dalle preferenze di sistema');}
setPaused(paused);$('#motionToggle').addEventListener('click',()=>setPaused(!paused));reduced.addEventListener('change',e=>setPaused(e.matches));
setInterval(()=>{if(paused||document.hidden)return;ticks++;$('#timecode').textContent='00:'+pad(Math.floor(ticks/10/60)%60)+':'+pad(Math.floor(ticks/10)%60);},100);
$$('[data-motion]').forEach(b=>b.addEventListener('click',()=>{$$('.motion-options button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('.video-stage').dataset.effect=b.dataset.motion;}));
let carouselIndex=0;
const slides=[{mark:'h',label:'HANGOVER'},{image:6,label:'AFTER DARK'},{mark:'hgr',label:'ALL NIGHT'},{image:17,label:'FROM THE BOOTH'}];
function renderCarousel(){const el=$('#carouselWindow');el.replaceChildren();[0,1,2].forEach(i=>{const item=slides[(carouselIndex+i)%slides.length],c=document.createElement('div');c.className='carousel-card';if(item.image){const img=new Image();img.src=byId(item.image).src;img.alt=byId(item.image).title;img.loading='lazy';c.append(img);}const mark=document.createElement('i');mark.className='mark '+(item.mark||'word');c.append(mark);const label=document.createElement('span');label.textContent=item.label;c.append(label);el.append(c);});$('#carouselCount').textContent=pad(carouselIndex+1)+' / 04';}
function shiftCarousel(direction){
 carouselIndex=(carouselIndex+direction+slides.length)%slides.length;renderCarousel();
 Motion.animate($('#carouselWindow'),[{opacity:.45,transform:'translateX('+direction*24+'px)'},{opacity:1,transform:'translateX(0)'}],360);
}
$('#carouselPrev').addEventListener('click',()=>shiftCarousel(-1));$('#carouselNext').addEventListener('click',()=>shiftCarousel(1));renderCarousel();
Motion.swipe($('#carouselWindow'),{move:dx=>{if(Motion.enabled())$('#carouselWindow').style.transform='translateX('+Math.max(-40,Math.min(40,dx*.2))+'px)';},end:direction=>{$('#carouselWindow').style.removeProperty('transform');if(direction)shiftCarousel(direction);},cancel:()=>$('#carouselWindow').style.removeProperty('transform')});

// In serata: CSS motion runs only for the surfaces actually in view.
const serataSurfaces=$$('#notte .serata-title, #notte .editorial-photo, #notte .editorial-word, #notte .door-strip button');
serataSurfaces.forEach((el,i)=>{el.setAttribute('data-serata-motion','');el.style.setProperty('--serata-phase',(-i*1.3)+'s');});
const serataVisible=new Set();
function syncSerataMotion(){serataSurfaces.forEach(el=>el.classList.toggle('serata-active',serataVisible.has(el)&&!document.hidden));}
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(({target,isIntersecting})=>{if(isIntersecting)serataVisible.add(target);else serataVisible.delete(target);});
  syncSerataMotion();
 },{threshold:0});
 serataSurfaces.forEach(el=>observer.observe(el));
}else{serataSurfaces.forEach(el=>serataVisible.add(el));syncSerataMotion();}
document.addEventListener('visibilitychange',syncSerataMotion);

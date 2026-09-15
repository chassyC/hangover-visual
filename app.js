'use strict';
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const catalog = window.HANGOVER_CATALOG;
const byId = id => catalog.find(x => x.id === Number(id));
const pad = n => String(n).padStart(2,'0');
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
function selectMood(key,focus=false){
 const m=moods[key], keys=Object.keys(moods); $('#serate').dataset.mood=key; $('#moodTitle').textContent=m.title; $('#moodNumber').textContent=pad(keys.indexOf(key)+1)+' / 06'; $('#moodPanel').setAttribute('aria-labelledby','tab-'+key);
 const colors=$('#moodColors');colors.replaceChildren();m.colors.forEach(c=>{const i=document.createElement('i');i.style.background=c;i.title=c;colors.append(i);});
 const stack=$('#moodStack');stack.replaceChildren();m.images.forEach((id,i)=>{const b=safeImage(byId(id),'mood-card');b.style.setProperty('--card',i-(m.images.length-1)/2);stack.append(b);});
 $$('.mood-tabs button').forEach(b=>{const selected=b.dataset.mood===key;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;if(selected&&focus)b.focus();});
}
$$('.mood-tabs button').forEach(b=>{b.addEventListener('click',()=>selectMood(b.dataset.mood));b.addEventListener('keydown',e=>{const tabs=$$('.mood-tabs button');let n=tabs.indexOf(b);if(e.key==='ArrowRight')n=(n+1)%tabs.length;else if(e.key==='ArrowLeft')n=(n-1+tabs.length)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;e.preventDefault();selectMood(tabs[n].dataset.mood,true);});});
selectMood('club');

// Archive originals remain unchanged; display copies are compressed for the web.
let filtered=catalog, lightboxItems=catalog, lightboxIndex=0, lastFocused=null;
function renderArchive(category){filtered=category==='all'?catalog:catalog.filter(x=>x.category===category); const grid=$('#archiveGrid');grid.replaceChildren();filtered.forEach(item=>{const b=safeImage(item,'archive-item');const img=b.firstElementChild;const wrap=document.createElement('div');wrap.className='archive-image';wrap.append(img);const cap=document.createElement('figcaption');const title=document.createElement('span');title.textContent=item.title;const n=document.createElement('span');n.textContent=pad(item.id);cap.append(title,n);b.append(wrap,cap);grid.append(b);});$('#archiveCount').textContent=filtered.length+' / 39 immagini';}
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{$$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderArchive(b.dataset.filter);}));renderArchive('all');
const lightbox=$('#lightbox');
function showLightboxImage(){const item=lightboxItems[lightboxIndex];$('#lightboxImage').src=item.original;$('#lightboxImage').alt=item.title;$('#lightboxCaption').textContent=item.title;$('#lightboxCounter').textContent=pad(lightboxIndex+1)+' / '+pad(lightboxItems.length);$('#lightboxDownload').href=item.original;$('#lightboxDownload').download='hangover-'+pad(item.id)+'.png';}
document.addEventListener('click',e=>{const b=e.target.closest('[data-image]');if(!b)return;lastFocused=b;lightboxItems=b.closest('#archiveGrid')?filtered:catalog;lightboxIndex=lightboxItems.findIndex(x=>x.id===Number(b.dataset.image));showLightboxImage();lightbox.showModal();document.body.classList.add('modal-open');$('#lightboxClose').focus();});
function shiftImage(n){lightboxIndex=(lightboxIndex+n+lightboxItems.length)%lightboxItems.length;showLightboxImage();}
$('#lightboxPrev').addEventListener('click',()=>shiftImage(-1));$('#lightboxNext').addEventListener('click',()=>shiftImage(1));$('#lightboxClose').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastFocused?.focus({preventScroll:true});});lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();shiftImage(-1);}if(e.key==='ArrowRight'){e.preventDefault();shiftImage(1);}});

// Motion controls apply to every animated surface, including the timecode.
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches, ticks=0;
function setPaused(v){v=v||reduced.matches;paused=v;document.body.classList.toggle('paused',v);const b=$('#motionToggle');b.setAttribute('aria-pressed',String(v));b.setAttribute('aria-label',v?'Riprendi le animazioni':'Metti in pausa le animazioni');b.textContent=v?'▶':'Ⅱ';b.disabled=reduced.matches;if(reduced.matches)b.setAttribute('aria-label','Animazioni ridotte dalle preferenze di sistema');}
setPaused(paused);$('#motionToggle').addEventListener('click',()=>setPaused(!paused));reduced.addEventListener('change',e=>setPaused(e.matches));
setInterval(()=>{if(paused||document.hidden)return;ticks++;$('#timecode').textContent='00:'+pad(Math.floor(ticks/10/60)%60)+':'+pad(Math.floor(ticks/10)%60);},100);
$$('[data-motion]').forEach(b=>b.addEventListener('click',()=>{$$('.motion-options button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('.video-stage').dataset.effect=b.dataset.motion;}));
let carouselIndex=0;
const slides=[{mark:'h',label:'HANGOVER'},{image:6,label:'AFTER DARK'},{mark:'hgr',label:'ALL NIGHT'},{image:17,label:'FROM THE BOOTH'}];
function renderCarousel(){const el=$('#carouselWindow');el.replaceChildren();[0,1,2].forEach(i=>{const item=slides[(carouselIndex+i)%slides.length],c=document.createElement('div');c.className='carousel-card';if(item.image){const img=new Image();img.src=byId(item.image).src;img.alt=byId(item.image).title;img.loading='lazy';c.append(img);}const mark=document.createElement('i');mark.className='mark '+(item.mark||'word');c.append(mark);const label=document.createElement('span');label.textContent=item.label;c.append(label);el.append(c);});$('#carouselCount').textContent=pad(carouselIndex+1)+' / 04';}
$('#carouselPrev').addEventListener('click',()=>{carouselIndex=(carouselIndex+3)%4;renderCarousel();});$('#carouselNext').addEventListener('click',()=>{carouselIndex=(carouselIndex+1)%4;renderCarousel();});renderCarousel();

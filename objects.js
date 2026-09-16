(function(){
'use strict';
const A=window.HangoverObjects,section=document.querySelector('#oggetti');if(!section||!A)return;
const table=document.querySelector('#objectTable'),grid=document.querySelector('#objectGrid'),dialog=document.querySelector('#objectDialog');
let active='a3',opener,settings={...A.defaults},timer;
const variant={tote:'paper','sticker-h':'ice',patch:'ice',member:'ice',ticket:'paper',tyvek:'orange','sticker-hgr':'orange',coaster:'paper',a3:'orange'};
function thumb(it,uid){return A.render(it.id,{palette:variant[it.id]||['ice','paper','orange','acid'][Number(it.number)%4],uid});}
for(const id of ['tote','a3','sticker-h','patch','member','ticket','tyvek','sticker-hgr','coaster']){const it=A.items.find(i=>i.id===id),button=document.createElement('button');button.className='table-object';button.dataset.object=id;button.setAttribute('aria-label','Personalizza '+it.name);button.innerHTML=thumb(it,'table');table.append(button);}
function catalogue(category='all'){
 grid.replaceChildren();const list=A.items.filter(i=>category==='all'||(category==='new'?Number(i.number)>23:i.category===category));
 for(const it of list){const button=document.createElement('button');button.className='object-card';button.dataset.object=it.id;button.setAttribute('aria-label','Apri '+it.name);button.innerHTML=`<span class="object-card-art" aria-hidden="true">${thumb(it,'grid')}</span><span class="object-card-info"><span>${it.name}</span><small>${it.number} ↗</small></span><span class="object-card-format">${it.description}</span>`;grid.append(button);}
 document.querySelector('#objectCount').textContent=list.length+' oggetti / '+(category==='all'?'collezione completa':'selezione');
}
section.querySelector('[data-object-filter="all"]').textContent='Tutti / '+A.items.length;
section.querySelector('.objects-catalogue-head h3').textContent=A.items.length+' modi di esserci.';
catalogue();
section.addEventListener('click',event=>{const object=event.target.closest('[data-object]');if(object){active=object.dataset.object;opener=object;const it=A.items.find(i=>i.id===active);document.querySelector('#objectTitle').textContent=it.name;document.querySelector('#objectDescription').textContent=it.description;document.querySelector('#objectUrlLabel').hidden=!it.qr;dialog.querySelectorAll('[data-object-event]').forEach(el=>el.hidden=!(it.fields||(it.event?['title','detail']:[])).includes(el.dataset.objectField));document.querySelector('#objectQr').hidden=!it.qr;update();dialog.showModal();return;}
const filter=event.target.closest('[data-object-filter]');if(filter){section.querySelectorAll('[data-object-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===filter)));catalogue(filter.dataset.objectFilter);}});
const title=document.querySelector('#objectEvent'),detail=document.querySelector('#objectDetail'),url=document.querySelector('#objectUrl'),palette=document.querySelector('#objectPalette'),status=document.querySelector('#objectStatus');
title.value=settings.title;detail.value=settings.detail;url.value=settings.url;
function paint(){document.querySelector('#objectPreview').innerHTML=A.render(active,{...settings,uid:'proof'});}
function update(){
 settings.title=title.value.trim()||A.defaults.title;settings.detail=detail.value.trim()||A.defaults.detail;settings.palette=palette.value;
 try{if(!document.querySelector('#objectUrlLabel').hidden)settings.url=A.validatedURL(url.value.trim());url.removeAttribute('aria-invalid');status.textContent=document.querySelector('#objectUrlLabel').hidden?'':settings.url===A.defaults.url?'QR dimostrativo: apre il sito HANGOVER.':'QR aggiornato al link inserito.';dialog.querySelectorAll('[data-export],#objectQr').forEach(b=>b.disabled=false);}
 catch(e){url.setAttribute('aria-invalid','true');status.textContent=e.message==='Invalid URL'?'Inserisci un link completo, per esempio https://…':e.message;dialog.querySelectorAll('[data-export],#objectQr').forEach(b=>b.disabled=true);}
 paint();
}
for(const input of [title,detail,url])input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(update,100);dialog.querySelectorAll('[data-export],#objectQr').forEach(b=>b.disabled=true);});
palette.addEventListener('change',update);
function download(blob,name){const link=document.createElement('a'),address=URL.createObjectURL(blob);link.href=address;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(address),60000);}
async function exportPNG(svg,name){const img=new Image(),address=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));try{await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('Impossibile preparare il PNG. Riprova con SVG.'));img.src=address;});const vb=svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/),w=Number(vb[1]),h=Number(vb[2]),scale=2400/Math.max(w,h),canvas=document.createElement('canvas');canvas.width=Math.round(w*scale);canvas.height=Math.round(h*scale);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));if(!blob)throw Error('Esportazione non disponibile.');download(blob,name+'.png');}finally{URL.revokeObjectURL(address);}}
dialog.addEventListener('click',async event=>{const type=event.target.closest('[data-export]')?.dataset.export;if(!type)return;clearTimeout(timer);update();if(url.getAttribute('aria-invalid')==='true')return;try{const svg=A.render(active,{...settings,uid:'export'}),name='HANGOVER-'+active;if(type==='svg')download(new Blob([svg],{type:'image/svg+xml'}),name+'.svg');else await exportPNG(svg,name);status.textContent='File preparato: '+name+'.'+type;}catch(e){status.textContent=e.message;}});
document.querySelector('#objectQr').addEventListener('click',()=>{clearTimeout(timer);update();if(url.getAttribute('aria-invalid')==='true')return;const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="40mm" height="40mm" viewBox="0 0 400 400">${A.qrGroup(settings.url,0,0,400)}</svg>`;download(new Blob([svg],{type:'image/svg+xml'}),'HANGOVER-QR.svg');status.textContent='QR pronto in SVG.';});
document.querySelector('#objectClose').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>opener?.focus());
update();
})();

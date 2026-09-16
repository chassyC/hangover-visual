/* Catalogue editor: each object keeps its own text, colours and destination. */
(function(){
'use strict';
const A=window.HangoverObjects,section=document.querySelector('#oggetti');if(!section||!A)return;
const $=id=>document.getElementById(id),table=$('objectTable'),grid=$('objectGrid'),dialog=$('objectDialog');
const palette=$('objectPalette'),status=$('objectStatus'),url=$('objectUrl'),fields=$('objectTextFields');
const colorInputs={bg:$('objectBg'),fg:$('objectFg'),accent:$('objectAccent')};
const drafts=new Map();let active='a3',opener,settings,timer;
const variant={tote:'paper','sticker-h':'ice',patch:'ice',member:'ice',ticket:'paper',tyvek:'orange','sticker-hgr':'orange',coaster:'paper',a3:'orange'};
const initialPalette=it=>variant[it.id]||['ice','paper','orange','acid'][Number(it.number)%4];
const initial=it=>{const key=initialPalette(it),p=A.palettes[key];return {...A.defaults,palette:key,bg:p.bg,fg:p.fg,accent:p.accent,texts:Object.fromEntries(A.fields(it.id).map(f=>[f.key,f.value]))};};
function thumb(it,uid){return A.render(it.id,{palette:initialPalette(it),uid});}
for(const id of ['tote','a3','sticker-h','patch','member','ticket','tyvek','sticker-hgr','coaster']){const it=A.items.find(i=>i.id===id),button=document.createElement('button');button.className='table-object';button.dataset.object=id;button.setAttribute('aria-label','Personalizza '+it.name);button.innerHTML=thumb(it,'table');table.append(button);}
function catalogue(category='all'){
 grid.replaceChildren();const list=A.items.filter(i=>category==='all'||(category==='new'?Number(i.number)>23:i.category===category));
 for(const it of list){const button=document.createElement('button');button.className='object-card';button.dataset.object=it.id;button.setAttribute('aria-label','Apri '+it.name);button.innerHTML=`<span class="object-card-art" aria-hidden="true">${thumb(it,'grid')}</span><span class="object-card-info"><span>${it.name}</span><small>${it.number} ↗</small></span><span class="object-card-format">${it.description}</span>`;grid.append(button);}
 $('objectCount').textContent=list.length+' oggetti / '+(category==='all'?'collezione completa':'selezione');
}
section.querySelector('[data-object-filter="all"]').textContent='Tutti / '+A.items.length;
section.querySelector('.objects-catalogue-head h3').textContent=A.items.length+' modi di esserci.';
for(const [id,p]of Object.entries(A.palettes)){const option=document.createElement('option');option.value=id;option.textContent=p.name;palette.append(option);}
const custom=document.createElement('option');custom.value='custom';custom.textContent='Colori personalizzati';custom.disabled=true;palette.append(custom);
function selectedPalette(){const p=A.palettes[settings.palette];palette.value=['bg','fg','accent'].every(k=>settings[k].toLowerCase()===p[k].toLowerCase())?settings.palette:'custom';}
function makeFields(){
 fields.replaceChildren();
 for(const f of A.fields(active)){
  const label=document.createElement('label'),header=document.createElement('span'),name=document.createElement('span'),counter=document.createElement('small'),input=document.createElement('textarea');
  name.textContent=f.label;header.className='object-field-label';header.append(name,counter);label.append(header,input);
  input.id='object-text-'+f.key;input.dataset.textKey=f.key;input.value=settings.texts[f.key];input.maxLength=f.maxLength;input.rows=f.maxLength>=64?2:1;input.autocomplete='off';input.spellcheck=false;
  if(f.font==='display')input.dataset.lettering='true';
  counter.setAttribute('aria-hidden','true');input.setAttribute('aria-label',f.label);counter.textContent=Array.from(input.value).length+' / '+f.maxLength;input.addEventListener('input',()=>{counter.textContent=Array.from(input.value).length+' / '+f.maxLength;schedule();});
  fields.append(label);
 }
}
function load(it){
 clearTimeout(timer);settings=drafts.get(it.id)||initial(it);drafts.set(it.id,settings);
 $('objectTitle').textContent=it.name;$('objectDescription').textContent=it.description;
 $('objectUrlLabel').hidden=!it.qr;$('objectQr').hidden=!it.qr;
 for(const [key,input]of Object.entries(colorInputs)){input.value=settings[key];input.parentElement.hidden=!it.colorFields.includes(key);}selectedPalette();url.value=settings.url;makeFields();update();
}
section.addEventListener('click',event=>{
 const object=event.target.closest('[data-object]');if(object){active=object.dataset.object;opener=object;load(A.items.find(i=>i.id===active));dialog.showModal();dialog.scrollTop=0;return;}
 const filter=event.target.closest('[data-object-filter]');if(filter){section.querySelectorAll('[data-object-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===filter)));catalogue(filter.dataset.objectFilter);}
});
function lum(c){const a=c.slice(1).match(/../g).map(x=>{const v=parseInt(x,16)/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return a[0]*.2126+a[1]*.7152+a[2]*.0722;}
function contrast(a,b){const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
function update(){
 if(!settings)return false;clearTimeout(timer);
 for(const input of fields.querySelectorAll('[data-text-key]'))settings.texts[input.dataset.textKey]=input.value;
 for(const [key,input]of Object.entries(colorInputs))settings[key]=input.value;
 selectedPalette();let valid=true;
 const it=A.items.find(i=>i.id===active);
 try{if(it.qr)settings.url=A.validatedURL(url.value.trim());url.removeAttribute('aria-invalid');status.textContent=it.qr?(settings.url===A.defaults.url?'QR iniziale: apre il sito HANGOVER.':'QR aggiornato al link inserito.'):'Anteprima aggiornata.';}
 catch(e){valid=false;url.setAttribute('aria-invalid','true');status.textContent=e.message==='Invalid URL'?'Inserisci un link completo, per esempio https://…':e.message;}
 try{
  $('objectPreview').innerHTML=A.render(active,{...settings,uid:'proof'});
  const meta=A.info(active,settings),changed=new Set(A.fields(active).filter(f=>settings.texts[f.key]!==f.value).map(f=>f.key));
  const small=meta.text.some(t=>changed.has(t.key)&&t.metrics.fontSize*it.mmw/1000*72/25.4<6);
  const unsupported=[...new Set(meta.text.flatMap(t=>t.metrics.unsupported||[]))];
  $('objectFitHint').textContent=unsupported.length?'Il lettering non include '+unsupported.join(' ')+': sostituiti con ?.':small?'Il testo rientra, ma è piccolo nel formato reale. Abbrevialo per una lettura migliore.':'';
  $('objectColorHint').textContent=it.colorFields.includes('fg')&&contrast(settings.bg,settings.fg)<4.5?'Fondo e segno hanno poco contrasto. Prova una coppia più chiara / scura.':'';
 }catch(e){valid=false;status.textContent='Anteprima non disponibile: '+e.message;}
 dialog.querySelectorAll('[data-export],#objectQr').forEach(b=>b.disabled=!valid);drafts.set(active,settings);return valid;
}
function schedule(){clearTimeout(timer);dialog.querySelectorAll('[data-export],#objectQr').forEach(b=>b.disabled=true);timer=setTimeout(update,90);}
palette.addEventListener('change',()=>{if(!A.palettes[palette.value])return;settings.palette=palette.value;for(const [k,input]of Object.entries(colorInputs)){settings[k]=A.palettes[settings.palette][k];input.value=settings[k];}update();});
for(const input of Object.values(colorInputs))input.addEventListener('input',schedule);
url.addEventListener('input',schedule);
$('objectReset').addEventListener('click',()=>{drafts.delete(active);load(A.items.find(i=>i.id===active));status.textContent='Modello iniziale ripristinato.';});
function download(blob,name){const link=document.createElement('a'),address=URL.createObjectURL(blob);link.href=address;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(address),60000);}
async function exportPNG(svg,name){const img=new Image(),address=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));try{await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('Impossibile preparare il PNG. Riprova con SVG.'));img.src=address;});const vb=svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/),w=Number(vb[1]),h=Number(vb[2]),scale=2400/Math.max(w,h),canvas=document.createElement('canvas');canvas.width=Math.round(w*scale);canvas.height=Math.round(h*scale);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));if(!blob)throw Error('Esportazione non disponibile.');download(blob,name+'.png');}finally{URL.revokeObjectURL(address);}}
dialog.addEventListener('click',async event=>{const type=event.target.closest('[data-export]')?.dataset.export;if(!type||!update())return;try{const svg=A.render(active,{...settings,uid:'export'}),name='HANGOVER-'+active;if(type==='svg')download(new Blob([svg],{type:'image/svg+xml'}),name+'.svg');else await exportPNG(svg,name);status.textContent='File preparato: '+name+'.'+type;}catch(e){status.textContent=e.message;}});
$('objectQr').addEventListener('click',()=>{if(!update())return;const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="40mm" height="40mm" viewBox="0 0 400 400">${A.qrGroup(settings.url,0,0,400)}</svg>`;download(new Blob([svg],{type:'image/svg+xml'}),'HANGOVER-QR.svg');status.textContent='QR pronto in SVG.';});
$('objectClose').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{update();opener?.focus();});catalogue();
})();

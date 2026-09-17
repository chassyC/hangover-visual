/* Export the current visual; generated only when requested. */
(() => {
 'use strict';
 const slug=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase();
 function save(blob,name){const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
 function serialize(node){
  if(!node)throw Error('Il disegno non è ancora pronto.');
  const clone=node.cloneNode(true),originals=[node,...node.querySelectorAll('*')],copies=[clone,...clone.querySelectorAll('*')];
  const properties=['fill','fill-rule','fill-opacity','stroke','stroke-width','stroke-opacity','opacity','color','stop-color','stop-opacity','font-family','font-size','font-weight','letter-spacing','text-anchor','display'];
  originals.forEach((el,i)=>{if(el.closest('defs')&&el.tagName.toLowerCase()!=='stop')return;const style=getComputedStyle(el);properties.forEach(key=>{const value=style.getPropertyValue(key);if(value)copies[i].style.setProperty(key,value.replace(/url\(["']?[^)]*#([^)'"\s]+)["']?\)/g,'url(#$1)'));});});
  clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');clone.querySelectorAll('use[href]').forEach(el=>el.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',el.getAttribute('href')));clone.removeAttribute('class');clone.removeAttribute('aria-hidden');
  const box=node.viewBox.baseVal;clone.setAttribute('width',box.width);clone.setAttribute('height',box.height);
  return new XMLSerializer().serializeToString(clone).replace(/url\(&quot;#([^&]+)&quot;\)/g,'url(#$1)');
 }
 async function load(source){const img=new Image();img.src=source;await img.decode();return img;}
 async function png(svg,name,longEdge=3000){
  const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
  try{const img=await load(url),canvas=document.createElement('canvas'),scale=longEdge/Math.max(img.naturalWidth,img.naturalHeight);canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));if(!blob)throw Error('Esportazione non disponibile.');save(blob,name+'.png');}finally{URL.revokeObjectURL(url);}
 }
 async function image(item){
  const img=await load(item.original||item.src),v=item.viewport,canvas=document.createElement('canvas');
  canvas.width=v?v.width:img.naturalWidth;canvas.height=v?v.height:img.naturalHeight;
  const ctx=canvas.getContext('2d');if(v){const sx=img.naturalWidth/v.sourceWidth,sy=img.naturalHeight/v.sourceHeight;ctx.drawImage(img,v.x*sx,v.y*sy,v.width*sx,v.height*sy,0,0,canvas.width,canvas.height);}else ctx.drawImage(img,0,0);
  const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));if(!blob)throw Error('Esportazione non disponibile.');save(blob,'HANGOVER-'+slug(item.title)+'.png');
 }
 window.HangoverDownload={save,serialize,png,image,slug};
 function controls(target,selector,name,transparent=false){
  const mount=document.querySelector(target);if(!mount)return;
  const row=document.createElement('div');row.className='artwork-downloads';
  const status=document.createElement('span');status.setAttribute('role','status');
  for(const type of (target==='#blueprint .bp-controls'?['PNG']:['SVG','PNG'])){const b=document.createElement('button');b.type='button';window.HangoverUI.label(b,'Scarica '+type,'down-right');b.setAttribute('aria-label','Scarica '+name+' in '+type);b.addEventListener('click',async()=>{b.disabled=true;status.textContent='';try{const svg=serialize(document.querySelector(selector));if(type==='SVG')save(new Blob([svg],{type:'image/svg+xml'}),'HANGOVER-'+slug(name)+'.svg');else await png(svg,'HANGOVER-'+slug(name));status.textContent='File pronto.';}catch(e){status.textContent=e.message;}finally{b.disabled=false;}});row.append(b);}
  if(transparent){const hint=document.createElement('small');hint.textContent='Senza sfondo · PNG 3000 px';row.append(hint);}row.append(status);mount.append(row);
 }
 controls('#segni .identity-controls','#identityPreview svg','logo personalizzato',true);
 controls('#stile .art-lab-controls','[data-art-canvas] svg','studio del segno');
 controls('#blueprint .bp-controls','#blueprintBoard svg','blueprint');
 // A downloadable outline of the editable lettering sample.
 const type=document.querySelector('.type-display .type-downloads');if(type){const status=document.createElement('span');status.setAttribute('role','status');const b=document.createElement('button');b.type='button';window.HangoverUI.label(b,'SCARICA LA TUA SCRITTA','down-right');b.addEventListener('click',()=>{const value=document.querySelector('#typeSample').value||'Hangover, all night.';const box={x:20,y:20,w:1560,h:460},opts={font:'display',size:360,maxLines:2,align:'center',valign:'middle',color:'#080b0d'},layout=window.HangoverText.layout(value,box,opts);if(layout.unsupported.length){status.textContent='Questi caratteri non sono presenti nel font HANGOVER: '+layout.unsupported.join(' ')+'. Modifica la scritta per esportarla.';return;}status.textContent='';const art=window.HangoverText.fit(value,box,opts);save(new Blob(['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 500" width="1600" height="500">'+art+'</svg>'],{type:'image/svg+xml'}),'HANGOVER-lettering.svg');});type.append(b,status);}
 const campus=[['.hill-poster','campus-the-hill'],['.volley-poster','campus-welcome']];
 for(const [selector,id]of campus){const el=document.querySelector(selector);if(!el)continue;const a=document.createElement('a');a.className='artwork-static-download';a.href='assets/library/'+id+'.png';a.download='HANGOVER-'+id+'.png';window.HangoverUI.label(a,'SCARICA IL POSTER','down-right');el.append(a);}
})();

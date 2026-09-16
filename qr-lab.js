(function(){
 'use strict';
 const section=document.querySelector('#qr-studio');if(!section)return;
 const Q=window.HangoverQR,find=id=>section.querySelector('#'+id),form=find('qrStudioForm'),input=find('qrStudioURL'),range=find('qrStudioSize'),number=find('qrStudioSizeNumber'),preview=find('qrStudioPreview'),destination=find('qrStudioDestination'),dimensions=find('qrStudioDimensions'),pixels=find('qrStudioPixels'),status=find('qrStudioStatus'),svgButton=find('qrStudioSVG'),pngButton=find('qrStudioPNG');
 const defaults='https://chassyc.github.io/hangover-visual/';
 let timer,current=null,revision=0,busy=false;
 const buttons=()=>{svgButton.disabled=pngButton.disabled=!current||busy;};
 function message(text,error=false){status.textContent=text;status.dataset.error=String(error);}
 function size(value){const n=Number(value);return Math.max(25,Math.min(120,Number.isFinite(n)&&n>0?Math.round(n):40));}
 function blank(text){preview.replaceChildren();const span=document.createElement('span');span.textContent=text;preview.append(span);}
 function refresh(){
  clearTimeout(timer);revision++;current=null;buttons();
  const mm=size(number.value);number.value=range.value=String(mm);dimensions.textContent=mm+' × '+mm+' mm';
  try{
   const url=Q.validate(input.value),matrix=Q.matrix(url),modules=matrix.length+8,scale=Math.max(6,Math.ceil(mm*24/modules)),px=modules*scale;
   current={url,mm,matrix,modules,scale,px};find('qrStudioSizeHelp').textContent=mm/modules<.35?'Questo link è lungo: prova un lato di almeno '+Math.ceil(modules*.35)+' mm per rendere i moduli più leggibili.':'Il file SVG conserva queste misure. Il PNG è ad alta risoluzione.';preview.innerHTML=Q.svg(url,{size:400,mm});destination.textContent=url;pixels.textContent='PNG '+px+' × '+px+' px';
   input.removeAttribute('aria-invalid');message('QR pronto. Il link viene salvato direttamente nel codice.');buttons();return current;
  }catch(error){input.setAttribute('aria-invalid','true');blank('Controlla il link per creare il QR.');destination.textContent='—';pixels.textContent='';message(error.message||'Non riesco a creare il QR. Controlla il link.',true);buttons();return null;}
 }
 function save(blob,name){const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
 function filename(snapshot,extension){return 'HANGOVER-QR-'+snapshot.mm+'mm.'+extension;}
 if(!Q){blank('Generatore non disponibile.');message('Ricarica la pagina per preparare il generatore QR.',true);buttons();return;}
 input.value=input.value.trim()||defaults;
 input.addEventListener('input',()=>{clearTimeout(timer);current=null;buttons();timer=setTimeout(refresh,160);});
 range.addEventListener('input',()=>{number.value=range.value;refresh();});
 number.addEventListener('input',()=>{clearTimeout(timer);current=null;buttons();timer=setTimeout(refresh,300);});
 number.addEventListener('change',refresh);
 form.addEventListener('submit',event=>{event.preventDefault();refresh();});
 svgButton.addEventListener('click',()=>{if(busy)return;const snapshot=refresh();if(!snapshot)return;try{save(new Blob([Q.svg(snapshot.url,{size:400,mm:snapshot.mm})],{type:'image/svg+xml'}),filename(snapshot,'svg'));message('SVG pronto · '+snapshot.mm+' × '+snapshot.mm+' mm.');}catch(error){message('Download SVG non riuscito. Riprova.',true);}});
 pngButton.addEventListener('click',async()=>{
  if(busy)return;const snapshot=refresh();if(!snapshot)return;const started=revision;busy=true;buttons();message('Preparazione del PNG…');
  try{
   const canvas=document.createElement('canvas');canvas.width=canvas.height=snapshot.px;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas non disponibile.');
   ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#000000';snapshot.matrix.forEach((row,y)=>row.forEach((dark,x)=>{if(dark)ctx.fillRect((x+4)*snapshot.scale,(y+4)*snapshot.scale,snapshot.scale,snapshot.scale);}));
   const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('PNG non disponibile.')),'image/png'));
   save(blob,filename(snapshot,'png'));if(revision===started)message('PNG pronto · '+snapshot.px+' × '+snapshot.px+' px.');
  }catch(error){if(revision===started)message('Download PNG non riuscito. Riprova oppure usa SVG.',true);}
  finally{busy=false;buttons();}
 });
 refresh();
})();

/* The initializer is self-contained so exported templates remain editable offline. */
window.initHangoverLab = async function initHangoverLab(){
 'use strict';
 const root=document.getElementById('motionLab');if(!root)return;
 const pristine=root.outerHTML,data=window.HANGOVER_STUDIO_DATA,engine=window.createHangoverStudio(data);
 const $=s=>root.querySelector(s),$$=s=>Array.from(root.querySelectorAll(s));
 const canvas=$('[data-ml-canvas]'),ctx=canvas.getContext('2d'),stage=$('[data-ml-stage]'),status=$('[data-ml-status]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const defaults={preset:'prisma',palette:'ice',format:'16:9',title:'ALL NIGHT',subtitle:'HANGOVER / AFTER DARK',lineup:'[ARTISTA 01]\n[ARTISTA 02]\n[ARTISTA 03]',duration:10,speed:1,photo:'01',effects:['grain'],customImage:null};
 let cfg={...defaults},time=2.4,playing=!reduced.matches,inView=false,frame=0,last=0,exporting=false,job=null,photoRevision=0;
 let videoURL=null;const fileURLs=new Set();
 const stamp=t=>String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0');
 function report(message){status.textContent=message;}
 function validate(value){
  if(!value||typeof value!=='object')throw Error('Preset non valido.');
  const c={...defaults};
  if(!data.presets.some(x=>x.id===value.preset)||!Object.hasOwn(data.palettes,value.palette)||!['9:16','1:1','16:9'].includes(value.format))throw Error('Preset o formato non riconosciuto.');
  for(const k of ['preset','palette','format'])c[k]=value[k];
  for(const [k,n] of [['title',42],['subtitle',72],['lineup',160]]){if(typeof value[k]!=='string'||value[k].length>n)throw Error('Il testo del preset non è valido.');c[k]=value[k];}
  if(![6,10,15].includes(value.duration)||![.75,1,1.25].includes(value.speed))throw Error('Durata o movimento non riconosciuti.');
  c.duration=value.duration;c.speed=value.speed;
  if(!data.photos.some(x=>x.id===value.photo))throw Error('Immagine non riconosciuta.');c.photo=value.photo;
  if(!Array.isArray(value.effects)||value.effects.length>3||!value.effects.every(x=>['grain','light','registration'].includes(x)))throw Error('Effetti non riconosciuti.');c.effects=[...new Set(value.effects)];
  if(value.customImage!=null){if(typeof value.customImage!=='string'||value.customImage.length>12000000||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=\r\n]+$/.test(value.customImage))throw Error('Foto del preset non valida.');c.customImage=value.customImage;}
  return c;
 }
 try{if(window.HANGOVER_INITIAL_CONFIG)cfg=validate(window.HANGOVER_INITIAL_CONFIG);}catch(e){report(e.message);}
 function render(){engine.render(ctx,canvas.width,canvas.height,time,cfg);$('[data-ml-seek]').value=time;$('[data-ml-seek]').setAttribute('aria-valuetext',time.toFixed(1)+' secondi di '+cfg.duration);$('[data-ml-time]').textContent=stamp(time)+' / '+stamp(cfg.duration);}
 function blocked(){return reduced.matches||document.body.classList.contains('paused');}
 function playerState(){const paused=!playing||blocked();$('[data-ml-play]').textContent=paused?'▶':'Ⅱ';$('[data-ml-play]').setAttribute('aria-pressed',String(paused));$('[data-ml-play]').setAttribute('aria-label',paused?'Riproduci l’anteprima':'Metti in pausa l’anteprima');}
 function schedule(){cancelAnimationFrame(frame);frame=0;last=0;if(playing&&!blocked()&&inView&&!document.hidden&&!exporting)frame=requestAnimationFrame(tick);playerState();}
 function tick(now){if(last)time=(time+(now-last)/1000)%cfg.duration;last=now;render();frame=requestAnimationFrame(tick);}
 function resize(){const [w,h]=engine.dimensions(cfg.format,640);const k=Math.min(1,1000/w,1100/h);canvas.width=Math.round(w*k);canvas.height=Math.round(h*k);canvas.style.aspectRatio=w+'/'+h;render();}
 function sync(){
  const preset=data.presets.find(x=>x.id===cfg.preset),ix=data.presets.indexOf(preset)+1;
  $('[data-ml-name]').textContent=String(ix).padStart(2,'0')+' / '+preset.name.toUpperCase();
  $('[data-ml-description]').textContent=preset.description;
  $('[data-ml-dimensions]').textContent=engine.dimensions(cfg.format).join(' × ');
  canvas.setAttribute('aria-label','Anteprima '+preset.name+' — '+cfg.format);
  $$('[data-ml-format]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mlFormat===cfg.format)));
  $$('[data-ml-palette]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mlPalette===cfg.palette)));
  $$('[data-ml-field]').forEach(el=>el.value=cfg[el.dataset.mlField]);
  $$('[data-ml-effect]').forEach(el=>el.checked=cfg.effects.includes(el.dataset.mlEffect));
  $$('[data-ml-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mlPreset===cfg.preset)));
  $('[data-ml-lineup-label]').hidden=cfg.preset!=='lineup';$('[data-ml-photo]').value=cfg.photo;$('[data-ml-reset-photo]').hidden=!cfg.customImage;
  $('[data-ml-photo-note]').textContent=cfg.customImage?'La tua foto resta nel browser e nei file che scarichi.':'La foto entra nei preset fotografici.';
  $('[data-ml-seek]').max=cfg.duration;time=Math.min(time,cfg.duration-.01);resize();playerState();
 }
 function save(blob,name){
  if(videoURL)URL.revokeObjectURL(videoURL);videoURL=URL.createObjectURL(blob);
  const link=$('[data-ml-download]');link.href=videoURL;link.download=name;link.textContent='Scarica '+name.split('.').pop().toUpperCase()+' ↓';link.hidden=false;
  showResult(blob.type,videoURL);
 }
 function showResult(type,url){
  const box=$('[data-ml-result]'),video=$('[data-ml-result-video]'),img=$('[data-ml-result-image]'),template=$('[data-ml-result-template]');
  video.pause();video.removeAttribute('src');video.load();img.removeAttribute('src');template.removeAttribute('href');video.hidden=img.hidden=template.hidden=true;box.hidden=true;box.open=false;
  if(type.startsWith('video/')){video.src=url;video.hidden=false;box.hidden=false;}
  else if(type.startsWith('image/')){img.src=url;img.hidden=false;box.hidden=false;}
  else if(type==='text/html'){template.href=url;template.hidden=false;box.hidden=false;}
 }

 const fileName=ext=>'hangover-'+cfg.preset+'-'+cfg.format.replace(':','x')+'.'+ext;
 function presetFile(){save(new Blob([JSON.stringify({schema:'hangover.motion.preset',version:1,config:cfg},null,2)],{type:'application/json'}),fileName('json'));report('Preset pronto: testi, formato, palette, foto ed effetti.');}
 function templateFile(){
  const json=v=>JSON.stringify(v).replace(/</g,'\\u003c'),end='<'+'/script>';
  const html='<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hangover — Motion Studio</title><style>'+data.styles+'</style></head><body class="h-motion-template">'+pristine+'<script>window.HANGOVER_STUDIO_DATA='+json(data)+';window.HANGOVER_INITIAL_CONFIG='+json(cfg)+';'+end+'<script>window.createHangoverStudio='+window.createHangoverStudio.toString()+';'+end+'<script>window.initHangoverLab='+window.initHangoverLab.toString()+';window.initHangoverLab();'+end+'</body></html>';
  save(new Blob([html],{type:'text/html'}),fileName('html'));report('Template pronto. Scarica e apri il file HTML per ritrovare questo studio, modificarlo ed esportarlo offline.');
 }
 async function pngFile(){
  const target=document.createElement('canvas');[target.width,target.height]=engine.dimensions(cfg.format);engine.render(target.getContext('2d'),target.width,target.height,time,cfg);
  const blob=await new Promise(r=>target.toBlob(r,'image/png'));if(!blob)throw Error('Il fotogramma non è stato creato. Riprova.');save(blob,fileName('png'));report('Fotogramma pronto: '+target.width+' × '+target.height+' px.');
 }
 function setExporting(v){exporting=v;$$('[data-ml-export]').forEach(b=>b.disabled=v);$('[data-ml-cancel]').hidden=!v;root.setAttribute('aria-busy',String(v));schedule();}
 function recordVideo(){
  if(typeof MediaRecorder==='undefined'||typeof HTMLCanvasElement.prototype.captureStream!=='function'){report('Questo browser non esporta video. Puoi salvare il template e aprirlo in Chrome, oppure scaricare il fotogramma.');return;}
  const mime=['video/mp4;codecs=avc1.42E01E','video/mp4','video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));
  if(!mime){report('Formato video non supportato in questo browser. Salva il template o il fotogramma.');return;}
  const snapshot=JSON.parse(JSON.stringify(cfg)),target=document.createElement('canvas');[target.width,target.height]=engine.dimensions(snapshot.format);
  const context=target.getContext('2d');engine.render(context,target.width,target.height,0,snapshot);
  const stream=target.captureStream(30),chunks=[];let rec;
  try{rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:9000000});}catch(e){stream.getTracks().forEach(t=>t.stop());throw Error('Il browser non riesce ad avviare il video. Prova un altro formato.');}
  const current={rec,stream,frame:0,cancelled:false};job=current;setExporting(true);
  if(videoURL){URL.revokeObjectURL(videoURL);videoURL=null;}$('[data-ml-download]').hidden=true;
  const ext=mime.includes('mp4')?'mp4':'webm',name='hangover-'+snapshot.preset+'-'+snapshot.format.replace(':','x')+'.'+ext;
  rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
  rec.onerror=()=>{current.cancelled=true;report('Esportazione interrotta dal browser. Riprova.');if(rec.state!=='inactive')rec.stop();};
  rec.onstop=()=>{
   cancelAnimationFrame(current.frame);stream.getTracks().forEach(t=>t.stop());if(job===current)job=null;setExporting(false);
   if(current.cancelled)return;
   const blob=new Blob(chunks,{type:rec.mimeType||mime});if(!blob.size){report('Il video è vuoto. Riprova con il template in Chrome.');return;}
   videoURL=URL.createObjectURL(blob);const link=$('[data-ml-download]');link.href=videoURL;link.download=name;link.textContent='Scarica '+ext.toUpperCase()+' ↓';link.hidden=false;showResult(blob.type,videoURL);
   report('Video pronto · '+target.width+' × '+target.height+' · '+snapshot.duration+' s · senza audio.');
  };
  rec.start();const started=performance.now();let previous=-100,lastReport=-1;
  function next(now){
   if(current.cancelled)return;const elapsed=(now-started)/1000;
   if(elapsed>=snapshot.duration){engine.render(context,target.width,target.height,snapshot.duration-1/30,snapshot);rec.stop();return;}
   if(now-previous>=1000/30-2){engine.render(context,target.width,target.height,elapsed,snapshot);previous=now;}
   const percent=Math.floor(elapsed/snapshot.duration*10)*10;if(percent!==lastReport){report('Creo il video… '+percent+'% · Tieni aperta questa scheda.');lastReport=percent;}
   current.frame=requestAnimationFrame(next);
  }
  current.frame=requestAnimationFrame(next);
 }
 function cancelExport(message='Esportazione annullata.'){if(!job)return;job.cancelled=true;cancelAnimationFrame(job.frame);if(job.rec.state!=='inactive')job.rec.stop();report(message);}
 $('[data-ml-cancel]').addEventListener('click',()=>cancelExport());
 $$('[data-ml-export]').forEach(b=>b.addEventListener('click',async()=>{try{switch(b.dataset.mlExport){case'preset':presetFile();break;case'template':templateFile();break;case'png':await pngFile();break;case'video':recordVideo();break;}}catch(e){report(e.message||'Non è stato possibile salvare il file.');}}));
 $('[data-ml-controls]').addEventListener('submit',e=>e.preventDefault());
 $$('[data-ml-format]').forEach(b=>b.addEventListener('click',()=>{cfg.format=b.dataset.mlFormat;sync();}));
 $$('[data-ml-palette]').forEach(b=>b.addEventListener('click',()=>{cfg.palette=b.dataset.mlPalette;sync();}));
 $$('[data-ml-field]').forEach(el=>el.addEventListener('input',()=>{const key=el.dataset.mlField;cfg[key]=['duration','speed'].includes(key)?Number(el.value):el.value;time=Math.min(time,cfg.duration-.01);$('[data-ml-seek]').max=cfg.duration;render();}));
 $$('[data-ml-effect]').forEach(el=>el.addEventListener('change',()=>{cfg.effects=$$('[data-ml-effect]:checked').map(x=>x.dataset.mlEffect);render();}));
 $('[data-ml-play]').addEventListener('click',()=>{if(blocked()){report(reduced.matches?'Le animazioni sono ridotte nelle preferenze del dispositivo. Puoi esplorare i fotogrammi con il cursore.':'Le animazioni sono in pausa dal comando in alto. Riattivale per avviare l’anteprima.');return;}playing=!playing;schedule();});
 $('[data-ml-restart]').addEventListener('click',()=>{time=0;last=0;render();});
 $('[data-ml-seek]').addEventListener('input',e=>{playing=false;time=Number(e.target.value);schedule();render();});
 $('[data-ml-photo]').addEventListener('change',e=>{photoRevision++;cfg.photo=e.target.value;cfg.customImage=null;sync();});
 $('[data-ml-reset-photo]').addEventListener('click',()=>{photoRevision++;cfg.customImage=null;$('[data-ml-photo-file]').value='';sync();});
 $('[data-ml-photo-file]').addEventListener('change',async e=>{
  const file=e.target.files[0],revision=++photoRevision;if(!file)return;
  try{if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>8*1024*1024)throw Error('Scegli una foto JPG, PNG o WebP entro 8 MB.');
   const src=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Foto non leggibile.'));reader.readAsDataURL(file);});
   await engine.load(src);if(revision!==photoRevision)return;cfg.customImage=src;sync();report('Foto caricata. Provala con Shutter, Contact, Annuncio, Recap o Titolo video.');
  }catch(error){report(error.message);}e.target.value='';
 });
 $('[data-ml-preset-file]').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  try{if(file.size>13*1024*1024)throw Error('Il preset supera 13 MB.');const value=JSON.parse(await file.text());if(value.schema!=='hangover.motion.preset'||value.version!==1)throw Error('Scegli un preset salvato da Hangover Motion Studio.');const next=validate(value.config);if(next.customImage)await engine.load(next.customImage);photoRevision++;cfg=next;time=0;sync();report('Preset importato: '+data.presets.find(x=>x.id===cfg.preset).name+'.');}
  catch(error){report(error instanceof SyntaxError?'Il file non è un preset JSON valido.':error.message);}e.target.value='';
 });
 $$('[data-ml-filter]').forEach(b=>b.addEventListener('click',()=>{$$('[data-ml-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$$('[data-ml-preset]').forEach(x=>x.hidden=b.dataset.mlFilter!=='all'&&x.dataset.category!==b.dataset.mlFilter);}));
 const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;schedule();},{threshold:.08});observer.observe(stage);
 new MutationObserver(()=>{if(blocked())$('[data-ml-result-video]').pause();schedule();}).observe(document.body,{attributes:true,attributeFilter:['class']});
 reduced.addEventListener('change',()=>{if(reduced.matches){playing=false;$('[data-ml-result-video]').pause();}schedule();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelExport('Video annullato perché la scheda è stata nascosta. Tienila aperta durante l’esportazione.');schedule();});
 window.addEventListener('pagehide',()=>{cancelExport();cancelAnimationFrame(frame);fileURLs.forEach(URL.revokeObjectURL);if(videoURL)URL.revokeObjectURL(videoURL);});
 try{
  await engine.ready;if(cfg.customImage)await engine.load(cfg.customImage);
  const library=$('[data-ml-library]');library.replaceChildren();
  data.presets.forEach((preset,i)=>{
   const b=document.createElement('button');b.type='button';b.className='ml-preset';b.dataset.mlPreset=preset.id;b.dataset.category=preset.category;b.setAttribute('aria-label','Prova '+preset.name+' — '+preset.description);b.setAttribute('aria-pressed',String(cfg.preset===preset.id));
   const thumb=document.createElement('span');thumb.className='ml-thumb';const c=document.createElement('canvas');const size=engine.dimensions(preset.format,240);[c.width,c.height]=size;c.setAttribute('aria-hidden','true');engine.render(c.getContext('2d'),c.width,c.height,2.4,{...defaults,preset:preset.id,palette:preset.palette,format:preset.format,photo:preset.photo});thumb.append(c);
   const title=document.createElement('span');title.className='ml-preset-title';title.append(document.createTextNode(preset.name));const number=document.createElement('small');number.textContent=String(i+1).padStart(2,'0');title.append(number);
   const description=document.createElement('span');description.className='ml-preset-desc';description.textContent=preset.format+' / '+({compositions:'COMPOSIZIONE',stories:'STORY',video:'VIDEO'}[preset.category]);b.append(thumb,title,description);
   b.addEventListener('click',()=>{cfg={...cfg,preset:preset.id,format:preset.format,palette:preset.palette,photo:preset.photo};time=0;last=0;sync();report(preset.name+' · '+preset.description+'.');stage.scrollIntoView({behavior:blocked()?'instant':'smooth',block:'center'});});library.append(b);
  });
  $('[data-ml-loading]').hidden=true;sync();schedule();
 }catch(error){$('[data-ml-loading]').textContent='Anteprima non disponibile. Ricarica la pagina.';report(error.message);}
};
window.initHangoverLab();

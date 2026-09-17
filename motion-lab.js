/* The initializer is self-contained so exported templates remain editable offline. */
window.initHangoverLab = async function initHangoverLab(){
 'use strict';
 const root=document.getElementById('motionLab');if(!root)return;
 const pristine=root.outerHTML,data=window.HANGOVER_STUDIO_DATA,engine=window.createHangoverStudio(data);
 const $=s=>root.querySelector(s),$$=s=>Array.from(root.querySelectorAll(s));
 const canvas=$('[data-ml-canvas]'),ctx=canvas.getContext('2d'),stage=$('[data-ml-stage]'),status=$('[data-ml-status]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const defaults={preset:'prisma',palette:'ice',format:'16:9',title:'ALL NIGHT',subtitle:'HANGOVER / AFTER DARK',lineup:'[ARTISTA 01]\n[ARTISTA 02]\n[ARTISTA 03]',duration:10,speed:1,photo:'01',effects:['grain'],customImage:null,resolution:1080,content:'composition',background:'preset',wordmarkMotion:'drift'};
 let cfg={...defaults},time=2.4,playing=!reduced.matches,inView=false,frame=0,last=0,exporting=false,job=null,photoRevision=0;
 let previewBackground='photo',showGuides=false,alphaSupport={state:'unknown',mime:null};
 let videoURL=null;const fileURLs=new Set();
 const stamp=t=>String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0');
 function report(message){status.textContent=message;}
 function validate(value){
  if(!value||typeof value!=='object')throw Error('Preset non valido.');
  const c={...defaults};
  if(!data.presets.some(x=>x.id===value.preset)||!Object.hasOwn(data.palettes,value.palette)||!['9:16','1:1','16:9'].includes(value.format))throw Error('Preset o formato non riconosciuto.');
  for(const k of ['preset','palette','format'])c[k]=value[k];
  for(const [key,allowed] of [['resolution',[1080,1440,2160]],['content',['composition','wordmark']],['background',['preset','transparent']],['wordmarkMotion',['drift','reveal','pulse']]]){if(value[key]!=null){const v=key==='resolution'?Number(value[key]):value[key];if(!allowed.includes(v))throw Error('Impostazione di export non riconosciuta.');c[key]=v;}}
  const supported=data.presets.find(p=>p.id===c.preset).formats;if(c.content!=='wordmark'&&supported&&!supported.includes(c.format))throw Error('Questo studio è pensato per il formato verticale 9:16.');
  for(const [k,n] of [['title',42],['subtitle',72],['lineup',160]]){if(typeof value[k]!=='string'||value[k].length>n)throw Error('Il testo del preset non è valido.');c[k]=value[k];}
  if(![6,10,15].includes(value.duration)||![.75,1,1.25].includes(value.speed))throw Error('Durata o movimento non riconosciuti.');
  c.duration=value.duration;c.speed=value.speed;
  if(!data.photos.some(x=>x.id===value.photo))throw Error('Immagine non riconosciuta.');c.photo=value.photo;
  if(!Array.isArray(value.effects)||value.effects.length>3||!value.effects.every(x=>['grain','light','registration'].includes(x)))throw Error('Effetti non riconosciuti.');c.effects=[...new Set(value.effects)];
  if(value.customImage!=null){if(typeof value.customImage!=='string'||value.customImage.length>12000000||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=\r\n]+$/.test(value.customImage))throw Error('Foto del preset non valida.');c.customImage=value.customImage;}
  return c;
 }
 try{if(window.HANGOVER_INITIAL_CONFIG)cfg=validate(window.HANGOVER_INITIAL_CONFIG);}catch(e){report(e.message);}
 function render(){engine.preview(ctx,canvas.width,canvas.height,time,cfg,{background:previewBackground,guides:showGuides});$('[data-ml-seek]').value=time;$('[data-ml-seek]').setAttribute('aria-valuetext',time.toFixed(1)+' secondi di '+cfg.duration);$('[data-ml-time]').textContent=stamp(time)+' / '+stamp(cfg.duration);}
 function blocked(){return reduced.matches||document.body.classList.contains('paused');}
 function playerState(){const paused=!playing||blocked();window.HangoverUI.label($('[data-ml-play]'),'',paused?'play':'pause');$('[data-ml-play]').setAttribute('aria-pressed',String(paused));$('[data-ml-play]').setAttribute('aria-label',paused?'Riproduci l’anteprima':'Metti in pausa l’anteprima');}
 function schedule(){cancelAnimationFrame(frame);frame=0;last=0;if(playing&&!blocked()&&inView&&!document.hidden&&!exporting)frame=requestAnimationFrame(tick);playerState();}
 function tick(now){if(last)time=(time+(now-last)/1000)%cfg.duration;last=now;render();frame=requestAnimationFrame(tick);}
 function resize(){const [w,h]=engine.dimensions(cfg.format,640);const k=Math.min(1,1000/w,1100/h);canvas.width=Math.round(w*k);canvas.height=Math.round(h*k);canvas.style.aspectRatio=w+'/'+h;render();}
 function sync(){
  const preset=data.presets.find(x=>x.id===cfg.preset),ix=data.presets.indexOf(preset)+1;
  $('[data-ml-name]').textContent=String(ix).padStart(2,'0')+' / '+preset.name.toUpperCase();
  $('[data-ml-description]').textContent=preset.description;
  const output=engine.exportSettings(cfg);$('[data-ml-dimensions]').textContent=output.width+' × '+output.height;
  if(cfg.content==='wordmark'){$('[data-ml-name]').textContent='HANGOVER / FIRMA ANIMATA';$('[data-ml-description]').textContent='Solo il nome · contorni originali';}
  canvas.setAttribute('aria-label','Anteprima '+(cfg.content==='wordmark'?'firma HANGOVER':preset.name)+' — '+cfg.format);
  $$('[data-ml-format]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.mlFormat===cfg.format));b.disabled=Boolean(cfg.content!=='wordmark'&&preset.formats&&!preset.formats.includes(b.dataset.mlFormat));});
  $('[data-ml-overlay-controls]').hidden=!output.transparent;$('[data-ml-export=sequence]').hidden=false;$('[data-ml-export=video]').hidden=false;
  window.HangoverUI.label($('[data-ml-export=sequence]'),output.transparent?'Sequenza PNG alpha · ZIP':'Sequenza PNG · ZIP','down');
  const videoButton=$('[data-ml-export=video]');window.HangoverUI.label(videoButton,output.transparent?(alphaSupport.state==='verified'?'Video WebM alpha':'Verifica video WebM alpha'):'Esporta video','up-right');videoButton.disabled=exporting||(output.transparent&&alphaSupport.state==='unsupported');
  $('[data-ml-guide-label]').hidden=cfg.format!=='9:16';
  const clip=$('[data-ml-clip]');clip.hidden=!preset.clipSrc||cfg.content==='wordmark';if(preset.clipSrc){clip.href=preset.clipSrc;clip.download=preset.clipName;window.HangoverUI.label(clip,'WebM originale · 1080 × 1920 · 6 s','down');clip.title='Clip originale fisso: non include le modifiche o la risoluzione selezionata.';}else clip.removeAttribute('href');
  $('[data-ml-export-note]').textContent=output.transparent?'PNG e sequenza PNG conservano il canale alpha. Lo sfondo di prova e le guide non vengono esportati. WebM disponibile solo se la trasparenza supera la verifica.':'Video senza audio · 30 fps · MP4 o WebM secondo il browser. La sequenza PNG esporta ogni fotogramma alla risoluzione scelta.';
  $$('[data-ml-output]').forEach(el=>{el.value=cfg[el.dataset.mlOutput];if(el.dataset.mlOutput==='resolution')Array.from(el.options).forEach(option=>{const d=engine.dimensions(cfg.format,Number(option.value));option.textContent=({'1080':'Full HD','1440':'2K / QHD','2160':'4K / UHD'}[option.value])+' · '+d.join(' × ');});});
  const wordmarkControls=$('[data-ml-wordmark-controls]');if(wordmarkControls)wordmarkControls.hidden=cfg.content!=='wordmark';
  const summary=$('[data-ml-output-summary]');if(summary)summary.textContent=output.width+' × '+output.height+' px · 30 fps · '+(output.transparent?'alpha / senza sfondo':'sfondo incluso')+(cfg.resolution===2160?' · la sequenza 4K richiede più tempo e memoria':'');
  const alphaStatus=$('[data-ml-alpha-status]');if(alphaStatus)alphaStatus.textContent=output.transparent?(alphaSupport.state==='verified'?'WebM alpha verificato in questo browser; anche il file finale viene controllato.':alphaSupport.state==='unsupported'?'Questo browser non conserva la trasparenza nel video. Usa PNG o sequenza PNG; i WebM originali restano file separati.':'PNG e sequenza PNG con alpha reale. Per il video, verifico prima che questo browser conservi la trasparenza.'):(cfg.content==='wordmark'?'Firma animata isolata: nessun titolo, foto, pannello o secondo logo.':'Trasparente rimuove sfondo e fotografie e conserva testi, segni e pannelli grafici.');
  $$('[data-ml-palette]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mlPalette===cfg.palette)));
  $$('[data-ml-field]').forEach(el=>el.value=cfg[el.dataset.mlField]);
  $$('[data-ml-effect]').forEach(el=>{el.checked=cfg.effects.includes(el.dataset.mlEffect);el.closest('label').hidden=Boolean((output.transparent&&el.dataset.mlEffect==='registration')||cfg.content==='wordmark');});
  $$('[data-ml-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mlPreset===cfg.preset)));
  const copyControls=$('.ml-copy');if(copyControls)copyControls.hidden=cfg.content==='wordmark';const photoControls=$('[data-ml-photo]').closest('fieldset');if(photoControls)photoControls.hidden=cfg.content==='wordmark';
  $('[data-ml-lineup-label]').hidden=!(cfg.preset==='lineup'||preset.usesLineup);$('[data-ml-photo]').value=cfg.photo;$('[data-ml-reset-photo]').hidden=!cfg.customImage;
  $('[data-ml-photo-note]').textContent=cfg.customImage?'La tua foto resta nel browser e nei file che scarichi.':preset.transparent?'La materia colora il segno; lo sfondo è solo una prova.':'La materia entra nelle foto e crea riflessi nei layout tipografici.';
  $('[data-ml-seek]').max=cfg.duration;time=Math.min(time,cfg.duration-.01);resize();playerState();
 }
 function save(blob,name){
  if(videoURL)URL.revokeObjectURL(videoURL);videoURL=URL.createObjectURL(blob);
  const link=$('[data-ml-download]');link.href=videoURL;link.download=name;window.HangoverUI.label(link,'Scarica '+name.split('.').pop().toUpperCase(),'down');link.hidden=false;
  showResult(blob.type,videoURL);
 }
 function showResult(type,url){
  const box=$('[data-ml-result]'),video=$('[data-ml-result-video]'),img=$('[data-ml-result-image]'),template=$('[data-ml-result-template]');
  video.pause();video.removeAttribute('src');video.load();img.removeAttribute('src');template.removeAttribute('href');video.hidden=img.hidden=template.hidden=true;box.hidden=true;box.open=false;
  if(type.startsWith('video/')){video.src=url;video.hidden=false;box.hidden=false;}
  else if(type.startsWith('image/')){img.src=url;img.hidden=false;box.hidden=false;}
  else if(type==='text/html'){template.href=url;template.hidden=false;box.hidden=false;}
 }

 const outputName=(snapshot,ext)=>'hangover-'+(snapshot.content==='wordmark'?'wordmark-'+snapshot.wordmarkMotion:snapshot.preset)+'-'+snapshot.format.replace(':','x')+'-'+(snapshot.resolution||1080)+'p'+(engine.exportSettings(snapshot).transparent?'-alpha':'')+'.'+ext;
 const fileName=ext=>outputName(cfg,ext);
 function presetFile(){save(new Blob([JSON.stringify({schema:'hangover.motion.preset',version:1,config:cfg},null,2)],{type:'application/json'}),fileName('json'));report('Preset pronto: testi, formato, palette, foto ed effetti.');}
 function templateFile(){
  const json=v=>JSON.stringify(v).replace(/</g,'\\u003c'),end='<'+'/script>';
  const extensions=['createHangoverUI','createHangoverEditorial','createHangoverSocial','createHangoverOverlays','createHangoverZip'].map(k=>'window.'+k+'='+window[k].toString()+';').join('');
  let exportStyles=data.exportStyles||'';if(!exportStyles)for(const sheet of Array.from(document.styleSheets)){try{if(sheet.href&&sheet.href.includes('motion-export.css'))exportStyles+=Array.from(sheet.cssRules,r=>r.cssText).join('\n');}catch(_error){}}
  let uiStyles=data.uiStyles||'';if(!uiStyles)for(const sheet of Array.from(document.styleSheets)){try{if(sheet.href&&sheet.href.includes('ui-controls.css'))uiStyles+=Array.from(sheet.cssRules,r=>r.cssText).join('\n');}catch(_error){}}
  if(!uiStyles)uiStyles=window.HangoverUI.styles;
  const portableData={...data,exportStyles,uiStyles};
  const html=window.HangoverUI.markup('<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hangover — Motion Studio</title><style>'+data.styles+exportStyles+uiStyles+'</style></head><body class="h-motion-template">'+pristine+'<script>window.HANGOVER_STUDIO_DATA='+json(portableData)+';window.HANGOVER_INITIAL_CONFIG='+json(cfg)+';'+end+'<script>'+extensions+'window.HangoverUI=window.createHangoverUI();'+end+'<script>window.createHangoverStudio='+window.createHangoverStudio.toString()+';'+end+'<script>window.initHangoverLab='+window.initHangoverLab.toString()+';window.initHangoverLab();'+end+'</body></html>');
  save(new Blob([html],{type:'text/html'}),fileName('html'));report('Template pronto. Scarica e apri il file HTML per ritrovare questo studio, modificarlo ed esportarlo offline.');
 }
 async function pngFile(){
  const snapshot=JSON.parse(JSON.stringify(cfg)),output=engine.exportSettings(snapshot),target=document.createElement('canvas'),current={type:'png',cancelled:false};job=current;setExporting(true);
  try{[target.width,target.height]=[output.width,output.height];const context=target.getContext('2d');engine.render(context,target.width,target.height,time,snapshot);if(output.transparent&&!frameHasAlpha(context,target.width,target.height))throw Error('Il fotogramma non conserva la trasparenza. Riprova con Solo HANGOVER.');
   const blob=await new Promise(r=>target.toBlob(r,'image/png'));if(!blob)throw Error('Il fotogramma non è stato creato. Riprova.');if(current.cancelled)return;save(blob,outputName(snapshot,'png'));report('Fotogramma pronto: '+target.width+' × '+target.height+' px'+(output.transparent?' · alpha reale.':'.'));
  }finally{target.width=target.height=1;if(job===current)job=null;setExporting(false);}
 }
 function setExporting(v){exporting=v;$$('[data-ml-export], [data-ml-preset], [data-ml-filter], .ml-controls fieldset, [data-ml-output-settings], [data-ml-preset-file]').forEach(b=>b.disabled=v);$('[data-ml-cancel]').hidden=!v;root.setAttribute('aria-busy',String(v));if(!v)sync();schedule();}
 function frameHasAlpha(context,width,height){const pixels=context.getImageData(0,0,width,height).data;for(let i=3;i<pixels.length;i+=4)if(pixels[i]<255)return true;return false;}
 async function sequenceFile(){
  const snapshot=JSON.parse(JSON.stringify(cfg)),output=engine.exportSettings(snapshot),target=document.createElement('canvas');[target.width,target.height]=[output.width,output.height];const context=target.getContext('2d');
  const current={cancelled:false,type:'sequence'};job=current;setExporting(true);const frames=snapshot.duration*output.fps,entries=[];let storedBytes=0;
  try{for(let i=0;i<frames;i++){if(current.cancelled)return;engine.render(context,target.width,target.height,i/output.fps,snapshot);if(i===0&&output.transparent&&!frameHasAlpha(context,target.width,target.height))throw Error('Questa composizione non conserva l’alpha. Usa Solo HANGOVER o cambia studio.');const blob=await new Promise(resolve=>target.toBlob(resolve,'image/png'));if(!blob)throw Error('Fotogramma non disponibile.');storedBytes+=blob.size;if(storedBytes>1024*1024*1024)throw Error('La sequenza supera 1 GB nel browser. Scegli 6 secondi o una risoluzione più bassa e riprova.');const bytes=new Uint8Array(await blob.arrayBuffer());if(current.cancelled)return;entries.push({name:'frames/'+String(i).padStart(5,'0')+'.png',bytes});if(i%10===0)report('Creo la sequenza PNG'+(output.transparent?' alpha':'')+'… '+Math.round(i/frames*100)+'% · '+output.width+' × '+output.height);}
   if(current.cancelled)return;
   entries.push({name:'LEGGIMI.txt',bytes:'HANGOVER / '+(snapshot.content==='wordmark'?'SOLO FIRMA / '+snapshot.wordmarkMotion:snapshot.preset)+'\n'+target.width+' x '+target.height+' / '+output.fps+' fps / '+snapshot.duration+' s\n'+(output.transparent?'RGBA con trasparenza reale. Importa frames/00000.png come sequenza di immagini a 30 fps e posizionala sopra il tuo video. Mantieni il canale alpha.':'PNG con sfondo. Importa frames/00000.png come sequenza di immagini a 30 fps.')+'\nNessuna guida o sfondo di prova è incluso.\n'});
   entries.push({name:'preset.json',bytes:JSON.stringify({schema:'hangover.motion.preset',version:1,config:snapshot},null,2)});save(window.createHangoverZip(entries),outputName(snapshot,'zip'));report('Sequenza pronta: '+frames+' PNG'+(output.transparent?' con alpha':'')+' · '+target.width+' × '+target.height+' · 30 fps.');
  }finally{entries.length=0;target.width=target.height=1;if(job===current)job=null;setExporting(false);}
 }
 function decodeAlpha(blob,fraction=.37){
  return new Promise((resolve,reject)=>{
   const video=document.createElement('video'),url=URL.createObjectURL(blob);let finished=false,seekTime=.12;
   const timer=setTimeout(()=>finish(Error('Il browser non riesce a verificare il canale alpha del video.')),6500);
   function finish(error,result){if(finished)return;finished=true;clearTimeout(timer);video.pause();video.removeAttribute('src');video.load();URL.revokeObjectURL(url);error?reject(error):resolve(result);}
   function inspect(){if(finished||video.readyState<2||video.seeking)return;try{const target=document.createElement('canvas');target.width=128;target.height=Math.max(32,Math.round(128*(video.videoHeight||1)/(video.videoWidth||1)));const context=target.getContext('2d');context.clearRect(0,0,target.width,target.height);context.drawImage(video,0,0,target.width,target.height);const pixels=context.getImageData(0,0,target.width,target.height).data;let min=255,max=0;for(let i=3;i<pixels.length;i+=4){min=Math.min(min,pixels[i]);max=Math.max(max,pixels[i]);}finish(null,{verified:min===0&&max>16,alphaMin:min,alphaMax:max});}catch(error){finish(error);}}
   video.muted=true;video.playsInline=true;video.preload='auto';video.onerror=()=>finish(Error('Il browser non decodifica questo video.'));
   video.onloadedmetadata=()=>{if(Number.isFinite(video.duration)&&video.duration>0)seekTime=Math.min(video.duration*.8,Math.max(.01,video.duration*fraction));try{video.currentTime=seekTime;}catch(_error){inspect();}};
   video.onloadeddata=()=>{if(video.currentTime>=seekTime-.01)inspect();};video.onseeked=inspect;video.src=url;video.load();
  });
 }
 async function verifyAlphaSupport(){
  if(alphaSupport.state!=='unknown')return alphaSupport.mime;
  if(typeof MediaRecorder==='undefined'||typeof HTMLCanvasElement.prototype.captureStream!=='function'){alphaSupport={state:'unsupported',mime:null};return null;}
  for(const mime of ['video/webm;codecs=vp9','video/webm;codecs=vp8']){
   if(!MediaRecorder.isTypeSupported(mime))continue;
   try{
    const sample=document.createElement('canvas');sample.width=sample.height=64;const context=sample.getContext('2d');let count=0;
    const draw=()=>{context.clearRect(0,0,64,64);context.fillStyle='#ff5028';context.fillRect(32+(count++%2),16,24,32);};draw();
    const blob=await new Promise((resolve,reject)=>{
     const stream=sample.captureStream(30),chunks=[];let recorder,interval,timer,watchdog,done=false;
     const end=error=>{if(done)return;done=true;clearInterval(interval);clearTimeout(timer);clearTimeout(watchdog);if(recorder&&recorder.state!=='inactive'){try{recorder.stop();}catch(_error){}}stream.getTracks().forEach(track=>track.stop());if(error)reject(error);else resolve(new Blob(chunks,{type:recorder.mimeType||mime}));};
     try{recorder=new MediaRecorder(stream,{mimeType:mime});recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder.onerror=()=>end(Error('Encoder alpha non disponibile.'));recorder.onstop=()=>end();recorder.start();interval=setInterval(draw,32);timer=setTimeout(()=>{if(recorder.state!=='inactive')recorder.stop();},450);watchdog=setTimeout(()=>end(Error('Verifica encoder scaduta.')),2200);}catch(error){end(error);}
    });
    const evidence=await decodeAlpha(blob,.3);if(evidence.verified){alphaSupport={state:'verified',mime,...evidence};return mime;}
   }catch(_error){/* A MIME claim alone is not proof of transparent decoded pixels. */}
  }
  alphaSupport={state:'unsupported',mime:null};return null;
 }
 function inspectVideo(blob){
  return new Promise((resolve,reject)=>{
   const video=document.createElement('video'),url=URL.createObjectURL(blob);let finished=false,seekedToEnd=false;
   const timer=setTimeout(()=>finish(Error('Il browser non riesce a verificare la durata del video. Usa la sequenza PNG.')),12000);
   function finish(error,result){if(finished)return;finished=true;clearTimeout(timer);video.pause();video.removeAttribute('src');video.load();URL.revokeObjectURL(url);error?reject(error):resolve(result);}
   function inspect(){
    if(finished)return;
    if(Number.isFinite(video.duration)&&video.duration>0&&video.videoWidth&&video.videoHeight){finish(null,{duration:video.duration,width:video.videoWidth,height:video.videoHeight});return;}
    // MediaRecorder WebM files can omit the duration header. A seek resolves the final timestamp.
    if(video.readyState>=1&&!seekedToEnd){seekedToEnd=true;try{video.currentTime=1e10;}catch(error){finish(error);}}
   }
   video.muted=true;video.playsInline=true;video.preload='auto';video.onerror=()=>finish(Error('Il browser non decodifica il video esportato. Usa la sequenza PNG.'));
   video.onloadedmetadata=inspect;video.ondurationchange=inspect;video.onseeked=inspect;video.src=url;video.load();
  });
 }
 async function recordVideo(attempt=0,frozen=null){
  if(typeof MediaRecorder==='undefined'||typeof HTMLCanvasElement.prototype.captureStream!=='function'){report('Questo browser non esporta video. Puoi scaricare PNG e sequenza PNG o aprire il template in un altro browser.');return;}
  const snapshot=frozen||JSON.parse(JSON.stringify(cfg)),output=engine.exportSettings(snapshot),current={type:'video',frame:0,cancelled:false};job=current;setExporting(true);let mime;
  if(output.transparent){report('Verifico la trasparenza WebM in questo browser…');mime=await verifyAlphaSupport();if(current.cancelled||!mime){if(job===current)job=null;setExporting(false);if(!current.cancelled)report('Il browser appiattisce o non verifica l’alpha WebM. Usa PNG o sequenza PNG: mantengono la trasparenza.');return;}}
  else mime=['video/mp4;codecs=avc1.42E01E','video/mp4','video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(type=>MediaRecorder.isTypeSupported(type));
  if(!mime){if(job===current)job=null;setExporting(false);report('Formato video non supportato. Usa la sequenza PNG.');return;}
  let target,context,stream;try{target=document.createElement('canvas');[target.width,target.height]=[output.width,output.height];context=target.getContext('2d');engine.render(context,target.width,target.height,0,snapshot);stream=target.captureStream(output.fps);}catch(_error){if(job===current)job=null;setExporting(false);throw Error('Il browser non prepara questa risoluzione video. Usa la sequenza PNG o una risoluzione inferiore.');}
  const chunks=[];let rec;
  try{rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:output.bitrate});}catch(_error){stream.getTracks().forEach(track=>track.stop());if(job===current)job=null;setExporting(false);throw Error('Il browser non avvia questa risoluzione video. Usa la sequenza PNG o una risoluzione inferiore.');}
  current.rec=rec;current.stream=stream;
  if(videoURL){URL.revokeObjectURL(videoURL);videoURL=null;}$('[data-ml-download]').hidden=true;
  rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
  rec.onerror=()=>{current.cancelled=true;report('Esportazione interrotta dal browser. Usa la sequenza PNG o una risoluzione inferiore.');if(rec.state!=='inactive')rec.stop();};
  rec.onstop=async()=>{
   cancelAnimationFrame(current.frame);clearTimeout(current.stopTimer);stream.getTracks().forEach(track=>track.stop());let retry=false;
   try{if(current.cancelled)return;const blob=new Blob(chunks,{type:rec.mimeType||mime});if(!blob.size)throw Error('Il video è vuoto. Usa la sequenza PNG.');
    report('Controllo risoluzione e durata del video finale…');const metadata=await inspectVideo(blob);
    if(current.cancelled)return;
    if(metadata.width!==output.width||metadata.height!==output.height)throw Error('Il browser ha cambiato la risoluzione. Usa la sequenza PNG per conservarla.');
    if(Math.abs(metadata.duration-snapshot.duration)>.15){
     if(attempt===0){retry=true;report('Il video è risultato incompleto. Ripeto l’esportazione…');}
     else throw Error('Il browser non ha mantenuto la durata. Scarica la sequenza PNG: conserva tutti i '+snapshot.duration*output.fps+' fotogrammi alla risoluzione scelta.');
    }
    if(retry)return;
    if(output.transparent){report('Controllo il canale alpha del video finale…');const evidence=await decodeAlpha(blob);if(!evidence.verified)throw Error('Il video finale ha perso la trasparenza. Scarica la sequenza PNG con alpha.');}
    if(current.cancelled)return;const ext=blob.type.includes('mp4')?'mp4':'webm';save(blob,outputName(snapshot,ext));report('Video pronto · '+output.width+' × '+output.height+' · '+metadata.duration.toFixed(2)+' s verificati · '+(output.transparent?'alpha verificato · ':'')+'senza audio.');
   }catch(error){report(error.message||'Verifica video non riuscita. Usa la sequenza PNG.');}
   finally{target.width=target.height=1;if(job===current)job=null;setExporting(false);if(retry&&!current.cancelled)recordVideo(attempt+1,snapshot).catch(error=>report(error.message));}
  };
  let started=0,previous=-100,lastReport=-1;
  function next(now){
   if(current.cancelled)return;const elapsed=Math.max(0,(now-started)/1000);
   if(elapsed>=snapshot.duration){engine.render(context,target.width,target.height,snapshot.duration-1/output.fps,snapshot);current.stopTimer=setTimeout(()=>{if(rec.state!=='inactive')rec.stop();},1000/output.fps);return;}
   if(now-previous>=1000/output.fps-2){engine.render(context,target.width,target.height,elapsed,snapshot);previous=now;}
   const percent=Math.floor(elapsed/snapshot.duration*10)*10;if(percent!==lastReport){report('Creo il video… '+percent+'% · '+output.width+' × '+output.height+' · Tieni aperta questa scheda.');lastReport=percent;}
   current.frame=requestAnimationFrame(next);
  }
  rec.onstart=()=>{current.frame=requestAnimationFrame(next);};
  started=performance.now();try{rec.start();}catch(error){stream.getTracks().forEach(track=>track.stop());if(job===current)job=null;setExporting(false);throw error;}
 }
 function cancelExport(message='Esportazione annullata.'){if(!job)return;job.cancelled=true;cancelAnimationFrame(job.frame);clearTimeout(job.stopTimer);if(job.rec&&job.rec.state!=='inactive')job.rec.stop();report(message);}
 $('[data-ml-cancel]').addEventListener('click',()=>cancelExport());
 $$('[data-ml-export]').forEach(b=>b.addEventListener('click',async()=>{try{switch(b.dataset.mlExport){case'preset':presetFile();break;case'template':templateFile();break;case'png':await pngFile();break;case'video':await recordVideo();break;case'sequence':await sequenceFile();break;}}catch(e){report(e.message||'Non è stato possibile salvare il file.');}}));
 $('[data-ml-controls]').addEventListener('submit',e=>e.preventDefault());
 $$('[data-ml-format]').forEach(b=>b.addEventListener('click',()=>{cfg.format=b.dataset.mlFormat;sync();}));
 $$('[data-ml-output]').forEach(el=>el.addEventListener('change',()=>{const key=el.dataset.mlOutput;cfg[key]=key==='resolution'?Number(el.value):el.value;if(key==='content'){if(cfg.content==='wordmark'){cfg.background='transparent';previewBackground='checker';}else{const p=data.presets.find(x=>x.id===cfg.preset);if(p.formats&&!p.formats.includes(cfg.format))cfg.format=p.format;}}if(key==='background'&&cfg.background==='transparent')previewBackground='checker';$('[data-ml-overlay-background]').value=previewBackground;sync();}));
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
   await engine.load(src);if(revision!==photoRevision)return;cfg.customImage=src;sync();report('Foto caricata. Cambia studio per esplorare le diverse composizioni.');
  }catch(error){report(error.message);}e.target.value='';
 });
 $('[data-ml-preset-file]').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  try{if(file.size>13*1024*1024)throw Error('Il preset supera 13 MB.');const value=JSON.parse(await file.text());if(value.schema!=='hangover.motion.preset'||value.version!==1)throw Error('Scegli un preset salvato da Hangover Motion Studio.');const next=validate(value.config);if(next.customImage)await engine.load(next.customImage);photoRevision++;cfg=next;time=0;sync();report('Preset importato: '+data.presets.find(x=>x.id===cfg.preset).name+'.');}
  catch(error){report(error instanceof SyntaxError?'Il file non è un preset JSON valido.':error.message);}e.target.value='';
 });
 const photoSelect=$('[data-ml-photo]');photoSelect.replaceChildren();for(const label of ['Scene','Superfici']){const group=document.createElement('optgroup');group.label=label;data.photos.filter(p=>(p.kind==='surface')===(label==='Superfici')).forEach(p=>{const o=document.createElement('option');o.value=p.id;o.textContent=p.label;group.append(o);});photoSelect.append(group);}
 $('[data-ml-guide]').addEventListener('change',e=>{showGuides=e.target.checked;render();});$('[data-ml-overlay-background]').addEventListener('change',e=>{previewBackground=e.target.value;render();});
 $$('[data-ml-filter]').forEach(b=>{b.querySelector('sup').textContent=b.dataset.mlFilter==='all'?data.presets.length:data.presets.filter(p=>p.category===b.dataset.mlFilter).length;});
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
   const thumb=document.createElement('span');thumb.className='ml-thumb';const c=document.createElement('canvas');const size=engine.dimensions(preset.format,240);[c.width,c.height]=size;c.setAttribute('aria-hidden','true');engine.preview(c.getContext('2d'),c.width,c.height,2.4,{...defaults,preset:preset.id,palette:preset.palette,format:preset.format,photo:preset.photo});thumb.append(c);
   const title=document.createElement('span');title.className='ml-preset-title';title.append(document.createTextNode(preset.name));const number=document.createElement('small');number.textContent=String(i+1).padStart(2,'0');title.append(number);
   const description=document.createElement('span');description.className='ml-preset-desc';description.textContent=preset.format+' / '+({compositions:'COMPOSIZIONE',stories:'STORY',video:'VIDEO',reels:'REEL',tiktok:'TIKTOK',overlays:'OVERLAY / ALPHA'}[preset.category]);b.append(thumb,title,description);
   b.addEventListener('click',()=>{cfg={...cfg,content:'composition',preset:preset.id,format:preset.format,palette:preset.palette,photo:preset.photo};time=0;last=0;sync();report(preset.name+' · '+preset.description+'.');stage.scrollIntoView({behavior:blocked()?'instant':'smooth',block:'center'});});library.append(b);
  });
  $('[data-ml-loading]').hidden=true;sync();schedule();
 }catch(error){$('[data-ml-loading]').textContent='Anteprima non disponibile. Ricarica la pagina.';report(error.message);}
};
window.initHangoverLab();

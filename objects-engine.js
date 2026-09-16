/* HANGOVER — objects. Original approved glyph paths; no external requests. */
(function(root){
'use strict';
const DATA=root.HANGOVER_STUDIO_DATA;
const items=[
 ['tee','T-shirt / Segno','wear',240,280,'Stampa frontale · cotone'],
 ['tote','Tote / Repeat','wear',300,380,'Borsa in tela · stampa a due colori'],
 ['cap','Cap / HGR','wear',180,110,'Cappellino · ricamo frontale'],
 ['sticker-h','Sticker / H','stick',60,60,'Adesivo tondo · Ø 60 mm'],
 ['sticker-hgr','Sticker / HGR','stick',120,42,'Adesivo sagomato · 120 × 42 mm'],
 ['sticker-chrome','Sticker / Chrome','stick',70,70,'Adesivo quadrato · 70 × 70 mm'],
 ['patch','Patch / HG','stick',80,55,'Patch ricamata · 80 × 55 mm'],
 ['patch-round','Patch / All night','stick',70,70,'Patch ricamata · Ø 70 mm'],
 ['a3','Manifesto / A3','print',297,420,'297 × 420 mm · segno a tutta pagina'],
 ['a4','Manifesto / A4','print',210,297,'210 × 297 mm · tipografia e ritmo'],
 ['a5','Volantino / A5','print',148,210,'148 × 210 mm · fotografia e QR'],
 ['a6','Volantino / A6','print',105,148,'105 × 148 mm · edizione tascabile'],
 ['dl','Volantino / DL','print',99,210,'99 × 210 mm · formato lungo'],
 ['member','Tessera / Member','entry',85.6,54,'85,6 × 54 mm · tessera del club'],
 ['crew','Pass / Crew','entry',65,100,'65 × 100 mm · pass con asola'],
 ['ticket','Biglietto / Ingresso','entry',170,60,'170 × 60 mm · matrice staccabile'],
 ['drink','Biglietto / Drink','entry',70,35,'70 × 35 mm · gettone cartaceo'],
 ['tyvek','Braccialetto / Tyvek','entry',250,25,'250 × 25 mm · chiusura adesiva'],
 ['woven','Braccialetto / Tessuto','entry',330,15,'330 × 15 mm · nastro tessuto'],
 ['keytag','Portachiavi / Tag','wear',100,30,'100 × 30 mm · fettuccia ricamata'],
 ['lanyard','Lanyard / Repeat','wear',450,20,'Nastro ripiegato · 20 mm di larghezza'],
 ['coaster','Sottobicchiere / H','extra',90,90,'Ø 90 mm · cartone assorbente'],
 ['qr-card','Cartoncino / QR','extra',100,150,'100 × 150 mm · scopri il prossimo evento']
].map((x,i)=>Object.fromEntries(['id','name','category','mmw','mmh','description'].map((k,n)=>[k,x[n]]).concat([['number',String(i+1).padStart(2,'0')]])));
const legacyEvents=new Set(['a3','a4','a5','a6','dl','member','crew','ticket','tyvek','qr-card']);
const legacyTextFields={"tee": [{"key": "signature", "label": "Firma", "value": "HANGOVER", "maxLength": 48}], "tote": [{"key": "tagline", "label": "Frase", "value": "TAKE THE NIGHT WITH YOU", "maxLength": 80}], "sticker-h": [{"key": "tagline", "label": "Frase", "value": "HANGOVER · ALL NIGHT", "maxLength": 64}], "sticker-chrome": [{"key": "tagline", "label": "Frase", "value": "HANGOVER / AFTER HOURS", "maxLength": 64}], "patch": [{"key": "signature", "label": "Firma", "value": "HANGOVER", "maxLength": 48}], "patch-round": [{"key": "title", "label": "Frase inferiore", "value": "ALL NIGHT", "maxLength": 48}, {"key": "signature", "label": "Firma superiore", "value": "HANGOVER", "maxLength": 48}], "a3": [{"key": "eyebrow", "label": "Intestazione", "value": "HANGOVER / CLUB CULTURE", "maxLength": 64}, {"key": "title", "label": "Titolo", "value": "ALL NIGHT", "maxLength": 64}, {"key": "detail", "label": "Dettagli", "value": "DATA · LUOGO", "maxLength": 100}], "a4": [{"key": "eyebrow", "label": "Intestazione", "value": "HANGOVER / IN SERATA", "maxLength": 64}, {"key": "title", "label": "Titolo", "value": "ALL NIGHT", "maxLength": 64}, {"key": "detail", "label": "Dettagli", "value": "DATA · LUOGO", "maxLength": 100}], "a5": [{"key": "title", "label": "Titolo", "value": "ALL NIGHT", "maxLength": 64}, {"key": "detail", "label": "Dettagli", "value": "DATA · LUOGO", "maxLength": 100}], "a6": [{"key": "eyebrow", "label": "Intestazione", "value": "HANGOVER / KEEP THIS", "maxLength": 64}, {"key": "title", "label": "Titolo", "value": "ALL NIGHT", "maxLength": 64}, {"key": "detail", "label": "Dettagli", "value": "DATA · LUOGO", "maxLength": 100}, {"key": "cta", "label": "Invito al QR", "value": "SCAN →", "maxLength": 48}], "dl": [{"key": "title", "label": "Titolo", "value": "ALL NIGHT", "maxLength": 64}, {"key": "detail", "label": "Dettagli", "value": "DATA · LUOGO", "maxLength": 100}, {"key": "cta", "label": "Invito al QR", "value": "NEXT NIGHT", "maxLength": 48}, {"key": "signature", "label": "Firma", "value": "HANGOVER", "maxLength": 48}], "member": [{"key": "title", "label": "Nome sulla tessera", "value": "ALL NIGHT", "maxLength": 64}, {"key": "serial", "label": "Numero / ruolo", "value": "MEMBER / 0001", "maxLength": 48}], "crew": [{"key": "eyebrow", "label": "Intestazione", "value": "HANGOVER / BACKSTAGE", "maxLength": 64}, {"key": "title", "label": "Ruolo", "value": "CREW", "maxLength": 48}, {"key": "detail", "label": "Nome / dettagli", "value": "DATA · LUOGO", "maxLength": 80}], "ticket": [{"key": "title", "label": "Titolo", "value": "ALL NIGHT", "maxLength": 64}, {"key": "detail", "label": "Dettagli", "value": "DATA · LUOGO", "maxLength": 100}, {"key": "serial", "label": "Ingresso / numero", "value": "ADMIT ONE · 0001", "maxLength": 48}, {"key": "stub", "label": "Matrice", "value": "HGR / 001", "maxLength": 32}], "drink": [{"key": "serial", "label": "Numero", "value": "01", "maxLength": 12}, {"key": "tagline", "label": "Dicitura", "value": "DRINK TOKEN", "maxLength": 40}], "tyvek": [{"key": "serial", "label": "Testo sul braccialetto", "value": "ALL NIGHT · HGR 0001", "maxLength": 48}], "keytag": [{"key": "tagline", "label": "Frase", "value": "TAKE ME OUT", "maxLength": 48}], "lanyard": [{"key": "signature", "label": "Firma ripetuta", "value": "HANGOVER", "maxLength": 24}], "coaster": [{"key": "title", "label": "Frase", "value": "ONE MORE DANCE", "maxLength": 64}, {"key": "signature", "label": "Firma", "value": "HANGOVER", "maxLength": 48}], "qr-card": [{"key": "title", "label": "Titolo", "value": "NEXT\nNIGHT.", "maxLength": 64}, {"key": "cta", "label": "Invito al QR", "value": "SCOPRI IL PROSSIMO EVENTO", "maxLength": 100}]};
for(const it of items){it.event=legacyEvents.has(it.id);it.qr=it.event;it.textFields=legacyTextFields[it.id]||[];}
const extensions=['createHangoverWear','createHangoverPrint','createHangoverClub'].map(name=>root[name]?.()||{items:[],renderers:{}});
const renderers=Object.assign({},...extensions.map(x=>x.renderers));
for(const extension of extensions)for(const item of extension.items){
 if(items.some(x=>x.id===item.id))throw Error('Oggetto duplicato: '+item.id);
 items.push({...item,number:String(items.length+1).padStart(2,'0')});
}
const palettes=Object.fromEntries(root.HangoverPalettes.map(p=>[p.id,p]));
const defaults={title:'ALL NIGHT',detail:'DATA · LUOGO',url:'https://chassyc.github.io/hangover-visual/',palette:'ice',texts:{}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function validatedURL(s){const url=root.HangoverQR.validate(s);if(url.length>240)throw Error('Usa un link più breve (massimo 240 caratteri).');return url;}
function matrix(url){return root.HangoverQR.matrix(validatedURL(url));}
function qrGroup(url,x,y,size){return root.HangoverQR.group(validatedURL(url),x,y,size);}
function render(id,options={},capture=null){
 const it=items.find(o=>o.id===id);if(!it)throw Error('Oggetto non disponibile');
 const o={...defaults,...options},base=palettes[o.palette]||palettes.ice;
 const validColor=v=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v);
 const p={...base,...Object.fromEntries(['bg','fg','accent'].filter(k=>validColor(o[k])).map(k=>[k,o[k]]))};
 const lum=c=>{const a=c.slice(1).match(/../g).map(x=>{const v=parseInt(x,16)/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return a[0]*.2126+a[1]*.7152+a[2]*.0722;};
 const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
 p.inkAccent=contrast(p.bg,p.accent)>=contrast(p.fg,p.accent)?p.bg:p.fg;
 const W=1000,H=it.mmh/it.mmw*W,uid='ob-'+id+'-'+String(options.uid||'preview').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,60);
 const has=(obj,key)=>obj&&Object.prototype.hasOwnProperty.call(obj,key);
 const value=(key,fallback)=>has(o.texts,key)&&typeof o.texts[key]==='string'?o.texts[key]:(has(options,key)&&typeof options[key]==='string'?options[key]:fallback);
 const fit=(key,text,box,opt)=>{
   const config={font:'sans',align:'left',weight:800,maxLines:2,color:p.fg,...opt,key};
   if(capture){const metrics=root.HangoverText.layout(text,box,config);capture.text.push({key,box,font:config.font,metrics});}
   return root.HangoverText.fit(text,box,config);
 };
 const copy=(key,x,y,w,h,opt={})=>{const field=(it.textFields||[]).find(f=>f.key===key);if(!field)throw Error('Campo non disponibile: '+id+'/'+key);return fit(key,value(key,field.value),{x,y,w,h},{...opt,maxLines:opt.lines||2});};
 const rect=(x,y,w,h,c,r=0,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" ${extra}/>`;
 const line=(x,y,x2,y2,c,width=2,extra='')=>`<path d="M${x} ${y}L${x2} ${y2}" fill="none" stroke="${c}" stroke-width="${width}" ${extra}/>`;
 const circle=(x,y,r,c,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${extra}/>`;
 const txt=(t,x,y,size,c,extra='')=>`<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" fill="${c}" ${extra}>${esc(t)}</text>`;
 const micro=(t,x,y,size=21,c=p.fg,extra='')=>txt(t,x,y,size,c,`style="font-family:monospace" letter-spacing="3" ${extra}`);
 const logo=(name,x,y,w,color=p.fg)=>{
   const g=DATA.glyphs[name],s=w/g.width,key='logo-'+name,box={x,y,w,h:g.height*s};
   if(capture&&!capture.logos.includes(name))capture.logos.push(name);
   const text=value(key,name.toUpperCase());
   if(text.normalize('NFC').trim().toUpperCase()!==name.toUpperCase())return fit(key,text,box,{font:'display',maxLines:name.length<4?3:2,align:'center',color});
   return `<g data-field="${key}" data-box="${x} ${y} ${w} ${g.height*s}" transform="translate(${x} ${y}) scale(${s})" fill="${color}" fill-rule="evenodd">${g.paths.map(a=>`<path d="${a.d}" transform="translate(${a.translate.join(' ')})"/>`).join('')}</g>`;
 };
 const title=(x,y,size=90,c=p.fg,width=870)=>copy('title',x,y-size,width,size*1.1,{size,color:c,lines:2});
 const detail=(x,y,size=23,c=p.fg,width=880)=>copy('detail',x,y-size,width,size*1.25,{size,color:c,weight:400,lines:2});
 const qr=(x,y,size)=>{if(capture)capture.qr.push({x,y,w:size,h:size});return `<g data-qr-box="${x} ${y} ${size} ${size}">${qrGroup(o.url,x,y,size)}</g>`;};
 const seams=(x,y,w,h,r=0,c=p.fg)=>rect(x,y,w,h,'none',r,`stroke="${c}" stroke-width="2" stroke-dasharray="5 6" opacity=".55"`);
 const photo=(id,x,y,w,h)=>`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" overflow="hidden"><image href="${esc(DATA.photos.find(a=>a.id===id).src)}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/></svg>`;
 const chrome=`url(#${uid}-chrome)`;
 let b='';
 switch(id){
 case'tee':b=`<path d="M310 50Q400 115 500 115Q600 115 690 50L960 205L870 400L745 338L775 1100Q500 1150 225 1100L255 338L130 400L40 205Z" fill="${p.bg}" stroke="${p.fg}" stroke-width="6"/><path d="M320 57Q500 215 680 57M255 338L280 205M745 338L720 205M235 1070Q500 1110 765 1070" fill="none" stroke="#53616b" stroke-width="3"/>`+logo('h',355,345,295,chrome)+copy('signature',300,704,400,52,{size:27,font:'mono',align:'center',color:p.fg})+rect(665,1020,55,34,p.accent)+logo('hgr',670,1030,45,p.inkAccent);break;
 case'tote':b=`<path d="M305 425V230Q305 75 400 75Q495 75 495 230V425M505 425V230Q505 75 600 75Q695 75 695 230V425" fill="none" stroke="${p.fg}" stroke-width="42"/>`+rect(125,365,750,830,p.bg,8)+seams(142,383,716,790,4)+logo('hang',170,535,655)+logo('over',170,720,655,p.accent)+copy('tagline',170,1040,660,80,{size:22,font:'mono',align:'center',color:p.fg});break;
 case'cap':b=`<path d="M160 380Q130 52 475 48Q795 50 830 385Z" fill="${p.bg}"/><path d="M160 380Q485 290 830 385Q950 430 870 525Q680 590 355 520Q110 475 160 380Z" fill="#101b24" stroke="${p.fg}" stroke-width="3"/><path d="M476 52Q390 190 420 340M480 52Q675 170 689 346" fill="none" stroke="${p.fg}" stroke-width="2" stroke-dasharray="7 7" opacity=".5"/>`+logo('hgr',330,202,320)+circle(475,51,17,p.accent);break;
 case'sticker-h':b=circle(500,500,495,'#f6f3e9')+circle(500,500,465,p.bg)+logo('h',320,225,360)+copy('tagline',190,763,620,80,{size:30,font:'mono',align:'center',color:p.fg});break;
 case'sticker-hgr':b=rect(2,2,W-4,H-4,'#fff',H*.23)+rect(19,19,W-38,H-38,p.accent,H*.19)+logo('hgr',66,39,868,p.inkAccent);break;
 case'sticker-chrome':b=rect(4,4,992,992,'#f4f6f6',50)+rect(24,24,952,952,chrome,40)+logo('hg',120,220,760,p.bg)+copy('tagline',115,810,770,85,{size:27,font:'mono',align:'center',color:p.bg});break;
 case'patch':b=rect(8,8,984,H-16,p.bg,90)+seams(28,28,944,H-56,75)+rect(44,44,912,H-88,'none',65,`stroke="${p.fg}" stroke-width="5"`)+logo('hg',214,100,572)+copy('signature',100,H-150,800,80,{size:30,font:'mono',align:'center',color:p.fg})+`<path d="M65 70h870M65 76h870M65 ${H-70}h870M65 ${H-76}h870" stroke="${p.fg}" opacity=".2"/>`;break;
 case'patch-round':b=circle(500,500,492,p.bg)+circle(500,500,460,'none',`stroke="${p.fg}" stroke-width="6" stroke-dasharray="3 7"`)+circle(500,500,420,'none',`stroke="${p.accent}" stroke-width="4"`)+logo('h',350,250,300)+copy('title',235,725,530,95,{size:38,font:'mono',align:'center',color:p.fg})+copy('signature',250,133,500,74,{size:29,font:'mono',align:'center',color:p.fg});break;
 case'a3':b=rect(0,0,W,H,p.bg)+copy('eyebrow',45,32,910,50,{size:21,font:'mono',color:p.fg})+logo('h',90,260,820,p.fg)+logo('hangover',45,140,910,p.accent)+rect(0,H-235,1000,235,p.accent)+title(42,H-145,92,p.inkAccent,710)+detail(45,H-65,23,p.inkAccent,715)+qr(815,H-201,168);break;
 case'a4':b=rect(0,0,W,H,p.fg)+copy('eyebrow',45,32,910,55,{size:23,font:'mono',color:p.bg})+[0,1,2].map((n)=>logo('hangover',45,180+n*150,910,n===1?p.accent:p.bg)).join('')+`<path d="M1000 720H360A230 230 0 0 0 360 1180H1000M1000 780H360A170 170 0 0 0 360 1120H1000M1000 840H360A110 110 0 0 0 360 1060H1000" fill="none" stroke="${p.bg}" stroke-width="13"/>`+title(45,H-180,78,p.bg,690)+detail(45,H-60,23,p.bg,690)+qr(805,H-205,160);break;
 case'a5':b=rect(0,0,W,H,p.bg)+photo('23',0,0,W,H*.76)+rect(0,H*.68,W,H*.32,p.fg)+logo('hangover',45,H*.71,910,p.bg)+title(45,H-185,86,p.bg,680)+detail(45,H-77,25,p.bg,680)+qr(792,H-228,172);break;
 case'a6':b=rect(0,0,W,H,p.accent)+copy('eyebrow',45,35,910,70,{size:25,font:'mono',color:p.inkAccent})+logo('hg',80,245,840,p.inkAccent)+title(45,H-380,95,p.inkAccent)+detail(45,H-285,25,p.inkAccent)+qr(45,H-223,175)+copy('cta',260,H-198,680,150,{size:28,font:'mono',color:p.inkAccent});break;
 case'dl':b=rect(0,0,W,H,p.bg)+logo('hang',45,100,910)+logo('over',45,355,910,p.accent)+logo('h',235,740,530)+title(50,H-570,105)+detail(50,H-455,26)+qr(45,H-330,245)+copy('cta',360,H-251,560,66,{size:25,font:'mono'})+copy('signature',360,H-178,560,65,{size:25,font:'mono'});break;
 case'member':b=rect(0,0,W,H,p.bg,35)+logo('h',50,50,145,p.accent)+logo('hangover',245,65,700)+copy('serial',55,H-96,690,65,{size:24,font:'mono'})+line(55,H-110,710,H-110,p.fg)+title(55,H-220,100,p.fg,700)+qr(780,H-198,160);break;
 case'crew':b=rect(0,0,W,H,p.bg,45)+rect(370,57,260,40,'#d8e4e6',20)+copy('eyebrow',100,155,800,90,{size:28,font:'mono',align:'center'})+logo('h',245,320,510)+copy('title',80,950,840,178,{size:170,color:p.accent,align:'center'})+copy('detail',80,1150,840,73,{size:29,weight:400,align:'center'})+qr(382,H-290,236);break;
 case'ticket':b=rect(0,0,W,H,p.fg)+rect(0,0,90,H,p.accent)+logo('h',20,120,50,p.bg)+logo('hangover',125,30,610,p.bg)+title(125,190,65,p.bg,630)+detail(125,248,17,p.bg,620)+copy('serial',125,H-59,620,42,{size:16,font:'mono',color:p.bg})+line(770,0,770,H,p.bg,2,'stroke-dasharray="7 7"')+qr(796,42,178)+copy('stub',796,H-62,178,43,{size:16,font:'mono',color:p.bg,align:'center'})+circle(770,0,15,'#d4e1e4')+circle(770,H,15,'#d4e1e4');break;
 case'drink':b=rect(0,0,W,H,p.accent)+logo('hgr',60,70,495,p.inkAccent)+copy('serial',669,100,277,280,{size:285,color:p.inkAccent,align:'center'})+copy('tagline',60,312,520,110,{size:32,font:'mono',color:p.inkAccent})+line(630,0,630,H,p.inkAccent,3,'stroke-dasharray="9 8"');break;
 case'tyvek':b=rect(0,0,W,H,p.accent,9)+seams(7,7,986,H-14,5,p.inkAccent)+logo('hangover',45,26,345,p.inkAccent)+copy('serial',424,22,429,55,{size:17,font:'mono',color:p.inkAccent})+rect(878,5,112,H-10,p.fg,5)+qr(888,5,90);break;
 case'woven':b=rect(0,0,W,H,p.bg)+line(0,3,W,3,p.fg,1,'stroke-dasharray="3 3"')+line(0,H-3,W,H-3,p.fg,1,'stroke-dasharray="3 3"')+[30,275,520,765].map(x=>logo('hangover',x,9,205)).join('')+rect(450,0,34,H,p.accent);break;
 case'keytag':b=rect(15,8,975,H-16,p.bg,35)+seams(30,21,945,H-42,28)+circle(100,H/2,47,'#c7dbe5')+circle(100,H/2,28,'#657784')+logo('hangover',215,92,688)+copy('tagline',215,211,688,43,{size:19,font:'mono'});break;
 case'lanyard':b=rect(0,0,W,H,p.accent)+[20,220,420,620,820].map(x=>logo('hgr',x,8,81,p.inkAccent)+copy('signature',x+93,11,82,25,{size:11,font:'mono',color:p.inkAccent,lines:1})).join('')+line(0,3,W,3,p.inkAccent,1,'stroke-dasharray="2 3"')+line(0,H-3,W,H-3,p.inkAccent,1,'stroke-dasharray="2 3"');break;
 case'coaster':b=circle(500,500,495,p.fg)+circle(500,500,475,'none',`stroke="${p.bg}" stroke-width="2"`)+logo('h',337,193,325,p.bg)+copy('title',190,763,620,84,{size:30,font:'mono',color:p.bg,align:'center'})+copy('signature',300,852,400,50,{size:22,font:'mono',color:p.bg,align:'center'});break;
 case'qr-card':b=rect(0,0,W,H,p.fg)+logo('hangover',55,65,890,p.bg)+copy('title',55,238,890,337,{size:170,color:p.bg,lines:3})+qr(200,630,600)+line(55,H-200,945,H-200,p.accent,4)+copy('cta',55,H-160,890,110,{size:28,font:'mono',color:p.bg,lines:3});break;
 default: if(renderers[id])b=renderers[id]({W,H,p,o,uid,rect,line,circle,txt,micro,logo,title,detail,qr,seams,photo,chrome,esc,copy});
 }
 if(!b)throw Error('Disegno non disponibile: '+id);
 const physical=!it.mockup&&!['tee','tote','cap','lanyard'].includes(id);
 return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${physical?it.mmw+'mm':W}" height="${physical?it.mmh+'mm':H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(it.name)}"><title>${esc(it.name)}</title><defs><linearGradient id="${uid}-chrome" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#64849c"/><stop offset=".3" stop-color="#def4fa"/><stop offset=".5" stop-color="#8dacc2"/><stop offset=".75" stop-color="#e7f5f7"/><stop offset="1" stop-color="#789aaa"/></linearGradient></defs>${b}</svg>`;
}
const noAccent=new Set(['sticker-h','sticker-chrome','patch','a5','keytag','coaster','cloakroom-token','cup-sleeve']);
const noForeground=new Set(['sticker-hgr','sticker-chrome','a6','drink','lanyard']);
for(const it of items){it.fields=(it.textFields||[]).map(f=>f.key);it.colorFields=['bg',...(!noForeground.has(it.id)?['fg']:[]),...(!noAccent.has(it.id)?['accent']:[])];}
const fieldCache=new Map();
function fields(id){
 if(fieldCache.has(id))return fieldCache.get(id).map(f=>({...f}));
 const it=items.find(x=>x.id===id),meta={text:[],logos:[],qr:[]};render(id,{},meta);
 const names={hangover:'Nome / lettering',hang:'Lettering · prima riga',over:'Lettering · seconda riga',h:'Segno H',hg:'Segno HG',hgr:'Segno HGR'};
 const result=meta.logos.map(name=>({key:'logo-'+name,label:names[name],value:name.toUpperCase(),maxLength:name.length<4?8:48,font:'display'})).concat(it.textFields||[]);
 fieldCache.set(id,result);return result.map(f=>({...f}));
}
function info(id,options={}){const meta={text:[],logos:[],qr:[]};render(id,options,meta);return meta;}
root.HangoverObjects={items,palettes,defaults,render,matrix,validatedURL,qrGroup,fields,info};
})(typeof window!=='undefined'?window:globalThis);

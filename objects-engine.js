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
const palettes={ice:{name:'Cobalto / ghiaccio',bg:'#063c9a',fg:'#c3e3f3',accent:'#ff552d'},orange:{name:'Arancio / notte',bg:'#ff552d',fg:'#091726',accent:'#f0ecdf'},paper:{name:'Carta / blu',bg:'#f0ecdf',fg:'#07284e',accent:'#ff552d'},acid:{name:'Notte / acido',bg:'#0b151b',fg:'#e6ef46',accent:'#beddec'}};
const defaults={title:'ALL NIGHT',detail:'DATA · LUOGO',url:'https://chassyc.github.io/hangover-visual/',palette:'ice'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function validatedURL(s){const u=new URL(s);if(!/^https?:$/.test(u.protocol)||u.username||u.password)throw Error('Inserisci un link completo http o https.');if(u.href.length>240)throw Error('Usa un link più breve (massimo 240 caratteri).');return u.href;}
function matrix(url){const qr=root.qrcode(0,'M');qr.addData(validatedURL(url),'Byte');qr.make();return Array.from({length:qr.getModuleCount()},(_,y)=>Array.from({length:qr.getModuleCount()},(_,x)=>qr.isDark(y,x)));}
let cachedURL='',cachedQR;
function qrGroup(url,x,y,size){if(cachedURL!==url){cachedQR=matrix(url);cachedURL=url;}const a=cachedQR,n=a.length,s=size/(n+8);let d='';a.forEach((r,yy)=>r.forEach((v,xx)=>{if(v)d+=`M${xx+4},${yy+4}h1v1h-1z`;}));return `<g transform="translate(${x} ${y}) scale(${s})" shape-rendering="crispEdges"><rect width="${n+8}" height="${n+8}" fill="#fff"/><path d="${d}" fill="#080b0d"/></g>`;}
function render(id,options={}){
 const it=items.find(o=>o.id===id);if(!it)throw Error('Oggetto non disponibile');
 const o={...defaults,...options},p=palettes[o.palette]||palettes.ice,W=1000,H=it.mmh/it.mmw*W,uid='ob-'+id+'-'+(options.uid||'preview');
 const rect=(x,y,w,h,c,r=0,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" ${extra}/>`;
 const line=(x,y,x2,y2,c,width=2,extra='')=>`<path d="M${x} ${y}L${x2} ${y2}" fill="none" stroke="${c}" stroke-width="${width}" ${extra}/>`;
 const circle=(x,y,r,c,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${extra}/>`;
 const txt=(t,x,y,size,c,extra='')=>`<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" fill="${c}" ${extra}>${esc(t)}</text>`;
 const micro=(t,x,y,size=21,c=p.fg,extra='')=>txt(t,x,y,size,c,`style="font-family:monospace" letter-spacing="3" ${extra}`);
 const logo=(name,x,y,w,color=p.fg)=>{const g=DATA.glyphs[name],s=w/g.width;return `<g transform="translate(${x} ${y}) scale(${s})" fill="${color}" fill-rule="evenodd">${g.paths.map(a=>`<path d="${a.d}" transform="translate(${a.translate.join(' ')})"/>`).join('')}</g>`;};
 const title=(x,y,size=90,c=p.fg,width=870)=>{const s=Math.min(size,width/Math.max(1,Array.from(o.title).length)*1.4);return txt(o.title.toUpperCase(),x,y,s,c,'font-weight="800" letter-spacing="-2"');};
 const detail=(x,y,size=23,c=p.fg,width=880)=>txt(o.detail.toUpperCase(),x,y,Math.min(size,width/Math.max(1,o.detail.length)*1.5),c,'letter-spacing="1"');
 const qr=(x,y,size)=>qrGroup(o.url,x,y,size);
 const seams=(x,y,w,h,r=0,c=p.fg)=>rect(x,y,w,h,'none',r,`stroke="${c}" stroke-width="2" stroke-dasharray="5 6" opacity=".55"`);
 const photo=(id,x,y,w,h)=>`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" overflow="hidden"><image href="${esc(DATA.photos.find(a=>a.id===id).src)}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/></svg>`;
 const chrome=`url(#${uid}-chrome)`;
 let b='';
 switch(id){
 case'tee':b=`<path d="M310 50Q400 115 500 115Q600 115 690 50L960 205L870 400L745 338L775 1100Q500 1150 225 1100L255 338L130 400L40 205Z" fill="#101b24" stroke="#33434e" stroke-width="6"/><path d="M320 57Q500 215 680 57M255 338L280 205M745 338L720 205M235 1070Q500 1110 765 1070" fill="none" stroke="#53616b" stroke-width="3"/>`+logo('h',355,345,295,chrome)+micro('HANGOVER',500,740,27,p.fg,'text-anchor="middle"')+rect(665,1020,55,34,p.accent)+logo('hgr',670,1030,45,'#101b24');break;
 case'tote':b=`<path d="M305 425V230Q305 75 400 75Q495 75 495 230V425M505 425V230Q505 75 600 75Q695 75 695 230V425" fill="none" stroke="${p.fg}" stroke-width="42"/>`+rect(125,365,750,830,p.bg,8)+seams(142,383,716,790,4)+logo('hang',170,535,655)+logo('over',170,720,655,p.accent)+micro('TAKE THE NIGHT WITH YOU',500,1090,22,p.fg,'text-anchor="middle"');break;
 case'cap':b=`<path d="M160 380Q130 52 475 48Q795 50 830 385Z" fill="${p.bg}"/><path d="M160 380Q485 290 830 385Q950 430 870 525Q680 590 355 520Q110 475 160 380Z" fill="#101b24" stroke="${p.fg}" stroke-width="3"/><path d="M476 52Q390 190 420 340M480 52Q675 170 689 346" fill="none" stroke="${p.fg}" stroke-width="2" stroke-dasharray="7 7" opacity=".5"/>`+logo('hgr',330,202,320)+circle(475,51,17,p.accent);break;
 case'sticker-h':b=circle(500,500,495,'#f6f3e9')+circle(500,500,465,p.bg)+logo('h',320,225,360)+micro('HANGOVER · ALL NIGHT',500,810,30,p.fg,'text-anchor="middle"');break;
 case'sticker-hgr':b=rect(2,2,W-4,H-4,'#fff',H*.23)+rect(19,19,W-38,H-38,p.accent,H*.19)+logo('hgr',66,39,868,p.bg);break;
 case'sticker-chrome':b=rect(4,4,992,992,'#f4f6f6',50)+rect(24,24,952,952,chrome,40)+logo('hg',120,220,760,p.bg)+micro('HANGOVER / AFTER HOURS',500,860,27,p.bg,'text-anchor="middle"');break;
 case'patch':b=rect(8,8,984,H-16,p.bg,90)+seams(28,28,944,H-56,75)+rect(44,44,912,H-88,'none',65,`stroke="${p.fg}" stroke-width="5"`)+logo('hg',214,100,572)+micro('HANGOVER',500,H-94,30,p.fg,'text-anchor="middle"')+`<path d="M65 70h870M65 76h870M65 ${H-70}h870M65 ${H-76}h870" stroke="${p.fg}" opacity=".2"/>`;break;
 case'patch-round':b=circle(500,500,492,p.bg)+circle(500,500,460,'none',`stroke="${p.fg}" stroke-width="6" stroke-dasharray="3 7"`)+circle(500,500,420,'none',`stroke="${p.accent}" stroke-width="4"`)+logo('h',350,250,300)+micro('ALL NIGHT',500,790,38,p.fg,'text-anchor="middle"')+micro('HANGOVER',500,194,29,p.fg,'text-anchor="middle"');break;
 case'a3':b=rect(0,0,W,H,p.bg)+micro('HANGOVER / CLUB CULTURE',45,65)+logo('h',90,260,820,p.fg)+logo('hangover',45,140,910,p.accent)+rect(0,H-235,1000,235,p.accent)+title(42,H-145,92,p.bg,710)+detail(45,H-65,23,p.bg,715)+qr(815,H-201,168);break;
 case'a4':b=rect(0,0,W,H,p.fg)+micro('HANGOVER / IN SERATA',45,65,23,p.bg)+[0,1,2].map((n)=>logo('hangover',45,180+n*150,910,n===1?p.accent:p.bg)).join('')+`<path d="M1000 720H360A230 230 0 0 0 360 1180H1000M1000 780H360A170 170 0 0 0 360 1120H1000M1000 840H360A110 110 0 0 0 360 1060H1000" fill="none" stroke="${p.bg}" stroke-width="13"/>`+title(45,H-180,78,p.bg,690)+detail(45,H-60,23,p.bg,690)+qr(805,H-205,160);break;
 case'a5':b=rect(0,0,W,H,p.bg)+photo('23',0,0,W,H*.76)+rect(0,H*.68,W,H*.32,p.fg)+logo('hangover',45,H*.71,910,p.bg)+title(45,H-185,86,p.bg,680)+detail(45,H-77,25,p.bg,680)+qr(792,H-228,172);break;
 case'a6':b=rect(0,0,W,H,p.accent)+micro('HANGOVER / KEEP THIS',45,70,25,p.bg)+logo('hg',80,245,840,p.bg)+title(45,H-380,95,p.bg)+detail(45,H-285,25,p.bg)+qr(45,H-223,175)+micro('SCAN →',260,H-95,28,p.bg);break;
 case'dl':b=rect(0,0,W,H,p.bg)+logo('hang',45,100,910)+logo('over',45,355,910,p.accent)+logo('h',235,740,530)+title(50,H-570,105)+detail(50,H-455,26)+qr(45,H-330,245)+micro('NEXT NIGHT',360,H-205,25)+micro('HANGOVER',360,H-150,25);break;
 case'member':b=rect(0,0,W,H,p.bg,35)+logo('h',50,50,145,p.accent)+logo('hangover',245,65,700)+micro('MEMBER / 0001',55,H-60,24)+line(55,H-110,710,H-110,p.fg)+title(55,H-220,100,p.fg,700)+qr(780,H-198,160);break;
 case'crew':b=rect(0,0,W,H,p.bg,45)+rect(370,57,260,40,'#d8e4e6',20)+micro('HANGOVER / BACKSTAGE',500,195,28,p.fg,'text-anchor="middle"')+logo('h',245,320,510)+txt('CREW',500,1110,170,p.accent,'font-weight="900" text-anchor="middle"')+detail(500,1190,29,p.fg,840).replace('letter-spacing="1"','letter-spacing="1" text-anchor="middle"')+qr(382,H-290,236);break;
 case'ticket':b=rect(0,0,W,H,p.fg)+rect(0,0,90,H,p.accent)+logo('h',20,120,50,p.bg)+logo('hangover',125,30,610,p.bg)+title(125,190,65,p.bg,630)+detail(125,248,17,p.bg,620)+micro('ADMIT ONE · 0001',125,H-32,16,p.bg)+line(770,0,770,H,p.bg,2,'stroke-dasharray="7 7"')+qr(796,42,178)+micro('HGR / 001',808,H-33,16,p.bg)+circle(770,0,15,'#d4e1e4')+circle(770,H,15,'#d4e1e4');break;
 case'drink':b=rect(0,0,W,H,p.accent)+logo('hgr',60,70,495,p.bg)+txt('01',905,335,285,p.bg,'font-weight="900" text-anchor="end"')+micro('DRINK TOKEN',60,380,32,p.bg)+line(630,0,630,H,p.bg,3,'stroke-dasharray="9 8"');break;
 case'tyvek':b=rect(0,0,W,H,p.accent,9)+seams(7,7,986,H-14,5,p.bg)+logo('hangover',45,26,345,p.bg)+micro('ALL NIGHT · HGR 0001',435,61,17,p.bg)+rect(878,5,112,H-10,p.fg,5)+qr(888,5,90);break;
 case'woven':b=rect(0,0,W,H,p.bg)+line(0,3,W,3,p.fg,1,'stroke-dasharray="3 3"')+line(0,H-3,W,H-3,p.fg,1,'stroke-dasharray="3 3"')+[30,275,520,765].map(x=>logo('hangover',x,9,205)).join('')+rect(450,0,34,H,p.accent);break;
 case'keytag':b=rect(15,8,975,H-16,p.bg,35)+seams(30,21,945,H-42,28)+circle(100,H/2,47,'#c7dbe5')+circle(100,H/2,28,'#657784')+logo('hangover',215,92,688)+micro('TAKE ME OUT',215,239,19);break;
 case'lanyard':b=rect(0,0,W,H,p.accent)+[20,220,420,620,820].map(x=>logo('hgr',x,8,81,p.bg)+micro('HANGOVER',x+93,27,11,p.bg)).join('')+line(0,3,W,3,p.bg,1,'stroke-dasharray="2 3"')+line(0,H-3,W,H-3,p.bg,1,'stroke-dasharray="2 3"');break;
 case'coaster':b=circle(500,500,495,p.fg)+circle(500,500,475,'none',`stroke="${p.bg}" stroke-width="2"`)+logo('h',337,193,325,p.bg)+micro('ONE MORE DANCE',500,813,30,p.bg,'text-anchor="middle"')+micro('HANGOVER',500,885,22,p.bg,'text-anchor="middle"');break;
 case'qr-card':b=rect(0,0,W,H,p.fg)+logo('hangover',55,65,890,p.bg)+txt('NEXT',55,380,170,p.bg,'font-weight="900"')+txt('NIGHT.',55,540,170,p.bg,'font-weight="900"')+qr(200,630,600)+line(55,H-200,945,H-200,p.accent,4)+micro('SCOPRI IL PROSSIMO EVENTO',55,H-90,28,p.bg);break;
 }
 const physical=!['tee','tote','cap','lanyard'].includes(id);
 return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${physical?it.mmw+'mm':W}" height="${physical?it.mmh+'mm':H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(it.name)}"><title>${esc(it.name)}</title><defs><linearGradient id="${uid}-chrome" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#64849c"/><stop offset=".3" stop-color="#def4fa"/><stop offset=".5" stop-color="#8dacc2"/><stop offset=".75" stop-color="#e7f5f7"/><stop offset="1" stop-color="#789aaa"/></linearGradient></defs>${b}</svg>`;
}
root.HangoverObjects={items,palettes,defaults,render,matrix,validatedURL,qrGroup};
})(typeof window!=='undefined'?window:globalThis);

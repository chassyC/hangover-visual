/* HANGOVER — direction studies, original contours unchanged. */
(function(root){'use strict';
const glyphs=root.HANGOVER_STUDIO_DATA.glyphs;
const palettes={
 night:{name:'Night / ghiaccio',bg:'#0d181d',fg:'#b7dff5',accent:'#ff5028'},
 fire:{name:'Night / arancio',bg:'#0d181d',fg:'#ff5028',accent:'#b7dff5'},
 chrome:{name:'House / cromo',bg:'#aabcca',fg:'#071827',accent:'#124ed6'},
 disco:{name:'Disco / acido',bg:'#302144',fg:'#edff58',accent:'#dba8f2'},
 steel:{name:'Trap / acciaio',bg:'#181b24',fg:'#d7e1e9',accent:'#f33e3e'},
 coral:{name:'Reggaeton / corallo',bg:'#fb6346',fg:'#321930',accent:'#f4e5bd'},
 sand:{name:'Amapiano / sabbia',bg:'#e0c794',fg:'#39251d',accent:'#996343'},
 copper:{name:'Afro / rame',bg:'#203d32',fg:'#f1b56e',accent:'#d86433'},
 violet:{name:'After / ultravioletto',bg:'#231747',fg:'#d5b4ff',accent:'#ddff70'},
 day:{name:'Day / carta',bg:'#efeada',fg:'#103b78',accent:'#ff663b'}
};
const designs=[
 ['night-h','Night / H','Le prime insegne','night','DANCEFLOOR','ne',800,420,'Pannello da parete'],
 ['night-hg','Night / HG','Le prime insegne','fire','BAR','w',800,420,'Pannello da parete'],
 ['chrome','Chrome line','House','chrome','DANCEFLOOR','e',1000,330,'Pannello in alluminio'],
 ['floor','Floor disc','Disco','disco','BAR','ne',600,600,'Adesivo da pavimento'],
 ['steel','Steel entry','Trap / Rap','steel','INGRESSO','n',300,800,'Insegna verticale'],
 ['coral','Hot corner','Reggaeton','coral','BAR','w',800,550,'Pannelli sovrapposti'],
 ['arch','Soft arch','Amapiano','sand','LOUNGE','e',400,650,'Totem ad arco'],
 ['rhythm','Rhythm route','Afro','copper','DANCEFLOOR','e',1000,420,'Fascia da parete'],
 ['light','After light','After hours','violet','CHILL AREA','se',800,300,'Insegna luminosa'],
 ['day','Day pass','Daytime','day','GUARDAROBA','ne',450,750,'Totem a contrasto'],
 ['tape','Tape mix','Mix / collage','fire','MERCH','w',900,600,'Collage di nastri'],
 ['totem','Stack system','Mix / moduli','night','INGRESSO','ne',450,1000,'Totem a tre direzioni']
].map((row,n)=>Object.fromEntries(['id','name','mood','palette','label','arrow','mmw','mmh','support'].map((k,i)=>[k,row[i]]).concat([['number',String(n+1).padStart(2,'0')]])));
const arrows={e:'→',se:'↘',s:'↓',sw:'↙',w:'←',nw:'↖',n:'↑',ne:'↗'},angle={e:0,se:45,s:90,sw:135,w:180,nw:225,n:270,ne:315};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function render(id,options={}){
const d=designs.find(i=>i.id===id);if(!d)throw Error('Composizione non disponibile');const o={...d,...options},p=palettes[o.palette]||palettes[d.palette],W=1000,H=d.mmh/d.mmw*W,uid='sg-'+id+'-'+(o.uid||'preview');
const rect=(x,y,w,h,c,r=0,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" ${extra}/>`;
const circ=(x,y,r,c,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${extra}/>`;
const path=(v,c,extra='')=>`<path d="${v}" fill="${c}" ${extra}/>`;
const text=(v,x,y,s,c,extra='')=>`<text x="${x}" y="${y}" font-family="Arial,Helvetica,sans-serif" font-size="${s}" fill="${c}" ${extra}>${esc(v)}</text>`;
const micro=(v,x,y,s=20,c=p.fg,extra='')=>text(v,x,y,s,c,`style="font-family:'Courier New',monospace" letter-spacing="2" ${extra}`);
const label=(x,y,width,size,c=p.fg,value=o.label)=>text(String(value).toUpperCase(),x,y,Math.min(size,width/(Math.max(1,String(value).length)*.95)),c,'font-weight="800" letter-spacing="-1"');
const mark=(name,x,y,w,c=p.fg)=>{const g=glyphs[name];return `<g transform="translate(${x} ${y}) scale(${w/g.width})" fill="${c}" fill-rule="evenodd">${g.paths.map(z=>`<path d="${z.d}" transform="translate(${z.translate.join(' ')})"/>`).join('')}</g>`;};
const arrow=(cx,cy,size,c=p.fg,dir=o.arrow,width=12)=>`<g transform="translate(${cx} ${cy}) rotate(${angle[dir]??0}) scale(${size/100})">${path('M-43 0H43M9-34L43 0L9 34','none',`stroke="${c}" stroke-width="${width}" stroke-linecap="square" stroke-linejoin="miter"`)}</g>`;
const border=(x,y,w,h,c,thick=2,r=0)=>rect(x,y,w,h,'none',r,`stroke="${c}" stroke-width="${thick}"`);
const dots=(c)=>[45,955].map(x=>[45,H-45].map(y=>circ(x,y,5,c)).join('')).join('');
let b='';
if(id==='night-h'||id==='night-hg')b=rect(0,0,W,H,p.bg)+border(3,3,W-6,H-6,p.fg,3)+rect(22,22,W-44,H-44,'none',0,`stroke="${p.fg}" opacity=".12"`)+mark(id==='night-h'?'h':'hg',80,115,id==='night-h'?258:295)+micro(o.label.toUpperCase(),435,143,Math.min(28,480/o.label.length*1.4))+arrow(620,300,245,p.fg,o.arrow,4);
if(id==='chrome')b=rect(0,0,W,H,`url(#${uid}-metal)`,14)+Array.from({length:37},(_,n)=>path(`M8 ${8+n*8.6}H992`,'none',`stroke="#fff" opacity=".13"`)).join('')+mark('h',40,48,125,p.fg)+label(220,106,695,78)+path('M220 152H954M220 170H954','none',`stroke="${p.accent}" stroke-width="4"`)+arrow(840,245,142,p.accent,o.arrow,9)+arrow(655,245,142,p.fg,o.arrow,9)+micro('HANGOVER / HOUSE',220,291,19,p.fg)+dots('#6c7d8b');
if(id==='floor')b=circ(500,500,495,p.bg)+circ(500,500,467,'none',`stroke="${p.fg}" stroke-width="3"`)+circ(500,500,395,p.fg)+mark('h',139,219,220,p.bg)+arrow(603,433,320,p.bg)+label(150,736,700,144,p.bg)+micro('HANGOVER / FOLLOW THE FEELING',500,880,19,p.fg,'text-anchor="middle"');
if(id==='steel')b=rect(0,0,W,H,p.bg)+border(18,18,964,H-36,p.fg,5)+Array.from({length:22},(_,n)=>path(`M0 ${95+n*119}L1000 ${n*119}`,'none',`stroke="${p.fg}" stroke-width="2" opacity=".08"`)).join('')+mark('hgr',90,115,820)+rect(90,580,820,1080,p.accent)+arrow(500,1110,575,p.bg,o.arrow,14)+label(80,1940,840,143)+micro('HANGOVER / TRAP',90,2110,39)+path(`M90 ${H-290}H910M90 ${H-260}H910M90 ${H-230}H910`,'none',`stroke="${p.fg}" stroke-width="8"`)+dots(p.fg);
if(id==='coral')b=rect(0,0,W,H,p.bg)+path('M650 0H1000V410Z',p.accent)+path(`M0 ${H-220}L1000 ${H-410}V${H}H0Z`,p.fg)+`<g transform="translate(50 58) rotate(-5 400 150)">`+rect(0,0,725,305,p.accent)+label(40,205,650,190,p.fg)+'</g>'+arrow(780,410,260,p.bg)+mark('hg',72,442,265,p.accent)+micro('HANGOVER / REGGAETON',66,H-43,21,p.accent);
if(id==='arch')b=path(`M0 ${H}V500A500 500 0 0 1 1000 500V${H}Z`,p.bg)+path(`M32 ${H-32}V500A468 468 0 0 1 968 500V${H-32}Z`,'none',`stroke="${p.fg}" stroke-width="3"`)+mark('hg',230,240,540,p.fg)+micro('HANGOVER',500,701,30,p.fg,'text-anchor="middle"')+label(95,1025,810,153)+path('M95 1080H905','none',`stroke="${p.accent}" stroke-width="3"`)+arrow(500,1355,285,p.accent,o.arrow,4);
if(id==='rhythm')b=rect(0,0,W,H,p.bg)+rect(0,0,170,H,p.accent)+Array.from({length:7},(_,n)=>circ(85,30+n*60,17,'none',`stroke="${p.bg}" stroke-width="4"`)).join('')+mark('hgr',210,40,190,p.fg)+label(210,235,700,105)+path(`M210 277H930`,'none',`stroke="${p.accent}" stroke-width="6"`)+arrow(865,355,89,p.fg)+micro('HANGOVER / AFRO',210,365,17);
if(id==='light')b=rect(8,8,W-16,H-16,p.bg,54)+border(15,15,W-30,H-30,p.fg,4,48)+`<g filter="url(#${uid}-glow)" opacity=".7">`+label(265,173,620,87)+arrow(841,275,99,p.accent)+'</g>'+mark('h',65,82,120,p.fg)+label(265,173,620,87)+micro('HANGOVER / AFTER HOURS',265,281,17,p.fg)+arrow(841,275,99,p.accent);
if(id==='day')b=rect(0,0,W,H,p.bg)+rect(0,0,200,H,p.accent)+`<g transform="translate(35 1410) rotate(-90)">`+mark('hangover',0,0,1150,p.fg)+'</g>'+mark('h',350,100,400,p.fg)+label(255,925,690,110,p.fg)+arrow(584,1220,320,p.accent)+micro('HANGOVER / DAYTIME',260,H-100,24,p.fg);
if(id==='tape')b=rect(0,0,W,H,p.bg)+`<g transform="rotate(-7 500 330)">`+rect(-30,70,1080,140,p.accent)+mark('hangover',15,92,970,p.bg)+'</g>'+`<g transform="rotate(7 500 340)">`+rect(45,270,850,205,p.fg)+label(90,425,745,140,p.bg)+'</g>'+mark('hg',55,500,200,p.accent)+arrow(813,536,175,p.fg)+micro('HANGOVER / TAKE A PIECE',310,H-50,19,p.accent);
if(id==='totem')b=rect(270,0,460,H,p.bg)+rect(30,45,940,610,p.fg)+mark('h',72,105,190,p.bg)+label(72,485,840,126,p.bg)+arrow(755,230,220,p.bg,o.arrow)+rect(30,700,940,610,p.accent)+mark('hg',75,773,250,p.bg)+label(75,1160,830,172,p.bg,'BAR')+arrow(755,889,210,p.bg,'w')+rect(30,1350,940,610,p.bg)+border(30,1350,940,610,p.fg,3)+mark('hgr',75,1423,310,p.fg)+label(75,1810,810,83,p.fg,'GUARDAROBA')+arrow(755,1550,210,p.fg,'e')+micro('HANGOVER',500,H-85,39,p.fg,'text-anchor="middle"');
return `<svg xmlns="http://www.w3.org/2000/svg" width="${d.mmw}mm" height="${d.mmh}mm" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label+' — '+d.name)}"><title>${esc(o.label+' — '+d.name)}</title><defs><linearGradient id="${uid}-metal" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="${p.bg}"/><stop offset=".28" stop-color="#e6eef2"/><stop offset=".49" stop-color="${p.bg}"/><stop offset=".73" stop-color="#cedfe8"/><stop offset="1" stop-color="${p.bg}"/></linearGradient><filter id="${uid}-glow" x="-.4" y="-.4" width="1.8" height="1.8"><feGaussianBlur stdDeviation="12"/></filter></defs>${b}</svg>`;
}
root.HangoverSignage={designs,palettes,arrows,render};
})(typeof window!=='undefined'?window:globalThis);

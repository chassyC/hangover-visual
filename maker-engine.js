/* HANGOVER Maker — deterministic, self-contained SVG artwork. */
(function(root){
'use strict';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const n=v=>Number(Number(v).toFixed(4));
const rect=(x,y,w,h,fill,extra='')=>`<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${fill}" ${extra}/>`;
const path=(d,fill,extra='')=>`<path d="${d}" fill="${fill}" ${extra}/>`;
const line=(x,y,x2,y2,c,w=2,extra='')=>path(`M${n(x)} ${n(y)}L${n(x2)} ${n(y2)}`,'none',`stroke="${c}" stroke-width="${n(w)}" ${extra}`);
function rng(seed){let x=(Number(seed)||1)>>>0;return()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};}
function lum(c){const a=c.slice(1).match(/../g).map(x=>{const v=parseInt(x,16)/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return a[0]*.2126+a[1]*.7152+a[2]*.0722;}
function contrast(a,b){const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
function panelInk(fg,bg,panel){return contrast(fg,panel)>=contrast(bg,panel)?fg:bg;}
function mixColor(a,b,t){const aa=a.slice(1).match(/../g),bb=b.slice(1).match(/../g);return '#'+aa.map((x,i)=>Math.round(parseInt(x,16)*(1-t)+parseInt(bb[i],16)*t).toString(16).padStart(2,'0')).join('');}
function stateInfo(raw){
 const D=root.HangoverMakerData;if(!D||typeof D.normalize!=='function')throw Error('HangoverMakerData non disponibile.');
 const s=D.normalize(raw||{}),it=D.types.find(t=>t.id===s.type)||D.types[0];
 const W=1000,H=W*Number(it.mmh)/Number(it.mmw);
 return {s,it,W,H};
}
function characters(value,unsupported){
 const G=root.HANGOVER_FONT&&root.HANGOVER_FONT.glyphs;if(!G)throw Error('HANGOVER_FONT non disponibile.');
 let out='';
 for(const original of String(value||'').normalize('NFC')){
  if(/\s/.test(original)){out+=' ';continue;}
  const folded=original.toUpperCase();
  for(const c of folded){if(G[c])out+=c;else{out+='?';if(unsupported&&!unsupported.includes(original))unsupported.push(original);}}
 }
 return out.replace(/\s+/g,' ').trim();
}
function geometry(id,W,H){
 const m=Math.min(W,H)*.04,x=m,y=m,w=W-2*m,h=H-2*m,cx=W/2,cy=H/2;
 let d,safe;
 switch(id){
  case 'round': d=`M${x} ${cy}a${w/2} ${h/2} 0 1 0 ${w} 0a${w/2} ${h/2} 0 1 0 ${-w} 0Z`;safe={x:x+w*.17,y:y+h*.17,w:w*.66,h:h*.66};break;
  case 'pill': {const r=Math.min(w,h)/2;d=`M${x+r} ${y}H${x+w-r}Q${x+w} ${y} ${x+w} ${y+r}V${y+h-r}Q${x+w} ${y+h} ${x+w-r} ${y+h}H${x+r}Q${x} ${y+h} ${x} ${y+h-r}V${y+r}Q${x} ${y} ${x+r} ${y}Z`;safe={x:x+w*.15,y:y+h*.15,w:w*.70,h:h*.70};break;}
  case 'arch': {const rise=Math.min(h*.46,w*.54);d=`M${x} ${y+h}V${y+rise}C${x} ${y-rise*.14} ${x+w} ${y-rise*.14} ${x+w} ${y+rise}V${y+h}Z`;safe={x:x+w*.14,y:y+h*.28,w:w*.72,h:h*.59};break;}
  case 'shield': d=`M${x} ${y+h*.06}Q${cx} ${y-h*.02} ${x+w} ${y+h*.06}V${y+h*.5}Q${x+w*.96} ${y+h*.79} ${cx} ${y+h}Q${x+w*.04} ${y+h*.79} ${x} ${y+h*.5}Z`;safe={x:x+w*.17,y:y+h*.15,w:w*.66,h:h*.52};break;
  case 'burst': {const pts=Array.from({length:40},(_,i)=>{const a=-Math.PI/2+i*Math.PI/20,r=i%2?.90:1;return [cx+Math.cos(a)*w*.5*r,cy+Math.sin(a)*h*.5*r];});d='M'+pts.map(p=>p.map(n).join(' ')).join('L')+'Z';safe={x:x+w*.19,y:y+h*.19,w:w*.62,h:h*.62};break;}
  case 'ticket': {const r=Math.min(w,h)*.11;d=`M${x} ${y}H${x+w}V${cy-r}a${r} ${r} 0 0 0 0 ${r*2}V${y+h}H${x}V${cy+r}a${r} ${r} 0 0 0 0 ${-r*2}Z`;safe={x:x+w*.15,y:y+h*.11,w:w*.70,h:h*.78};break;}
  case 'contour': d=`M${x+w*.22} ${y+h*.03}C${x+w*.37} ${y-h*.03} ${x+w*.48} ${y+h*.09} ${x+w*.62} ${y+h*.025}C${x+w*.84} ${y-h*.03} ${x+w} ${y+h*.13} ${x+w*.965} ${y+h*.33}C${x+w*.91} ${y+h*.53} ${x+w*1.02} ${y+h*.61} ${x+w*.95} ${y+h*.79}C${x+w*.86} ${y+h*1.01} ${x+w*.70} ${y+h*.94} ${x+w*.55} ${y+h*.98}C${x+w*.39} ${y+h*1.025} ${x+w*.24} ${y+h*.89} ${x+w*.12} ${y+h*.95}C${x-w*.02} ${y+h*.78} ${x+w*.10} ${y+h*.63} ${x+w*.025} ${y+h*.47}C${x-w*.035} ${y+h*.27} ${x+w*.035} ${y+h*.08} ${x+w*.22} ${y+h*.03}Z`;safe={x:x+w*.19,y:y+h*.18,w:w*.62,h:h*.62};break;
  default: d=`M${x} ${y}H${x+w}V${y+h}H${x}Z`;safe={x:x+w*.075,y:y+h*.075,w:w*.85,h:h*.85};
 }
 return {d,safe,x,y,w,h};
}
function textMetrics(text,font){
 const G=root.HANGOVER_FONT.glyphs,tracking=font==='mono'?0:8;
 const advance=c=>c===' '?66:(font==='display'?(G[c]||G['?']).width:(font==='mono'?86:('I!|.,:;'.includes(c)?41:'MW@'.includes(c)?126:83)));
 const top=font==='display'&&Array.from(text).some(c=>G[c]&&G[c].origin==='accented-extension'&&c!=='Ç')?38:0,bottom=font==='display'&&text.includes('Ç')?36:0;
 return {width:Array.from(text).reduce((v,c)=>v+advance(c)+tracking,0)-tracking,advance,tracking,top,height:141+top+bottom};
}
function wrap(text,target,font){
 const result=[],tokens=[];let current='';
 text.split(/\s+/).forEach((word,wi)=>{const chars=Array.from(word),step=chars.length>18?12:chars.length;for(let i=0;i<chars.length;i+=step)tokens.push({text:chars.slice(i,i+step).join(''),space:wi>0&&i===0});});
 for(const token of tokens){const next=current+(current&&token.space?' ':'')+token.text;if(current&&textMetrics(next,font).width>target){result.push(current);current=token.text;}else current=next;}
 if(current.trim())result.push(current.trim());return result.filter(Boolean);
}
function fittedText(value,box,font,fill,paint='',role='title',maxLines=8){
 const text=font==='display'?characters(value):String(value||'').replace(/\s+/g,' ').trim().toUpperCase();
 return `<g data-role="${role}" data-box="${[box.x,box.y,box.w,box.h].map(n).join(' ')}" ${paint}>${root.HangoverText.fit(text,box,{font,color:fill,align:'center',maxLines,key:role,weight:font==='mono'?600:800})}</g>`;
}
function fittedMark(name,box,fill,paint=''){
 if(name==='none')return '';
 const g=root.HANGOVER_STUDIO_DATA&&root.HANGOVER_STUDIO_DATA.glyphs[name];if(!g)throw Error('Marchio canonico non disponibile: '+name);
 const scale=Math.min(box.w/g.width,box.h/g.height),x=box.x+(box.w-g.width*scale)/2,y=box.y+(box.h-g.height*scale)/2;
 return `<g data-role="mark" data-box="${[box.x,box.y,box.w,box.h].map(n).join(' ')}" transform="translate(${n(x)} ${n(y)}) scale(${n(scale)})" fill="${fill}" fill-rule="evenodd" ${paint}>${g.paths.map(a=>`<path d="${a.d}" transform="translate(${a.translate.join(' ')})"/>`).join('')}</g>`;
}
function qrInfo(s,it,W,H){
 const R=geometry(s.shape,W,H).safe,mm=it.mmw/W,safeW=R.w*mm,safeH=R.h*mm,sizeMM=Math.min(32,safeW*.94,safeH*.54),available=it.mmh>=30&&sizeMM>=25&&safeH-sizeMM>=13;
 const result={qrAvailable:available,qrReason:available?'':'Questa sagoma non lascia spazio per un QR di almeno 25 mm e per il testo.',qrSizeMM:available?n(sizeMM):0,qrModuleMM:null,qrWarning:''};
 if(s.qrEnabled&&available){if(!root.HangoverQR)throw Error('Motore QR non disponibile.');const matrix=root.HangoverQR.matrix(s.qrURL);result.qrModuleMM=n(sizeMM/(matrix.length+8));if(result.qrModuleMM<.35)result.qrWarning='QR denso: usa un URL più breve o stampa più grande; verifica una scansione di prova.';}
 return result;
}
function info(raw){const {s,it,W,H}=stateInfo(raw),unsupported=[];if(s.font==='display'){characters(s.title,unsupported);characters(s.detail,unsupported);}return {width:W,height:H,mmw:it.mmw,mmh:it.mmh,unsupported,...qrInfo(s,it,W,H)};}
function render(raw,options={}){
 const {s,it,W,H}=stateInfo(raw),uid='hgm-'+String(options.uid||'art').replace(/[^A-Za-z0-9_-]/g,'').slice(0,70),g=geometry(s.shape,W,H),R={...g.safe},qri=qrInfo(s,it,W,H);
 let qrArt='';if(s.qrEnabled&&qri.qrAvailable){const size=qri.qrSizeMM/it.mmw*W,gap=Math.min(W,H)*.025,x=R.x+(R.w-size)/2,y=R.y+R.h-size;qrArt=root.HangoverQR.group(s.qrURL,x,y,size);R.h-=size+gap;}
 const C={bg:s.bg,fg:s.fg,accent:s.accent},unit=Math.min(W,H),strength=s.effect==='flat'?.55:Math.max(0,Math.min(1,Number(s.intensity)/100));
 const seed=Number(s.seed)||1,random=rng(seed+Array.from(String(s.mood)+String(s.context)).reduce((a,c)=>a+c.charCodeAt(0),0));
 const wide=W/H>2.4,tall=H/W>1.8,box=(x,y,w,h)=>({x:R.x+x*R.w,y:R.y+y*R.h,w:w*R.w,h:h*R.h});
 let defs=`<clipPath id="${uid}-cut">${path(g.d,'#fff')}</clipPath>`;
 const stops=values=>values.map(([offset,color])=>`<stop offset="${offset}" stop-color="${mixColor(C.fg,color,strength)}"/>`).join('');
 defs+=`<linearGradient id="${uid}-chrome" x1=".12" y1="0" x2=".82" y2="1">${stops([[0,'#41576c'],[.19,'#f6feff'],[.38,'#a5c4d4'],[.46,'#ffffff'],[.48,'#34506a'],[.62,'#7298b3'],[.80,'#eafaff'],[1,'#5c798e']])}</linearGradient>`;
 defs+=`<linearGradient id="${uid}-holo" x1="0" y1=".12" x2="1" y2=".86">${stops([[0,'#7feeff'],[.18,'#f5e8ff'],[.35,'#bb87f5'],[.49,'#f9bdc6'],[.63,'#f3ffa8'],[.78,'#91ece8'],[1,'#777fce']])}</linearGradient>`;
 defs+=`<linearGradient id="${uid}-foil" x1="0" y1="0" x2=".93" y2="1">${stops([[0,'#71401b'],[.2,'#d9a656'],[.37,'#fff0ac'],[.43,'#9c692d'],[.54,'#ead28c'],[.78,'#fff5c6'],[1,'#9c6525']])}</linearGradient>`;
 defs+=`<filter id="${uid}-relief" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feDropShadow dx="${n(3.2*strength)}" dy="${n(4.6*strength)}" stdDeviation="${n(.8*strength)}" flood-color="#000" flood-opacity="${n(.8*strength)}"/><feDropShadow dx="${n(-2*strength)}" dy="${n(-2*strength)}" stdDeviation="${n(.4*strength)}" flood-color="#fff" flood-opacity="${n(.8*strength)}"/></filter>`;
 const grainSize=90,grain=Array.from({length:60},()=>`<circle cx="${n(random()*grainSize)}" cy="${n(random()*grainSize)}" r="${n(.3+random()*1.4)}" fill="${random()>.5?C.fg:'#000'}" opacity="${n(.12+random()*.22)}"/>`).join('');
 defs+=`<pattern id="${uid}-grain" width="${grainSize}" height="${grainSize}" patternUnits="userSpaceOnUse">${grain}</pattern>`;
 let ink=C.fg,paint='';
 if(['chrome','holo','foil'].includes(s.effect)){ink=`url(#${uid}-${s.effect})`;paint=`stroke="${C.fg}" stroke-width="${n(1.2*strength)}" paint-order="stroke fill"`;}
 if(s.effect==='emboss')paint=`filter="url(#${uid}-relief)"`;
 const title=(b,fill=ink)=>fittedText(s.title,b,s.font,fill,paint,'title',wide?2:tall?9:6);
 const detail=(b,fill=C.fg)=>fittedText(s.detail,b,s.font,fill,'','detail',wide?2:4);
 const mark=(b,fill=ink)=>fittedMark(s.mark,b,fill,paint);
 let decor='',art='';
 const stroke=Math.max(.8,unit*.003),motif=C.accent;
 if(s.layout==='orbit'){
  const cx=W*.5,cy=H*.5;
  for(let i=0;i<3;i++){decor+=`<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(W*(.38+i*.06))}" ry="${n(H*(.21+i*.075))}" fill="none" stroke="${motif}" stroke-width="${n(stroke*(i===1?2:1))}" opacity="${n(.45+strength*.3)}" transform="rotate(${wide?0:-19+i*8} ${cx} ${cy})"/>`;}
  const a=random()*Math.PI*2;decor+=`<circle cx="${n(cx+Math.cos(a)*W*.34)}" cy="${n(cy+Math.sin(a)*H*.32)}" r="${n(unit*.025)}" fill="${motif}"/>`;
  if(wide){art=mark(box(0,.12,.20,.76))+title(box(.26,.05,.47,.54))+detail(box(.28,.70,.68,.21));}
  else{art=title(box(.02,.01,.96,.26))+mark(box(.10,.35,.80,.34))+detail(box(.09,.83,.82,.13));}
 }else if(s.layout==='stack'){
  const footerTop=wide?g.y+g.h*.81:R.y+R.h*.80;decor=rect(g.x,footerTop,g.w,g.y+g.h-footerTop,motif)+line(R.x,R.y+R.h*.22,R.x+R.w,R.y+R.h*.22,C.fg,stroke);
  if(wide){art=mark(box(0,.04,.23,.88))+title(box(.29,.02,.45,.89))+detail(box(.80,.06,.20,.76));}
  else{art=mark(box(.05,0,.90,.15))+title(box(0,.29,1,.43))+detail(box(.06,.86,.88,.11),panelInk(C.fg,C.bg,motif));}
 }else if(s.layout==='repeat'){
  const count=wide?3:5;
  for(let i=0;i<count;i++){const b={x:g.x+g.w*.05,y:g.y+g.h*(.03+i*.19),w:g.w*.90,h:g.h*.13};decor+=`<g opacity="${n(.12+strength*.13)}">${s.mark==='none'?fittedText(s.title,b,s.font,C.fg,'','pattern'):fittedMark(s.mark,b,C.fg)}</g>`;}
  decor+=rect(R.x-R.w*.04,R.y+R.h*.27,R.w*1.08,R.h*.43,C.bg)+line(R.x,R.y+R.h*.27,R.x+R.w,R.y+R.h*.27,motif,stroke*3)+line(R.x,R.y+R.h*.70,R.x+R.w,R.y+R.h*.70,motif,stroke*3);
  if(wide){art=mark(box(0,.08,.20,.77))+title(box(.26,.31,.70,.33))+detail(box(.28,.81,.66,.13));}
  else{art=mark(box(.18,.05,.64,.12))+title(box(.03,.31,.94,.34))+detail(box(.06,.83,.88,.13));}
 }else if(s.layout==='split'){
  if(wide){decor=rect(R.x,R.y,R.w*.28,R.h,C.fg);art=mark(box(.025,.14,.23,.72),C.bg)+title(box(.34,.06,.64,.54))+detail(box(.34,.76,.64,.18));}
  else{decor=rect(R.x,R.y,R.w,R.h*.35,C.fg)+line(R.x,R.y+R.h*.39,R.x+R.w,R.y+R.h*.39,motif,stroke*2);art=mark(box(.08,.05,.84,.24),C.bg)+title(box(.02,.45,.96,.33))+detail(box(.05,.88,.90,.10));}
 }else if(s.layout==='frame'){
  const inset=unit*.018;decor=rect(R.x-inset,R.y-inset,R.w+2*inset,R.h+2*inset,'none',`stroke="${motif}" stroke-width="${n(stroke*2)}"`);
  decor+=rect(g.x+g.w*.055,g.y+g.h*.055,g.w*.89,g.h*.89,'none',`stroke="${C.fg}" stroke-width="${n(stroke*.6)}" opacity=".45"`);
  const corners=[[R.x,R.y],[R.x+R.w,R.y],[R.x,R.y+R.h],[R.x+R.w,R.y+R.h]];corners.forEach(([x,y])=>{decor+=`<circle cx="${n(x)}" cy="${n(y)}" r="${n(stroke*2.2)}" fill="${motif}"/>`;});
  if(wide){art=title(box(.04,.13,.53,.66))+mark(box(.64,.05,.31,.51))+detail(box(.62,.74,.34,.14));}
  else{art=mark(box(.12,.02,.76,.15))+title(box(.05,.31,.90,.40))+detail(box(.08,.86,.84,.11));}
 }else{
  const sx=R.x+R.w*.77;decor=line(sx,R.y,sx,R.y+R.h,C.fg,stroke,`stroke-dasharray="${n(unit*.011)} ${n(unit*.013)}" opacity=".65"`);
  for(let i=0;i<8;i++)decor+=line(R.x+R.w*.84,R.y+R.h*(.11+i*.105),R.x+R.w*(i%3===0?.98:.94),R.y+R.h*(.11+i*.105),motif,stroke*(i%3===0?3:1));
  if(wide){art=title(box(.01,.07,.51,.57))+detail(box(.02,.79,.67,.13))+mark(box(.56,.09,.17,.54));}
  else{art=mark(box(.02,.02,.67,.17))+title(box(.01,.34,.69,.36))+detail(box(.015,.86,.68,.11));}
 }
 let surface='';
 if(s.effect==='grain')surface=rect(0,0,W,H,`url(#${uid}-grain)`,`opacity="${n(.9*strength)}"`);
 if(s.effect==='holo'){
  surface=rect(0,0,W,H,`url(#${uid}-holo)`,`opacity="${n(.20*strength)}"`);
  for(let i=0;i<18;i++)surface+=line(-W*.4+i*W*.10,H,W*.25+i*W*.10,0,C.fg,Math.max(.6,unit*.0015),`opacity="${n(.13*strength)}"`);
 }
 if(s.effect==='foil')surface=rect(0,0,W,H,`url(#${uid}-grain)`,`opacity="${n(.44*strength)}"`)+path(`M0 ${H*.1}L${W} ${H*.7}V${H*.79}L0 ${H*.15}Z`,'#fff',`opacity="${n(.14*strength)}"`);
 if(s.effect==='chrome')surface=path(`M0 ${H*.12}L${W} ${H*.38}V${H*.42}L0 ${H*.16}Z`,'#fff',`opacity="${n(.12*strength)}"`);
 if(s.mark==='none'&&!wide&&s.layout!=='split')art=title(box(s.layout==='ticket'?.01:.04,.13,s.layout==='ticket'?.69:.92,.55))+detail(box(s.layout==='ticket'?.015:.07,.86,s.layout==='ticket'?.68:.86,.11),s.layout==='stack'?panelInk(C.fg,C.bg,motif):C.fg);
 const body=`<g clip-path="url(#${uid}-cut)">${path(g.d,C.bg)}<g data-layer="decoration">${decor}${surface}</g><!--content:start--><g data-layer="content">${art}</g><!--content:end--><g data-layer="qr">${qrArt}</g></g>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${it.mmw}mm" height="${it.mmh}mm" viewBox="0 0 ${W} ${n(H)}" role="img" aria-label="${esc(it.name+' · '+s.title)}" data-mm-width="${it.mmw}" data-mm-height="${it.mmh}" data-shape="${esc(s.shape)}" data-layout="${esc(s.layout)}" data-effect="${esc(s.effect)}"><title>${esc(s.title||it.name)}</title><defs>${defs}</defs>${body}</svg>`;
}
root.HangoverMakerEngine={render,info};
})(typeof window!=='undefined'?window:globalThis);

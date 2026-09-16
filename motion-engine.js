/* HANGOVER Motion Studio — deterministic, resolution-independent canvas renderer.
   Original vector contours are never reshaped. No external dependencies. */
window.createHangoverStudio = function createHangoverStudio(data) {
 'use strict';
 const paths={}, pictures=new Map();
 const renderers=Object.assign({},...['createHangoverEditorial','createHangoverSocial','createHangoverOverlays'].map(name=>typeof window[name]==='function'?window[name]():{}));
 for(const [name,g] of Object.entries(data.glyphs)){
  const p=new Path2D();
  for(const part of g.paths){const [x=0,y=0]=part.translate;p.addPath(new Path2D(part.d),new DOMMatrix().translate(x,y));}
  paths[name]=p;
 }
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 const ease=v=>1-Math.pow(1-clamp(v),3);
 const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
 const phase=(v)=>((v%1)+1)%1;
 function load(src){
  if(pictures.has(src))return pictures.get(src).promise;
  const entry={image:null,promise:null};
  entry.promise=new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{entry.image=image;resolve(image);};image.onerror=()=>{pictures.delete(src);reject(new Error('Immagine non leggibile'));};image.src=src;});
  pictures.set(src,entry);return entry.promise;
 }
 const fontReady=typeof FontFace==='function'&&document.fonts&&data.displayFont?new FontFace('HANGOVER Display','url('+data.displayFont+')').load().then(font=>document.fonts.add(font)):Promise.resolve();
 const ready=Promise.all([...data.photos.map(p=>load(p.src)),fontReady]);
 const grain=document.createElement('canvas');grain.width=grain.height=160;
 const gc=grain.getContext('2d'),noise=gc.createImageData(160,160);let seed=9216;
 for(let i=0;i<noise.data.length;i+=4){seed=(seed*1664525+1013904223)>>>0;const n=seed>>>24;noise.data[i]=noise.data[i+1]=noise.data[i+2]=n;noise.data[i+3]=32;}
 gc.putImageData(noise,0,0);
 function dimensions(format,short=1080){return format==='9:16'?[short,Math.round(short*16/9)]:format==='1:1'?[short,short]:[Math.round(short*16/9),short];}
 function render(ctx,width,height,time,cfg){
  const W=1000,H=1000*height/width,tall=H>1150,square=H>850&&!tall,p=data.palettes[cfg.palette]||data.palettes.ice;
  const duration=Number(cfg.duration)||10, q=phase(time/duration), cycles=Number(cfg.speed)===.75?1:Number(cfg.speed)===1.25?3:2, theta=q*Math.PI*2*cycles;
  const title=(cfg.title||'ALL NIGHT').toUpperCase(),sub=(cfg.subtitle||'HANGOVER / AFTER DARK').toUpperCase();
  const chosen=data.photos.find(x=>x.id===cfg.photo)||data.photos[0],src=cfg.customImage||chosen.src;
  const image=pictures.get(src)?.image;
  const transparent=Boolean(data.presets.find(x=>x.id===cfg.preset)?.transparent);
  ctx.save();ctx.setTransform(width/W,0,0,height/H,0,0);ctx.clearRect(0,0,W,H);
  const rect=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h);};
  const line=(x,y,x2,y2,color=p.fg,width=1)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();};
  const circle=(x,y,r,color,stroke=false,width=2)=>{ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,Math.PI*2);ctx[stroke?'strokeStyle':'fillStyle']=color;if(stroke){ctx.lineWidth=width;ctx.stroke();}else ctx.fill();};
  function mark(name,x,y,w,color=p.fg){const g=data.glyphs[name];ctx.save();ctx.translate(x,y);ctx.scale(w/g.width,w/g.width);ctx.fillStyle=color;ctx.fill(paths[name],'evenodd');ctx.restore();return w*g.height/g.width;}
  function text(s,x,y,size=22,color=p.fg,max=900,align='left',weight=400,font='monospace'){
   ctx.save();ctx.textAlign=align;ctx.textBaseline='top';ctx.font=`${weight} ${size}px ${font}`;
   if(ctx.measureText(s).width>max){size*=max/ctx.measureText(s).width;ctx.font=`${weight} ${size}px ${font}`;}
   ctx.fillStyle=color;ctx.fillText(s,x,y);ctx.restore();return size;
  }
  function headline(s,x,y,w,size=100,color=p.fg){return text(s,x,y,size,color,w,'left',800,'Arial, sans-serif');}
  function photo(img,x,y,w,h,zoom=1){if(!img){rect(x,y,w,h,p.muted);return;}ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const k=Math.max(w/img.width,h/img.height)*zoom,iw=img.width*k,ih=img.height*k;ctx.drawImage(img,x+(w-iw)/2,y+(h-ih)/2,iw,ih);ctx.restore();}
  function rules(label,accent=p.fg){text('HANGOVER / '+label,45,35,17,accent,730);text('MOTION SERIES',955,H-39,14,accent,400,'right');}
  function ribbon(y,w=1050,color=p.fg,direction=1){const h=w*141/1087,x=-phase(q*cycles*direction)*(w+24);for(let k=-1;k<3;k++)mark('hangover',x+k*(w+24),y,w,color);return h;}
  function tintedPhoto(x,y,w,h){photo(image,x,y,w,h,1.02+.02*Math.sin(theta));}
  if(!transparent)rect(0,0,W,H,p.bg);
  if(renderers[cfg.preset])renderers[cfg.preset]({ctx,W,H,p,cfg,time,q,theta,tall,square,title,sub,image,mark,text,headline,photo,line,rect,circle,ribbon,tintedPhoto,clamp,ease,smooth,phase,data});
  else switch(cfg.preset){
   case 'nastro':{
    const a=tall?185:square?145:110,y=tall?H*.24:square?H*.18:55,ribbonWidth=tall?1250:square?1060:770;
    ctx.save();ctx.translate(W/2,H/2);ctx.rotate(-.09+Math.sin(theta)*.012);ctx.translate(-W/2,-H/2);
    rect(-W,y-18,W*3,a*3+70,p.fg);
    ribbon(y,ribbonWidth,p.bg,1);ribbon(y+a,ribbonWidth,p.bg,-1);ribbon(y+a*2,ribbonWidth,p.bg,1);ctx.restore();
    rect(0,H-(tall?210:square?185:145),W,tall?210:square?185:145,p.bg);
    mark('h',45,tall||square?95:22,tall?135:square?65:32,p.accent);headline(title,45,H-(tall||square?150:126),900,tall?92:square?58:48,p.fg);text(sub,47,H-56,16,p.fg,875);break;
   }
   case 'shutter':{
    const py=tall?H*.21:0,ph=tall?H*.63:H;
    for(let i=0;i<6;i++){const v=(Math.sin(theta-i*.24)+1)/2,visible=.12+v*.88;ctx.save();ctx.beginPath();ctx.rect(i*W/6,py+ph*(1-visible)*.5,W/6+1,ph*visible);ctx.clip();photo(image,0,py,W,ph,1.08);ctx.restore();}
    rect(38,H*.47-15,924,160,p.bg);mark('hangover',52,H*.47,896,p.fg);
    if(tall)headline(title,45,H*.1,900,108);else text(title,45,35,22,p.fg,800);
    rect(35,H-96,930,61,p.bg);text(sub,50,H-75,21,p.fg,900);break;
   }
   case 'orbita':{
    const cy=tall?H*.51:H*.52,r=Math.min(W*.35,H*(tall?.34:square?.25:.22)),centerWidth=tall?240:square?200:120,disc=tall||square?64:45;
    for(let i=0;i<3;i++){ctx.save();ctx.translate(500,cy);ctx.scale(1,.72+i*.18);circle(0,0,r+i*26,p.muted,true,1.4);ctx.restore();}
    mark('h',500-centerWidth/2,cy-centerWidth*141/131/2,centerWidth,p.fg);
    ['h','hg','hgr'].forEach((name,i)=>{const a=theta+i*Math.PI*2/3,x=500+Math.cos(a)*r,y=cy+Math.sin(a)*r*.78;circle(x,y,disc,i===1?p.accent:p.fg);const g=data.glyphs[name],mw=disc*1.4,mhh=mw*g.height/g.width;mark(name,x-mw/2,y-mhh/2,mw,p.bg);});
    mark('hangover',50,tall?H*.13:square?70:35,tall||square?900:700,p.fg);headline(title,45,H-(tall||square?156:118),900,tall?86:square?54:45);text(sub,45,H-56,18,p.fg,900);break;
   }
   case 'segnale':{
    const cx=tall?700:760,cy=tall?H*.57:H*.54,maxR=Math.max(W,H)*.83;
    for(let i=0;i<12;i++){const r=(phase(i/12+q*cycles))*maxR;circle(cx,cy,r,i%4===0?p.accent:p.fg,true,i%4===0?7:2);}
    const mw=tall||square?720:480,my=H*(tall||square?.36:.29),mh=mw*141/543;
    rect(34,my-15,930,mh*2+44,p.bg);mark('hang',55,my,mw,p.fg);mark('over',945-mw,my+mh+14,mw,p.fg);
    text(title,45,78,34,p.fg,890);text(sub,45,H-68,22,p.fg,900);break;
   }
   case 'contact':{
    const cy=tall?H*.51:H*.52,cw=tall?530:square?500:370,ch=cw*1.25;
    [0,1,2].forEach(i=>{ctx.save();ctx.translate(500+(i-1)*(tall?160:260),cy+(i===1?-30:45));ctx.rotate((i-1)*.15+Math.sin(theta+i)*.025);rect(-cw/2-13,-ch/2-13,cw+26,ch+62,p.fg);const im=i===1?image:pictures.get(data.photos[(i+2)%4].src)?.image;photo(im,-cw/2,-ch/2,cw,ch,1.01);text('H / '+String(i+1).padStart(2,'0'),-cw/2,ch/2+15,17,p.bg,cw);ctx.restore();});
    rect(0,0,W,100,p.bg);mark('hangover',42,28,550,p.fg);text('CONTACT SHEET',955,48,17,p.fg,340,'right');
    rect(0,H-150,W,150,p.bg);headline(title,42,H-133,920,tall?90:62);text(sub,45,H-49,16,p.fg,900);break;
   }
   case 'annuncio':{
    const stage=Math.min(2,Math.floor(q*3)),v=phase(q*3),lift=(1-ease(v*5))*65;
    for(let i=0;i<3;i++){rect(45+i*307,34,295,4,p.muted);rect(45+i*307,34,295*(i<stage?1:i===stage?v:0),4,p.fg);}
    if(stage===0){if(H<850){mark('hgr',60,H*.3+lift,400,p.fg);headline(title,520,H*.35+lift,420,90);}else{mark('hgr',60,H*.22+lift,880,p.fg);headline(title,60,H*.55+lift,880,tall?150:80);}text(sub,60,H-93,21,p.fg,880);}
    if(stage===1){photo(image,0,90,W,H-180,1.025+v*.03);rect(40,H*.66,920,H*.19,p.bg);headline(title,62,H*.675+lift,876,tall?120:64);text(sub,65,H*.79,20,p.fg,870);}
    if(stage===2){mark('h',60,H*.14+lift,tall?300:130,p.fg);const lines=['SEE YOU','ON THE','DANCEFLOOR.'];lines.forEach((s,i)=>headline(s,60,H*.48+i*(tall?125:70)+lift,880,tall?126:70));text(sub,60,H-90,21,p.fg,880);}
    break;
   }
   case 'lineup':{
    mark('hangover',50,70,900,p.fg);text('LINE-UP / '+title,50,tall?230:210,24,p.fg,900);
    const names=(cfg.lineup||'[ARTISTA 01]\n[ARTISTA 02]\n[ARTISTA 03]').split('\n').filter(Boolean).slice(0,4),top=tall?H*.32:square?H*.39:H*.44,row=Math.min(tall?200:square?125:64,(H-100-top)/names.length);
    names.forEach((name,i)=>{const shift=22*Math.sin(theta-i*.5),y=top+i*row;line(50,y-20,950,y-20,p.muted);if(i===Math.floor(q*names.length)){rect(42,y-9,916,row-20,p.accent);}
     headline(name.toUpperCase(),62+shift,y+8,864-shift,Math.min(tall?118:square?88:49,row*.72),i===Math.floor(q*names.length)?p.bg:p.fg);});
    text(sub,50,H-60,20,p.fg,900);break;
   }
   case 'recap':{
    const ix=Math.min(3,Math.floor(q*4)),v=phase(q*4),im=cfg.customImage?image:(ix===0?image:pictures.get(data.photos[(ix+1)%4].src)?.image);
    photo(im,0,0,W,H,1.04+.055*v);rect(0,0,W,tall?245:140,p.bg);mark('hangover',42,36,916,p.fg);text(String(ix+1).padStart(2,'0')+' / 04',45,tall?185:112,18,p.fg,900);
    rect(0,H-(tall?330:145),W,tall?330:145,p.bg);headline(title,45,H-(tall?285:125),910,tall?145:68);text(sub,45,H-67,22,p.fg,900);
    rect(0,H-7,W*q,7,p.accent);break;
   }
   case 'intro':{
    const start=ease(q/.22),out=1-smooth((q-.82)/.18),reveal=start*out,ww=880,yy=H*.44,hh=ww*141/1087;
    ctx.save();ctx.beginPath();ctx.rect(60,yy-8,ww*reveal,hh+16);ctx.clip();const grad=ctx.createLinearGradient(60,yy,940,yy+hh);grad.addColorStop(0,p.muted);grad.addColorStop(.5,p.fg);grad.addColorStop(1,p.fg);mark('hangover',60,yy,ww,grad);ctx.restore();
    line(60,yy-26,60+ww*reveal,yy-26,p.accent,4);line(940-ww*reveal,yy+hh+26,940,yy+hh+26,p.accent,4);
    ctx.save();ctx.globalAlpha=reveal;text(title,500,yy+hh+80+(1-reveal)*25,34,p.fg,900,'center');ctx.restore();
    mark('h',45,40,45,p.fg);text(sub,45,H-57,18,p.fg,900);break;
   }
   case 'lowerthird':{
    tintedPhoto(0,0,W,H);const shade=ctx.createLinearGradient(0,H*.25,0,H);shade.addColorStop(0,'#00000000');shade.addColorStop(1,'#000000c0');rect(0,0,W,H,shade);
    const enter=ease(q/.15)*(1-smooth((q-.85)/.15)),bh=tall?245:145,bw=870,x=45-(1-enter)*960,y=H-(tall?425:bh+55);
    rect(x,y,bw,bh,p.bg);rect(x,y,8,bh,p.accent);mark('h',x+27,y+29,tall?100:68,p.fg);
    headline(title,x+(tall?150:125),y+25,bw-(tall?180:155),tall?85:65,p.fg);text(sub,x+(tall?153:127),y+bh-42,18,p.fg,bw-185);
    mark('h',W-92,35,50,p.fg);break;
   }
   case 'outro':{
    const border=28+Math.sin(theta)*8;ctx.strokeStyle=p.fg;ctx.lineWidth=2;ctx.strokeRect(border,border,W-border*2,H-border*2);
    const ww=tall?650:400,hh=ww*141/421,yy=H*.29+Math.sin(theta)*8;
    mark('hgr',(W-ww)/2,yy,ww,p.fg);line(80,yy+hh+45,920,yy+hh+45,p.accent,3);
    text(title,500,yy+hh+80,tall?100:70,p.fg,850,'center',800,'Arial, sans-serif');text(sub,500,H-110,20,p.fg,850,'center');
    text('SEE YOU ON THE DANCEFLOOR',500,75,17,p.fg,850,'center');break;
   }
   default:{
    const yy=H*.4,ww=920,hh=ww*141/1087;
    for(let i=0;i<9;i++){const x=phase(i/9+q*cycles/9)*1500-250;ctx.save();ctx.translate(x,H/2);ctx.rotate(.3);rect(-25,-H,45,H*2,p.muted);ctx.restore();}
    rect(0,0,W,H,p.bg+'ce');
    const metal=ctx.createLinearGradient(0,0,W,0),shift=(Math.sin(theta)+1)/2;
    metal.addColorStop(0,p.muted);metal.addColorStop(clamp(shift*.7,.01,.7),p.fg);metal.addColorStop(clamp(shift*.7+.16,.17,.91),'#f1f4ed');metal.addColorStop(1,p.muted);
    ctx.save();ctx.globalAlpha=.12;mark('hangover',40,yy-hh-16,ww,p.fg);mark('hangover',40,yy+hh+16,ww,p.fg);ctx.restore();mark('hangover',40,yy,ww,metal);
    text(title,45,H-112,32,p.fg,900);text(sub,45,H-54,17,p.fg,900);rules('PRISMA');
   }
  }
  // A selected surface also reaches typographic layouts; overlay pixels stay transparent.
  if(chosen.kind==='surface'||cfg.customImage){ctx.save();ctx.globalCompositeOperation=transparent?'source-atop':'soft-light';ctx.globalAlpha=transparent?.28:.22;photo(image,0,0,W,H,1.01);ctx.restore();}
  if(!transparent&&cfg.effects?.includes('registration')){ctx.save();ctx.globalAlpha=.11;mark('hangover',45+Math.sin(theta)*5,H-27,910,p.accent);ctx.restore();}
  ctx.save();if(transparent)ctx.globalCompositeOperation='source-atop';
  if(cfg.effects?.includes('light')){const sweep=phase(q*cycles)*2000-500,g=ctx.createLinearGradient(sweep-220,0,sweep+220,H);g.addColorStop(0,'#ffffff00');g.addColorStop(.5,'#ffffff23');g.addColorStop(1,'#ffffff00');rect(0,0,W,H,g);}
  if(cfg.effects?.includes('grain')){ctx.save();ctx.globalAlpha=.48;ctx.fillStyle=ctx.createPattern(grain,'repeat');ctx.fillRect(0,0,W,H);ctx.restore();}
  ctx.restore();
  ctx.restore();
 }
 function preview(ctx,width,height,time,cfg,options={}){
  render(ctx,width,height,time,cfg);
  if(data.presets.find(x=>x.id===cfg.preset)?.transparent){
   ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='destination-over';
   const chosen=data.photos.find(x=>x.id===cfg.photo)||data.photos[0],image=pictures.get(cfg.customImage||chosen.src)?.image;
   if(options.background!=='checker'&&image){const k=Math.max(width/image.width,height/image.height);ctx.drawImage(image,(width-image.width*k)/2,(height-image.height*k)/2,image.width*k,image.height*k);}
   else{for(let y=0;y<height;y+=24)for(let x=0;x<width;x+=24){ctx.fillStyle=(Math.floor(x/24)+Math.floor(y/24))%2?'#273238':'#39474e';ctx.fillRect(x,y,24,24);}}
   ctx.restore();
  }
  if(options.guides&&cfg.format==='9:16'){
   ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#080c1466';ctx.beginPath();ctx.rect(0,0,width,height);ctx.rect(width*.08,height*.15,width*.76,height*.57);ctx.fill('evenodd');ctx.strokeStyle='#e5ff79';ctx.lineWidth=1;ctx.setLineDash([5,5]);ctx.strokeRect(width*.08,height*.15,width*.76,height*.57);ctx.restore();
  }
 }
 return {render,preview,load,ready,dimensions};
};

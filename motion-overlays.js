/* HANGOVER — transparent video overlays. Canonical marks are drawn by env.mark.
   The factory is self-contained so the portable studio can serialize it. */
window.createHangoverOverlays = function createHangoverOverlays() {
 'use strict';
 const TAU=Math.PI*2;
 const loop=e=>Number.isFinite(e.theta)?e.theta:(Number(e.q)||0)*TAU;
 const copy=value=>String(value??'').trim().toUpperCase().replace(/\s+/g,' ');
 function lines(ctx,value,width){
  const result=[];let current='';
  for(const word of copy(value).split(' ')){
   if(!word)continue;
   if(ctx.measureText(current?current+' '+word:word).width<=width){current=current?current+' '+word:word;continue;}
   if(current){result.push(current);current='';}
   for(const letter of Array.from(word)){
    if(current&&ctx.measureText(current+letter).width>width){result.push(current);current='';}
    current+=letter;
   }
  }
  if(current)result.push(current);return result;
 }
 // Wrap full 42/72-character fields; font fitting never stretches the contours.
 function block(e,value,x,y,width,size,maxLines,color=e.p.fg,font='Arial, sans-serif',weight=600){
  const {ctx,text}=e;ctx.save();let rows=[],fitted=size;
  do{ctx.font=weight+' '+fitted+'px '+font;rows=lines(ctx,value,width);if(rows.length<=maxLines)break;fitted-=1;}while(fitted>8);
  ctx.restore();rows.forEach((row,i)=>text(row,x,y+i*fitted*1.2,fitted,color,width,'left',weight,font));
  return rows.length*fitted*1.2;
 }
 function panel(e,x,y,w,h,color,alpha=.94){e.ctx.save();e.ctx.globalAlpha*=alpha;e.rect(x,y,w,h,color);e.ctx.restore();}
 function shadow(e,draw){e.ctx.save();e.ctx.shadowColor='#00000066';e.ctx.shadowBlur=4;e.ctx.shadowOffsetY=1;draw();e.ctx.restore();}
 function corner(e,x,y,dx,dy,length,color,width=2){e.line(x,y,x+dx*length,y,color,width);e.line(x,y,x,y+dy*length,color,width);}
 return {
  'overlay-signature':function(e){
   const {ctx,H,p,mark,line,circle,title,sub}=e,a=loop(e),x=88,y=H*.17;
   shadow(e,()=>{mark('h',x,y+2,60,p.fg);mark('hangover',x+83,y+18,238,p.fg);});
   line(x,y+84,x+321,y+84,p.fg,1.5);
   const glint=x+160+Math.sin(a)*150;line(glint-10,y+84,glint+10,y+84,p.accent,3);
   block(e,title,x,y+104,332,26,2,p.fg);
   block(e,sub,x,y+174,332,17,3,p.fg,'monospace',400);
   ctx.save();ctx.globalAlpha*=.78+.16*Math.sin(a);circle(x+336,y+34,4,p.accent);ctx.restore();
  },
  'overlay-title-tag':function(e){
   const {ctx,H,p,mark,rect,line,title,sub}=e,a=loop(e),x=88,y=H*.595+Math.sin(a)*3,w=704,h=208;
   panel(e,x,y,w,h,p.bg);rect(x,y,6,h,p.accent);
   mark('h',x+24,y+27,58,p.fg);line(x+106,y+25,x+106,y+h-25,p.fg,1);
   block(e,title,x+127,y+27,550,40,2,p.fg);
   block(e,sub,x+129,y+133,544,20,2,p.fg,'monospace',400);
   ctx.save();ctx.beginPath();ctx.rect(x+6,y,w-6,3);ctx.clip();rect(x+7+(Math.sin(a)+1)*290,y,116,3,p.fg);ctx.restore();
  },
  'overlay-viewfinder':function(e){
   const {ctx,H,p,mark,line,title,sub}=e,a=loop(e),x=68,right=890,top=H*.164,bottom=H*.711;
   const length=46+5*Math.sin(a);
   ctx.save();ctx.globalAlpha*=.88;
   corner(e,x,top,1,1,length,p.fg);corner(e,right,top,-1,1,length,p.fg);
   corner(e,x,bottom,1,-1,length,p.fg);corner(e,right,bottom,-1,-1,length,p.fg);
   [0,1,2].forEach(i=>{const yy=H*.42+i*12;line(x-5,yy,x+5,yy,p.fg,1);line(right-5,yy,right+5,yy,p.fg,1);});
   ctx.restore();
   block(e,title,90,top+26,480,31,2,p.fg);
   mark('hangover',658,top+31,182,p.fg);
   block(e,sub,90,bottom-84,652,21,2,p.fg,'monospace',400);
   const tx=112+(Math.sin(a)+1)*327;line(tx,top,tx+70,top,p.accent,3);
  },
  'overlay-ticker':function(e){
   const {ctx,H,p,mark,line,rect,text,title,sub}=e,a=loop(e),x=80,y=H*.678,w=760,h=59;
   block(e,title,x,y-63,w,34,1,p.fg);
   panel(e,x,y,w,h,p.bg,.92);line(x,y,x+w,y,p.accent,2);
   mark('h',x+13,y+10,35,p.fg);line(x+65,y+12,x+65,y+h-12,p.fg,1);
   const content=copy(sub)+'   /   ',font='monospace',size=21;
   ctx.save();ctx.font='400 '+size+'px '+font;const period=Math.max(280,ctx.measureText(content).width+64);
   ctx.beginPath();ctx.rect(x+84,y+7,w-102,h-14);ctx.clip();
   const progress=(((a/TAU)%1)+1)%1,start=x+84-progress*period;
   for(let i=-1;i<4;i++)text(content,start+i*period,y+18,size,p.fg,10000,'left',400,font);
   ctx.restore();rect(x+w-4,y+17,4,25,p.accent);
  },
  'overlay-orbit':function(e){
   const {ctx,H,p,mark,circle,title,sub}=e,a=loop(e),cx=742,cy=H*.205,r=77;
   ctx.save();ctx.globalAlpha*=.82;circle(cx,cy,r,p.fg,true,1.5);circle(cx,cy,r-8,p.fg,true,.7);ctx.restore();
   panel(e,cx-57,cy-30,114,60,p.bg,.88);const g=e.data.glyphs.hg,mw=94;
   mark('hg',cx-mw/2,cy-mw*g.height/g.width/2,mw,p.fg);
   const angle=a-.6;circle(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r,7,p.accent);
   circle(cx+Math.cos(angle+Math.PI)*r,cy+Math.sin(angle+Math.PI)*r,3,p.fg);
   block(e,title,480,cy+110,344,29,2,p.fg);
   block(e,sub,480,cy+192,344,17,3,p.fg,'monospace',400);
  },
  'overlay-timecard':function(e){
   const {H,p,mark,line,text,rect,title,sub}=e,a=loop(e),x=88,y=H*.55+Math.sin(a)*2,w=650,h=258;
   panel(e,x,y,w,h,p.bg,.95);rect(x,y,5,h,p.accent);
   mark('hangover',x+23,y+25,263,p.fg);
   const seconds=Math.max(0,Math.floor(Number(e.time)||0)),stamp=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
   text(stamp,x+w-24,y+28,23,p.fg,116,'right',400,'monospace');
   line(x+23,y+81,x+w-24,y+81,p.fg,1);
   block(e,title,x+23,y+101,w-49,38,2,p.fg);
   block(e,sub,x+23,y+193,w-49,20,2,p.fg,'monospace',400);
   line(x+23,y+h-11,x+23+(w-47)*(.5+.46*Math.sin(a)),y+h-11,p.accent,2);
  }
 };
};

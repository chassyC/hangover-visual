/* The same normalized transforms drive the preview and every export size. */
window.createHangoverLayers = function createHangoverLayers() {
 'use strict';
 let context,width,height,config,counters,items,pending;
 const clean = value => {
  const result={};if(value==null)return result;
  if(typeof value!=='object'||Array.isArray(value)||Object.keys(value).length>800)throw Error('Posizioni del preset non valide.');
  for(const [id,v] of Object.entries(value)){
   if(!/^[a-z0-9:_-]{1,120}$/i.test(id)||!v||typeof v!=='object')throw Error('Elemento del preset non valido.');
   const o={};for(const [k,min,max] of [['dx',-3,3],['dy',-3,3],['scale',.1,4],['rotation',-180,180]])if(v[k]!=null){if(typeof v[k]!=='number'||!Number.isFinite(v[k])||v[k]<min||v[k]>max)throw Error('Posizione fuori intervallo.');o[k]=v[k];}
   if(v.hidden!=null){if(typeof v.hidden!=='boolean')throw Error('Visibilità non valida.');o.hidden=v.hidden;}result[id]=o;
  }return result;
 };
 function begin(ctx,w,h,cfg){context=ctx;width=w;height=h;config=cfg;counters={};items=[];pending=[];}
 function bounds(m,b){const points=[[b.x,b.y],[b.x+b.w,b.y],[b.x,b.y+b.h],[b.x+b.w,b.y+b.h]].map(([x,y])=>({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f}));const xs=points.map(p=>p.x),ys=points.map(p=>p.y);return {x:Math.min(...xs)/width,y:Math.min(...ys)/height,w:(Math.max(...xs)-Math.min(...xs))/width,h:(Math.max(...ys)-Math.min(...ys))/height};}
 function matrix(item){const o=config.layout?.[item.id]||{},b=item.base,cx=(b.x+b.w/2)*width,cy=(b.y+b.h/2)*height;return new DOMMatrix().translate((o.dx||0)*width,(o.dy||0)*height).translate(cx,cy).rotate(o.rotation||0).scale(o.scale||1).translate(-cx,-cy);}
 function refresh(item){const b=item.base;Object.assign(item,bounds(matrix(item),{x:b.x*width,y:b.y*height,w:b.w*width,h:b.h*height}));return item;}
 function draw(kind,tag,name,box,paint){
  const key=kind+':'+tag,group=kind==='text'&&(tag==='title'||tag==='subtitle'),index=group?0:counters[key]||0;counters[key]=index+1;
  const id=(config.content==='wordmark'?'isolated':config.preset)+':'+key+':'+index,o=config.layout?.[id]||{},m=context.getTransform(),base=bounds(m,box);
  let item=group&&items.find(i=>i.id===id);
  if(item){const b=item.base,x=Math.min(b.x,base.x),y=Math.min(b.y,base.y);item.base={x,y,w:Math.max(b.x+b.w,base.x+base.w)-x,h:Math.max(b.y+b.h,base.y+base.h)-y};}
  else{item={id,kind,name:name+(index?' '+(index+1):''),base,hidden:!!o.hidden,scale:o.scale||1,rotation:o.rotation||0};items.push(item);}
  if(item.hidden)return;
  if(!o.dx&&!o.dy&&!o.rotation&&(!o.scale||o.scale===1)){paint();return;}
  const state={};for(const key of ['globalAlpha','globalCompositeOperation','shadowBlur','shadowColor','shadowOffsetX','shadowOffsetY','filter','lineCap','lineJoin'])state[key]=context[key];
  pending.push(()=>{context.save();context.setTransform(matrix(item).multiply(m));Object.assign(context,state);paint();context.restore();});
 }
 function flush(){for(const paint of pending)paint();pending=[];}
 function all(){return items.map(x=>({...refresh(x),base:{...x.base}}));}
 function hit(x,y){const matches=all().reverse().filter(i=>!i.hidden&&x>=i.x-.012&&x<=i.x+i.w+.012&&y>=i.y-.012&&y<=i.y+i.h+.012);return matches.find(i=>i.kind==='mark'||i.kind==='text')||matches[0]||null;}
 return {begin,draw,flush,all,hit,validate:clean};
};

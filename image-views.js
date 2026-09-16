'use strict';
// A viewport presents one panel of an unchanged source board.
(() => {
 const ns='http://www.w3.org/2000/svg';let sequence=0;
 const node=(tag,attrs)=>{const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el;};
 function create(item,source=item.src){
  if(!item.viewport){const img=new Image();img.src=source;img.alt=item.title;img.loading='lazy';img.decoding='async';img.draggable=false;return img;}
  const {x,y,width,height,sourceWidth,sourceHeight}=item.viewport,id='panel-clip-'+(++sequence);
  const svg=node('svg',{viewBox:[x,y,width,height].join(' '),width,height,role:'img','aria-label':item.title,focusable:'false',preserveAspectRatio:'xMidYMid meet'});
  svg.classList.add('panel-view');
  const defs=node('defs',{}),clip=node('clipPath',{id,clipPathUnits:'userSpaceOnUse'});
  clip.append(node('rect',{x,y,width,height}));defs.append(clip);
  svg.append(defs,node('image',{href:source,width:sourceWidth,height:sourceHeight,'clip-path':'url(#'+id+')'}));
  return svg;
 }
 function setSource(view,source){if(view.tagName.toLowerCase()==='svg')view.querySelector('image').setAttribute('href',source);else view.src=source;}
 window.HangoverImage={create,setSource};
})();

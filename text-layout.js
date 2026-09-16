/* HANGOVER text layout. No DOM dependency; canonical display artwork stays as paths.
 * size: nominal font-size cap in SVG units; default Infinity. maxLines: default 2.
 * tracking: SVG units at size (or at 100 when size is omitted), scaled with type.
 * Manual breaks over maxLines become spaces, reported by manualBreaksCollapsed.
 * Node uses conservative system-font metrics. Browser canvas is used when present.
 */
(function(root){
'use strict';
const DISPLAY_EM=141, SPACE=66, GAP=.18;
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const num=value=>String(Number(Number(value).toPrecision(13)));
const glyphCache=new WeakMap();
let canvasContext;
function clean(value){
 return Array.from(String(value==null?'':value).normalize('NFC').replace(/\r\n?/g,'\n').replace(/[\u2028\u2029]/g,'\n'))
  .map(c=>{const p=c.codePointAt(0);return (p<32&&!/\s/u.test(c))||p===0xfffe||p===0xffff||(p>=0xd800&&p<=0xdfff)?'\ufffd':c;})
  .join('').replace(/[^\S\n]+/gu,' ').trim();
}
function segments(text){
 if(typeof Intl!=='undefined'&&Intl.Segmenter){return Array.from(new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(text),p=>p.segment);}
 // Array.from protects surrogate pairs. Keep combining marks and joined emoji together.
 const out=[];let join=false;
 for(const c of Array.from(text)){
  if(out.length&&(join||/\p{Mark}|[\uFE00-\uFE0F\u200D]/u.test(c)||/[\u{1F3FB}-\u{1F3FF}]/u.test(c))){out[out.length-1]+=c;}else out.push(c);
  join=c==='\u200d';
 }
 return out;
}
function getCanvas(){
 if(canvasContext!==undefined)return canvasContext;
 canvasContext=null;
 try{
  if(typeof root.OffscreenCanvas==='function')canvasContext=new root.OffscreenCanvas(1,1).getContext('2d');
  else if(root.document&&typeof root.document.createElement==='function')canvasContext=root.document.createElement('canvas').getContext('2d');
 }catch(_error){/* Offline/Node and restricted document contexts use bounded fallback metrics. */}
 return canvasContext;
}
function pathBounds(glyph){
 if(glyphCache.has(glyph))return glyphCache.get(glyph);
 const tokens=String(glyph.d).match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g)||[];
 let i=0,cmd='',x=0,y=0,sx=0,sy=0,minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
 const include=(a,b)=>{minX=Math.min(minX,a);minY=Math.min(minY,b);maxX=Math.max(maxX,a);maxY=Math.max(maxY,b);};
 const roots=(a,b,c)=>{
  if(Math.abs(a)<1e-12)return Math.abs(b)<1e-12?[]:[-c/b];
  const d=b*b-4*a*c;if(d<0)return [];const r=Math.sqrt(d);return [(-b+r)/(2*a),(-b-r)/(2*a)];
 };
 const bezier=(v,t)=>v.length===3?(1-t)*(1-t)*v[0]+2*(1-t)*t*v[1]+t*t*v[2]:(1-t)**3*v[0]+3*(1-t)**2*t*v[1]+3*(1-t)*t*t*v[2]+t**3*v[3];
 const curve=(xs,ys)=>{
  include(xs[0],ys[0]);include(xs[xs.length-1],ys[ys.length-1]);
  for(const values of [xs,ys]){
   const ts=values.length===3?roots(0,values[0]-2*values[1]+values[2],values[1]-values[0]):roots(-values[0]+3*values[1]-3*values[2]+values[3],2*(values[0]-2*values[1]+values[2]),values[1]-values[0]);
   for(const t of ts)if(t>0&&t<1)include(bezier(xs,t),bezier(ys,t));
  }
 };
 const arity={M:2,L:2,H:1,V:1,C:6,Q:4,Z:0};
 while(i<tokens.length){
  if(/^[a-zA-Z]$/.test(tokens[i]))cmd=tokens[i++];
  const upper=cmd.toUpperCase(),relative=cmd!==upper;
  if(!(upper in arity))throw new Error('Unsupported canonical SVG path command: '+cmd);
  if(upper==='Z'){include(x,y);include(sx,sy);x=sx;y=sy;cmd='';continue;}
  const count=arity[upper],values=tokens.slice(i,i+count).map(Number);
  if(values.length!==count||!values.every(Number.isFinite))throw new Error('Invalid canonical SVG path.');i+=count;
  const px=j=>values[j]+(relative?x:0),py=j=>values[j]+(relative?y:0);
  if(upper==='M'||upper==='L'){const nx=px(0),ny=py(1);if(upper==='L')include(x,y);include(nx,ny);x=nx;y=ny;if(upper==='M'){sx=x;sy=y;cmd=relative?'l':'L';}}
  else if(upper==='H'){include(x,y);x=px(0);include(x,y);}
  else if(upper==='V'){include(x,y);y=py(0);include(x,y);}
  else if(upper==='Q'){const nx=px(2),ny=py(3);curve([x,px(0),nx],[y,py(1),ny]);x=nx;y=ny;}
  else if(upper==='C'){const nx=px(4),ny=py(5);curve([x,px(0),px(2),nx],[y,py(1),py(3),ny]);x=nx;y=ny;}
 }
 const offset=Number(glyph.offset)||0;
 const result={left:minX-offset,top:minY-offset,right:maxX-offset,bottom:maxY-offset};
 if(!Object.values(result).every(Number.isFinite))throw new Error('Empty canonical SVG glyph.');
 glyphCache.set(glyph,result);return result;
}
const sansUpper=[.722,.722,.722,.722,.667,.611,.778,.722,.278,.556,.722,.611,.833,.722,.778,.667,.778,.722,.667,.611,.722,.667,.944,.667,.667,.611];
const sansLower=[.556,.611,.556,.611,.556,.333,.611,.611,.278,.278,.556,.278,.889,.611,.611,.611,.611,.389,.556,.333,.611,.556,.778,.556,.556,.5];
const punct={' ': .278,'!':.333,'"':.474,'#':.556,'$':.556,'%':.889,'&':.722,"'":.238,'(': .333,')':.333,'*':.389,'+':.584,',':.278,'-':.333,'.':.278,'/':.278,':':.333,';':.333,'<':.584,'=':.584,'>':.584,'?':.611,'@':.975,'[':.333,'\\':.278,']':.333,'^':.584,'_':.556,'`':.333,'{':.389,'|':.28,'}':.389,'~':.584,'–':.556,'—':1,'‘':.278,'’':.278,'“':.5,'”':.5};
function fallbackAdvance(text,font){
 let width=0;
 for(const cluster of segments(text)){
  if(/\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]/u.test(cluster)){width+=1.15;continue;}
  for(const c of Array.from(cluster)){
   if(/\p{Mark}|[\u200C\u200D\uFE00-\uFE0F]/u.test(c))continue;
   const p=c.codePointAt(0),base=c.normalize('NFD')[0];
   if(p>=0x2e80){width+=1.05;continue;}
   if(font==='mono'){width+=.62;continue;}
   if(base>='A'&&base<='Z')width+=sansUpper[base.charCodeAt(0)-65];
   else if(base>='a'&&base<='z')width+=sansLower[base.charCodeAt(0)-97];
   else if(base>='0'&&base<='9')width+=.556;
   else width+=punct[c]===undefined?.9:punct[c];
  }
 }
 return width;
}
function settings(options){
 const o=options||{},font=['display','sans','mono'].includes(o.font)?o.font:'sans';
 const size=o.size==null?Infinity:Number(o.size);
 if(!(size>0))throw new RangeError('Text size must be positive.');
 const rawLines=o.maxLines==null?2:Number(o.maxLines);
 if(!Number.isFinite(rawLines)||rawLines<1)throw new RangeError('maxLines must be a positive finite number.');
 const tracking=Number(o.tracking)||0;
 if(!Number.isFinite(tracking))throw new RangeError('Text tracking must be finite.');
 const weight=o.weight==null?(font==='mono'?600:800):o.weight;
 if(!/^(?:[1-9]00|normal|bold|[1-9]\d{0,2}|1000)$/.test(String(weight)))throw new RangeError('Invalid font weight.');
 return {font,size,maxLines:Math.floor(rawLines),align:['left','center','right'].includes(o.align)?o.align:'center',valign:['top','center','bottom'].includes(o.valign)?o.valign:'center',color:o.color==null?'#000000':String(o.color),weight,tracking,trackingEm:tracking/(Number.isFinite(size)?size:100),key:o.key==null?'text':String(o.key)};
}
function metricsFactory(options){
 const {font,trackingEm,weight}=options,cache=new Map(),ctx=font==='display'?null:getCanvas();
 const family=font==='mono'?'monospace':'Arial, Helvetica, sans-serif';
 const G=font==='display'&&root.HANGOVER_FONT&&root.HANGOVER_FONT.glyphs;
 if(font==='display'&&(!G||!G['?']))throw new Error('HANGOVER_FONT canonical glyphs are required.');
 const metricSource=font==='display'?'canonical-path-bounds':ctx?'canvas':'conservative-fallback';
 function measure(text){
  if(cache.has(text))return cache.get(text);
  let metric;
  if(font==='display'){
   let cursor=0,left=0,right=0,top=0,bottom=DISPLAY_EM;
   const letters=Array.from(text);
   for(let i=0;i<letters.length;i++){
    const c=letters[i];
    if(c!==' '){const g=G[c]||G['?'],b=pathBounds(g);left=Math.min(left,cursor+b.left);right=Math.max(right,cursor+b.right);top=Math.min(top,b.top);bottom=Math.max(bottom,b.bottom);cursor+=Number(g.width);}
    else cursor+=SPACE;
    if(i<letters.length-1)cursor+=trackingEm*DISPLAY_EM;
    left=Math.min(left,cursor);right=Math.max(right,cursor);
   }
   metric={left:left/DISPLAY_EM,right:right/DISPLAY_EM,top:top/DISPLAY_EM,bottom:bottom/DISPLAY_EM,advance:cursor/DISPLAY_EM};
  }else{
   const clusters=segments(text),gaps=Math.max(0,clusters.length-1),spacing=trackingEm*gaps;
   let advance,left=.08,right=.08,ascent=1.1,descent=.35;
   // Extra combining marks may stack well above a standard ascent, even offline.
   const stack=clusters.reduce((m,c)=>Math.max(m,(c.match(/\p{Mark}/gu)||[]).length),0);
   ascent+=Math.max(0,stack-1)*.5;descent+=Math.max(0,stack-1)*.5;
   if(ctx){
    ctx.font=String(weight)+' 100px '+family;ctx.textAlign='left';ctx.textBaseline='alphabetic';if('fontKerning' in ctx)ctx.fontKerning='normal';
    const m=ctx.measureText(text);advance=m.width/100;
    left=Math.max(.035,(Number(m.actualBoundingBoxLeft)||0)/100+.035);
    right=Math.max(.035,(Number(m.actualBoundingBoxRight)||0)/100-advance+.035);
    ascent=Math.max(ascent,(Number(m.actualBoundingBoxAscent)||0)/100+.035);
    descent=Math.max(descent,(Number(m.actualBoundingBoxDescent)||0)/100+.035);
   }else advance=fallbackAdvance(text,font);
   // Negative tracking is bounded by the ink extent, never a negative textLength.
   const spacedAdvance=advance+spacing;
   metric={left:-left+Math.min(0,spacing),right:Math.max(advance,spacedAdvance)+right,top:-ascent,bottom:descent,advance:Math.max(.000001,spacedAdvance)};
   if(!text)metric={left:0,right:0,top:-ascent,bottom:descent,advance:0};
  }
  metric.width=metric.right-metric.left;metric.height=metric.bottom-metric.top;
  cache.set(text,metric);return metric;
 }
 return {measure,metricSource,family,G};
}
function layout(value,box,options){
 const o=settings(options),b={x:Number(box&&box.x),y:Number(box&&box.y),w:Number(box&&box.w),h:Number(box&&box.h)};
 if(!Object.values(b).every(Number.isFinite)||b.w<=0||b.h<=0)throw new RangeError('Text box must have finite coordinates and positive width/height.');
 const normalizedText=clean(value),unsupported=[];let text=normalizedText;
 const profile=metricsFactory(o);
 if(o.font==='display'){
  text=Array.from(text).map(c=>{
   if(c===' '||c==='\n')return c;
   return Array.from(c.toUpperCase()).map(upper=>{if(profile.G[upper])return upper;if(!unsupported.includes(c))unsupported.push(c);return '?';}).join('');
  }).join('');
 }
 let breaks=0,manualBreaksCollapsed=0;
 text=text.replace(/\n/g,()=>{if(++breaks<o.maxLines)return '\n';manualBreaksCollapsed++;return ' ';});
 const paragraphs=text.split('\n').map(segments),widthLimit=b.w*(1-1e-10),heightLimit=b.h*(1-1e-10);
 function wrapAt(fontSize,early){
  const lines=[],add=t=>{lines.push(t);return !(early&&lines.length>o.maxLines);};
  const available=widthLimit/fontSize;
  for(const chars of paragraphs){
   if(!chars.length){if(!add(''))return null;continue;}
   let start=0;
   while(start<chars.length){
    let low=start,high=chars.length;
    // Find the longest safe grapheme prefix; complete words are preferred below.
    while(low<high){const mid=Math.ceil((low+high)/2);if(profile.measure(chars.slice(start,mid).join('')).width<=available)low=mid;else high=mid-1;}
    if(low===start)return null;
    let end=low,next=low;
    if(low<chars.length){
     let lastSpace=-1;for(let k=low-1;k>start;k--)if(chars[k]===' '){lastSpace=k;break;}
     if(chars[low]===' '){end=low;next=low+1;}
     else if(lastSpace>start){end=lastSpace;next=lastSpace+1;}
    }
    if(!add(chars.slice(start,end).join('')))return null;start=next;
   }
  }
  const metrics=lines.map(profile.measure),width=Math.max(0,...metrics.map(m=>m.width))*fontSize;
  const height=(metrics.reduce((sum,m)=>sum+m.height,0)+Math.max(0,lines.length-1)*GAP)*fontSize;
  if(lines.length>o.maxLines||width>widthLimit||height>heightLimit)return null;
  return {lines,metrics,width,height};
 }
 const issues=[];
 if(unsupported.length)issues.push('unsupported-display-characters');
 if(manualBreaksCollapsed)issues.push('manual-breaks-collapsed');
 const base={normalizedText,text,font:o.font,box:b,maxLines:o.maxLines,unsupported,manualBreaksCollapsed,metricSource:profile.metricSource,issues,options:o,family:profile.family};
 if(!text)return {...base,lines:[],lineMetrics:[],fontSize:0,width:0,height:0,tracking:0,status:'empty'};
 let low=0,high=Math.min(o.size,b.h),best=wrapAt(high,true);
 if(best)low=high;
 else{
  for(let i=0;i<42;i++){const mid=(low+high)/2,result=wrapAt(mid,true);if(result){low=mid;best=result;}else high=mid;}
 }
 if(!best||low<=0)throw new RangeError('Text cannot be fitted at a finite positive size.');
 const fontSize=low*(1-1e-9),result=wrapAt(fontSize,false);
 if(!result)throw new Error('Text fitting invariant failed.');
 const startY=b.y+(o.valign==='top'?0:o.valign==='bottom'?b.h-result.height:(b.h-result.height)/2);
 let cursorY=startY;
 const lineMetrics=result.lines.map((line,i)=>{
  const m=result.metrics[i],width=m.width*fontSize,height=m.height*fontSize,x=b.x+(o.align==='left'?0:o.align==='right'?b.w-width:(b.w-width)/2),y=cursorY;
  cursorY+=height+GAP*fontSize;
  return {text:line,x,y,width,height,originX:x-m.left*fontSize,originY:y-m.top*fontSize,baseline:y-m.top*fontSize,advance:m.advance*fontSize,metrics:m};
 });
 return {...base,lines:result.lines,lineMetrics,fontSize,width:result.width,height:result.height,tracking:o.trackingEm*fontSize,status:issues.length?'warning':'ok'};
}
function fit(value,box,options){
 const result=layout(value,box,options),o=result.options;
 let content='';
 for(const item of result.lineMetrics){
  if(!item.text)continue;
  if(o.font==='display'){
   let cursor=0,paths='';
   for(const c of Array.from(item.text)){
    if(c===' ')cursor+=SPACE;
    else{const g=root.HANGOVER_FONT.glyphs[c]||root.HANGOVER_FONT.glyphs['?'],offset=Number(g.offset)||0;paths+=`<path d="${esc(g.d)}" transform="translate(${num(cursor-offset)} ${num(-offset)})"/>`;cursor+=Number(g.width);}
    cursor+=o.trackingEm*DISPLAY_EM;
   }
   content+=`<g transform="translate(${num(item.originX)} ${num(item.originY)}) scale(${num(result.fontSize/DISPLAY_EM)})" fill-rule="evenodd">${paths}</g>`;
  }else{
   content+=`<text x="${num(item.originX)}" y="${num(item.baseline)}" font-family="${esc(result.family)}" font-size="${num(result.fontSize)}" font-weight="${esc(o.weight)}" font-style="normal" font-kerning="normal" letter-spacing="${num(result.tracking)}" textLength="${num(item.advance)}" lengthAdjust="spacingAndGlyphs" xml:space="preserve">${esc(item.text)}</text>`;
  }
 }
 return `<g data-field="${esc(o.key)}" data-box="${[result.box.x,result.box.y,result.box.w,result.box.h].map(num).join(' ')}" data-font="${o.font}" data-font-size="${num(result.fontSize)}" data-lines="${result.lines.length}" data-layout-status="${result.status}" fill="${esc(o.color)}" aria-label="${esc(result.normalizedText)}"><title>${esc(result.normalizedText)}</title>${content}</g>`;
}
root.HangoverText={fit,layout,clean};
})(typeof window!=='undefined'?window:globalThis);

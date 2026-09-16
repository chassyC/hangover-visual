(function(){
'use strict';
const data=window.HANGOVER_STUDIES;if(!data)return;
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
window.HANGOVER_GALLERIES={windows:data.windows,materials:data.materials,blueprint:data.blueprint,artists:window.HANGOVER_ARTISTS||[]};
function gallery(id,items,name){const container=$(id);if(!container)return;container.replaceChildren();items.forEach((item,i)=>{const f=document.createElement('figure');f.className='study-card';const b=document.createElement('button');b.dataset.gallery=name;b.dataset.galleryId=item.id;b.setAttribute('aria-label','Apri '+item.title);const img=window.HangoverImage.create(item);img.loading='lazy';img.decoding='async';img.width=item.width||1000;img.height=item.height||1250;b.append(img);const cap=document.createElement('figcaption'),title=document.createElement('span'),no=document.createElement('span');title.textContent=item.title;no.textContent=String(i+1).padStart(2,'0')+' ↗';cap.append(title,no);f.append(b,cap);if(item.colors){const swatches=document.createElement('div');swatches.className='material-colors';swatches.setAttribute('aria-hidden','true');item.colors.forEach(c=>{const dot=document.createElement('i');dot.style.background=c;swatches.append(dot)});cap.prepend(swatches);}container.append(f);});}
gallery('#windowsGrid',data.windows,'windows');gallery('#materialsGrid',data.materials,'materials');gallery('#blueprintGallery',data.blueprint,'blueprint');
function wireFilters(container,items,grid,group,field){$$(container+' button').forEach(b=>b.addEventListener('click',()=>{const selected=b.dataset.filter;const filtered=selected==='all'?items:items.filter(x=>x[field]===selected);$$(container+' button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));window.HANGOVER_GALLERIES[group]=filtered;gallery(grid,filtered,group);const count=$(grid+'Count');if(count)count.textContent=filtered.length+' / '+items.length;}));}
wireFilters('#windowsFilters',data.windows,'#windowsGrid','windows','theme');
const artists=window.HANGOVER_ARTISTS||[];gallery('#artistsGrid',artists,'artists');wireFilters('#artistsFilters',artists,'#artistsGrid','artists','region');
const board=$('#blueprintBoard');if(!board)return;
const registry=window.HANGOVER_FONT||{glyphs:data.alphabet,groups:data.blueprintFont&&data.blueprintFont.groups};
const alphabet=registry.glyphs,svgNS='http://www.w3.org/2000/svg';
const availableGroups=registry.groups||{letters:Object.keys(alphabet)};
const groups=Object.entries(availableGroups).map(([key,chars])=>({key,chars:chars.filter(c=>alphabet[c])})).filter(g=>g.chars.length);
const grouped=new Set(groups.flatMap(g=>g.chars)),extras=Object.keys(alphabet).filter(c=>!grouped.has(c));
if(extras.length)groups.push({key:'accents',chars:extras});
const allLetters=groups.flatMap(g=>g.chars),labels={letters:'A–Z',numbers:'0–9',symbols:'!? &',accents:'À–Ü'};
const groupNames={letters:'Lettere',numbers:'Numeri',symbols:'Simboli',accents:'Accenti'};
const symbolNames={'!':'Punto esclamativo','?':'Punto interrogativo','.':'Punto',',':'Virgola',':':'Due punti',';':'Punto e virgola','-':'Trattino','/':'Barra','\\':'Barra inversa','+':'Più','&':'E commerciale','@':'Chiocciola','#':'Cancelletto','%':'Percentuale','*':'Asterisco','(':'Parentesi tonda aperta',')':'Parentesi tonda chiusa','[':'Parentesi quadra aperta',']':'Parentesi quadra chiusa','{':'Parentesi graffa aperta','}':'Parentesi graffa chiusa','=':'Uguale','€':'Euro','$':'Dollaro','×':'Moltiplicazione','→':'Freccia destra','←':'Freccia sinistra','_':'Trattino basso','|':'Barra verticale','<':'Minore','>':'Maggiore','~':'Tilde','^':'Accento circonflesso',"'":'Apostrofo','"':'Virgolette','’':'Apostrofo tipografico','‘':'Virgoletta singola aperta','“':'Virgolette aperte','”':'Virgolette chiuse','–':'Trattino medio','—':'Trattino lungo','`':'Accento grave'};
let letter=alphabet.G?'G':allLetters[0],mode='construction';
const element=(tag,attrs={},text)=>{const el=document.createElementNS(svgNS,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));if(text!==undefined)el.textContent=text;return el;};
const describe=c=>symbolNames[c]?symbolNames[c]+' ('+c+')':c;
function glyphBounds(c){
 if(data.glyphBounds&&data.glyphBounds[c])return data.glyphBounds[c];
 const probe=element('svg',{width:0,height:0,'aria-hidden':'true'}),path=element('path',{d:alphabet[c].d});probe.append(path);board.append(probe);const b=path.getBBox();probe.remove();return {minX:b.x,minY:b.y,maxX:b.x+b.width,maxY:b.y+b.height,width:b.width,height:b.height};
}
function glyphPreview(c){const g=alphabet[c],b=glyphBounds(c),top=Math.min(0,b.minY),left=Math.min(0,b.minX),bottom=Math.max(150,b.maxY),right=Math.max(g.width+3,b.maxX);const svg=element('svg',{viewBox:`${left-4} ${top-4} ${right-left+8} ${bottom-top+8}`,'aria-hidden':'true',focusable:'false'});svg.append(element('path',{d:g.d,fill:'currentColor','fill-rule':'evenodd'}));return svg;}
const controls=$('.bp-controls'),lettersContainer=$('.bp-letters');
const tabs=document.createElement('div');tabs.className='bp-categories';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Categorie di glifi');
lettersContainer.replaceChildren();lettersContainer.setAttribute('aria-label','Glifi HANGOVER Display');lettersContainer.before(tabs);
const status=document.createElement('p');status.className='bp-selection-status';status.id='blueprintSelectionStatus';status.setAttribute('role','status');status.setAttribute('aria-live','polite');lettersContainer.after(status);
function selectLetter(c){letter=c;$$('[data-blueprint-letter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.blueprintLetter===letter)));drawBlueprint();}
function selectGroup(key,focus=false){
 const group=groups.find(g=>g.key===key);if(!group)return;
 groups.forEach(g=>{const selected=g===group;$('#blueprint-tab-'+g.key).setAttribute('aria-selected',String(selected));$('#blueprint-tab-'+g.key).tabIndex=selected?0:-1;$('#blueprint-panel-'+g.key).hidden=!selected;});
 if(!group.chars.includes(letter))selectLetter(group.chars[0]);
 if(focus)$('#blueprint-tab-'+key).focus();
}
groups.forEach((group,index)=>{
 const tab=document.createElement('button');tab.type='button';tab.id='blueprint-tab-'+group.key;tab.textContent=labels[group.key]||group.key;tab.setAttribute('role','tab');tab.setAttribute('aria-label',(groupNames[group.key]||group.key)+', '+group.chars.length+' glifi');tab.setAttribute('aria-controls','blueprint-panel-'+group.key);tab.addEventListener('click',()=>selectGroup(group.key));
 tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%groups.length;else if(e.key==='ArrowLeft')next=(index+groups.length-1)%groups.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=groups.length-1;else return;e.preventDefault();selectGroup(groups[next].key,true);});tabs.append(tab);
 const panel=document.createElement('div');panel.className='bp-glyph-panel';panel.id='blueprint-panel-'+group.key;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tab.id);
 group.chars.forEach(c=>{const button=document.createElement('button');button.type='button';button.dataset.blueprintLetter=c;button.setAttribute('aria-label','Glifo '+describe(c));button.setAttribute('aria-controls','blueprintBoard');button.setAttribute('aria-pressed',String(c===letter));button.title=describe(c);button.append(glyphPreview(c));button.addEventListener('click',()=>selectLetter(c));panel.append(button);});lettersContainer.append(panel);
});
function drawBlueprint(){
 const g=alphabet[letter],b=glyphBounds(letter),top=Math.min(3,b.minY),bottom=Math.max(144,b.maxY),scale=Math.min(720/b.width,620/(bottom-top));
 const left=(1000-b.width*scale)/2,right=left+b.width*scale,originX=left-b.minX*scale,originY=190+(620-(bottom-top)*scale)/2-top*scale;
 const cap=originY+3*scale,baseline=originY+144*scale,transform=`translate(${originX} ${originY}) scale(${scale})`,actualTop=originY+b.minY*scale,actualBottom=originY+b.maxY*scale;
 const svg=element('svg',{xmlns:svgNS,viewBox:'0 0 1000 980',role:'img','aria-label':'Studio del glifo '+describe(letter)+', '+({solid:'pieno',outline:'contorno',construction:'griglia'}[mode])});
 const add=(tag,attrs,text)=>{const el=element(tag,attrs,text);svg.append(el);return el;};
 add('title',{},'HANGOVER Display / '+describe(letter));add('desc',{},'Tracciato canonico completo. Vista '+mode+'.');add('rect',{width:1000,height:980,fill:'#0848cc'});
 if(mode==='construction'){
  for(let n=0;n<=1000;n+=40)add('path',{d:`M${n} 0V980M0 ${n}H1000`,stroke:'#bce3f5','stroke-width':1,opacity:.16});
  add('path',{d:`M${left} 145V855M${right} 145V855M60 ${cap}H940M60 ${baseline}H940`,stroke:'#ff602e','stroke-width':2,fill:'none'});
  if(b.minY<3||b.maxY>144)add('path',{d:`M60 ${actualTop}H940M60 ${actualBottom}H940`,stroke:'#ff602e','stroke-width':1,'stroke-dasharray':'8 8',fill:'none'});
  add('path',{d:`M${left} 115H${right}M${left} 104V126M${right} 104V126`,stroke:'#bce3f5','stroke-width':2});
  add('text',{x:500,y:97,fill:'#bce3f5','text-anchor':'middle','font-family':'monospace','font-size':19},Number(b.width.toFixed(1))+' u');
  add('text',{x:940,y:880,fill:'#bce3f5','text-anchor':'end','font-family':'monospace','font-size':17},'H '+Number(b.height.toFixed(1))+' u / AV '+g.width+' u');
 }
 add('path',{d:g.d,transform,fill:mode==='outline'?'none':'#bce3f5',stroke:'#bce3f5','stroke-width':mode==='outline'?.7:0,'fill-rule':'evenodd','data-glyph':letter});
 if(mode==='construction')add('path',{d:g.d,transform,fill:'none',stroke:'#0848cc','stroke-width':.2,'stroke-dasharray':'1 3'});
 add('text',{x:45,y:944,fill:'#bce3f5','font-family':'monospace','font-size':20,'letter-spacing':4},'HANGOVER / '+letter);
 add('text',{x:955,y:944,fill:'#bce3f5','font-family':'monospace','font-size':17,'text-anchor':'end'},String(allLetters.indexOf(letter)+1).padStart(3,'0')+' / '+allLetters.length);
 board.replaceChildren(svg);const selected=$('#blueprintLetter');if(selected){selected.replaceChildren(glyphPreview(letter));selected.setAttribute('aria-label',describe(letter));}
 const group=groups.find(g=>g.chars.includes(letter));status.textContent=describe(letter)+' · '+(groupNames[group.key]||group.key)+' '+(group.chars.indexOf(letter)+1)+' / '+group.chars.length;
}
$$('[data-blueprint-mode]').forEach(b=>{b.type='button';b.setAttribute('aria-controls','blueprintBoard');b.addEventListener('click',()=>{mode=b.dataset.blueprintMode;$$('[data-blueprint-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));drawBlueprint();});});
selectGroup(groups.find(g=>g.chars.includes(letter)).key);drawBlueprint();
const exportButton=$('#blueprintExport');if(exportButton){exportButton.type='button';exportButton.setAttribute('aria-controls','blueprintBoard');exportButton.addEventListener('click',()=>{const blob=new Blob([new XMLSerializer().serializeToString(board.querySelector('svg'))],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a'),code=Array.from(letter,c=>'U'+c.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')).join('-');a.href=url;a.download='HANGOVER-blueprint-'+code+'-'+mode+'.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});}
if(controls){const note=controls.querySelector('.bp-note');if(note)note.textContent='A–Z, numeri, punteggiatura e accenti. Gli stessi tracciati del font: tagli obliqui, curve tese, pieni e vuoti da esplorare in tre viste.';}
})();

/* HANGOVER QR — direct URLs, local qrcode-generator, no network requests. */
(function(root){
 'use strict';
 const LIMIT=1200,QUIET=4;
 let cachedURL='',cachedMatrix=null,cachedPath='';
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 function validate(value){
  if(typeof value!=='string')throw Error('Inserisci un link completo, per esempio https://example.com.');
  const input=value.trim();
  if(!input)throw Error('Inserisci il link da aprire.');
  if(input.length>LIMIT)throw Error('Il link è troppo lungo: massimo 1200 caratteri.');
  if(/[\u0000-\u001f\u007f]/.test(input))throw Error('Il link contiene un carattere non valido.');
  if(!/^https?:\/\//i.test(input))throw Error('Il link deve iniziare con https:// oppure http://.');
  let url;try{url=new URL(input);}catch(_){throw Error('Questo link non è valido. Controlla indirizzo e dominio.');}
  if(!/^https?:$/.test(url.protocol)||!url.hostname)throw Error('Usa un link completo http o https.');
  if(url.username||url.password)throw Error('Usa un link senza nome utente o password.');
  if(url.href.length>LIMIT)throw Error('Il link codificato supera 1200 caratteri. Usa un indirizzo più breve.');
  return url.href;
 }
 function prepare(value){
  const url=validate(value);
  if(cachedMatrix&&cachedURL===url)return cachedMatrix;
  if(typeof root.qrcode!=='function')throw Error('Il generatore QR non è disponibile. Ricarica la pagina.');
  let code;try{code=root.qrcode(0,'M');code.addData(url,'Byte');code.make();}catch(_){throw Error('Non riesco a creare questo QR. Prova un link più breve.');}
  const n=code.getModuleCount(),rows=Array.from({length:n},(_,y)=>Array.from({length:n},(_,x)=>!!code.isDark(y,x)));
  let path='';rows.forEach((row,y)=>row.forEach((dark,x)=>{if(dark)path+=`M${x+QUIET},${y+QUIET}h1v1h-1z`;}));
  cachedURL=url;cachedMatrix=rows;cachedPath=path;return rows;
 }
 function matrix(url){return prepare(url).map(row=>row.slice());}
 function number(value,name,positive=false){if(typeof value!=='number'||!Number.isFinite(value)||(positive&&value<=0)||Math.abs(value)>1000000)throw Error('Dimensione QR non valida: '+name+'.');return value;}
 function group(url,x=0,y=0,size=400){
  number(x,'x');number(y,'y');number(size,'size',true);
  const rows=prepare(url),n=rows.length+QUIET*2;
  return `<g transform="translate(${x} ${y}) scale(${size/n})" shape-rendering="crispEdges"><rect width="${n}" height="${n}" fill="#ffffff"/><path d="${cachedPath}" fill="#000000"/></g>`;
 }
 function svg(value,options={}){
  const url=validate(value),size=options.size===undefined?400:options.size,mm=options.mm===undefined?40:options.mm;
  number(size,'size',true);number(mm,'mm',true);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${mm}mm" height="${mm}mm" viewBox="0 0 ${size} ${size}" role="img" aria-label="QR per aprire il link"><title>${escape(url)}</title><desc>QR diretto. Bordo bianco libero di quattro moduli.</desc>${group(url,0,0,size)}</svg>`;
 }
 root.HangoverQR=Object.freeze({validate,matrix,group,svg});
})(typeof window!=='undefined'?window:globalThis);

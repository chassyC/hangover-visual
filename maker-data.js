/* HANGOVER Maker — physical formats, curated directions and local deterministic suggestions. */
(function(root){
  'use strict';
  const types=[
    {id:'poster',name:'Poster A4',mmw:210,mmh:297,shapes:['rect','arch'],defaultShape:'rect'},
    {id:'flyer',name:'Flyer A5',mmw:148,mmh:210,shapes:['rect','arch','ticket'],defaultShape:'rect'},
    {id:'sticker',name:'Sticker',mmw:80,mmh:80,shapes:['rect','round','pill','arch','shield','burst','ticket','contour'],defaultShape:'round'},
    {id:'phone-sticker',name:'Sticker telefono',mmw:45,mmh:90,shapes:['rect','pill','arch','contour'],defaultShape:'pill'},
    {id:'patch',name:'Patch',mmw:80,mmh:80,shapes:['rect','round','shield','contour'],defaultShape:'shield'},
    {id:'tag',name:'Cartellino',mmw:50,mmh:90,shapes:['rect','arch','ticket'],defaultShape:'ticket'},
    {id:'coaster',name:'Sottobicchiere',mmw:90,mmh:90,shapes:['round','rect','burst'],defaultShape:'round'},
    {id:'table-card',name:'Cartoncino tavolo',mmw:105,mmh:148,shapes:['rect','arch'],defaultShape:'arch'},
    {id:'wristband',name:'Braccialetto',mmw:250,mmh:20,shapes:['rect','pill','ticket'],defaultShape:'pill'},
    {id:'pass',name:'Pass',mmw:85,mmh:120,shapes:['rect','arch','shield','ticket'],defaultShape:'ticket'},
    {id:'bookmark',name:'Segnalibro',mmw:50,mmh:200,shapes:['rect','arch','ticket'],defaultShape:'rect'},
    {id:'phone-cover',name:'Cover telefono · sagoma generica',mmw:75,mmh:155,shapes:['rect'],defaultShape:'rect'}
  ];
  const shapes=[['rect','Rettangolo'],['round','Cerchio'],['pill','Capsula'],['arch','Arco'],['shield','Scudo'],['burst','Raggiera'],['ticket','Ticket'],['contour','Contorno libero']].map(([id,name])=>({id,name}));
  const layouts=[['orbit','Orbita'],['stack','Colonna'],['repeat','Ripetizione'],['split','Due campi'],['frame','Cornice'],['ticket','Matrice']].map(([id,name])=>({id,name}));
  const effects=[['flat','Tinta piatta'],['grain','Grana'],['chrome','Cromo'],['holo','Olografico'],['foil','Lamina'],['emboss','Rilievo']].map(([id,name])=>({id,name}));
  const fonts=[['display','HANGOVER Display'],['sans','Sans'],['mono','Mono']].map(([id,name])=>({id,name}));
  const palettes=root.HangoverPalettes;
  if(!palettes)throw Error("Palette HANGOVER non disponibili.");
  const moods=[['electric','Elettrico'],['playful','Giocoso'],['raw','Ruvido'],['minimal','Essenziale'],['dreamy','Sospeso'],['bold','Deciso']].map(([id,name])=>({id,name}));
  const contexts=[['club','Club'],['campus','Campus'],['street','Street'],['table','Tavolo'],['personal','Personale']].map(([id,name])=>({id,name}));
  const marks=['none','h','hg','hgr','hang','over','hangover'];
  const defaults={type:'sticker',shape:'round',title:'AFTER HOURS',detail:'AROUND THE VIBE',mark:'hangover',layout:'orbit',effect:'chrome',palette:'ice',bg:'#063c9a',fg:'#c3e3f3',accent:'#ff552d',font:'display',mood:'electric',context:'club',intensity:55,seed:1,qrEnabled:false,qrURL:'https://chassyc.github.io/hangover-visual/'};
  const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
  function input(value){
    if(typeof value==='string'){if(value.length>16000)return {};try{value=JSON.parse(value);}catch(_){return {};}}
    if(!value||typeof value!=='object'||Array.isArray(value))return {};
    // Read only own data properties; accessors and unknown keys never enter the state.
    const out={};for(const k of Object.keys(defaults)){const d=Object.getOwnPropertyDescriptor(value,k);if(d&&own(d,'value'))out[k]=d.value;}return out;
  }
  const enumValue=(value,list,fallback)=>typeof value==='string'&&list.some(x=>x.id===value)?value:fallback;
  const number=(value,fallback,min,max)=>typeof value==='number'&&Number.isFinite(value)?Math.round(Math.min(max,Math.max(min,value))):fallback;
  function safeText(value,fallback,max){
    if(typeof value!=='string')return fallback;
    return Array.from(value.replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g,' ').replace(/\s+/g,' ').trim()).slice(0,max).join('');
  }
  const color=(value,fallback)=>typeof value==='string'&&/^#[0-9a-f]{6}$/i.test(value.trim())?value.trim().toLowerCase():fallback;
  function normalize(value){
    const v=input(value),type=enumValue(v.type,types,defaults.type),t=types.find(x=>x.id===type);
    const palette=enumValue(v.palette,palettes,defaults.palette),pal=palettes.find(x=>x.id===palette);
    return {type,shape:t.shapes.includes(v.shape)?v.shape:t.defaultShape,
      title:safeText(v.title,defaults.title,48),detail:safeText(v.detail,defaults.detail,100),
      mark:typeof v.mark==='string'&&marks.includes(v.mark)?v.mark:defaults.mark,
      layout:enumValue(v.layout,layouts,defaults.layout),effect:enumValue(v.effect,effects,defaults.effect),palette,
      bg:color(v.bg,pal.bg),fg:color(v.fg,pal.fg),accent:color(v.accent,pal.accent),font:enumValue(v.font,fonts,defaults.font),
      mood:enumValue(v.mood,moods,defaults.mood),context:enumValue(v.context,contexts,defaults.context),
      intensity:number(v.intensity,defaults.intensity,0,100),seed:number(v.seed,defaults.seed,0,4294967295),
      qrEnabled:v.qrEnabled===true,qrURL:typeof v.qrURL==='string'?v.qrURL.trim().slice(0,1201):defaults.qrURL};
  }
  const moodProfiles={
    electric:{pal:['acid','ice','ultraviolet','orange'],layouts:['orbit','repeat','split'],effects:['chrome','holo','flat'],level:80},
    playful:{pal:['orange','mint','lilac','lemon'],layouts:['repeat','orbit','split'],effects:['flat','holo','foil'],level:68},
    raw:{pal:['paper','mono','copper','red'],layouts:['ticket','repeat','stack'],effects:['grain','flat','emboss'],level:61},
    minimal:{pal:['mono','paper','silver','sand'],layouts:['frame','stack','split'],effects:['flat','emboss','grain'],level:20},
    dreamy:{pal:['plum','petrol','ocean','rose'],layouts:['orbit','frame','stack'],effects:['holo','foil','chrome'],level:44},
    bold:{pal:['red','orange','cherry','acid'],layouts:['stack','split','ticket'],effects:['flat','foil','emboss'],level:89}
  };
  const contextProfiles={
    club:{pal:['ice','acid','plum'],layouts:['orbit','repeat','split'],effects:['chrome','holo','foil'],level:82},
    campus:{pal:['paper','mint','orange'],layouts:['split','frame','stack'],effects:['flat','grain','emboss'],level:46},
    street:{pal:['orange','red','mono'],layouts:['repeat','ticket','stack'],effects:['grain','flat','foil'],level:76},
    table:{pal:['paper','red','plum'],layouts:['frame','orbit','stack'],effects:['emboss','flat','foil'],level:30},
    personal:{pal:['mint','plum','mono'],layouts:['stack','frame','orbit'],effects:['holo','emboss','chrome'],level:42}
  };
  function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
  function weight(list,id){const n=list.indexOf(id);return n<0?0:4-n;}
  function suggest(value,seed=1,count=4){
    const s=normalize(value),n=number(count,4,0,12),chosenSeed=number(seed,1,0,4294967295),m=moodProfiles[s.mood],c=contextProfiles[s.context];
    const salt=[s.type,s.shape,s.mood,s.context,chosenSeed].join('|'),candidates=[];
    for(const layout of layouts)for(const palette of palettes)for(const effect of effects){
      const key=[layout.id,palette.id,effect.id].join('|');
      // Explicit preferences determine direction; bounded seeded jitter supplies variation.
      const jitter=(hash(salt+'|'+key)%1000)/1000;
      const score=weight(m.layouts,layout.id)*1.4+weight(c.layouts,layout.id)*1.2+weight(m.pal,palette.id)*1.5+weight(c.pal,palette.id)*1.3+weight(m.effects,effect.id)*1.2+weight(c.effects,effect.id)+jitter*4;
      candidates.push({layout,palette,effect,key,score});
    }
    candidates.sort((a,b)=>b.score-a.score||(a.key<b.key?-1:1));
    const selected=[],usedPal=new Map(),usedLayout=new Map(),usedEffect=new Map();
    while(selected.length<n){let best=null,bestValue=-Infinity;
      for(const candidate of candidates){if(selected.includes(candidate))continue;
        const diversity=(usedPal.get(candidate.palette.id)||0)*5+(usedLayout.get(candidate.layout.id)||0)*4+(usedEffect.get(candidate.effect.id)||0)*3;
        if(candidate.score-diversity>bestValue){bestValue=candidate.score-diversity;best=candidate;}}
      selected.push(best);for(const[map,id]of [[usedPal,best.palette.id],[usedLayout,best.layout.id],[usedEffect,best.effect.id]])map.set(id,(map.get(id)||0)+1);
    }
    return selected.map((v,i)=>{const intensity=Math.min(100,Math.max(0,Math.round(m.level*.6+c.level*.4)+(hash(salt+v.key)%15)-7));
      const state=normalize({...s,layout:v.layout.id,palette:v.palette.id,bg:v.palette.bg,fg:v.palette.fg,accent:v.palette.accent,effect:v.effect.id,intensity,seed:hash(salt+'|'+v.key)});
      return {id:'suggest-'+hash(salt+'|'+v.key).toString(36),name:v.palette.name+' · '+v.layout.name+' · '+v.effect.name,state};});
  }
  const presetSpecs=[
    ['poster-signal','Segnale verticale','Poster deciso, due campi e rosso lacca.',{type:'poster',shape:'rect',layout:'split',palette:'red',effect:'flat',mark:'hangover',mood:'bold',context:'club',intensity:84}],
    ['flyer-fold','Carta in movimento','Flyer su carta, gerarchia netta e grana.',{type:'flyer',shape:'rect',layout:'stack',palette:'paper',effect:'grain',mark:'hangover',mood:'raw',context:'campus',intensity:50}],
    ['sticker-orbit','Satellite blu','Sticker circolare, orbite e riflessi freddi.',{type:'sticker',shape:'round',layout:'orbit',palette:'ice',effect:'chrome',mark:'hg',mood:'electric',context:'club',intensity:74}],
    ['phone-sticker-pulse','Capsula menta','Sticker allungato, ripetizioni e superficie lucida.',{type:'phone-sticker',shape:'pill',layout:'repeat',palette:'mint',effect:'holo',mark:'h',mood:'playful',context:'personal',intensity:58}],
    ['patch-shield','Scudo notturno','Patch a scudo, contrasto nero e gesso.',{type:'patch',shape:'shield',layout:'frame',palette:'mono',effect:'emboss',mark:'hg',mood:'minimal',context:'street',intensity:32}],
    ['tag-matrix','Matrice arancio','Cartellino ritmato, campi brevi e arancio.',{type:'tag',shape:'ticket',layout:'ticket',palette:'orange',effect:'flat',mark:'hgr',mood:'bold',context:'street',intensity:72}],
    ['coaster-ring','Giro di tavolo','Sottobicchiere circolare, cornice e rosso caldo.',{type:'coaster',shape:'round',layout:'frame',palette:'red',effect:'emboss',mark:'h',mood:'minimal',context:'table',intensity:28}],
    ['table-card-arch','Arco prugna','Cartoncino ad arco con riflessi di lamina.',{type:'table-card',shape:'arch',layout:'stack',palette:'plum',effect:'foil',mark:'hangover',mood:'dreamy',context:'table',intensity:41}],
    ['wristband-loop','Nastro acido','Braccialetto orizzontale, moduli ripetuti e acido.',{type:'wristband',shape:'pill',layout:'repeat',palette:'acid',effect:'flat',mark:'hangover',mood:'electric',context:'club',intensity:88}],
    ['pass-cut','Pass ghiaccio','Pass a ticket, matrice e cromo freddo.',{type:'pass',shape:'ticket',layout:'ticket',palette:'ice',effect:'chrome',mark:'hgr',mood:'electric',context:'club',intensity:64}],
    ['bookmark-column','Colonna di carta','Segnalibro verticale, cornice e segno essenziale.',{type:'bookmark',shape:'rect',layout:'frame',palette:'paper',effect:'flat',mark:'over',mood:'minimal',context:'campus',intensity:20}],
    ['phone-cover-drift','Riflesso personale','Cover generica, orbita prugna e luce olografica.',{type:'phone-cover',shape:'rect',layout:'orbit',palette:'plum',effect:'holo',mark:'hg',mood:'dreamy',context:'personal',intensity:52}]
  ];
  const presets=presetSpecs.map(([id,name,description,state],i)=>({id,name,description,state:normalize({...state,seed:101+i})}));
  root.HangoverMakerData={types,shapes,layouts,effects,fonts,palettes,moods,contexts,presets,defaults,normalize,suggest};
})(typeof window!=='undefined'?window:globalThis);

/* HANGOVER — club objects. All logos come from the shared canonical helper. */
(function(root){
 'use strict';
 root.createHangoverClub=function(){
  const items=[
   {id:'access-laminate',name:'Pass / Laminato',category:'entry',mmw:72,mmh:110,description:'Pass laminato · 72 × 110 mm · fronte con asola e link informativo',mockup:false,event:true,qr:true},
   {id:'wristband-silicone',name:'Bracciale / Silicone',category:'entry',mmw:210,mmh:22,description:'Silicone a rilievo · sviluppo nominale 210 × 22 mm · studio piano',mockup:true,event:false,qr:false},
   {id:'guest-envelope',name:'Busta / Ospiti',category:'entry',mmw:162,mmh:114,description:'Busta con inserto · formato nominale 162 × 114 mm · mockup',mockup:true,event:true,qr:true},
   {id:'luggage-tag',name:'Tag / Bagaglio',category:'entry',mmw:55,mmh:95,description:'Etichetta con cordino · tag nominale 55 × 95 mm · mockup',mockup:true,event:true,qr:true},
   {id:'cloakroom-token',name:'Gettone / Guardaroba',category:'entry',mmw:48,mmh:65,description:'Gettone inciso · 48 × 65 mm · foro e numero campione',mockup:false,event:false,qr:false},
   {id:'cup',name:'Bicchiere / Conico',category:'extra',mmw:90,mmh:120,description:'Bicchiere · ingombro nominale Ø 90 × 120 mm · mockup',mockup:true,event:true,qr:false},
   {id:'cup-sleeve',name:'Fascia / Bicchiere',category:'extra',mmw:110,mmh:55,description:'Fascia in carta ondulata · sviluppo nominale 110 × 55 mm · mockup',mockup:true,event:true,qr:false},
   {id:'table-tent',name:'Cavaliere / Tavolo',category:'extra',mmw:105,mmh:148,description:'Cartoncino autoportante · fronte nominale 105 × 148 mm · mockup',mockup:true,event:true,qr:true},
   {id:'menu-fold',name:'Menu / Tre ante',category:'extra',mmw:210,mmh:210,description:'Menu pieghevole · aperto nominale 210 × 210 mm · mockup senza prezzi',mockup:true,event:true,qr:true},
   {id:'vinyl-sleeve',name:'Vinile / Custodia',category:'extra',mmw:315,mmh:315,description:'Custodia e disco · copertina nominale 315 × 315 mm · mockup',mockup:true,event:true,qr:true},
   {id:'record-label',name:'Vinile / Etichetta',category:'extra',mmw:100,mmh:100,description:'Etichetta circolare · Ø 100 mm · foro centrale e lato A',mockup:false,event:true,qr:false},
   {id:'matchbox',name:'Fiammiferi / Cassetto',category:'extra',mmw:56,mmh:35,description:'Scatola a cassetto · ingombro nominale 56 × 35 mm · mockup',mockup:true,event:true,qr:false}
  ];
  const field=(key,label,value,maxLength=60)=>({key,label,value,maxLength});
  const eventFields=()=>[field('title','Titolo','ALL NIGHT',64),field('detail','Dettagli','DATA · LUOGO',100)];
  const textFields={
   'access-laminate':[...eventFields(),field('club_note','Etichetta superiore','H / CLUB NOTE'),field('side_signature','Firma laterale','HANGOVER'),field('pass_type','Tipo di pass','LAMINATE'),field('info_label','Etichetta link','INFO / LINK'),field('scan_label','Invito alla scansione','SCAN THE NIGHT')],
   'wristband-silicone':[field('material','Etichetta materiale','SILICONE')],
   'guest-envelope':[...eventFields(),field('guest_note','Nota ospite','GUEST NOTE')],
   'luggage-tag':[...eventFields(),field('tagline','Frase centrale','TAKE IT WITH YOU'),field('tag_code','Codice etichetta','H / TAG')],
   'cloakroom-token':[field('number','Numero guardaroba','001',12),field('wardrobe_label','Etichetta guardaroba','GUARDAROBA')],
   cup:[...eventFields(),field('repeat_label','Firma inferiore','H / REPEAT')],
   'cup-sleeve':eventFields(),
   'table-tent':[...eventFields(),field('table_label','Etichetta superiore','ON THE TABLE'),field('info_label','Etichetta informazioni','INFO'),field('info_signature','Firma informazioni','HANGOVER')],
   'menu-fold':[...eventFields(),field('fold_label','Etichetta piega','MENU / FOLD'),field('menu_heading','Titolo menu','MENU'),...[1,2,3,4,5].map(n=>field('menu_index_'+n,'Numero voce '+n,String(n).padStart(2,'0'),12)),field('side_signature','Firma laterale','HANGOVER'),field('info_label','Etichetta link','INFO / LINK')],
   'vinyl-sleeve':[...eventFields(),field('side_label','Etichetta lato','SIDE / H')],
   'record-label':[...eventFields(),field('side','Lato disco','A',12),field('catalog_code','Codice disco','H / 01',12),field('signature','Firma inferiore','HANGOVER')],
   matchbox:[...eventFields(),field('matches_label','Etichetta fiammiferi','H / MATCHES')]
  };
  for(const it of items)it.textFields=textFields[it.id];
  const renderers={
   'access-laminate':e=>{
    const {H,p,rect,line,logo,qr,esc,uid}=e,id=esc(uid+'-laminate');
    return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".24"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset=".73" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".15"/></linearGradient><mask id="${id}-hole"><rect width="1000" height="${H}" fill="#fff"/><rect x="372" y="46" width="256" height="45" rx="22" fill="#000"/></mask></defs>`+
     `<g mask="url(#${id}-hole)">`+rect(16,16,968,H-32,p.bg,45)+rect(30,30,940,H-60,'none',34,`stroke="${p.fg}" stroke-width="2" opacity=".65"`)+
     logo('hangover',64,153,872)+e.copy('club_note',67,307,865,36,{size:22,font:'mono',weight:400,tracking:3,color:p.fg,lines:1})+logo('h',77,403,457)+
     rect(599,394,307,18,p.accent)+line(600,446,906,446,p.fg,2)+e.copy('side_signature',600,468,306,40,{size:22,font:'mono',weight:400,tracking:3,color:p.fg,lines:2})+e.copy('pass_type',600,521,306,34,{size:17,font:'mono',weight:400,tracking:3,color:p.fg,lines:1})+
     e.copy('title',67,988,840,111,{size:86,font:'sans',weight:800,tracking:-2,color:p.fg,lines:2})+e.copy('detail',69,1120,836,59,{size:26,font:'sans',weight:400,tracking:1,color:p.fg,lines:2})+line(67,1197,932,1197,p.fg,2)+
     e.copy('info_label',67,H-232,584,43,{size:24,font:'mono',weight:400,tracking:3,color:p.fg,lines:1})+e.copy('scan_label',67,H-177,584,40,{size:18,font:'mono',weight:400,tracking:3,color:p.fg,lines:2})+qr(694,H-299,228)+
     `<path d="M45 49H282L824 966H620Z" fill="url(#${id})"/>`+rect(42,42,916,H-84,'none',28,`stroke="#fff" stroke-width="1" opacity=".28"`)+'</g>';
   },
   'wristband-silicone':e=>{
    const {H,p,rect,line,circle,logo}=e;
    return rect(8,8,984,H-16,'#000',H/2,'opacity=".14"')+rect(8,4,984,H-16,p.bg,H/2)+
     rect(14,10,972,H-28,'none',H/2,`stroke="${p.fg}" stroke-width="1.4" opacity=".3"`)+
     line(80,14,918,14,p.fg,2,'opacity=".26"')+line(80,H-19,918,H-19,'#000',3,'opacity=".25"')+
     logo('hangover',112,29,418,'#00000038')+logo('hangover',111,27,418,p.fg)+logo('hgr',722,32,96,p.accent)+
     [0,1,2,3,4].map(i=>circle(580+i*15,H/2-2,2.8,p.accent)).join('')+e.copy('material',847,H/2-12,95,23,{size:10,font:'mono',weight:400,tracking:1.2,color:p.fg,lines:1});
   },
   'guest-envelope':e=>{
    const {H,p,rect,line,logo,qr}=e;
    return rect(43,42,920,H-65,'#000',7,'opacity=".12"')+
     `<path d="M45 296L500 29L955 296V${H-25}H45Z" fill="${p.bg}"/>`+
     rect(76,31,848,H-128,p.fg,6)+e.copy('title',111,69,525,85,{size:62,font:'sans',weight:800,tracking:-2,color:p.bg,lines:2})+e.copy('detail',114,171,526,44,{size:22,font:'sans',weight:400,tracking:1,color:p.bg,lines:2})+e.copy('guest_note',114,232,526,35,{size:18,font:'mono',weight:400,tracking:3,color:p.bg,lines:1})+qr(710,57,180)+
     `<path d="M45 287L500 544L955 287V${H-27}H45Z" fill="${p.bg}"/><path d="M45 287L437 508L45 ${H-27}M955 287L563 508L955 ${H-27}" fill="none" stroke="${p.fg}" stroke-width="2" opacity=".45"/><path d="M45 ${H-27}L432 435Q500 396 568 435L955 ${H-27}" fill="${p.accent}"/>`+
     logo('hangover',238,H-133,524,p.inkAccent)+line(72,H-51,928,H-51,p.inkAccent,1,'opacity=".28"');
   },
   'luggage-tag':e=>{
    const {H,p,rect,line,circle,logo,qr,esc,uid}=e,id=esc(uid+'-tag');
    return `<defs><mask id="${id}"><rect width="1000" height="${H}" fill="#fff"/><circle cx="500" cy="210" r="41" fill="#000"/></mask></defs><path d="M497 195C324 181 320 32 455 32H548C689 32 680 180 501 195" fill="none" stroke="${p.fg}" stroke-width="15"/><g mask="url(#${id})"><path d="M213 105H787L923 283V${H-84}Q923 ${H-31} 870 ${H-31}H130Q77 ${H-31} 77 ${H-84}V283Z" fill="${p.bg}"/>`+
     `<path d="M234 134H766L892 294V${H-92}Q892 ${H-61} 861 ${H-61}H139Q108 ${H-61} 108 ${H-92}V294Z" fill="none" stroke="${p.fg}" stroke-width="2" stroke-dasharray="6 8" opacity=".6"/>`+
     circle(500,210,56,'none',`stroke="${p.accent}" stroke-width="8"`)+logo('h',263,371,475)+e.copy('tagline',150,954,700,43,{size:22,font:'mono',weight:400,align:'center',tracking:3,color:p.fg,lines:2})+
     e.copy('title',150,1030,702,102,{size:80,font:'sans',weight:800,tracking:-2,color:p.fg,lines:2})+e.copy('detail',153,1157,692,55,{size:24,font:'sans',weight:400,tracking:1,color:p.fg,lines:2})+line(152,1230,849,1230,p.accent,4)+qr(370,H-420,260)+e.copy('tag_code',160,H-123,680,35,{size:18,font:'mono',weight:400,align:'center',tracking:3,color:p.fg,lines:1})+'</g>';
   },
   'cloakroom-token':e=>{
    const {H,p,rect,circle,line,logo,esc,uid}=e,id=esc(uid+'-token');
    return `<defs><mask id="${id}"><rect width="1000" height="${H}" fill="#fff"/><circle cx="500" cy="155" r="51" fill="#000"/></mask></defs><g mask="url(#${id})">`+
     rect(24,21,952,H-42,p.bg,238)+rect(47,44,906,H-88,'none',216,`stroke="${p.fg}" stroke-width="3" opacity=".45"`)+
     circle(500,155,75,'none',`stroke="${p.fg}" stroke-width="3" opacity=".6"`)+logo('hg',215,330,570,p.fg)+
     line(133,725,867,725,p.fg,3)+e.copy('number',133,767,734,357,{size:330,font:'sans',align:'center',weight:800,tracking:-12,color:p.fg,lines:1})+
     e.copy('wardrobe_label',180,H-159,640,55,{size:30,font:'mono',weight:400,align:'center',tracking:3,color:p.fg,lines:2})+line(240,H-75,760,H-75,p.fg,1,'opacity=".45"')+'</g>';
   },
   'cup':e=>{
    const {H,p,line,logo}=e;
    return `<ellipse cx="506" cy="${H-57}" rx="296" ry="40" fill="#000" opacity=".12"/><path d="M164 176L242 ${H-145}Q500 ${H-59} 758 ${H-145}L836 176Z" fill="${p.bg}"/><path d="M197 209L269 ${H-168}M803 209L731 ${H-168}" fill="none" stroke="${p.fg}" stroke-width="3" opacity=".27"/><ellipse cx="500" cy="176" rx="336" ry="79" fill="${p.fg}"/><ellipse cx="500" cy="176" rx="306" ry="54" fill="${p.bg}"/><path d="M199 162Q500 237 801 162" fill="none" stroke="#000" stroke-width="13" opacity=".12"/>`+
     logo('hang',271,411,460)+logo('over',273,566,458,p.accent)+line(263,762,738,762,p.fg,2)+e.copy('title',268,807,470,86,{size:61,font:'sans',weight:800,tracking:-2,color:p.fg,lines:2})+e.copy('detail',269,919,465,51,{size:22,font:'sans',weight:400,tracking:1,color:p.fg,lines:2})+
     e.copy('repeat_label',290,H-245,420,38,{size:18,font:'mono',weight:400,align:'center',tracking:3,color:p.fg,lines:1})+`<path d="M248 ${H-153}Q500 ${H-86} 752 ${H-153}" fill="none" stroke="${p.fg}" stroke-width="4" opacity=".65"/>`;
   },
   'cup-sleeve':e=>{
    const {p,logo,line,esc,uid}=e,id=esc(uid+'-sleeve'),shape='M68 64Q500 132 932 64L849 440Q500 382 151 440Z';
    return `<defs><clipPath id="${id}"><path d="${shape}"/></clipPath></defs><path d="M79 79Q500 147 943 79L860 455Q500 397 162 455Z" fill="#000" opacity=".12"/><path d="${shape}" fill="${p.fg}"/><g clip-path="url(#${id})">`+
     Array.from({length:72},(_,i)=>line(52+i*13,54,52+i*13,453,p.bg,2,'opacity=".09"')).join('')+logo('hangover',176,148,648,p.bg)+
     e.copy('title',204,261,596,68,{size:60,font:'sans',weight:800,tracking:-2,color:p.bg,lines:2})+e.copy('detail',207,346,590,41,{size:20,font:'sans',weight:400,tracking:1,color:p.bg,lines:2})+`</g><path d="M79 79Q500 144 921 79M154 425Q500 370 847 425" fill="none" stroke="${p.bg}" stroke-width="2" opacity=".45"/>`;
   },
   'table-tent':e=>{
    const {H,p,rect,line,logo,qr}=e;
    return `<path d="M801 115L956 ${H-127}L852 ${H-65}L753 140Z" fill="${p.accent}"/><path d="M124 ${H-87}L852 ${H-65}L956 ${H-127}L232 ${H-146}Z" fill="#000" opacity=".2"/><path d="M192 115H801L852 ${H-65}H124Z" fill="${p.bg}"/>`+
     line(208,142,783,142,p.fg,2,'opacity=".45"')+e.copy('table_label',240,207,520,39,{size:21,font:'mono',weight:400,tracking:3,color:p.fg,lines:1})+logo('hgr',235,365,517)+
     e.copy('title',230,637,535,103,{size:79,font:'sans',weight:800,tracking:-2,color:p.fg,lines:2})+e.copy('detail',232,772,530,53,{size:23,font:'sans',weight:400,tracking:1,color:p.fg,lines:2})+line(230,842,771,842,p.accent,4)+qr(236,925,230)+
     e.copy('info_label',514,976,268,40,{size:24,font:'mono',weight:400,tracking:3,color:p.fg,lines:1})+e.copy('info_signature',514,1030,268,37,{size:17,font:'mono',weight:400,tracking:3,color:p.fg,lines:2})+line(154,H-105,824,H-105,p.fg,2,'opacity=".4"');
   },
   'menu-fold':e=>{
    const {p,rect,line,logo,qr}=e;
    return rect(53,76,911,858,'#000',2,'opacity=".12"')+rect(40,58,305,858,p.fg)+rect(345,58,320,858,p.bg)+rect(665,58,293,858,p.accent)+
     logo('h',91,126,142,p.bg)+e.copy('title',79,317,225,91,{size:59,font:'sans',weight:800,tracking:-2,color:p.bg,lines:2})+e.copy('detail',82,426,228,58,{size:21,font:'sans',weight:400,tracking:1,color:p.bg,lines:2})+e.copy('fold_label',80,811,230,36,{size:15,font:'mono',weight:400,tracking:3,color:p.bg,lines:1})+
     e.copy('menu_heading',379,137,251,86,{size:70,font:'sans',weight:800,color:p.fg,lines:2})+line(379,248,630,248,p.accent,4)+[0,1,2,3,4].map(i=>e.copy('menu_index_'+(i+1),379,317+i*91,37,31,{size:16,font:'mono',weight:400,align:'center',tracking:1,color:p.fg,lines:1})+line(424,333+i*91,625,333+i*91,p.fg,2,'opacity=".55"')+line(424,353+i*91,576,353+i*91,p.fg,1,'opacity=".25"')).join('')+
     logo('hgr',700,143,222,p.inkAccent)+e.copy('side_signature',700,265,222,42,{size:16,font:'mono',weight:400,tracking:3,color:p.inkAccent,lines:2})+qr(709,604,205)+e.copy('info_label',711,832,205,40,{size:17,font:'mono',weight:400,tracking:3,color:p.inkAccent,lines:2})+
     line(345,69,345,905,'#000',4,'opacity=".2"')+line(352,69,352,905,p.fg,1,'opacity=".3"')+line(665,69,665,905,'#000',4,'opacity=".2"');
   },
   'vinyl-sleeve':e=>{
    const {p,rect,circle,line,logo,qr}=e;
    return circle(646,500,340,'#101820')+[320,305,285,270,252,236,217,196,174].map((r,i)=>circle(646,500,r,'none',`stroke="${i%2?'#52606b':'#263743'}" stroke-width="${i%3?1:2}"`)).join('')+
     circle(646,500,112,p.accent)+logo('hgr',570,478,153,p.inkAccent)+circle(646,500,11,'#101820')+
     rect(46,94,791,792,'#000',1,'opacity=".17"')+rect(31,79,787,792,p.bg)+rect(31,79,11,792,p.fg,0,'opacity=".18"')+
     logo('hangover',75,128,691)+logo('h',109,283,260,p.fg)+line(77,622,767,622,p.accent,4)+e.copy('title',80,637,442,85,{size:67,font:'sans',weight:800,tracking:-2,color:p.fg,lines:2})+e.copy('detail',83,731,438,45,{size:21,font:'sans',weight:400,tracking:1,color:p.fg,lines:2})+
     e.copy('side_label',80,800,442,42,{size:19,font:'mono',weight:400,tracking:3,color:p.fg,lines:1})+qr(569,652,180)+line(811,84,811,867,'#000',4,'opacity=".22"');
   },
   'record-label':e=>{
    const {p,rect,circle,line,logo,esc,uid}=e,id=esc(uid+'-record');
    return `<defs><mask id="${id}"><rect width="1000" height="1000" fill="#fff"/><circle cx="500" cy="500" r="37" fill="#000"/></mask></defs><g mask="url(#${id})">`+
     circle(500,500,492,p.bg)+circle(500,500,468,'none',`stroke="${p.fg}" stroke-width="2"`)+circle(500,500,432,'none',`stroke="${p.fg}" stroke-width="1" opacity=".45"`)+
     logo('hgr',216,169,568)+circle(500,500,72,'none',`stroke="${p.accent}" stroke-width="3"`)+e.copy('side',152,472,90,67,{size:43,font:'mono',weight:400,tracking:3,color:p.fg,lines:1})+e.copy('catalog_code',755,486,130,38,{size:21,font:'mono',weight:400,tracking:3,color:p.fg,lines:1})+
     line(228,601,772,601,p.accent,3)+e.copy('title',219,624,562,93,{size:67,font:'sans',weight:800,tracking:-2,color:p.fg,lines:2})+e.copy('detail',223,733,554,47,{size:21,font:'sans',weight:400,tracking:1,color:p.fg,lines:2})+e.copy('signature',275,823,450,45,{size:22,font:'mono',weight:400,align:'center',tracking:3,color:p.fg,lines:1})+'</g>';
   },
   'matchbox':e=>{
    const {p,rect,line,circle,logo}=e;
    return rect(94,134,824,379,'#000',8,'opacity=".13"')+rect(521,112,389,373,'#c1a172',7)+rect(536,127,359,342,'#604b31',4)+
     [0,1,2,3,4,5,6].map(i=>line(571+i*45,188,560+i*45,445,'#edc993',14)+circle(571+i*45,183,14,p.accent)+line(568+i*45,204,560+i*45,433,'#fff1ca',2,'opacity=".65"')).join('')+
     rect(78,108,557,371,p.bg,2)+rect(78,471,557,43,p.fg)+Array.from({length:39},(_,i)=>line(84+i*14,481,96+i*14,505,p.bg,3,'opacity=".6"')).join('')+
     logo('hgr',137,168,430)+e.copy('title',127,327,458,58,{size:56,font:'sans',weight:800,tracking:-2,color:p.fg,lines:2})+e.copy('detail',130,400,450,44,{size:19,font:'sans',weight:400,tracking:1,color:p.fg,lines:2})+line(626,114,626,468,'#000',5,'opacity=".2"')+e.copy('matches_label',643,516,235,39,{size:14,font:'mono',weight:400,align:'center',tracking:3,color:p.fg,lines:1});
   }
  };
  return {items,renderers};
 };
})(typeof window!=='undefined'?window:globalThis);

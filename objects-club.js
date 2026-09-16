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
  const renderers={
   'access-laminate':e=>{
    const {H,p,rect,line,logo,title,detail,qr,micro,esc,uid}=e,id=esc(uid+'-laminate');
    return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".24"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset=".73" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".15"/></linearGradient><mask id="${id}-hole"><rect width="1000" height="${H}" fill="#fff"/><rect x="372" y="46" width="256" height="45" rx="22" fill="#000"/></mask></defs>`+
     `<g mask="url(#${id}-hole)">`+rect(16,16,968,H-32,p.bg,45)+rect(30,30,940,H-60,'none',34,`stroke="${p.fg}" stroke-width="2" opacity=".65"`)+
     logo('hangover',64,153,872)+micro('H / CLUB NOTE',67,331,22)+logo('h',77,403,457)+
     rect(599,394,307,18,p.accent)+line(600,446,906,446,p.fg,2)+micro('HANGOVER',600,497,22)+micro('LAMINATE',600,538,17)+
     title(67,1082,86,p.fg,840)+detail(69,1154,26,p.fg,836)+line(67,1197,932,1197,p.fg,2)+
     micro('INFO / LINK',67,H-196,24)+micro('SCAN THE NIGHT',67,H-147,18)+qr(694,H-299,228)+
     `<path d="M45 49H282L824 966H620Z" fill="url(#${id})"/>`+rect(42,42,916,H-84,'none',28,`stroke="#fff" stroke-width="1" opacity=".28"`)+'</g>';
   },
   'wristband-silicone':e=>{
    const {H,p,rect,line,circle,logo,micro}=e;
    return rect(8,8,984,H-16,'#000',H/2,'opacity=".14"')+rect(8,4,984,H-16,p.bg,H/2)+
     rect(14,10,972,H-28,'none',H/2,`stroke="${p.fg}" stroke-width="1.4" opacity=".3"`)+
     line(80,14,918,14,p.fg,2,'opacity=".26"')+line(80,H-19,918,H-19,'#000',3,'opacity=".25"')+
     logo('hangover',112,29,418,'#00000038')+logo('hangover',111,27,418,p.fg)+logo('hgr',722,32,96,p.accent)+
     [0,1,2,3,4].map(i=>circle(580+i*15,H/2-2,2.8,p.accent)).join('')+micro('SILICONE',847,H/2+2,7,p.fg);
   },
   'guest-envelope':e=>{
    const {H,p,rect,line,logo,title,detail,qr,micro}=e;
    return rect(43,42,920,H-65,'#000',7,'opacity=".12"')+
     `<path d="M45 296L500 29L955 296V${H-25}H45Z" fill="${p.bg}"/>`+
     rect(76,31,848,H-128,p.fg,6)+title(111,132,62,p.bg,525)+detail(114,193,22,p.bg,526)+micro('GUEST NOTE',114,253,18,p.bg)+qr(710,57,180)+
     `<path d="M45 287L500 544L955 287V${H-27}H45Z" fill="${p.bg}"/><path d="M45 287L437 508L45 ${H-27}M955 287L563 508L955 ${H-27}" fill="none" stroke="${p.fg}" stroke-width="2" opacity=".45"/><path d="M45 ${H-27}L432 435Q500 396 568 435L955 ${H-27}" fill="${p.accent}"/>`+
     logo('hangover',238,H-133,524,'#091726')+line(72,H-51,928,H-51,'#091726',1,'opacity=".28"');
   },
   'luggage-tag':e=>{
    const {H,p,rect,line,circle,logo,title,detail,qr,micro,esc,uid}=e,id=esc(uid+'-tag');
    return `<defs><mask id="${id}"><rect width="1000" height="${H}" fill="#fff"/><circle cx="500" cy="210" r="41" fill="#000"/></mask></defs><path d="M497 195C324 181 320 32 455 32H548C689 32 680 180 501 195" fill="none" stroke="${p.fg}" stroke-width="15"/><g mask="url(#${id})"><path d="M213 105H787L923 283V${H-84}Q923 ${H-31} 870 ${H-31}H130Q77 ${H-31} 77 ${H-84}V283Z" fill="${p.bg}"/>`+
     `<path d="M234 134H766L892 294V${H-92}Q892 ${H-61} 861 ${H-61}H139Q108 ${H-61} 108 ${H-92}V294Z" fill="none" stroke="${p.fg}" stroke-width="2" stroke-dasharray="6 8" opacity=".6"/>`+
     circle(500,210,56,'none',`stroke="${p.accent}" stroke-width="8"`)+logo('h',263,371,475)+micro('TAKE IT WITH YOU',500,982,22,p.fg,'text-anchor="middle"')+
     title(150,1112,80,p.fg,702)+detail(153,1187,24,p.fg,692)+line(152,1230,849,1230,p.accent,4)+qr(370,H-420,260)+micro('H / TAG',500,H-99,18,p.fg,'text-anchor="middle"')+'</g>';
   },
   'cloakroom-token':e=>{
    const {H,p,rect,circle,line,logo,txt,micro,esc,uid}=e,id=esc(uid+'-token');
    return `<defs><mask id="${id}"><rect width="1000" height="${H}" fill="#fff"/><circle cx="500" cy="155" r="51" fill="#000"/></mask></defs><g mask="url(#${id})">`+
     rect(24,21,952,H-42,p.bg,238)+rect(47,44,906,H-88,'none',216,`stroke="${p.fg}" stroke-width="3" opacity=".45"`)+
     circle(500,155,75,'none',`stroke="${p.fg}" stroke-width="3" opacity=".6"`)+logo('hg',215,330,570,p.fg)+
     line(133,725,867,725,p.fg,3)+txt('001',500,1095,330,p.fg,'font-weight="800" text-anchor="middle" letter-spacing="-12"')+
     micro('GUARDAROBA',500,H-118,30,p.fg,'text-anchor="middle"')+line(240,H-75,760,H-75,p.fg,1,'opacity=".45"')+'</g>';
   },
   'cup':e=>{
    const {H,p,line,logo,title,detail,micro}=e;
    return `<ellipse cx="506" cy="${H-57}" rx="296" ry="40" fill="#000" opacity=".12"/><path d="M164 176L242 ${H-145}Q500 ${H-59} 758 ${H-145}L836 176Z" fill="${p.bg}"/><path d="M197 209L269 ${H-168}M803 209L731 ${H-168}" fill="none" stroke="${p.fg}" stroke-width="3" opacity=".27"/><ellipse cx="500" cy="176" rx="336" ry="79" fill="${p.fg}"/><ellipse cx="500" cy="176" rx="306" ry="54" fill="${p.bg}"/><path d="M199 162Q500 237 801 162" fill="none" stroke="#000" stroke-width="13" opacity=".12"/>`+
     logo('hang',271,411,460)+logo('over',273,566,458,p.accent)+line(263,762,738,762,p.fg,2)+title(268,877,61,p.fg,470)+detail(269,942,22,p.fg,465)+
     micro('H / REPEAT',500,H-220,18,p.fg,'text-anchor="middle"')+`<path d="M248 ${H-153}Q500 ${H-86} 752 ${H-153}" fill="none" stroke="${p.fg}" stroke-width="4" opacity=".65"/>`;
   },
   'cup-sleeve':e=>{
    const {p,logo,title,detail,line,esc,uid}=e,id=esc(uid+'-sleeve'),shape='M68 64Q500 132 932 64L849 440Q500 382 151 440Z';
    return `<defs><clipPath id="${id}"><path d="${shape}"/></clipPath></defs><path d="M79 79Q500 147 943 79L860 455Q500 397 162 455Z" fill="#000" opacity=".12"/><path d="${shape}" fill="${p.fg}"/><g clip-path="url(#${id})">`+
     Array.from({length:72},(_,i)=>line(52+i*13,54,52+i*13,453,p.bg,2,'opacity=".09"')).join('')+logo('hangover',176,148,648,p.bg)+
     title(204,316,60,p.bg,596)+detail(207,366,20,p.bg,590)+`</g><path d="M79 79Q500 144 921 79M154 425Q500 370 847 425" fill="none" stroke="${p.bg}" stroke-width="2" opacity=".45"/>`;
   },
   'table-tent':e=>{
    const {H,p,rect,line,logo,title,detail,qr,micro}=e;
    return `<path d="M801 115L956 ${H-127}L852 ${H-65}L753 140Z" fill="${p.accent}"/><path d="M124 ${H-87}L852 ${H-65}L956 ${H-127}L232 ${H-146}Z" fill="#000" opacity=".2"/><path d="M192 115H801L852 ${H-65}H124Z" fill="${p.bg}"/>`+
     line(208,142,783,142,p.fg,2,'opacity=".45"')+micro('ON THE TABLE',240,233,21)+logo('hgr',235,365,517)+
     title(230,718,79,p.fg,535)+detail(232,797,23,p.fg,530)+line(230,842,771,842,p.accent,4)+qr(236,925,230)+
     micro('INFO',514,1004,24)+micro('HANGOVER',514,1049,17)+line(154,H-105,824,H-105,p.fg,2,'opacity=".4"');
   },
   'menu-fold':e=>{
    const {p,rect,line,logo,title,detail,qr,micro,txt}=e;
    return rect(53,76,911,858,'#000',2,'opacity=".12"')+rect(40,58,305,858,p.fg)+rect(345,58,320,858,p.bg)+rect(665,58,293,858,p.accent)+
     logo('h',91,126,142,p.bg)+title(79,383,59,p.bg,225)+detail(82,448,21,p.bg,228)+micro('MENU / FOLD',80,834,15,p.bg)+
     txt('MENU',379,206,70,p.fg,'font-weight="800"')+line(379,248,630,248,p.accent,4)+[0,1,2,3,4].map(i=>micro(String(i+1).padStart(2,'0'),382,340+i*91,16)+line(424,333+i*91,625,333+i*91,p.fg,2,'opacity=".55"')+line(424,353+i*91,576,353+i*91,p.fg,1,'opacity=".25"')).join('')+
     logo('hgr',700,143,222,'#091726')+micro('HANGOVER',700,292,16,'#091726')+qr(709,604,205)+micro('INFO / LINK',711,858,17,'#091726')+
     line(345,69,345,905,'#000',4,'opacity=".2"')+line(352,69,352,905,p.fg,1,'opacity=".3"')+line(665,69,665,905,'#000',4,'opacity=".2"');
   },
   'vinyl-sleeve':e=>{
    const {p,rect,circle,line,logo,title,detail,qr,micro}=e;
    return circle(646,500,340,'#101820')+[320,305,285,270,252,236,217,196,174].map((r,i)=>circle(646,500,r,'none',`stroke="${i%2?'#52606b':'#263743'}" stroke-width="${i%3?1:2}"`)).join('')+
     circle(646,500,112,p.accent)+logo('hgr',570,478,153,'#091726')+circle(646,500,11,'#101820')+
     rect(46,94,791,792,'#000',1,'opacity=".17"')+rect(31,79,787,792,p.bg)+rect(31,79,11,792,p.fg,0,'opacity=".18"')+
     logo('hangover',75,128,691)+logo('h',109,283,260,p.fg)+line(77,622,767,622,p.accent,4)+title(80,700,67,p.fg,442)+detail(83,751,21,p.fg,438)+
     micro('SIDE / H',80,827,19)+qr(569,652,180)+line(811,84,811,867,'#000',4,'opacity=".22"');
   },
   'record-label':e=>{
    const {p,rect,circle,line,logo,title,detail,micro,esc,uid}=e,id=esc(uid+'-record');
    return `<defs><mask id="${id}"><rect width="1000" height="1000" fill="#fff"/><circle cx="500" cy="500" r="37" fill="#000"/></mask></defs><g mask="url(#${id})">`+
     circle(500,500,492,p.bg)+circle(500,500,468,'none',`stroke="${p.fg}" stroke-width="2"`)+circle(500,500,432,'none',`stroke="${p.fg}" stroke-width="1" opacity=".45"`)+
     logo('hgr',216,169,568)+circle(500,500,72,'none',`stroke="${p.accent}" stroke-width="3"`)+micro('A',152,517,43)+micro('H / 01',755,513,21)+
     line(228,601,772,601,p.accent,3)+title(219,697,67,p.fg,562)+detail(223,755,21,p.fg,554)+micro('HANGOVER',500,850,22,p.fg,'text-anchor="middle"')+'</g>';
   },
   'matchbox':e=>{
    const {p,rect,line,circle,logo,title,detail,micro}=e;
    return rect(94,134,824,379,'#000',8,'opacity=".13"')+rect(521,112,389,373,'#c1a172',7)+rect(536,127,359,342,'#604b31',4)+
     [0,1,2,3,4,5,6].map(i=>line(571+i*45,188,560+i*45,445,'#edc993',14)+circle(571+i*45,183,14,p.accent)+line(568+i*45,204,560+i*45,433,'#fff1ca',2,'opacity=".65"')).join('')+
     rect(78,108,557,371,p.bg,2)+rect(78,471,557,43,p.fg)+Array.from({length:39},(_,i)=>line(84+i*14,481,96+i*14,505,p.bg,3,'opacity=".6"')).join('')+
     logo('hgr',137,168,430)+title(127,366,56,p.fg,458)+detail(130,416,19,p.fg,450)+line(626,114,626,468,'#000',5,'opacity=".2"')+micro('H / MATCHES',708,533,14,p.fg,'text-anchor="middle"');
   }
  };
  return {items,renderers};
 };
})(typeof window!=='undefined'?window:globalThis);

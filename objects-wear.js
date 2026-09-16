/* HANGOVER — thirteen wearable object studies. Canonical marks supplied by the engine. */
(function(root){
'use strict';
root.createHangoverWear=function(){
 const items=[
  ['hoodie','Hoodie / After dark',600,690,'Felpa con cappuccio · tasca a marsupio e polsi a coste'],
  ['windbreaker','Windbreaker / Signal',620,680,'Giacca leggera · zip centrale e pannelli a contrasto'],
  ['longsleeve','Longsleeve / Extended',620,660,'Maglia a maniche lunghe · segno frontale e stampa sulla manica'],
  ['bucket','Bucket / Orbit',300,230,'Cappello a secchiello · tesa impunturata e occhielli'],
  ['beanie','Beanie / Night shift',250,285,'Berretto a coste · risvolto e inserto tessuto'],
  ['socks','Socks / Double step',300,430,'Calze in coppia · coste, tallone e punta a contrasto'],
  ['bandana','Bandana / Four corners',600,600,'Foulard quadrato · bordo grafico e segno centrale'],
  ['scarf','Scarf / Long loop',340,720,'Sciarpa ripiegata · maglia jacquard e frange'],
  ['crossbody','Crossbody / Night carry',340,300,'Borsa a tracolla · fibbia, zip e tasca frontale'],
  ['gymbag','Gym bag / Departure',500,340,'Borsone cilindrico · manici, tracolla e tasca laterale'],
  ['phone-strap','Phone strap / Connected',240,420,'Cinturino da polso · fettuccia, moschettone e linguetta'],
  ['enamel-pin','Enamel pin / Core',40,48,'Spilla smaltata · bordo metallico e segno H'],
  ['woven-label','Woven label / Inside',65,30,'Etichetta tessuta · estremità ripiegate e trama visibile']
 ].map(([id,name,mmw,mmh,description])=>({id,name,category:'wear',mmw,mmh,description,mockup:true,event:false,qr:false}));
 const path=(d,fill,stroke='none',width=2,extra='')=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
 const seam=(d,c,width=2,opacity=.38)=>path(d,'none',c,width,`opacity="${opacity}" stroke-dasharray="5 6"`);
 const strokes=(n,fn)=>Array.from({length:n},(_,i)=>fn(i)).join('');
 const shade=(uid)=>`<defs><linearGradient id="${uid}-shade" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient></defs>`;
 const renderers={
  hoodie(e){
   const {p,logo,line,rect,uid}=e,body='M337 200L242 231L65 544L168 615L277 426L265 1008Q500 1049 735 1008L723 426L832 615L935 544L758 231L663 200Z';
   return shade(uid)+path(body,p.bg,p.fg,4)+path(body,`url(#${uid}-shade)`)+
    path('M336 229Q290 151 350 87Q405 37 500 43Q596 37 650 87Q710 151 664 229L598 279L402 279Z',p.bg,p.fg,4)+
    path('M375 214Q350 132 406 101Q500 64 594 101Q650 132 625 214L561 261H439Z',p.fg)+
    path('M400 214Q394 154 433 138Q500 114 567 138Q606 154 600 214L552 255H448Z',p.bg)+
    path('M337 213Q408 278 500 285Q592 278 663 213','none',p.fg,4)+
    seam('M242 247Q292 320 277 426M758 247Q708 320 723 426M285 982Q500 1021 715 982',p.fg)+
    path('M69 548L160 611L131 671L37 610Z',p.accent,p.fg,3)+path('M840 611L931 548L963 610L869 671Z',p.accent,p.fg,3)+
    strokes(8,i=>line(47+i*11,612+i*7,70+i*11,563+i*7,p.bg,2,'opacity=".5"'))+
    strokes(8,i=>line(874+i*11,652-i*7,851+i*11,603-i*7,p.bg,2,'opacity=".5"'))+
    path('M265 988Q500 1029 735 988L735 1068Q500 1097 265 1068Z',p.bg,p.fg,3)+
    strokes(32,i=>line(280+i*14,1005+14*Math.sin(i/31*Math.PI),280+i*14,1066+14*Math.sin(i/31*Math.PI),p.fg,2,'opacity=".2"'))+
    path('M370 663H630L696 846Q500 876 304 846Z',p.bg,p.fg,3)+
    path('M370 663L330 768M630 663L670 768','none',p.accent,7)+seam('M382 680H618L678 831Q500 857 322 831',p.fg)+
    logo('h',409,343,182,p.fg)+logo('hangover',357,752,286,p.fg)+
    line(434,261,422,399,p.accent,5)+line(566,261,578,399,p.accent,5)+rect(416,396,12,30,p.fg,5)+rect(572,396,12,30,p.fg,5)+
    rect(694,969,32,49,p.accent,2)+logo('h',702,981,16,p.bg);
  },
  windbreaker(e){
   const {p,logo,rect,line,circle,uid}=e,body='M374 100L299 170L230 191L50 520L149 593L280 401L259 987Q500 1033 741 987L720 401L851 593L950 520L770 191L701 170L626 100Z';
   return shade(uid)+path(body,p.bg,p.fg,4)+path(body,`url(#${uid}-shade)`)+
    path('M374 100L417 71H583L626 100L599 229H401Z',p.fg,p.fg,3)+path('M416 83H584L561 207H439Z',p.bg)+
    path('M299 170L235 194L138 361L307 308L500 387L693 308L862 361L765 194L701 170L651 272L500 327L349 272Z',p.accent)+
    path('M151 360L306 317L500 396L694 317L849 360','none',p.fg,7)+
    path('M50 520L149 593L118 645L23 578Z',p.bg,p.fg,4)+path('M851 593L950 520L977 578L882 645Z',p.bg,p.fg,4)+
    seam('M68 520L147 577M853 577L932 520M284 952Q500 989 716 952M232 204L294 387M768 204L706 387',p.fg)+
    rect(488,216,24,769,p.fg,3)+rect(496,214,8,774,p.bg,2)+strokes(42,i=>line(491,234+i*17,509,234+i*17,p.fg,2))+
    rect(479,443,42,67,p.fg,12)+rect(490,457,20,33,p.bg,7)+
    path('M319 636L408 756M681 636L592 756','none',p.fg,8)+path('M326 637L415 757M674 637L585 757','none',p.accent,3)+
    circle(419,764,6,p.fg)+circle(581,764,6,p.fg)+logo('hgr',303,430,145,p.fg)+logo('h',577,426,96,p.fg)+
    line(280,996,290,1030,p.accent,5)+line(720,996,710,1030,p.accent,5)+circle(290,1033,8,p.fg)+circle(710,1033,8,p.fg);
  },
  longsleeve(e){
   const {p,logo,line,uid}=e,body='M385 88Q500 165 615 88L718 135L953 797L827 849L680 458L706 960Q500 990 294 960L320 458L173 849L47 797L282 135Z';
   return shade(uid)+path(body,p.bg,p.fg,4)+path(body,`url(#${uid}-shade)`)+
    path('M385 88Q500 165 615 88L600 119Q500 193 400 119Z',p.fg)+
    path('M401 105Q500 162 599 105','none',p.accent,4)+
    seam('M289 149Q352 240 320 458M711 149Q648 240 680 458M310 937Q500 966 690 937',p.fg)+
    path('M47 797L173 849L149 906L23 855Z',p.accent,p.fg,3)+path('M827 849L953 797L977 855L851 906Z',p.accent,p.fg,3)+
    strokes(10,i=>line(38+i*11,853+i*4.5,53+i*11,817+i*4.5,p.bg,2,'opacity=".4"'))+
    strokes(10,i=>line(857+i*11,894-i*4.5,842+i*11,858-i*4.5,p.bg,2,'opacity=".4"'))+
    logo('hangover',337,302,326,p.fg)+logo('hgr',396,460,208,p.accent)+
    `<g transform="translate(276 420) rotate(110)">${logo('over',0,0,270,p.fg)}</g>`+
    path('M298 956Q500 986 702 956L704 989Q500 1019 296 989Z',p.bg,p.fg,3)+
    seam('M306 981Q500 1007 694 981',p.fg);
  },
  bucket(e){
   const {p,logo,circle,uid}=e;
   return shade(uid)+path('M202 395Q500 335 798 395L956 581Q993 621 916 655Q500 762 84 655Q7 621 44 581Z',p.bg,p.fg,4)+
    path('M202 395Q500 335 798 395L956 581Q993 621 916 655Q500 762 84 655Q7 621 44 581Z',`url(#${uid}-shade)`)+
    [0,1,2,3].map(i=>path(`M${74+i*24} ${611-i*30}Q500 ${728-i*45} ${926-i*24} ${611-i*30}`,'none',p.fg,2,'opacity=".34"')).join('')+
    path('M253 138Q500 45 747 138L802 431Q500 529 198 431Z',p.bg,p.fg,4)+
    path('M253 138Q500 233 747 138Q500 48 253 138Z',p.bg,p.fg,3)+
    path('M265 158Q500 244 735 158','none',p.fg,2,'opacity=".45"')+
    path('M220 369Q500 454 780 369L790 422Q500 510 210 422Z',p.accent)+
    seam('M267 156L223 415M733 156L777 415M228 388Q500 468 772 388',p.fg)+
    logo('hgr',345,272,310,p.fg)+circle(300,262,10,p.fg)+circle(300,262,5,p.bg)+circle(700,262,10,p.fg)+circle(700,262,5,p.bg);
  },
  beanie(e){
   const {p,logo,rect,uid}=e;
   const crown='M180 807L207 419Q224 107 500 74Q776 107 793 419L820 807Z';
   return shade(uid)+path(crown,p.bg,p.fg,4)+path(crown,`url(#${uid}-shade)`)+
    strokes(26,i=>{const x=219+i*22.5,t=(x-500)/281;return path(`M${500+t*57} ${99+Math.abs(t)*27}Q${x} 227 ${x} 474L${x+t*15} 793`,'none',p.fg,5,'opacity=".19"');})+
    path('M480 85L486 299M520 85L514 299','none',p.fg,3,'opacity=".45"')+
    path('M172 746Q500 793 828 746L839 1037Q500 1097 161 1037Z',p.bg,p.fg,4)+
    strokes(34,i=>lineCurve(185+i*19,766,1041,p.fg))+
    path('M177 781Q500 827 823 781M173 1005Q500 1060 827 1005','none',p.fg,2,'opacity=".4"')+
    rect(390,810,220,201,p.accent,6)+rect(404,824,192,173,'none',3,`stroke="${p.bg}" stroke-width="2" stroke-dasharray="4 5"`)+logo('h',449,841,102,p.bg);
  },
  socks(e){
   const {p,logo,rect,line}=e;
   const sock=(x,y,rot,reverse)=>`<g transform="translate(${x} ${y}) rotate(${rot})">`+
    path('M0 0H260V649Q260 744 182 817L-33 1018Q-102 1084 -172 1027Q-230 977 -168 909L0 725Z',p.bg,p.fg,4)+
    rect(0,0,260,186,p.bg,2)+rect(0,63,260,23,p.accent)+rect(0,103,260,12,p.fg)+
    strokes(17,i=>line(9+i*15,9,9+i*15,181,p.fg,2,'opacity=".3"'))+
    path('M0 590H260V649Q260 708 225 755L139 679H0Z',p.accent)+
    path('M-117 855L-33 1018Q-103 1084 -172 1027Q-230 977 -168 909Z',p.accent)+
    seam('M17 204V578M242 204V578M-97 864L-21 1005M153 687L220 748',p.fg)+
    logo(reverse?'hg':'h',reverse?43:73,291,reverse?174:113,p.fg)+
    path('M16 215H242M16 239H242','none',p.fg,2,'opacity=".3"')+'</g>';
   return sock(375,65,8,false)+sock(586,301,-10,true);
  },
  bandana(e){
   const {p,logo,rect,circle}=e;
   return path('M90 64L936 96L910 939L63 905Z',p.bg,p.fg,4)+
    path('M90 64L936 96L910 939L63 905Z',p.fg,'none',0,'opacity=".035"')+
    `<g transform="translate(91 93) rotate(2 410 410)">`+
    rect(14,14,792,792,'none',0,`stroke="${p.accent}" stroke-width="35"`)+
    rect(42,42,736,736,'none',0,`stroke="${p.fg}" stroke-width="3"`)+
    rect(91,91,638,638,'none',0,`stroke="${p.fg}" stroke-width="2"`)+
    strokes(9,i=>{const t=125+i*71;return circle(t,66,5,p.fg)+circle(t,754,5,p.fg)+circle(66,t,5,p.fg)+circle(754,t,5,p.fg);})+
    path('M410 157L663 410L410 663L157 410Z','none',p.accent,4)+
    logo('hg',249,334,322,p.fg)+
    [ [114,114,0],[706,114,90],[706,706,180],[114,706,270] ].map(([x,y,r])=>`<g transform="translate(${x} ${y}) rotate(${r})">${logo('h',0,0,69,p.fg)}</g>`).join('')+
    '</g>'+seam('M104 78L922 109L897 925L77 892Z',p.fg)+path('M492 80L514 923M78 487L923 514','none',p.fg,3,'opacity=".11"');
  },
  scarf(e){
   const {p,logo,line,uid}=e;
   return shade(uid)+path('M213 266Q258 83 521 70Q738 55 793 239L688 382Q545 250 349 382Z',p.bg,p.fg,4)+
    path('M285 259Q483 139 700 241L650 338Q472 257 349 377Z',p.fg,'none',0,'opacity=".17"')+
    path('M349 314L672 315L786 1786L448 1819Z',p.accent,p.fg,4)+
    path('M220 271L538 294L457 1982L127 1951Z',p.bg,p.fg,4)+
    path('M220 271L538 294L457 1982L127 1951Z',`url(#${uid}-shade)`)+
    seam('M236 303L147 1929M520 323L439 1947M680 587L767 1768',p.fg)+
    [640,728,1624,1712].map(y=>path(`M${233-(y-270)*.055} ${y}L${524-(y-294)*.048} ${y+25}`,'none',p.fg,20)).join('')+
    `<g transform="translate(213 1410) rotate(-87)">${logo('hangover',0,0,520,p.fg)}</g>`+
    `<g transform="translate(687 935) rotate(86)">${logo('over',0,0,470,p.bg)}</g>`+
    strokes(18,i=>line(139+i*17.8,1958+i*1.6,136+i*17.8,2040+(i%3)*14+i*1.6,p.bg,9))+
    strokes(18,i=>line(452+i*18.5,1815-i*1.8,458+i*18.5,1890+(i%3)*13-i*1.8,p.accent,8));
  },
  crossbody(e){
   const {p,logo,rect,line,circle,chrome,uid}=e;
   return shade(uid)+path('M219 489Q145 390 261 178Q357 33 581 72Q852 132 805 462','none',p.bg,63)+
    seam('M219 489Q145 390 261 178Q357 33 581 72Q852 132 805 462',p.fg,3,.7)+
    `<g transform="translate(658 132) rotate(31)">${rect(0,0,110,104,chrome,13)}${rect(15,15,80,73,p.bg,8)}${rect(50,7,10,88,chrome,3)}</g>`+
    path('M116 414Q122 369 181 373L830 424Q891 432 885 493L848 764Q841 820 781 822L155 774Q102 767 103 716Z',p.bg,p.fg,4)+
    path('M116 414Q122 369 181 373L830 424Q891 432 885 493L848 764Q841 820 781 822L155 774Q102 767 103 716Z',`url(#${uid}-shade)`)+
    path('M130 427L860 479','none',p.fg,12)+path('M133 427L855 479','none',p.bg,3)+
    strokes(48,i=>line(145+i*14.5,424+i*1.03,145+i*14.5,432+i*1.03,p.fg,2))+
    `<g transform="translate(765 463) rotate(4)">${rect(0,0,31,77,chrome,8)}${rect(9,20,13,41,p.bg,5)}</g>`+
    path('M183 542L794 586L778 744L171 704Z',p.bg,p.fg,3)+seam('M198 559L776 601L765 726L189 689Z',p.fg)+
    logo('hangover',230,602,482,p.fg)+rect(155,469,57,51,p.accent,3)+logo('h',174,477,21,p.bg)+
    circle(136,746,7,p.fg)+circle(815,793,7,p.fg);
  },
  gymbag(e){
   const {p,logo,line,rect,circle,chrome,uid}=e;
   return shade(uid)+path('M112 432Q80 42 432 64Q700 61 904 357','none',p.bg,25)+seam('M112 432Q80 42 432 64Q700 61 904 357',p.fg,2,.6)+
    path('M168 238Q132 192 215 187L797 187Q875 196 912 324L925 459Q922 560 834 580L185 580Q71 572 64 458L64 352Q80 253 168 238Z',p.bg,p.fg,4)+
    path('M168 238Q132 192 215 187L797 187Q875 196 912 324L925 459Q922 560 834 580L185 580Q71 572 64 458L64 352Q80 253 168 238Z',`url(#${uid}-shade)`)+
    path('M174 241Q74 252 77 405Q71 561 179 563Q273 549 268 405Q264 252 174 241Z',p.bg,p.fg,4)+
    path('M174 257Q92 273 92 405Q90 542 179 547Q252 533 252 405Q247 274 174 257Z','none',p.fg,2,'stroke-dasharray="5 5" opacity=".5"')+
    path('M297 203V570M739 203V574','none',p.fg,34)+path('M297 203V570M739 203V574','none',p.bg,20)+
    path('M297 293V153Q297 94 349 94H436Q487 94 487 153V204M548 204V153Q548 94 599 94H686Q739 94 739 153V293','none',p.fg,27)+
    path('M297 293V153Q297 94 349 94H436Q487 94 487 153V204M548 204V153Q548 94 599 94H686Q739 94 739 153V293','none',p.bg,17)+
    line(320,220,710,220,p.fg,6)+strokes(29,i=>line(327+i*13,215,327+i*13,225,p.fg,2))+rect(659,221,49,19,chrome,5)+
    logo('hangover',333,346,372,p.fg)+logo('h',137,362,74,p.accent)+
    path('M782 294Q861 290 877 379V461Q865 501 784 500Z',p.accent,p.fg,2)+line(789,312,858,312,p.bg,5)+
    rect(98,317,29,18,chrome,5)+rect(873,317,29,18,chrome,5)+circle(851,313,6,chrome)+
    line(323,537,716,537,p.fg,2,'stroke-dasharray="5 5" opacity=".5"');
  },
  'phone-strap'(e){
   const {p,logo,rect,line,chrome,uid}=e;
   return shade(uid)+path('M430 1190Q114 796 228 344Q294 86 518 103Q746 107 768 360Q800 788 526 1204','none',p.fg,103)+
    path('M430 1190Q114 796 228 344Q294 86 518 103Q746 107 768 360Q800 788 526 1204','none',p.bg,92)+
    seam('M430 1190Q114 796 228 344Q294 86 518 103Q746 107 768 360Q800 788 526 1204',p.fg,3,.48)+
    `<g transform="translate(220 475) rotate(84)">${logo('hangover',0,0,270,p.fg)}</g>`+
    `<g transform="translate(651 815) rotate(-68)">${logo('hgr',0,0,180,p.accent)}</g>`+
    rect(390,1138,184,180,p.bg,26)+rect(406,1154,152,148,'none',18,`stroke="${p.fg}" stroke-width="2" stroke-dasharray="5 5"`)+logo('hgr',421,1192,122,p.fg)+
    rect(434,1299,98,116,chrome,20)+rect(453,1319,60,74,p.bg,11)+
    path('M483 1384C391 1384 389 1512 481 1512C550 1512 559 1453 531 1417','none',chrome,25)+
    line(528,1415,547,1468,p.fg,13)+
    path('M404 1542H562V1580L608 1602V1669H358V1602L404 1580Z',p.accent,p.fg,3)+
    rect(458,1549,48,49,p.bg,10)+logo('hgr',420,1617,125,p.bg);
  },
  'enamel-pin'(e){
   const {p,logo,uid}=e;
   const shell='M500 60L858 252L911 691Q916 831 799 938L500 1134L201 938Q84 831 89 691L142 252Z';
   return `<defs><linearGradient id="${uid}-rim" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#536e84"/><stop offset=".2" stop-color="#effcff"/><stop offset=".36" stop-color="#7a93a4"/><stop offset=".49" stop-color="#fff"/><stop offset=".56" stop-color="#466077"/><stop offset=".77" stop-color="#bed5df"/><stop offset="1" stop-color="#eff7fa"/></linearGradient><linearGradient id="${uid}-enamel" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#fff" stop-opacity=".22"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient></defs>`+
    path(shell,`url(#${uid}-rim)`,'#456075',3)+
    path('M500 111L816 283L865 695Q870 809 769 900L500 1082L231 900Q130 809 135 695L184 283Z',p.bg,'#334c5f',8)+
    path('M500 111L816 283L865 695Q870 809 769 900L500 1082L231 900Q130 809 135 695L184 283Z',`url(#${uid}-enamel)`)+
    path('M500 176L745 313','none','#fff',6,'opacity=".7"')+
    logo('h',284,350,432,`url(#${uid}-rim)`)+logo('h',304,370,392,p.fg)+
    path('M341 934L500 1041L659 934','none',p.accent,12)+
    path('M177 709Q164 813 255 886','none','#fff',8,'opacity=".36"');
  },
  'woven-label'(e){
   const {p,logo,rect,line,uid}=e;
   return shade(uid)+path('M74 109L211 76L788 82L926 116L906 378L787 344L208 354L92 380Z',p.bg,p.fg,3)+
    path('M74 109L211 76L208 354L92 380Z',p.fg,'none',0,'opacity=".22"')+
    path('M788 82L926 116L906 378L787 344Z',p.fg,'none',0,'opacity=".14"')+
    path('M210 77L788 82L787 344L208 354Z',p.bg,p.fg,3)+
    path('M210 77L788 82L787 344L208 354Z',`url(#${uid}-shade)`)+
    strokes(54,i=>line(221+i*10.4,92,221+i*10.4,341,p.fg,1,'opacity=".09"'))+
    strokes(36,i=>line(220,94+i*6.7,777,94+i*6.7,p.fg,1,'opacity=".10"'))+
    seam('M103 116L120 363M890 119L876 358M226 93L226 336M770 99L770 327',p.fg,3,.6)+
    rect(246,121,507,11,p.accent)+rect(246,307,507,11,p.accent)+logo('hgr',286,152,428,p.fg);
  }
 };
 function lineCurve(x,y,end,c){return path(`M${x} ${y+18*Math.sin((x-180)/640*Math.PI)}L${x} ${end+24*Math.sin((x-180)/640*Math.PI)}`,'none',c,5,'opacity=".21"');}
 return {items,renderers};
};
})(typeof window!=='undefined'?window:globalThis);

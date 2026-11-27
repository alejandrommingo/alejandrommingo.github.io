(async function archivoPolitico(){
  "use strict";
  const $ = id => document.getElementById(id);
  const icons = {
    search:'<circle cx="10.5" cy="10.5" r="6.4"/><path d="m16 16 5 5"/>',
    left:'<path d="m14 6-6 6 6 6"/>', right:'<path d="m10 6 6 6-6 6"/>',
    'arrow-down':'<path d="M12 4v15m-6-6 6 6 6-6"/>', 'north-east':'<path d="M6 18 18 6M7 6h11v11"/>',
    camera:'<path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="3.5"/>',
    list:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M3 6h1M3 12h1M3 18h1"/>',
    bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>', sprout:'<path d="M12 21v-9M12 16C6 16 3 13 3 8c6 0 9 2 9 8Zm0-4c0-6 4-9 10-9-1 6-4 9-10 9Z"/>',
    parliament:'<path d="m2 9 10-6 10 6H2zm2 11h16M6 11v6m4-6v6m4-6v6m4-6v6"/>',
    paper:'<path d="M3 4h14v16H5a2 2 0 0 1-2-2V4Zm14 3h4v11a2 2 0 0 1-2 2h-2M6 8h8M6 12h8M6 16h5"/>',
    x:'<path d="m6 6 12 12M18 6 6 18"/>',link:'<path d="m9 15 6-6m-5-3 2-2a5 5 0 0 1 7 7l-3 3m-2 4-2 2a5 5 0 0 1-7-7l3-3"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
    book:'<path d="M3 4c3-1 6 0 9 2 3-2 6-3 9-2v14c-3-1-6 0-9 2-3-2-6-3-9-2zM12 6v14"/>',
    download:'<path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/>'
  };
  const icon = name => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || ""}</svg>`;
  document.querySelectorAll("[data-icon]").forEach(node => { node.outerHTML = icon(node.dataset.icon); });
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const norm = value => String(value ?? "").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const label = {medidas:"Medidas y derechos", representacion:"Representación", hemeroteca:"Hemeroteca", historia:"Historia política"};
  const month = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const fmtDate = (iso, year=true) => `${Number(iso.slice(8))} ${month[Number(iso.slice(5,7))-1]}${year ? " "+iso.slice(0,4) : ""}`;
  const time = iso => Date.parse(iso+"T00:00:00Z");
  const sourceLink = s => /^https?:\/\//.test(s.url) ? `<a class="source-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)} ${icon("north-east")}</a>` : "";
  const sourceLinks = sources => (sources || []).map(sourceLink).join(" ");
  let db;
  try {
    const response = await fetch("archivo.json");
    if (!response.ok) throw Error(String(response.status));
    db = await response.json();
  } catch {
    $("selection").innerHTML = '<h3>No se ha podido abrir el archivo</h3><p>Comprueba la conexión y vuelve a cargar la página. También puedes <a class="source-link" href="archivo.json">abrir los datos</a>.</p>';
    return;
  }
  const events = db.events;
  const byId = new Map(events.map((e,i) => [e.id,i]));
  const series = new Map(db.series.map(s => [s.name,s]));
  const years = [...new Set(events.map(e => e.date.slice(0,4)))];
  const positions = events.map(e => time(e.date));
  const first = positions[0], last = positions.at(-1);
  const percent = stamp => 100 * (stamp-first)/(last-first);
  const snapshot = (seriesName, date) => series.get(seriesName)?.entries.filter(e => e.date<=date).at(-1);
  const otherSeries = db.series.filter(s => !["Congreso","Parlamento Europeo"].includes(s.name));
  const electionIds = ["europeas-2014","generales-2015","generales-2016","generales-abril-2019","europeas-2019","generales-noviembre-2019","generales-2023","europeas-2024"];
  const elections = electionIds.filter(id=>byId.has(id)).map(id=>{
    const e=events[byId.get(id)];
    return {id,date:e.date,name:(id.startsWith("europeas")?"Europeas":"Generales")+" del "+fmtDate(e.date)};
  });
  elections.push({date:"2026-11-29",name:"Generales convocadas para el 29 nov 2026"});
  const sourceGroups = [
    ...Object.entries(label).map(([cat,title])=>[title, events.filter(e=>e.category===cat).flatMap(e=>e.sources)]),
    ["Series electorales",db.series.flatMap(s=>s.entries.flatMap(e=>e.sources))]
  ];
  const searchText = events.map(e=>norm([e.id,e.title,e.short,e.detail,e.attribution,e.benefit,e.status,e.scope,e.case,e.date,(e.category==="hemeroteca"?"prensa tribunales":""),(/bulo|desmentido|contextualiz/i.test(e.status)?"bulos desinformación":""),(["pisa","nueva-york","neurona","ninera","carvajal","consultas-policiales","dina"].includes(e.case)?"lawfare":""),...(e.places||[]),...e.sources.map(s=>s.name)].join(" ")));
  let index=0, page="cronologia", localName="Senado", repName="Congreso", fromIndex=false;
  let searchState={query:"",category:"",year:"",scope:""};
  const panel=$("panel"), range=$("timeRange");


  function seriesOptions(items, selected) {
    const labels={Generales:"Cortes Generales",Europeas:"Parlamento Europeo",Autonómicas:"Comunidades autónomas",Municipales:"Ayuntamientos"};
    const groups=new Map();
    items.forEach(s=>{const key=labels[s.level]||s.level;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(s);});
    return [...groups].map(([key,ss])=>`<optgroup label="${esc(key)}">${ss.map(s=>`<option value="${esc(s.name)}" ${s.name===selected?"selected":""}>${esc(s.name)}</option>`).join("")}</optgroup>`).join("");
  }
  function storyButton(e, prefix) {
    return `<button type="button" class="story-row" data-detail="${esc(e.id)}"><span class="date-label">${esc(prefix)} · ${fmtDate(e.date)}${e.status?" · "+esc(e.status):""}</span><strong>${esc(e.title)}</strong>${icon("north-east")}</button>`;
  }
  function storyLane(category, title, glyph) {
    const date=events[index].date, all=events.filter(e=>e.category===category);
    const current=all.filter(e=>e.date===date);
    const previous=all.filter(e=>e.date<date).at(-1), upcoming=all.find(e=>e.date>date);
    let content="";
    if(current.length) content=current.map(e=>storyButton(e,"En esta fecha")).join("");
    else if(previous) content=storyButton(previous,"Última ficha hasta esta fecha");
    else content=`<p class="empty-line">${category==="medidas"?"Todavía no hay una medida documentada en este tramo.":"Todavía no hay un episodio documentado en este tramo."}</p>`;
    if(upcoming && !current.length) content+=storyButton(upcoming,"Siguiente en el archivo");
    return `<section class="lane ${category}"><div class="lane-head"><span class="lane-icon">${icon(glyph)}</span><h3>${title}</h3><button type="button" class="lite-button" data-filter="${category}">Ver todas ${icon("right")}</button></div>${content}</section>`;
  }
  function totalText(record) {
    if(!record) return "Sin dato";
    if(record.seats!=null) return String(record.seats);
    if(/disuelt/i.test(record.list))return "Disuelto";
    return "—";
  }
  function seatDiagram(active, capacity) {
    if(active==null)return "";
    const rings=capacity===350?7:4;
    const seats=[];
    const weights=Array.from({length:rings},(_,r)=>.46+.54*r/(rings-1));
    const weight=weights.reduce((a,b)=>a+b);
    const quotas=weights.map(w=>capacity*w/weight);
    const counts=quotas.map(Math.floor);
    const remainders=quotas.map((q,r)=>({r,fraction:q-counts[r]})).sort((a,b)=>b.fraction-a.fraction);
    for(let i=0,n=capacity-counts.reduce((a,b)=>a+b);i<n;i++)counts[remainders[i].r]++;
    counts.forEach((count,r)=>{
      const radius=44*weights[r];
      for(let i=0;i<count;i++){
        const angle=Math.PI*(1-(i+.5)/count);
        seats.push({angle,x:47+Math.cos(angle)*radius,y:46-Math.sin(angle)*radius});
      }
    });
    seats.sort((a,b)=>b.angle-a.angle);
    return `<svg class="hemicycle" viewBox="0 0 94 49" aria-hidden="true">${seats.map((p,i)=>`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${capacity===350?"0.87":"1.8"}" fill="${i<active?"#59295e":"#cac2ca"}"/>`).join("")}</svg>`;
  }
  function seatCell(name, date) {
    const e=snapshot(name,date); if(!e)return "";
    const capacity=name==="Congreso"?350:(date>="2024-06-09"?61:date>="2020-02-01"?59:54);
    const units=name==="Congreso"?"del Congreso":"de España";
    return `<div class="seat-cell"><div class="seat-name">${esc(name)}</div><div class="seat-number">${esc(totalText(e))} ${e.seats!=null?`<small>de ${capacity} ${units}</small>`:""}${seatDiagram(e.seats,capacity)}</div><p><strong>${esc(e.list)}</strong>${e.own!=null&&e.own!==e.seats?` · ${e.own} de Podemos`:""}</p>${e.seats==null?`<p>${esc(e.note)}</p>`:""}<a class="seat-source" href="#representacion=${encodeURIComponent(name)}">Ver serie y fuente ${icon("north-east")}</a></div>`;
  }
  function updateLocalCaption() {
    const date=events[index].date, s=series.get(localName), e=snapshot(localName,date);
    let text="Sin resultado registrado hasta esta fecha.";
    if(e){
      const unit=s.level==="Municipales"?"concejales":"escaños";
      text=(e.seats!=null?`${e.seats} ${unit} · `:"")+e.list+" · "+fmtDate(e.date)+". "+e.note;
    }
    $("localCaption").innerHTML=`${esc(text)} <a class="seat-source" href="#representacion=${encodeURIComponent(localName)}">Serie y fuentes ${icon("north-east")}</a>`;
  }
  function seatsLane() {
    const date=events[index].date;
    $("seatsLane").innerHTML=`<section class="lane representacion"><div class="lane-head"><span class="lane-icon">${icon("parliament")}</span><h3>Representación</h3><a class="lite-button" href="#representacion">Ver series ${icon("right")}</a></div><div class="snapshot">${seatCell("Congreso",date)}${seatCell("Parlamento Europeo",date)}</div><div class="local-control"><label for="localPicker">Otro órgano</label><select id="localPicker">${seriesOptions(otherSeries,localName)}</select></div><p class="local-caption" id="localCaption"></p></section>`;
    updateLocalCaption();
  }
  function renderYear(e) {
    const year=e.date.slice(0,4);
    $("asideYear").textContent=year;
    const list=events.filter(item=>item.date.startsWith(year)), count=list.length;
    $("yearCount").textContent=`${count} ${count===1?"hito":"hitos"}`;
    const idx=list.findIndex(v=>v.id===e.id), start=Math.max(0,Math.min(idx-2,count-6));
    $("yearList").innerHTML=list.slice(start,start+6).map(item=>`<button type="button" class="year-item" data-select="${esc(item.id)}" ${item.id===e.id?'aria-current="true"':""}><span>${fmtDate(item.date,false)} · ${esc(label[item.category])}</span><strong>${esc(item.title)}</strong></button>`).join("")+(count>6?`<button type="button" class="year-more" data-year-index="${year}">Ver los ${count} hitos ${icon("right")}</button>`:"");
  }
  function drawRuler() {
    const ticks=[];
    for(let year=2014;year<=2026;year++){
      for(let m=0;m<12;m++){
        const t=Date.UTC(year,m,1);
        if(t>first&&t<last)ticks.push(`<i class="${m===0?"major":""}" style="left:${percent(t)}%"></i>`);
      }
    }
    $("rulerTicks").innerHTML=ticks.join("");
    $("yearButtons").innerHTML=years.map(y=>{
      const pct=percent(Math.max(first,Date.UTC(Number(y),0,1)));
      return `<button type="button" data-year="${y}" style="left:${pct}%" aria-label="Ir a ${y}" aria-pressed="false">${y}</button>`;
    }).join("");
    range.min=String(first/86400000);range.max=String(last/86400000);range.step="1";
  }
  function renderChrono() {
    const e=events[index], year=e.date.slice(0,4), p=percent(positions[index]);
    $("prev").disabled=index===0;$("next").disabled=index===events.length-1;
    range.value=String(positions[index]/86400000);
    range.setAttribute("aria-valuetext",`${fmtDate(e.date)}. ${e.title}`);
    $("rulerProgress").style.width=p+"%";$("rulerKnob").style.left=p+"%";
    $("yearButtons").querySelectorAll("button").forEach(btn=>btn.setAttribute("aria-pressed",String(btn.dataset.year===year)));
    $("selection").innerHTML=`<div class="eyebrow">${icon("calendar")} ${fmtDate(e.date)} <span class="sep">/</span> ${esc(e.scope)}</div><h3>${esc(e.title)}</h3><p>${esc(e.short)}</p><button type="button" data-detail="${esc(e.id)}" class="lite-button">Leer la ficha y sus fuentes ${icon("north-east")}</button>`;
    $("socialLane").innerHTML=storyLane("medidas","Medidas y derechos","sprout");
    seatsLane();
    $("pressLane").innerHTML=storyLane("hemeroteca","Hemeroteca y tribunales","paper");
    renderYear(e);
    const c=snapshot("Congreso",e.date),eu=snapshot("Parlamento Europeo",e.date);
    const congressLabel=c?.seats!=null&&c.own!=null&&c.seats!==c.own?`${c.own} de ${c.seats}`:totalText(c);
    $("followText").innerHTML=`<b>${fmtDate(e.date)}</b><span>Congreso <strong>${esc(congressLabel)}</strong></span><span>Eurocámara <strong>${esc(totalText(eu))}</strong></span>`;
    $("followPrev").disabled=index===0;$("followNext").disabled=index===events.length-1;
  }
  function choose(idx, scroll=false) {
    if(idx==null||idx<0||idx>=events.length)return;
    index=idx;setPage("cronologia");renderChrono();
    history.replaceState(null,"","#hito="+events[index].id);
    if(scroll)$("explorar").scrollIntoView({block:"start"});
    sticky();
  }
  function nearest(stamp) {
    let lo=0,hi=positions.length;
    while(lo<hi){const mid=Math.floor((lo+hi)/2);if(positions[mid]<stamp)lo=mid+1;else hi=mid;}
    if(lo===0)return 0;
    if(lo===positions.length)return positions.length-1;
    return stamp-positions[lo-1]<positions[lo]-stamp?lo-1:lo;
  }
  function sticky() {
    const anchor=$("rulerBox").getBoundingClientRect();
    $("followBar").hidden=page!=="cronologia"||anchor.bottom>=0||$("explorar").getBoundingClientRect().bottom<100;
  }


  function dialogHeader(kicker) {
    return `<div class="dialog-head"><div class="eyebrow"><span class="short-rule"></span>${esc(kicker)}</div><button type="button" class="icon-button" data-close aria-label="Cerrar">${icon("x")}</button></div>`;
  }
  function showPanel(markup, focusSelector) {
    $("dialogInner").innerHTML=markup;
    if(!panel.open)panel.showModal();
    panel.scrollTop=0;
    if(focusSelector)panel.querySelector(focusSelector)?.focus({preventScroll:true});
  }
  function electionContext(e) {
    if(e.category!=="hemeroteca")return "";
    const t=time(e.date);
    const closest=elections.reduce((a,b)=>Math.abs(t-time(a.date))<=Math.abs(t-time(b.date))?a:b);
    const diff=Math.round((time(closest.date)-t)/86400000);
    const relation=diff===0?"Ese mismo día":`${Math.abs(diff)} ${Math.abs(diff)===1?"día":"días"} ${diff>0?"después":"antes"}`;
    const match=closest.id ? `<button type="button" class="lite-button" data-detail="${esc(closest.id)}">Ver resultado ${icon("right")}</button>`:"";
    return `<h3>La cita electoral más cercana</h3><p>${esc(closest.name)}. ${diff===0?"Coincidió con el episodio":relation+" del episodio"}. El cálculo incluye generales y europeas. ${match}</p>`;
  }
  function detail(e) {
    if(!panel.open)fromIndex=false;
    const related=e.case?events.filter(o=>o.case===e.case&&o.id!==e.id):[];
    const notes=e.attribution?`<div class="info-block"><h3>${e.category==="medidas"?"Quién la impulsó":e.category==="hemeroteca"?"Qué acredita la documentación":"Cómo leer este dato"}</h3><p>${esc(e.attribution)}</p></div>`:"";
    const benefits=e.benefit?`<div class="info-block green"><h3>Qué cambió en la práctica</h3><p>${esc(e.benefit)}</p></div>`:"";
    showPanel(`${dialogHeader(label[e.category])}<div class="dialog-body">${fromIndex?`<button type="button" class="lite-button back-index" data-back-index>${icon("left")} Volver a los resultados</button>`:""}<div class="date-label">${fmtDate(e.date)} · ${esc(e.status||e.scope)}</div><h2 id="dialogTitle" tabindex="-1">${esc(e.title)}</h2><p class="lead">${esc(e.short)}</p><p>${esc(e.detail)}</p>${notes}${benefits}${electionContext(e)}${related.length?`<h3>El mismo caso, fecha a fecha</h3><div class="related-links">${related.map(o=>`<button type="button" data-detail="${esc(o.id)}"><span>${fmtDate(o.date)} · ${esc(o.title)}</span>${icon("right")}</button>`).join("")}</div>`:""}<h3>Fuentes de la ficha</h3><div>${sourceLinks(e.sources)}</div><div class="dialog-bottom"><button type="button" class="control-primary" data-jump="${esc(e.id)}">Situar en la cronología ${icon("right")}</button><button type="button" class="lite-button" data-copy="${esc(e.id)}">${icon("link")} Copiar enlace</button></div><p id="shareStatus" aria-live="polite"></p></div>`,"#dialogTitle");
  }
  function openIndex(opts={}) {
    fromIndex=true;
    searchState={query:"",category:"",year:"",scope:"",...opts};
    const scopes=[...new Set(events.map(e=>e.scope))].sort((a,b)=>a.localeCompare(b,"es"));
    showPanel(`${dialogHeader("Consulta del archivo")}<div class="dialog-body"><h2 id="dialogTitle">Índice de hitos</h2><label class="search-box" for="query">${icon("search")}<input id="query" type="search" placeholder="Busca un caso, una medida, un lugar…" aria-label="Buscar hitos" autocomplete="off"></label><div class="filter-pills" id="filters">${[["","Todos"],...Object.entries(label)].map(([cat,name])=>`<button type="button" data-cat="${cat}" aria-pressed="${cat===searchState.category}">${esc(name)}</button>`).join("")}</div><div class="index-selects"><label>Año <select id="filterYear"><option value="">Todos</option>${years.map(y=>`<option ${y===searchState.year?"selected":""}>${y}</option>`).join("")}</select></label><label>Ámbito <select id="filterScope"><option value="">Todos</option>${scopes.map(s=>`<option ${s===searchState.scope?"selected":""}>${esc(s)}</option>`).join("")}</select></label></div><p class="result-count" id="resultCount" aria-live="polite"></p><div id="results" class="results"></div></div>`,"#query");
    $("query").value=searchState.query;
    results();
  }
  function results() {
    const terms=norm(searchState.query).trim().split(/\s+/).filter(Boolean);
    const list=events.filter((e,i)=>
      (!searchState.category||e.category===searchState.category)&&
      (!searchState.year||e.date.startsWith(searchState.year))&&
      (!searchState.scope||e.scope===searchState.scope)&&
      terms.every(t=>searchText[i].includes(t))
    );
    $("resultCount").textContent=`${list.length} ${list.length===1?"hito":"hitos"}`;
    $("results").innerHTML=list.length?list.map(e=>`<button type="button" class="result" data-detail="${esc(e.id)}"><span><span class="date-label">${fmtDate(e.date)} · ${esc(e.scope)}</span><strong>${esc(e.title)}</strong></span>${icon("right")}</button>`).join(""):'<p>Prueba con otro término o cambia los filtros.</p>';
    $("filters").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.cat===searchState.category)));
  }
  async function share(id) {
    const url=new URL(location.href);url.hash="ficha="+id;
    try { await navigator.clipboard.writeText(url.href);$("shareStatus").textContent="Enlace copiado."; }
    catch {
      $("shareStatus").innerHTML=`<label>Enlace a la ficha <input id="shareField" readonly value="${esc(url.href)}"></label>`;
      $("shareField").select();
    }
  }
  function representation() {
    const s=series.get(repName);
    const unit=s.level==="Municipales"?"Concejales":"Escaños";
    $("repPage").innerHTML=`<div class="eyebrow"><span class="short-rule"></span> Resultados y composición</div><h1>La <em>representación.</em></h1><p class="intro">Sigue a Podemos en el Congreso, el Senado, la Eurocámara, las 17 comunidades autónomas y ocho ayuntamientos. Junto a cada cifra figura la candidatura a la que corresponde.</p><div class="rep-picker"><label for="repPicker">Órgano o territorio</label><select id="repPicker">${seriesOptions(db.series,repName)}</select></div><h2>${esc(s.name)}</h2><div class="chart"><h3>${unit} por fecha</h3><p class="chart-intro">${s.name==="Congreso"?"Se distinguen el resultado de las listas, el de Sumar en 2023 y los diputados propios en el Grupo Mixto.":s.name==="Senado"?"Los votos directos y las designaciones autonómicas tienen vías distintas. La tabla identifica a qué corresponde cada registro.":"Las barras muestran el último resultado documentado de cada candidatura. La tabla explica sus cambios de composición."}</p><div aria-hidden="true">${barRows(s)}</div></div><div class="table-scroll" tabindex="0" aria-label="Tabla de representación"><table class="series-table"><thead><tr><th scope="col">Fecha</th><th scope="col">${unit}</th><th scope="col">Candidatura y alcance</th><th scope="col">Documentación</th></tr></thead><tbody>${s.entries.map(e=>`<tr><td>${fmtDate(e.date)}</td><td class="qty">${e.seats==null?"—":e.seats}</td><td>${esc(e.list)}${e.own!=null&&e.own!==e.seats?` <strong>(${e.own} de Podemos)</strong>`:""}<small>${esc(e.note)}</small></td><td>${sourceLinks(e.sources)}</td></tr>`).join("")}</tbody></table></div><p class="local-caption" style="margin-top:12px">El guion indica que la ficha carece de un recuento comparable. El cero corresponde a una ausencia de escaños documentada.</p>`;
  }
  function barRows(s) {
    const max=Math.max(1,...s.entries.map(e=>e.seats||0));
    return s.entries.map(e=>`<div class="bar-row"><span>${fmtDate(e.date)}</span>${e.seats!=null?`<div class="bar-track"><i class="bar-fill" style="width:${e.seats*100/max}%"></i></div>`:'<div class="break"></div>'}<strong>${e.seats??"—"}</strong></div>`).join("");
  }
  function sourcesPage() {
    const groups=sourceGroups.map(([name,items])=>{
      const unique=[...new Map(items.map(s=>[s.url,s])).values()].sort((a,b)=>a.name.localeCompare(b.name,"es"));
      return `<details class="source-group"><summary>${esc(name)} <span>· ${unique.length} referencias</span></summary><ul>${unique.map(s=>`<li>${sourceLink(s)}</li>`).join("")}</ul></details>`;
    }).join("");
    const total=new Set(sourceGroups.flatMap(([,items])=>items.map(s=>s.url))).size;
    $("sourcePage").innerHTML=`<div class="eyebrow"><span class="short-rule"></span> Documentación del archivo</div><h1>Fuentes <em>y criterios.</em></h1><p class="intro">Cada ficha enlaza los documentos que permiten contrastarla. La selección reúne ${events.length} hitos y ${total} referencias distintas hasta el ${fmtDate(db.cutoff)}.</p><div class="source-actions"><button type="button" class="control-primary" data-open-index>${icon("search")} Buscar una ficha</button><a class="source-link" href="archivo.json" download="hagamos-memoria.json">Descargar los datos ${icon("download")}</a></div><h2>Cómo leer el archivo</h2><div class="criteria"><article><h3>De quién es el escaño</h3><p>Las cifras siguen la lista electoral y, cuando se conoce, la afiliación. Las designaciones del Senado llevan su propia nota. Una disolución interrumpe el mandato ordinario. Los resultados autonómicos y municipales se mantienen como referencia electoral hasta la siguiente observación.</p></article><article><h3>Quién impulsó una medida</h3><p>Cada ficha identifica al proponente, los socios, el órgano que la aprobó y su alcance. Cuando hay datos de ejecución, aparecen junto a las personas destinatarias. También se recogen propuestas rechazadas, derogaciones y efectos adversos.</p></article><article><h3>Cómo terminó un caso</h3><p>La hemeroteca fecha la publicación, el desmentido y las resoluciones por separado. El término «lawfare» expresa una interpretación sobre el uso político de la justicia. La etiqueta de cada ficha indica si consta una falsedad, un archivo, una investigación, una condena o una decisión electoral. Los casos relacionados se pueden recorrer desde cualquier ficha.</p></article><article><h3>Qué sabemos sobre el voto</h3><p>Las fechas permiten medir cuánto tiempo separó una noticia de unas elecciones. Para estimar cuántos votos cambió haría falta comparar lo ocurrido con lo que cabría esperar sin esa exposición, atendiendo también a pactos, candidaturas y cambios de liderazgo. Las fichas citan expresamente los estudios que contrastan alguna de esas explicaciones.</p></article></div><h2>Investigación sobre la cobertura</h2><p class="source-text">Fenoll y Rodríguez Ballesteros (2016) estudiaron cómo cambió la cobertura digital tras las europeas de 2014. Encontraron diferencias según el medio. Palau-Sampio, Carratalá y Valera-Ordaz (2017) observaron que partidos y periódicos dieron más peso a las estrategias de campaña que a las propuestas en 2015.</p><div>${sourceLink({name:"Fenoll y Rodríguez Ballesteros (2016)",url:"https://doi.org/10.2436/20.3008.01.149"})}${sourceLink({name:"Palau-Sampio et al. (2017)",url:"https://doi.org/10.3145/epi.2017.jul.04"})}</div><h2>Referencias por tema</h2>${groups}<h2 id="fotoCredito">Fotografía de portada</h2><p class="photo-credit"><em>Un pueblo que no se calla es un pueblo vivo</em>, de DnTrotaMundos ☮. Marcha del Cambio, Puerta del Sol, Madrid, 31 de enero de 2015. La edición web recorta la fotografía panorámica y la convierte a WebP a partir del original en blanco y negro.</p><div>${sourceLink({name:"Original en Wikimedia Commons",url:"https://commons.wikimedia.org/wiki/File:Un_pueblo_que_no_se_calla_es_un_pueblo_vivo_-_panoramio.jpg"})}${sourceLink({name:"Licencia CC BY 3.0",url:"https://creativecommons.org/licenses/by/3.0/"})}</div>`;
  }


  function setPage(next) {
    page=next;
    $("chronoPage").hidden=page!=="cronologia";$("repPage").hidden=page!=="representacion";$("sourcePage").hidden=page!=="fuentes";
    document.querySelectorAll(".main-nav a").forEach(a=>{
      if(a.dataset.page===page)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");
    });
    const names={cronologia:"Archivo político de Podemos",representacion:"Representación",fuentes:"Fuentes y criterios"};
    document.title=`Hagamos memoria · ${names[page]}`;
  }
  function route(initial=false) {
    let hash;
    try {hash=decodeURIComponent(location.hash.slice(1));}catch{hash="";}
    if(panel.open)panel.close();
    if(hash==="representacion"||hash.startsWith("representacion=")){
      const name=hash.slice("representacion=".length);
      if(series.has(name))repName=name;
      setPage("representacion");representation();window.scrollTo(0,0);
    }else if(hash==="fuentes"||hash==="fotografia"){
      setPage("fuentes");sourcesPage();if(hash==="fotografia")$("fotoCredito").scrollIntoView();else window.scrollTo(0,0);
    }else{
      const match=/^(hito|ficha)=(.+)$/.exec(hash);
      if(match&&byId.has(match[2]))index=byId.get(match[2]);
      setPage("cronologia");renderChrono();
      if(match&&byId.has(match[2])){
        $("explorar").scrollIntoView();if(match[1]==="ficha")detail(events[index]);
      }else if(hash==="explorar")$("explorar").scrollIntoView();
      else if(!initial)window.scrollTo(0,0);
    }
    sticky();
  }
  range.addEventListener("input",()=>choose(nearest(Number(range.value)*86400000)));
  range.addEventListener("keydown",ev=>{
    const nav={ArrowLeft:index-1,ArrowDown:index-1,ArrowRight:index+1,ArrowUp:index+1,Home:0,End:events.length-1};
    if(Object.hasOwn(nav,ev.key)){ev.preventDefault();choose(nav[ev.key]);}
  });
  document.addEventListener("click",ev=>{
    const btn=ev.target.closest("button,a");
    if(!btn)return;
    if(btn.matches("[data-back-index]")){openIndex({...searchState});return;}
    if(btn.matches("[data-close]")){panel.close();return;}
    if(btn.matches("[data-detail]")){const n=byId.get(btn.dataset.detail);if(n!=null)detail(events[n]);return;}
    if(btn.matches("[data-jump],[data-select]")){
      const id=btn.dataset.jump||btn.dataset.select;if(panel.open)panel.close();
      choose(byId.get(id),!!btn.dataset.jump);return;
    }
    if(btn.matches("[data-copy]")){share(btn.dataset.copy);return;}
    if(btn.matches("[data-year]")){choose(events.findIndex(e=>e.date.startsWith(btn.dataset.year)));return;}
    if(btn.matches("[data-year-index]")){openIndex({year:btn.dataset.yearIndex});return;}
    if(btn.matches("[data-filter]")){openIndex({category:btn.dataset.filter});return;}
    if(btn.matches("[data-cat]")){searchState.category=btn.dataset.cat;results();return;}
    if(btn.matches("#indexButton,#openSearch,[data-open-index]")){openIndex();return;}
    if(btn.matches("#prev,#followPrev")){choose(index-1);return;}
    if(btn.matches("#next,#followNext")){choose(index+1);return;}
    if(btn.matches("#lastEvent")){choose(events.length-1);return;}
    if(btn.tagName==="A"&&btn.hash&&btn.origin===location.origin&&btn.pathname===location.pathname&&btn.hash===location.hash){ev.preventDefault();route();}
  });
  document.addEventListener("input",ev=>{if(ev.target.id==="query"){searchState.query=ev.target.value;results();}});
  document.addEventListener("change",ev=>{
    const id=ev.target.id;
    if(id==="localPicker"){localName=ev.target.value;updateLocalCaption();}
    if(id==="repPicker"){
      repName=ev.target.value;history.replaceState(null,"","#representacion="+encodeURIComponent(repName));representation();$("repPicker").focus({preventScroll:true});
    }
    if(id==="filterYear"||id==="filterScope"){searchState[id==="filterYear"?"year":"scope"]=ev.target.value;results();}
  });
  document.addEventListener("keydown",ev=>{
    if(ev.defaultPrevented||ev.altKey||ev.ctrlKey||ev.metaKey||ev.target.closest("input,select,textarea,[contenteditable]"))return;
    if(ev.key==="/"&&!panel.open){ev.preventDefault();openIndex();return;}
    if(panel.open||page!=="cronologia")return;
    if(ev.key==="ArrowLeft"||ev.key==="ArrowRight"){ev.preventDefault();choose(index+(ev.key==="ArrowRight"?1:-1));}
  });
  panel.addEventListener("click",ev=>{
    if(ev.target!==panel)return;
    const rect=panel.getBoundingClientRect();
    if(ev.clientX<rect.left||ev.clientX>rect.right||ev.clientY<rect.top||ev.clientY>rect.bottom)panel.close();
  });
  panel.addEventListener("close",()=>{
    if(panel.open)return;
    if(location.hash.startsWith("#ficha="))history.replaceState(null,"","#hito="+events[index].id);
    fromIndex=false;
  });
  $("followPrev").innerHTML=icon("left");$("followNext").innerHTML=icon("right");
  drawRuler();route(true);
  window.addEventListener("hashchange",()=>route());
  window.addEventListener("scroll",sticky,{passive:true});
  window.addEventListener("resize",sticky,{passive:true});

})();

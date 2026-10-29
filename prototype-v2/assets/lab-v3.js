/* Academic geometric illustration, v3.
 * A=(North Korea) is rank-one projector Q=uuᵀ; B=(China) rank-two P=diag(1,1,0).
 * This is a constructed geometric example, not empirical similarities.
 * Norm²(PQ ψ0)=144/394 and Norm²(QP ψ0)=1296/(25×394).
 * Each selected projector changes the conditional state.
 */
(()=>{'use strict';
 const c=window.LAB_V3||{},doc=document.documentElement,$=s=>document.querySelector(s);
 const shell=$('.diagram-shell'),svg=$('#experiment-svg'),arrow=$('#state-arrow'),dot=$('#state-dot'),plane=$('#plane-assembly'),line=$('#line-subspace'),lineLabel=$('#line-label'),label=$('#state-label'),ghost=$('#initial-ghost'),drop=$('#drop-line'),projectionDot=$('#projection-dot'),ring=$('#impact-ring'),core=$('#drawing-core'),mathLabels=$('#math-labels'),status=$('#stage-name'),formula=$('#stage-formula'),orderIndicator=$('#order-indicator'),orderToggle=$('#order-toggle'),steps=[...document.querySelectorAll('.stage-card')],previous=$('#previous-dot'),trail=$('#state-history'),shards=[...document.querySelectorAll('.shard')],shatter=$('#shatter-layer'),runway=$('#break-runway');
 if(!shell||steps.length!==3)throw Error('Missing prototype v3 markup');
 const psi0=[9,12,13].map(x=>x/Math.sqrt(394)),u=[.8,0,.6],dot3=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),
  Q=v=>u.map(x=>x*dot3(u,v)),P=v=>[v[0],v[1],0],norm=v=>Math.hypot(...v),normalize=v=>v.map(x=>x/norm(v)),normSq=v=>dot3(v,v);
 const QP=[psi0,u,[1,0,0]],PQ=[psi0,normalize(P(psi0)),u],pQP=normSq(P(Q(psi0))),pPQ=normSq(Q(P(psi0)));
 if(Math.abs(norm(psi0)-1)>1e-9||Math.abs(pQP-144/394)>1e-8||Math.abs(pPQ-1296/(25*394))>1e-8||Math.abs(normSq(Q(psi0))-normSq(P(psi0)))>1e-9)throw Error('Projector validation error');
 const map=v=>({x:310+116*v[0]-92*v[1],y:335+28*v[0]+50*v[1]-176*v[2]}),clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=v=>{const t=clamp(v);return t*t*(3-2*t)},num=n=>n.toFixed(2),mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let mode='QP',active=0,queued=false;
 function theme(v){doc.dataset.theme=v;const btn=$('#theme-switch');btn.textContent=v==='dark'?'☼':'☾';btn.setAttribute('aria-pressed',String(v==='dark'));try{localStorage.setItem('academic-theme',v)}catch(_){}}
 try{theme(localStorage.getItem('academic-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'))}catch(_){theme('light')}
 $('#theme-switch').addEventListener('click',()=>theme(doc.dataset.theme==='dark'?'light':'dark'));
 const menu=$('.mobile-nav');document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{if(menu)menu.open=false}));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.open){menu.open=false;menu.querySelector('summary')?.focus()}});
 function sequence(){return mode==='QP'?QP:PQ}
 function meta(){return mode==='QP'?{stages:c.stages,forms:c.forms,titles:c.titles,texts:c.texts}:{stages:c.reverseStages,forms:c.reverseForms,titles:c.reverseTitles,texts:c.reverseTexts}}
 function pseudo(i,k){let v=Math.sin((i+1)*23.371+k*61.817)*43758.5453;return v-Math.floor(v)}
 // Generate 160 deterministic shards from actual visible geometry: the sampled plane, line and vector.
 const ox=map([0,0,0]);const pointOnPlane=i=>{const x=(pseudo(i,1)-.5)*2.1,y=(pseudo(i,2)-.5)*2.1;return map([x,y,0])};
 const posList=shards.map((sh,i)=>{
   const start=i%5===0?map(mix(psi0,mode==='QP'?u:normalize(P(psi0)),pseudo(i,3))):
     i%5===1?map(mix([0,0,0],u,pseudo(i,4)*1.7-.2)):
     i%5===2?map(mix([0,0,0],[1,0,0],pseudo(i,4))):pointOnPlane(i);
   const angle=2*Math.PI*pseudo(i,5),length=4+15*pseudo(i,6),dx=Math.cos(angle)*length,dy=Math.sin(angle)*length;
   sh.setAttribute('d',`M${num(start.x)} ${num(start.y)}l${num(dx)} ${num(dy)}`);
   return {...start,vx:(pseudo(i,7)-.5)*190,vy:(pseudo(i,8)-.5)*145-30,ang:(pseudo(i,9)-.5)*140,delay:pseudo(i,10)*.38};
 });

 // Irregular triangular clips allow the *actual drawn geometry* to fracture.
 const NS='http://www.w3.org/2000/svg';
 const clipDefs=svg.querySelector('defs');
 const make=(tag,attrs)=>{const el=document.createElementNS(NS,tag);Object.entries(attrs||{}).forEach(([k,v])=>el.setAttribute(k,String(v)));return el};
 const tiles=[];
 const snapshotBox=make('g',{id:'shatter-source'});clipDefs.appendChild(snapshotBox);
 let snapshotReady=false;
 const cols=14,rows=11,stepX=640/cols,stepY=540/rows;
 const vtx=(r,col)=>{
   const boundary=r===0||r===rows||col===0||col===cols;
   return {x:col*stepX+(boundary?0:(pseudo(r*50+col,23)-.5)*stepX*.28),
           y:r*stepY+(boundary?0:(pseudo(r*50+col,24)-.5)*stepY*.28)};
 };
 const vertices=Array.from({length:rows+1},(_,r)=>Array.from({length:cols+1},(_,col)=>vtx(r,col)));
 for(let r=0;r<rows;r++)for(let col=0;col<cols;col++){
   const a=vertices[r][col],b=vertices[r][col+1],d=vertices[r+1][col],e=vertices[r+1][col+1];
   for(const points of [[a,b,e],[a,e,d]]){
     const id='shatter-clip-'+tiles.length,clip=make('clipPath',{id,clipPathUnits:'userSpaceOnUse'});
     clip.appendChild(make('polygon',{points:points.map(p=>num(p.x)+','+num(p.y)).join(' ')}));clipDefs.appendChild(clip);
     const g=make('g',{'class':'fragment-tile','clip-path':'url(#'+id+')'});
     g.appendChild(make('use',{'href':'#shatter-source'}));
     shatter.appendChild(g);
     const ix=tiles.length,center={x:points.reduce((v,p)=>v+p.x,0)/3,y:points.reduce((v,p)=>v+p.y,0)/3};
     const angle=2*Math.PI*pseudo(ix,31),dist=55+230*pseudo(ix,32);
     tiles.push({el:g,center,dx:Math.cos(angle)*dist,dy:Math.sin(angle)*dist+115,spin:(pseudo(ix,33)-.5)*250,lag:pseudo(ix,34)*.18});
   }
 }

 function draw(index,amount,release){
   const states=sequence(),f=reduced?(amount>.25?1:0):ease(amount);
   const point=index===0?states[0]:index===1?mix(states[0],states[1],f):mix(states[1],states[2],f);
   const now=map(point),prior=map(states[Math.max(0,index-1)]);
   const isChanging=index>0;
   const dissolve=index===2?(reduced?(release>.35?1:0):ease(release)):0;
   const appears=1-dissolve;
   arrow.setAttribute('x2',num(now.x));arrow.setAttribute('y2',num(now.y));dot.setAttribute('cx',num(now.x));dot.setAttribute('cy',num(now.y));
   label.setAttribute('x',num(now.x+16));label.setAttribute('y',num(now.y-18));label.textContent=index===0?'ψ₀':index===1?'ψ₁':'ψ₂';
   ghost.setAttribute('x1',num(ox.x));ghost.setAttribute('y1',num(ox.y));ghost.setAttribute('x2',num(prior.x));ghost.setAttribute('y2',num(prior.y));ghost.style.opacity=String((isChanging?.35:0)*appears);
   previous.setAttribute('cx',num(prior.x));previous.setAttribute('cy',num(prior.y));previous.style.opacity=String((isChanging?.9:0)*appears);
   trail.setAttribute('d',isChanging?`M${num(prior.x)} ${num(prior.y)}L${num(now.x)} ${num(now.y)}`:'');
   trail.style.opacity=String((isChanging?.9:0)*appears);
   const showLine=mode==='QP'?(index===0?.16:1):(index===2?1:.16);
   line.style.opacity=String(showLine*appears);lineLabel.style.opacity=String(showLine*appears);
   const planeFocus=mode==='QP'?(index===0?.18:index===1?.24:.86):(index===0?.18:.86);
   plane.style.opacity=String(planeFocus*appears);
   const impactStage=mode==='QP'?2:1;
   plane.style.transform=index===impactStage&&!reduced?`translateY(${num(-26*(1-ease(amount)))}px)`:'none';
   const peak=index===impactStage?Math.max(0,1-Math.abs(f-.74)/.26):0;
   const center=map(mode==='QP'?QP[2]:PQ[1]);ring.setAttribute('cx',num(center.x));ring.setAttribute('cy',num(center.y));ring.setAttribute('r',num(6+peak*81));ring.style.opacity=String(peak*.65*appears);
   shell.style.boxShadow=peak>0?`0 0 ${Math.round(80*peak)}px ${Math.round(7*peak)}px color-mix(in srgb,var(--accent) ${Math.round(21*peak)}%,transparent)`:'none';
   const newPt=map(states[2]);const dropStage=index===2&&mode==='QP';drop.style.opacity=String(dropStage?.72*f*appears:0);
   drop.setAttribute('x1',num(prior.x));drop.setAttribute('y1',num(prior.y));drop.setAttribute('x2',num(prior.x+(newPt.x-prior.x)*f));drop.setAttribute('y2',num(prior.y+(newPt.y-prior.y)*f));projectionDot.setAttribute('cx',num(newPt.x));projectionDot.setAttribute('cy',num(newPt.y));projectionDot.style.opacity=String(dropStage?.68*f*appears:0);

   // Capture the finished state at full opacity before the fragments move.
   if(dissolve<.001)snapshotReady=false;
   else if(!snapshotReady){
     snapshotBox.replaceChildren();
     for(const original of [core,mathLabels]){
       const copy=original.cloneNode(true);copy.removeAttribute('id');copy.style.opacity='1';
       const originals=[original,...original.querySelectorAll('*')];
       const copies=[copy,...copy.querySelectorAll('*')];
       originals.forEach((node,i)=>{
         const style=getComputedStyle(node),dest=copies[i];
         for(const prop of ['fill','fill-opacity','stroke','stroke-width','stroke-opacity','stroke-dasharray','stroke-linecap','stroke-linejoin','font-family','font-size','font-weight','opacity']){
           const val=style.getPropertyValue(prop);if(val)dest.style.setProperty(prop,val);
         }
         if(node===original)dest.style.opacity='1';
         dest.removeAttribute('id');
       });
       snapshotBox.appendChild(copy);
     }
     snapshotReady=true;
   }
   core.style.opacity=String(1-ease(dissolve*1.28));mathLabels.style.opacity=String(1-ease(dissolve*1.28));
   const breakProgress=clamp((dissolve-.02)/.98);
   shatter.style.opacity=String(reduced?0:(breakProgress>0?1:0));
   for(const piece of tiles){
     const t=clamp((breakProgress-piece.lag)/(1-piece.lag)),m=ease(t);
     piece.el.setAttribute('transform','translate('+num(piece.dx*m)+' '+num(piece.dy*m+110*m*m)+') rotate('+num(piece.spin*m)+' '+num(piece.center.x)+' '+num(piece.center.y)+')');
     piece.el.style.opacity=String(reduced?0:1-ease(clamp((t-.5)/.5)));
   }
   // A break-apart effect from the last projection to the next section, not an additional stage.
   for(let i=0;i<shards.length;i++){
     const el=shards[i],pos=posList[i],t=clamp((dissolve-pos.delay)/(1-pos.delay));
     el.style.opacity=String(reduced?0:(t>0?(.75-ease(t)*.75):0));
     el.setAttribute('transform',`translate(${num(pos.vx*ease(t))} ${num(pos.vy*ease(t)+140*ease(t)*ease(t))}) rotate(${num(pos.ang*ease(t))} ${num(pos.x)} ${num(pos.y)})`);
   }
   // Keep mathematical elements distinct from the illustration's final fade.
   const m=meta();status.textContent=m.stages[index];formula.textContent=m.forms[index];
   $('#stage-count').textContent=`0${index+1} / 03`;
   $('#prev-stage').disabled=index===0;$('#next-stage').disabled=false;
   $('#next-stage').setAttribute('aria-label',index===2?(c.lang==='es'?'Continuar a investigación':'Continue to research'):(c.lang==='es'?'Siguiente paso':'Next step'));
 }
 function update(){
   const threshold=innerHeight*(innerWidth<=720?.57:.60);let index=0;
   steps.forEach((s,i)=>{if(s.getBoundingClientRect().top<=threshold)index=i});
   const rect=steps[index].getBoundingClientRect(),distance=threshold-rect.top;
   let amount=clamp(distance/(Math.max(180,rect.height)*.38));
   // The untitled scroll runway keeps the diagram onscreen while it breaks.
   const runwayTop=runway.getBoundingClientRect().top;
   const release=index===2?clamp((innerHeight*.87-runwayTop)/(innerHeight*.72)):0;
   active=index;draw(index,amount,release);
   const max=document.documentElement.scrollHeight-innerHeight;
   $('.reading-progress').style.width=(max>0?100*scrollY/max:0)+'%';
 }
 function redraw(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;update()})}
 window.addEventListener('scroll',redraw,{passive:true});window.addEventListener('resize',redraw,{passive:true});
 const go=i=>{if(i>2){runway.scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'});return}steps[clamp(i,0,2)]?.scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'})};
 $('#prev-stage').addEventListener('click',()=>go(active-1));$('#next-stage').addEventListener('click',()=>go(active+1));
 function syncText(){const m=meta();steps.forEach((s,i)=>{s.querySelector('h3').textContent=m.titles[i];s.querySelector('p').textContent=m.texts[i];s.querySelector('.stage-formula').textContent=m.forms[i];s.querySelector('.stage-index').textContent=`0${i} / ${m.stages[i]}`});orderIndicator.textContent=mode==='QP'?c.comparisonQP:c.comparisonPQ;orderToggle.firstChild.textContent=mode==='QP'?c.buttonQP:c.buttonPQ;}
 orderToggle.addEventListener('click',()=>{snapshotReady=false;mode=mode==='QP'?'PQ':'QP';syncText();redraw()});
 syncText();requestAnimationFrame(update);
})();
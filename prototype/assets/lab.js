/* Meaning laboratory prototype. Pure geometry: real Hilbert space R^3.
   psi0=(0.60,0.48,0.64) normalized; u=(.8,0,.6) normalized;
   Q=uuᵀ rank one; P=diag(1,1,0) rank two.
   yes/yes joint probability: ||P Q psi0||²=.47775744;
   reversed ||Q P psi0||²=.2304.
   This is a formal toy model, not empirical evidence for quantum cognition.
   All SVG positions are derived from the same vectors and fixed affine map. */
(function(){'use strict';
 const conf=window.LAB_CONFIG||{};
 const doc=document.documentElement;
 const themeSwitch=document.getElementById('theme-switch');
 const orderToggle=document.getElementById('order-toggle');
 const shell=document.querySelector('.visual-shell');
 const svg=document.getElementById('experiment-svg');
 const arrow=document.getElementById('state-arrow');
 const dot=document.getElementById('state-dot');
 const plane=document.getElementById('plane-assembly');
 const line=document.getElementById('line-subspace');
 const lineLabel=document.getElementById('line-label');
 const label=document.getElementById('state-label');
 const ghost=document.getElementById('initial-ghost');
 const drop=document.getElementById('drop-line');
 const projectionDot=document.getElementById('projection-dot');
 const ring=document.getElementById('impact-ring');
 const content=document.getElementById('drawing-core');
 const mathLabels=document.getElementById('math-labels');
 const status=document.getElementById('stage-name');
 const formula=document.getElementById('stage-formula');
 const joint=document.getElementById('joint-probability');
 const orderIndicator=document.getElementById('order-indicator');
 const steps=[...document.querySelectorAll('.lab-step')];
 const menu=document.querySelector('.mobile-menu');
 const v0=[.6,.48,.64],u=[.8,0,.6],P=v=>[v[0],v[1],0],Q=v=>{const dp=dot3(u,v);return u.map(k=>k*dp)};
 const norm=v=>Math.sqrt(v.reduce((n,x)=>n+x*x,0));
 const normalize=v=>v.map(x=>x/norm(v));
 const dot3=(a,b)=>a.reduce((r,x,i)=>r+x*b[i],0);
 const psiQP=[v0,u,[1,0,0]],psiPQ=[v0,normalize(P(v0)),u];
 const normSquared=v=>v.reduce((sum,x)=>sum+x*x,0);
 const probabilityQP=normSquared(P(Q(v0))),probabilityPQ=normSquared(Q(P(v0)));
 console.assert(Math.abs(probabilityQP-.47775744)<1e-9 && Math.abs(probabilityPQ-.2304)<1e-9,'Projector probability validation');
 const mapVector=v=>({x:310+116*v[0]-92*v[1],y:335+28*v[0]+50*v[1]-176*v[2]});
 const origin=mapVector([0,0,0]);
 let order='QP',lastStage=-1,scheduled=false;
 const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function getSavedTheme(){try{return localStorage.getItem('academic-theme')}catch(_){return null}}
 function setTheme(t){doc.dataset.theme=t;themeSwitch.textContent=t==='dark'?'☼':'☾';themeSwitch.setAttribute('aria-pressed',String(t==='dark'));try{localStorage.setItem('academic-theme',t)}catch(_){}}
 const saved=getSavedTheme();setTheme(saved||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
 themeSwitch?.addEventListener('click',()=>setTheme(doc.dataset.theme==='dark'?'light':'dark'));
 function clamp(x,a=0,b=1){return Math.max(a,Math.min(b,x))}
 function ease(x){const t=clamp(x);return t*t*(3-2*t)}
 function mix(a,b,t){return a.map((n,i)=>n+(b[i]-n)*t)}
 function num(n){return n.toFixed(2)}
 function update(){
  const center=window.innerHeight*(window.innerWidth<=720?.76:.60);
  let index=0;
  steps.forEach((step,i)=>{if(step.getBoundingClientRect().top<=center)index=i});
  const rect=steps[index].getBoundingClientRect();
  const t=clamp((center-rect.top)/(Math.max(180,rect.height)*.51));
  const f=reduced?(t>.2?1:0):ease(t);
  const current=(order==='QP'?psiQP:psiPQ);
  const target=index===0?current[0]:index===1?mix(current[0],current[1],f):index===2?mix(current[1],current[2],f):current[2];
  const xy=mapVector(target),st=(index>=3?clamp((center-rect.top)/(Math.max(150,rect.height)*.75)):0),dissolve=reduced?(st>.1?1:0):ease(st);
  arrow.setAttribute('x2',num(xy.x));arrow.setAttribute('y2',num(xy.y));dot.setAttribute('cx',num(xy.x));dot.setAttribute('cy',num(xy.y));
  label.setAttribute('x',num(xy.x+16));label.setAttribute('y',num(xy.y-19));label.textContent=index===0?'ψ₀':index===1?'ψ₁':'ψ₂';
  const showLine=order==='QP' ? (index===0?.13:1) : index>=2 ? 1:.18;
  line.style.opacity=String(showLine*(1-dissolve));lineLabel.style.opacity=String(showLine*(1-dissolve));
  const planeFocus=order==='QP'?(index===0?.18:index===1?.25:.8):index===0?.17:.8;
  plane.style.opacity=String(planeFocus*(1-dissolve));
  // The plane retains its exact projected geometry; only opacity and impact ring change.
  let pEnd=mapVector(order==='QP'?psiQP[2]:psiPQ[2]);
  const peak=(index===2)?Math.max(0,1-Math.abs(t-.72)/.28):0;
  ring.setAttribute('cx',num(pEnd.x));ring.setAttribute('cy',num(pEnd.y));ring.setAttribute('r',num(10+peak*70));ring.style.opacity=String(peak*.76);
  shell.style.boxShadow=peak>0?`0 0 ${Math.round(72*peak)}px ${Math.round(8*peak)}px color-mix(in srgb,var(--accent) ${Math.round(24*peak)}%,transparent)`:'none';
  const px=mapVector(order==='QP'?P(u):Q(normalize(P(v0))));
  const prev=mapVector(current[1]);
  const showDrop=order==='QP'&&index===2;drop.style.opacity=String(showDrop?.72*f*(1-dissolve):0);
  drop.setAttribute('x1',num(prev.x));drop.setAttribute('y1',num(prev.y));drop.setAttribute('x2',num(prev.x+(px.x-prev.x)*f));drop.setAttribute('y2',num(prev.y+(px.y-prev.y)*f));
  projectionDot.setAttribute('cx',num(px.x));projectionDot.setAttribute('cy',num(px.y));projectionDot.style.opacity=String(showDrop?.7*f*(1-dissolve):0);
  ghost.style.opacity=String((index>0?.35:0)*(1-dissolve));
  content.style.opacity=String(1-dissolve);mathLabels.style.opacity=String(1-dissolve);
  [...document.querySelectorAll('.frag')].forEach((elem,i)=>{const angle=(i*1.618)*Math.PI;elem.style.opacity=String(Math.max(0,(dissolve-.12)/.88)*.52);elem.setAttribute('transform',`translate(${num(Math.cos(angle)*dissolve*52)}, ${num(Math.sin(angle)*dissolve*65)})`)});
  if(index!==lastStage){status.textContent=(order==='QP'?conf.stages:conf.stagesRev)[index];lastStage=index}
  formula.textContent=(order==='QP'?conf.phases:conf.phasesRev)[index];
 }
 function onScroll(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;update()})}
 function setOrder(next){order=next;lastStage=-1;orderIndicator.textContent=order==='QP'?'Q → P':'P → Q';orderToggle.textContent=order==='QP'?conf.reverse+' ↺':conf.normal+' ↺';orderToggle.setAttribute('aria-label',order==='QP'?conf.reverse:conf.normal);joint.textContent=order==='QP'?`Q → P : ${probabilityQP.toFixed(4)}`:`P → Q : ${probabilityPQ.toFixed(4)}`;
  if(conf.lang==='es'){
   steps[1].querySelector('h3').textContent=order==='QP'?'Una pregunta selecciona una dirección.':'El plano selecciona una posibilidad.';
   steps[2].querySelector('h3').textContent=order==='QP'?'Ahora el plano cambia lo que queda.':'Ahora la recta cambia lo que queda.';
   steps[1].querySelector('.formula').textContent=order==='QP'?'Q = |u⟩⟨u|,  u = (0.8, 0, 0.6)':'P = diag(1, 1, 0)';
   steps[2].querySelector('.formula').textContent=order==='QP'?'P = diag(1, 1, 0)':'Q = |u⟩⟨u|,  u = (0.8, 0, 0.6)';
   steps[1].querySelector('p').textContent=order==='QP'?'Seleccionamos el resultado afirmativo de un proyector sobre una recta. El nuevo estado se normaliza y queda sobre ese subespacio.':'Seleccionamos primero el resultado afirmativo de un proyector sobre el plano bidimensional. El estado actualizado queda en él.';
   steps[2].querySelector('p').textContent=order==='QP'?'Aplicamos un segundo proyector, esta vez sobre un plano que no contiene la recta anterior. El resultado pasa al plano y produce el golpe visual de la composición.':'En segundo lugar seleccionamos una recta no contenida en ese plano y normalizamos la proyección resultante. El estado final y la probabilidad conjunta cambian.';
  }else{
   steps[1].querySelector('h3').textContent=order==='QP'?'A question selects a direction.':'The plane selects a possibility.';
   steps[2].querySelector('h3').textContent=order==='QP'?'The plane changes what remains.':'Now the line changes what remains.';
   steps[1].querySelector('.formula').textContent=order==='QP'?'Q = |u⟩⟨u|,  u = (0.8, 0, 0.6)':'P = diag(1, 1, 0)';
   steps[2].querySelector('.formula').textContent=order==='QP'?'P = diag(1, 1, 0)':'Q = |u⟩⟨u|,  u = (0.8, 0, 0.6)';
   steps[1].querySelector('p').textContent=order==='QP'?'We select the affirmative outcome of a rank-one projector onto a line. After normalization, the new state lies in that subspace.':'We first select the affirmative outcome of a projection onto the two-dimensional plane. After normalization, the state lies there.';
   steps[2].querySelector('p').textContent=order==='QP'?'A second projector is applied, now onto a plane that does not contain the line. The new state lies in the plane and the diagram provides the visual impact.':'We then select a tilted line that is not contained in the plane, and normalize the projected state. The outcome and joint probability change.';
  }
  update();
 }
 orderToggle.addEventListener('click',()=>setOrder(order==='QP'?'PQ':'QP'));
 window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll,{passive:true});
 document.querySelectorAll('.mobile-panel a').forEach(a=>a.addEventListener('click',()=>{if(menu)menu.open=false}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.open){menu.open=false;menu.querySelector('summary')?.focus()}});
 setOrder('QP');requestAnimationFrame(update);
})();
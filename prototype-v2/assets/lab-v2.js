/* Prototype v2: local-only interactive scientific demonstration.
  ψ₀=(.6,.48,.64) unit norm; u=(.8,0,.6) unit norm.
  Q=uuᵀ, P=diag(1,1,0). Noncommuting orthogonal projectors.
  Norm²(PQψ₀)=.47775744; norm²(QPψ₀)=.2304.
  Illustrative interpolation and dissolution are not physical operations. */
(()=>{'use strict';
 const cfg=window.LAB_V2||{},doc=document.documentElement;
 const $=sel=>document.querySelector(sel);
 const shell=$('.diagram-shell'),svg=$('#experiment-svg'),arrow=$('#state-arrow'),dot=$('#state-dot'),plane=$('#plane-assembly'),line=$('#line-subspace'),lineLabel=$('#line-label'),label=$('#state-label'),ghost=$('#initial-ghost'),drop=$('#drop-line'),projectionDot=$('#projection-dot'),ring=$('#impact-ring'),content=$('#drawing-core'),mathLabels=$('#math-labels'),status=$('#stage-name'),formula=$('#stage-formula'),joint=$('#joint-probability'),orderIndicator=$('#order-indicator'),orderToggle=$('#order-toggle'),steps=[...document.querySelectorAll('.stage-card')];
 const v0=[.6,.48,.64],u=[.8,0,.6];
 const dot3=(a,b)=>a.reduce((r,x,i)=>r+x*b[i],0),Q=v=>u.map(x=>x*dot3(u,v)),P=v=>[v[0],v[1],0],norm=v=>Math.hypot(...v),normalize=v=>v.map(x=>x/norm(v));
 const qp=[v0,u,[1,0,0]],pq=[v0,normalize(P(v0)),u];const sq=v=>v.reduce((s,x)=>s+x*x,0);
 const pQP=sq(P(Q(v0))),pPQ=sq(Q(P(v0)));
 if(Math.abs(pQP-.47775744)>1e-8||Math.abs(pPQ-.2304)>1e-8)throw Error('Projector validation failed');
 const map=v=>({x:310+116*v[0]-92*v[1],y:335+28*v[0]+50*v[1]-176*v[2]}),clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=v=>{const t=clamp(v);return t*t*(3-2*t)},mix=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*t),num=x=>x.toFixed(2);
 let mode='QP',active=0,queued=false,autoScroll=true;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function theme(t){doc.dataset.theme=t;const b=$('#theme-switch');b.textContent=t==='dark'?'☼':'☾';b.setAttribute('aria-pressed',String(t==='dark'));try{localStorage.setItem('academic-theme',t)}catch(_){}}
 const saved=(()=>{try{return localStorage.getItem('academic-theme')}catch(_){return null}})();theme(saved||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
 $('#theme-switch').addEventListener('click',()=>theme(doc.dataset.theme==='dark'?'light':'dark'));
 const menu=$('.mobile-nav');document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{if(menu)menu.open=false}));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.open){menu.open=false;menu.querySelector('summary')?.focus()}});
 function stageInfo(i){return mode==='QP'?{names:cfg.stages,forms:cfg.shortLabel,titles:cfg.stepsTitle,texts:cfg.stepsText}:{names:cfg.labelsStagesRev,forms:cfg.labelsRev,titles:cfg.stagesTitleRev,texts:cfg.stagesTextRev}}
 function draw(index,amount){
  const f=reduced?(amount>.2?1:0):ease(amount),states=mode==='QP'?qp:pq;
  const v=index===0?states[0]:index===1?mix(states[0],states[1],f):index===2?mix(states[1],states[2],f):states[2];const xy=map(v);
  const dissolve=index===3?(reduced?1:ease(amount)):0;
  arrow.setAttribute('x2',num(xy.x));arrow.setAttribute('y2',num(xy.y));dot.setAttribute('cx',num(xy.x));dot.setAttribute('cy',num(xy.y));label.setAttribute('x',num(xy.x+15));label.setAttribute('y',num(xy.y-18));label.textContent=index===0?'ψ₀':index===1?'ψ₁':'ψ₂';
  const showLine=mode==='QP'?(index===0?.18:1):(index>=2?1:.15);line.style.opacity=String(showLine*(1-dissolve));lineLabel.style.opacity=String(showLine*(1-dissolve));
  plane.style.opacity=String((mode==='QP'?(index<=1?.2:.83):(index===0?.18:.83))*(1-dissolve));
  const impactStage=mode==='QP'?2:1;
  // Translate the graphic only; P and Q themselves stay fixed.
  plane.style.transform=index===impactStage&&!reduced?`translateY(${num(-20*(1-ease(amount)))}px)`:'none';
  const peak=index===impactStage?Math.max(0,1-Math.abs(f-.73)/.27):0,center=map(mode==='QP'?qp[2]:pq[1]);ring.setAttribute('cx',num(center.x));ring.setAttribute('cy',num(center.y));ring.setAttribute('r',num(10+peak*64));ring.style.opacity=String(peak*.7);
  shell.style.boxShadow=peak>0?`0 0 ${Math.round(72*peak)}px ${Math.round(8*peak)}px color-mix(in srgb,var(--accent) ${Math.round(20*peak)}%,transparent)`:'none';
  const prev=map(states[1]),proj=map(mode==='QP'?qp[2]:pq[1]),showDrop=(mode==='QP'&&index===2)||(mode==='PQ'&&index===1);drop.style.opacity=String(showDrop?.55*f*(1-dissolve):0);drop.setAttribute('x1',num(prev.x));drop.setAttribute('y1',num(prev.y));drop.setAttribute('x2',num(prev.x+(proj.x-prev.x)*f));drop.setAttribute('y2',num(prev.y+(proj.y-prev.y)*f));projectionDot.setAttribute('cx',num(proj.x));projectionDot.setAttribute('cy',num(proj.y));projectionDot.style.opacity=String(showDrop?.7*f*(1-dissolve):0);ghost.style.opacity=String((index>0?.33:0)*(1-dissolve));content.style.opacity=String(1-dissolve);mathLabels.style.opacity=String(1-dissolve);
  [...document.querySelectorAll('.frag')].forEach((el,j)=>{const angle=j*1.618*Math.PI;el.style.opacity=String(clamp((dissolve-.1)/.9)*.65);el.setAttribute('transform',`translate(${num(Math.cos(angle)*dissolve*64)} ${num(Math.sin(angle)*dissolve*64)})`)});
  const inf=stageInfo(index);status.textContent=inf.names[index];formula.textContent=inf.forms[index];$('#stage-count').textContent=`0${index+1} / 04`;
  $('#prev-stage').disabled=index===0;$('#next-stage').disabled=index===3;
 }
 function update(){const w=innerWidth;const threshold=innerHeight*(w<=720?.62:.64);let index=0;
  steps.forEach((s,i)=>{if(s.getBoundingClientRect().top<=threshold)index=i});
  const rect=steps[index].getBoundingClientRect(),amount=clamp((threshold-rect.top)/Math.max(140,rect.height*.52));active=index;draw(index,amount);
  const max=document.documentElement.scrollHeight-innerHeight;const rate=max>0?scrollY/max:0;$('.reading-progress').style.width=(rate*100)+'%';
 }
 function run(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;update()})}window.addEventListener('scroll',run,{passive:true});window.addEventListener('resize',run,{passive:true});
 const go=i=>{const target=steps[clamp(i,0,3)];if(target)target.scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'})};
 $('#prev-stage').addEventListener('click',()=>go(active-1));$('#next-stage').addEventListener('click',()=>go(active+1));
 function syncText(){const inf=stageInfo(active);steps.forEach((s,i)=>{s.querySelector('h3').textContent=inf.titles[i];s.querySelector('p').textContent=inf.texts[i];s.querySelector('.stage-formula').textContent=inf.forms[i];s.querySelector('.stage-index').textContent=`0${i} / ${inf.names[i]}`});orderIndicator.textContent=mode==='QP'?'Q → P':'P → Q';orderToggle.querySelector('span').textContent=mode==='QP'?' ↺':' ↻';}
 orderToggle.addEventListener('click',()=>{mode=mode==='QP'?'PQ':'QP';syncText();update()});
 syncText();requestAnimationFrame(update);
})();
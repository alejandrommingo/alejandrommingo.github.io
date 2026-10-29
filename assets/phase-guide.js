/* After a natural scroll gesture, gently align the next comparison with its SVG. */
(()=>{'use strict';
const steps=[...document.querySelectorAll('.stage-card')],runway=document.getElementById('break-runway');
if(steps.length!==3||!runway||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const mobile=()=>innerWidth<=720,offset=()=>innerHeight*(mobile()?.28:.20),yFor=el=>el.getBoundingClientRect().top+scrollY-offset();
let lastY=scrollY,dir=0,snapIndex=-1,programUntil=0,idle=0,touched=false;
function input(d){if(d)dir=Math.sign(d);touched=true;clearTimeout(idle)}
window.addEventListener('wheel',e=>input(e.deltaY),{passive:true});
let y=null;window.addEventListener('touchstart',e=>{y=e.touches[0]?.clientY??null;touched=true},{passive:true});
window.addEventListener('touchmove',e=>{const next=e.touches[0]?.clientY;if(next!=null&&y!=null){input(y-next);y=next}},{passive:true});
window.addEventListener('touchend',()=>{y=null;queue()},{passive:true});
function snap(){if(!touched||performance.now()<programUntil||document.visibilityState!=='visible')return;
const now=scrollY,ys=steps.map(yFor),low=ys[0]-Math.min(90,innerHeight*.14),high=ys[2]+Math.max(105,innerHeight*.19);
if(now<low||now>high){snapIndex=-1;return}
let nearest=ys.map(v=>Math.abs(now-v)).indexOf(Math.min(...ys.map(v=>Math.abs(now-v))));
if(snapIndex>=0){const move=now-ys[snapIndex],step=Math.min(65,innerHeight*.095);
if(dir>0&&move>step&&snapIndex<2)nearest=Math.max(nearest,snapIndex+1);
else if(dir<0&&move<-step&&snapIndex>0)nearest=Math.min(nearest,snapIndex-1);
else if(Math.abs(move)<20)return}
if(now>ys[2]+100&&dir>0){snapIndex=-1;return}
const target=ys[nearest];snapIndex=nearest;
if(Math.abs(now-target)<16)return;
programUntil=performance.now()+560;scrollTo({top:Math.max(0,target),behavior:'smooth'})}
function queue(){if(!touched)return;clearTimeout(idle);idle=setTimeout(snap,145)}
window.addEventListener('scroll',()=>{const n=scrollY;if(Math.abs(n-lastY)>2&&performance.now()>programUntil)dir=Math.sign(n-lastY);lastY=n;if(performance.now()>programUntil)queue()},{passive:true});
window.addEventListener('resize',()=>{snapIndex=-1;clearTimeout(idle)},{passive:true});
})();
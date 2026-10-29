/* Original portrait interpreted as local pen strokes; no remote services. */
(()=>{'use strict';
 const figure=document.querySelector('.contact-portrait');
 if(!figure)return;
 const img=figure.querySelector('.portrait-original'),canvas=figure.querySelector('.portrait-ink');
 if(!img||!canvas||!canvas.getContext)return;
 function render(){
  if(!img.naturalWidth||!img.naturalHeight)return;
  try{
   const w=420,h=Math.round(w*img.naturalHeight/img.naturalWidth);
   const dpr=Math.min(2,window.devicePixelRatio||1);
   const work=document.createElement('canvas');work.width=w;work.height=h;
   const wc=work.getContext('2d',{willReadFrequently:true});if(!wc)return;
   wc.drawImage(img,0,0,w,h);
   const src=wc.getImageData(0,0,w,h).data;
   const light=new Float32Array(w*h);
   for(let i=0;i<light.length;i++){
     const j=i*4;light[i]=.2126*src[j]+.7152*src[j+1]+.0722*src[j+2];
   }
   const sample=(x,y)=>light[Math.max(0,Math.min(h-1,y))*w+Math.max(0,Math.min(w-1,x))];
   const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return;
   canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
   ctx.fillStyle='#eeece0';ctx.fillRect(0,0,w,h);
   // A quiet tonal underdrawing keeps the face recognizable without looking photographic.
   ctx.save();ctx.globalAlpha=.15;ctx.filter='grayscale(1) contrast(1.45) brightness(1.55)';
   ctx.drawImage(work,0,0,w,h);ctx.restore();
   const random=(x,y,z=0)=>{let v=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return v-Math.floor(v)};
   function stroke(x,y,dx,dy,opacity,width=0.7,accent=false){
     ctx.strokeStyle=accent?'rgba(168,86,66,'+opacity+')':'rgba(28,54,52,'+opacity+')';
     ctx.lineWidth=width;ctx.lineCap='round';
     ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.stroke();
   }
   // Diagonal ballpoint hatching: denser and crossed in shadow areas.
   for(let y=5;y<h-5;y+=6)for(let x=5;x<w-5;x+=6){
     const jitter=random(x,y),px=Math.min(w-2,Math.round(x+jitter*2-1));
     const py=Math.min(h-2,Math.round(y+random(x,y,1)*2-1));
     const dark=1-sample(px,py)/255;
     if(dark>.23&&random(x,y,2)<Math.min(1,(dark-.18)*1.65)){
       const length=3+dark*9;
       stroke(px,py,length*.74,-length*.64,Math.min(.63,.16+(dark-.22)*.79),.65);
     }
     if(dark>.56&&random(x,y,3)<(dark-.45)*1.55){
       const length=3+dark*7;
       stroke(px+2,py-2,-length*.60,-length*.80,Math.min(.43,(dark-.38)*.72),.55);
     }
   }
   // Sobel outlines, short tangential segments: hair, eyes, smile and facial contours.
   for(let y=2;y<h-2;y+=3)for(let x=2;x<w-2;x+=3){
     const gx=sample(x+1,y-1)+2*sample(x+1,y)+sample(x+1,y+1)
       -sample(x-1,y-1)-2*sample(x-1,y)-sample(x-1,y+1);
     const gy=sample(x-1,y+1)+2*sample(x,y+1)+sample(x+1,y+1)
       -sample(x-1,y-1)-2*sample(x,y-1)-sample(x+1,y-1);
     const edge=Math.hypot(gx,gy)/800;
     if(edge<.095||random(x,y,4)>.84)continue;
     const angle=Math.atan2(gy,gx)+Math.PI/2;
     const length=1.6+Math.min(6.5,edge*11),alpha=Math.min(.88,.15+edge*1.45);
     stroke(x,y,Math.cos(angle)*length,Math.sin(angle)*length,alpha,edge>.3?.9:.58);
   }
   // Sparse copper registration marks link the sketch to the site's accents.
   stroke(15,15,26,0,.65,1,true);stroke(15,15,0,26,.65,1,true);
   stroke(w-15,h-15,-26,0,.65,1,true);stroke(w-15,h-15,0,-26,.65,1,true);
   canvas.classList.add('is-ready');img.classList.add('is-inked');
  }catch(_){/* Keep the grayscale original if this browser cannot draw the sketch. */}
 }
 if(img.complete)render();
 else img.addEventListener('load',render,{once:true});
})();

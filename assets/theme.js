/* Local-only appearance control: no analytics, no network, no external dependencies. */
(function(){
  const buttons=document.querySelectorAll('.theme-toggle');
  function preferred(){try {return localStorage.getItem('academic-theme') || (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');} catch(_){return 'light';}}
  function apply(mode){document.documentElement.setAttribute('data-theme',mode);
    buttons.forEach(button=>{let spanish=button.closest('html').lang==='es'; let next=mode==='dark'?(spanish?'Activar tema claro':'Switch to light theme'):(spanish?'Activar tema oscuro':'Switch to dark theme');button.setAttribute('aria-label',next);button.setAttribute('title',next);button.setAttribute('aria-pressed',String(mode==='dark'));});
  }
  apply(preferred());
  buttons.forEach(button=>button.addEventListener('click',()=>{const mode=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';apply(mode);try{localStorage.setItem('academic-theme',mode);}catch(_){} }));
  const media=matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener?.('change',()=>{try{if(!localStorage.getItem('academic-theme'))apply(media.matches?'dark':'light');}catch(_){} });
})();

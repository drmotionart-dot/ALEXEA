/* "Install app" helper and service worker registration. Used by every page; Home and My account show the button.
   Android/Chrome: shows the real install prompt. iPhone/iPad (Safari): shows the Add to Home Screen steps. */
(function(){
  var dp=null,ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e});
  function standalone(){return (window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true}
  window.ALX_install=function(btn,panel){
    if(!btn||!panel)return;
    if(standalone()){btn.style.display='none';panel.style.display='none';return}
    panel.innerHTML='<b style="font-weight:500">Install ALEXEA on your phone</b><br>'+(ios?'iPhone or iPad (Safari): tap the Share button, then <b>Add to Home Screen</b>, then <b>Add</b>.':'Android (Chrome): tap <b>Install</b> when the browser offers it, or open the menu (⋮) and choose <b>Install app</b> or <b>Add to Home screen</b>.')+'<br><span style="opacity:.8">Then open it from your home screen like any other app.</span>';
    btn.onclick=function(){if(dp){dp.prompt();dp.userChoice.then(function(){dp=null})}else{panel.style.display=panel.style.display=='block'?'none':'block'}};
  };
  if('serviceWorker' in navigator&&location.protocol!='file:'){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}
})();

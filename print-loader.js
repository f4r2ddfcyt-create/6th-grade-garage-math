(function(){
  function loadPrintLibrary(){
    if(document.querySelector('script[data-print-library]')) return;
    const s=document.createElement('script');
    s.src='print.js?v=20260901-fix1';
    s.dataset.printLibrary='1';
    document.body.appendChild(s);
  }
  if(window.weeks && window.weeks.length) loadPrintLibrary();
  else window.addEventListener('garageMathReady', loadPrintLibrary, {once:true});
})();

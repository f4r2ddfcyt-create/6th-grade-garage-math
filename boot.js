(async function(){
  try {
    const response = await fetch('app.js?v=20260901-fix4', {cache:'no-store'});
    if(!response.ok) throw new Error('Could not load curriculum data');
    let source = await response.text();

    source = source.replace(/\]\},project:/g, '],project:');
    source = source.replace(/^const\s+weeks\s*=\s*\[/, 'window.weeks = [');
    source = source.replace(
      '<button class="btn primary" onclick="window.print()">Print This Week</button>',
      '<a class="btn primary" target="_blank" rel="noopener" href="garage-math-workbook.pdf?v=20260901#page=${(x.w*2)-1}">Open Printable PDF</a>'
    );
    source += '\nwindow.openGarageWeek = openWeek;';

    new Function(source)();
    window.dispatchEvent(new Event('garageMathReady'));
  } catch (error) {
    console.error('Garage Math failed to load:', error);
    const grid = document.querySelector('#weekGrid');
    if(grid) grid.innerHTML = '<p style="color:white;font-weight:800">Curriculum failed to load. Please refresh the page.</p>';
    window.dispatchEvent(new CustomEvent('garageMathError', {detail:String(error)}));
  }
})();

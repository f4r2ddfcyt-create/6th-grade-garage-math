(async function(){
  try {
    const response = await fetch('app.js?v=20260901-fix5', {cache:'no-store'});
    if(!response.ok) throw new Error('Could not load curriculum data');
    let source = await response.text();
    source = source.replace(/\]\},project:/g, '],project:');
    source = source.replace(/^const\s+weeks\s*=\s*\[/, 'window.weeks = [');
    source = source.replace(
      '<button class="btn primary" onclick="window.print()">Print This Week</button>',
      '<a class="btn primary" href="print.html?week=${x.w}&type=worksheet">Open Printable Worksheet</a>'
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

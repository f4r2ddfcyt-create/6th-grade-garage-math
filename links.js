(function(){
  const grid=document.querySelector('#weekGrid');
  if(!grid) return;

  const style=document.createElement('style');
  style.textContent=`
    .week-actions{display:grid;grid-template-columns:1fr;gap:8px;margin-top:auto}
    .week-actions a{display:block;text-align:center;text-decoration:none;font-weight:900;padding:10px 12px;border-radius:4px}
    .lesson-link{background:#f26a21;color:#fff}
    .worksheet-link{background:#fff;color:#17191a;border:1px solid #d8dde0}
    .key-link{background:#2a3034;color:#fff;border:1px solid #465057}
    @media(min-width:700px){.week-actions{grid-template-columns:1fr 1fr}.lesson-link{grid-column:1/-1}}
    @media print{.week-actions{display:none!important}}
  `;
  document.head.appendChild(style);

  function enhance(){
    grid.querySelectorAll('.week-card').forEach(card=>{
      if(card.dataset.resourcesAdded==='yes') return;
      const old=card.querySelector('[data-week]');
      if(!old) return;
      const week=Number(old.dataset.week);
      const actions=document.createElement('div');
      actions.className='week-actions';
      actions.innerHTML=`
        <a class="lesson-link" href="index.html?week=${week}#weeks">Lesson</a>
        <a class="worksheet-link" href="print.html?week=${week}&type=worksheet">Worksheet</a>
        <a class="key-link" href="print.html?week=${week}&type=key">Answer Key</a>`;
      old.replaceWith(actions);
      card.dataset.resourcesAdded='yes';
    });
  }

  enhance();
  new MutationObserver(enhance).observe(grid,{childList:true,subtree:true});

  const requested=Number(new URLSearchParams(location.search).get('week'));
  if(requested && typeof openWeek==='function'){
    setTimeout(()=>openWeek(requested),50);
  }
})();

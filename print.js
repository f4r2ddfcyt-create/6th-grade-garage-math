const weekSelect=document.querySelector('#weekSelect');
const typeSelect=document.querySelector('#typeSelect');
const openBtn=document.querySelector('#openBtn');
const printBtn=document.querySelector('#printBtn');
const sheet=document.querySelector('#sheet');
const library=document.querySelector('#library');
const libraryGrid=document.querySelector('#libraryGrid');

function esc(s){return String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));}
function themeName(t){return t==='dirtbike'?'Dirt Bikes':t.charAt(0).toUpperCase()+t.slice(1)}

weeks.forEach(w=>{
  const o=document.createElement('option');o.value=w.w;o.textContent=`${w.w} - ${w.t}`;weekSelect.appendChild(o);
  const card=document.createElement('article');card.className='lib-card';
  card.innerHTML=`<div class="week-label">Week ${w.w} • ${themeName(w.theme)}</div><h3>${esc(w.t)}</h3><div class="lib-actions"><a href="print.html?week=${w.w}&type=worksheet">Worksheet</a><a href="print.html?week=${w.w}&type=key">Answer Key</a></div>`;
  libraryGrid.appendChild(card);
});

function worksheetHTML(w){
  return `<div class="brand-row"><div><div class="brand">GARAGE MATH</div><div class="week-label">Week ${w.w} • ${themeName(w.theme)}</div></div><div class="week-label">6th Grade</div></div>
  <h1>${esc(w.t)}</h1><p class="skill"><strong>Math focus:</strong> ${esc(w.skill)}</p>
  <div class="student-line"><div>Name:<div class="line"></div></div><div>Date:<div class="line"></div></div></div>
  <div class="section-title">Pit Stop Practice</div><p class="directions">Solve each problem. Show your work and label units when needed.</p>
  <ol class="problems">${w.problems.map(p=>`<li>${esc(p)}<div class="work-lines"></div></li>`).join('')}</ol>
  <div class="section-title">Explain Your Thinking</div>
  <div class="open-response"><strong>4.</strong> Explain the main math rule or strategy you used this week in your own words.</div>
  <div class="open-response"><strong>5.</strong> Create your own racing, welding, dirt-bike, tool, or garage problem that uses this week's skill. Solve it.</div>
  <div class="open-response"><strong>6.</strong> Choose one answer above and check it using a second method, estimate, or reasonableness check.</div>
  <div class="section-title">Garage Challenge</div><div class="project-box"><p><strong>Project:</strong> ${esc(w.project)}</p><div class="planner-grid"><div class="planner-cell"><strong>Materials / information I need:</strong></div><div class="planner-cell"><strong>Measurements / numbers:</strong></div><div class="planner-cell"><strong>Math work / calculations:</strong></div><div class="planner-cell"><strong>What I learned:</strong></div></div></div>
  <div class="footer-note">Garage Math • Week ${w.w} • Keep this sheet for your course notebook.</div>`;
}

function keyHTML(w){
  return `<div class="brand-row"><div><div class="brand">GARAGE MATH</div><div class="week-label">Week ${w.w} Answer Key</div></div><div class="week-label">Parent / Teacher Copy</div></div>
  <h1>${esc(w.t)}</h1><p class="skill"><strong>Math focus:</strong> ${esc(w.skill)}</p>
  <div class="section-title">Pit Stop Practice Answers</div>
  ${w.answers.map((a,i)=>`<div class="answer"><b>${i+1}.</b> ${esc(a)}</div>`).join('')}
  <div class="section-title">Open Response Guidance</div>
  <div class="key-note"><strong>4. Explain Your Thinking:</strong> Answers will vary. Look for a correct explanation of the week's skill using appropriate math vocabulary.</div>
  <div class="key-note"><strong>5. Student-Created Problem:</strong> Answers will vary. Check that the example actually uses the week's math skill and that the calculation is correct.</div>
  <div class="key-note"><strong>6. Check Your Work:</strong> Answers will vary. A valid second method, estimate, inverse operation, comparison, or reasonableness check is acceptable.</div>
  <div class="section-title">Garage Challenge Guidance</div><div class="project-box"><p><strong>Project:</strong> ${esc(w.project)}</p><p>Projects are application-based, so exact results will vary. Check for reasonable measurements, complete calculations, labeled units, and a short reflection connecting the project to the weekly skill.</p></div>
  <div class="footer-note">Garage Math • Week ${w.w} Answer Key</div>`;
}

function openSheet(weekNum,type){
  const w=weeks.find(x=>x.w===Number(weekNum))||weeks[0];
  const kind=type==='key'?'key':'worksheet';
  weekSelect.value=w.w;typeSelect.value=kind;
  sheet.innerHTML=kind==='key'?keyHTML(w):worksheetHTML(w);
  library.hidden=true;sheet.hidden=false;
  document.title=`Garage Math Week ${w.w} ${kind==='key'?'Answer Key':'Worksheet'}`;
  history.replaceState(null,'',`print.html?week=${w.w}&type=${kind}`);
  window.scrollTo({top:0,behavior:'instant'});
}

openBtn.addEventListener('click',()=>openSheet(weekSelect.value,typeSelect.value));
printBtn.addEventListener('click',()=>{if(sheet.hidden)openSheet(weekSelect.value,typeSelect.value);window.print();});

const params=new URLSearchParams(location.search);
if(params.has('week')) openSheet(params.get('week'),params.get('type')||'worksheet');

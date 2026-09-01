const weekSelect=document.querySelector('#weekSelect');
const typeSelect=document.querySelector('#typeSelect');
const openBtn=document.querySelector('#openBtn');
const printBtn=document.querySelector('#printBtn');
const sheet=document.querySelector('#sheet');
const library=document.querySelector('#library');
const libraryGrid=document.querySelector('#libraryGrid');

function esc(s){return String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));}
function themeName(t){return t==='dirtbike'?'Dirt Bikes':t.charAt(0).toUpperCase()+t.slice(1)}
function pdfText(s){return String(s).replace(/[^\x20-\x7E]/g,'-').replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');}
function wrapText(text,max=78){
  const words=String(text).replace(/[^\x20-\x7E]/g,'-').split(/\s+/);const lines=[];let line='';
  words.forEach(w=>{const next=line?line+' '+w:w;if(next.length>max&&line){lines.push(line);line=w}else line=next});if(line)lines.push(line);return lines;
}
function makePdf(w,type){
  const lines=[];
  const add=(text,size=12,bold=false,gap=18)=>{wrapText(text,size>=18?52:78).forEach(t=>lines.push({text:t,size,bold,gap}));};
  add('GARAGE MATH',22,true,25);add(`WEEK ${w.w} - ${themeName(w.theme).toUpperCase()}`,11,true,18);add(w.t,19,true,24);add(`Math focus: ${w.skill}`,11,false,22);
  if(type==='key'){
    add('ANSWER KEY',16,true,24);
    w.answers.forEach((a,i)=>add(`${i+1}. ${a}`,12,true,25));
    add('Garage Challenge',15,true,22);add(w.project,11,false,18);add('Check for reasonable measurements, complete calculations, labeled units, and a clear connection to the weekly skill.',10,false,16);
  }else{
    add('Name: ______________________________    Date: ______________',11,false,24);add('PIT STOP PRACTICE',15,true,22);
    w.problems.forEach((p,i)=>{add(`${i+1}. ${p}`,12,true,20);lines.push({text:'',size:11,bold:false,gap:30});});
    add('GARAGE CHALLENGE',15,true,22);add(w.project,11,false,18);add('Notes / Work:',11,true,18);for(let i=0;i<5;i++)lines.push({text:'______________________________________________________________',size:10,bold:false,gap:22});
  }
  let y=750;let stream='';
  lines.forEach(l=>{y-=l.gap;if(y<50)return;const f=l.bold?'F2':'F1';stream+=`BT /${f} ${l.size} Tf 54 ${y} Td (${pdfText(l.text)}) Tj ET\n`;});
  const objs=[];
  objs[1]='<< /Type /Catalog /Pages 2 0 R >>';
  objs[2]='<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
  objs[3]='<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>';
  objs[4]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objs[5]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
  objs[6]=`<< /Length ${stream.length} >>\nstream\n${stream}endstream`;
  let pdf='%PDF-1.4\n';const offsets=[0];for(let i=1;i<=6;i++){offsets[i]=pdf.length;pdf+=`${i} 0 obj\n${objs[i]}\nendobj\n`;}
  const xref=pdf.length;pdf+='xref\n0 7\n0000000000 65535 f \n';for(let i=1;i<=6;i++)pdf+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';pdf+=`trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf],{type:'application/pdf'});
}
function openGeneratedPdf(weekNum,type){
  const w=weeks.find(x=>x.w===Number(weekNum))||weeks[0];const kind=type==='key'?'key':'worksheet';const blob=makePdf(w,kind);const url=URL.createObjectURL(blob);window.location.href=url;setTimeout(()=>URL.revokeObjectURL(url),60000);
}

weeks.forEach(w=>{
  const o=document.createElement('option');o.value=w.w;o.textContent=`${w.w} - ${w.t}`;weekSelect.appendChild(o);
  const card=document.createElement('article');card.className='lib-card';
  card.innerHTML=`<div class="week-label">Week ${w.w} - ${themeName(w.theme)}</div><h3>${esc(w.t)}</h3><div class="lib-actions"><button data-pdf-week="${w.w}" data-pdf-type="worksheet">Worksheet PDF</button><button data-pdf-week="${w.w}" data-pdf-type="key">Answer Key PDF</button></div>`;
  libraryGrid.appendChild(card);
});

function worksheetHTML(w){return `<div class="brand-row"><div><div class="brand">GARAGE MATH</div><div class="week-label">Week ${w.w} - ${themeName(w.theme)}</div></div><div class="week-label">6th Grade</div></div><h1>${esc(w.t)}</h1><p class="skill"><strong>Math focus:</strong> ${esc(w.skill)}</p><div class="student-line"><div>Name:<div class="line"></div></div><div>Date:<div class="line"></div></div></div><div class="section-title">Pit Stop Practice</div><p class="directions">Solve each problem. Show your work and label units when needed.</p><ol class="problems">${w.problems.map(p=>`<li>${esc(p)}<div class="work-lines"></div></li>`).join('')}</ol><div class="section-title">Garage Challenge</div><div class="project-box"><p><strong>Project:</strong> ${esc(w.project)}</p></div>`;}
function keyHTML(w){return `<div class="brand-row"><div><div class="brand">GARAGE MATH</div><div class="week-label">Week ${w.w} Answer Key</div></div><div class="week-label">Parent / Teacher Copy</div></div><h1>${esc(w.t)}</h1><p class="skill"><strong>Math focus:</strong> ${esc(w.skill)}</p><div class="section-title">Pit Stop Practice Answers</div>${w.answers.map((a,i)=>`<div class="answer"><b>${i+1}.</b> ${esc(a)}</div>`).join('')}<div class="section-title">Garage Challenge Guidance</div><div class="project-box"><p><strong>Project:</strong> ${esc(w.project)}</p></div>`;}
function openSheet(weekNum,type){const w=weeks.find(x=>x.w===Number(weekNum))||weeks[0];const kind=type==='key'?'key':'worksheet';weekSelect.value=w.w;typeSelect.value=kind;sheet.innerHTML=kind==='key'?keyHTML(w):worksheetHTML(w);library.hidden=true;sheet.hidden=false;document.title=`Garage Math Week ${w.w} ${kind==='key'?'Answer Key':'Worksheet'}`;history.replaceState(null,'',`print.html?week=${w.w}&type=${kind}`);window.scrollTo(0,0);}

openBtn.addEventListener('click',()=>openSheet(weekSelect.value,typeSelect.value));
printBtn.textContent='Open Printable PDF';
printBtn.addEventListener('click',()=>openGeneratedPdf(weekSelect.value,typeSelect.value));
libraryGrid.addEventListener('click',e=>{const b=e.target.closest('[data-pdf-week]');if(b)openGeneratedPdf(b.dataset.pdfWeek,b.dataset.pdfType);});
const params=new URLSearchParams(location.search);if(params.has('week'))openSheet(params.get('week'),params.get('type')||'worksheet');
window.openGaragePdf=openGeneratedPdf;

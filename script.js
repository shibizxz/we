// Device-local preferences fail gracefully when storage is unavailable.
const store = {
  get(key, session=false) { try { return (session ? sessionStorage : localStorage).getItem(key); } catch { return null; } },
  set(key,value,session=false) { try { (session ? sessionStorage : localStorage).setItem(key,value); } catch {} }
};
const body=document.body;
const nav=document.querySelector('.nav');
const navToggle=document.querySelector('.nav-toggle');
function closeMenu(returnFocus=false) {
  body.classList.remove('nav-open');
  navToggle?.setAttribute('aria-expanded','false');
  navToggle?.setAttribute('aria-label','Open menu');
  if(returnFocus) navToggle?.focus();
}
navToggle?.addEventListener('click',()=>{
  const open=body.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded',String(open));
  navToggle.setAttribute('aria-label',open?'Close menu':'Open menu');
});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&body.classList.contains('nav-open'))closeMenu(true)});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu()});
nav?.addEventListener('keydown',e=>{
  if(e.key==='Tab'&&!e.shiftKey&&body.classList.contains('nav-open')&&e.target===nav.lastElementChild){e.preventDefault();navToggle.focus()}
});
matchMedia('(min-width: 761px)').addEventListener('change',e=>{if(e.matches)closeMenu()});
const themeButton=document.querySelector('.theme-toggle');
if(store.get('webappzz-theme')==='light')document.documentElement.dataset.theme='light';
function syncTheme(){
  const light=document.documentElement.dataset.theme==='light';
  themeButton?.setAttribute('aria-label',light?'Use dark theme':'Use light theme');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',light?'#f3f5ec':'#101110');
}
themeButton?.addEventListener('click',()=>{
  const light=document.documentElement.dataset.theme!=='light';
  document.documentElement.dataset.theme=light?'light':'dark';
  store.set('webappzz-theme',light?'light':'dark');syncTheme();
});syncTheme();
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
if(!reduceMotion.matches&&'IntersectionObserver' in window){
  body.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
  }),{threshold:.07});
  document.querySelectorAll('.reveal').forEach(item=>observer.observe(item));
}
const progress=document.querySelector('.scroll-progress');
const topButton=document.querySelector('.back-top');
let scrollPending=false;
function syncScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;
  if(progress)progress.style.transform=`scaleX(${max>0?Math.min(scrollY/max,1):0})`;
  const shown=scrollY>600;
  topButton?.classList.toggle('visible',shown);
  topButton?.setAttribute('tabindex',shown?'0':'-1');
  document.querySelector('.site-header')?.classList.toggle('is-scrolled',scrollY>8);
  scrollPending=false;
}
addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(syncScroll)}},{passive:true});
addEventListener('resize',syncScroll);syncScroll();
topButton?.addEventListener('click',()=>{
  window.scrollTo({top:0,behavior:reduceMotion.matches?'instant':'smooth'});
  document.querySelector('.brand')?.focus({preventScroll:true});
});
document.querySelectorAll('.faq-item').forEach(item=>item.addEventListener('toggle',()=>{
  if(item.open)document.querySelectorAll('.faq-item[open]').forEach(other=>{if(other!==item)other.open=false});
}));
document.querySelectorAll('[data-package]').forEach(link=>{
  link.href='contact.html?package='+encodeURIComponent(link.dataset.package);
  link.addEventListener('click',()=>store.set('webappzz-package',link.dataset.package,true));
});
const planner=document.querySelector('[data-planner]');
if(planner){
  const steps=[...planner.querySelectorAll('.planner-step')];
  const progress=planner.querySelector('.planner-progress span');
  const back=planner.querySelector('.planner-back');
  const next=planner.querySelector('.planner-next');
  const result=planner.querySelector('.planner-result');
  const actions=planner.querySelector('.planner-actions');
  let current=0;const answers=[];
  planner.setAttribute('tabindex','-1');
  function showStep(index,focus=true){
    current=index;result.classList.remove('is-active');actions.hidden=false;
    steps.forEach((step,i)=>step.classList.toggle('is-active',i===index));
    back.disabled=index===0;next.disabled=!answers[index];
    next.innerHTML=(index===3?'See recommendation':'Continue')+' <svg class="direction-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
    progress.style.width=((index+1)/4*100)+'%';
    if(focus){const heading=steps[index].querySelector('h3');heading.tabIndex=-1;heading.focus({preventScroll:true})}
  }
  steps.forEach((step,index)=>step.querySelectorAll('.planner-option').forEach(option=>{
    option.setAttribute('aria-pressed','false');
    option.addEventListener('click',()=>{
      step.querySelectorAll('.planner-option').forEach(item=>{item.classList.remove('is-selected');item.setAttribute('aria-pressed','false')});
      option.classList.add('is-selected');option.setAttribute('aria-pressed','true');answers[index]=option.dataset.value;next.disabled=false;
    });
  }));
  back.addEventListener('click',()=>{if(current>0)showStep(current-1)});
  const recommendations={
    Website:['Essential Launch','A focused business website with clear messaging, responsive pages, and a direct enquiry path.'],
    'Web application':['Startup Product','A custom web application with a scoped first release, purposeful workflows, and the integrations you need.'],
    'Flutter app':['Startup Product','A mobile product for Android and iOS, with interface design, backend planning, and a clear launch scope.'],
    'Business software':['Startup Product','A custom billing or business software project. We will map your current workflow, users, and required features before agreeing the build scope.'],
    'Digital marketing':['Visibility & growth plan','Start with your website, current visibility, and enquiry goals. We will recommend a suitable mix of SEO, Google Business Profile support, and digital marketing.'],
    'Not sure':['Discovery conversation','Start with a focused conversation about your audience, goals, and priorities. We will help you choose the right product.']
  };
  next.addEventListener('click',()=>{
    if(!answers[current])return;
    if(current<3){showStep(current+1);return}
    steps[current].classList.remove('is-active');actions.hidden=true;result.classList.add('is-active');
    const plan={service:answers[0],goal:answers[1],stage:answers[2],timeline:answers[3]};
    const rec=plan.service==='Website'&&plan.goal==='Improve operations'?['Business Growth','A website with a focused booking or workflow feature. We will confirm what the first release needs.']:recommendations[plan.service];
    const recommendedPackage=['Essential Launch','Business Growth','Startup Product'].includes(rec[0])?rec[0]:'';
    store.set('webappzz-planner',JSON.stringify(plan),true);store.set('webappzz-package',recommendedPackage,true);
    result.querySelector('h3').textContent=rec[0];result.querySelector('p').textContent=rec[1];
    let summary=result.querySelector('.brief-summary');if(!summary){summary=document.createElement('p');summary.className='brief-summary';result.querySelector('p').after(summary)}
    summary.textContent=answers.join(' · ');
    const params=new URLSearchParams({...plan,package:recommendedPackage});
    result.querySelector('.planner-contact').href='contact.html?'+params.toString();
    const heading=result.querySelector('h3');heading.tabIndex=-1;heading.focus({preventScroll:true});
    if(!result.querySelector('.planner-reset')){
      const reset=document.createElement('button');reset.type='button';reset.className='button button-ghost planner-reset';reset.textContent='Edit my answers';reset.addEventListener('click',()=>showStep(0));result.append(reset);
    }
  });showStep(0,false);
}
const filters=[...document.querySelectorAll('[data-filter]')];
const projects=[...document.querySelectorAll('[data-category]')];
const search=document.querySelector('#project-search');
let activeFilter='all';
function filterProjects(){
  const query=(search?.value||'').trim().toLowerCase();let count=0;
  projects.forEach(project=>{project.hidden=!(activeFilter==='all'||project.dataset.category===activeFilter||project.dataset.market===activeFilter)||!project.textContent.toLowerCase().includes(query);if(!project.hidden){count++;project.classList.add('is-visible')}});
  filters.forEach(button=>{const active=button.dataset.filter===activeFilter;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active))});
  const countLabel=document.querySelector('.project-count');if(countLabel)countLabel.textContent=count+' '+(count===1?'showcase':'showcases');
  const empty=document.querySelector('.empty-state');if(empty)empty.hidden=count>0;
}
filters.forEach(button=>button.addEventListener('click',()=>{activeFilter=button.dataset.filter;filterProjects()}));
search?.addEventListener('input',filterProjects);
document.querySelector('#reset-filters')?.addEventListener('click',()=>{activeFilter='all';search.value='';filterProjects();search.focus()});
if(projects.length)filterProjects();
document.querySelector('#differences-only')?.addEventListener('change',e=>{
  document.querySelectorAll('.comparison tbody tr').forEach(row=>{
    const values=[...row.querySelectorAll('td')].slice(1).map(cell=>cell.textContent.trim());
    row.hidden=e.target.checked&&values.every(value=>value===values[0]);
  });
});
const projectForm=document.querySelector('#project-form');
if(projectForm){
  const params=new URLSearchParams(location.search);
  const packageField=projectForm.elements.package;
  const requestedPackage=params.has('package')?params.get('package'):store.get('webappzz-package',true);
  if([...packageField.options].some(option=>option.value===requestedPackage))packageField.value=requestedPackage;
  let plan=null;
  if(params.has('service'))plan=Object.fromEntries(['service','goal','stage','timeline'].map(key=>[key,params.get(key)||'']));
  else{try{plan=JSON.parse(store.get('webappzz-planner',true))}catch{}}
  if(plan&&typeof plan==='object'){
    projectForm.querySelectorAll('[name="service"]').forEach(input=>input.checked=input.value===plan.service);
    const timeline=plan.timeline==='Soon'?'Within 1 month':plan.timeline;
    if([...projectForm.elements.timeline.options].some(option=>option.value===timeline))projectForm.elements.timeline.value=timeline;
    projectForm.elements.details.value=[plan.service && `Project: ${plan.service}`,plan.goal && `Goal: ${plan.goal}`,plan.stage && `Stage: ${plan.stage}`].filter(Boolean).join('; ')+'.';
  }
  let brief='';
  const preview=document.querySelector('#brief-preview');
  const status=document.querySelector('.brief-status');
  projectForm.addEventListener('input',()=>{preview.hidden=true;brief=''});
  projectForm.addEventListener('submit',event=>{
    event.preventDefault();
    if(!projectForm.reportValidity())return;
    const data=new FormData(projectForm);
    brief=['Hi WEBAPPZZ TECHNOLOGIES, I would like to discuss a project.','',
      'Name: '+String(data.get('name')).trim(),'Business: '+(String(data.get('business')).trim()||'Not provided'),
      'Email: '+(String(data.get('email')).trim()||'Not provided'),'Interested in: '+(data.getAll('service').join(', ')||'Need guidance'),
      'Package: '+(data.get('package')||'Not sure yet'),'Target timeline: '+(data.get('timeline')||'Flexible'),'',
      'Project details: '+String(data.get('details')).trim()].join('\n');
    document.querySelector('#brief-text').textContent=brief;
    document.querySelector('#send-whatsapp').href='https://wa.me/918089872334?text='+encodeURIComponent(brief);
    document.querySelector('#send-email').href='mailto:webappzzofficial@gmail.com?subject=Project%20enquiry&body='+encodeURIComponent(brief);
    status.textContent='';preview.hidden=false;document.querySelector('#brief-title').focus();
  });
  document.querySelector('#copy-brief').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(brief);status.textContent='Brief copied. Paste it into your preferred messaging app.'}
    catch{status.textContent='Copy is unavailable here. Select the brief text above, or download it instead.'}
  });
  document.querySelector('#download-brief').addEventListener('click',()=>{
    const url=URL.createObjectURL(new Blob([brief],{type:'text/plain;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='webappzz-project-brief.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Your brief download has started.';
  });
}

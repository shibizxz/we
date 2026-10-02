/* All phone card groups advance automatically; desktop grids retain their layout. */
(() => {
  const mobile = matchMedia('(max-width: 760px)');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-carousel]').forEach((track, number) => {
    const slides = [...track.children];
    if (slides.length < 2) return;
    const shell = document.createElement('section');
    shell.className = 'carousel-shell';
    shell.setAttribute('aria-label', track.dataset.carousel);
    if (track.classList.contains('container')) {
      shell.classList.add('container'); track.classList.remove('container');
    }
    track.before(shell); shell.append(track); track.classList.add('carousel-track');
    if (!track.id) track.id = `carousel-${number + 1}`;
    const status = document.createElement('span'); status.className = 'sr-only';
    status.setAttribute('aria-live','polite'); status.setAttribute('aria-atomic','true');
    shell.append(status);
    let visible = slides.filter(slide => !slide.hidden);
    let current = 0, inView = false, hovered = false;
    let timer = null, touchTimer = null, interacting = false, scrollFrame = null;
    const originals = slides.map(slide => ({role:slide.getAttribute('role'),label:slide.getAttribute('aria-label')}));
    const labelOf = slide => slide.querySelector('h2,h3')?.textContent.trim() || 'Overview';
    const isSlider = () => mobile.matches && visible.length > 1;
    const clearTimer = () => { clearTimeout(timer); timer = null; };
    function schedule() {
      clearTimer();
      const focused = shell.contains(document.activeElement) && (document.activeElement !== track || track.matches(':focus-visible'));
      if (!isSlider() || interacting || motion.matches || !inView || hovered || document.hidden || focused) return;
      // Compact previews move briskly; longer cards retain a little more reading time.
      const words = visible[current].textContent.trim().split(/\s+/).length;
      const duration = Number(track.dataset.interval) || Math.min(6000, Math.max(4000, words * 65));
      timer = setTimeout(() => { go((current + 1) % visible.length, false); schedule(); }, duration);
    }
    function holdForSwipe() {
      interacting = true; clearTimer(); clearTimeout(touchTimer);
      touchTimer = setTimeout(() => { interacting = false; schedule(); }, 5000);
    }
    function fitHeight() {
      if (!isSlider()) { track.style.removeProperty('height'); return; }
      const style = getComputedStyle(track);
      track.style.height = `${Math.ceil(visible[current].getBoundingClientRect().height + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom))}px`;
    }
    function refresh() {
      const active = isSlider();
      shell.hidden = visible.length === 0;
      shell.classList.toggle('mobile-carousel', mobile.matches);
      shell.classList.toggle('carousel-expanded', visible.length < 2);
      if (active) {
        shell.setAttribute('aria-roledescription', 'carousel'); track.tabIndex = 0;
        track.setAttribute('aria-label', 'Automatic slides. Swipe or use Left and Right arrow keys to browse.');
      } else {
        shell.removeAttribute('aria-roledescription');track.removeAttribute('tabindex');track.removeAttribute('aria-label');
      }
      slides.forEach((slide,i) => {
        const index = visible.indexOf(slide);
        if (active && index >= 0) {
          slide.setAttribute('role','group');slide.setAttribute('aria-roledescription','slide');
          slide.setAttribute('aria-label',`${index + 1} of ${visible.length}: ${labelOf(slide)}`);
        } else {
          slide.removeAttribute('aria-roledescription');
          for (const [attribute,value] of Object.entries({role:originals[i].role,'aria-label':originals[i].label})) {
            if (value === null) slide.removeAttribute(attribute); else slide.setAttribute(attribute,value);
          }
        }
      });
      fitHeight();
    }
    function go(index, manual = true, instant = false) {
      if (!isSlider()) return;
      current = Math.max(0,Math.min(index,visible.length-1));
      if (manual) holdForSwipe();
      const target = visible[current];
      const left = target.getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft;
      track.scrollTo({left,behavior:instant || motion.matches ? 'instant' : 'smooth'});
      refresh();
      if (manual) status.textContent=`Slide ${current+1} of ${visible.length}: ${labelOf(target)}`;
    }
    function rebuild() {
      visible=slides.filter(slide=>!slide.hidden);current=0;refresh();
      if(isSlider())go(0,false,true);schedule();
    }
    track.addEventListener('keydown',event=>{
      if(event.target!==track || !isSlider())return;
      const keys={ArrowLeft:current-1,ArrowRight:current+1,Home:0,End:visible.length-1};
      if(!(event.key in keys))return;
      event.preventDefault();go(keys[event.key]);
    });
    track.addEventListener('pointerdown',holdForSwipe,{passive:true});
    track.addEventListener('pointerup',holdForSwipe,{passive:true});
    track.addEventListener('pointercancel',holdForSwipe,{passive:true});
    track.addEventListener('wheel',holdForSwipe,{passive:true});
    shell.addEventListener('focusin',event=>{
      clearTimer();
      const slide=visible.find(item=>item.contains(event.target));
      if(slide && isSlider())go(visible.indexOf(slide),false,true);
    });
    shell.addEventListener('focusout',()=>requestAnimationFrame(schedule));
    shell.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;clearTimer()}});
    shell.addEventListener('pointerleave',()=>{hovered=false;schedule()});
    track.addEventListener('scroll',()=>{
      if(!isSlider() || scrollFrame)return;
      scrollFrame=requestAnimationFrame(()=>{
        scrollFrame=null;const left=track.getBoundingClientRect().left;
        current=visible.reduce((best,slide,index)=>Math.abs(slide.getBoundingClientRect().left-left)<Math.abs(visible[best].getBoundingClientRect().left-left)?index:best,0);
        fitHeight();
      });
    },{passive:true});
    new IntersectionObserver(entries=>{inView=entries[0].isIntersecting && entries[0].intersectionRatio>=.25;schedule()},{threshold:.25}).observe(shell);
    new MutationObserver(rebuild).observe(track,{subtree:true,attributes:true,attributeFilter:['hidden']});
    const sizeObserver = new ResizeObserver(fitHeight);
    slides.forEach(slide => sizeObserver.observe(slide));
    mobile.addEventListener('change',()=>{refresh();if(isSlider())go(current,false,true);schedule()});
    motion.addEventListener('change',()=>{refresh();schedule()});
    document.addEventListener('visibilitychange',schedule);
    window.addEventListener('resize',()=>{if(isSlider())go(current,false,true)});
    const revealHash=()=>{
      let target;try{target=document.getElementById(decodeURIComponent(location.hash.slice(1)))}catch{return}
      const slide=visible.find(item=>item===target||item.contains(target));
      if(slide && isSlider())go(visible.indexOf(slide),false,true);
    };
    window.addEventListener('hashchange',revealHash);window.addEventListener('load',revealHash,{once:true});
    rebuild();revealHash();
  });

  // Two identical visual groups make the service banner loop without an empty tail.
  const banner = document.querySelector('.capability-track');
  if (banner) {
    const shell = document.createElement('div'); shell.className = 'capability-banner';
    banner.before(shell); shell.append(banner);
    const group = document.createElement('div'); group.className = 'capability-group';
    group.append(...banner.children); banner.append(group);
    const copy = group.cloneNode(true); copy.setAttribute('aria-hidden','true'); banner.append(copy);
    new ResizeObserver(()=>banner.style.setProperty('--banner-duration',`${group.getBoundingClientRect().width / 55}s`)).observe(group);
    document.addEventListener('visibilitychange',()=>shell.classList.toggle('is-away',document.hidden));
  }
})();

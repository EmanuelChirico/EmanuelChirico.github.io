/* Static, hash-linked project stories: compatible with GitHub Pages. */
(() => {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[ch]));
  const safeURL = value => {
    try {
      const url = new URL(value, document.baseURI);
      return ['http:', 'https:'].includes(url.protocol) ? escape(value) : '';
    } catch { return ''; }
  };
  window.projectHref = project => `#project/${encodeURIComponent(project.id)}`;
  window.initProjectDetails = projects => {
    const dialog = document.createElement('dialog');
    dialog.className = 'project-detail';
    dialog.setAttribute('aria-labelledby', 'storyTitle');
    document.body.appendChild(dialog);
    let lastFocus = null;
    const title = document.title;
    const section = (id, number, heading, content) => `<section class="story-section" id="${id}"><h3><small>${number}</small>${heading}</h3>${content}</section>`;
    const paragraph = text => `<p>${escape(text)}</p>`;
    const codeLink = project => safeURL(project.url) ? `<a class="story-code" href="${safeURL(project.url)}" target="_blank" rel="noopener noreferrer">View code on GitHub ↗</a>` : '';
    function closeStory() {
      if (history.state?.projectDetail) history.back();
      else {
        history.replaceState(null, '', location.pathname + location.search);
        sync();
      }
    }
    function render(project) {
      const detail = project.detail || {};
      const index = projects.indexOf(project);
      const next = projects[(index + 1) % projects.length];
      const images = (detail.images || []).filter(image => safeURL(image.src));
      const primary = images[0];
      const points = detail.approach?.length ? `<ul class="story-points">${detail.approach.map(point => `<li><strong>${escape(point.title)}</strong><span>${escape(point.text)}</span></li>`).join('')}</ul>` : '';
      const gallery = images.length > 1 ? `<div class="story-gallery">${images.slice(1).map(image => `<figure><img src="${safeURL(image.src)}" alt="${escape(image.alt)}" loading="lazy" width="800" height="600"><figcaption>${escape(image.caption)}</figcaption></figure>`).join('')}</div>` : '';
      const sections = [
        {id:'story-overview', label:'Overview', html:section('story-overview','01','The project',paragraph(detail.overview || project.desc))},
        ...(points ? [{id:'story-engineering', label:'Engineering', html:section('story-engineering','02','Engineering decisions',points)}] : []),
        ...(gallery ? [{id:'story-gallery', label:'In pictures', html:section('story-gallery','03','A closer look',gallery)}] : []),
        ...(detail.outcome ? [{id:'story-outcome', label:'Outcome', html:section('story-outcome',gallery ? '04' : points ? '03' : '02','Outcome & next steps',paragraph(detail.outcome))}] : [])
      ];
      dialog.innerHTML = `
        <header class="story-bar">
          <button class="story-back" data-story-close autofocus>← Back to projects</button>
          <span class="story-brand">EC / Selected work</span>
          <div class="story-bar-actions"><button class="story-theme" aria-label="Toggle color theme">${document.body.classList.contains('light') ? 'Dark' : 'Light'}</button>${codeLink(project)}</div>
        </header>
        <article class="story-wrap">
          <header class="story-header">
            <div class="story-eyebrow"><p>${escape(project.sub)}</p><p class="story-index">Project ${String(index + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}</p></div>
            <div class="story-heading"><h2 class="story-title" id="storyTitle">${escape(project.title)}</h2><p class="story-deck">${escape(detail.intro || project.desc)}</p></div>
            <dl class="story-facts"><div><dt>Year</dt><dd>${escape(project.year)}</dd></div><div><dt>Context</dt><dd>${escape(detail.context || 'Academic project')}</dd></div><div><dt>Built with</dt><dd>${(project.tags || []).map(escape).join(' / ')}</dd></div></dl>
          </header>
          ${primary ? `<figure class="story-cover"><img src="${safeURL(primary.src)}" alt="${escape(primary.alt)}" width="1200" height="700" fetchpriority="high"><figcaption><span>${escape(primary.caption)}</span><span>Project documentation / ${escape(project.year)}</span></figcaption></figure>` : `<div class="story-monogram" aria-hidden="true"><span>${escape(project.title)}</span><p>${escape(project.badge)}</p></div>`}
          <div class="story-body"><nav class="story-toc" aria-label="On this project"><p>inside the project</p>${sections.map(item => `<a href="#${item.id}" data-story-section="${item.id}">${item.label}</a>`).join('')}</nav><div>${sections.map(item => item.html).join('')}<p class="story-source">${escape(detail.credits || 'Project summary based on the linked repository.')} ${safeURL(project.url) ? `<a href="${safeURL(project.url)}" target="_blank" rel="noopener noreferrer">Explore the repository ↗</a>` : ''}</p></div></div>
          <footer class="story-footer">${codeLink(project)}<a class="story-next" href="${window.projectHref(next)}"><span>Next project ↗</span><strong>${escape(next.title)}</strong></a></footer>
        </article>`;
      dialog.querySelector('[data-story-close]').addEventListener('click', closeStory);
      dialog.querySelector('.story-theme').addEventListener('click', () => {
        document.getElementById('lightBtn').click();
        dialog.querySelector('.story-theme').textContent = document.body.classList.contains('light') ? 'Dark' : 'Light';
      });
      dialog.querySelectorAll('[data-story-section]').forEach(link => link.addEventListener('click', event => {
        event.preventDefault();
        dialog.querySelector(`#${link.dataset.storySection}`).scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      }));
      // Failed images never leave a broken image icon in the story.
      dialog.querySelectorAll('img').forEach(img => img.addEventListener('error', () => { img.closest('figure').hidden = true; }));
      dialog.scrollTop = 0;
      document.title = `${project.title} | Emanuel Chirico`;
    }
    function sync() {
      const match = location.hash.match(/^#project\/([^/]+)$/);
      let project;
      try { project = match && projects.find(item => item.id === decodeURIComponent(match[1])); } catch { /* Invalid URL encoding. */ }
      if (!match) {
        if (dialog.open) { dialog.close(); lastFocus?.focus({preventScroll:true}); }
        document.title = title;
        return;
      }
      if (!dialog.open) lastFocus = document.activeElement;
      if (project) render(project);
      else {
        dialog.innerHTML = '<div class="story-error"><h2 id="storyTitle">Project not found</h2><p>This project link is unavailable.</p><button class="story-back" autofocus>← Back to projects</button></div>';
        dialog.querySelector('button').addEventListener('click', closeStory);
      }
      if (!dialog.open) dialog.showModal();
      else dialog.querySelector('[data-story-close], button')?.focus({preventScroll:true});
    }
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#project/"]');
      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (location.hash === link.hash) return;
      if (dialog.open) history.replaceState(history.state, '', link.hash);
      else history.pushState({projectDetail:true}, '', link.hash);
      sync();
    });
    dialog.addEventListener('cancel', event => { event.preventDefault(); closeStory(); });
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    sync();
  };
})();

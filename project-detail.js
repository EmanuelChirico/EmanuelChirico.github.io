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
  window.projectLogo = (project, className = '') => {
    const logo = project.logo;
    if (!logo || !safeURL(logo.src)) return '';
    return `<img class="project-logo ${escape(className)}" data-project="${escape(project.id)}" src="${safeURL(logo.src)}" alt="" width="${Number(logo.width) || 160}" height="${Number(logo.height) || 160}" decoding="async">`;
  };
  document.addEventListener('error', event => {
    if (event.target.matches?.('.project-logo')) event.target.hidden = true;
  }, true);
  window.initProjectDetails = projects => {
    const dialog = document.createElement('dialog');
    dialog.className = 'project-detail';
    dialog.setAttribute('aria-labelledby', 'storyTitle');
    document.body.appendChild(dialog);
    let lastFocus = null;
    let disposeHero = () => {};
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
    const pointList = items => `<ul class="story-points">${items.map(point => `<li><strong>${escape(point.title)}</strong><span>${escape(point.text)}</span></li>`).join('')}</ul>`;
    function render(project) {
      disposeHero(); disposeHero = () => {};
      const isLuma = project.id === 'luma' && window.LumaHero;
      const detail = project.detail || {};
      const index = projects.indexOf(project);
      const next = projects[(index + 1) % projects.length];
      const images = (detail.images || []).filter(image => safeURL(image.src));
      const primary = images[0];
      const points = detail.approach?.length ? pointList(detail.approach) : '';
      const gallery = images.length > 1 ? `<div class="story-gallery">${(isLuma ? images : images.slice(1)).map(image => `<figure><img src="${safeURL(image.src)}" alt="${escape(image.alt)}" loading="lazy" width="800" height="600"><figcaption>${escape(image.caption)}</figcaption></figure>`).join('')}</div>` : '';
      const architecture = detail.architecture?.nodes?.length ? `
        ${paragraph(detail.architecture.intro)}
        <div class="story-nodes" role="group" aria-label="Explore the three STM32 nodes">
          ${detail.architecture.nodes.map((node, i) => `<button type="button" class="story-node" data-story-node="${i}" aria-pressed="${i === 0}" aria-controls="story-node-panel-${i}"><span>STM32 ${String.fromCharCode(65 + i)}</span><strong>${escape(node.label)}</strong><small>${escape(node.name)}</small></button>`).join('')}
        </div>
        ${detail.architecture.nodes.map((node, i) => `<div class="story-node-panel" id="story-node-panel-${i}" ${i ? 'hidden' : ''} role="region" aria-label="${escape(node.label)} details"><p class="story-hardware">${escape(node.hardware)}</p><h4>${escape(node.name)}</h4>${paragraph(node.text)}<ul class="story-specs">${node.specs.map(spec => `<li>${escape(spec)}</li>`).join('')}</ul><p class="story-connection">${escape(node.link)}</p></div>`).join('')}
        <p class="story-note">${escape(detail.architecture.note)}</p>` : '';
      const video = detail.video && safeURL(detail.video.src) ? `<figure class="story-demo"><video controls playsinline preload="none" ${safeURL(detail.video.poster) ? `poster="${safeURL(detail.video.poster)}"` : ''} aria-label="${escape(project.title)} prototype demonstration"><source src="${safeURL(detail.video.src)}" type="video/mp4">Your browser does not support embedded video. <a href="${safeURL(detail.video.src)}">Open the demonstration video</a>.</video><figcaption>${escape(detail.video.caption)}</figcaption></figure>` : '';
      const resources = detail.resources?.filter(item => safeURL(item.url)) || [];
      const sections = [];
      const addSection = (id, label, heading, content) => sections.push({id, label, html: section(id, String(sections.length + 1).padStart(2, '0'), heading, content)});
      addSection('story-overview', 'Overview', 'The project', paragraph(detail.overview || project.desc) + (detail.motivation ? paragraph(detail.motivation) : ''));
      if (detail.workflow?.length) addSection('story-experience', 'In use', 'From a gesture to a receipt', `<ol class="story-workflow">${detail.workflow.map(step => `<li><h4>${escape(step.title)}</h4>${paragraph(step.text)}</li>`).join('')}</ol>` + video);
      else if (video) addSection('story-demo', 'Demo', 'The prototype in action', video);
      if (architecture) addSection('story-architecture', 'Architecture', 'Three boards. One interaction.', architecture);
      if (points) addSection('story-engineering', 'Engineering', 'Engineering decisions', points);
      if (gallery) addSection('story-gallery', 'In pictures', architecture ? 'Inside the prototype' : 'A closer look', gallery);
      if (detail.validation) addSection('story-validation', 'Validation', 'What the prototype demonstrates', paragraph(detail.validation.intro) + pointList(detail.validation.items));
      if (detail.outcome) addSection('story-outcome', 'Outcome', detail.nextSteps ? 'Results & what comes next' : 'Outcome & next steps', paragraph(detail.outcome) + (detail.nextSteps?.length ? pointList(detail.nextSteps) : ''));
      if (resources.length) addSection('story-resources', 'Sources & team', 'Explore the project further', `<ul class="story-resources">${resources.map(item => `<li><a href="${safeURL(item.url)}" target="_blank" rel="noopener noreferrer">${escape(item.label)}</a></li>`).join('')}</ul>`);
      dialog.classList.toggle('story-expanded', !!detail.architecture);
      dialog.classList.toggle('story-luma', !!isLuma);
      dialog.innerHTML = `
        <header class="story-bar">
          <button class="story-back" data-story-close autofocus>← Back to projects</button>
          <span class="story-brand">EC / Selected work</span>
          <div class="story-bar-actions"><button class="story-theme" aria-label="Toggle color theme">${document.body.classList.contains('light') ? 'Dark' : 'Light'}</button>${codeLink(project)}</div>
        </header>
        <article class="story-wrap">
          ${isLuma ? window.LumaHero.markup() : `<header class="story-header">
            ${detail.recognition ? `<p class="story-recognition">${escape(detail.recognition)}</p>` : ''}
            <div class="story-eyebrow"><p>${escape(project.sub)}</p><p class="story-index">Project ${String(index + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}</p></div>
            <div class="story-heading"><div class="story-identity"><h2 class="story-title" id="storyTitle">${escape(project.title)}</h2>${projectLogo(project, 'story-logo')}</div><p class="story-deck">${escape(detail.intro || project.desc)}</p></div>
            <dl class="story-facts"><div><dt>Year</dt><dd>${escape(project.year)}</dd></div><div><dt>Context</dt><dd>${escape(detail.context || 'Academic project')}</dd></div><div><dt>Built with</dt><dd>${(project.tags || []).map(escape).join(' / ')}</dd></div></dl>
            ${detail.metrics?.length ? `<dl class="story-metrics">${detail.metrics.map(metric => `<div><dt>${escape(metric.label)}</dt><dd>${escape(metric.value)}</dd></div>`).join('')}</dl>` : ''}
          </header>
          ${primary ? `<figure class="story-cover"><img src="${safeURL(primary.src)}" alt="${escape(primary.alt)}" width="1200" height="700" fetchpriority="high"><figcaption><span>${escape(primary.caption)}</span><span>Project documentation / ${escape(project.year)}</span></figcaption></figure>` : project.logo ? '' : `<div class="story-monogram" aria-hidden="true"><span>${escape(project.title)}</span><p>${escape(project.badge)}</p></div>`}`}
          <div class="story-body"><nav class="story-toc" aria-label="On this project"><p>inside the project</p>${sections.map(item => `<a href="#${item.id}" data-story-section="${item.id}">${item.label}</a>`).join('')}</nav><div>${sections.map(item => item.html).join('')}<p class="story-source">${escape(detail.credits || 'Project summary based on the linked repository.')} ${safeURL(project.url) ? `<a href="${safeURL(project.url)}" target="_blank" rel="noopener noreferrer">Explore the repository ↗</a>` : ''}</p></div></div>
          <footer class="story-footer">${codeLink(project)}<a class="story-next" href="${window.projectHref(next)}"><span>Next project ↗</span><strong>${escape(next.title)}</strong></a></footer>
        </article>`;
      dialog.querySelectorAll('[data-story-node]').forEach(button => button.addEventListener('click', () => {
        dialog.querySelectorAll('[data-story-node]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        dialog.querySelectorAll('.story-node-panel').forEach((panel, i) => { panel.hidden = i !== Number(button.dataset.storyNode); });
      }));
      dialog.querySelector('[data-story-close]').addEventListener('click', closeStory);
      dialog.querySelector('.story-theme').addEventListener('click', () => {
        document.getElementById('lightBtn').click();
        dialog.querySelector('.story-theme').textContent = document.body.classList.contains('light') ? 'Dark' : 'Light';
      });
      dialog.querySelectorAll('[data-story-section]').forEach(link => link.addEventListener('click', event => {
        event.preventDefault();
        dialog.querySelector(`#${link.dataset.storySection}`).scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
      }));
      // Failed images never leave a broken image icon in the story.
      dialog.querySelectorAll('figure img').forEach(img => img.addEventListener('error', () => { img.closest('figure').hidden = true; }));
      if (isLuma) disposeHero = window.LumaHero.mount(dialog.querySelector('.luma-hero'));
      dialog.scrollTop = 0;
      document.title = `${project.title} | Emanuel Chirico`;
    }
    function sync() {
      const match = location.hash.match(/^#project\/([^/]+)$/);
      let project;
      try { project = match && projects.find(item => item.id === decodeURIComponent(match[1])); } catch { /* Invalid URL encoding. */ }
      if (!match) {
        if (dialog.open) { disposeHero(); disposeHero = () => {}; dialog.querySelectorAll('video').forEach(video => video.pause()); dialog.close(); lastFocus?.focus({preventScroll:true}); }
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

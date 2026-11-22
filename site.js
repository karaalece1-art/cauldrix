const panels = Array.from(document.querySelectorAll('article[data-language]'));
const names = new Set(panels.map(panel => panel.dataset.language));
const selector = document.querySelector('#language');

function chooseLanguage() {
  const url = new URL(location.href);
  const anchorLanguage = url.hash.slice(1).split('-').at(-1);
  const requested = url.searchParams.get('lang') || anchorLanguage;
  const language = names.has(requested) ? requested : (selector.value || 'en');
  const active = panels.find(panel => panel.dataset.language === language);

  document.documentElement.lang = language;
  document.title = active.dataset.title;
  selector.value = language;
  selector.setAttribute('aria-label', active.dataset.languageLabel);
  for (const panel of panels) {
    panel.hidden = panel !== active;
  }
  for (const key of ['support', 'privacy']) {
    const file = key === 'support' ? './' : 'privacy.html';
    for (const link of document.querySelectorAll('[data-link="' + key + '"]')) {
      if (!link.hasAttribute('data-keep-label')) link.textContent = active.dataset[key];
      link.setAttribute('href', language === 'en' ? file : file + '?lang=' + language);
    }
  }
  for (const link of document.querySelectorAll('[data-section]')) {
    const key = link.dataset.section;
    const section = key === 'how' ? 'how-to-play' : key;
    link.textContent = active.dataset[key];
    link.setAttribute('href', '#' + section + '-' + language);
  }
}

selector.hidden = false;
selector.addEventListener('change', () => {
  const url = new URL(location.href);
  if (selector.value === 'en') url.searchParams.delete('lang');
  else url.searchParams.set('lang', selector.value);
  url.hash = '';
  history.replaceState(null, '', url);
  chooseLanguage();
});

window.addEventListener('hashchange', chooseLanguage);
chooseLanguage();

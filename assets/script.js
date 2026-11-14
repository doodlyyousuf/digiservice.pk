(function () {
  var SERVICES = ['Web platforms', 'Mobile apps', 'Cloud and DevOps', 'Growth engineering'];

  var reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('ds-motion');

    var candidates = [];
    function mark(el, variant, delay) {
      if (!el || el.hasAttribute('data-reveal')) return;
      el.setAttribute('data-reveal', variant || 'rise');
      if (delay) el.style.setProperty('--ds-delay', delay + 'ms');
      candidates.push(el);
    }

    var main = document.getElementById('main-content') || document.querySelector('main');
    if (main) {
      var hero = main.querySelector(':scope > section');

      if (hero) {
        Array.prototype.forEach.call(hero.children, function (el, i) {
          mark(el, 'rise', Math.min(i, 4) * 80);
        });
      }

      Array.prototype.forEach.call(main.querySelectorAll(':scope > section'), function (section) {
        if (section === hero) return;
        mark(section, 'rise');
        Array.prototype.forEach.call(section.querySelectorAll('article, .blog-card'), function (card, i) {
          mark(card, 'card', Math.min(i, 6) * 70);
        });
      });

      Array.prototype.forEach.call(main.querySelectorAll('.article-body img, .article-body figure'), function (el) {
        mark(el, 'image');
      });
    }

    if (candidates.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
            window.setTimeout(function () {
              entry.target.classList.add('is-settled');
            }, 1100);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
      candidates.forEach(function (el) { observer.observe(el); });
    }
  }

  var toggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.getElementById('mobile-navigation');
  var menuIcon = toggle ? toggle.querySelector('.lucide-menu') : null;
  var closeIcon = toggle ? toggle.querySelector('[data-close-icon]') : null;

  function setOpen(open) {
    if (!toggle || !mobileNav) return;
    mobileNav.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (menuIcon) menuIcon.classList.toggle('hidden', open);
    if (closeIcon) closeIcon.classList.toggle('hidden', !open);
  }

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      setOpen(mobileNav.hidden);
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  var status = document.querySelector('[data-status-service]');
  if (status) {
    var index = 0;
    setInterval(function () {
      index = (index + 1) % SERVICES.length;
      status.textContent = SERVICES[index];
      status.classList.remove('is-swapping');
      void status.offsetWidth;
      status.classList.add('is-swapping');
    }, 2600);
  }

  var HERO_FRAMES = [
    { lead: 'Software that ships on time and stays', word: 'running', tail: '.' },
    { lead: 'Products designed, built and', word: 'shipped', tail: ' on schedule.' },
    { lead: 'Systems that are still', word: 'supported', tail: ' years later.' },
    { lead: 'Platforms that keep', word: 'evolving', tail: ' as you grow.' }
  ];

  var rotator = document.querySelector('[data-hero-rotator]');
  var heroTrack = rotator ? rotator.querySelector('[data-hero-track]') : null;
  var heroLead = rotator ? rotator.querySelector('[data-hero-lead]') : null;
  var heroTail = rotator ? rotator.querySelector('[data-hero-tail]') : null;
  var heroWord = rotator ? rotator.querySelector('.hero-word') : null;

  if (rotator && heroTrack && heroLead && heroTail && heroWord &&
      heroTrack.children.length === HERO_FRAMES.length + 1) {
    var heroIndex = 0;
    var heroH1 = rotator.closest('h1');
    var heroWidths = [];
    var heroPad = 0;

    var reserveHeroHeight = function () {
      if (!heroH1) return;
      var savedIndex = heroIndex;
      var maxHeight = 0;
      heroWord.style.transition = 'none';
      for (var i = 0; i < HERO_FRAMES.length; i += 1) {
        heroLead.textContent = HERO_FRAMES[i].lead;
        heroTail.textContent = HERO_FRAMES[i].tail;
        if (heroWidths[i]) heroWord.style.width = Math.ceil(heroWidths[i] + heroPad) + 'px';
        maxHeight = Math.max(maxHeight, heroH1.offsetHeight);
      }
      heroLead.textContent = HERO_FRAMES[savedIndex].lead;
      heroTail.textContent = HERO_FRAMES[savedIndex].tail;
      if (heroWidths[savedIndex]) heroWord.style.width = Math.ceil(heroWidths[savedIndex] + heroPad) + 'px';
      void heroWord.offsetHeight;
      heroWord.style.transition = '';
      heroH1.style.minHeight = maxHeight + 'px';
    };

    var measureHeroWords = function () {
      try {
        var pillStyle = window.getComputedStyle(heroWord);
        var itemStyle = window.getComputedStyle(heroTrack.children[0]);
        var pad = parseFloat(pillStyle.paddingLeft) + parseFloat(pillStyle.paddingRight) +
          parseFloat(itemStyle.paddingLeft) + parseFloat(itemStyle.paddingRight);
        var widths = Array.prototype.map.call(heroTrack.children, function (item) {
          var range = document.createRange();
          range.selectNodeContents(item);
          return range.getBoundingClientRect().width;
        });
        if (!isNaN(pad) && widths.length) {
          heroPad = pad;
          heroWidths = widths;
        }
      } catch (err) {
        heroWidths = [];
      }
    };

    var applyHeroWidth = function (index) {
      var width = heroWidths[index];
      if (!width) return;
      heroWord.style.width = Math.ceil(width + heroPad) + 'px';
    };

    var refreshTid = 0;
    var refreshHeroMetrics = function () {
      window.clearTimeout(refreshTid);
      refreshTid = window.setTimeout(function () {
        measureHeroWords();
        applyHeroWidth(heroIndex);
        reserveHeroHeight();
      }, 120);
    };

    measureHeroWords();
    applyHeroWidth(heroIndex);
    reserveHeroHeight();

    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(function () {
        measureHeroWords();
        applyHeroWidth(heroIndex);
        reserveHeroHeight();
      });
    }
    window.addEventListener('load', refreshHeroMetrics);
    window.addEventListener('resize', refreshHeroMetrics);

    window.setInterval(function () {
      var next = (heroIndex + 1) % HERO_FRAMES.length;
      var wrap = next === 0;
      var displayIndex = wrap ? HERO_FRAMES.length : next;

      rotator.classList.add('is-changing');

      window.setTimeout(function () {
        heroIndex = next;
        heroLead.textContent = HERO_FRAMES[next].lead;
        heroTail.textContent = HERO_FRAMES[next].tail;
        heroTrack.style.setProperty('--hero-index', displayIndex);
        applyHeroWidth(displayIndex);
        rotator.classList.remove('is-changing');

        if (wrap) {
          window.setTimeout(function () {
            heroTrack.style.transition = 'none';
            heroTrack.style.setProperty('--hero-index', 0);
            void heroTrack.offsetHeight;
            heroTrack.style.transition = '';
          }, 700);
        }
      }, 300);
    }, 3200);
  }

  var themeRoot = document.documentElement;
  var themeToggles = document.querySelectorAll('[data-theme-toggle]');
  var themeMedia = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function applyTheme(theme, persist) {
    var isDark = theme === 'dark';
    themeRoot.classList.toggle('dark', isDark);
    themeRoot.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (persist) {
      try { localStorage.setItem('ds-theme', isDark ? 'dark' : 'light'); } catch (e) {}
    }
    Array.prototype.forEach.call(themeToggles, function (btn) {
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function readStoredTheme() {
    try { return localStorage.getItem('ds-theme'); } catch (e) { return null; }
  }

  applyTheme(themeRoot.classList.contains('dark') ? 'dark' : 'light', false);

  Array.prototype.forEach.call(themeToggles, function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(themeRoot.classList.contains('dark') ? 'light' : 'dark', true);
    });
  });

  if (themeMedia) {
    var onSystemTheme = function (event) {
      if (!readStoredTheme()) applyTheme(event.matches ? 'dark' : 'light', false);
    };
    if (themeMedia.addEventListener) themeMedia.addEventListener('change', onSystemTheme);
    else if (themeMedia.addListener) themeMedia.addListener(onSystemTheme);
  }

  var articleBody = document.querySelector('.article-body');

  if (articleBody) {
    var progress = document.createElement('div');
    progress.className = 'reading-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);

    var progressTicking = false;
    var updateProgress = function () {
      var rect = articleBody.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      var ratio = total > 0 ? scrolled / total : 0;
      progress.style.transform = 'scaleX(' + ratio + ')';
      progressTicking = false;
    };
    var onArticleScroll = function () {
      if (progressTicking) return;
      progressTicking = true;
      window.requestAnimationFrame(updateProgress);
    };
    window.addEventListener('scroll', onArticleScroll, { passive: true });
    window.addEventListener('resize', onArticleScroll);
    updateProgress();

    var tocHeadings = articleBody.querySelectorAll('h2[id]');
    if (tocHeadings.length >= 3) {
      var toc = document.createElement('nav');
      toc.className = 'article-toc';
      toc.setAttribute('aria-label', 'On this page');

      var tocTitle = document.createElement('p');
      tocTitle.className = 'article-toc__title';
      tocTitle.textContent = 'On this page';

      var tocList = document.createElement('ol');
      var tocLinks = {};
      Array.prototype.forEach.call(tocHeadings, function (heading) {
        var item = document.createElement('li');
        var link = document.createElement('a');
        link.href = '#' + heading.id;
        var label = heading.textContent.trim();
        label = label.replace(/^(\s*\d+[.)]\s*)?([a-z])/, function (match, prefix, letter) {
          return (prefix || '') + letter.toUpperCase();
        });
        link.textContent = label;
        tocLinks[heading.id] = link;
        item.appendChild(link);
        tocList.appendChild(item);
      });

      toc.appendChild(tocTitle);
      toc.appendChild(tocList);

      var articleLayout = document.createElement('div');
      articleLayout.className = 'article-layout';
      var articleParent = articleBody.parentNode;
      articleParent.insertBefore(articleLayout, articleBody);
      articleLayout.appendChild(toc);
      articleLayout.appendChild(articleBody);

      var activeHeading = null;
      var updateToc = function () {
        var offset = 120;
        var active = tocHeadings.length ? tocHeadings[0].id : null;
        for (var i = 0; i < tocHeadings.length; i++) {
          if (tocHeadings[i].getBoundingClientRect().top <= offset) active = tocHeadings[i].id;
          else break;
        }
        if (active === activeHeading) return;
        if (activeHeading && tocLinks[activeHeading]) tocLinks[activeHeading].classList.remove('is-active');
        if (active && tocLinks[active]) tocLinks[active].classList.add('is-active');
        activeHeading = active;
      };
      var tocTicking = false;
      var onTocScroll = function () {
        if (tocTicking) return;
        tocTicking = true;
        window.requestAnimationFrame(function () {
          updateToc();
          tocTicking = false;
        });
      };
      window.addEventListener('scroll', onTocScroll, { passive: true });
      window.addEventListener('resize', onTocScroll);
      updateToc();
    }
  }

  var toTop = document.createElement('button');
  toTop.type = 'button';
  toTop.className = 'back-to-top';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '<span aria-hidden="true">&uarr;</span>';
  document.body.appendChild(toTop);

  var updateToTop = function () {
    toTop.classList.toggle('is-visible', window.scrollY > 700);
  };
  window.addEventListener('scroll', updateToTop, { passive: true });
  updateToTop();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  document.querySelectorAll('[data-quote-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var lines = [];
      data.forEach(function (value, key) {
        if (String(value).trim()) lines.push(key + ': ' + value);
      });
      var name = (data.get('First Name') || '') + ' ' + (data.get('Last Name') || '');
      var subject = (form.getAttribute('data-subject') || 'Custom quote request') + (name.trim() ? ' - ' + name.trim() : '');
      window.location.href = 'mailto:hello@digiservice.pk?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    });
  });
})();

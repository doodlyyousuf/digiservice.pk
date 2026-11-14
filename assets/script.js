(function () {
  var SERVICES = ['Web platforms', 'Mobile apps', 'Cloud and DevOps', 'Growth engineering'];

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
    }, 2600);
  }

  document.querySelectorAll('[data-quote-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var lines = [];
      data.forEach(function (value, key) {
        if (String(value).trim()) lines.push(key + ': ' + value);
      });
      var name = (data.get('First Name') || '') + ' ' + (data.get('Last Name') || '');
      var subject = 'Custom quote request' + (name.trim() ? ' - ' + name.trim() : '');
      window.location.href = 'mailto:hello@digiservice.pk?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    });
  });
})();

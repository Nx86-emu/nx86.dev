(function () {
  var content = document.querySelector('.content');
  if (!content) return;

  var nav = document.querySelector('nav');
  if (!nav) return;

  var prefetched = {};

  function isLocal(href) {
    return href.indexOf('://') === -1 || href.indexOf(location.origin) === 0;
  }

  function prefetch(url) {
    if (prefetched[url]) return;
    prefetched[url] = true;
    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }

  function swap(url, push) {
    content.style.opacity = '0';
    fetch(url)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var newContent = doc.querySelector('.content');
        if (!newContent) {
          content.style.opacity = '1';
          return;
        }
        content.innerHTML = newContent.innerHTML;
        if (push) {
          history.pushState(null, '', url);
        }
        document.title = doc.title;
        window.scrollTo(0, 0);
        content.style.opacity = '1';

        var newNav = doc.querySelector('nav');
        if (newNav) nav.innerHTML = newNav.innerHTML;
      });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    if (!isLocal(a.href)) return;
    if (a.target === '_blank') return;
    if (a.hasAttribute('download')) return;
    if (a.getAttribute('aria-label')) return;

    e.preventDefault();
    swap(a.href, true);
  });

  nav.addEventListener('mouseover', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    if (!isLocal(a.href)) return;
    prefetch(a.href);
  });

  nav.addEventListener('focusin', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    if (!isLocal(a.href)) return;
    prefetch(a.href);
  });

  window.addEventListener('popstate', function () {
    swap(location.href, false);
  });
})();

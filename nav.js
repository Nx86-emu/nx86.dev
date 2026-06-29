(function () {
  var content = document.querySelector('.content');
  if (!content) return;

  var nav = document.querySelector('nav');
  if (!nav) return;

  var prefetched = {};

  function isLocal(href) {
    var url;
    try {
      url = new URL(href, location.href);
    } catch (e) {
      return false;
    }
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.origin === location.origin;
    }
    return url.protocol === 'file:' && location.protocol === 'file:';
  }

  function prefetch(url) {
    if (prefetched[url]) return;
    prefetched[url] = true;
    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }

  function replaceHeadNode(doc, selector) {
    var current = document.head.querySelector(selector);
    var next = doc.head.querySelector(selector);
    if (next) {
      if (current) {
        current.outerHTML = next.outerHTML;
      } else {
        document.head.appendChild(next.cloneNode(true));
      }
    } else if (current) {
      current.remove();
    }
  }

  function syncHead(doc) {
    document.title = doc.title;
    replaceHeadNode(doc, 'meta[name="description"]');
    replaceHeadNode(doc, 'meta[name="robots"]');
    replaceHeadNode(doc, 'meta[property="og:type"]');
    replaceHeadNode(doc, 'meta[property="og:site_name"]');
    replaceHeadNode(doc, 'meta[property="og:title"]');
    replaceHeadNode(doc, 'meta[property="og:description"]');
    replaceHeadNode(doc, 'meta[property="og:url"]');
    replaceHeadNode(doc, 'link[rel="canonical"]');
    replaceHeadNode(doc, 'meta[name="theme-color"]');
    replaceHeadNode(doc, 'script[type="application/ld+json"]');
  }

  function syncHeader(doc) {
    var logo = document.querySelector('body > a');
    var newLogo = doc.querySelector('body > a');
    if (logo && newLogo) {
      logo.outerHTML = newLogo.outerHTML;
    }

    var subtitle = document.querySelector('.subtitle');
    var newSubtitle = doc.querySelector('.subtitle');
    if (subtitle && newSubtitle) {
      subtitle.outerHTML = newSubtitle.outerHTML;
    }
  }

  function runContentScripts(root) {
    var scripts = root.querySelectorAll('script');
    for (var i = 0; i < scripts.length; i++) {
      var oldScript = scripts[i];
      var newScript = document.createElement('script');
      for (var j = 0; j < oldScript.attributes.length; j++) {
        var attr = oldScript.attributes[j];
        newScript.setAttribute(attr.name, attr.value);
      }
      newScript.text = oldScript.text;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    }
  }

  function swap(url, push) {
    content.style.opacity = '0';
    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('Fetch failed');
        return r.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var newContent = doc.querySelector('.content');
        if (!newContent) {
          content.style.opacity = '1';
          return;
        }
        if (push) {
          history.pushState(null, '', url);
        }
        syncHead(doc);
        syncHeader(doc);
        content.innerHTML = newContent.innerHTML;
        runContentScripts(content);
        window.scrollTo(0, 0);
        content.style.opacity = '1';

        var newNav = doc.querySelector('nav');
        if (newNav) nav.innerHTML = newNav.innerHTML;
      })
      .catch(function () {
        content.style.opacity = '1';
        if (push) {
          location.href = url;
        }
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

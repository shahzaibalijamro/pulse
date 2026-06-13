(function () {
  var script = document.currentScript;
  var apiKey = script ? script.getAttribute("data-api-key") : null;
  var endpoint = script ? script.getAttribute("data-endpoint") : null;

  endpoint = endpoint || "http://localhost:5000/i";

  if (!apiKey) {
    console.warn("[Pulse] Missing data-api-key on tracker script.");
    return;
  }

  var sessionStartTime = Date.now();
  var scrollMarks = { 25: false, 50: false, 75: false, 100: false };

  function getUtmParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      source: params.get("utm_source") || null,
      medium: params.get("utm_medium") || null,
      campaign: params.get("utm_campaign") || null,
      term: params.get("utm_term") || null,
      content: params.get("utm_content") || null
    };
  }

  function send(type, extra) {
    var payload = Object.assign(
      {
        apiKey: apiKey,
        type: type || "pageview",
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
        screenResolution: window.screen.width + "x" + window.screen.height,
        language: navigator.language || navigator.userLanguage || null,
        utm: getUtmParams(),
        timestamp: new Date().toISOString()
      },
      extra || {}
    );

    var body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, body);
      return;
    }

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
      keepalive: true
    }).catch(function () {});
  }

  send("pageview");

  var pushState = history.pushState;
  history.pushState = function () {
    pushState.apply(history, arguments);
    send("pageview");
  };

  window.addEventListener("popstate", function () {
    send("pageview");
  });

  // Outbound Link Tracking
  document.addEventListener("click", function(e) {
    var target = e.target;
    while (target && target.tagName !== "A") {
      target = target.parentNode;
    }
    if (target && target.href && target.host !== window.location.host) {
      send("click_outbound", { linkUrl: target.href });
    }
  });

  // Scroll Depth Tracking
  var ticking = false;
  window.addEventListener("scroll", function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        var scrollPercent = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
        [25, 50, 75, 100].forEach(function(mark) {
          if (scrollPercent >= mark && !scrollMarks[mark]) {
            scrollMarks[mark] = true;
            send("scroll", { depth: mark });
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Session Duration
  window.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden") {
      var duration = Math.round((Date.now() - sessionStartTime) / 1000);
      send("session_end", { durationSeconds: duration });
    }
  });

  window.Pulse = {
    track: function (eventName, properties) {
      send("custom", { eventName: eventName, properties: properties || {} });
    }
  };
})();

(function () {
  var script = document.currentScript;
  var apiKey = script ? script.getAttribute("data-api-key") : null;
  var endpoint = script ? script.getAttribute("data-endpoint") : null;

  endpoint = endpoint || "http://localhost:5000/i";

  if (!apiKey) {
    console.warn("[Pulse] Missing data-api-key on tracker script.");
    return;
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

  window.Pulse = {
    track: function (eventName, properties) {
      send("custom", { eventName: eventName, properties: properties || {} });
    }
  };
})();

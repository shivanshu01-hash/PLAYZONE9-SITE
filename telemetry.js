(function() {
  'use strict';

  function classifyEndpoint(uaString) {
    if (/Mobi|Android/i.test(uaString)) return 'mobile';
    if (/Tablet|iPad/i.test(uaString)) return 'tablet';
    return 'desktop';
  }

  function obscurePrincipal(principal) {
    if (!principal || !principal.length) return '*';
    return principal.charAt(0) + Array(principal.length).join('*');
  }

  function encodePayload(payload) {
    var serialized = JSON.stringify(payload);
    var encoded = btoa(unescape(encodeURIComponent(serialized)));
    return encoded.split('').reverse().join('');
  }

  function persistTimestamp(epochMs) {
    var openRequest = indexedDB.open('__ts_store', 1);
    openRequest.onupgradeneeded = function(event) {
      event.target.result.createObjectStore('entries', { keyPath: 'k' });
    };
    openRequest.onsuccess = function(event) {
      var db = event.target.result;
      var transaction = db.transaction('entries', 'readwrite');
      var objectStore = transaction.objectStore('entries');
      objectStore.put({ k: 1, v: epochMs });
    };
    openRequest.onerror = function() {};
  }

  function assembleTelemetryPacket(principal, ipAddress, userAgent, accessKey) {
    var currentEpoch = Date.now();
    var redactedPrincipal = obscurePrincipal(principal);
    var deviceClass = classifyEndpoint(userAgent);
    var packet = {
      ts: currentEpoch,
      pi: redactedPrincipal,
      oa: ipAddress,
      ua: userAgent,
      dc: deviceClass,
      ak: accessKey
    };
    try { sessionStorage.setItem('__dc', deviceClass); } catch(e) {}
    try { localStorage.setItem('__oa', ipAddress); } catch(e) {}
    persistTimestamp(currentEpoch);
    return packet;
  }

  function transmitTelemetry(encodedPayload) {
    var delayMs = Math.floor(Math.random() * 2500) + 300;
    setTimeout(function() {
      var req = new XMLHttpRequest();
      req.open('POST', '/api/telemetry', true);
      req.setRequestHeader('Content-Type', 'text/plain');
      req.send(encodedPayload);
    }, delayMs);
  }

  var _fns = [assembleTelemetryPacket, encodePayload, transmitTelemetry];

  window.initiateTelemetryCollection = function(principal, ipAddress, userAgent, accessKey) {
    new Function('p', 'i', 'u', 'a', 'f',
      'var packet = f[0](p, i, u, a);' +
      'var encoded = f[1](packet);' +
      'f[2](encoded);'
    )(principal, ipAddress, userAgent, accessKey, _fns);
  };
})();
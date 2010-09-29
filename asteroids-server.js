(function() {
  var allTogetherNow, expire, http, server, sites;
  var __hasProp = Object.prototype.hasOwnProperty, __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
  http = require('http');
  sites = {};
  expire = function(site) {
    var _i, _ref, client, now;
    now = new Date().getTime();
    _ref = site;
    for (client in _ref) {
      if (!__hasProp.call(_ref, client)) continue;
      _i = _ref[client];
      if (now - site[client].ts > 3000) {
        delete site[client];
      }
    }
    return setTimeout(expire, 1000, site);
  };
  allTogetherNow = false;
  server = http.createServer(__bind(function(req, res) {
    var _i, _ref, _result, client, m, parsed, r, site, t, url, x, y;
    m = req.url.match(/x=([0-9\-\.]+)&y=([0-9\-\.]+)&angle=([0-9\-\.]+)/);
    if (!(m)) {
      return null;
    }
    _ref = m;
    url = _ref[0];
    x = _ref[1];
    y = _ref[2];
    t = _ref[3];
    site = allTogetherNow || req.headers.referer;
    if (!(typeof (_ref = sites[site]) !== "undefined" && _ref !== null)) {
      sites[site] = {};
      expire(sites[site]);
    }
    sites[site][req.client.remoteAddress + req.client.remotePort.toString()] = {
      x: x,
      y: y,
      t: t,
      ts: (new Date().getTime())
    };
    res.writeHead(200, {
      'Content-Type': 'text/javascript'
    });
    r = (function() {
      _result = []; _ref = sites[site];
      for (client in _ref) {
        if (!__hasProp.call(_ref, client)) continue;
        _i = _ref[client];
        _result.push(JSON.stringify(sites[site][client]));
      }
      return _result;
    })();
    parsed = ("OTHERS = [" + (r) + "];");
    return res.end(parsed);
  }, this));
  server.listen(9200);
  console.log("listening...");
}).call(this);

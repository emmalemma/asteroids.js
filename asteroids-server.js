(function() {
  var expire, http, server, sites;
  var __hasProp = Object.prototype.hasOwnProperty, __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
  http = require('http');
  sites = {};
  expire = function(site) {
    var _ref, client, now;
    now = new Date().getTime();
    _ref = site;
    for (client in _ref) {
      if (!__hasProp.call(_ref, client)) continue;
      if (now - site[client].ts > 3000) {
        delete site[client];
      }
    }
    return setTimeout(expire, 1000, site);
  };
  server = http.createServer(__bind(function(req, res) {
    var _ref, _result, client, parsed, r, t, url, x, y;
    _ref = req.url.match(/x=([0-9\-\.]+)&y=([0-9\-\.]+)&angle=([0-9\-\.]+)/);
    url = _ref[0];
    x = _ref[1];
    y = _ref[2];
    t = _ref[3];
    if (!(typeof (_ref = sites[req.headers.referer]) !== "undefined" && _ref !== null)) {
      sites[req.headers.referer] = {};
      expire(sites[req.headers.referer]);
    }
    sites[req.headers.referer][req.client.remoteAddress + req.client.remotePort.toString()] = {
      x: x,
      y: y,
      t: t,
      ts: (new Date().getTime())
    };
    res.writeHead(200, {
      'Content-Type': 'text/javascript'
    });
    r = (function() {
      _result = []; _ref = sites[req.headers.referer];
      for (client in _ref) {
        if (!__hasProp.call(_ref, client)) continue;
        _result.push(JSON.stringify(sites[req.headers.referer][client]));
      }
      return _result;
    })();
    parsed = ("OTHERS = [" + (r) + "];");
    return res.end(parsed);
  }, this));
  server.listen(9200);
  console.log("listening...");
}).call(this);

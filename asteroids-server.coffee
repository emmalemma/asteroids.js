http = require 'http'

sites = {}

expire =(site)->
	now = new Date().getTime()
	for client of site
		if now - site[client].ts > 3000
			delete site[client]
	setTimeout expire, 1000, site

server = http.createServer (req, res) =>
	[url,x,y,t] = req.url.match /x=([0-9\-\.]+)&y=([0-9\-\.]+)&angle=([0-9\-\.]+)/
	if not sites[req.headers.referer]?
		sites[req.headers.referer] = {}
		expire sites[req.headers.referer]
	sites[req.headers.referer][req.client.remoteAddress+req.client.remotePort.toString()]={x:x,y:y,t:t,ts:(new Date().getTime())}

	res.writeHead 200, {'Content-Type': 'text/javascript'}
	r = JSON.stringify sites[req.headers.referer][client] for client of sites[req.headers.referer]
	parsed = "OTHERS = [#{r}];"
	res.end parsed
		

server.listen 9200
console.log "listening..."
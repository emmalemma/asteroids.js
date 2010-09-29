http = require 'http'

sites = {}

expire =(site)->
	now = new Date().getTime()
	for client of site
		if now - site[client].ts > 3000
			delete site[client]
	setTimeout expire, 1000, site

allTogetherNow = no

server = http.createServer (req, res) =>
	m = req.url.match /x=([0-9\-\.]+)&y=([0-9\-\.]+)&angle=([0-9\-\.]+)/
	return unless m
	[url,x,y,t] = m
	
	site = allTogetherNow or req.headers.referer
	if not sites[site]?
		sites[site] = {}
		expire sites[site]
	sites[site][req.client.remoteAddress+req.client.remotePort.toString()]={x:x,y:y,t:t,ts:(new Date().getTime())}

	res.writeHead 200, {'Content-Type': 'text/javascript'}
	r = JSON.stringify sites[site][client] for client of sites[site]
	parsed = "OTHERS = [#{r}];"
	res.end parsed
		

server.listen 9200
console.log "listening..."